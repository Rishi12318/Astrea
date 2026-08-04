from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from backend.auth.dependencies import get_current_user_token
from backend.database.deps import get_db
from backend.models.feedback import UserFeedback
from backend.models.recommendation import Product, RecommendationHistory
from backend.models.user import User

router = APIRouter(tags=["analytics"])


@router.get("/admin/analytics")
def get_dashboard_analytics(token: str = Depends(get_current_user_token), db: Session = Depends(get_db)) -> dict:
    user_count = db.scalar(select(func.count()).select_from(User)) or 0
    product_count = db.scalar(select(func.count()).select_from(Product)) or 0
    history_count = db.scalar(select(func.count()).select_from(RecommendationHistory)) or 0
    feedback_count = db.scalar(select(func.count()).select_from(UserFeedback)) or 0

    # Derive top categories from the actual product catalog
    rows = db.execute(
        select(Product.category, func.count(Product.id).label("cnt"))
        .group_by(Product.category)
        .order_by(func.count(Product.id).desc())
        .limit(3)
    ).all()
    top_categories = [r.category for r in rows] or ["foundation", "lipstick", "blush"]

    # Average model confidence from recommendation history
    avg_confidence = db.scalar(
        select(func.avg(RecommendationHistory.model_confidence.cast(float)))
    ) or 0.0

    return {
        "users": user_count,
        "products": product_count,
        "recommendation_history": history_count,
        "feedback": feedback_count,
        "model_confidence": round(float(avg_confidence), 3),
        "top_categories": top_categories,
    }

