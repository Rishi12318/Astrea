from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.config import get_settings
from backend.database.base import Base
from backend.services.catalog_service import CatalogService

settings = get_settings()
engine = create_engine(settings.database_url, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def init_db() -> None:
    from backend.models import feedback, recommendation, user  # noqa: F401

    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        CatalogService().seed_catalog(db)
    finally:
        db.close()
