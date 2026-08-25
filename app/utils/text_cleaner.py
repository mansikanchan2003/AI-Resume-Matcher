"""
app/utils/text_cleaner.py — Text Sanitisation Utilities
========================================================
Pure helper functions for cleaning and normalising extracted text
before it is injected into LLM prompts.

Why this matters:
  Noisy text (excessive whitespace, null bytes, special control characters,
  encoding artifacts from PDFs) degrades LLM output quality and can inflate
  token counts significantly.

Functions:
  clean_text(text: str) -> str
      Master cleaner: strips control chars, collapses whitespace,
      removes null bytes, and normalises unicode.

  truncate_to_token_limit(text: str, max_chars: int) -> str
      Prevents accidental context window overflow by hard-truncating text.
      Used before constructing any prompt.

  sanitise_for_prompt_injection(text: str) -> str
      Escapes XML-like tags in user-supplied text to prevent accidental
      prompt injection (e.g., a resume containing </resume> literal text).
"""

# TODO: import re
# TODO: import unicodedata

# def clean_text(text: str) -> str:
#     """Strips control characters, null bytes, and collapses whitespace."""
#     ...

# def truncate_to_token_limit(text: str, max_chars: int = 12000) -> str:
#     """Hard-truncates text to max_chars as a simple token guard."""
#     ...

# def sanitise_for_prompt_injection(text: str) -> str:
#     """Escapes XML tag characters in user-provided text."""
#     ...
