\# 🤖 AI Resume \& JD Matcher



An AI-powered \*\*Resume \& Job Description Matching Platform\*\* built with \*\*FastAPI and Google Gemini\*\*.



The system analyzes a candidate's resume against a job description to evaluate overall fit, identify matching and missing skills, suggest targeted resume improvements, and generate interview preparation questions.



\---



\## ✨ Features



\### 🧠 Resume vs. Job Description Analysis



Generates a structured assessment of how well a resume aligns with a job description.



\* Match score from \*\*0–100\*\*

\* Seniority alignment

\* Executive summary

\* Top candidate strengths

\* Major concerns



\### 🎯 Skill Matching



Identifies technical and soft skills shared between the resume and job description.



\* Matched technical skills

\* Resume evidence for each technical skill

\* Corresponding JD requirements

\* Matched soft skills



\### 🔍 Skill \& Experience Gap Detection



Identifies areas where the candidate may not fully satisfy the job requirements.



\* Critical missing skills

\* Secondary missing skills

\* Experience discrepancies

\* Relevant job-description clauses



\### ✍️ AI Resume Improvements



Generates targeted recommendations to improve resume relevance and ATS compatibility.



\* Tailored summary statement

\* STAR-based bullet recommendations

\* Target skills

\* Suggested resume bullets

\* Improvement reasoning

\* High-value keywords



\### 💼 AI Interview Preparation



Generates interview questions based on the target job and identified skill gaps.



\* Technical interview questions

\* Behavioural interview questions

\* Focus areas / competencies

\* Evaluation criteria



\---



\## 🏗️ Architecture



```text

&#x20;                       ┌─────────────────────┐

&#x20;                       │   Resume + JD Input │

&#x20;                       └──────────┬──────────┘

&#x20;                                  │

&#x20;                                  ▼

&#x20;                       ┌─────────────────────┐

&#x20;                       │     FastAPI API     │

&#x20;                       └──────────┬──────────┘

&#x20;                                  │

&#x20;             ┌────────────────────┼────────────────────┐

&#x20;             │                    │                    │

&#x20;             ▼                    ▼                    ▼

&#x20;      Resume Analysis       Skill Matching       Gap Detection

&#x20;             │                    │                    │

&#x20;             └────────────────────┼────────────────────┘

&#x20;                                  │

&#x20;                                  ▼

&#x20;                       ┌─────────────────────┐

&#x20;                       │   Analysis Service  │

&#x20;                       └──────────┬──────────┘

&#x20;                                  │

&#x20;                                  ▼

&#x20;                       ┌─────────────────────┐

&#x20;                       │     Gemini LLM      │

&#x20;                       └──────────┬──────────┘

&#x20;                                  │

&#x20;             ┌────────────────────┼────────────────────┐

&#x20;             │                    │                    │

&#x20;             ▼                    ▼                    ▼

&#x20;      Resume Improvements   Interview Prep      Structured Output

```



\---



\## 🛠️ Tech Stack



\### Backend



\* \*\*Python\*\*

\* \*\*FastAPI\*\*

\* \*\*Pydantic\*\*

\* \*\*Uvicorn\*\*



\### AI / LLM



\* \*\*Google Gemini API\*\*

\* Prompt-based structured AI generation

\* Structured Pydantic response validation



\### Frontend



\* \*\*HTML\*\*

\* \*\*CSS\*\*

\* \*\*JavaScript\*\*



\### Testing



\* \*\*Pytest\*\*

\* API route tests

\* Service tests

\* Prompt template tests



\### Development Tools



\* \*\*Git\*\*

\* \*\*GitHub\*\*

\* \*\*VS Code\*\*



\---



\## 📂 Project Structure



```text

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

│   │   ├── analysis\_prompt.py

│   │   ├── gaps\_prompt.py

│   │   ├── improvement\_prompt.py

│   │   ├── interview\_prompt.py

│   │   └── matching\_prompt.py

│   │

│   ├── services/

│   │   ├── analysis\_service.py

│   │   ├── llm\_service.py

│   │   └── parser\_service.py

│   │

│   ├── utils/

│   │   ├── text\_cleaner.py

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

├── sample\_data/

│   ├── sample\_jd.txt

│   └── sample\_resume.txt

│

├── tests/

│   ├── test\_api/

│   │   └── test\_routes.py

│   ├── test\_prompts/

│   │   └── test\_prompt\_templates.py

│   └── test\_services/

│       └── test\_llm\_service.py

│

├── .env.example

├── .gitignore

├── main.py

└── requirements.txt

```



\---



\## 🔌 API Endpoints



The application exposes versioned REST API endpoints under:



```text

/api/v1/

```



| Feature               | Method | Endpoint                        |

| --------------------- | ------ | ------------------------------- |

