"""
app/services/analysis_service.py

Orchestration service for resume and job-description analysis.
"""

import json

from app.models.responses import (
    AnalysisResponse,
    SkillMatchResponse,
    GapDetectionResponse,
    ImprovementResponse,
    InterviewQuestionsResponse,
)

from app.prompts.analysis_prompt import (
    ANALYSIS_SYSTEM_PROMPT,
    build_analysis_prompt,
)

from app.prompts.matching_prompt import (
    MATCHING_SYSTEM_PROMPT,
    build_matching_prompt,
)

from app.prompts.gaps_prompt import (
    GAPS_SYSTEM_PROMPT,
    build_gaps_prompt,
)

from app.prompts.improvement_prompt import (
    IMPROVEMENT_SYSTEM_PROMPT,
    build_improvement_prompt,
)

from app.prompts.interview_prompt import (
    INTERVIEW_SYSTEM_PROMPT,
    build_interview_prompt,
)

from app.services.llm_service import LLMService


class AnalysisService:
    """Coordinates prompts, LLM calls, and response validation."""

    def __init__(self, llm: LLMService):
        self.llm = llm

    async def run_analysis(
        self,
        resume_text: str,
        jd_text: str,
    ) -> AnalysisResponse:
        """Run high-level resume vs JD analysis."""

        user_prompt = build_analysis_prompt(
            resume_text=resume_text,
            jd_text=jd_text,
        )

        return await self.llm.complete(
            system_prompt=ANALYSIS_SYSTEM_PROMPT,
            user_prompt=user_prompt,
            response_model=AnalysisResponse,
        )

    async def run_skill_matching(
        self,
        resume_text: str,
        jd_text: str,
    ) -> SkillMatchResponse:
        """Match technical and soft skills between resume and JD."""

        user_prompt = build_matching_prompt(
            resume_text=resume_text,
            jd_text=jd_text,
        )

        return await self.llm.complete(
            system_prompt=MATCHING_SYSTEM_PROMPT,
            user_prompt=user_prompt,
            response_model=SkillMatchResponse,
        )

    async def run_gap_detection(
        self,
        resume_text: str,
        jd_text: str,
        matched_skills: list[str],
    ) -> GapDetectionResponse:
        """Detect skills and experience gaps."""

        matched_skills_json = json.dumps(
            matched_skills,
            ensure_ascii=False,
            indent=2,
        )

        user_prompt = build_gaps_prompt(
            resume_text=resume_text,
            jd_text=jd_text,
            matched_skills_json=matched_skills_json,
        )

        return await self.llm.complete(
            system_prompt=GAPS_SYSTEM_PROMPT,
            user_prompt=user_prompt,
            response_model=GapDetectionResponse,
        )

    async def run_improvements(
        self,
        resume_text: str,
        job_title: str,
        critical_gaps: list[dict],
    ) -> ImprovementResponse:
        """Generate ATS and STAR-based resume improvements."""

        critical_gaps_json = json.dumps(
            critical_gaps,
            ensure_ascii=False,
            indent=2,
        )

        user_prompt = build_improvement_prompt(
            resume_text=resume_text,
            job_title=job_title,
            critical_gaps_json=critical_gaps_json,
        )

        return await self.llm.complete(
            system_prompt=IMPROVEMENT_SYSTEM_PROMPT,
            user_prompt=user_prompt,
            response_model=ImprovementResponse,
        )

    async def run_interview_prep(
        self,
        jd_text: str,
        matched_skills: list[str],
        missing_skills: list[dict],
    ) -> InterviewQuestionsResponse:
        """Generate targeted interview questions."""

        matched_skills_json = json.dumps(
            matched_skills,
            ensure_ascii=False,
            indent=2,
        )

        missing_skills_json = json.dumps(
            missing_skills,
            ensure_ascii=False,
            indent=2,
        )

        user_prompt = build_interview_prompt(
            jd_text=jd_text,
            matched_skills_json=matched_skills_json,
            missing_skills_json=missing_skills_json,
        )

        return await self.llm.complete(
            system_prompt=INTERVIEW_SYSTEM_PROMPT,
            user_prompt=user_prompt,
            response_model=InterviewQuestionsResponse,
        )