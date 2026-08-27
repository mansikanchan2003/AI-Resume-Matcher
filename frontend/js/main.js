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
      // 2. Complete AI-assisted screening
      // --------------------------------------------------------

      const screeningResult = await API.screenCandidate({
        resume_text: resumeText,
        jd_text: jdText,
        job_title: "Software Developer"
      });

      // --------------------------------------------------------
      // 3. Render complete results
      // --------------------------------------------------------

      UI.renderScoreCard(screeningResult);

      UI.renderSkillsPanel({
        matched_technical_skills:
          screeningResult.matched_technical_skills || [],
        matched_soft_skills:
          screeningResult.matched_soft_skills || []
      });

      UI.renderGapsPanel({
        critical_missing_skills:
          screeningResult.critical_gaps || [],
        secondary_missing_skills:
          screeningResult.secondary_gaps || [],
        experience_discrepancies:
          screeningResult.experience_discrepancies || []
      });

      UI.renderImprovementsPanel(
        screeningResult.resume_improvements || {}
      );

      UI.renderInterviewPanel(
        screeningResult.interview_preparation || {}
      );

      // --------------------------------------------------------
      // 4. Show results
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
