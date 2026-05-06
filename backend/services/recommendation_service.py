from dataclasses import dataclass
from typing import Any

import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sqlalchemy.orm import Session

from backend.ml.inference import MakeupPredictor
from backend.models.recommendation import ProductCatalog
from backend.services.catalog_service import CatalogService
from backend.schemas.recommendation import RecommendationResponse, RecommendedProduct


@dataclass
class ProductRecord:
    name: str
    category: str
    shade: str | None
    undertone: str | None
    skin_tone: str | None
    description: str | None
    embedding: np.ndarray


class RecommendationService:
    def __init__(self) -> None:
        self.predictor = MakeupPredictor()
        self.catalog_service = CatalogService()

    def recommend(self, db: Session, user_profile: dict[str, Any]) -> RecommendationResponse:
        style = self.predictor.predict_makeup_style(user_profile)
        profile_embedding = self.predictor.encode_profile(user_profile)
        scored_products = []
        catalog = self.catalog_service.list_catalog(db)

        if not catalog:
            return RecommendationResponse(style=style, confidence=0.0, products=[])

        for product in catalog:
            product_embedding = self.catalog_service.encode_product(product)
            similarity = float(cosine_similarity(profile_embedding.reshape(1, -1), product_embedding.reshape(1, -1))[0][0])
            if user_profile.get("skin_tone") and product.skin_tone and user_profile["skin_tone"] != product.skin_tone:
                similarity *= 0.88
            if user_profile.get("undertone") and product.undertone and user_profile["undertone"] != product.undertone:
                similarity *= 0.9
            scored_products.append(
                RecommendedProduct(
                    name=product.name,
                    category=product.category,
                    shade=product.shade,
                    score=round(similarity, 3),
                    reason=self._reason_for_match(user_profile, product.name, product.category),
                )
            )

        scored_products.sort(key=lambda item: item.score, reverse=True)
        return RecommendationResponse(style=style, confidence=0.91, products=scored_products[:8])

    def _reason_for_match(self, profile: dict[str, Any], product_name: str, category: str) -> str:
        undertone = profile.get("undertone", "neutral")
        face_shape = profile.get("face_shape", "balanced")
        return f"{product_name} fits a {undertone} undertone and works well for {face_shape} face styling in the {category} category."
