from __future__ import annotations

import json
import logging
from dataclasses import dataclass, field

import httpx
from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.config import get_settings
from backend.models.recommendation import RecommendationHistory
from backend.models.user import SkinProfile

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = (
    "You are Astrea — an expert AI beauty assistant specialising in makeup, skincare, and personal colour theory. "
    "You give actionable, personalised product and technique advice grounded in the user's actual skin profile.\n"
    "Rules:\n"
    "- Stay strictly on beauty/skincare topics. Politely decline off-topic requests.\n"
    "- Never make medical claims about skin conditions; always redirect to a dermatologist.\n"
    "- Keep responses concise (≤ 150 words unless depth is clearly needed).\n"
    "- Reference the user's skin profile and history when provided.\n"
)


@dataclass
class ChatResponse:
    answer: str
    confidence: float
    citations: list[str] = field(default_factory=list)


class BeautyAssistantService:
    def __init__(self) -> None:
        self.settings = get_settings()

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def chat(
        self,
        message: str,
        db: Session | None = None,
        user_id: int | None = None,
        history: list[dict] | None = None,
        user_profile: dict | None = None,
    ) -> ChatResponse:
        """Send a message and return the assistant's reply.

        Priority order for LLM backends:
          1. Anthropic Claude (if ANTHROPIC_API_KEY is set)
          2. Ollama (local dev fallback)
          3. Rule-based fallback
        """
        context = self._build_context(db, user_id, user_profile)
        messages = self._build_messages(history or [], message, context)

        if self.settings.anthropic_api_key:
            return self._call_anthropic(messages)
        return self._call_ollama(message, context)

    # ------------------------------------------------------------------
    # Context building
    # ------------------------------------------------------------------

    def _build_context(
        self, db: Session | None, user_id: int | None, extra_profile: dict | None
    ) -> str:
        """Fetch DB-backed skin profile and recent recommendations to ground the LLM."""
        lines: list[str] = []

        if extra_profile:
            lines.append(f"User profile (from request): {json.dumps(extra_profile, ensure_ascii=False)}")

        if db and user_id:
            # Latest skin profile
            profile = db.scalars(
                select(SkinProfile)
                .where(SkinProfile.user_id == user_id)
                .order_by(SkinProfile.created_at.desc())
                .limit(1)
            ).first()
            if profile:
                lines.append(
                    f"Stored skin profile: tone={profile.skin_tone}, undertone={profile.undertone}, "
                    f"face_shape={profile.face_shape}, eye_shape={profile.eye_shape}, lip_shape={profile.lip_shape}"
                )

            # Last 3 recommendations
            recs = db.scalars(
                select(RecommendationHistory)
                .where(RecommendationHistory.user_id == user_id)
                .order_by(RecommendationHistory.created_at.desc())
                .limit(3)
            ).all()
            if recs:
                snippets: list[str] = []
                for r in recs:
                    try:
                        payload = json.loads(r.response_payload)
                        top = payload.get("products", [])[:2]
                        snippets.append(", ".join(p.get("name", "") for p in top))
                    except Exception:
                        pass
                if snippets:
                    lines.append(f"Recent recommendations: {'; '.join(snippets)}")

        return "\n".join(lines) if lines else "No stored profile available."

    def _build_messages(
        self, history: list[dict], new_message: str, context: str
    ) -> list[dict]:
        """Assemble messages list in Anthropic format."""
        system_with_context = SYSTEM_PROMPT + f"\n\nUser context:\n{context}"
        msgs: list[dict] = []
        # Inject prior conversational turns
        for turn in history[-10:]:  # keep last 10 turns to avoid token overflow
            role = turn.get("role", "user")
            content = turn.get("content", "")
            if role in ("user", "assistant") and content:
                msgs.append({"role": role, "content": content})
        msgs.append({"role": "user", "content": new_message})
        return msgs

    # ------------------------------------------------------------------
    # LLM backends
    # ------------------------------------------------------------------

    def _call_anthropic(self, messages: list[dict]) -> ChatResponse:
        """Call the Anthropic /v1/messages endpoint."""
        try:
            with httpx.Client(timeout=30.0) as client:
                response = client.post(
                    "https://api.anthropic.com/v1/messages",
                    headers={
                        "x-api-key": self.settings.anthropic_api_key,
                        "anthropic-version": "2023-06-01",
                        "content-type": "application/json",
                    },
                    json={
                        "model": "claude-3-haiku-20240307",
                        "max_tokens": 512,
                        "system": SYSTEM_PROMPT,
                        "messages": messages,
                    },
                )
                response.raise_for_status()
                payload = response.json()
                answer = payload["content"][0]["text"].strip()
                return ChatResponse(answer=answer, confidence=0.95, citations=["anthropic-claude"])
        except Exception as exc:
            logger.warning(f"Anthropic call failed: {exc}, falling back to Ollama")
            # Build a simple prompt from last message for Ollama fallback
            last_user = next((m["content"] for m in reversed(messages) if m["role"] == "user"), "")
            return self._call_ollama(last_user, "")

    def _call_ollama(self, message: str, context: str) -> ChatResponse:
        """Call local Ollama /api/generate endpoint."""
        prompt = (
            f"{SYSTEM_PROMPT}\n\nUser context:\n{context}\n\n"
            f"User: {message}\nAstrea:"
        )
        try:
            with httpx.Client(timeout=20.0) as client:
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
                answer = (payload.get("response") or payload.get("message") or "").strip()
                if not answer:
                    raise ValueError("Empty response from Ollama")
                return ChatResponse(answer=answer, confidence=0.88, citations=["ollama", "user-profile"])
        except Exception as exc:
            logger.warning(f"Ollama call failed: {exc}, using rule-based fallback")
            return ChatResponse(
                answer=self._fallback_answer(message),
                confidence=0.60,
                citations=["rule-based-fallback"],
            )

    def _fallback_answer(self, message: str) -> str:
        """Minimal rule-based fallback when both LLM backends are unavailable."""
        low = message.lower()
        if "foundation" in low:
            return "For foundation: match your undertone first (warm, cool, or neutral), then choose finish (matte for oily skin, dewy for dry skin)."
        if "lipstick" in low or "lip" in low:
            return "Warm undertones suit terracotta, peach, and brick red. Cool undertones pair well with berry, mauve, and blue-red shades."
        if "blush" in low:
            return "Peach and coral blushes flatter warm undertones; rose and berry shades suit cool undertones."
        if "undertone" in low:
            return "Check your veins: greenish = warm, bluish/purple = cool, both = neutral. Also test: gold jewelry flattering = warm, silver = cool."
        return "Upload a clear front-facing image and I will analyse your undertone, face shape, and recommend products tailored to you."

