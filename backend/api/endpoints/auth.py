from fastapi import APIRouter

from backend.auth.security import create_access_token
from backend.schemas.auth import TokenResponse, UserCreate, UserLogin

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse)
def register_user(payload: UserCreate) -> TokenResponse:
    token = create_access_token(payload.email)
    return TokenResponse(access_token=token)


@router.post("/login", response_model=TokenResponse)
def login_user(payload: UserLogin) -> TokenResponse:
    token = create_access_token(payload.email)
    return TokenResponse(access_token=token)
