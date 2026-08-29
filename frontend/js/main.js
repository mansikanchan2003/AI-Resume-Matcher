/**
 * TALENTPULSE AI — MAIN APPLICATION CONTROLLER
 *
 * Responsibilities:
 * - Navigation
 * - Resume upload
 * - PDF / DOCX / TXT extraction
 * - Candidate name extraction
 * - Benchmark loading
 * - Calling the existing screening endpoint
 * - Rendering the real backend response
 * - Local history
 * - Recruiter decisions
 * - Export
 */

document.addEventListener("DOMContentLoaded", () => {
  /* ============================================================
     DOM ELEMENTS
     ============================================================ */

  const dropzone = document.getElementById("resume-dropzone");
  const fileInput = document.getElementById("resume-file-input");
  const btnSelectFile = document.getElementById("btn-select-file");
  const fileSelectedChip = document.getElementById("file-selected-chip");
  const fileNameDisplay = document.getElementById("file-name-display");
  const fileStatusText = document.getElementById("file-status-text");
  const btnRemoveFile = document.getElementById("btn-remove-file");

  const targetRoleInput = document.getElementById("target-role-input");
  const jdTextarea = document.getElementById("jd-textarea");
  const btnClearJd = document.getElementById("btn-clear-jd");
  const analyseBtn = document.getElementById("analyse-btn");

  const sidebarNewAnalysis = document.getElementById(
    "btn-sidebar-new-analysis"
  );

  const mobileMenuToggle = document.getElementById(
    "mobile-menu-toggle"
  );

  const appSidebar = document.getElementById("app-sidebar");

  /* Benchmark buttons */

  const btnSampleBackend = document.getElementById(
    "btn-load-backend-sample"
  );

  const btnSampleFrontend = document.getElementById(
    "btn-load-frontend-sample"
  );

  const btnSampleMarketing = document.getElementById(
    "btn-load-marketing-sample"
  );

  /* Result / action buttons */

  const btnExportPdf = document.getElementById("btn-export-pdf");

  const btnViewEvalDetail = document.getElementById(
    "btn-view-eval-detail"
  );

  const btnScheduleInterview = document.getElementById(
    "btn-schedule-interview"
  );

  const btnEvalBack = document.getElementById(
    "btn-eval-back-to-screening"
  );

  const btnEvalMove = document.getElementById(
    "btn-eval-move-interview"
  );

  const btnDecisionReject = document.getElementById(
    "btn-decision-reject"
  );

  const btnDecisionHold = document.getElementById(
    "btn-decision-hold"
  );

  const btnDecisionAdvance = document.getElementById(
    "btn-decision-advance"
  );

  const btnExportHistoryReport = document.getElementById(
    "btn-export-history-report"
  );

  const historySearchInput = document.getElementById(
    "history-search-input"
  );

  const globalSearchInput = document.getElementById(
    "global-search-input"
  );

  /* ============================================================
     STATE
     ============================================================ */

  let selectedFile = null;
  let simulatedResumeText = "";
  let latestAnalysisResult = null;

  let currentCandidateInfo = {
    candidateName: "Candidate",
    candidateId: "",
    targetRole: "Senior Software Engineer",
    email: "",
    isBenchmark: false,
    isDemo: false,
  };

  /* ============================================================
     STORAGE
     ============================================================ */

  const STORAGE_KEY = "talentpulse_ai_history_v1";
  const DECISIONS_KEY = "talentpulse_ai_decisions_v1";

  /* ============================================================
     BENCHMARKS
     ============================================================ */

  const BENCHMARKS = {
    backend: {
      role: "Senior Backend Engineer (AWS / Python)",
      candidateName: "Marcus Vance",
      candidateId: "CAN-4902",
      email: "marcus.vance@systems.io",

      resumeText: `
Marcus Vance — Staff Backend Architect

Email: marcus.vance@systems.io
Location: San Francisco, CA

PROFESSIONAL SUMMARY:

Accomplished Distributed Systems Engineer with 8+ years of expertise architecting high-throughput microservices using Python (FastAPI, asyncio), PostgreSQL, Redis, and AWS (ECS, Lambda, DynamoDB). Proven track record reducing API latency by 45% and scaling streaming workloads to 250k RPS.

CORE SKILLS:

Python, FastAPI, Django, TypeScript, Go
AWS, Docker, Kubernetes, Terraform, CI/CD
PostgreSQL, DynamoDB, Redis, Elasticsearch
Distributed Systems, REST APIs, Event-Driven Architecture, Microservices

WORK EXPERIENCE:

Lead Backend Engineer | CloudScale Networks

2021 - Present

- Engineered event-driven ingest pipeline processing 15M daily telemetry events with FastAPI and SQS, achieving 99.99% uptime.
- Optimized PostgreSQL database indexes and connection pooling, reducing p99 latency from 320ms to 48ms.
- Mentored engineers in concurrency best practices, unit testing with PyTest, and AWS architecture.

Senior Software Engineer | FinTech Protocol

2018 - 2021

- Built payment reconciliation microservices using Python and AWS Lambda.
- Migrated legacy monolith to containerized Docker services orchestrated through AWS ECS.

EDUCATION:

B.S. in Computer Science

University of California, Berkeley
`,

      jdText: `
Senior Backend Engineer (Cloud Platform)

We are seeking an experienced Senior Backend Engineer to design and scale our next-generation cloud analytics platform.

Key Responsibilities:

- Architect, build, and maintain high-performance asynchronous REST APIs in Python using FastAPI.
- Design scalable database models in PostgreSQL and DynamoDB.
- Own infrastructure-as-code and cloud deployments across AWS.
- Collaborate with frontend engineers, product managers, and security auditors.

Requirements:

- 5+ years of production experience building distributed backend systems in Python.
- Strong proficiency with PostgreSQL and Redis.
- Hands-on AWS, Docker, and CI/CD experience.
- Excellent communication skills and automated testing experience.
`,
    },

    frontend: {
      role: "Staff Frontend Architect (React / TypeScript)",
      candidateName: "Elena Rodriguez",
      candidateId: "CAN-7128",
      email: "elena.rodriguez@ui-lab.org",

      resumeText: `
Elena Rodriguez — Staff Frontend Architect

Frontend specialist with 7+ years building responsive SaaS applications with React, TypeScript, Next.js, and Tailwind CSS.

CORE SKILLS:

React
TypeScript
Next.js
Tailwind CSS
Redux Toolkit
Web Performance
Core Web Vitals
Design Systems
WCAG Accessibility

EXPERIENCE:

Staff UI Architect | HyperVisual Systems

2020 - Present

- Architected enterprise React/TypeScript design system adopted across multiple product suites.
- Reduced initial bundle size by 52%.
- Built interactive SVG dashboards handling real-time analytical data.

Senior Frontend Developer | NovaTech Interactive

2017 - 2020

- Developed SPA applications using React, Redux Toolkit, and Tailwind CSS.
- Implemented WCAG 2.1 AA accessibility standards.

EDUCATION:

B.S. in Software Engineering

Cornell University
`,

      jdText: `
Staff Frontend Architect (React / TypeScript)

We are seeking a Staff Frontend Architect to lead the frontend technical vision for our cloud orchestration dashboard.

Requirements:

- 6+ years of specialized experience in React and TypeScript.
- Strong modern state management experience.
- Deep expertise in Design Systems and Tailwind CSS.
- Proven mastery of Web Performance and Core Web Vitals.
- Responsive UI/UX and accessibility experience.
`,
    },

    marketing: {
      role: "Head of Growth & Product Marketing",
      candidateName: "Sarah Jenkins",
      candidateId: "CAN-3091",
      email: "sarah.jenkins@growthpartners.co",

      resumeText: `
Sarah Jenkins — Head of Growth & B2B Product Marketing

Data-driven B2B SaaS Marketing Leader with 8+ years scaling ARR through product-led growth, enterprise ABM, and content strategy.

CORE EXPERIENCE:

B2B SaaS
Product-Led Growth
Account-Based Marketing
Content Strategy
Paid Acquisition
Marketing Analytics
Team Leadership

VP of Marketing | DataFlow Inc

2020 - Present

- Drove 180% YoY increase in qualified pipeline.
- Built a 10-person global marketing team.
- Launched company repositioning that expanded average deal size by 40%.
`,

      jdText: `
Head of Growth & Product Marketing (B2B SaaS)

We need an exceptional Marketing Leader to scale our product-led pipeline and accelerate revenue.

Requirements:

- 7+ years leading B2B SaaS growth.
- ABM campaigns and brand messaging.
- HubSpot, Google Analytics, SEO and paid acquisition experience.
- Experience managing high-performing teams.
`,
    },
  };

  /* ============================================================
     NAVIGATION
     ============================================================ */

  function handleNavigation(viewId) {
    UI.switchView(viewId);

    if (window.innerWidth <= 768 && appSidebar) {
      appSidebar.classList.remove("open");
    }
  }

  document
    .querySelectorAll(".sidebar-nav .nav-item")
    .forEach((item) => {
      item.addEventListener("click", (event) => {
        event.preventDefault();

        const view = item.getAttribute("data-view");

        handleNavigation(view);

        window.location.hash = view;
      });
    });

  if (mobileMenuToggle && appSidebar) {
    mobileMenuToggle.addEventListener("click", () => {
      appSidebar.classList.toggle("open");
    });
  }

  if (sidebarNewAnalysis) {
    sidebarNewAnalysis.addEventListener("click", () => {
      resetAnalysisForm();

      handleNavigation("analyze");

      window.location.hash = "analyze";
    });
  }

  /* ============================================================
     RESULT TABS
     ============================================================ */

  document
    .querySelectorAll(".res-tab-btn")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const tab = button.getAttribute("data-res-tab");

        document
          .querySelectorAll(".res-tab-btn")
          .forEach((item) => {
            item.classList.remove("active");
          });

        button.classList.add("active");

        document
          .querySelectorAll(".res-tab-panel")
          .forEach((panel) => {
            panel.classList.add("hidden");
          });

        const target = document.getElementById(`panel-${tab}`);

        if (target) {
          target.classList.remove("hidden");
        }
      });
    });

  /* ============================================================
     FILE HANDLING
     ============================================================ */

  function setLoadedFile(file, customText = "") {
    selectedFile = file;
    simulatedResumeText = customText || "";

    if (file) {
      currentCandidateInfo.isBenchmark = false;
      currentCandidateInfo.isDemo = false;

      if (fileNameDisplay) {
        fileNameDisplay.textContent = file.name;
      }

      if (fileStatusText) {
        const sizeKB = Math.max(
          1,
          Math.round(file.size / 1024)
        );

        fileStatusText.textContent =
          `${sizeKB} KB • Ready for cognitive screening`;
      }

      if (fileSelectedChip) {
        fileSelectedChip.classList.remove("hidden");
      }

      if (dropzone) {
        dropzone.classList.add("hidden");
      }
    } else if (customText) {
      currentCandidateInfo.isBenchmark = true;
      currentCandidateInfo.isDemo = true;

      if (fileNameDisplay) {
        fileNameDisplay.textContent =
          `${currentCandidateInfo.candidateName}_Resume.pdf`;
      }

      if (fileStatusText) {
        fileStatusText.textContent =
          "Benchmark Profile Dossier Loaded";
      }

      if (fileSelectedChip) {
        fileSelectedChip.classList.remove("hidden");
      }

      if (dropzone) {
        dropzone.classList.add("hidden");
      }
    }

    UI.hideError();
  }

  function clearSelectedFile() {
    selectedFile = null;
    simulatedResumeText = "";

    currentCandidateInfo.isBenchmark = false;
    currentCandidateInfo.isDemo = false;

    if (fileSelectedChip) {
      fileSelectedChip.classList.add("hidden");
    }

    if (dropzone) {
      dropzone.classList.remove("hidden");
    }

    if (fileInput) {
      fileInput.value = "";
    }
  }

  function validateAndSetFile(file) {
    if (!file) {
      return;
    }

    const extension = file.name
      .toLowerCase()
      .split(".")
      .pop();

    if (!["pdf", "docx", "txt"].includes(extension)) {
      UI.showError(
        "Please upload a supported document (.pdf, .docx, .txt)."
      );

      return;
    }

    /* 10 MB limit */

    if (file.size > 10 * 1024 * 1024) {
      UI.showError(
        "Resume file must be 10MB or smaller."
      );

      return;
    }

    setLoadedFile(file);

    UI.showToast(
      `${file.name} loaded successfully.`,
      "success"
    );
  }

  if (dropzone) {
    dropzone.addEventListener("click", () => {
      if (fileInput) {
        fileInput.click();
      }
    });

    dropzone.addEventListener("keydown", (event) => {
      if (
        event.key === "Enter" ||
        event.key === " "
      ) {
        event.preventDefault();

        if (fileInput) {
          fileInput.click();
        }
      }
    });

    dropzone.addEventListener("dragover", (event) => {
      event.preventDefault();

      dropzone.classList.add("drag-over");
    });

    dropzone.addEventListener("dragleave", () => {
      dropzone.classList.remove("drag-over");
    });

    dropzone.addEventListener("drop", (event) => {
      event.preventDefault();

      dropzone.classList.remove("drag-over");

      const file = event.dataTransfer?.files?.[0];

      if (file) {
        validateAndSetFile(file);
      }
    });
  }

  if (btnSelectFile) {
    btnSelectFile.addEventListener("click", (event) => {
      event.stopPropagation();

      if (fileInput) {
        fileInput.click();
      }
    });
  }

  if (fileInput) {
    fileInput.addEventListener("change", (event) => {
      const file = event.target.files?.[0];

      if (file) {
        validateAndSetFile(file);
      }
    });
  }

  if (btnRemoveFile) {
    btnRemoveFile.addEventListener("click", (event) => {
      event.stopPropagation();

      clearSelectedFile();
    });
  }

  /* ============================================================
     CLEAR JD
     ============================================================ */

  if (btnClearJd && jdTextarea) {
    btnClearJd.addEventListener("click", () => {
      jdTextarea.value = "";
      jdTextarea.focus();
    });
  }

  /* ============================================================
     BENCHMARK LOADERS
     ============================================================ */

  function loadBenchmark(key) {
    const benchmark = BENCHMARKS[key];

    if (!benchmark) {
      return;
    }

    currentCandidateInfo = {
      candidateName: benchmark.candidateName,
      candidateId: benchmark.candidateId,
      targetRole: benchmark.role,
      email: benchmark.email,
      isBenchmark: true,
      isDemo: true,
    };

    if (targetRoleInput) {
      targetRoleInput.value = benchmark.role;
    }

    if (jdTextarea) {
      jdTextarea.value = benchmark.jdText;
    }

    setLoadedFile(null, benchmark.resumeText);

    UI.showToast(
      `${benchmark.candidateName} benchmark profile loaded.`,
      "success"
    );
  }

  if (btnSampleBackend) {
    btnSampleBackend.addEventListener("click", () => {
      loadBenchmark("backend");
    });
  }

  if (btnSampleFrontend) {
    btnSampleFrontend.addEventListener("click", () => {
      loadBenchmark("frontend");
    });
  }

  if (btnSampleMarketing) {
    btnSampleMarketing.addEventListener("click", () => {
      loadBenchmark("marketing");
    });
  }

  /* ============================================================
     RESUME TEXT EXTRACTION
     ============================================================ */

  async function extractResumeText(file) {
    if (simulatedResumeText) {
      return simulatedResumeText.trim();
    }

    if (!file) {
      throw new Error("No resume file uploaded.");
    }

    const extension = file.name
      .toLowerCase()
      .split(".")
      .pop();

    /* ------------------------------------------------------------
       TXT
       ------------------------------------------------------------ */

    if (extension === "txt") {
      const text = await file.text();

      return text.trim();
    }

    /* ------------------------------------------------------------
       PDF
       ------------------------------------------------------------ */

    if (extension === "pdf") {
      if (typeof pdfjsLib === "undefined") {
        throw new Error(
          "PDF parser is still loading. Please retry in a moment."
        );
      }

      const buffer = await file.arrayBuffer();

      const pdf = await pdfjsLib
        .getDocument({
          data: buffer,
        })
        .promise;

      let fullText = "";

      for (
        let pageNumber = 1;
        pageNumber <= pdf.numPages;
        pageNumber++
      ) {
        const page = await pdf.getPage(pageNumber);

        const content = await page.getTextContent();

        /*
         * IMPORTANT:
         *
         * Do NOT simply do:
         *
         * content.items.map(item => item.str).join(" ")
         *
         * because that destroys the visual line structure
         * of the PDF.
         *
         * Instead, group text items according to their
         * vertical Y position.
         */

        const items = content.items
          .filter(
            (item) =>
              typeof item.str === "string" &&
              item.str.trim()
          )
          .map((item) => ({
            text: item.str.trim(),
            x: Number(item.transform?.[4] || 0),
            y: Number(item.transform?.[5] || 0),
          }));

        /*
         * Sort from top to bottom and then left to right.
         *
         * PDF coordinates normally use a bottom-left origin,
         * therefore higher Y values appear higher on the page.
         */

        items.sort((a, b) => {
          const yDifference = b.y - a.y;

          if (Math.abs(yDifference) > 3) {
            return yDifference;
          }

          return a.x - b.x;
        });

        const lines = [];

        /*
         * Group nearby text items into the same visual line.
         */

        for (const item of items) {
          let existingLine = null;

          for (const line of lines) {
            if (Math.abs(line.y - item.y) <= 3) {
              existingLine = line;
              break;
            }
          }

          if (!existingLine) {
            existingLine = {
              y: item.y,
              items: [],
            };

            lines.push(existingLine);
          }

          existingLine.items.push(item);
        }

        /*
         * Sort every line from left to right and rebuild
         * readable text.
         */

        lines.sort((a, b) => b.y - a.y);

        const pageLines = lines
          .map((line) => {
            line.items.sort((a, b) => a.x - b.x);

            return line.items
              .map((item) => item.text)
              .join(" ")
              .replace(/\s+/g, " ")
              .trim();
          })
          .filter(Boolean);

        fullText += `${pageLines.join("\n")}\n`;
      }

      return fullText.trim();
    }

    /* ------------------------------------------------------------
       DOCX
       ------------------------------------------------------------ */

    if (extension === "docx") {
      if (typeof mammoth === "undefined") {
        throw new Error(
          "DOCX parser is still loading. Please retry in a moment."
        );
      }

      const buffer = await file.arrayBuffer();

      const result = await mammoth.extractRawText({
        arrayBuffer: buffer,
      });

      return result.value.trim();
    }

    throw new Error("Unsupported resume file type.");
  }

  /* ============================================================
     CANDIDATE NAME EXTRACTION
     ============================================================ */

  function cleanCandidateName(value) {
    if (!value) {
      return "";
    }

    let name = String(value)
      .replace(/\u00a0/g, " ")
      .replace(/[|•·]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    /*
     * Remove common labels that sometimes appear before a name.
     */

    name = name.replace(
      /^(name|candidate\s*name|full\s*name)\s*[:\-]\s*/i,
      ""
    );

    /*
     * If the name is followed by a title, keep only the name.
     *
     * Example:
     * Mansi Kanchan - Software Engineer
     */

    name = name
      .split(/\s(?:—|–|-)\s/)
      .shift()
      .trim();

    name = name
      .replace(
        /\s+(software engineer|senior software engineer|developer|engineer|architect|manager|designer|analyst|consultant|recruiter|frontend developer|backend developer|full stack developer|full-stack developer)$/i,
        ""
      )
      .trim();

    /*
     * Remove email/contact information if accidentally attached.
     */

    name = name
      .replace(
        /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
        ""
      )
      .trim();

    name = name
      .replace(
        /\b(?:https?:\/\/|www\.)\S+/gi,
        ""
      )
      .trim();

    /*
     * Remove leading/trailing punctuation.
     */

    name = name
      .replace(/^[,;:|•\-–—]+/, "")
      .replace(/[,;:|•\-–—]+$/, "")
      .trim();

    return name;
  }

  function looksLikeCandidateName(line) {
    if (!line) {
      return false;
    }

    const value = cleanCandidateName(line);

    if (!value) {
      return false;
    }

    if (value.length < 3 || value.length > 60) {
      return false;
    }

    /*
     * Never treat these as candidate names.
     */

    const blockedPatterns = [
      /^(resume|curriculum vitae|cv)$/i,
      /^professional summary$/i,
      /^summary$/i,
      /^profile$/i,
      /^professional profile$/i,
      /^objective$/i,
      /^career objective$/i,
      /^work experience$/i,
      /^experience$/i,
      /^employment history$/i,
      /^education$/i,
      /^skills$/i,
      /^technical skills$/i,
      /^core skills$/i,
      /^core competencies$/i,
      /^certifications?$/i,
      /^projects?$/i,
      /^achievements?$/i,
      /^references?$/i,
      /^contact$/i,
      /^contact information$/i,
      /^professional experience$/i,
      /^areas of expertise$/i,
      /^qualifications$/i,
      /^responsibilities$/i,
      /^key responsibilities$/i,
      /^languages?$/i,
      /^interests?$/i,
      /^linkedin$/i,
      /^github$/i,
    ];

    if (
      blockedPatterns.some((pattern) =>
        pattern.test(value)
      )
    ) {
      return false;
    }

    /*
     * Do not accept lines containing contact information.
     */

    if (/@/.test(value)) {
      return false;
    }

    if (
      /(?:https?:\/\/|www\.|linkedin\.com|github\.com)/i.test(
        value
      )
    ) {
      return false;
    }

    /*
     * Do not accept phone numbers.
     */

    if (
      /\+?\d[\d\s().-]{7,}\d/.test(value)
    ) {
      return false;
    }

    /*
     * A likely name generally contains 2–5 words.
     */

    const words = value
      .split(/\s+/)
      .filter(Boolean);

    if (words.length < 2 || words.length > 5) {
      return false;
    }

    /*
     * Names should not contain obvious resume section syntax.
     */

    if (
      /[:;]/.test(value) ||
      /[=<>]/.test(value)
    ) {
      return false;
    }

    /*
     * Reject lines containing too many numbers.
     */

    const digitCount = (
      value.match(/\d/g) || []
    ).length;

    if (digitCount > 2) {
      return false;
    }

    /*
     * Most names consist primarily of alphabetic characters.
     */

    const alphaCount = (
      value.match(/[A-Za-zÀ-ÖØ-öø-ÿ]/g) || []
    ).length;

    if (
      alphaCount <
      Math.max(3, Math.floor(value.length * 0.55))
    ) {
      return false;
    }

    /*
     * Reject obvious job-title / heading lines.
     */

    const titleWords = [
      "engineer",
      "developer",
      "architect",
      "manager",
      "director",
      "designer",
      "analyst",
      "consultant",
      "specialist",
      "administrator",
      "scientist",
      "intern",
      "recruiter",
      "marketing",
      "human resources",
      "product manager",
      "project manager",
      "software",
      "technology",
      "technologies",
    ];

    const lower = value.toLowerCase();

    const titleWordCount = titleWords.filter(
      (word) => lower.includes(word)
    ).length;

    if (titleWordCount >= 2) {
      return false;
    }

    /*
     * Reject long sentence-like lines.
     */

    if (words.length >= 4) {
      const sentenceIndicators = [
        "with",
        "and",
        "for",
        "from",
        "using",
        "experienced",
        "experience",
        "specialist",
        "professional",
        "responsible",
        "proven",
        "expertise",
      ];

      if (
        sentenceIndicators.some((word) =>
          new RegExp(`\\b${word}\\b`, "i").test(value)
        )
      ) {
        return false;
      }
    }

    /*
     * Finally, a likely name should have each word
     * looking like a normal name component.
     */

    const validNameWordPattern =
      /^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ.'-]*$/;

    if (
      !words.every((word) =>
        validNameWordPattern.test(word)
      )
    ) {
      return false;
    }

    return true;
  }

  function inferCandidateName(resumeText, file = null) {
    if (!resumeText) {
      return getNameFromFilename(file);
    }

    /*
     * Normalize line breaks.
     */

    const lines = String(resumeText)
      .split(/\r?\n/)
      .map((line) =>
        line
          .replace(/\u00a0/g, " ")
          .replace(/\s+/g, " ")
          .trim()
      )
      .filter(Boolean);

    /*
     * Search the first part of the resume first.
     *
     * Candidate names almost always appear near the top.
     */

    const topLines = lines.slice(
      0,
      Math.min(lines.length, 20)
    );

    /*
     * FIRST PASS:
     *
     * Prefer a clean name appearing in the first
     * few lines.
     */

    for (
      let index = 0;
      index < topLines.length;
      index++
    ) {
      const line = topLines[index];

      /*
       * Direct candidate-name labels.
       *
       * Example:
       * Name: Mansi Kanchan
       */

      const labeledMatch = line.match(
        /^(?:name|candidate\s*name|full\s*name)\s*[:\-]\s*(.+)$/i
      );

      if (labeledMatch) {
        const labeledName = cleanCandidateName(
          labeledMatch[1]
        );

        if (looksLikeCandidateName(labeledName)) {
          return labeledName;
        }
      }

      /*
       * Handle a line where the name is followed by
       * a separator and professional title.
       *
       * Example:
       *
       * Mansi Kanchan | Software Engineer
       */

      const separatorParts = line.split(
        /\s+[|•·]\s+/
      );

      if (separatorParts.length >= 2) {
        const possibleName = cleanCandidateName(
          separatorParts[0]
        );

        if (
          looksLikeCandidateName(possibleName)
        ) {
          return possibleName;
        }
      }

      /*
       * Handle "Name - Job Title".
       */

      const dashParts = line.split(
        /\s+(?:—|–|-)\s+/
      );

      if (dashParts.length >= 2) {
        const possibleName = cleanCandidateName(
          dashParts[0]
        );

        if (
          looksLikeCandidateName(possibleName)
        ) {
          return possibleName;
        }
      }

      /*
       * Normal clean name line.
       */

      if (looksLikeCandidateName(line)) {
        return cleanCandidateName(line);
      }
    }

    /*
     * SECOND PASS:
     *
     * Sometimes PDF extraction puts multiple visual
     * elements onto one line.
     *
     * Split candidate-looking chunks around common
     * contact separators.
     */

    const earlyText = topLines
      .slice(0, 8)
      .join("\n");

    const chunks = earlyText
      .split(
        /(?:\s{2,}|\||•|·|\t)/
      )
      .map((chunk) => chunk.trim())
      .filter(Boolean);

    for (const chunk of chunks) {
      const cleaned = cleanCandidateName(chunk);

      if (looksLikeCandidateName(cleaned)) {
        return cleaned;
      }
    }

    /*
     * THIRD PASS:
     *
     * Look through the first 40 lines if necessary.
     */

    const broaderLines = lines.slice(
      0,
      Math.min(lines.length, 40)
    );

    for (const line of broaderLines) {
      if (looksLikeCandidateName(line)) {
        return cleanCandidateName(line);
      }
    }

    /*
     * FINAL FALLBACK:
     *
     * Try extracting a human-readable name from the
     * uploaded filename.
     */

    const filenameName = getNameFromFilename(file);

    if (filenameName) {
      return filenameName;
    }

    return "Candidate Assessment";
  }

  function getNameFromFilename(file) {
    if (!file || !file.name) {
      return "";
    }

    let filename = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[_]+/g, " ")
      .replace(/[-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    /*
     * Remove common resume filename words.
     */

    filename = filename
      .replace(
        /\b(resume|cv|curriculum vitae|updated|final|latest|new|version)\b/gi,
        ""
      )
      .replace(/\s+/g, " ")
      .trim();

    if (looksLikeCandidateName(filename)) {
      return cleanCandidateName(filename);
    }

    return "";
  }

  /* ============================================================
     MAIN ANALYSIS
     ============================================================ */

  if (analyseBtn) {
    analyseBtn.addEventListener("click", async () => {
      UI.hideError();

      if (
        !selectedFile &&
        !simulatedResumeText
      ) {
        UI.showError(
          "Please upload a candidate resume or load a benchmark profile."
        );

        return;
      }

      const jdText = jdTextarea
        ? jdTextarea.value.trim()
        : "";

      if (!jdText) {
        UI.showError(
          "Please provide the Job Description context."
        );

        return;
      }

      const targetRole = targetRoleInput
        ? (
          targetRoleInput.value.trim() ||
          "Senior Software Engineer"
        )
        : "Senior Software Engineer";

      currentCandidateInfo.targetRole =
        targetRole;

      UI.showLoading();

      try {
        /* --------------------------------------------------------
           1. Extract resume text
           -------------------------------------------------------- */

        const resumeText =
          await extractResumeText(selectedFile);

        if (
          !resumeText ||
          resumeText.length < 30
        ) {
          throw new Error(
            "Extracted resume text is too short. Please upload a detailed resume."
          );
        }

        console.log(
          "Extracted resume text:",
          resumeText
        );

        /* --------------------------------------------------------
           2. Identify candidate
           -------------------------------------------------------- */

        if (!simulatedResumeText) {
          const detectedCandidateName =
            inferCandidateName(
              resumeText,
              selectedFile
            );

          console.log(
            "Detected candidate name:",
            detectedCandidateName
          );

          currentCandidateInfo.candidateName =
            detectedCandidateName;

          currentCandidateInfo.candidateId =
            `CAN-${Math.floor(
              1000 + Math.random() * 9000
            )}`;

          currentCandidateInfo.isBenchmark =
            false;

          currentCandidateInfo.isDemo =
            false;
        }

        /*
         * This is intentionally done BEFORE the screening
         * endpoint is called.
         *
         * Therefore UI.renderScoreCard(),
         * UI.renderCandidateEvaluation(), history,
         * and the screening header all receive the
         * detected candidate name.
         */

        console.log(
          "Current candidate:",
          currentCandidateInfo
        );

        /* --------------------------------------------------------
           3. PRIMARY BACKEND CALL
           -------------------------------------------------------- */

        const screeningResult =
          await API.screenCandidate({
            resume_text: resumeText,
            jd_text: jdText,
            job_title: targetRole,
          });

        if (!screeningResult) {
          throw new Error(
            "The backend returned an empty screening result."
          );
        }

        latestAnalysisResult =
          screeningResult;

        /* --------------------------------------------------------
           4. Render score
           -------------------------------------------------------- */

        UI.renderScoreCard(
          screeningResult,
          currentCandidateInfo
        );

        /* --------------------------------------------------------
           5. Render matched skills
           -------------------------------------------------------- */

        UI.renderSkillsPanel({
          matched_technical_skills:
            screeningResult
              .matched_technical_skills || [],

          matched_soft_skills:
            screeningResult
              .matched_soft_skills || [],
        });

        /* --------------------------------------------------------
           6. Strengths / concerns
           -------------------------------------------------------- */

        UI.renderStrengthsAndConcerns(
          screeningResult.strengths || [],
          screeningResult.risks || []
        );

        /* --------------------------------------------------------
           7. Interview focus
           -------------------------------------------------------- */

        UI.renderInterviewFocus(
          screeningResult
            .interview_preparation || {}
        );

        /* --------------------------------------------------------
           8. Gap analysis
           -------------------------------------------------------- */

        UI.renderGapsPanel({
          critical_missing_skills:
            screeningResult
              .critical_gaps || [],

          secondary_missing_skills:
            screeningResult
              .secondary_gaps || [],

          experience_discrepancies:
            screeningResult
              .experience_discrepancies || [],
        });

        /* --------------------------------------------------------
           9. Resume improvements
           -------------------------------------------------------- */

        UI.renderImprovementsPanel(
          screeningResult
            .resume_improvements || {}
        );

        /* --------------------------------------------------------
           10. Complete interview bank
           -------------------------------------------------------- */

        UI.renderInterviewPanel(
          screeningResult
            .interview_preparation || {}
        );

        /* --------------------------------------------------------
           11. Evaluation view
           -------------------------------------------------------- */

        UI.renderCandidateEvaluation(
          screeningResult,
          currentCandidateInfo
        );

        /* --------------------------------------------------------
           12. Save history
           -------------------------------------------------------- */

        saveToHistory(
          screeningResult,
          currentCandidateInfo
        );

        /* --------------------------------------------------------
           13. Navigate to screening
           -------------------------------------------------------- */

        UI.hideLoading();

        handleNavigation("screening");

        window.location.hash = "screening";

        UI.showToast(
          "Cognitive screening completed successfully.",
          "success"
        );
      } catch (error) {
        console.error(
          "Screening failed:",
          error
        );

        UI.hideLoading();

        UI.showError(
          error?.message ||
          "An unexpected error occurred during cognitive analysis."
        );
      }
    });
  }

  /* ============================================================
     HISTORY
     ============================================================ */

  function getHistoryRecords() {
    try {
      const stored =
        localStorage.getItem(STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored);

        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.warn(
        "Could not parse history.",
        error
      );
    }

    return [];
  }

  function saveToHistory(
    screeningResult,
    candidateInfo
  ) {
    const records =
      getHistoryRecords();

    const newRecord = {
      candidate_name:
        candidateInfo.candidateName,

      candidateId:
        candidateInfo.candidateId,

      email:
        candidateInfo.email ||
        "applicant@recruitment.ai",

      job_title:
        candidateInfo.targetRole,

      seniority:
        screeningResult.seniority_alignment ||
        "Well-Matched",

      match_score:
        Number(
          screeningResult.match_score || 0
        ),

      date:
        new Date().toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "numeric",
            year: "numeric",
          }
        ),

      isDemo: false,

      isBenchmark:
        Boolean(
          candidateInfo.isBenchmark
        ),

      screeningResult:
        screeningResult,
    };

    records.unshift(newRecord);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(records)
    );

    UI.renderHistoryTable(records);
  }

  function refreshHistoryTable(
    filter = "all",
    searchQuery = ""
  ) {
    let records =
      getHistoryRecords();

    const query =
      String(searchQuery || "")
        .trim()
        .toLowerCase();

    if (query) {
      records =
        records.filter((record) => {
          const name =
            String(
              record?.candidate_name ||
              ""
            ).toLowerCase();

          const role =
            String(
              record?.job_title ||
              ""
            ).toLowerCase();

          const email =
            String(
              record?.email ||
              ""
            ).toLowerCase();

          return (
            name.includes(query) ||
            role.includes(query) ||
            email.includes(query)
          );
        });
    }

    if (filter === "real") {
      records =
        records.filter(
          (record) => !record.isDemo
        );
    }

    if (filter === "demo") {
      records =
        records.filter(
          (record) =>
            Boolean(record.isDemo)
        );
    }

    if (filter === "high-match") {
      records =
        records.filter(
          (record) =>
            Number(
              record.match_score || 0
            ) >= 80
        );
    }

    UI.renderHistoryTable(records);

    document
      .querySelectorAll(".btn-open-history")
      .forEach((button) => {
        button.addEventListener(
          "click",
          () => {
            const index =
              Number(
                button.getAttribute(
                  "data-history-idx"
                )
              );

            const record =
              records[index];

            if (
              !record ||
              !record.screeningResult
            ) {
              return;
            }

            currentCandidateInfo = {
              candidateName:
                record.candidate_name,

              candidateId:
                record.candidateId ||
                `CAN-${Math.floor(
                  1000 +
                  Math.random() * 9000
                )}`,

              targetRole:
                record.job_title,

              email:
                record.email,

              isBenchmark:
                Boolean(
                  record.isBenchmark
                ),

              isDemo:
                Boolean(
                  record.isDemo
                ),
            };

            latestAnalysisResult =
              record.screeningResult;

            renderCompleteResult(
              record.screeningResult
            );

            handleNavigation(
              "screening"
            );

            window.location.hash =
              "screening";

            UI.showToast(
              `Opened ${record.candidate_name}'s assessment.`,
              "info"
            );
          }
        );
      });
  }

  function renderCompleteResult(
    screeningResult
  ) {
    UI.renderScoreCard(
      screeningResult,
      currentCandidateInfo
    );

    UI.renderSkillsPanel({
      matched_technical_skills:
        screeningResult
          .matched_technical_skills ||
        [],

      matched_soft_skills:
        screeningResult
          .matched_soft_skills ||
        [],
    });

    UI.renderStrengthsAndConcerns(
      screeningResult.strengths || [],
      screeningResult.risks || []
    );

    UI.renderInterviewFocus(
      screeningResult
        .interview_preparation || {}
    );

    UI.renderGapsPanel({
      critical_missing_skills:
        screeningResult
          .critical_gaps || [],

      secondary_missing_skills:
        screeningResult
          .secondary_gaps || [],

      experience_discrepancies:
        screeningResult
          .experience_discrepancies || [],
    });

    UI.renderImprovementsPanel(
      screeningResult
        .resume_improvements || {}
    );

    UI.renderInterviewPanel(
      screeningResult
        .interview_preparation || {}
    );

    UI.renderCandidateEvaluation(
      screeningResult,
      currentCandidateInfo
    );
  }

  /* ============================================================
     HISTORY SEARCH
     ============================================================ */

  if (historySearchInput) {
    historySearchInput.addEventListener(
      "input",
      (event) => {
        const activeFilter =
          document.querySelector(
            ".filter-pills-group .filter-pill.active"
          );

        const filter =
          activeFilter
            ? activeFilter.getAttribute(
              "data-filter"
            )
            : "all";

        refreshHistoryTable(
          filter,
          event.target.value
        );
      }
    );
  }

  /* ============================================================
     HISTORY FILTERS
     ============================================================ */

  document
    .querySelectorAll(
      ".filter-pills-group .filter-pill"
    )
    .forEach((pill) => {
      pill.addEventListener(
        "click",
        () => {
          document
            .querySelectorAll(
              ".filter-pills-group .filter-pill"
            )
            .forEach((item) => {
              item.classList.remove(
                "active"
              );
            });

          pill.classList.add("active");

          refreshHistoryTable(
            pill.getAttribute(
              "data-filter"
            ),

            historySearchInput
              ? historySearchInput.value
              : ""
          );
        }
      );
    });

  /* ============================================================
     RECRUITER DECISIONS
     ============================================================ */

  function recordDecision(status) {
    try {
      const stored =
        localStorage.getItem(
          DECISIONS_KEY
        ) || "{}";

      const decisions =
        JSON.parse(stored);

      decisions[
        currentCandidateInfo.candidateName
      ] = {
        status,

        candidateId:
          currentCandidateInfo.candidateId,

        role:
          currentCandidateInfo.targetRole,

        recordedAt:
          new Date().toISOString(),
      };

      localStorage.setItem(
        DECISIONS_KEY,
        JSON.stringify(decisions)
      );
    } catch (error) {
      console.warn(
        "Could not save decision locally.",
        error
      );
    }
  }

  if (btnDecisionReject) {
    btnDecisionReject.addEventListener(
      "click",
      () => {
        recordDecision("Rejected");

        UI.showToast(
          `${currentCandidateInfo.candidateName} marked as Rejected.`,
          "error"
        );
      }
    );
  }

  if (btnDecisionHold) {
    btnDecisionHold.addEventListener(
      "click",
      () => {
        recordDecision("On Hold");

        UI.showToast(
          `${currentCandidateInfo.candidateName} placed on Hold.`,
          "info"
        );
      }
    );
  }

  if (btnDecisionAdvance) {
    btnDecisionAdvance.addEventListener(
      "click",
      () => {
        recordDecision(
          "Advanced to Interview"
        );

        UI.showToast(
          `${currentCandidateInfo.candidateName} advanced to Technical Interview.`,
          "success"
        );
      }
    );
  }

  /* ============================================================
     EVALUATION NAVIGATION
     ============================================================ */

  if (btnViewEvalDetail) {
    btnViewEvalDetail.addEventListener(
      "click",
      () => {
        handleNavigation("evaluation");

        window.location.hash =
          "evaluation";
      }
    );
  }

  if (btnEvalBack) {
    btnEvalBack.addEventListener(
      "click",
      () => {
        handleNavigation("screening");

        window.location.hash =
          "screening";
      }
    );
  }

  /* ============================================================
     INTERVIEW ACTIONS
     ============================================================ */

  const interviewHandler = () => {
    recordDecision(
      "Interview Scheduled"
    );

    UI.showToast(
      `Interview workflow recorded for ${currentCandidateInfo.candidateName}.`,
      "success"
    );
  };

  if (btnScheduleInterview) {
    btnScheduleInterview.addEventListener(
      "click",
      interviewHandler
    );
  }

  if (btnEvalMove) {
    btnEvalMove.addEventListener(
      "click",
      interviewHandler
    );
  }

  /* ============================================================
     EXPORT CURRENT REPORT
     ============================================================ */

  function exportReport() {
    if (!latestAnalysisResult) {
      UI.showToast(
        "No active evaluation to export. Please run an analysis first.",
        "error"
      );

      return;
    }

    const report = {
      candidate:
        currentCandidateInfo,

      analysis:
        latestAnalysisResult,

      exportedAt:
        new Date().toISOString(),
    };

    const blob =
      new Blob(
        [
          JSON.stringify(
            report,
            null,
            2
          ),
        ],
        {
          type:
            "application/json",
        }
      );

    const url =
      URL.createObjectURL(blob);

    const anchor =
      document.createElement("a");

    anchor.href = url;

    anchor.download =
      `${safeFilename(
        currentCandidateInfo.candidateName
      )}_Evaluation_Report.json`;

    document.body.appendChild(anchor);

    anchor.click();

    anchor.remove();

    URL.revokeObjectURL(url);

    UI.showToast(
      "Evaluation report exported.",
      "success"
    );
  }

  if (btnExportPdf) {
    btnExportPdf.addEventListener(
      "click",
      exportReport
    );
  }

  /* ============================================================
     EXPORT HISTORY
     ============================================================ */

  function exportAllHistory() {
    const records =
      getHistoryRecords();

    const blob =
      new Blob(
        [
          JSON.stringify(
            records,
            null,
            2
          ),
        ],
        {
          type:
            "application/json",
        }
      );

    const url =
      URL.createObjectURL(blob);

    const anchor =
      document.createElement("a");

    anchor.href = url;

    anchor.download =
      `TalentPulse_Analysis_Repository_${new Date()
        .toISOString()
        .split("T")[0]
      }.json`;

    document.body.appendChild(anchor);

    anchor.click();

    anchor.remove();

    URL.revokeObjectURL(url);

    UI.showToast(
      "Analysis repository exported.",
      "success"
    );
  }

  if (btnExportHistoryReport) {
    btnExportHistoryReport.addEventListener(
      "click",
      exportAllHistory
    );
  }

  /* ============================================================
     GLOBAL SEARCH
     ============================================================ */

  if (globalSearchInput) {
    globalSearchInput.addEventListener(
      "keydown",
      (event) => {
        if (event.key !== "Enter") {
          return;
        }

        handleNavigation("history");

        window.location.hash =
          "history";

        if (historySearchInput) {
          historySearchInput.value =
            globalSearchInput.value;

          refreshHistoryTable(
            "all",
            globalSearchInput.value
          );
        }
      }
    );
  }

  /* ============================================================
     RESET
     ============================================================ */

  function resetAnalysisForm() {
    selectedFile = null;
    simulatedResumeText = "";
    latestAnalysisResult = null;

    currentCandidateInfo = {
      candidateName: "Candidate",
      candidateId: "",
      targetRole:
        targetRoleInput?.value?.trim() ||
        "Senior Software Engineer",
      email: "",
      isBenchmark: false,
      isDemo: false,
    };

    if (fileInput) {
      fileInput.value = "";
    }

    if (fileSelectedChip) {
      fileSelectedChip.classList.add(
        "hidden"
      );
    }

    if (dropzone) {
      dropzone.classList.remove(
        "hidden"
      );
    }

    UI.hideLoading();
    UI.hideError();

    if (jdTextarea) {
      jdTextarea.value = "";
    }

    if (targetRoleInput) {
      targetRoleInput.value =
        "Senior Software Engineer";
    }
  }

  /* ============================================================
     SAFE FILENAME
     ============================================================ */

  function safeFilename(value) {
    return String(
      value || "Candidate"
    )
      .replace(
        /[^a-z0-9]+/gi,
        "_"
      )
      .replace(
        /^_+|_+$/g,
        ""
      ) || "Candidate";
  }

  /* ============================================================
     INITIAL LOAD
     ============================================================ */

  refreshHistoryTable();

  const initialHash =
    window.location.hash
      .replace("#", "")
      .trim();

  handleNavigation(
    initialHash || "analyze"
  );

  console.log(
    "TalentPulse AI main controller initialized."
  );
});