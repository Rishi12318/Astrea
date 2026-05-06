from fastapi import APIRouter, Depends, File, UploadFile

from backend.auth.dependencies import get_current_user_token
from backend.schemas.analysis import FaceAnalysisResponse
from backend.services.analysis_service import FaceAnalysisService

router = APIRouter(tags=["analysis"])
analysis_service = FaceAnalysisService()


@router.post("/upload-image")
async def upload_image(file: UploadFile = File(...), token: str = Depends(get_current_user_token)) -> dict:
    contents = await file.read()
    analysis = analysis_service.analyze_image(contents)
    return {"message": "Image uploaded successfully", "analysis": analysis.model_dump()}


@router.post("/analyze-face", response_model=FaceAnalysisResponse)
async def analyze_face(file: UploadFile = File(...), token: str = Depends(get_current_user_token)) -> FaceAnalysisResponse:
    contents = await file.read()
    return analysis_service.analyze_image(contents)


@router.post("/predict-skin-tone")
async def predict_skin_tone(file: UploadFile = File(...), token: str = Depends(get_current_user_token)) -> dict:
    contents = await file.read()
    analysis = analysis_service.analyze_image(contents)
    return {"skin_tone": analysis.skin_tone, "undertone": analysis.undertone, "confidence": analysis.confidence}
