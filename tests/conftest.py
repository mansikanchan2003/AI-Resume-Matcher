"""
tests/conftest.py — Shared Pytest Fixtures
==========================================
Defines fixtures shared across all test modules.

Fixtures:
  client
      An httpx AsyncClient wrapping the FastAPI app with ASGI transport.
      Used in API route tests to make real HTTP-like requests without
      starting a live server.

  sample_resume_text
      A realistic sample resume string used across multiple tests to
      avoid test data duplication.

  sample_jd_text
      A realistic sample job description string.

  mock_llm_service
      A pytest-mock / MagicMock replacement for LLMService that returns
      hard-coded Pydantic response objects. Prevents real API calls
      during tests and keeps tests fast and free.
"""

# TODO: import pytest
# TODO: from httpx import AsyncClient, ASGITransport
# TODO: from unittest.mock import AsyncMock
# TODO: from main import app

# @pytest.fixture
# def client():
#     ...

# @pytest.fixture
# def sample_resume_text():
#     return "Jane Doe | Python Developer | ..."

# @pytest.fixture
# def sample_jd_text():
#     return "We are looking for a Python backend engineer with ..."

# @pytest.fixture
# def mock_llm_service():
#     ...
