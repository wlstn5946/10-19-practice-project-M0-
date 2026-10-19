from fastapi import FastAPI

app = FastAPI(title="task-flow API")


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
