# 🤖 AI Resume & JD Matcher

An AI-powered **Resume & Job Description Matching Platform** built with **FastAPI** and **Google Gemini**.

The application analyzes a candidate's resume against a job description to evaluate overall fit, identify matched and missing skills, recommend targeted resume improvements, and generate interview preparation questions.

---

## ✨ Features

### 📊 Resume vs. Job Description Analysis

Evaluates how well a candidate's resume aligns with a job description.

- Match score from **0–100**
- Seniority alignment
- Executive summary
- Top candidate strengths
- Major concerns

### 🎯 Skill Matching

Identifies skills shared between the resume and job description.

- Matched technical skills
- Resume evidence for each technical skill
- Corresponding JD requirements
- Matched soft skills

### 🔍 Skill & Experience Gap Detection

Identifies areas where the candidate may not fully satisfy the job requirements.

- Critical missing skills
- Secondary missing skills
- Experience discrepancies
- Relevant job-description clauses

### ✍️ AI Resume Improvements

Generates targeted recommendations to improve resume relevance and ATS compatibility.

- Tailored summary statement
- STAR-based bullet recommendations
- Target skills
- Suggested resume bullets
- Improvement reasoning
- High-value keywords

### 💼 AI Interview Preparation

Generates interview questions based on the target job and identified skill gaps.

- Technical interview questions
- Behavioural interview questions
- Focus areas and competencies
- Evaluation criteria

---

## 🏗️ Architecture

