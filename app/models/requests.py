"""
app/models/requests.py

Pydantic request models for the AI Resume & JD Matcher.
"""

from pydantic import BaseModel, Field


class SkillMatchRequest(BaseModel):
    resume_text: str = Field(
        ...,
        min_length=100,
        description="Plain text extracted from the resume.",
    )
    jd_text: str = Field(
        ...,
        min_length=50,
        description="Raw job description text.",
    )


class GapDetectionRequest(BaseModel):
    resume_text: str = Field(
        ...,
        min_length=100,
        description="Plain text extracted from the resume.",
    )
    jd_text: str = Field(
        ...,
        min_length=50,
        description="Raw job description text.",
    )
    matched_skills: list[str] = Field(
        default_factory=list,
        description="Skills already matched by Prompt 2.",
    )


class ImprovementRequest(BaseModel):
    resume_text: str
    job_title: str
    critical_gaps: list[dict] = Field(default_factory=list)


class InterviewRequest(BaseModel):
    jd_text: str
    matched_skills: list[str] = Field(default_factory=list)
    missing_skills: list[dict] = Field(default_factory=list)