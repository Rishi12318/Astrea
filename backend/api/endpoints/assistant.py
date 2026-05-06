from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.auth.dependencies import get_current_user_token
from backend.database.deps import get_db
from backend.schemas.chatbot import ChatbotRequest, ChatbotResponse
from backend.services.chatbot_service import BeautyAssistantService

router = APIRouter(tags=["assistant"])
assistant_service = BeautyAssistantService()


@router.post("/chatbot", response_model=ChatbotResponse)
def chatbot(payload: ChatbotRequest, token: str = Depends(get_current_user_token), db: Session = Depends(get_db)) -> ChatbotResponse:
    response = assistant_service.chat(payload.message, user_profile=payload.user_profile)
    return ChatbotResponse(**response.__dict__)
