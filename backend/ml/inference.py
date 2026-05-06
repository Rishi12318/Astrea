from dataclasses import dataclass
from pathlib import Path
from typing import Any

import numpy as np
import torch
from torch import nn
from torchvision import models


@dataclass
class FacePrediction:
    skin_tone: str
    undertone: str
    face_shape: str
    eye_shape: str
    lip_shape: str
    confidence: float


class MakeupPredictor:
    def __init__(self, model_dir: str | None = None) -> None:
        self.model_dir = Path(model_dir or "./artifacts")
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.skin_tone_labels = ["Fair", "Light", "Medium", "Tan", "Deep"]
        self.undertone_labels = ["Warm", "Cool", "Neutral"]
        self.style_labels = ["Natural", "Glam", "Soft glam", "Bridal", "Korean glass skin", "Matte professional look"]
        self.embedding_dim = 4

    def predict_face_attributes(self, image: np.ndarray) -> FacePrediction:
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
        text = " ".join(str(value) for value in profile.values())
        base = np.array([
            len(text) % 11,
            sum(ord(char) for char in text) % 13,
            text.count("a") + text.count("e"),
            len(set(text.lower().split())),
        ], dtype=np.float32)
        normalized = base / (np.linalg.norm(base) + 1e-6)
        return normalized
