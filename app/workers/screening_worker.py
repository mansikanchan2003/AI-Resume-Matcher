"""
AI-assisted candidate screening worker.

Orchestrates existing resume/JD analysis capabilities into
one bounded screening workflow.
"""

import logging

from fastapi import HTTPException

from app.models.responses import ScreeningEvaluationResponse
from app.services.analysis_service import AnalysisService


logger = logging.getLogger(__name__)


class ScreeningWorker:
    """
    AI-assisted worker responsible for the initial candidate
    screening workflow.

    The worker supports recruiter decision-making but does not
    make final hiring or rejection decisions.
    """

    def __init__(self, analysis_service: AnalysisService):
        self.analysis_service = analysis_service

    async def run(
        self,
        resume_text: str,
        jd_text: str,
        job_title: str,
    ) -> ScreeningEvaluationResponse:
        """
        Execute the complete candidate screening workflow.
        """

        # -----------------------------------------------------
        # 1. Validate input
        # -----------------------------------------------------

        if not resume_text or not resume_text.strip():
            raise HTTPException(
                status_code=400,
                detail="Resume text is required.",
            )

        if not jd_text or not jd_text.strip():
            raise HTTPException(
                status_code=400,
                detail="Job description text is required.",
            )

        if not job_title or not job_title.strip():
            raise HTTPException(
                status_code=400,
                detail="Job title is required.",
            )

        if len(resume_text.strip()) < 100:
            raise HTTPException(
                status_code=400,
                detail="Resume text is too short for reliable screening.",
            )

        if len(jd_text.strip()) < 50:
            raise HTTPException(
                status_code=400,
                detail="Job description is too short for reliable screening.",
            )

        if len(job_title.strip()) < 2:
            raise HTTPException(
                status_code=400,
                detail="Job title is too short.",
            )

        logger.info(
            "Starting candidate screening workflow for role: %s",
            job_title.strip(),
        )

        # -----------------------------------------------------
        # 2. High-level resume/JD analysis
        # -----------------------------------------------------

        try:
            analysis = await self.analysis_service.run_analysis(
                resume_text=resume_text,
                jd_text=jd_text,
            )

            # -------------------------------------------------
            # 3. Skill matching
            # -------------------------------------------------

            matching = await self.analysis_service.run_skill_matching(
                resume_text=resume_text,
                jd_text=jd_text,
            )

            matched_skills = [
                skill.skill
                for skill in matching.matched_technical_skills
            ]

            # -------------------------------------------------
            # 4. Gap detection
            # -------------------------------------------------

            gaps = await self.analysis_service.run_gap_detection(
                resume_text=resume_text,
                jd_text=jd_text,
                matched_skills=matched_skills,
            )

            critical_gaps = [
                {
                    "skill": gap.skill,
                    "jd_clause": gap.jd_clause,
                }
                for gap in gaps.critical_missing_skills
            ]

            secondary_gaps = [
                {
                    "skill": gap.skill,
                    "jd_clause": gap.jd_clause,
                }
                for gap in gaps.secondary_missing_skills
            ]

            experience_gaps = gaps.experience_discrepancies

            # -------------------------------------------------
            # 5. Resume improvements
            # -------------------------------------------------

            improvements = await self.analysis_service.run_improvements(
                resume_text=resume_text,
                job_title=job_title.strip(),
                critical_gaps=critical_gaps,
            )

            # -------------------------------------------------
            # 6. Interview preparation
            # -------------------------------------------------

            missing_skills = critical_gaps + secondary_gaps

            interview_preparation = (
                await self.analysis_service.run_interview_prep(
                    jd_text=jd_text,
                    matched_skills=matched_skills,
                    missing_skills=missing_skills,
                )
            )

        except Exception as exc:
            logger.exception(
                "Candidate screening workflow failed: %s",
                exc,
            )

            raise HTTPException(
                status_code=502,
                detail=(
                    "Screening could not be completed because an "
                    "AI or processing step failed. Human review is required."
                ),
            ) from exc

        # -----------------------------------------------------
        # 7. Risk identification
        # -----------------------------------------------------

        risks: list[str] = []

        if critical_gaps:
            risks.append(
                "One or more required job qualifications are "
                "not demonstrated in the resume."
            )

        if experience_gaps:
            risks.extend(experience_gaps)

        if not matched_skills:
            risks.append(
                "No directly matched technical skills were identified."
            )

        if analysis.major_concerns:
            risks.extend(analysis.major_concerns)

        # Remove duplicate risks while preserving order.
        risks = list(dict.fromkeys(risks))

        # -----------------------------------------------------
        # 8. Information requiring human verification
        # -----------------------------------------------------

        information_requiring_verification: list[str] = []

        if critical_gaps:
            information_requiring_verification.extend(
                [
                    f"Verify whether the candidate has experience with "
                    f"the required skill: {gap['skill']}."
                    for gap in critical_gaps
                ]
            )

        if experience_gaps:
            information_requiring_verification.extend(
                experience_gaps
            )

        if analysis.major_concerns:
            information_requiring_verification.extend(
                analysis.major_concerns
            )

        information_requiring_verification = list(
            dict.fromkeys(information_requiring_verification)
        )

        # -----------------------------------------------------
        # 9. Human escalation decision
        # -----------------------------------------------------

        escalation_required = False
        escalation_reason: str | None = None

        if critical_gaps:
            escalation_required = True
            escalation_reason = (
                "Required qualifications are missing or not "
                "demonstrated in the supplied resume. "
                "Human verification is required."
            )

        elif experience_gaps:
            escalation_required = True
            escalation_reason = (
                "Potential experience or seniority discrepancy "
                "requires human review."
            )

        elif analysis.major_concerns:
            escalation_required = True
            escalation_reason = (
                "Potential screening concerns require human "
                "verification before proceeding."
            )

        # -----------------------------------------------------
        # 10. Screening recommendation
        # -----------------------------------------------------

        recommendation = "Proceed to Human Review"

        # -----------------------------------------------------
        # 11. Next steps
        # -----------------------------------------------------

        next_steps: list[str] = []

        if escalation_required:
            next_steps.append(
                "Recruiter should verify the identified concerns "
                "before making a hiring decision."
            )

        if critical_gaps:
            next_steps.append(
                "Confirm whether the candidate has the required "
                "skills that are not demonstrated in the resume."
            )

        if experience_gaps:
            next_steps.append(
                "Verify the candidate's actual experience and "
                "seniority against the job requirements."
            )

        if not next_steps:
            next_steps.append(
                "Recruiter should review the structured evaluation "
                "and determine the next appropriate action."
            )

        # -----------------------------------------------------
        # 12. Structured worker output
        # -----------------------------------------------------

        result = ScreeningEvaluationResponse(
            match_score=analysis.match_score,
            recommendation=recommendation,
            seniority_alignment=analysis.seniority_alignment,
            executive_summary=analysis.executive_summary,
            strengths=analysis.top_strengths,
            matched_technical_skills=matching.matched_technical_skills,
            matched_soft_skills=matching.matched_soft_skills,
            critical_gaps=gaps.critical_missing_skills,
            secondary_gaps=gaps.secondary_missing_skills,
            experience_discrepancies=experience_gaps,
            risks=risks,
            resume_improvements=improvements,
            interview_preparation=interview_preparation,
            information_requiring_verification=(
                information_requiring_verification
            ),
            next_steps=next_steps,
            escalation_required=escalation_required,
            escalation_reason=escalation_reason,
        )

        logger.info(
            "Candidate screening workflow completed successfully "
            "for role: %s | match_score=%s | escalation_required=%s",
            job_title.strip(),
            result.match_score,
            result.escalation_required,
        )

        return result