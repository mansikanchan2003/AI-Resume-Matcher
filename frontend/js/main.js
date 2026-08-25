document.addEventListener("DOMContentLoaded", () => {
  const dropzone = document.getElementById("resume-dropzone");
  const fileInput = document.getElementById("resume-file-input");
  const fileStatus = document.getElementById("resume-file-status");
  const jdTextarea = document.getElementById("jd-textarea");
  const analyseBtn = document.getElementById("analyse-btn");

  let selectedFile = null;

  // ------------------------------------------------------------
  // Resume file handling
  // ------------------------------------------------------------

  function setSelectedFile(file) {
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain"
    ];

    const extension = file.name.toLowerCase().split(".").pop();
    const allowedExtensions = ["pdf", "docx", "txt"];

    if (!allowedTypes.includes(file.type) &&
      !allowedExtensions.includes(extension)) {
      UI.showError("Please upload a PDF, DOCX, or TXT resume.");
      return;
    }

    selectedFile = file;

    fileStatus.textContent = `✓ ${file.name}`;
    fileStatus.classList.remove("hidden");
    UI.hideError();
  }

  dropzone.addEventListener("click", () => {
    fileInput.click();
  });

  dropzone.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      fileInput.click();
    }
  });

  fileInput.addEventListener("change", (event) => {
    setSelectedFile(event.target.files[0]);
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

    const file = event.dataTransfer.files[0];
    setSelectedFile(file);
  });

  // ------------------------------------------------------------
  // Resume text extraction
  // ------------------------------------------------------------

  async function extractResumeText(file) {
    const extension = file.name.toLowerCase().split(".").pop();

    // TXT
    if (extension === "txt") {
      return await file.text();
    }

    // PDF
    if (extension === "pdf") {
      if (typeof pdfjsLib === "undefined") {
        throw new Error(
          "PDF reader is not loaded. Please refresh the page and try again."
        );
      }

      const arrayBuffer = await file.arrayBuffer();

      const pdf = await pdfjsLib.getDocument({
        data: arrayBuffer
      }).promise;

      let text = "";

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);
        const content = await page.getTextContent();

        text += content.items
          .map(item => item.str)
          .join(" ");

        text += "\n";
      }

      return text.trim();
    }

    // DOCX
    if (extension === "docx") {
      if (typeof mammoth === "undefined") {
        throw new Error(
          "DOCX reader is not loaded. Please refresh the page and try again."
        );
      }

      const arrayBuffer = await file.arrayBuffer();

      const result = await mammoth.extractRawText({
        arrayBuffer
      });

      return result.value.trim();
    }

    throw new Error("Unsupported resume format.");
  }

  // ------------------------------------------------------------
  // Main analysis flow
  // ------------------------------------------------------------

  analyseBtn.addEventListener("click", async () => {
    UI.hideError();

    if (!selectedFile) {
      UI.showError("Please upload your resume first.");
      return;
    }

    const jdText = jdTextarea.value.trim();

    if (!jdText) {
      UI.showError("Please paste the job description.");
      return;
    }

    UI.showLoading();

    try {
      // 1. Extract resume text
      const resumeText = await extractResumeText(selectedFile);

      if (!resumeText || resumeText.length < 30) {
        throw new Error(
          "Could not extract enough text from the resume. Please upload a text-based PDF, DOCX, or TXT file."
        );
      }

      // --------------------------------------------------------
      // 2. High-level analysis
      // --------------------------------------------------------

      const analysisForm = new FormData();
      analysisForm.append("resume_text", resumeText);
      analysisForm.append("jd_text", jdText);

      const analysis = await API.analyseResume(analysisForm);

      UI.renderScoreCard(analysis);

      // --------------------------------------------------------
      // 3. Skill matching
      // --------------------------------------------------------

      const skills = await API.matchSkills({
        resume_text: resumeText,
        jd_text: jdText
      });

      UI.renderSkillsPanel(skills);

      // Extract matched skills for the next API call
      const matchedTechnicalSkills =
        skills.matched_technical_skills || [];

      const matchedSoftSkills =
        skills.matched_soft_skills || [];

      const matchedSkills = [
        ...matchedTechnicalSkills.map(item => item.skill),
        ...matchedSoftSkills
      ];

      // --------------------------------------------------------
      // 4. Gap detection
      // --------------------------------------------------------

      const gaps = await API.detectGaps({
        resume_text: resumeText,
        jd_text: jdText,
        matched_skills: matchedSkills
      });

      UI.renderGapsPanel(gaps);

      const criticalMissing =
        gaps.critical_missing_skills || [];

      const secondaryMissing =
        gaps.secondary_missing_skills || [];

      const missingSkills = [
        ...criticalMissing,
        ...secondaryMissing
      ];

      // --------------------------------------------------------
      // 5. Resume improvements
      // --------------------------------------------------------

      const improvements = await API.getImprovements({
        resume_text: resumeText,
        job_title: "Software Developer",
        critical_gaps: criticalMissing
      });

      UI.renderImprovementsPanel(improvements);

      // --------------------------------------------------------
      // 6. Interview preparation
      // --------------------------------------------------------

      const interview = await API.generateInterviewQuestions({
        jd_text: jdText,
        matched_skills: matchedSkills,
        missing_skills: missingSkills
      });

      UI.renderInterviewPanel(interview);

      // --------------------------------------------------------
      // 7. Show results
      // --------------------------------------------------------

      UI.showResults();

    } catch (error) {
      console.error("Analysis failed:", error);

      UI.showError(
        error.message ||
        "Something went wrong while analysing your resume."
      );

    } finally {
      UI.hideLoading();
    }
  });

  // ------------------------------------------------------------
  // Tabs
  // ------------------------------------------------------------

  document.querySelectorAll(".tab-btn").forEach(button => {
    button.addEventListener("click", () => {
      UI.activateTab(button.dataset.tab);
    });
  });

  console.log("Main controller loaded successfully");
});
