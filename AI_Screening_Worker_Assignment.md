# AI-Assisted Resume / Profile Screening Worker

## 1. Goal

Reduce the time and inconsistency involved in initial candidate screening by
producing a structured, evidence-based screening evaluation from a candidate
profile and job description.

The worker is designed to support the first-pass screening workflow while
keeping the final hiring decision with a human recruiter.

## 2. User

The primary users are:

- Recruiters performing initial candidate screening
- Hiring teams reviewing candidate-role fit

## 3. System

The worker operates inside the following workflow:

```text
Candidate Resume / Profile
            |
            v
      AI Screening Worker
            |
            v
   Structured Evaluation
            |
            v
   Recruiter Review / Decision
```

The existing Resume & JD Matcher provides the core analysis capabilities,
while the screening worker organizes them into a bounded workflow.

## 4. Inputs

The worker requires:

- Candidate resume or profile
- Job description
- Role requirements contained in the job description

For the demonstration, only dummy or publicly available sample data should
be used.

## 5. Outputs

The worker produces a structured screening evaluation containing relevant
information such as:

- Match score
- Seniority alignment
- Matched technical and soft skills
- Resume evidence for matched skills
- Critical and secondary skill gaps
- Experience discrepancies
- Major concerns or risks
- Resume improvement recommendations
- Interview preparation questions
- Information that may require human verification

## 6. Decisions

The worker can:

- Identify alignment between the candidate profile and role requirements.
- Identify missing or weakly supported requirements.
- Highlight potential screening concerns.
- Recommend areas that require further verification.
- Determine whether the available information is sufficient for automated
  evaluation or should be escalated for human review.

The worker does **not** make a final hiring, rejection, or compensation
decision.

## 7. Constraints

The worker must:

- Avoid making the final hiring or rejection decision.
- Avoid inventing candidate experience, qualifications, or evidence.
- Base its evaluation on the information supplied to the workflow.
- Clearly identify missing information rather than assuming it.
- Use only dummy or publicly available sample data for the demonstration.
- Stop or escalate when the available information is insufficient for a
  reliable evaluation.

## 8. Definition of Done

The workflow is considered complete when:

1. A valid resume/profile and job description can be submitted.
2. The inputs are validated before processing.
3. The worker generates a structured screening evaluation.
4. Matching skills, gaps, and concerns are identified.
5. AI/API failures are handled without silently producing a misleading result.
6. Invalid or incomplete cases are stopped or escalated.
7. The result is suitable for review by a human recruiter.
8. The processing outcome can be logged for traceability.
9. An intentional failure scenario can be demonstrated.

## 9. Escalation

The worker should stop and request human review when:

- Required candidate or role information is missing.
- The AI response cannot be validated.
- The model produces an unclear or inconsistent result.
- A screening conclusion depends on information that is not present.
- A potentially significant concern requires human verification.

Human escalation is a safety mechanism: the worker assists the recruiter
rather than replacing the recruiter's judgment.

## 10. Success Metrics

The workflow can be evaluated using measurable operational metrics:

- Average time required for first-pass screening before vs. after using the
  worker.
- Percentage of cases successfully processed without manual intervention.
- Percentage of cases appropriately escalated for human review.
- Completeness and consistency of structured screening outputs.
- Percentage of generated outputs that pass schema/validation checks.

These metrics can be measured with representative sample cases before using
the worker in a real operational workflow.
