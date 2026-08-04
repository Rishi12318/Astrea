"""Unit tests for the recommendation engine.

Tests verify that changing user attributes changes the ranked recommendations
deterministically — a key correctness property of the vector-space ranker.
"""
from __future__ import annotations

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.database.base import Base
from backend.models import feedback, recommendation, user  # noqa: F401  – register models
from backend.services.catalog_service import CatalogService
from backend.services.recommendation_service import (
    RecommendationService,
    _build_user_vector,
    _build_product_vector,
    _skin_tone_to_lab_l,
    _undertone_to_ab,
)

# Standalone in-memory SQLite DB for unit tests
_engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
_Session = sessionmaker(bind=_engine)


@pytest.fixture(scope="module", autouse=True)
def seeded_db():
    Base.metadata.create_all(bind=_engine)
    db = _Session()
    try:
        CatalogService().seed_catalog(db)
    finally:
        db.close()
    yield
    Base.metadata.drop_all(bind=_engine)


@pytest.fixture()
def db_session():
    db = _Session()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture()
def service():
    return RecommendationService()


# ------------------------------------------------------------------ #
# Helper                                                              #
# ------------------------------------------------------------------ #

def _recommend(service, db, skin_tone, undertone, occasion="daily"):
    return service.recommend(
        db,
        {"skin_tone": skin_tone, "undertone": undertone, "occasion": occasion, "user_id": 0},
    )


# ------------------------------------------------------------------ #
# Tests                                                               #
# ------------------------------------------------------------------ #

class TestUserVectorMapping:
    """Verify that user vector encodes skin tone and undertone correctly."""

    def test_fair_lighter_than_deep(self):
        vec_fair = _build_user_vector({"skin_tone": "Fair", "undertone": "Neutral"})
        vec_deep = _build_user_vector({"skin_tone": "Deep", "undertone": "Neutral"})
        # Fair should have a larger normalised L* component
        assert vec_fair[0] > vec_deep[0]

    def test_warm_undertone_higher_b_star(self):
        vec_warm = _build_user_vector({"skin_tone": "Medium", "undertone": "Warm"})
        vec_cool = _build_user_vector({"skin_tone": "Medium", "undertone": "Cool"})
        # Warm undertone → higher b* (yellow shift)
        assert vec_warm[2] > vec_cool[2]


class TestRecommendationDeterminism:
    """Changing skin attributes must change the ranked output deterministically."""

    def test_different_undertone_changes_top_product(self, service, db_session):
        result_warm = _recommend(service, db_session, skin_tone="Medium", undertone="Warm")
        result_cool = _recommend(service, db_session, skin_tone="Medium", undertone="Cool")
        assert result_warm.products, "Empty results for Warm profile"
        assert result_cool.products, "Empty results for Cool profile"
        # The ranked order or top product should differ
        warm_names = [p.name for p in result_warm.products]
        cool_names = [p.name for p in result_cool.products]
        assert warm_names != cool_names or result_warm.products[0].score != result_cool.products[0].score

    def test_different_skin_tone_changes_scores(self, service, db_session):
        result_fair = _recommend(service, db_session, skin_tone="Fair", undertone="Neutral")
        result_deep = _recommend(service, db_session, skin_tone="Deep", undertone="Neutral")
        scores_fair = [p.score for p in result_fair.products]
        scores_deep = [p.score for p in result_deep.products]
        assert scores_fair != scores_deep, "Scores must differ between Fair and Deep profiles"

    def test_bridal_occasion_returns_bridal_style(self, service, db_session):
        result = _recommend(service, db_session, skin_tone="Light", undertone="Warm", occasion="wedding")
        assert result.style == "Bridal"

    def test_party_occasion_returns_glam_style(self, service, db_session):
        result = _recommend(service, db_session, skin_tone="Medium", undertone="Neutral", occasion="party")
        assert result.style == "Glam"

    def test_results_have_non_empty_reason(self, service, db_session):
        result = _recommend(service, db_session, skin_tone="Tan", undertone="Cool")
        for product in result.products:
            assert product.reason, "Each recommendation must have a non-empty reason"

    def test_confidence_between_0_and_1(self, service, db_session):
        result = _recommend(service, db_session, skin_tone="Medium", undertone="Warm")
        assert 0.0 <= result.confidence <= 1.0


class TestChatbotFallback:
    """Chatbot rule-based fallback returns relevant answers without network."""

    def test_foundation_fallback(self):
        from backend.services.chatbot_service import BeautyAssistantService
        svc = BeautyAssistantService()
        reply = svc._fallback_answer("How do I choose a foundation shade?")
        assert "foundation" in reply.lower()

    def test_lipstick_fallback(self):
        from backend.services.chatbot_service import BeautyAssistantService
        svc = BeautyAssistantService()
        reply = svc._fallback_answer("What lipstick shade suits me?")
        assert any(word in reply.lower() for word in ["lip", "warm", "cool", "shade"])

    def test_off_topic_fallback(self):
        from backend.services.chatbot_service import BeautyAssistantService
        svc = BeautyAssistantService()
        reply = svc._fallback_answer("What is the capital of France?")
        assert len(reply) > 10  # Should return a non-empty fallback
