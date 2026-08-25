"""
tests/test_services/test_llm_service.py — LLM Service Unit Tests
================================================================
Unit tests for LLMService. All external API calls are mocked.

Test cases to implement:
  test_complete_returns_validated_pydantic_object
      Given a mock SDK that returns valid JSON string,
      assert LLMService.complete() returns the correct Pydantic model.

  test_complete_raises_http_422_on_invalid_json
      Given a mock SDK that returns malformed JSON,
      assert LLMService.complete() raises HTTPException with status 422.

  test_complete_raises_http_401_on_auth_error
      Given a mock SDK that raises an AuthenticationError,
      assert LLMService.complete() raises HTTPException with status 401.

  test_complete_raises_http_429_on_rate_limit
      Given a mock SDK that raises a RateLimitError,
      assert LLMService.complete() raises HTTPException with status 429.

  test_parser_service_extracts_txt
      Given raw bytes of a .txt file,
      assert ParserService.extract() returns non-empty cleaned string.

  test_parser_service_raises_on_unsupported_format
      Given bytes with filename "resume.exe",
      assert ParserService.extract() raises ValueError.
"""

# TODO: import pytest
# TODO: from unittest.mock import patch, AsyncMock
# TODO: from app.services.llm_service import LLMService
# TODO: from app.services.parser_service import ParserService

# @pytest.mark.asyncio
# async def test_complete_returns_validated_pydantic_object(mock_llm_service):
#     ...

# def test_parser_service_extracts_txt():
#     ...
