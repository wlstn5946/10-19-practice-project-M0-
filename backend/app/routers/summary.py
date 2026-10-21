import sqlite3

from fastapi import APIRouter, Depends, Query

from app.db import get_conn
from app.schemas import SummaryOut

router = APIRouter(prefix="/api/summary", tags=["summary"])

# SUM 은 기록이 없으면 NULL 이고, 예산이 빈 기록은 건너뛴다.
SUM_SQL = "SELECT SUM(settlement) AS settlement_total, SUM(budget) AS budget_total FROM records"


@router.get("/monthly", response_model=SummaryOut)
def monthly_summary(
    month: int = Query(ge=1, le=12),
    conn: sqlite3.Connection = Depends(get_conn),
):
    row = conn.execute(SUM_SQL + " WHERE month = ?", (month,)).fetchone()
    return dict(row)


@router.get("/total", response_model=SummaryOut)
def total_summary(conn: sqlite3.Connection = Depends(get_conn)):
    return dict(conn.execute(SUM_SQL).fetchone())
