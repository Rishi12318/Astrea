from collections.abc import Generator
from typing import Any

from backend.database.session import SessionLocal


def get_db() -> Generator[Any, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
