"""
Pydantic response models for the AI Resume & JD Matcher.
"""

from typing import Literal

from pydantic import BaseModel, Field


# ─────────────────────────────────────────────────────────────
# Prompt 1 — High-Level Match Analysis
# ─────────────────────────────────────────────────────────────

class AnalysisResponse(BaseModel):
    match_score: int = Field(..., ge=0, le=100)
    seniority_alignment: Literal[
        "Underqualified",
        "Well-Matched",
        "Overqualified",
    ]
    executive_summary: str
    top_strengths: list[str]
    major_concerns: list[str]


# ─────────────────────────────────────────────────────────────
# Prompt 2 — Skill Matching
# ─────────────────────────────────────────────────────────────

class MatchedTechnicalSkill(BaseModel):
    skill: str
    resume_evidence: str
    jd_requirement: str


class SkillMatchResponse(BaseModel):
    matched_technical_skills: list[MatchedTechnicalSkill]
    matched_soft_skills: list[str]


# ─────────────────────────────────────────────────────────────
# Prompt 3 — Gap Detection
# ─────────────────────────────────────────────────────────────

class CriticalMissingSkill(BaseModel):
    skill: str
    jd_clause: str


class GapDetectionResponse(BaseModel):
    critical_missing_skills: list[CriticalMissingSkill]
    secondary_missing_skills: list[CriticalMissingSkill]
    experience_discrepancies: list[str]


# ─────────────────────────────────────────────────────────────
# Prompt 4 — Resume Improvements
# ─────────────────────────────────────────────────────────────

class StarBulletRecommendation(BaseModel):
    target_skill: str
    current_resume_context: str
    suggested_star_bullet: str
    improvement_reason: str


class ImprovementResponse(BaseModel):
    tailored_summary_statement: str
    star_bullet_recommendations: list[StarBulletRecommendation]
    high_value_keywords_to_include: list[str]


# ─────────────────────────────────────────────────────────────
# Prompt 5 — Interview Preparation
# ─────────────────────────────────────────────────────────────

class TechnicalQuestion(BaseModel):
    question: str
    focus_area: str
    evaluation_criteria: str


class BehaviouralQuestion(BaseModel):
    question: str
    competency: str
    evaluation_criteria: str


class InterviewQuestionsResponse(BaseModel):
    technical_questions: list[TechnicalQuestion]
    behavioural_questions: list[BehaviouralQuestion]

# ─────────────────────────────────────────────────────────────
# AI Screening Worker
# ─────────────────────────────────────────────────────────────

class ScreeningEvaluationResponse(BaseModel):
    """
    Structured output produced by the AI-assisted screening worker.

    The worker supports recruiter decision-making and does not make
    a final hiring or rejection decision.
    """

    match_score: int = Field(..., ge=0, le=100)

    recommendation: Literal[
        "Proceed to Human Review",
        "Needs More Information",
    ]

    seniority_alignment: Literal[
        "Underqualified",
        "Well-Matched",
        "Overqualified",
    ]

    executive_summary: str

    strengths: list[str]

    matched_technical_skills: list[MatchedTechnicalSkill]

    matched_soft_skills: list[str]

    critical_gaps: list[CriticalMissingSkill]

    secondary_gaps: list[CriticalMissingSkill]

    experience_discrepancies: list[str]

    risks: list[str]

    resume_improvements: ImprovementResponse

    interview_preparation: InterviewQuestionsResponse

    information_requiring_verification: list[str]

    next_steps: list[str]

    escalation_required: bool

    escalation_reason: str | None