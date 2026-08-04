from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from backend.database.base import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))


class SkinProfile(Base):
    __tablename__ = "skin_profiles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    skin_tone: Mapped[str | None] = mapped_column(String(50), nullable=True)
    undertone: Mapped[str | None] = mapped_column(String(50), nullable=True)
    face_shape: Mapped[str | None] = mapped_column(String(50), nullable=True)
    eye_shape: Mapped[str | None] = mapped_column(String(50), nullable=True)
    lip_shape: Mapped[str | None] = mapped_column(String(50), nullable=True)
    preferences: Mapped[str | None] = mapped_column(Text, nullable=True)  # JSON-encoded preference weights
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

