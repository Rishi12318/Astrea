import json
import logging
from pathlib import Path
import sys

# Ensure backend directory is in the path
sys.path.append(str(Path(__file__).resolve().parent.parent))

from backend.database.session import SessionLocal
from backend.services.catalog_service import CatalogService

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def seed_db():
    db = SessionLocal()
    try:
        CatalogService().seed_catalog(db)
        logger.info("Successfully seeded database from script.")
    except Exception as e:
        logger.error(f"Error seeding database: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_db()
