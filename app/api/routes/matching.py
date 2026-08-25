"""
API route for resume vs job-description skill matching.
"""

from fastapi import APIRouter

from app.models.requests import SkillMatchRequest
from app.models.responses import SkillMatchResponse
from app.services.analysis_service import AnalysisService
from app.services.llm_service import LLMService


router = APIRouter()

# Create shared services once when the application starts.
llm_service = LLMService()
analysis_service = AnalysisService(llm=llm_service)


@router.post(
    "/match-skills",
    response_model=SkillMatchResponse,
)
async def match_skills(payload: SkillMatchRequest):
    """
    Match technical and soft skills between a resume and job description.
    """

    result = await analysis_service.run_skill_matching(
        resume_text=payload.resume_text,
        jd_text=payload.jd_text,
    )

    return result