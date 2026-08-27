"""
app/api/routes/interview.py

Interview Question Generation Endpoint.
"""

from fastapi import APIRouter

from app.models.requests import InterviewRequest
from app.models.responses import InterviewQuestionsResponse
from app.services.analysis_service import AnalysisService
from app.services.llm_service import LLMService


router = APIRouter()

# Create the LLM and analysis services once when the application starts.
llm_service = LLMService()
analysis_service = AnalysisService(llm=llm_service)


@router.post(
    "/generate",
    response_model=InterviewQuestionsResponse,
)
async def generate_interview_questions(
    payload: InterviewRequest,
):
    """Generate targeted technical and behavioural interview questions."""

    result = await analysis_service.run_interview_prep(
        jd_text=payload.jd_text,
        matched_skills=payload.matched_skills,
        missing_skills=payload.missing_skills,
    )

    return result