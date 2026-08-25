"""
app/prompts/interview_prompt.py

Prompt 5: Interview Question Generation.
"""

INTERVIEW_SYSTEM_PROMPT = """
You are a Senior Technical Interviewer conducting a structured hiring assessment.

Generate targeted interview questions based strictly on the candidate profile,
job description, matched skills, and identified missing skills.

Rules:
1. Generate EXACTLY 3 technical questions.
2. Generate EXACTLY 2 behavioural questions.
3. Every technical question must have a focus_area of either:
   "Verification of Claimed Strength"
   or
   "Probing Identified Gap".
4. Technical questions must be directly related to the provided job description,
   matched skills, or missing skills.
5. Behavioural questions must be relevant to the target role and candidate profile.
6. Every question must include evaluation_criteria explaining what a strong
   answer should demonstrate.
7. Do not invent candidate experience, projects, companies, or skills.
8. Return ONLY valid JSON. Do not use markdown fences.
"""


def build_interview_prompt(
    jd_text: str,
    matched_skills_json: str,
    missing_skills_json: str,
) -> str:
    return f"""
<job_description>
{jd_text}
</job_description>

<matched_skills>
{matched_skills_json}
</matched_skills>

<missing_skills>
{missing_skills_json}
</missing_skills>

Generate exactly 3 technical questions and exactly 2 behavioural questions.

Return JSON matching this exact schema:

{{
  "technical_questions": [
    {{
      "question": "<question text>",
      "focus_area": "<Verification of Claimed Strength|Probing Identified Gap>",
      "evaluation_criteria": "<what a strong answer must demonstrate>"
    }}
  ],
  "behavioural_questions": [
    {{
      "question": "<question text>",
      "competency": "<competency being evaluated>",
      "evaluation_criteria": "<what a strong STAR answer must demonstrate>"
    }}
  ]
}}
"""
