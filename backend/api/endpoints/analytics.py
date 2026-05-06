from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from backend.auth.dependencies import get_current_user_token
from backend.database.deps import get_db
from backend.models.feedback import UserFeedback
from backend.models.recommendation import ProductCatalog, RecommendationHistory
from backend.models.user import User

router = APIRouter(tags=["analytics"])


@router.get("/admin/analytics")
def get_dashboard_analytics(token: str = Depends(get_current_user_token), db: Session = Depends(get_db)) -> dict:
    user_count = db.scalar(select(func.count()).select_from(User)) or 0
    product_count = db.scalar(select(func.count()).select_from(ProductCatalog)) or 0
    history_count = db.scalar(select(func.count()).select_from(RecommendationHistory)) or 0
    feedback_count = db.scalar(select(func.count()).select_from(UserFeedback)) or 0
    return {
        "users": user_count,
        "products": product_count,
        "recommendation_history": history_count,
        "feedback": feedback_count,
        "model_confidence": 0.91,
        "top_categories": ["foundation", "lipstick", "blush"],
    }
