from contextlib import asynccontextmanager

from fastapi.exceptions import RequestValidationError
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.requests import Request
from fastapi.responses import JSONResponse

from backend.api.routes import api_router
from backend.config import get_settings
from backend.database.session import init_db, SessionLocal
from backend.utils.logger import configure_logging

settings = get_settings()
configure_logging()


@asynccontextmanager
async def lifespan(application: FastAPI):
    """Startup: init DB tables and seed catalog."""
    init_db()
    db = SessionLocal()
    try:
        from backend.services.catalog_service import CatalogService
        CatalogService().seed_catalog(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="AI-Powered Personalized Makeup Recommendation System",
    version="2.0.0",
    description=(
        "Production-ready beauty-tech API: face analysis, skin tone detection, "
        "DB-backed product catalog, cosine-similarity recommendations, and "
        "RAG-grounded beauty chat (Anthropic Claude / Ollama)."
    ),
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.exception_handler(ValueError)
async def value_error_handler(_: Request, exc: ValueError) -> JSONResponse:
    return JSONResponse(status_code=400, content={"detail": str(exc)})


@app.exception_handler(RequestValidationError)
async def validation_error_handler(_: Request, exc: RequestValidationError) -> JSONResponse:
    return JSONResponse(status_code=422, content={"detail": exc.errors()})


@app.exception_handler(Exception)
async def unhandled_error_handler(_: Request, _exc: Exception) -> JSONResponse:
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})


@app.get("/")
def root() -> dict[str, str]:
    return {
        "service": settings.app_name,
        "status": "running",
        "docs": "/docs",
        "version": "2.0.0",
    }

