"""
app/utils/validators.py — Input Validation Helpers
====================================================
Standalone validation functions used by dependencies.py and route handlers
to reject bad inputs before any LLM API call is made.

Functions:
  validate_file_extension(filename: str) -> str
      Returns the lowercased extension or raises ValueError if unsupported.
      Allowlist: {".pdf", ".docx", ".txt"}

  validate_text_length(text: str, field_name: str, min_chars: int) -> None
      Raises ValueError if the extracted text is below the minimum character
      threshold (prevents submitting blank/garbled files to the LLM).

  validate_jd_not_empty(jd_text: str) -> None
      Specific guard for job description inputs — raises HTTP 422 if empty
      or only whitespace.
"""

# TODO: from fastapi import HTTPException

# ALLOWED_EXTENSIONS = {".pdf", ".docx", ".txt"}
# MIN_RESUME_CHARS = 200
# MIN_JD_CHARS = 100

# def validate_file_extension(filename: str) -> str:
#     ...

# def validate_text_length(text: str, field_name: str, min_chars: int) -> None:
#     ...

# def validate_jd_not_empty(jd_text: str) -> None:
#     ...
