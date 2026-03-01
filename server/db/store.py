"""Simple SQLite store for saved sessions and vehicle profiles."""

import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).parent / "xaw_store.db"


def init_db(path: Path = DB_PATH):
    conn = sqlite3.connect(path)
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            data BLOB
        )
        """)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS vehicle_profiles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            vin TEXT UNIQUE,
            data BLOB
        )
        """)
    conn.commit()
    conn.close()


if __name__ == "__main__":
    init_db()
