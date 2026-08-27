"""
API tests for the AI-assisted screening worker.
"""

import pytest
from fastapi import HTTPException

from app.models.responses import (
    AnalysisResponse,
    CriticalMissingSkill,
    GapDetectionResponse,
    ImprovementResponse,
    InterviewQuestionsResponse,
    MatchedTechnicalSkill,
    SkillMatchResponse,
)


# ------------------------------------------------------------------
# Fake service responses
# ------------------------------------------------------------------


async def _fake_analysis(
    resume_text,
    jd_text,
):
    return AnalysisResponse(
        match_score=85,
        seniority_alignment="Well-Matched",
        executive_summary="Strong candidate match.",
        top_strengths=[
            "Python",
            "FastAPI",
        ],
        major_concerns=[],
    )


async def _fake_matching(
    resume_text,
    jd_text,
):
    return SkillMatchResponse(
        matched_technical_skills=[
            MatchedTechnicalSkill(
                skill="Python",
                resume_evidence="Python backend development.",
                jd_requirement="Python experience required.",
            )
        ],
        matched_soft_skills=[
            "Communication",
        ],
    )


async def _fake_gaps_no_gaps(
    resume_text,
    jd_text,
    matched_skills,
):
    return GapDetectionResponse(
        critical_missing_skills=[],
        secondary_missing_skills=[],
        experience_discrepancies=[],
    )


