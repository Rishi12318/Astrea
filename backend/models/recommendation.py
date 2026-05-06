from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from backend.database.base import Base


class ProductCatalog(Base):
    __tablename__ = "product_catalog"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    brand: Mapped[str | None] = mapped_column(String(100), nullable=True)
    shade: Mapped[str | None] = mapped_column(String(100), nullable=True)
    undertone: Mapped[str | None] = mapped_column(String(50), nullable=True)
    skin_tone: Mapped[str | None] = mapped_column(String(50), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    embedding_json: Mapped[str | None] = mapped_column(Text, nullable=True)


class RecommendationHistory(Base):
    __tablename__ = "recommendation_history"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    product_id: Mapped[int | None] = mapped_column(ForeignKey("product_catalog.id"), nullable=True)
    request_payload: Mapped[str] = mapped_column(Text, nullable=False)
    response_payload: Mapped[str] = mapped_column(Text, nullable=False)
    model_confidence: Mapped[str | None] = mapped_column(String(50), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
