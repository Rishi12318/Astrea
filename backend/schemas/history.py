from pydantic import BaseModel


class HistoryCreate(BaseModel):
    user_id: int
    request_payload: dict
    response_payload: dict
    model_confidence: float | None = None
