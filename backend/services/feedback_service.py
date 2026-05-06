from sqlalchemy.orm import Session

from backend.models.feedback import UserFeedback


class FeedbackService:
    def save(self, db: Session, payload: dict) -> UserFeedback:
        record = UserFeedback(
            user_id=payload["user_id"],
            product_id=payload.get("product_id"),
            score=payload["score"],
            comment=payload.get("comment"),
        )
        db.add(record)
        db.commit()
        db.refresh(record)
        return record
