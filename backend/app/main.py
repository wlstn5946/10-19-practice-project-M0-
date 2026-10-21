import sqlite3
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.db import init_db
from app.routers import records


@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db()
    yield


app = FastAPI(title="task-flow API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(records.router)


@app.exception_handler(RequestValidationError)
async def validation_error(_: Request, exc: RequestValidationError):
    detail = [
        {"field": ".".join(str(p) for p in e["loc"][1:]), "message": e["msg"]}
        for e in exc.errors()
    ]
    return JSONResponse(status_code=422, content={"detail": detail})


@app.exception_handler(sqlite3.Error)
async def sqlite_error(_: Request, exc: sqlite3.Error):
    return JSONResponse(
        status_code=500, content={"detail": "저장 중 오류가 발생했습니다."}
    )


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
