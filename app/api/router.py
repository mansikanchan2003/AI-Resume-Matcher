from fastapi import APIRouter

from app.api.routes import analysis
from app.api.routes import gaps
from app.api.routes import improvements
from app.api.routes import interview
from app.api.routes import matching

router = APIRouter()

router.include_router(
    analysis.router,
    prefix="/analysis",
    tags=["Analysis"],
)

router.include_router(
    matching.router,
    prefix="/matching",
    tags=["Matching"],
)

router.include_router(
    gaps.router,
    prefix="/gaps",
    tags=["Gaps"],
)

router.include_router(
    improvements.router,
    prefix="/improvements",
    tags=["Improvements"],
)

router.include_router(
    interview.router,
    prefix="/interview",
    tags=["Interview"],
)
