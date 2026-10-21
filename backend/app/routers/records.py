import sqlite3

from fastapi import APIRouter, Depends, HTTPException, Query, Response

from app.db import get_conn
from app.schemas import RecordIn, RecordOut

router = APIRouter(prefix="/api/records", tags=["records"])

COLUMNS = "id, name, settlement, budget, feedback, month"


def _get(conn: sqlite3.Connection, record_id: int) -> dict:
    row = conn.execute(
        f"SELECT {COLUMNS} FROM records WHERE id = ?", (record_id,)
    ).fetchone()
    if row is None:
        raise HTTPException(status_code=404, detail="기록이 없습니다.")
    return dict(row)


@router.post("", response_model=RecordOut, status_code=201)
def create_record(body: RecordIn, conn: sqlite3.Connection = Depends(get_conn)):
    try:
        cur = conn.execute(
            "INSERT INTO records (name, settlement, budget, feedback, month)"
            " VALUES (?, ?, ?, ?, ?)",
            (body.name, body.settlement, body.budget, body.feedback, body.month),
        )
        conn.commit()
    except sqlite3.Error:
        conn.rollback()
        raise
    return _get(conn, cur.lastrowid)


@router.get("", response_model=list[RecordOut])
def list_records(
    month: int | None = Query(default=None, ge=1, le=12),
    conn: sqlite3.Connection = Depends(get_conn),
):
    sql = f"SELECT {COLUMNS} FROM records"
    params: tuple = ()
    if month is not None:
        sql += " WHERE month = ?"
        params = (month,)
    rows = conn.execute(sql + " ORDER BY id DESC", params).fetchall()
    return [dict(r) for r in rows]


@router.put("/{record_id}", response_model=RecordOut)
def update_record(
    record_id: int, body: RecordIn, conn: sqlite3.Connection = Depends(get_conn)
):
    _get(conn, record_id)
    try:
        conn.execute(
            "UPDATE records SET name = ?, settlement = ?, budget = ?,"
            " feedback = ?, month = ? WHERE id = ?",
            (body.name, body.settlement, body.budget, body.feedback, body.month, record_id),
        )
        conn.commit()
    except sqlite3.Error:
        conn.rollback()
        raise
    return _get(conn, record_id)


@router.delete("/{record_id}", status_code=204)
def delete_record(record_id: int, conn: sqlite3.Connection = Depends(get_conn)):
    _get(conn, record_id)
    try:
        conn.execute("DELETE FROM records WHERE id = ?", (record_id,))
        conn.commit()
    except sqlite3.Error:
        conn.rollback()
        raise
    return Response(status_code=204)
