from pydantic import BaseModel


class ChatbotRequest(BaseModel):
    message: str
    user_id: int | None = None
    history: list[dict] | None = None
    user_profile: dict | None = None


class ChatbotResponse(BaseModel):
    answer: str
    confidence: float
    citations: list[str] = []

