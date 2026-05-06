from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

import numpy as np
import torch
from PIL import Image
from torchvision import transforms

from ml.training.model import TransferSkinToneModel


@dataclass
class PredictionResult:
    label: str
    confidence: float


class MakeupInferenceEngine:
    def __init__(self, checkpoint_path: str = "artifacts/skin_tone_model.pt") -> None:
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.labels = ["Fair", "Light", "Medium", "Tan", "Deep"]
        self.model = TransferSkinToneModel(num_classes=len(self.labels)).to(self.device)
        self.checkpoint_path = Path(checkpoint_path)
        self.transform = transforms.Compose(
            [
                transforms.Resize((224, 224)),
                transforms.ToTensor(),
                transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
            ]
        )
        if self.checkpoint_path.exists():
            self.model.load_state_dict(torch.load(self.checkpoint_path, map_location=self.device))
        self.model.eval()

    def predict(self, image_path: str) -> PredictionResult:
        image = Image.open(image_path).convert("RGB")
        tensor = self.transform(image).unsqueeze(0).to(self.device)
        with torch.no_grad():
            logits = self.model(tensor)
            probabilities = torch.softmax(logits, dim=1)[0]
            confidence, index = torch.max(probabilities, dim=0)
        return PredictionResult(label=self.labels[int(index)], confidence=float(confidence))
