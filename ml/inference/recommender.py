from __future__ import annotations

from dataclasses import dataclass

import numpy as np
from sklearn.cluster import KMeans
from sklearn.metrics.pairwise import cosine_similarity


@dataclass
class MakeupCandidate:
    name: str
    category: str
    embedding: np.ndarray


class MakeupRecommender:
    def __init__(self) -> None:
        self.candidates = [
            MakeupCandidate("Luminous Skin Foundation", "foundation", np.array([0.96, 0.20, 0.12, 0.08])),
            MakeupCandidate("Velvet Matte Lip", "lipstick", np.array([0.14, 0.88, 0.22, 0.45])),
            MakeupCandidate("Soft Flush Blush", "blush", np.array([0.30, 0.71, 0.17, 0.67])),
            MakeupCandidate("Glam Smoky Palette", "eye makeup", np.array([0.25, 0.50, 0.72, 0.20])),
        ]

    def rank(self, user_embedding: np.ndarray) -> list[dict]:
        ranked = []
        for candidate in self.candidates:
            score = float(cosine_similarity(user_embedding.reshape(1, -1), candidate.embedding.reshape(1, -1))[0][0])
            ranked.append({"name": candidate.name, "category": candidate.category, "score": round(score, 3)})
        ranked.sort(key=lambda item: item["score"], reverse=True)
        return ranked
