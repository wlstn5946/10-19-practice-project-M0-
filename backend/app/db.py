import os
import sqlite3
from collections.abc import Iterator
from pathlib import Path

DEFAULT_DB_PATH = Path(__file__).resolve().parent.parent / "budget.db"

SCHEMA = """
CREATE TABLE IF NOT EXISTS records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    settlement INTEGER NOT NULL,
    budget INTEGER,
    feedback TEXT,
    month INTEGER NOT NULL
)
"""


def db_path() -> str:
    return os.environ.get("BUDGET_DB", str(DEFAULT_DB_PATH))


def init_db() -> None:
    conn = sqlite3.connect(db_path())
    try:
        conn.execute(SCHEMA)
        conn.commit()
    finally:
        conn.close()


def get_conn() -> Iterator[sqlite3.Connection]:
    # 요청 하나당 연결 하나. 의존성과 엔드포인트가 다른 스레드에서 돌 수 있다.
    conn = sqlite3.connect(db_path(), check_same_thread=False)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()
