from backend.api.endpoints.analysis import router as analysis_router
from backend.api.endpoints.analytics import router as analytics_router
from backend.api.endpoints.assistant import router as assistant_router
from backend.api.endpoints.auth import router as auth_router
from backend.api.endpoints.history import router as history_router
from backend.api.endpoints.recommendations import router as recommendation_router

__all__ = [
    "analysis_router",
    "analytics_router",
    "assistant_router",
    "auth_router",
    "history_router",
    "recommendation_router",
]
