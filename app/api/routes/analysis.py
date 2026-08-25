"""
API route for resume vs job-description analysis.
"""

from fastapi import APIRouter, Form

from app.services.analysis_service import AnalysisService
from app.services.llm_service import LLMService


router = APIRouter()

# Create the LLM and analysis services once when the application starts.
llm_service = LLMService()
analysis_service = AnalysisService(llm=llm_service)


@router.post("/analyse")
async def analyse_resume(
    resume_text: str = Form(...),
    jd_text: str = Form(...),
):
    """
    Analyze a resume against a job description using Gemini.
    """

    result = await analysis_service.run_analysis(
        resume_text=resume_text,
        jd_text=jd_text,
    )

    return result