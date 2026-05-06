import json
from dataclasses import dataclass
from pathlib import Path

import cv2
import numpy as np
import logging

from backend.config import get_settings
from backend.schemas.analysis import FaceAnalysisResponse
from backend.ml.inference import MakeupPredictor

logger = logging.getLogger(__name__)


@dataclass
class FaceFeatures:
    skin_tone: str
    undertone: str
    face_shape: str
    eye_shape: str
    lip_shape: str
    confidence: float


class FaceAnalysisService:
    def __init__(self) -> None:
        settings = get_settings()
        self.upload_dir = Path(settings.upload_dir)
        self.upload_dir.mkdir(parents=True, exist_ok=True)
        self.predictor = MakeupPredictor()

    def analyze_image(self, image_bytes: bytes) -> FaceAnalysisResponse:
        """Analyze face image using CNN inference pipeline."""
        try:
            image = self._decode_image(image_bytes)
            # Use CNN to predict face attributes
            face_prediction = self.predictor.predict_face_attributes(image)
            face_features = FaceFeatures(
                skin_tone=face_prediction.skin_tone,
                undertone=face_prediction.undertone,
                face_shape=face_prediction.face_shape,
                eye_shape=face_prediction.eye_shape,
                lip_shape=face_prediction.lip_shape,
                confidence=face_prediction.confidence,
            )
            return FaceAnalysisResponse(
                skin_tone=face_features.skin_tone,
                undertone=face_features.undertone,
                face_shape=face_features.face_shape,
                eye_shape=face_features.eye_shape,
                lip_shape=face_features.lip_shape,
                confidence=face_features.confidence,
                reasoning=self._build_reasoning(face_features),
            )
        except Exception as e:
            logger.error(f"Face analysis failed: {e}")
            raise

    def _decode_image(self, image_bytes: bytes) -> np.ndarray:
        """Decode image from bytes to RGB numpy array."""
        data = np.frombuffer(image_bytes, dtype=np.uint8)
        image = cv2.imdecode(data, cv2.IMREAD_COLOR)
        if image is None:
            raise ValueError("Unable to decode image")
        return cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    def _build_reasoning(self, features: FaceFeatures) -> str:
        """Build human-readable reasoning for the analysis."""
        return (
            f"CNN analysis detected {features.undertone.lower()} undertone with {features.face_shape.lower()} face structure; "
            f"recommendations are prioritized for {features.skin_tone.lower()} skin tone compatibility (confidence: {features.confidence:.1%})."
        )
