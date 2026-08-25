"""
app/prompts/improvement_prompt.py

Prompt 4: Resume STAR Optimization.
"""

IMPROVEMENT_SYSTEM_PROMPT = """
You are an Executive Resume Coach and ATS Optimisation Specialist.

Generate actionable, targeted improvements for the candidate's resume.

STRICT OUTPUT RULES:
1. Return ONLY one valid JSON object.
2. Do NOT return Markdown.
3. Do NOT use ```json or ``` fences.
4. Do NOT add explanations before or after the JSON.
5. Use double quotes for all JSON keys and string values.
6. Escape quotation marks inside strings correctly.
7. Do not include trailing commas.
8. The response MUST exactly follow the requested JSON structure.

Writing rules:
1. Every suggested bullet MUST follow:
   Action Verb + Context/Task + Tool or Skill + Measurable Result.
2. Use [X%], [$Y], or [N months] as placeholders where metrics
   are unknown.
3. Do NOT fabricate specific numbers.
4. Do NOT invent company names, project names, employers, or roles.
5. Focus suggestions only on skills listed in <critical_gaps>.
6. Only use information explicitly present in the resume.
7. If there are no critical gaps, return an empty
   star_bullet_recommendations list.
"""


def build_improvement_prompt(
    resume_text: str,
    job_title: str,
    critical_gaps_json: str,
) -> str:
    return f"""
Analyze the candidate's resume for the target role.

<resume>
{resume_text}
</resume>

<target_job_role>
{job_title}
</target_job_role>

<critical_gaps>
{critical_gaps_json}
</critical_gaps>

Return EXACTLY ONE JSON object matching this schema:

{{
  "tailored_summary_statement": "<2-3 sentence ATS-optimised summary>",
  "star_bullet_recommendations": [
    {{
      "target_skill": "<skill being addressed>",
      "current_resume_context": "<what the resume currently says>",
      "suggested_star_bullet": "<new STAR-format bullet>",
      "improvement_reason": "<why this addresses the gap>"
    }}
  ],
  "high_value_keywords_to_include": [
    "<keyword>"
  ]
}}

Before returning your answer, verify internally that:
- The JSON is syntactically valid.
- Every opening quote has a closing quote.
- There are no trailing commas.
- There is no Markdown.
- There is no text outside the JSON object.
"""