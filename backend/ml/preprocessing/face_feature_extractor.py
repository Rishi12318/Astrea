from dataclasses import dataclass

import cv2
import numpy as np


@dataclass
class FaceFeatures:
    mean_lab: tuple[float, float, float]
    face_shape_ratio: float


class FaceFeatureExtractor:
    """Extract facial features from an image for heuristic-based prediction."""

    def __init__(self) -> None:
        self.face_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
        )

    def extract(self, image: np.ndarray) -> FaceFeatures:
        """Extract LAB colour statistics and face shape ratio from an image.

        Args:
            image: RGB numpy array (H, W, 3).

        Returns:
            FaceFeatures with mean LAB values and face aspect ratio.
        """
        gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
        faces = self.face_cascade.detectMultiScale(gray, 1.3, 5)

        if len(faces) == 0:
            return self._fallback_features(image)

        x, y, w, h = max(faces, key=lambda f: f[2] * f[3])
        face_roi = image[y : y + h, x : x + w]

        if face_roi.shape[0] < 20 or face_roi.shape[1] < 20:
            return self._fallback_features(image)

        lab = cv2.cvtColor(face_roi, cv2.COLOR_RGB2LAB)
        mean_l = float(lab[:, :, 0].mean())
        mean_a = float(lab[:, :, 1].mean())
        mean_b = float(lab[:, :, 2].mean())

        face_shape_ratio = w / h if h > 0 else 1.0

        return FaceFeatures(
            mean_lab=(mean_l, mean_a, mean_b),
            face_shape_ratio=face_shape_ratio,
        )

    def _fallback_features(self, image: np.ndarray) -> FaceFeatures:
        """Fallback when no face is detected: use full-image statistics."""
        lab = cv2.cvtColor(image, cv2.COLOR_RGB2LAB)
        mean_l = float(lab[:, :, 0].mean())
        mean_a = float(lab[:, :, 1].mean())
        mean_b = float(lab[:, :, 2].mean())

        h, w = image.shape[:2]
        face_shape_ratio = w / h if h > 0 else 1.0

        return FaceFeatures(
            mean_lab=(mean_l, mean_a, mean_b),
            face_shape_ratio=face_shape_ratio,
        )
