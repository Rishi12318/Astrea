from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt

from backend.auth.security import ALGORITHM
from backend.config import get_settings

bearer_scheme = HTTPBearer(auto_error=False)
settings = get_settings()


def get_current_user_token(credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme)) -> str:
    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    token = credentials.credentials
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[ALGORITHM])
        subject = payload.get("sub")
        if not subject:
            raise ValueError("Missing subject")
        return subject
    except JWTError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token") from exc
