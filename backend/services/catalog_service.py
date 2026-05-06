from __future__ import annotations

import json
from dataclasses import dataclass
from typing import Iterable

import numpy as np
from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.models.recommendation import ProductCatalog


@dataclass(frozen=True)
class CatalogSeed:
    name: str
    category: str
    brand: str
    shade: str
    undertone: str
    skin_tone: str
    description: str
    embedding: list[float]


class CatalogService:
    def default_catalog(self) -> list[CatalogSeed]:
        return [
            CatalogSeed("Luminous Skin Foundation", "foundation", "Glow Atelier", "Warm Beige", "warm", "medium", "Hydrating medium-coverage foundation", [0.95, 0.2, 0.15, 0.05]),
            CatalogSeed("Velvet Matte Lip", "lipstick", "Velvet Muse", "Rose Clay", "neutral", "light", "Long wear lip color with satin matte finish", [0.10, 0.85, 0.20, 0.45]),
            CatalogSeed("Soft Flush Blush", "blush", "Peach Story", "Peach Coral", "warm", "tan", "Natural healthy glow blush", [0.30, 0.70, 0.10, 0.65]),
            CatalogSeed("Glam Smoky Palette", "eyeshadow", "Noir Silk", "Cocoa Bronze", "cool", "deep", "High pigment eye palette", [0.25, 0.55, 0.65, 0.20]),
            CatalogSeed("K-Glass Skin Primer", "base", "Lumi Seoul", "Soft Pink", "neutral", "fair", "Radiant primer for glass skin looks", [0.70, 0.25, 0.18, 0.35]),
            CatalogSeed("Bridal Dew Highlighter", "highlight", "Radiance House", "Champagne Pearl", "warm", "light", "Soft-focus highlighter for events", [0.80, 0.40, 0.25, 0.60]),
        ]

    def seed_catalog(self, db: Session) -> None:
        existing_count = db.scalar(select(ProductCatalog).limit(1))
        if existing_count is not None:
            return

        for item in self.default_catalog():
            db.add(
                ProductCatalog(
                    name=item.name,
                    category=item.category,
                    brand=item.brand,
                    shade=item.shade,
                    undertone=item.undertone,
                    skin_tone=item.skin_tone,
                    description=item.description,
                    embedding_json=json.dumps(item.embedding),
                )
            )
        db.commit()

    def list_catalog(self, db: Session) -> list[ProductCatalog]:
        return list(db.scalars(select(ProductCatalog).order_by(ProductCatalog.category, ProductCatalog.id)).all())

    def encode_product(self, product: ProductCatalog) -> np.ndarray:
        if product.embedding_json:
            try:
                return np.array(json.loads(product.embedding_json), dtype=np.float32)
            except json.JSONDecodeError:
                pass

        vector = np.array(
            [
                len(product.name) % 11,
                len(product.category) % 13,
                len(product.shade or "") % 17,
                len(product.description or "") % 19,
            ],
            dtype=np.float32,
        )
        return vector / (np.linalg.norm(vector) + 1e-6)
