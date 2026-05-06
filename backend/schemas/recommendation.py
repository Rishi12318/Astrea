from pydantic import BaseModel


class RecommendationRequest(BaseModel):
    user_id: int
    occasion: str | None = None
    style_preference: str | None = None
    skin_tone: str | None = None
    undertone: str | None = None
    face_shape: str | None = None


class RecommendedProduct(BaseModel):
    name: str
    category: str
    shade: str | None = None
    score: float
    reason: str


class RecommendationResponse(BaseModel):
    style: str
    confidence: float
    products: list[RecommendedProduct]
