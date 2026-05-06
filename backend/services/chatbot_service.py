from __future__ import annotations

import json
from dataclasses import dataclass

import httpx

from backend.config import get_settings
from backend.services.catalog_service import CatalogService


@dataclass
class ChatResponse:
    answer: str
    confidence: float
    citations: list[str]


class BeautyAssistantService:
    def __init__(self) -> None:
        self.settings = get_settings()
        self.catalog_service = CatalogService()

    def chat(self, message: str, user_profile: dict | None = None) -> ChatResponse:
        catalog_context = self._build_catalog_context()
        profile_context = json.dumps(user_profile or {}, ensure_ascii=False)
        prompt = (
            "You are a makeup consultant for an AI beauty-tech platform. "
            "Use the provided product catalog and user profile to answer with concise, practical recommendations.\n\n"
            f"User message: {message}\n"
            f"User profile: {profile_context}\n"
            f"Product catalog: {catalog_context}\n\n"
            "Return a recommendation-focused answer with one short explanation and one product suggestion."
        )

        try:
            with httpx.Client(timeout=15.0) as client:
                response = client.post(
                    f"{self.settings.ollama_base_url}/api/generate",
                    json={
                        "model": self.settings.ollama_model,
                        "prompt": prompt,
                        "stream": False,
                    },
                )
                response.raise_for_status()
                payload = response.json()
                answer = payload.get("response") or payload.get("message") or self._fallback_answer(message)
                return ChatResponse(answer=answer.strip(), confidence=0.92, citations=["ollama", "product-catalog", "face-analysis-pipeline"])
        except Exception:
            return ChatResponse(answer=self._fallback_answer(message), confidence=0.78, citations=["fallback-rules", "product-catalog"])

    def _build_catalog_context(self) -> str:
        samples = self.catalog_service.default_catalog()[:4]
        return "; ".join(f"{item.category}:{item.name}:{item.shade}:{item.undertone}:{item.skin_tone}" for item in samples)

    def _fallback_answer(self, message: str) -> str:
        lowered = message.lower()
        if 'foundation' in lowered:
            return 'For foundation matching, compare undertone first, then skin depth, then finish preference.'
        if 'lipstick' in lowered:
            return 'Warm undertones usually pair well with terracotta, peach, and brick-red lip shades.'
        return 'Upload a clear front-facing image and I will analyze undertone, face shape, and product fit.'
