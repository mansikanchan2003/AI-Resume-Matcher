"""
app/dependencies.py — FastAPI Dependency Injection Providers
============================================================
Defines reusable FastAPI dependencies injected into route handlers
via `Depends()`. Keeps route handlers thin and logic centralised.

Responsibilities:
- Provide a validated LLMService instance per request.
- Validate that uploaded files are of an accepted MIME type
  (application/pdf, text/plain, .docx).
- Expose a rate-limiter dependency placeholder for future use.

Usage in routes:
    @router.post("/analyse")
    async def analyse(llm: LLMService = Depends(get_llm_service)):
        ...
"""

# TODO: from app.services.llm_service import LLMService
# TODO: from app.config import settings

# async def get_llm_service() -> LLMService:
#     """Yields an initialised LLMService; raises 503 if API key is missing."""
#     ...

# async def validate_file_type(file: UploadFile) -> UploadFile:
#     """Raises HTTP 415 if the file extension is not in the allowlist."""
#     ...