| Resume Analysis       | POST   | `/api/v1/analysis/analyse`      |

| Skill Matching        | POST   | `/api/v1/matching/match-skills` |

| Gap Detection         | POST   | `/api/v1/gaps/detect-gaps`      |

| Resume Improvements   | POST   | `/api/v1/improvements/suggest`  |

| Interview Preparation | POST   | `/api/v1/interview/generate`    |



\---



\## 📊 Structured AI Output



The application uses \*\*Pydantic response models\*\* to keep LLM-generated results structured and predictable.



For example, resume analysis returns:



```json

{

&#x20; "match\_score": 85,

&#x20; "seniority\_alignment": "Well-Matched",

&#x20; "executive\_summary": "The candidate demonstrates strong alignment with the role.",

&#x20; "top\_strengths": \[

&#x20;   "Java development",

&#x20;   "API integration",

&#x20;   "Problem solving"

&#x20; ],

&#x20; "major\_concerns": \[

&#x20;   "Limited experience with the required cloud platform"

&#x20; ]

}

```



This structured approach makes AI responses easier for the frontend and API consumers to process.



\---



\## 🚀 Getting Started



\### 1. Clone the repository



```bash

git clone https://github.com/mansikanchan2003/AI-Resume-Matcher.git

cd AI-Resume-Matcher

```



\### 2. Create a virtual environment



For Windows:



```powershell

python -m venv venv

```



Activate it:



```powershell

.\\venv\\Scripts\\Activate.ps1

```



\### 3. Install dependencies



```bash

pip install -r requirements.txt

```



\### 4. Configure environment variables



Create a `.env` file from the provided template:



```powershell

Copy-Item .env.example .env

```



Then add your Gemini API credentials to `.env`.



> \*\*Important:\*\* Never commit your real `.env` file or API keys to GitHub.



\### 5. Start the application



```bash

uvicorn main:app --reload

```



The API will be available at:



```text

http://127.0.0.1:8000

```



\---



\## 📖 API Documentation



FastAPI automatically provides interactive API documentation.



Once the server is running, open:



```text

http://127.0.0.1:8000/docs

```



Swagger UI allows you to:



\* Inspect available endpoints

\* View request schemas

\* Submit test requests

\* Inspect structured responses



\---



\## 🧪 Running Tests



Run the test suite with:



```bash

pytest

```



The project includes tests covering:



\* API routes

\* Prompt templates

\* LLM service behavior



\---



\## 📝 Example Analysis Request



The main analysis endpoint accepts resume and job-description text as form data.



```bash

curl -X POST \\

&#x20; "http://127.0.0.1:8000/api/v1/analysis/analyse" \\

&#x20; -H "accept: application/json" \\

&#x20; -H "Content-Type: application/x-www-form-urlencoded" \\

&#x20; -d "resume\_text=Your resume text here..." \\

&#x20; -d "jd\_text=Your job description here..."

```



\---



\## 🔐 Environment Variables



The project uses environment variables for configuration.



A template is provided in:



```text

.env.example

```



The real `.env` file should remain local and should \*\*never be committed\*\* to the repository.



\---



\## 🎯 Design Approach



The application follows a modular service-oriented architecture:



\* \*\*Routes\*\* handle HTTP requests and responses.

\* \*\*Pydantic models\*\* validate request data and structure AI responses.

\* \*\*Services\*\* contain application and LLM logic.

\* \*\*Prompt modules\*\* isolate AI instructions for each capability.

\* \*\*Utilities\*\* handle validation and text processing.

\* \*\*Tests\*\* provide coverage for routes, prompts, and services.



This separation makes the application easier to maintain, test, and extend.



\---



\## 🔮 Future Improvements



Potential future enhancements include:



\* Resume PDF/DOCX upload and extraction

\* User authentication

\* Persistent analysis history

\* Job recommendation system

\* Resume scoring dashboard

\* Multiple LLM provider support

\* Streaming AI responses

\* Advanced ATS keyword analysis

\* Production deployment

\* Automated resume rewriting

\* Job application tracking



\---



\## 👩‍💻 Author



\*\*Mansi Kanchan\*\*



B.Tech — Computer Science \& Engineering



\* GitHub: \[@mansikanchan2003](https://github.com/mansikanchan2003)

\* LinkedIn: \[Mansi Kanchan](https://www.linkedin.com/in/mansi-kanchan-7924b0196)



\---



\## ⭐ Project Goal



The goal of this project is to demonstrate how modern AI/LLM capabilities can be integrated into a structured backend application to solve a practical problem:



> \*\*Helping candidates understand how well their resume matches a job, identify gaps, improve their resume, and prepare for interviews.\*\*



If you find the project useful, consider giving it a ⭐ on GitHub.



