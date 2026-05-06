from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.auth.dependencies import get_current_user_token
from backend.database.deps import get_db
from backend.schemas.feedback import FeedbackCreate
from backend.schemas.history import HistoryCreate
from backend.services.feedback_service import FeedbackService
from backend.services.history_service import HistoryService

router = APIRouter(tags=["history"])
history_service = HistoryService()
feedback_service = FeedbackService()


@router.post("/save-history")
def save_history(payload: HistoryCreate, token: str = Depends(get_current_user_token), db: Session = Depends(get_db)) -> dict:
    record = history_service.save(db, payload.model_dump())
    return {"history_id": record.id, "status": "saved"}


@router.post("/user-feedback")
def user_feedback(payload: FeedbackCreate, token: str = Depends(get_current_user_token), db: Session = Depends(get_db)) -> dict:
    record = feedback_service.save(db, payload.model_dump())
    return {"feedback_id": record.id, "message": "feedback received", "score": payload.score}
