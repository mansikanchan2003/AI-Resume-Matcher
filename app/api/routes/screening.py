"""
API route for the AI-assisted candidate screening worker.
"""

from fastapi import APIRouter

from app.models.requests import ScreeningWorkerRequest
from app.models.responses import ScreeningEvaluationResponse
from app.services.analysis_service import AnalysisService
from app.services.llm_service import LLMService
from app.workers.screening_worker import ScreeningWorker


router = APIRouter()

# Create services once when the application starts.
llm_service = LLMService()
analysis_service = AnalysisService(llm=llm_service)
screening_worker = ScreeningWorker(
    analysis_service=analysis_service
)


@router.post(
    "/screen",
    response_model=ScreeningEvaluationResponse,
)
async def screen_candidate(
    request: ScreeningWorkerRequest,
):
    """
    Run the complete AI-assisted candidate screening workflow.
    """

    return await screening_worker.run(
    resume_text=request.resume_text,
    jd_text=request.jd_text,
    job_title=request.job_title,
)