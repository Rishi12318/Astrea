import json

from sqlalchemy.orm import Session

from backend.models.recommendation import RecommendationHistory


class HistoryService:
    def save(self, db: Session, payload: dict) -> RecommendationHistory:
        record = RecommendationHistory(
            user_id=payload["user_id"],
            request_payload=json.dumps(payload["request_payload"]),
            response_payload=json.dumps(payload["response_payload"]),
            model_confidence=str(payload.get("model_confidence")),
        )
        db.add(record)
        db.commit()
        db.refresh(record)
        return record
