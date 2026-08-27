"""
app/api/routes/improvements.py

Resume Improvement Suggestions Endpoint.
"""

from fastapi import APIRouter

from app.models.requests import ImprovementRequest
from app.models.responses import ImprovementResponse
from app.services.analysis_service import AnalysisService
from app.services.llm_service import LLMService


router = APIRouter()

# Create the LLM and analysis services once when the application starts.
llm_service = LLMService()
analysis_service = AnalysisService(llm=llm_service)


@router.post(
    "/suggest",
    response_model=ImprovementResponse,
)
async def suggest_improvements(
    payload: ImprovementRequest,
):
    """Generate targeted ATS and STAR resume improvements."""

    result = await analysis_service.run_improvements(
        resume_text=payload.resume_text,
        job_title=payload.job_title,
        critical_gaps=payload.critical_gaps,
    )

    return result