async def _fake_gaps_with_critical_gap(
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


async def _fake_gaps_with_experience_gap(
    resume_text,
    jd_text,
    matched_skills,
):
    return GapDetectionResponse(
        critical_missing_skills=[],
        secondary_missing_skills=[],
        experience_discrepancies=[
            (
                "JD requires 3 years of experience; "
                "resume does not demonstrate this."
            )
        ],
    )

async def _fake_improvements(
    resume_text,
    job_title,
    critical_gaps,
):
    return ImprovementResponse(
        tailored_summary_statement=(
            "Python Backend Engineer with experience in "
            "Python and FastAPI."
        ),
        star_bullet_recommendations=[],
        high_value_keywords_to_include=[
            "Python",
            "FastAPI",
        ],
    )


async def _fake_interview_prep(
    jd_text,
    matched_skills,
    missing_skills,
):
    return InterviewQuestionsResponse(
        technical_questions=[],
        behavioural_questions=[],
    )

# ------------------------------------------------------------------
# Helper
# ------------------------------------------------------------------


def _patch_worker_services(
    monkeypatch,
    screening_worker,
    analysis,
    matching,
    gaps,
):
    monkeypatch.setattr(
        screening_worker.analysis_service,
        "run_analysis",
        analysis,
    )

    monkeypatch.setattr(
        screening_worker.analysis_service,
        "run_skill_matching",
        matching,
    )

    monkeypatch.setattr(
        screening_worker.analysis_service,
        "run_gap_detection",
        gaps,
    )

    monkeypatch.setattr(
        screening_worker.analysis_service,
        "run_improvements",
        _fake_improvements,
    )

    monkeypatch.setattr(
        screening_worker.analysis_service,
        "run_interview_prep",
        _fake_interview_prep,
    )


# ------------------------------------------------------------------
# Successful screening
# ------------------------------------------------------------------


@pytest.mark.asyncio
async def test_screening_returns_human_review_for_strong_match(
    client,
    sample_resume_text,
    sample_jd_text,
    monkeypatch,
):
    from app.api.routes import screening

    _patch_worker_services(
        monkeypatch,
        screening.screening_worker,
        _fake_analysis,
        _fake_matching,
        _fake_gaps_no_gaps,
    )

    response = await client.post(
        "/api/v1/screening/screen",
        json={
            "resume_text": sample_resume_text,
            "jd_text": sample_jd_text,
            "job_title": "Python Backend Engineer",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["match_score"] == 85
    assert data["recommendation"] == "Proceed to Human Review"
    assert data["escalation_required"] is False
    assert data["escalation_reason"] is None
    assert data["seniority_alignment"] == "Well-Matched"

    assert data["executive_summary"] == (
        "Strong candidate match."
    )

    assert "Python" in data["strengths"]
    assert "FastAPI" in data["strengths"]

    assert len(data["matched_technical_skills"]) == 1
    assert (
        data["matched_technical_skills"][0]["skill"]
        == "Python"
    )

    assert "Communication" in data["matched_soft_skills"]

    assert data["critical_gaps"] == []
    assert data["secondary_gaps"] == []
    assert data["experience_discrepancies"] == []
    assert data["risks"] == []

    assert isinstance(data["resume_improvements"], dict)
    assert isinstance(data["interview_preparation"], dict)

    assert isinstance(
        data["information_requiring_verification"],
        list,
    )

    assert len(data["next_steps"]) > 0


# ------------------------------------------------------------------
# Critical gap escalation
# ------------------------------------------------------------------


@pytest.mark.asyncio
async def test_screening_escalates_critical_gap(
    client,
    sample_resume_text,
    sample_jd_text,
    monkeypatch,
):
    from app.api.routes import screening

    _patch_worker_services(
        monkeypatch,
        screening.screening_worker,
        _fake_analysis,
        _fake_matching,
        _fake_gaps_with_critical_gap,
    )

    response = await client.post(
        "/api/v1/screening/screen",
        json={
            "resume_text": sample_resume_text,
            "jd_text": sample_jd_text,
            "job_title": "Python Backend Engineer",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["match_score"] == 85

    assert data["escalation_required"] is True

    assert data["recommendation"] == (
        "Proceed to Human Review"
    )

    assert data["escalation_reason"] is not None

    # ScreeningEvaluationResponse uses `critical_gaps`,
    # not `gaps`.
    assert len(data["critical_gaps"]) == 1

    assert data["critical_gaps"][0]["skill"] == "Docker"

    assert data["critical_gaps"][0]["jd_clause"] == (
        "Docker experience required."
    )

    assert (
        "One or more required job qualifications"
        in data["risks"][0]
    )

    assert len(data["information_requiring_verification"]) > 0

    assert any(
        "Docker"
        in item
        for item in data["information_requiring_verification"]
    )


# ------------------------------------------------------------------
# Experience discrepancy escalation
# ------------------------------------------------------------------


@pytest.mark.asyncio
async def test_screening_escalates_experience_discrepancy(
    client,
    sample_resume_text,
    sample_jd_text,
    monkeypatch,
):
    from app.api.routes import screening

    _patch_worker_services(
        monkeypatch,
        screening.screening_worker,
        _fake_analysis,
        _fake_matching,
        _fake_gaps_with_experience_gap,
    )

    response = await client.post(
        "/api/v1/screening/screen",
        json={
            "resume_text": sample_resume_text,
            "jd_text": sample_jd_text,
            "job_title": "Python Backend Engineer",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["match_score"] == 85

    assert data["escalation_required"] is True

    assert data["recommendation"] == (
        "Proceed to Human Review"
    )

    assert data["escalation_reason"] is not None

    assert len(data["experience_discrepancies"]) == 1

    assert (
        data["experience_discrepancies"][0]
        == (
            "JD requires 3 years of experience; "
            "resume does not demonstrate this."
        )
    )

    assert len(data["risks"]) > 0

    assert (
        "JD requires 3 years of experience"
        in data["risks"][0]
    )

    assert len(data["information_requiring_verification"]) > 0

    assert (
        "JD requires 3 years of experience"
        in data["information_requiring_verification"][0]
    )


# ------------------------------------------------------------------
# Request validation
# ------------------------------------------------------------------


@pytest.mark.asyncio
async def test_screening_rejects_short_resume(
    client,
    sample_jd_text,
):
    response = await client.post(
        "/api/v1/screening/screen",
        json={
            "resume_text": "Too short",
            "jd_text": sample_jd_text,
            "job_title": "Python Backend Engineer",
        },
    )

    # Pydantic/FastAPI validates the request before the worker
    # runs, so this is 422 rather than the worker's 400.
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_screening_rejects_short_job_description(
    client,
    sample_resume_text,
):
    response = await client.post(
        "/api/v1/screening/screen",
        json={
            "resume_text": sample_resume_text,
            "jd_text": "Too short",
            "job_title": "Python Backend Engineer",
        },
    )

    # Pydantic/FastAPI validates the request before the worker
    # runs, so this is 422 rather than the worker's 400.
    assert response.status_code == 422


# ------------------------------------------------------------------
# Worker failure
# ------------------------------------------------------------------


@pytest.mark.asyncio
async def test_screening_handles_worker_failure(
    client,
    sample_resume_text,
    sample_jd_text,
    monkeypatch,
):
    from app.api.routes import screening

    async def failing_run(
        resume_text,
        jd_text,
        job_title,
    ):
        raise HTTPException(
            status_code=503,
            detail="Screening service temporarily unavailable.",
        )

    monkeypatch.setattr(
        screening.screening_worker,
        "run",
        failing_run,
    )

    response = await client.post(
        "/api/v1/screening/screen",
        json={
            "resume_text": sample_resume_text,
            "jd_text": sample_jd_text,
            "job_title": "Python Backend Engineer",
        },
    )

    assert response.status_code == 503

    data = response.json()

    assert data["detail"] == (
        "Screening service temporarily unavailable."
    )