import pytest
from fastapi.testclient import TestClient

from backend.database.base import Base
from backend.database.session import SessionLocal, engine
from backend.main import app


@pytest.fixture(scope="session", autouse=True)
def setup_database() -> None:
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def client() -> TestClient:
    return TestClient(app)
