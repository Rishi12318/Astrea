from __future__ import annotations

import logging
from typing import Any

import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.models.feedback import UserFeedback
from backend.models.recommendation import Product, ProductShade
from backend.schemas.recommendation import RecommendationResponse, RecommendedProduct
from backend.services.catalog_service import CatalogService

logger = logging.getLogger(__name__)

# Known categories for one-hot encoding
CATEGORIES = ["foundation", "lipstick", "blush", "eyeshadow", "base", "highlight"]
SKIN_TONES = ["Fair", "Light", "Medium", "Tan", "Deep"]
UNDERTONES = ["Warm", "Cool", "Neutral"]

# EMA alpha for preference weighting
EMA_ALPHA = 0.3


def _skin_tone_to_lab_l(skin_tone: str) -> float:
    """Map skin tone label to approximate LAB L* value."""
    mapping = {"Fair": 85.0, "Light": 73.0, "Medium": 62.0, "Tan": 50.0, "Deep": 35.0}
    return mapping.get(skin_tone, 62.0)


def _undertone_to_ab(undertone: str) -> tuple[float, float]:
    """Map undertone to approximate LAB a*/b* offsets."""
    mapping = {"Warm": (12.0, 22.0), "Cool": (8.0, 5.0), "Neutral": (10.0, 14.0)}
    return mapping.get(undertone, (10.0, 14.0))


def _build_product_vector(shade: ProductShade) -> np.ndarray:
    """Build a normalized feature vector for a product shade.

    Vector layout:
      [0]   LAB L* (normalised to [0,1])
      [1]   LAB a* (normalised)
      [2]   LAB b* (normalised)
      [3..] one-hot category (len = CATEGORIES)
    """
    lab = np.array([shade.lab_l / 100.0, (shade.lab_a + 128) / 255.0, (shade.lab_b + 128) / 255.0], dtype=np.float32)
    cat_idx = CATEGORIES.index(shade.product.category) if shade.product.category in CATEGORIES else len(CATEGORIES) - 1
    one_hot = np.zeros(len(CATEGORIES), dtype=np.float32)
    one_hot[cat_idx] = 1.0
    vec = np.concatenate([lab, one_hot])
    norm = np.linalg.norm(vec)
    return vec / (norm + 1e-6)


def _build_user_vector(profile: dict[str, Any]) -> np.ndarray:
    """Build a user profile vector compatible with the product vector space."""
    skin_tone = profile.get("skin_tone", "Medium")
    undertone = profile.get("undertone", "Neutral")
    lab_l = _skin_tone_to_lab_l(skin_tone) / 100.0
    lab_a, lab_b = _undertone_to_ab(undertone)
    lab = np.array([lab_l, (lab_a + 128) / 255.0, (lab_b + 128) / 255.0], dtype=np.float32)
    # User doesn't encode category — use uniform for all categories
    one_hot = np.ones(len(CATEGORIES), dtype=np.float32) / len(CATEGORIES)
    vec = np.concatenate([lab, one_hot])
    norm = np.linalg.norm(vec)
    return vec / (norm + 1e-6)


def _load_preferences(db: Session, user_id: int) -> dict[str, float]:
    """Load per-brand preference weights from user feedback history (EMA).

    Returns a dict mapping brand -> weight (default 1.0).
    """
    weights: dict[str, float] = {}
    feedbacks = db.scalars(
        select(UserFeedback)
        .where(UserFeedback.user_id == user_id)
        .order_by(UserFeedback.created_at)
    ).all()

    for fb in feedbacks:
        if fb.product_id is None:
            continue
        product = db.get(Product, fb.product_id)
        if product is None:
            continue
        brand = product.brand
        # Score is 1-5; normalise to [-1, +1] centred at 3
        delta = (fb.score - 3) / 2.0
        prev = weights.get(brand, 1.0)
        weights[brand] = prev + EMA_ALPHA * delta * prev
    return weights


class RecommendationService:
    def __init__(self) -> None:
        self.catalog_service = CatalogService()

    def recommend(self, db: Session, user_profile: dict[str, Any]) -> RecommendationResponse:
        """Generate makeup recommendations using LAB-space cosine similarity."""
        try:
            style = self._predict_makeup_style(user_profile)
            user_vec = _build_user_vector(user_profile)
            user_id = user_profile.get("user_id", 0)
            pref_weights = _load_preferences(db, user_id) if user_id else {}

            catalog = self.catalog_service.list_catalog(db)
            if not catalog:
                logger.warning("Empty product catalog — did you run seed_catalog?")
                return RecommendationResponse(style=style, confidence=0.0, products=[])

            scored: list[RecommendedProduct] = []
            for shade in catalog:
                product_vec = _build_product_vector(shade)
                sim = float(cosine_similarity(user_vec.reshape(1, -1), product_vec.reshape(1, -1))[0][0])

                # Apply skin-tone match bonus/penalty
                if user_profile.get("skin_tone") and shade.skin_tone:
                    if user_profile["skin_tone"].lower() == shade.skin_tone.lower():
                        sim = min(1.0, sim * 1.08)
                    else:
                        sim *= 0.90

                # Apply undertone match bonus/penalty
                if user_profile.get("undertone") and shade.undertone:
                    if user_profile["undertone"].lower() == shade.undertone.lower():
                        sim = min(1.0, sim * 1.06)
                    else:
                        sim *= 0.92

                # Apply EMA brand preference weight
                brand_weight = pref_weights.get(shade.product.brand, 1.0)
                sim = min(1.0, sim * brand_weight)

                scored.append(
                    RecommendedProduct(
                        name=shade.product.name,
                        category=shade.product.category,
                        shade=shade.shade_name,
                        score=round(sim, 3),
                        reason=self._build_reason(user_profile, shade),
                    )
                )

            scored.sort(key=lambda x: x.score, reverse=True)
            confidence = round(float(np.mean([p.score for p in scored[:3]])) if scored else 0.0, 3)
            logger.info(f"Generated {len(scored)} recommendations; style={style}, top_confidence={confidence}")
            return RecommendationResponse(style=style, confidence=confidence, products=scored[:8])

        except Exception as exc:
            logger.error(f"Recommendation generation failed: {exc}", exc_info=True)
            raise

    def _predict_makeup_style(self, profile: dict[str, Any]) -> str:
        """Derive makeup style from occasion and undertone."""
        undertone = profile.get("undertone", "Neutral")
        occasion = (profile.get("occasion") or "daily").lower()
        if occasion in {"wedding", "bridal"}:
            return "Bridal"
        if occasion in {"party", "event", "gala"}:
            return "Glam"
        if undertone == "Warm":
            return "Soft Glam"
        if undertone == "Cool":
            return "Matte Professional"
        return "Korean Glass Skin"

    def _build_reason(self, profile: dict[str, Any], shade: ProductShade) -> str:
        """Generate a human-readable explanation for the recommendation."""
        undertone = profile.get("undertone", "neutral")
        skin_tone = profile.get("skin_tone", "various")
        return (
            f"{shade.product.name} ({shade.shade_name}) is formulated for {shade.skin_tone.lower()} skin "
            f"with {shade.undertone.lower()} undertones — matched against your {skin_tone.lower()} / "
            f"{undertone.lower()} profile for {shade.product.category} coverage."
        )

