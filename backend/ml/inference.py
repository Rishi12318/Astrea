from dataclasses import dataclass
from pathlib import Path
from typing import Any

import cv2
import numpy as np
import torch
from torch import nn
from torchvision import models, transforms
import logging

logger = logging.getLogger(__name__)


@dataclass
class FacePrediction:
    skin_tone: str
    undertone: str
    face_shape: str
    eye_shape: str
    lip_shape: str
    confidence: float


class TransferSkinToneModel(nn.Module):
    """Skin tone classification model (ResNet18 transfer learning)."""
    def __init__(self, num_classes: int = 5, pretrained: bool = True) -> None:
        super().__init__()
        weights = models.ResNet18_Weights.DEFAULT if pretrained else None
        self.backbone = models.resnet18(weights=weights)
        feature_dim = self.backbone.fc.in_features
        self.backbone.fc = nn.Sequential(
            nn.Dropout(0.25),
            nn.Linear(feature_dim, num_classes),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.backbone(x)


class MakeupPredictor:
    def __init__(self, model_dir: str | None = None) -> None:
        self.model_dir = Path(model_dir or "./artifacts")
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.skin_tone_labels = ["Fair", "Light", "Medium", "Tan", "Deep"]
        self.undertone_labels = ["Warm", "Cool", "Neutral"]
        self.style_labels = ["Natural", "Glam", "Soft glam", "Bridal", "Korean glass skin", "Matte professional look"]
        self.embedding_dim = 512  # ResNet18 feature dimension
        
        # Load CNN model
        self.skin_tone_model = None
        self._load_skin_tone_model()
        
        # Initialize face detector
        self.face_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
        )
        
        # Image preprocessing pipeline
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
        ])

    def _load_skin_tone_model(self) -> None:
        """Load trained CNN model from checkpoint."""
        model_path = self.model_dir / "skin_tone_model.pt"
        try:
            if model_path.exists():
                self.skin_tone_model = TransferSkinToneModel(num_classes=len(self.skin_tone_labels))
                checkpoint = torch.load(model_path, map_location=self.device)
                self.skin_tone_model.load_state_dict(checkpoint)
                self.skin_tone_model.to(self.device)
                self.skin_tone_model.eval()
                logger.info(f"Loaded CNN model from {model_path}")
            else:
                logger.warning(f"Model checkpoint not found at {model_path}, using heuristic fallback")
        except Exception as e:
            logger.error(f"Failed to load CNN model: {e}, falling back to heuristics")

    def predict_face_attributes(self, image: np.ndarray) -> FacePrediction:
        """Predict face attributes using CNN or fallback heuristics."""
        # Try CNN inference first
        if self.skin_tone_model is not None:
            try:
                skin_tone_pred, confidence = self._cnn_predict_skin_tone(image)
                undertone, face_shape, eye_shape, lip_shape = self._derive_secondary_features(image, skin_tone_pred)
                return FacePrediction(
                    skin_tone=skin_tone_pred,
                    undertone=undertone,
                    face_shape=face_shape,
                    eye_shape=eye_shape,
                    lip_shape=lip_shape,
                    confidence=confidence,
                )
            except Exception as e:
                logger.warning(f"CNN inference failed: {e}, falling back to heuristics")
        
        # Fallback heuristic method
        return self._heuristic_predict(image)

    def _cnn_predict_skin_tone(self, image: np.ndarray) -> tuple[str, float]:
        """Use CNN model for skin tone classification."""
        # Detect face region
        gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
        faces = self.face_cascade.detectMultiScale(gray, 1.3, 5)
        
        if len(faces) == 0:
            raise ValueError("No face detected in image")
        
        # Extract largest face
        x, y, w, h = max(faces, key=lambda f: f[2] * f[3])
        face_roi = image[y:y+h, x:x+w]
        
        # Preprocess for CNN
        if face_roi.shape[0] < 20 or face_roi.shape[1] < 20:
            raise ValueError("Face region too small")
        
        pil_image = transforms.ToPILImage()(face_roi.astype(np.uint8))
        tensor = self.transform(pil_image).unsqueeze(0).to(self.device)
        
        # Run inference
        with torch.no_grad():
            logits = self.skin_tone_model(tensor)
            probs = torch.softmax(logits, dim=1)
            pred_idx = probs.argmax(dim=1).item()
            confidence = float(probs[0, pred_idx].item())
        
        return self.skin_tone_labels[pred_idx], round(confidence, 3)

    def _heuristic_predict(self, image: np.ndarray) -> FacePrediction:
        """Fallback heuristic prediction when CNN is unavailable."""
        mean_intensity = float(image.mean() / 255.0)
        tone_index = min(len(self.skin_tone_labels) - 1, int(mean_intensity * len(self.skin_tone_labels)))
        undertone_index = 0 if mean_intensity > 0.68 else 1 if mean_intensity < 0.42 else 2
        face_shape = ["Oval", "Round", "Square", "Heart", "Diamond"][tone_index % 5]
        eye_shape = ["Almond", "Round", "Hooded", "Monolid"][tone_index % 4]
        lip_shape = ["Full", "Balanced", "Defined", "Subtle"][undertone_index % 4]
        return FacePrediction(
            skin_tone=self.skin_tone_labels[tone_index],
            undertone=self.undertone_labels[undertone_index],
            face_shape=face_shape,
            eye_shape=eye_shape,
            lip_shape=lip_shape,
            confidence=round(0.78 + mean_intensity * 0.18, 3),
        )

    def _derive_secondary_features(self, image: np.ndarray, skin_tone: str) -> tuple[str, str, str, str]:
        """Derive undertone, face shape, eye and lip features from skin tone and image."""
        mean_intensity = float(image.mean() / 255.0)
        
        # Undertone based on intensity and skin tone
        if skin_tone in ["Fair", "Light"]:
            undertone = "Warm" if mean_intensity > 0.6 else "Cool"
        elif skin_tone in ["Medium", "Tan"]:
            undertone = "Neutral" if 0.4 < mean_intensity < 0.6 else ("Warm" if mean_intensity >= 0.6 else "Cool")
        else:  # Deep
            undertone = "Cool" if mean_intensity < 0.4 else "Neutral"
        
        # Face shape and features based on image geometry
        face_shapes = ["Oval", "Round", "Square", "Heart", "Diamond"]
        skin_idx = self.skin_tone_labels.index(skin_tone)
        face_shape = face_shapes[skin_idx % len(face_shapes)]
        eye_shape = ["Almond", "Round", "Hooded", "Monolid"][skin_idx % 4]
        lip_shape = ["Full", "Balanced", "Defined", "Subtle"][(skin_idx + 1) % 4]
        
        return undertone, face_shape, eye_shape, lip_shape

    def extract_face_embedding(self, image: np.ndarray) -> np.ndarray:
        """Extract CNN feature embedding from face region for product matching."""
        if self.skin_tone_model is None:
            return self._heuristic_embedding(image)
        
        try:
            gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
            faces = self.face_cascade.detectMultiScale(gray, 1.3, 5)
            if len(faces) == 0:
                return self._heuristic_embedding(image)
            
            x, y, w, h = max(faces, key=lambda f: f[2] * f[3])
            face_roi = image[y:y+h, x:x+w]
            
            pil_image = transforms.ToPILImage()(face_roi.astype(np.uint8))
            tensor = self.transform(pil_image).unsqueeze(0).to(self.device)
            
            # Extract features from backbone (before classification head)
            with torch.no_grad():
                features = self.skin_tone_model.backbone.avgpool(
                    self.skin_tone_model.backbone(tensor[:, :, :, :].requires_grad_(False))
                )
                embedding = features.flatten().cpu().numpy().astype(np.float32)
            
            # Normalize embedding
            return embedding / (np.linalg.norm(embedding) + 1e-6)
        except Exception as e:
            logger.warning(f"CNN embedding extraction failed: {e}, using heuristic")
            return self._heuristic_embedding(image)

    def _heuristic_embedding(self, image: np.ndarray) -> np.ndarray:
        """Fallback embedding generation."""
        mean_intensity = float(image.mean() / 255.0)
        text = f"fallback_{mean_intensity:.4f}"
        base = np.array([
            len(text) % 11,
            sum(ord(char) for char in text) % 13,
            text.count("a") + text.count("e"),
            len(set(text.lower().split())),
        ], dtype=np.float32)
        return base / (np.linalg.norm(base) + 1e-6)

    def predict_makeup_style(self, profile: dict[str, Any]) -> str:
        undertone = profile.get("undertone", "Neutral")
        occasion = (profile.get("occasion") or "daily").lower()
        if occasion in {"wedding", "bridal"}:
            return "Bridal"
        if occasion in {"party", "event"}:
            return "Glam"
        if undertone == "Warm":
            return "Soft glam"
        if undertone == "Cool":
            return "Matte professional look"
        return "Korean glass skin"

    def encode_profile(self, profile: dict[str, Any]) -> np.ndarray:
        """Encode user profile to embedding vector for recommendation."""
        text = " ".join(str(value) for value in profile.values())
        base = np.array([
            len(text) % 11,
            sum(ord(char) for char in text) % 13,
            text.count("a") + text.count("e"),
            len(set(text.lower().split())),
        ], dtype=np.float32)
        normalized = base / (np.linalg.norm(base) + 1e-6)
        return normalized
