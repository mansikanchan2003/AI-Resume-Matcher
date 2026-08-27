"""
API route integration tests.
"""

from typing import cast

import pytest

from app.models.responses import (
    AnalysisResponse,
    SkillMatchResponse,
    GapDetectionResponse,
    ImprovementResponse,
    InterviewQuestionsResponse,
    MatchedTechnicalSkill,
    CriticalMissingSkill,
    StarBulletRecommendation,
    TechnicalQuestion,
    BehaviouralQuestion,
)
from app.services.llm_service import LLMService


@pytest.mark.asyncio
async def test_analyse_returns_200_with_valid_inputs(
    client,
    sample_resume_text,
    sample_jd_text,
    mock_llm_service,
    monkeypatch,
):
    from app.api.routes import analysis
    from app.services.analysis_service import AnalysisService

    mock_service = AnalysisService(
        llm=cast(LLMService, mock_llm_service)
    )

    async def fake_run_analysis(
        resume_text,
        jd_text,
    ):
        return AnalysisResponse(
            match_score=85,
            seniority_alignment="Well-Matched",
            executive_summary="Strong candidate match.",
            top_strengths=["Python", "FastAPI"],
            major_concerns=[],
        )

    monkeypatch.setattr(
        mock_service,
        "run_analysis",
        fake_run_analysis,
    )

    monkeypatch.setattr(
        analysis,
        "analysis_service",
        mock_service,
    )

    response = await client.post(
        "/api/v1/analysis/analyse",
        data={
            "resume_text": sample_resume_text,
            "jd_text": sample_jd_text,
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "match_score" in data
    assert isinstance(data["match_score"], int)
    assert 0 <= data["match_score"] <= 100


@pytest.mark.asyncio
async def test_analyse_returns_422_without_required_fields(
    client,
):
    response = await client.post(
        "/api/v1/analysis/analyse",
        data={},
    )

    assert response.status_code == 422


@pytest.mark.asyncio
async def test_analyse_returns_422_with_missing_jd(
    client,
    sample_resume_text,
):
    response = await client.post(
        "/api/v1/analysis/analyse",
        data={
            "resume_text": sample_resume_text,
        },
    )

    assert response.status_code == 422


@pytest.mark.asyncio
async def test_match_skills_returns_200(
    client,
    sample_resume_text,
    sample_jd_text,
    mock_llm_service,
    monkeypatch,
):
    from app.api.routes import matching
    from app.services.analysis_service import AnalysisService

    mock_service = AnalysisService(
        llm=cast(LLMService, mock_llm_service)
    )

    async def fake_run_skill_matching(
        resume_text,
        jd_text,
    ):
        return SkillMatchResponse(
            matched_technical_skills=[
                MatchedTechnicalSkill(
                    skill="Python",
                    resume_evidence=(
                        "2 years of Python backend development."
                    ),
                    jd_requirement="Python",
                )
            ],
            matched_soft_skills=["Communication"],
        )

    monkeypatch.setattr(
        mock_service,
        "run_skill_matching",
        fake_run_skill_matching,
    )

    monkeypatch.setattr(
        matching,
        "analysis_service",
        mock_service,
    )

    response = await client.post(
        "/api/v1/matching/match-skills",
        json={
            "resume_text": sample_resume_text,
            "jd_text": sample_jd_text,
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "matched_technical_skills" in data

    assert isinstance(
        data["matched_technical_skills"],
        list,
    )


@pytest.mark.asyncio
async def test_detect_gaps_deduplicates_matched_skills(
    client,
    sample_resume_text,
    sample_jd_text,
    mock_llm_service,
    monkeypatch,
):
    from app.api.routes import gaps
    from app.services.analysis_service import AnalysisService

    mock_service = AnalysisService(
        llm=cast(LLMService, mock_llm_service)
    )

    async def fake_run_gap_detection(
        resume_text,
        jd_text,
        matched_skills,
    ):
        return GapDetectionResponse(
            critical_missing_skills=[
                CriticalMissingSkill(
                    skill="Docker",
                    jd_clause="Docker experience required.",
                )
            ],
            secondary_missing_skills=[],
            experience_discrepancies=[],
        )

    monkeypatch.setattr(
        mock_service,
        "run_gap_detection",
        fake_run_gap_detection,
    )

    monkeypatch.setattr(
        gaps,
        "analysis_service",
        mock_service,
    )

    response = await client.post(
        "/api/v1/gaps/detect-gaps",
        json={
            "resume_text": sample_resume_text,
            "jd_text": sample_jd_text,
            "matched_skills": [
                "Python",
                "FastAPI",
                "REST APIs",
            ],
        },
    )

    assert response.status_code == 200

    data = response.json()

    matched_skills = {
        "python",
        "fastapi",
        "rest apis",
    }

    missing_skills = {
        item["skill"].lower()
        for item in data["critical_missing_skills"]
    }

    assert matched_skills.isdisjoint(
        missing_skills
    )


@pytest.mark.asyncio
async def test_improvements_returns_star_bullets(
    client,
    sample_resume_text,
    mock_llm_service,
    monkeypatch,
):
    from app.api.routes import improvements
    from app.services.analysis_service import AnalysisService

    async def fake_run_improvements(
        resume_text,
        job_title,
        critical_gaps,
    ):
        return ImprovementResponse(
            tailored_summary_statement=(
                "Python backend developer experienced "
                "in FastAPI and REST APIs."
            ),
            star_bullet_recommendations=[
                StarBulletRecommendation(
                    target_skill="FastAPI",
                    current_resume_context=(
                        "Built REST APIs."
                    ),
                    suggested_star_bullet=(
                        "Developed FastAPI REST APIs that "
                        "improved backend service reliability."
                    ),
                    improvement_reason=(
                        "Adds measurable and role-relevant impact."
                    ),
                )
            ],
            high_value_keywords_to_include=[
                "Python",
                "FastAPI",
                "REST APIs",
            ],
        )

    mock_service = AnalysisService(
        llm=cast(LLMService, mock_llm_service)
    )

    monkeypatch.setattr(
        mock_service,
        "run_improvements",
        fake_run_improvements,
    )

    monkeypatch.setattr(
        improvements,
        "analysis_service",
        mock_service,
    )

    response = await client.post(
        "/api/v1/improvements/suggest",
        json={
            "resume_text": sample_resume_text,
            "job_title": "Python Backend Engineer",
            "critical_gaps": [
                {
                    "skill": "FastAPI",
                    "jd_clause": (
                        "FastAPI experience required."
                    ),
                }
            ],
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert isinstance(
        data["star_bullet_recommendations"],
        list,
    )

    assert len(
        data["star_bullet_recommendations"]
    ) > 0


@pytest.mark.asyncio
async def test_interview_returns_correct_question_counts(
    client,
    sample_jd_text,
    mock_llm_service,
    monkeypatch,
):
    from app.api.routes import interview
    from app.services.analysis_service import AnalysisService

    async def fake_run_interview_prep(
        jd_text,
        matched_skills,
        missing_skills,
    ):
        return InterviewQuestionsResponse(
            technical_questions=[
                TechnicalQuestion(
                    question=f"Technical question {i}",
                    focus_area="Python",
                    evaluation_criteria=(
                        "Technical understanding"
                    ),
                )
                for i in range(3)
            ],
            behavioural_questions=[
                BehaviouralQuestion(
                    question=f"Behavioural question {i}",
                    competency="Communication",
                    evaluation_criteria=(
                        "Clear communication"
                    ),
                )
                for i in range(2)
            ],
        )

    mock_service = AnalysisService(
        llm=cast(LLMService, mock_llm_service)
    )

    monkeypatch.setattr(
        mock_service,
        "run_interview_prep",
        fake_run_interview_prep,
    )

    monkeypatch.setattr(
        interview,
        "analysis_service",
        mock_service,
    )

    response = await client.post(
        "/api/v1/interview/generate",
        json={
            "jd_text": sample_jd_text,
            "matched_skills": [
                "Python",
                "FastAPI",
            ],
            "missing_skills": [
                {
                    "skill": "Docker",
                    "jd_clause": (
                        "Docker experience required."
                    ),
                }
            ],
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert len(
        data["technical_questions"]
    ) == 3

    assert len(
        data["behavioural_questions"]
    ) == 2