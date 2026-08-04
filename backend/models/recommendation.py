from datetime import datetime, timezone
from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.database.base import Base



class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    brand: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    price: Mapped[float] = mapped_column(Float, default=0.0)
    image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    shades: Mapped[list["ProductShade"]] = relationship("ProductShade", back_populates="product", cascade="all, delete-orphan")


class ProductShade(Base):
    __tablename__ = "product_shades"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    product_id: Mapped[int] = mapped_column(Integer, ForeignKey("products.id", ondelete="CASCADE"), index=True, nullable=False)
    shade_name: Mapped[str] = mapped_column(String(100), nullable=False)
    skin_tone: Mapped[str] = mapped_column(String(50), index=True, nullable=False)
    undertone: Mapped[str] = mapped_column(String(50), index=True, nullable=False)
    hex_color: Mapped[str] = mapped_column(String(7), nullable=False)  # e.g., #FFFFFF
    lab_l: Mapped[float] = mapped_column(Float, nullable=False)
    lab_a: Mapped[float] = mapped_column(Float, nullable=False)
    lab_b: Mapped[float] = mapped_column(Float, nullable=False)
    embedding_json: Mapped[str | None] = mapped_column(Text, nullable=True)

    product: Mapped["Product"] = relationship("Product", back_populates="shades")


class RecommendationHistory(Base):
    __tablename__ = "recommendation_history"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    request_payload: Mapped[str] = mapped_column(Text, nullable=False)
    response_payload: Mapped[str] = mapped_column(Text, nullable=False)
    model_confidence: Mapped[str | None] = mapped_column(String(50), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

