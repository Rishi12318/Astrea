import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.database.base import Base
from backend.database.deps import get_db
from backend.main import app

SQLALCHEMY_TEST_URL = "sqlite:///:memory:"

engine_test = create_engine(
    SQLALCHEMY_TEST_URL,
    connect_args={"check_same_thread": False},
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine_test)


@pytest.fixture(scope="session", autouse=True)
def setup_database():
    from backend.models import feedback, recommendation, user  # noqa: F401
    Base.metadata.create_all(bind=engine_test)
    # Seed catalog for recommendation tests
    db = TestingSessionLocal()
    try:
        from backend.services.catalog_service import CatalogService
        CatalogService().seed_catalog(db)
    finally:
        db.close()
    yield
    Base.metadata.drop_all(bind=engine_test)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture()
def client() -> TestClient:
    return TestClient(app)

