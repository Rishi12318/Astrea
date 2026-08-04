from __future__ import annotations

from dataclasses import dataclass

import cv2
import numpy as np


@dataclass
class SkinFeatures:
    """Extracted skin and facial geometry features."""
    mean_lab: tuple[float, float, float]    # (L*, a*, b*) averaged over sampled regions
    mean_hsv: tuple[float, float, float]    # (H, S, V) averaged over sampled regions
    face_bbox: tuple[int, int, int, int] | None  # (x, y, w, h) in pixels
    face_shape_ratio: float                  # width / height ratio of bounding box
    brightness: float                        # mean V channel value (0-255)


class FaceFeatureExtractor:
    """Extract skin colour and facial geometry features using OpenCV.

    Uses Haar cascade face detection + relative region sampling
    (forehead, cheeks, jawline) to avoid eyes, lips, and hair regions.
    """

    def __init__(self) -> None:
        self.face_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
        )

    def extract(self, image: np.ndarray) -> SkinFeatures:
        """Extract features from an RGB image (numpy uint8 array)."""
        gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
        faces = self.face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(60, 60))

        if len(faces) == 0:
            # No face detected — fall back to full-image stats
            return self._whole_image_fallback(image)

        # Use the largest detected face
        x, y, w, h = max(faces, key=lambda f: f[2] * f[3])
        face_roi = image[y : y + h, x : x + w]
        return self._sample_regions(face_roi, bbox=(x, y, w, h))

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------

    def _sample_regions(self, face_roi: np.ndarray, bbox: tuple) -> SkinFeatures:
        """Sample forehead, left cheek, right cheek and jawline ROIs."""
        h, w = face_roi.shape[:2]

        regions: list[np.ndarray] = []

        # Forehead: top 20-35% height, middle 30-70% width (avoids hairline edge)
        forehead = face_roi[int(0.20 * h) : int(0.35 * h), int(0.30 * w) : int(0.70 * w)]
        if forehead.size > 0:
            regions.append(forehead)

        # Left cheek: 50-70% height, 5-30% width
        left_cheek = face_roi[int(0.50 * h) : int(0.70 * h), int(0.05 * w) : int(0.30 * w)]
        if left_cheek.size > 0:
            regions.append(left_cheek)

        # Right cheek: 50-70% height, 70-95% width
        right_cheek = face_roi[int(0.50 * h) : int(0.70 * h), int(0.70 * w) : int(0.95 * w)]
        if right_cheek.size > 0:
            regions.append(right_cheek)

        # Jawline: 80-95% height, 20-80% width
        jawline = face_roi[int(0.80 * h) : int(0.95 * h), int(0.20 * w) : int(0.80 * w)]
        if jawline.size > 0:
            regions.append(jawline)

        if not regions:
            return self._whole_image_fallback(face_roi)

        combined = np.vstack([r.reshape(-1, 3) for r in regions])
        return self._compute_stats(combined, bbox, w, h)

    def _compute_stats(self, pixels: np.ndarray, bbox: tuple, face_w: int, face_h: int) -> SkinFeatures:
        """Compute mean LAB, HSV, brightness and shape ratio from pixel array."""
        # LAB conversion
        rgb_mean = pixels.mean(axis=0).astype(np.uint8)
        rgb_tile = rgb_mean.reshape(1, 1, 3)
        lab_tile = cv2.cvtColor(rgb_tile, cv2.COLOR_RGB2LAB)
        mean_lab = tuple(float(v) for v in lab_tile[0, 0])  # type: ignore[assignment]

        # HSV conversion
        hsv_tile = cv2.cvtColor(rgb_tile, cv2.COLOR_RGB2HSV)
        mean_hsv = tuple(float(v) for v in hsv_tile[0, 0])  # type: ignore[assignment]

        brightness = float(rgb_mean.mean())
        shape_ratio = face_w / max(face_h, 1)

        return SkinFeatures(
            mean_lab=mean_lab,
            mean_hsv=mean_hsv,
            face_bbox=bbox,
            face_shape_ratio=shape_ratio,
            brightness=brightness,
        )

    def _whole_image_fallback(self, image: np.ndarray) -> SkinFeatures:
        """Fallback when no face is detected."""
        pixels = image.reshape(-1, 3)
        return self._compute_stats(pixels, bbox=None, face_w=image.shape[1], face_h=image.shape[0])  # type: ignore[arg-type]

