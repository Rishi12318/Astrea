from pydantic import BaseModel


class FaceAnalysisResponse(BaseModel):
    skin_tone: str
    undertone: str
    face_shape: str
    eye_shape: str
    lip_shape: str
    confidence: float
    reasoning: str
