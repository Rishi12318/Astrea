from __future__ import annotations

from dataclasses import dataclass

import cv2
import mediapipe as mp
import numpy as np


@dataclass
class FeatureVector:
    mean_color: tuple[float, float, float]
    contrast: float
    brightness: float
    face_bbox: tuple[int, int, int, int] | None


class FaceFeatureExtractor:
    def __init__(self) -> None:
        self.face_detection = mp.solutions.face_detection.FaceDetection(model_selection=1, min_detection_confidence=0.5)

    def extract(self, image: np.ndarray) -> FeatureVector:
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        results = self.face_detection.process(rgb_image)
        bbox = None
        if results.detections:
            detection = results.detections[0]
            box = detection.location_data.relative_bounding_box
            height, width = image.shape[:2]
            bbox = (int(box.xmin * width), int(box.ymin * height), int(box.width * width), int(box.height * height))
        mean_color = tuple(float(v) for v in image.mean(axis=(0, 1)))
        contrast = float(image.std())
        brightness = float(image.mean())
        return FeatureVector(mean_color=mean_color, contrast=contrast, brightness=brightness, face_bbox=bbox)
