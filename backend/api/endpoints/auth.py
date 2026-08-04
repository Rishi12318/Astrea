from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.auth.dependencies import get_current_user_token
from backend.auth.security import create_access_token, hash_password, verify_password
from backend.database.deps import get_db
from backend.models.user import User, SkinProfile
from backend.schemas.auth import TokenResponse, UserCreate, UserLogin

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse)
def register_user(payload: UserCreate, db: Session = Depends(get_db)) -> TokenResponse:
    existing = db.scalars(select(User).where(User.email == payload.email)).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
    user = User(
        email=payload.email,
        hashed_password=hash_password(payload.password),
        full_name=payload.full_name,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_access_token(payload.email)
    return TokenResponse(access_token=token)


@router.post("/login", response_model=TokenResponse)
def login_user(payload: UserLogin, db: Session = Depends(get_db)) -> TokenResponse:
    user = db.scalars(select(User).where(User.email == payload.email)).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_access_token(payload.email)
    return TokenResponse(access_token=token)


@router.get("/me")
def get_current_user(token: str = Depends(get_current_user_token), db: Session = Depends(get_db)) -> dict:
    user = db.scalars(select(User).where(User.email == token)).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    profile = db.scalars(
        select(SkinProfile).where(SkinProfile.user_id == user.id).order_by(SkinProfile.created_at.desc()).limit(1)
    ).first()
    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "skin_profile": {
            "skin_tone": profile.skin_tone,
            "undertone": profile.undertone,
            "face_shape": profile.face_shape,
            "eye_shape": profile.eye_shape,
            "lip_shape": profile.lip_shape,
        } if profile else None,
    }

