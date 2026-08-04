from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path
import numpy as np
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload
import logging

from backend.models.recommendation import Product, ProductShade

logger = logging.getLogger(__name__)


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
    def __init__(self):
        """Initialize catalog service with optional CNN predictor for embeddings."""
        self.predictor = None
        self._init_predictor()
    
    def _init_predictor(self):
        """Lazy load CNN predictor for embedding generation."""
        try:
            from backend.ml.inference import MakeupPredictor
            self.predictor = MakeupPredictor()
        except Exception as e:
            logger.warning(f"Failed to initialize predictor for embeddings: {e}")

    def default_catalog(self) -> list[CatalogSeed]:
        """Return default product catalog with CNN-derived embeddings (fallback)."""
        return [
            CatalogSeed("Luminous Skin Foundation", "foundation", "Glow Atelier", "Warm Beige", "warm", "medium", "Hydrating medium-coverage foundation", [0.95, 0.2, 0.15, 0.05]),
            CatalogSeed("Velvet Matte Lip", "lipstick", "Velvet Muse", "Rose Clay", "neutral", "light", "Long wear lip color with satin matte finish", [0.10, 0.85, 0.20, 0.45]),
            CatalogSeed("Soft Flush Blush", "blush", "Peach Story", "Peach Coral", "warm", "tan", "Natural healthy glow blush", [0.30, 0.70, 0.10, 0.65]),
            CatalogSeed("Glam Smoky Palette", "eyeshadow", "Noir Silk", "Cocoa Bronze", "cool", "deep", "High pigment eye palette", [0.25, 0.55, 0.65, 0.20]),
            CatalogSeed("K-Glass Skin Primer", "base", "Lumi Seoul", "Soft Pink", "neutral", "fair", "Radiant primer for glass skin looks", [0.70, 0.25, 0.18, 0.35]),
            CatalogSeed("Bridal Dew Highlighter", "highlight", "Radiance House", "Champagne Pearl", "warm", "light", "Soft-focus highlighter for events", [0.80, 0.40, 0.25, 0.60]),
        ]

    def seed_catalog(self, db: Session) -> None:
        """Seed product catalog from JSON fixture into database."""
        fixture_path = Path(__file__).resolve().parent.parent / "fixtures" / "catalog_seed.json"
        if not fixture_path.exists():
            logger.warning(f"Seed fixture not found at {fixture_path}, using static fallback")
            self._seed_static_fallback(db)
            return

        existing_count = db.scalar(select(Product).limit(1))
        if existing_count is not None:
            return

        try:
            with open(fixture_path, "r", encoding="utf-8") as f:
                catalog_data = json.load(f)

            for item in catalog_data:
                product = Product(
                    name=item["name"],
                    brand=item["brand"],
                    category=item["category"],
                    description=item.get("description"),
                    price=item.get("price", 0.0),
                    image_url=item.get("image_url")
                )
                db.add(product)
                db.flush()

                for shade_data in item.get("shades", []):
                    # Try to use CNN-derived embedding, fallback to static
                    embedding_vec = self._generate_cnn_embedding(product.name, f"{product.description or ''} {shade_data['shade_name']}")
                    embedding_list = embedding_vec.tolist() if isinstance(embedding_vec, np.ndarray) else [0.5, 0.5, 0.5, 0.5]

                    shade = ProductShade(
                        product_id=product.id,
                        shade_name=shade_data["shade_name"],
                        skin_tone=shade_data["skin_tone"],
                        undertone=shade_data["undertone"],
                        hex_color=shade_data["hex_color"],
                        lab_l=shade_data["lab_l"],
                        lab_a=shade_data["lab_a"],
                        lab_b=shade_data["lab_b"],
                        embedding_json=json.dumps(embedding_list),
                    )
                    db.add(shade)

            db.commit()
            logger.info("Product catalog and shades seeded from JSON fixture successfully")
        except Exception as e:
            db.rollback()
            logger.error(f"Failed to seed catalog: {e}")
            raise

    def _seed_static_fallback(self, db: Session) -> None:
        """Seed static fallback list if catalog_seed.json is unavailable."""
        existing_count = db.scalar(select(Product).limit(1))
        if existing_count is not None:
            return

        for item in self.default_catalog():
            product = Product(
                name=item.name,
                brand=item.brand,
                category=item.category,
                description=item.description,
                price=25.0,
                image_url=None
            )
            db.add(product)
            db.flush()

            embedding_vec = self._generate_cnn_embedding(item.name, item.description)
            embedding_list = embedding_vec.tolist() if isinstance(embedding_vec, np.ndarray) else item.embedding

            shade = ProductShade(
                product_id=product.id,
                shade_name=item.shade,
                skin_tone=item.skin_tone,
                undertone=item.undertone,
                hex_color="#E09080",
                lab_l=60.0,
                lab_a=20.0,
                lab_b=20.0,
                embedding_json=json.dumps(embedding_list),
            )
            db.add(shade)
        db.commit()
        logger.info("Product catalog seeded with static fallback data")

    def _generate_cnn_embedding(self, product_name: str, description: str) -> np.ndarray:
        """Generate CNN-based embedding for product using text features."""
        if self.predictor is None:
            return np.array([0.5, 0.5, 0.5, 0.5], dtype=np.float32)
        
        try:
            profile = {
                "product_name": product_name,
                "description": description,
            }
            return self.predictor.encode_profile(profile)
        except Exception as e:
            logger.warning(f"CNN embedding generation failed: {e}, using fallback")
            return np.array([0.5, 0.5, 0.5, 0.5], dtype=np.float32)

    def list_catalog(self, db: Session) -> list[ProductShade]:
        """List all shades and join their parent products."""
        return list(
            db.scalars(
                select(ProductShade)
                .join(Product)
                .options(joinedload(ProductShade.product))
                .order_by(Product.category, ProductShade.id)
            ).all()
        )

    def encode_product(self, shade: ProductShade) -> np.ndarray:
        """Encode product shade to embedding vector for recommendation similarity."""
        if shade.embedding_json:
            try:
                return np.array(json.loads(shade.embedding_json), dtype=np.float32)
            except json.JSONDecodeError:
                pass

        # Fallback: generate embedding from shade details
        product = shade.product
        vector = np.array(
            [
                len(product.name) % 11,
                len(product.category) % 13,
                len(shade.shade_name or "") % 17,
                len(product.description or "") % 19,
            ],
            dtype=np.float32,
        )
        return vector / (np.linalg.norm(vector) + 1e-6)

