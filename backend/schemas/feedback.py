from pydantic import BaseModel


class FeedbackCreate(BaseModel):
    user_id: int
    product_id: int | None = None
    score: int
    comment: str | None = None
