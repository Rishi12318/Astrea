from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.auth.dependencies import get_current_user_token
from backend.database.deps import get_db
from backend.schemas.recommendation import RecommendationRequest, RecommendationResponse
from backend.services.recommendation_service import RecommendationService

router = APIRouter(tags=["recommendations"])
recommendation_service = RecommendationService()


@router.post("/recommend-products", response_model=RecommendationResponse)
def recommend_products(payload: RecommendationRequest, token: str = Depends(get_current_user_token), db: Session = Depends(get_db)) -> RecommendationResponse:
    return recommendation_service.recommend(db, payload.model_dump())
