"""
tests/test_prompts/test_prompt_templates.py — Prompt Builder Unit Tests
========================================================================
Tests that the prompt builder functions correctly interpolate inputs
and produce strings that meet structural requirements.
These tests are pure Python — no LLM calls, no mocking needed.

Test cases to implement:
  test_analysis_prompt_contains_resume_text
      Assert build_analysis_prompt(resume, jd) output contains the
      exact resume string inside <resume> tags.

  test_analysis_prompt_contains_jd_text
      Assert build_analysis_prompt(resume, jd) contains the exact JD
      inside <job_description> tags.

  test_gaps_prompt_injects_matched_skills
      Assert build_gaps_prompt(resume, jd, matched_json) contains the
      matched_skills JSON inside <already_matched_skills> tags.

  test_improvement_prompt_contains_critical_gaps
      Assert build_improvement_prompt(resume, role, gaps_json) contains
      the gaps JSON inside <critical_gaps> tags.

  test_interview_prompt_specifies_question_count_constraint
      Assert INTERVIEW_SYSTEM_PROMPT contains "EXACTLY 3" and "EXACTLY 2"
      to verify the count constraint is present in the system instruction.

  test_no_prompt_builder_returns_empty_string
      For all 5 builder functions, assert the returned string is non-empty
      when given valid sample inputs.
"""

# TODO: import pytest
# TODO: from app.prompts.analysis_prompt import build_analysis_prompt
# TODO: from app.prompts.matching_prompt import build_matching_prompt
# TODO: from app.prompts.gaps_prompt import build_gaps_prompt
# TODO: from app.prompts.improvement_prompt import build_improvement_prompt
# TODO: from app.prompts.interview_prompt import build_interview_prompt, INTERVIEW_SYSTEM_PROMPT

# def test_analysis_prompt_contains_resume_text():
#     ...

# def test_gaps_prompt_injects_matched_skills():
#     ...
