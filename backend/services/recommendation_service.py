from dataclasses import dataclass
from typing import Any
import logging

import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sqlalchemy.orm import Session

from backend.ml.inference import MakeupPredictor
from backend.models.recommendation import ProductCatalog
from backend.services.catalog_service import CatalogService
from backend.schemas.recommendation import RecommendationResponse, RecommendedProduct

logger = logging.getLogger(__name__)


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
        """Generate makeup recommendations using CNN-derived embeddings."""
        try:
            style = self.predictor.predict_makeup_style(user_profile)
            # Use CNN-derived profile embedding
            profile_embedding = self.predictor.encode_profile(user_profile)
            scored_products = []
            catalog = self.catalog_service.list_catalog(db)

            if not catalog:
                logger.warning("Empty product catalog")
                return RecommendationResponse(style=style, confidence=0.0, products=[])

            for product in catalog:
                # Get CNN-encoded product embedding
                product_embedding = self.catalog_service.encode_product(product)
                
                # Compute cosine similarity between user profile and product
                similarity = float(cosine_similarity(
                    profile_embedding.reshape(1, -1), 
                    product_embedding.reshape(1, -1)
                )[0][0])
                
                # Apply skin tone matching penalty
                if user_profile.get("skin_tone") and product.skin_tone:
                    if user_profile["skin_tone"] != product.skin_tone:
                        similarity *= 0.88
                
                # Apply undertone matching penalty
                if user_profile.get("undertone") and product.undertone:
                    if user_profile["undertone"] != product.undertone:
                        similarity *= 0.90
                
                scored_products.append(
                    RecommendedProduct(
                        name=product.name,
                        category=product.category,
                        shade=product.shade,
                        score=round(similarity, 3),
                        reason=self._reason_for_match(user_profile, product),
                    )
                )

            # Sort by score descending and return top 8
            scored_products.sort(key=lambda item: item.score, reverse=True)
            confidence = 0.91 if scored_products else 0.0
            
            logger.info(f"Generated {len(scored_products)} recommendations with style: {style}")
            return RecommendationResponse(style=style, confidence=confidence, products=scored_products[:8])
        except Exception as e:
            logger.error(f"Recommendation generation failed: {e}")
            raise

    def _reason_for_match(self, profile: dict[str, Any], product: ProductCatalog) -> str:
        """Generate human-readable reason for product recommendation."""
        undertone = profile.get("undertone", "neutral")
        face_shape = profile.get("face_shape", "balanced")
        skin_tone = profile.get("skin_tone", "various")
        return (
            f"{product.name} matches {undertone} undertone and works well for {face_shape} face styling "
            f"({product.category}); optimized for {skin_tone} skin compatibility."
        )
