"""
tests/test_api/test_routes.py — FastAPI Route Integration Tests
===============================================================
Tests HTTP request/response contracts for all 5 API endpoints.
Uses the `client` and `mock_llm_service` fixtures from conftest.py.
No real LLM API calls are made — all LLM responses are mocked.

Test cases to implement:
  test_analyse_returns_200_with_valid_inputs
      POST /api/v1/analysis/analyse with a valid TXT file and JD.
      Assert: status 200, response body has 'match_score' int field.

  test_analyse_returns_422_without_file
      POST /api/v1/analysis/analyse with no file attached.
      Assert: status 422 (FastAPI validation error).

  test_analyse_returns_415_with_invalid_file_type
      POST /api/v1/analysis/analyse with a .exe file.
      Assert: status 415 (Unsupported Media Type).

  test_match_skills_returns_200
      POST /api/v1/matching/match-skills with valid payload.
      Assert: status 200, 'matched_technical_skills' is a list.

  test_detect_gaps_deduplicates_matched_skills
      POST /api/v1/gaps/detect-gaps with matched skills pre-populated.
      Assert: 'critical_missing_skills' contains no skill from matched list.

  test_improvements_returns_star_bullets
      POST /api/v1/improvements/suggest with critical gaps.
      Assert: 'star_bullet_recommendations' is non-empty list.

  test_interview_returns_correct_question_counts
      POST /api/v1/interview/generate with valid payload.
      Assert: len(technical_questions) == 3, len(behavioural_questions) == 2.
"""

# TODO: import pytest
# TODO: from httpx import AsyncClient

# @pytest.mark.asyncio
# async def test_analyse_returns_200_with_valid_inputs(client, mock_llm_service):
#     ...

# @pytest.mark.asyncio
# async def test_analyse_returns_422_without_file(client):
#     ...
