"""
app/api/routes/gaps.py

API routes for resume and job-description gap detection.
"""

from fastapi import APIRouter

from app.models.requests import GapDetectionRequest
from app.models.responses import GapDetectionResponse
from app.services.analysis_service import AnalysisService
from app.services.llm_service import LLMService


router = APIRouter()


analysis_service = AnalysisService(
    llm=LLMService()
)


@router.post(
    "/detect-gaps",
    response_model=GapDetectionResponse,
)
async def detect_gaps(
    payload: GapDetectionRequest,
):
    """Detect missing skills and experience discrepancies."""

    result = await analysis_service.run_gap_detection(
        resume_text=payload.resume_text,
        jd_text=payload.jd_text,
        matched_skills=payload.matched_skills,
    )

    return result