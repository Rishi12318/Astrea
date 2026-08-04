from fastapi import APIRouter

from backend.api.endpoints import analysis_router, analytics_router, assistant_router, auth_router, history_router, recommendation_router

api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(analysis_router)
api_router.include_router(recommendation_router)
api_router.include_router(history_router)
api_router.include_router(assistant_router)
api_router.include_router(analytics_router)
