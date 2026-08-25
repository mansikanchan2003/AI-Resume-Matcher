"""
app/services/llm_service.py

Gemini LLM API client and invocation wrapper.
"""

import asyncio
import json

from google import genai
from google.genai import types
from fastapi import HTTPException

from app.config import settings


class LLMService:
    """Service responsible for communicating with the configured LLM."""

    def __init__(self):
        """Initialize the Gemini client."""

        if settings.LLM_PROVIDER.lower() != "gemini":
            raise ValueError(
                f"Unsupported LLM provider: {settings.LLM_PROVIDER}"
            )

        if not settings.LLM_API_KEY:
            raise ValueError("LLM_API_KEY is not configured.")

        self.client = genai.Client(
            api_key=settings.LLM_API_KEY
        )

        self.model_name = settings.LLM_MODEL_NAME

    async def complete(
        self,
        system_prompt: str,
        user_prompt: str,
        response_model,
    ):
        """
        Send a prompt to Gemini and validate the JSON response
        against the supplied Pydantic response model.

        Retries temporary Gemini availability errors.
        """

        max_retries = 3
        response = None

        for attempt in range(max_retries):
            try:
                response = await self.client.aio.models.generate_content(
                    model=self.model_name,
                    contents=user_prompt,
                    config=types.GenerateContentConfig(
                        system_instruction=system_prompt,
                        temperature=settings.LLM_TEMPERATURE,
                        max_output_tokens=settings.LLM_MAX_TOKENS,
                        response_mime_type="application/json",
                    ),
                )

                break

            except Exception as exc:
                error_text = str(exc)

                is_temporary_error = (
                    "503" in error_text
                    or "UNAVAILABLE" in error_text
                    or "high demand" in error_text
                    or "temporarily unavailable" in error_text.lower()
                )

                if is_temporary_error and attempt < max_retries - 1:
                    wait_seconds = 2 ** attempt

                    print(
                        f"Gemini temporarily unavailable. "
                        f"Retrying in {wait_seconds}s "
                        f"(attempt {attempt + 1}/{max_retries})..."
                    )

                    await asyncio.sleep(wait_seconds)
                    continue

                raise HTTPException(
                    status_code=502,
                    detail=f"Gemini API request failed: {error_text}",
                ) from exc

        if response is None:
            raise HTTPException(
                status_code=502,
                detail="Gemini did not return a response.",
            )

        raw_text = response.text

        if not raw_text:
            raise HTTPException(
                status_code=502,
                detail="Gemini returned an empty response.",
            )

        try:
            parsed_json = json.loads(raw_text)

        except json.JSONDecodeError as exc:
            raise HTTPException(
                status_code=422,
                detail="Gemini returned invalid JSON.",
            ) from exc

        try:
            return response_model.model_validate(parsed_json)

        except Exception as exc:
            raise HTTPException(
                status_code=422,
                detail=(
                    f"Gemini response failed schema validation: {str(exc)}"
                ),
            ) from exc