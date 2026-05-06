def recommend_products(payload: RecommendationRequest, token: str = Depends(get_current_user_token)) -> RecommendationResponse:
def save_history(payload: HistoryCreate, token: str = Depends(get_current_user_token)) -> dict:
def user_feedback(payload: FeedbackCreate, token: str = Depends(get_current_user_token)) -> dict:
def chatbot(payload: dict, token: str = Depends(get_current_user_token)) -> dict:
from fastapi import APIRouter

from backend.api.endpoints import analysis_router, analytics_router, assistant_router, auth_router, history_router, recommendation_router

api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(analysis_router)
api_router.include_router(recommendation_router)
api_router.include_router(history_router)
api_router.include_router(assistant_router)
api_router.include_router(analytics_router)
