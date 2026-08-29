/**
 * ================================================================
 * TALENTPULSE AI — UI CONTROLLER
 * ================================================================
 *
 * Frontend UI controller for the Stitch-designed recruiter
 * interface.
 *
 * IMPORTANT:
 * - This file does NOT call the backend.
 * - This file does NOT recreate backend/LLM logic.
 * - This file only renders data supplied by main.js/api.js.
 * - Real AI values must come from the original FastAPI response.
 *
 * Backend remains the source of truth.
 * ================================================================
 */

const UI = {

  // ---------------------------------------------------------------
  // APPLICATION VIEW STATE
  // ---------------------------------------------------------------

  currentView: "analyze",

  /**
   * Switch application view.
   *
   * Supported views:
   * analyze
   * screening
   * evaluation
   * history
   * settings
   * support
   */
  switchView(viewId) {

    const validViews = [
      "analyze",
      "screening",
      "evaluation",
      "history",
      "settings",
      "support"
    ];

    if (!validViews.includes(viewId)) {
      viewId = "analyze";
    }

    this.currentView = viewId;

    // -------------------------------------------------------------
    // Sidebar navigation
    // -------------------------------------------------------------

    document
      .querySelectorAll(".sidebar-nav .nav-item")
      .forEach(item => {

        const active =
          item.getAttribute("data-view") === viewId;

        item.classList.toggle("active", active);
      });

    // -------------------------------------------------------------
    // Main view visibility
    // -------------------------------------------------------------

    validViews.forEach(view => {

      const section =
        document.getElementById(`view-${view}`);

      if (section) {
        section.classList.toggle(
          "hidden",
          view !== viewId
        );
      }
    });

    // -------------------------------------------------------------
    // Header title
    // -------------------------------------------------------------

    const titleMap = {

      analyze:
        "Candidate Intelligence Workspace",

      screening:
        "Screening Intelligence & Match Analysis",

      evaluation:
        "Candidate Evaluation & Recruiter Assessment",

      history:
        "Analysis Repository",

      settings:
        "Platform Settings",

      support:
        "Recruiter Knowledge Base & Support"
    };

    const titleEl =
      document.getElementById("current-view-title");

    if (titleEl) {
      titleEl.textContent =
        titleMap[viewId] || "TalentPulse AI";
    }

    // -------------------------------------------------------------
    // Scroll application content to top
    // -------------------------------------------------------------

    const mainEl =
      document.querySelector(".app-main");

    if (mainEl) {
      mainEl.scrollTop = 0;
    }
  },


  // ---------------------------------------------------------------
  // LOADING STATE
  // ---------------------------------------------------------------

  showLoading() {

    const button =
      document.getElementById("analyse-btn");

    const label =
      document.getElementById("btn-label");

    const loadingCard =
      document.getElementById("analysis-loading-card");

    if (button) {
      button.disabled = true;
    }

    if (label) {
      label.textContent =
        "Synthesizing Evaluation...";
    }

    if (loadingCard) {
      loadingCard.classList.remove("hidden");
    }

    this.hideError();

    this.animateLoadingSteps();
  },


  animateLoadingSteps() {

    const step1 =
      document.getElementById("step-1");

    const step2 =
      document.getElementById("step-2");

    const step3 =
      document.getElementById("step-3");

    if (step1) {
      step1.className =
        "loading-step-item active";
    }

    if (step2) {
      step2.className =
        "loading-step-item";
    }

    if (step3) {
      step3.className =
        "loading-step-item";
    }

    window.setTimeout(() => {

      if (step1) {
        step1.className =
          "loading-step-item done";
      }

      if (step2) {
        step2.className =
          "loading-step-item active";
      }

    }, 1800);

    window.setTimeout(() => {

      if (step2) {
        step2.className =
          "loading-step-item done";
      }

      if (step3) {
        step3.className =
          "loading-step-item active";
      }

    }, 3800);
  },


  hideLoading() {

    const button =
      document.getElementById("analyse-btn");

    const label =
      document.getElementById("btn-label");

    const loadingCard =
      document.getElementById("analysis-loading-card");

    if (button) {
      button.disabled = false;
    }

    if (label) {
      label.textContent =
        "Start Cognitive Analysis";
    }

    if (loadingCard) {
      loadingCard.classList.add("hidden");
    }
  },


  // ---------------------------------------------------------------
  // ERROR HANDLING
  // ---------------------------------------------------------------

  showError(message) {

    const error =
      document.getElementById("error-msg");

    if (!error) {
      return;
    }

    error.textContent =
      `⚠️ ${message}`;

    error.classList.remove("hidden");
  },


  hideError() {

    const error =
      document.getElementById("error-msg");

    if (!error) {
      return;
    }

    error.textContent = "";

    error.classList.add("hidden");
  },


  // ---------------------------------------------------------------
  // TOASTS
  // ---------------------------------------------------------------

  showToast(message, type = "info") {

    const container =
      document.getElementById("toast-container");

    if (!container) {
      return;
    }

    const toast =
      document.createElement("div");

    toast.className =
      `toast ${type}`;

    let icon = "✨";

    if (type === "success") {
      icon = "✅";
    }

    if (type === "error") {
      icon = "⚠️";
    }

    const iconEl =
      document.createElement("span");

    iconEl.textContent = icon;

    const messageEl =
      document.createElement("span");

    messageEl.textContent =
      String(message ?? "");

    toast.appendChild(iconEl);
    toast.appendChild(messageEl);

    container.appendChild(toast);

    window.setTimeout(() => {

      toast.style.opacity = "0";
      toast.style.transform =
        "translateY(10px)";
      toast.style.transition =
        "all 0.3s ease";

      window.setTimeout(() => {
        toast.remove();
      }, 300);

    }, 3500);
  },


  // ---------------------------------------------------------------
  // SCORE CARD
  // ---------------------------------------------------------------

  /**
   * Render the overall screening result.
   *
   * Expected backend fields:
   *
   * match_score
   * recommendation
   * seniority_alignment
   * executive_summary
   * escalation_required
   * escalation_reason
   */
  renderScoreCard(data, candidateInfo = {}) {

    if (!data) {
      return;
    }

    const scoreNumber =
      document.getElementById("score-number");

    const tierBadge =
      document.getElementById("match-tier-badge");

    const summary =
      document.getElementById("executive-summary");

    const ring =
      document.getElementById("score-ring-fill");

    const seniorityDisplay =
      document.getElementById(
        "seniority-alignment-display"
      );

    const levelFill =
      document.getElementById(
        "level-fill-segment"
      );

    const candidateNameEl =
      document.getElementById(
        "screening-candidate-name"
      );

    const targetRoleEl =
      document.getElementById(
        "screening-target-role"
      );

    const candidateIdEl =
      document.getElementById(
        "screening-candidate-id"
      );

    const sourceBadgeEl =
      document.getElementById(
        "screening-source-badge"
      );

    // -------------------------------------------------------------
    // Score
    // -------------------------------------------------------------

    const rawScore =
      Number(data.match_score);

    const score =
      Number.isFinite(rawScore)
        ? Math.max(0, Math.min(100, rawScore))
        : 0;

    // -------------------------------------------------------------
    // Candidate information
    // -------------------------------------------------------------

    if (candidateNameEl) {

      candidateNameEl.textContent =
        candidateInfo.candidateName ||
        "Candidate";
    }

    if (targetRoleEl) {

      targetRoleEl.textContent =
        candidateInfo.targetRole ||
        "Target Role";
    }

    if (candidateIdEl) {

      if (candidateInfo.candidateId) {

        candidateIdEl.textContent =
          `ID: ${candidateInfo.candidateId}`;

      } else {

        candidateIdEl.textContent = "";
      }
    }

    // -------------------------------------------------------------
    // Source badge
    // -------------------------------------------------------------

    if (sourceBadgeEl) {

      if (candidateInfo.isBenchmark) {

        sourceBadgeEl.textContent =
          "BENCHMARK PRESET (REAL AI)";

        sourceBadgeEl.className =
          "badge-source-tag badge-source-demo";

      } else {

        sourceBadgeEl.textContent =
          "REAL CANDIDATE ANALYSIS";

        sourceBadgeEl.className =
          "badge-source-tag badge-source-real";
      }
    }

    // -------------------------------------------------------------
    // Score number
    // -------------------------------------------------------------

    if (scoreNumber) {

      scoreNumber.innerHTML =
        `${score}<span class="gauge-percent-sign">%</span>`;
    }

    // -------------------------------------------------------------
    // Circular SVG gauge
    // -------------------------------------------------------------

    if (ring) {

      const radius = 70;

      const circumference =
        2 * Math.PI * radius;

      ring.style.strokeDasharray =
        `${circumference}`;

      ring.style.strokeDashoffset =
        `${circumference}`;

      window.requestAnimationFrame(() => {

        const offset =
          circumference -
          (score / 100) * circumference;

        ring.style.strokeDashoffset =
          `${offset}`;
      });
    }

    // -------------------------------------------------------------
    // Match tier
    // -------------------------------------------------------------

    if (tierBadge) {

      tierBadge.className =
        "match-tier-badge";

      let tierLabel = "Partial Fit";

      if (score >= 90) {

        tierBadge.classList.add(
          "exceptional"
        );

        tierLabel =
          "Exceptional Fit";

      } else if (score >= 75) {

        tierBadge.classList.add(
          "strong"
        );

        tierLabel =
          "Strong Fit";

      } else if (score >= 50) {

        tierBadge.classList.add(
          "moderate"
        );

        tierLabel =
          "Moderate Fit";

      } else {

        tierBadge.classList.add(
          "low"
        );

        tierLabel =
          "Partial Fit";
      }

      tierBadge.innerHTML =
        `<span class="status-dot"></span> ${tierLabel}`;
    }

    // -------------------------------------------------------------
    // Seniority alignment
    // -------------------------------------------------------------

    const seniority =
      data.seniority_alignment ||
      "";

    if (seniorityDisplay) {

      seniorityDisplay.textContent =
        seniority || "Not provided";
    }

    if (levelFill) {

      let width = "0%";

      if (seniority === "Overqualified") {
        width = "95%";
      } else if (
        seniority === "Well-Matched"
      ) {
        width = "80%";
      } else if (
        seniority === "Underqualified"
      ) {
        width = "45%";
      }

      levelFill.style.width =
        width;
    }

    // -------------------------------------------------------------
    // Executive summary
    // -------------------------------------------------------------

    if (summary) {

      summary.textContent =
        data.executive_summary ||
        "No executive summary was returned by the AI analysis.";
    }

    // -------------------------------------------------------------
    // Recommendation
    // -------------------------------------------------------------

    const recommendationEl =
      document.getElementById(
        "screening-recommendation"
      );

    if (recommendationEl) {

      recommendationEl.textContent =
        data.recommendation ||
        "Not provided";
    }

    // -------------------------------------------------------------
    // Escalation notice
    // -------------------------------------------------------------

    const escalationCard =
      document.getElementById(
        "escalation-notice-card"
      );

    const escalationReason =
      document.getElementById(
        "escalation-reason-text"
      );

    const escalationRequired =
      Boolean(data.escalation_required);

    if (
      escalationCard &&
      escalationReason
    ) {

      if (
        escalationRequired &&
        data.escalation_reason
      ) {

        escalationCard.classList.remove(
          "hidden"
        );

        escalationReason.textContent =
          data.escalation_reason;

      } else {

        escalationCard.classList.add(
          "hidden"
        );

        escalationReason.textContent =
          "";
      }
    }
  },


  // ---------------------------------------------------------------
  // TECHNICAL + SOFT SKILLS
  // ---------------------------------------------------------------

  /**
   * Render skills using actual backend data.
   *
   * IMPORTANT:
   * The backend provides skill matches and evidence.
   * It does NOT provide a percentage for each individual skill.
   *
   * Therefore this function DOES NOT invent percentages.
   */
  renderSkillsPanel(data) {

    const container =
      document.getElementById(
        "competency-list-container"
      );

    const countTag =
      document.getElementById(
        "matched-skills-count-tag"
      );

    if (!container) {
      return;
    }

    const technical =
      Array.isArray(
        data?.matched_technical_skills
      )
        ? data.matched_technical_skills
        : [];

    const soft =
      Array.isArray(
        data?.matched_soft_skills
      )
        ? data.matched_soft_skills
        : [];

    if (countTag) {

      countTag.textContent =
        `${technical.length} Skills Matched`;
    }

    let html = "";

    // -------------------------------------------------------------
    // Technical skills
    // -------------------------------------------------------------

    if (technical.length === 0) {

      html += `
        <div style="
          padding: 16px;
          color: var(--text-muted);
          font-size: 0.88rem;
        ">
          No direct technical skills were returned
          by the AI analysis.
        </div>
      `;

    } else {

      technical.forEach(item => {

        const skill =
          item?.skill ||
          "Unnamed Skill";

        const evidence =
          item?.resume_evidence ||
          "No resume evidence was provided by the AI analysis.";

        html += `
          <div class="competency-item">

            <div class="competency-header">

              <span>
                ${this.escapeHtml(skill)}
              </span>

              <span class="competency-score">
                Matched
              </span>

            </div>

            <div class="competency-track">

              <div
                class="competency-fill"
                style="width: 100%;"
              ></div>

            </div>

            <div class="competency-evidence-text">

              <strong>Resume Evidence:</strong>
              ${this.escapeHtml(evidence)}

            </div>

          </div>
        `;
      });
    }

    // -------------------------------------------------------------
    // Soft skills
    // -------------------------------------------------------------

    if (soft.length > 0) {

      html += `
        <div style="
          margin-top: 14px;
          padding-top: 12px;
          border-top: 1px solid var(--border-subtle);
        ">

          <span style="
            font-family: var(--font-mono);
            font-size: 0.72rem;
            color: var(--text-muted);
            text-transform: uppercase;
          ">
            Aligned Soft Competencies:
          </span>

          <div style="
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-top: 8px;
          ">

            ${soft.map(skill => `
              <span
                class="badge-tag-id"
                style="
                  color: var(--color-accent-cyan);
                  background: rgba(6, 182, 212, 0.1);
                  border-color: rgba(6, 182, 212, 0.3);
                "
              >
                ${this.escapeHtml(skill)}
              </span>
            `).join("")}

          </div>

        </div>
      `;
    }

    container.innerHTML =
      html;
  },


  // ---------------------------------------------------------------
  // STRENGTHS + CONCERNS
  // ---------------------------------------------------------------

  /**
   * The backend response calls this field "risks",
   * not "concerns".
   *
   * main.js can pass:
   *
   * UI.renderStrengthsAndConcerns(
   *   result.strengths,
   *   result.risks
   * );
   */
  renderStrengthsAndConcerns(
    strengths = [],
    concerns = []
  ) {

    const strengthsContainer =
      document.getElementById(
        "strengths-list-container"
      );

    const concernsContainer =
      document.getElementById(
        "concerns-list-container"
      );

    // -------------------------------------------------------------
    // Strengths
    // -------------------------------------------------------------

    if (strengthsContainer) {

      if (
        !Array.isArray(strengths) ||
        strengths.length === 0
      ) {

        strengthsContainer.innerHTML = `
          <li>
            <span class="bullet-icon">
              ✓
            </span>

            No specific strengths were returned
            by the AI analysis.
          </li>
        `;

      } else {

        strengthsContainer.innerHTML =
          strengths.map(strength => `
            <li>

              <svg
                class="bullet-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <polyline
                  points="20 6 9 17 4 12"
                ></polyline>
              </svg>

              <span>
                ${this.escapeHtml(strength)}
              </span>

            </li>
          `).join("");
      }
    }

    // -------------------------------------------------------------
    // Risks / concerns
    // -------------------------------------------------------------

    if (concernsContainer) {

      if (
        !Array.isArray(concerns) ||
        concerns.length === 0
      ) {

        concernsContainer.innerHTML = `
          <li>

            <span class="bullet-icon">
              ✓
            </span>

            No risks were returned by
            the AI analysis.

          </li>
        `;

      } else {

        concernsContainer.innerHTML =
          concerns.map(concern => `
            <li>

              <svg
                class="bullet-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                ></circle>

                <line
                  x1="12"
                  y1="8"
                  x2="12"
                  y2="12"
                ></line>

                <line
                  x1="12"
                  y1="16"
                  x2="12.01"
                  y2="16"
                ></line>

              </svg>

              <span>
                ${this.escapeHtml(concern)}
              </span>

            </li>
          `).join("");
      }
    }
  },


  // ---------------------------------------------------------------
  // INTERVIEW FOCUS
  // ---------------------------------------------------------------

  /**
   * Render the small interview preview.
   *
   * Expected input:
   *
   * {
   *   technical_questions: [],
   *   behavioural_questions: []
   * }
   */
  renderInterviewFocus(interviewData) {

    const container =
      document.getElementById(
        "interview-focus-list"
      );

    if (!container) {
      return;
    }

    const technical =
      Array.isArray(
        interviewData?.technical_questions
      )
        ? interviewData.technical_questions
        : [];

    const behavioural =
      Array.isArray(
        interviewData?.behavioural_questions
      )
        ? interviewData.behavioural_questions
        : [];

    const topQuestions = [
      ...technical.slice(0, 2),
      ...behavioural.slice(0, 1)
    ];

    if (topQuestions.length === 0) {

      container.innerHTML = `
        <div style="
          padding: 12px;
          color: var(--text-muted);
          font-size: 0.88rem;
        ">
          No targeted interview questions
          were returned by the AI analysis.
        </div>
      `;

      return;
    }

    container.innerHTML =
      topQuestions.map(question => {

        const questionText =
          question?.question ||
          "Question text unavailable.";

        const focus =
          question?.focus_area ||
          question?.competency ||
          "Target Role Alignment";

        const criteria =
          question?.evaluation_criteria ||
          "";

        return `
          <div class="interview-question-bubble">

            <div class="question-text-quote">
              "${this.escapeHtml(questionText)}"
            </div>

            <div class="question-meta-tags">

              <span class="question-focus-tag">
                🎯 Focus:
                ${this.escapeHtml(focus)}
              </span>

            </div>

            ${criteria
            ? `
                  <div class="question-eval-guide">

                    <strong>
                      Recruiter Criteria:
                    </strong>

                    ${this.escapeHtml(criteria)}

                  </div>
                `
            : ""
          }

          </div>
        `;
      }).join("");
  },


  // ---------------------------------------------------------------
  // GAPS PANEL
  // ---------------------------------------------------------------

  /**
   * Render the detailed gap analysis.
   *
   * IMPORTANT:
   *
   * ScreeningEvaluationResponse uses:
   *
   * critical_gaps
   * secondary_gaps
   * experience_discrepancies
   *
   * It does NOT use:
   *
   * critical_missing_skills
   * secondary_missing_skills
   */
  renderGapsPanel(data) {

    const panel =
      document.getElementById(
        "panel-detailed-gaps"
      );

    if (!panel) {
      return;
    }

    const critical =
      Array.isArray(data?.critical_gaps)
        ? data.critical_gaps
        : [];

    const secondary =
      Array.isArray(data?.secondary_gaps)
        ? data.secondary_gaps
        : [];

    const discrepancies =
      Array.isArray(
        data?.experience_discrepancies
      )
        ? data.experience_discrepancies
        : [];

    let html = `
      <div style="margin-bottom: 20px;">

        <h3 style="
          font-size: 1.1rem;
          color: #fff;
          margin-bottom: 4px;
        ">
          Audited Qualification Gaps
        </h3>

        <p style="
          color: var(--text-secondary);
          font-size: 0.85rem;
        ">
          Requirements identified by the AI
          analysis that are not sufficiently
          represented in the candidate resume.
        </p>

      </div>
    `;

    // -------------------------------------------------------------
    // Critical gaps
    // -------------------------------------------------------------

    if (critical.length > 0) {

      html += `
        <h4 style="
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--color-accent-rose);
          text-transform: uppercase;
          margin-bottom: 10px;
        ">
          Critical Missing Requirements
          (${critical.length})
        </h4>

        <div style="
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 20px;
        ">
      `;

      critical.forEach(item => {

        html += `
          <div
            class="star-card"
            style="
              border-left:
                3px solid
                var(--color-accent-rose);
            "
          >

            <div style="
              font-weight: 700;
              color: #fff;
              margin-bottom: 4px;
            ">
              ${this.escapeHtml(
          item?.skill ||
          "Unnamed requirement"
        )}
            </div>

            <div style="
              font-size: 0.82rem;
              color: var(--text-secondary);
            ">

              <strong>
                JD Requirement:
              </strong>

              ${this.escapeHtml(
          item?.jd_clause ||
          "No JD clause provided."
        )}

            </div>

          </div>
        `;
      });

      html += `
        </div>
      `;

    } else {

      html += `
        <div style="
          padding: 12px 16px;
          background:
            rgba(16, 185, 129, 0.1);
          border:
            1px solid
            rgba(16, 185, 129, 0.3);
          border-radius: var(--radius-md);
          color: var(--color-accent-emerald);
          font-size: 0.88rem;
          margin-bottom: 16px;
        ">
          ✓ No critical skill gaps detected
          by the AI analysis.
        </div>
      `;
    }

    // -------------------------------------------------------------
    // Secondary gaps
    // -------------------------------------------------------------

    if (secondary.length > 0) {

      html += `
        <h4 style="
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--color-accent-amber);
          text-transform: uppercase;
          margin-bottom: 10px;
        ">
          Secondary / Preferred Gaps
          (${secondary.length})
        </h4>

        <div style="
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 20px;
        ">
      `;

      secondary.forEach(item => {

        html += `
          <div
            class="star-card"
            style="
              border-left:
                3px solid
                var(--color-accent-amber);
            "
          >

            <div style="
              font-weight: 600;
              color: #fff;
              margin-bottom: 4px;
            ">
              ${this.escapeHtml(
          item?.skill ||
          "Unnamed requirement"
        )}
            </div>

            <div style="
              font-size: 0.82rem;
              color: var(--text-secondary);
            ">

              <strong>
                JD Clause:
              </strong>

              ${this.escapeHtml(
          item?.jd_clause ||
          "No JD clause provided."
        )}

            </div>

          </div>
        `;
      });

      html += `
        </div>
      `;
    }

    // -------------------------------------------------------------
    // Experience discrepancies
    // -------------------------------------------------------------

    if (discrepancies.length > 0) {

      html += `
        <h4 style="
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--color-primary-light);
          text-transform: uppercase;
          margin-bottom: 10px;
        ">
          Experience & Seniority
          Discrepancies
        </h4>

        <ul
          class="bullet-insights-list"
          style="margin-bottom: 16px;"
        >
      `;

      discrepancies.forEach(item => {

        html += `
          <li>

            <span class="bullet-icon">
              ℹ️
            </span>

            <span>
              ${this.escapeHtml(item)}
            </span>

          </li>
        `;
      });

      html += `
        </ul>
      `;
    }

    // -------------------------------------------------------------
    // No discrepancy information
    // -------------------------------------------------------------

    if (
      discrepancies.length === 0 &&
      critical.length === 0 &&
      secondary.length === 0
    ) {

      html += `
        <div style="
          color: var(--text-muted);
          font-size: 0.84rem;
          margin-top: 12px;
        ">
          No experience discrepancies were
          returned by the AI analysis.
        </div>
      `;
    }

    panel.innerHTML =
      html;
  },


  // ---------------------------------------------------------------
  // RESUME IMPROVEMENTS
  // ---------------------------------------------------------------

  /**
   * Render resume improvement data.
   *
   * Expected object:
   *
   * {
   *   tailored_summary_statement,
   *   star_bullet_recommendations,
   *   high_value_keywords_to_include
   * }
   *
   * This matches ImprovementResponse.
   */
  renderImprovementsPanel(data) {

    const panel =
      document.getElementById(
        "panel-star-improvements"
      );

    if (!panel) {
      return;
    }

    // -------------------------------------------------------------
    // IMPORTANT:
    // main.js may pass either:
    //
    // result.resume_improvements
    //
    // OR the complete screening result.
    //
    // Support both safely.
    // -------------------------------------------------------------

    const improvements =
      data?.resume_improvements &&
        typeof data.resume_improvements === "object"
        ? data.resume_improvements
        : data || {};

    const recommendations =
      Array.isArray(
        improvements.star_bullet_recommendations
      )
        ? improvements.star_bullet_recommendations
        : [];

    const keywords =
      Array.isArray(
        improvements.high_value_keywords_to_include
      )
        ? improvements.high_value_keywords_to_include
        : [];

    const tailoredSummary =
      improvements.tailored_summary_statement ||
      "";

    let html = `
      <div style="margin-bottom: 20px;">

        <h3 style="
          font-size: 1.1rem;
          color: #fff;
          margin-bottom: 4px;
        ">
          STAR-Format Resume Optimizations
        </h3>

        <p style="
          color: var(--text-secondary);
          font-size: 0.85rem;
        ">
          Action-oriented resume suggestions
          generated from the actual AI analysis.
        </p>

      </div>
    `;

    // -------------------------------------------------------------
    // Tailored summary
    // -------------------------------------------------------------

    if (tailoredSummary) {

      html += `
        <div
          class="star-card"
          style="
            border-left:
              3px solid
              var(--color-primary-light);
            margin-bottom: 20px;
          "
        >

          <span
            class="star-block-label"
            style="
              color:
                var(--color-primary-light);
            "
          >
            Optimized Executive Summary
          </span>

          <p style="
            font-size: 0.95rem;
            color: #fff;
            line-height: 1.6;
            margin-top: 6px;
          ">
            ${this.escapeHtml(
        tailoredSummary
      )}
          </p>

        </div>
      `;
    }

    // -------------------------------------------------------------
    // STAR recommendations
    // -------------------------------------------------------------

    if (recommendations.length > 0) {

      html += `
        <h4 style="
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--color-accent-cyan);
          text-transform: uppercase;
          margin-bottom: 12px;
        ">
          Targeted STAR Bullet Upgrades
        </h4>
      `;

      recommendations.forEach(item => {

        html += `
          <div class="star-card">

            <span class="star-target-pill">
              Targeting:
              ${this.escapeHtml(
          item?.target_skill ||
          "Target skill"
        )}
            </span>

            <div class="star-block">

              <div class="star-block-label">
                Current Resume Context
              </div>

              <div class="star-block-content">
                ${this.escapeHtml(
          item?.current_resume_context ||
          "No resume context provided."
        )}
              </div>

            </div>

            <div class="star-block">

              <div
                class="star-block-label"
                style="
                  color:
                    var(--color-accent-cyan);
                "
              >
                Suggested STAR Bullet
              </div>

              <div class="
                star-block-content suggested
              ">
                ${this.escapeHtml(
          item?.suggested_star_bullet ||
          "No suggested STAR bullet returned."
        )}
              </div>

            </div>

            <div class="star-block">

              <div class="star-block-label">
                Improvement Rationale
              </div>

              <div
                class="star-block-content"
                style="
                  color:
                    var(--text-secondary);
                "
              >
                ${this.escapeHtml(
          item?.improvement_reason ||
          "No rationale returned."
        )}
              </div>

            </div>

          </div>
        `;
      });
    }

    // -------------------------------------------------------------
    // Keywords
    // -------------------------------------------------------------

    if (keywords.length > 0) {

      html += `
        <div style="margin-top: 20px;">

          <h4 style="
            font-family: var(--font-mono);
            font-size: 0.75rem;
            color: var(--text-muted);
            text-transform: uppercase;
            margin-bottom: 8px;
          ">
            High-Value ATS Keywords to Reinforce
          </h4>

          <div style="
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          ">

            ${keywords.map(keyword => `
              <span
                class="filter-pill"
                style="
                  font-size: 0.8rem;
                  background:
                    rgba(99, 102, 241, 0.1);
                  border-color:
                    rgba(99, 102, 241, 0.3);
                  color:
                    var(--color-primary-light);
                "
              >
                ${this.escapeHtml(keyword)}
              </span>
            `).join("")}

          </div>

        </div>
      `;
    }

    // -------------------------------------------------------------
    // No improvement information
    // -------------------------------------------------------------

    if (
      !tailoredSummary &&
      recommendations.length === 0 &&
      keywords.length === 0
    ) {

      html += `
        <div style="
          padding: 16px;
          color: var(--text-muted);
          font-size: 0.88rem;
        ">
          No resume improvement recommendations
          were returned by the AI analysis.
        </div>
      `;
    }

    panel.innerHTML =
      html;
  },


  // ---------------------------------------------------------------
  // INTERVIEW QUESTION BANK
  // ---------------------------------------------------------------

  /**
   * Render complete interview preparation.
   *
   * Expected object:
   *
   * {
   *   technical_questions: [],
   *   behavioural_questions: []
   * }
   */
  renderInterviewPanel(data) {

    const panel =
      document.getElementById(
        "panel-all-interview-questions"
      );

    if (!panel) {
      return;
    }

    const interview =
      data?.interview_preparation &&
        typeof data.interview_preparation === "object"
        ? data.interview_preparation
        : data || {};

    const technical =
      Array.isArray(
        interview.technical_questions
      )
        ? interview.technical_questions
        : [];

    const behavioural =
      Array.isArray(
        interview.behavioural_questions
      )
        ? interview.behavioural_questions
        : [];

    let html = `
      <div style="margin-bottom: 20px;">

        <h3 style="
          font-size: 1.1rem;
          color: #fff;
          margin-bottom: 4px;
        ">
          Structured Candidate Interview Bank
        </h3>

        <p style="
          color: var(--text-secondary);
          font-size: 0.85rem;
        ">
          Targeted questions and evaluation
          criteria returned by the AI analysis.
        </p>

      </div>
    `;

    // -------------------------------------------------------------
    // Technical questions
    // -------------------------------------------------------------

    if (technical.length > 0) {

      html += `
        <h4 style="
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--color-accent-cyan);
          text-transform: uppercase;
          margin-bottom: 12px;
        ">
          Technical Deep Dives
          (${technical.length})
        </h4>
      `;

      technical.forEach((question, index) => {

        html += `
          <div
            class="interview-question-bubble"
            style="margin-bottom: 12px;"
          >

            <div class="question-text-quote">

              ${index + 1}.
              "${this.escapeHtml(
          question?.question ||
          "Question unavailable."
        )}"

            </div>

            <div class="question-meta-tags">

              <span class="question-focus-tag">

                📌
                ${this.escapeHtml(
          question?.focus_area ||
          "Technical Verification"
        )}

              </span>

            </div>

            <div class="question-eval-guide">

              <strong>
                Evaluation Criteria:
              </strong>

              ${this.escapeHtml(
          question?.evaluation_criteria ||
          "No evaluation criteria returned."
        )}

            </div>

          </div>
        `;
      });
    }

    // -------------------------------------------------------------
    // Behavioural questions
    // -------------------------------------------------------------

    if (behavioural.length > 0) {

      html += `
        <h4 style="
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--color-primary-light);
          text-transform: uppercase;
          margin: 20px 0 12px 0;
        ">
          Behavioural Competency Questions
          (${behavioural.length})
        </h4>
      `;

      behavioural.forEach((question, index) => {

        html += `
          <div
            class="interview-question-bubble"
            style="
              margin-bottom: 12px;
              border-left-color:
                var(--color-primary-light);
            "
          >

            <div class="question-text-quote">

              ${index + 1}.
              "${this.escapeHtml(
          question?.question ||
          "Question unavailable."
        )}"

            </div>

            <div class="question-meta-tags">

              <span
                class="question-focus-tag"
                style="
                  color:
                    var(--color-primary-light);
                "
              >

                🤝 Competency:
                ${this.escapeHtml(
          question?.competency ||
          "Leadership / Collaboration"
        )}

              </span>

            </div>

            <div class="question-eval-guide">

              <strong>
                Evaluation Criteria:
              </strong>

              ${this.escapeHtml(
          question?.evaluation_criteria ||
          "No evaluation criteria returned."
        )}

            </div>

          </div>
        `;
      });
    }

    // -------------------------------------------------------------
    // Empty state
    // -------------------------------------------------------------

    if (
      technical.length === 0 &&
      behavioural.length === 0
    ) {

      html += `
        <div style="
          padding: 16px;
          color: var(--text-muted);
          font-size: 0.88rem;
        ">
          No interview questions were returned
          by the AI analysis.
        </div>
      `;
    }

    panel.innerHTML =
      html;
  },


  // ---------------------------------------------------------------
  // CANDIDATE EVALUATION
  // ---------------------------------------------------------------

  /**
   * Render Candidate Evaluation.
   *
   * This uses actual ScreeningEvaluationResponse
   * fields:
   *
   * matched_technical_skills
   * information_requiring_verification
   * risks
   * recommendation
   * next_steps
   */
  renderCandidateEvaluation(
    screeningResult,
    candidateInfo = {}
  ) {

    if (!screeningResult) {
      return;
    }

    const nameEl =
      document.getElementById(
        "eval-candidate-name"
      );

    const roleEl =
      document.getElementById(
        "eval-role-text"
      );

    const avatarEl =
      document.getElementById(
        "eval-avatar-initials"
      );

    const compContainer =
      document.getElementById(
        "eval-competencies-container"
      );

    const verifContainer =
      document.getElementById(
        "eval-verification-list"
      );

    const riskContainer =
      document.getElementById(
        "eval-risk-bullets"
      );

    const riskBadge =
      document.getElementById(
        "risk-level-badge"
      );

    const recommendationEl =
      document.getElementById(
        "eval-recommendation"
      );

    const nextStepsContainer =
      document.getElementById(
        "eval-next-steps"
      );

    const name =
      candidateInfo.candidateName ||
      "Candidate";

    const role =
      candidateInfo.targetRole ||
      "Target Role";

    // -------------------------------------------------------------
    // Candidate header
    // -------------------------------------------------------------

    if (nameEl) {
      nameEl.textContent =
        name;
    }

    if (roleEl) {
      roleEl.textContent =
        role;
    }

    if (avatarEl) {

      const initials =
        name
          .split(/\s+/)
          .filter(Boolean)
          .map(word => word[0])
          .join("")
          .substring(0, 2)
          .toUpperCase();

      avatarEl.textContent =
        initials || "CA";
    }

    // -------------------------------------------------------------
    // Recommendation
    // -------------------------------------------------------------

    if (recommendationEl) {

      recommendationEl.textContent =
        screeningResult.recommendation ||
        "Not provided";
    }

    // -------------------------------------------------------------
    // Competencies
    // -------------------------------------------------------------

    if (compContainer) {

      const technical =
        Array.isArray(
          screeningResult.matched_technical_skills
        )
          ? screeningResult.matched_technical_skills
          : [];

      if (technical.length === 0) {

        compContainer.innerHTML = `
          <div style="
            color: var(--text-muted);
          ">
            No evaluated competencies were
            returned by the AI analysis.
          </div>
        `;

      } else {

        compContainer.innerHTML =
          technical.map(item => {

            const skill =
              item?.skill ||
              "Unnamed Skill";

            const evidence =
              item?.resume_evidence ||
              "No resume evidence returned.";

            return `
              <div class="competency-item">

                <div class="competency-header">

                  <span>
                    ${this.escapeHtml(skill)}
                  </span>

                  <span class="competency-score">
                    Matched
                  </span>

                </div>

                <div class="competency-track">

                  <div
                    class="competency-fill"
                    style="width: 100%;"
                  ></div>

                </div>

                <p style="
                  font-size: 0.82rem;
                  color: var(--text-secondary);
                  margin-top: 4px;
                ">
                  ${this.escapeHtml(evidence)}
                </p>

              </div>
            `;
          }).join("");
      }
    }

    // -------------------------------------------------------------
    // Verification checklist
    // -------------------------------------------------------------

    if (verifContainer) {

      const verifications =
        Array.isArray(
          screeningResult.information_requiring_verification
        )
          ? screeningResult.information_requiring_verification
          : [];

      if (verifications.length === 0) {

        verifContainer.innerHTML = `
          <div class="verification-item">

            <svg
              class="verification-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                d="
                  M22 11.08V12
                  a10 10 0 1 1-5.93-9.14
                "
              ></path>

              <polyline
                points="
                  22 4 12 14.01 9 11.01
                "
              ></polyline>

            </svg>

            <div class="verification-info">

              <h5>
                No Verification Items Returned
              </h5>

              <p>
                The AI analysis did not flag
                additional information requiring
                verification.
              </p>

            </div>

          </div>
        `;

      } else {

        verifContainer.innerHTML =
          verifications.map(item => `
            <div class="verification-item">

              <svg
                class="verification-icon pending"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                ></circle>

                <line
                  x1="12"
                  y1="8"
                  x2="12"
                  y2="12"
                ></line>

                <line
                  x1="12"
                  y1="16"
                  x2="12.01"
                  y2="16"
                ></line>

              </svg>

              <div class="verification-info">

                <h5>
                  Verification Required
                </h5>

                <p>
                  ${this.escapeHtml(item)}
                </p>

              </div>

            </div>
          `).join("");
      }
    }

    // -------------------------------------------------------------
    // Risk assessment
    // -------------------------------------------------------------

    if (riskContainer) {

      const risks =
        Array.isArray(
          screeningResult.risks
        )
          ? screeningResult.risks
          : [];

      if (risks.length === 0) {

        riskContainer.innerHTML = `
          <li>

            <span
              class="bullet-icon"
              style="
                color:
                  var(--color-accent-emerald);
              "
            >
              ✓
            </span>

            No candidate risks were returned
            by the AI analysis.

          </li>
        `;

        if (riskBadge) {

          riskBadge.className =
            "risk-level-badge";

          riskBadge.textContent =
            "NO RISKS FLAGGED";
        }

      } else {

        riskContainer.innerHTML =
          risks.map(risk => `
            <li>

              <span
                class="bullet-icon"
                style="
                  color:
                    var(--color-accent-amber);
                "
              >
                ⚠️
              </span>

              ${this.escapeHtml(risk)}

            </li>
          `).join("");

        if (riskBadge) {

          riskBadge.className =
            "risk-level-badge high";

          riskBadge.textContent =
            "RISKS IDENTIFIED";
        }
      }
    }

    // -------------------------------------------------------------
    // Next steps
    // -------------------------------------------------------------

    if (nextStepsContainer) {

      const nextSteps =
        Array.isArray(
          screeningResult.next_steps
        )
          ? screeningResult.next_steps
          : [];

      if (nextSteps.length === 0) {

        nextStepsContainer.innerHTML = `
          <div style="
            color: var(--text-muted);
            font-size: 0.84rem;
          ">
            No next steps were returned by
            the AI analysis.
          </div>
        `;

      } else {

        nextStepsContainer.innerHTML =
          nextSteps.map(step => `
            <li>

              <span class="bullet-icon">
                →
              </span>

              <span>
                ${this.escapeHtml(step)}
              </span>

            </li>
          `).join("");
      }
    }
  },


  // ---------------------------------------------------------------
  // HISTORY TABLE
  // ---------------------------------------------------------------

  /**
   * Render local analysis history.
   *
   * History is client-side.
   *
   * Demo records must be marked as DEMO SAMPLE.
   * Real records must be marked as REAL SCAN.
   */
  renderHistoryTable(records = []) {

    const tbody =
      document.getElementById(
        "history-table-body"
      );

    if (!tbody) {
      return;
    }

    if (
      !Array.isArray(records) ||
      records.length === 0
    ) {

      tbody.innerHTML = `
        <tr>

          <td
            colspan="6"
            style="
              text-align: center;
              padding: 40px;
              color: var(--text-muted);
            "
          >
            No historical analysis records yet.
            Complete a candidate scan to populate
            the repository.

          </td>

        </tr>
      `;

      return;
    }

    tbody.innerHTML =
      records.map((record, index) => {

        const rawScore =
          Number(record?.match_score);

        const score =
          Number.isFinite(rawScore)
            ? Math.max(
              0,
              Math.min(100, rawScore)
            )
            : 0;

        // -----------------------------------------------------------
        // Match tier
        // -----------------------------------------------------------

        let tierClass =
          "exceptional";

        let tierLabel =
          "Exceptional";

        if (score < 90) {

          tierClass =
            "strong";

          tierLabel =
            "Strong Match";
        }

        if (score < 75) {

          tierClass =
            "moderate";

          tierLabel =
            "Partial Match";
        }

        if (score < 50) {

          tierClass =
            "low";

          tierLabel =
            "Low Match";
        }

        // -----------------------------------------------------------
        // Candidate initials
        // -----------------------------------------------------------

        const candidateName =
          record?.candidate_name ||
          "Candidate";

        const initials =
          candidateName
            .split(/\s+/)
            .filter(Boolean)
            .map(word => word[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();

        // -----------------------------------------------------------
        // Source badge
        // -----------------------------------------------------------

        const isDemo =
          Boolean(record?.isDemo);

        const sourceBadgeHtml =
          isDemo
            ? `
              <span
                class="
                  badge-source-tag
                  badge-source-demo
                "
              >
                DEMO SAMPLE
              </span>
            `
            : `
              <span
                class="
                  badge-source-tag
                  badge-source-real
                "
              >
                REAL SCAN
              </span>
            `;

        return `
          <tr
            data-history-index="${index}"
          >

            <td>

              <div
                class="
                  table-candidate-cell
                "
              >

                <div
                  class="
                    table-candidate-avatar
                  "
                >
                  ${this.escapeHtml(
          initials || "CA"
        )}
                </div>

                <div
                  class="
                    table-candidate-info
                  "
                >

                  <div style="
                    display: flex;
                    align-items: center;
                    gap: 4px;
                  ">

                    <span
                      class="
                        table-candidate-name
                      "
                    >
                      ${this.escapeHtml(
          candidateName
        )}
                    </span>

                    ${sourceBadgeHtml}

                  </div>

                  <span
                    class="
                      table-candidate-email
                    "
                  >
                    ${this.escapeHtml(
          record?.email ||
          "No email provided"
        )}
                  </span>

                </div>

              </div>

            </td>

            <td>

              <div style="
                font-weight: 500;
                color: #fff;
              ">
                ${this.escapeHtml(
          record?.job_title ||
          "Target Role"
        )}
              </div>

              ${record?.seniority
            ? `
                    <span
                      class="
                        badge-tag-id
                      "
                      style="
                        font-size: 0.68rem;
                      "
                    >
                      ${this.escapeHtml(
              record.seniority
            )}
                    </span>
                  `
            : ""
          }

            </td>

            <td>

              <div
                class="
                  table-score-badge-wrap
                "
              >

                <div
                  class="
                    table-mini-gauge
                  "
                >
                  ${score}%
                </div>

                <div
                  class="
                    table-mini-bar
                  "
                >

                  <div
                    class="
                      table-mini-bar-fill
                    "
                    style="
                      width: ${score}%;
                    "
                  ></div>

                </div>

              </div>

            </td>

            <td>

              <span
                class="
                  match-tier-badge
                  ${tierClass}
                "
                style="
                  font-size: 0.75rem;
                  padding: 3px 10px;
                "
              >

                <span class="status-dot"></span>

                ${tierLabel}

              </span>

            </td>

            <td style="
              font-family: var(--font-mono);
              font-size: 0.78rem;
              color: var(--text-muted);
            ">

              ${this.escapeHtml(
            record?.date ||
            "Just now"
          )}

            </td>

            <td>

              <button
                class="
                  btn-header-action
                  secondary
                  btn-open-history
                "
                data-history-idx="${index}"
                style="
                  padding: 6px 12px;
                  font-size: 0.78rem;
                "
              >
                View Assessment
              </button>

            </td>

          </tr>
        `;
      }).join("");
  },


  // ---------------------------------------------------------------
  // HTML ESCAPING
  // ---------------------------------------------------------------

  /**
   * Safely escape text before inserting it into HTML.
   *
   * This is particularly important because AI-generated
   * strings are being rendered into the DOM.
   */
  escapeHtml(value) {

    const div =
      document.createElement("div");

    div.textContent =
      String(value ?? "");

    return div.innerHTML;
  }
};


// -----------------------------------------------------------------
// PUBLIC GLOBAL API
// -----------------------------------------------------------------

window.UI = UI;