```text
                 Resume + Job Description
                           │
                           ▼
                      FastAPI API
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
   Resume Analysis   Skill Matching   Gap Detection
          │                │                │
          └────────────────┼────────────────┘
                           ▼
                   Analysis Service
                           │
                           ▼
                      Gemini LLM
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
       Improvements    Interview     Structured
                          Prep          Output

The application follows a modular service-oriented architecture where routes handle HTTP requests, services contain application and LLM logic, prompts isolate AI instructions, and Pydantic models validate structured outputs.

🛠️ Tech Stack
Backend
Python
FastAPI
Pydantic
Uvicorn
AI / LLM
Google Gemini API
Prompt-based structured AI generation
Pydantic-based response validation
Frontend
HTML
CSS
JavaScript
Testing & Code Quality
Pytest
Pytest-Asyncio
Pyrefly
API route tests
Service tests
Prompt template tests
Development Tools
Git
GitHub
Antigravity IDE
📂 Project Structure
AI-Resume-Matcher/
│
├── app/
│   ├── api/
│   │   ├── routes/
│   │   │   ├── analysis.py
│   │   │   ├── gaps.py
│   │   │   ├── improvements.py
│   │   │   ├── interview.py
│   │   │   └── matching.py
│   │   │
│   │   └── router.py
│   │
│   ├── models/
│   │   ├── requests.py
│   │   └── responses.py
│   │
│   ├── prompts/
│   │   ├── analysis_prompt.py
│   │   ├── gaps_prompt.py
│   │   ├── improvement_prompt.py
│   │   ├── interview_prompt.py
│   │   └── matching_prompt.py
│   │
│   ├── services/
│   │   ├── analysis_service.py
│   │   ├── llm_service.py
│   │   └── parser_service.py
│   │
│   ├── utils/
│   │   ├── text_cleaner.py
│   │   └── validators.py
│   │
│   ├── config.py
│   └── dependencies.py
│
├── frontend/
│   ├── index.html
│   ├── css/
│   │   └── styles.css
│   └── js/
│       ├── api.js
│       ├── main.js
│       └── ui.js
│
├── sample_data/
│   ├── sample_jd.txt
│   └── sample_resume.txt
│
├── tests/
│   ├── test_api/
│   │   └── test_routes.py
│   ├── test_prompts/
│   │   └── test_prompt_templates.py
│   └── test_services/
│       └── test_llm_service.py
│
├── .env.example
├── .gitignore
├── main.py
├── pyrefly.toml
├── requirements.txt
└── README.md
🔌 API Endpoints

All API endpoints are versioned under:

/api/v1/
Feature	Method	Endpoint	Input
Resume Analysis	POST	/api/v1/analysis/analyse	Form Data
Skill Matching	POST	/api/v1/matching/match-skills	JSON
Gap Detection	POST	/api/v1/gaps/detect-gaps	JSON
Resume Improvements	POST	/api/v1/improvements/suggest	JSON
Interview Preparation	POST	/api/v1/interview/generate	JSON
Health Check	GET	/health	—
📖 API Documentation

When the application is running, FastAPI provides interactive API documentation.

Swagger UI
http://127.0.0.1:8000/docs
OpenAPI Specification
http://127.0.0.1:8000/openapi.json

Swagger UI can be used to:

Inspect available endpoints
View request schemas
Submit test requests
Inspect structured responses
Verify validation behaviour
📊 Structured AI Output

The application uses Pydantic response models to keep LLM-generated results structured and predictable.

Example analysis response:

{
  "match_score": 78,
  "seniority_alignment": "Well-Matched",
  "executive_summary": "The candidate is a strong fit for the target role, with strong alignment across the core backend development requirements.",
  "top_strengths": [
    "Python and FastAPI experience",
    "REST API development",
    "Git and GitHub experience"
  ],
  "major_concerns": [
    "No explicit PostgreSQL experience",
    "No mentioned Docker experience"
  ]
}

This structured approach allows the frontend and API consumers to reliably process AI-generated results.

🚀 Getting Started
1. Clone the repository
git clone https://github.com/mansikanchan2003/AI-Resume-Matcher.git
cd AI-Resume-Matcher
2. Create a virtual environment

For Windows:

python -m venv venv

Activate it:

.\venv\Scripts\Activate.ps1
3. Install dependencies
pip install -r requirements.txt
4. Configure environment variables

Create the .env file:

Copy-Item .env.example .env

Then configure the required Gemini API credentials.

Example:

LLM_PROVIDER=gemini
LLM_API_KEY=your_api_key_here
LLM_MODEL_NAME=gemini-3.6-flash
LLM_TEMPERATURE=0.0
LLM_MAX_TOKENS=4096

Important: Never commit the real .env file or API keys to GitHub.

5. Start the application
uvicorn main:app --reload

The API will be available at:

http://127.0.0.1:8000

Open Swagger UI:

http://127.0.0.1:8000/docs
🧪 Running Tests

Run the complete test suite:

pytest -q

Current test status:

7 passed

The tests cover:

API route behaviour
Request validation
Skill matching
Gap detection
Resume improvements
Interview question generation
🔎 Static Type Checking

The project uses Pyrefly for static analysis.

Run:

pyrefly check

Expected result:

INFO 0 errors
📝 API Request Examples
Resume Analysis

The analysis endpoint accepts form data:

curl -X POST \
  "http://127.0.0.1:8000/api/v1/analysis/analyse" \
  -H "accept: application/json" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "resume_text=Your resume text here..." \
  -d "jd_text=Your job description here..."
Skill Matching

The remaining analysis endpoints accept JSON request bodies.

Example:

curl -X POST \
  "http://127.0.0.1:8000/api/v1/matching/match-skills" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "resume_text": "Your resume text here...",
    "jd_text": "Your job description here..."
  }'

The same JSON-based approach is used by:

/api/v1/gaps/detect-gaps
/api/v1/improvements/suggest
/api/v1/interview/generate
🔐 Environment Variables

The application uses environment variables for configuration.

The repository provides:

.env.example

The actual .env file is intentionally excluded from Git through .gitignore.

Never commit:

API keys
Secrets
Credentials
Local environment configuration
🎯 Design Approach

The application is designed around separation of responsibilities:

Routes handle HTTP requests and responses.
Pydantic models validate request data and structure AI responses.
Services contain application and LLM logic.
Prompt modules isolate AI instructions for each capability.
Utilities handle text processing and validation.
Tests verify API and service behaviour.
Pyrefly provides static code analysis.

This structure makes the application easier to test, maintain, and extend.

🔮 Future Improvements

Potential future enhancements include:

Resume PDF/DOCX upload and extraction
User authentication
Persistent analysis history
Job recommendation system
Resume scoring dashboard
Multiple LLM provider support
Streaming AI responses
Advanced ATS keyword analysis
Production deployment
Automated resume rewriting
Job application tracking
👩‍💻 Author

Mansi Kanchan

B.Tech — Computer Science & Engineering

GitHub: https://github.com/mansikanchan2003
LinkedIn: https://www.linkedin.com/in/mansi-kanchan-7924b0196
⭐ Project Goal

The goal of this project is to demonstrate how modern AI/LLM capabilities can be integrated into a structured backend application to solve a practical problem:

Helping candidates understand how well their resume matches a job, identify skill gaps, improve their resume, and prepare for interviews.