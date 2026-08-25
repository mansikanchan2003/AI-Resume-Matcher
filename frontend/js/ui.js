const UI = {
  showLoading() {
    const button = document.getElementById("analyse-btn");
    const label = document.getElementById("btn-label");
    const spinner = document.getElementById("btn-spinner");

    if (button) {
      button.disabled = true;
    }

    if (label) {
      label.textContent = "Analysing...";
    }

    if (spinner) {
      spinner.classList.remove("hidden");
    }

    this.hideError();
  },

  hideLoading() {
    const button = document.getElementById("analyse-btn");
    const label = document.getElementById("btn-label");
    const spinner = document.getElementById("btn-spinner");

    if (button) {
      button.disabled = false;
    }

    if (label) {
      label.textContent = "✨ Analyse Match";
    }

    if (spinner) {
      spinner.classList.add("hidden");
    }
  },

  showError(message) {
    const error = document.getElementById("error-msg");

    if (!error) return;

    error.textContent = message;
    error.classList.remove("hidden");
  },

  hideError() {
    const error = document.getElementById("error-msg");

    if (!error) return;

    error.textContent = "";
    error.classList.add("hidden");
  },

  showResults() {
    const results = document.getElementById("results-section");

    if (!results) return;

    results.classList.remove("hidden");

    setTimeout(() => {
      results.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 100);
  },

  renderScoreCard(data) {
    const scoreNumber = document.getElementById("score-number");
    const seniorityBadge = document.getElementById("seniority-badge");
    const summary = document.getElementById("executive-summary");
    const ring = document.getElementById("score-ring-fill");

    const score = Number(data.match_score || 0);

    if (scoreNumber) {
      scoreNumber.textContent = `${score}%`;
    }

    if (seniorityBadge) {
      seniorityBadge.textContent =
        data.seniority_alignment || "Unknown";
    }

    if (summary) {
      summary.textContent =
        data.executive_summary || "No summary available.";
    }

    if (ring) {
      const radius = 50;
      const circumference = 2 * Math.PI * radius;

      ring.style.strokeDasharray = `${circumference}`;
      ring.style.strokeDashoffset =
        circumference - (score / 100) * circumference;

      ring.style.transform = "rotate(-90deg)";
      ring.style.transformOrigin = "50% 50%";
    }
  },

  renderSkillsPanel(data) {
    const panel = document.getElementById("panel-skills");

    if (!panel) return;

    const technical =
      data.matched_technical_skills || [];

    const soft =
      data.matched_soft_skills || [];

    let html = `
      <div class="panel-header">
        <h2>Matched Skills</h2>
        <p>Skills from your resume that align with the job description.</p>
      </div>
    `;

    if (technical.length > 0) {
      html += `
        <h3 class="section-heading">Technical Skills</h3>
        <div class="skills-list">
      `;

      technical.forEach(item => {
        html += `
          <div class="skill-card">
            <div class="skill-card-header">
              <span class="skill-tag">${this.escapeHtml(item.skill)}</span>
            </div>

            <div class="skill-detail">
              <strong>Resume Evidence</strong>
              <p>${this.escapeHtml(item.resume_evidence || "Not provided")}</p>
            </div>

            <div class="skill-detail">
              <strong>JD Requirement</strong>
              <p>${this.escapeHtml(item.jd_requirement || "Not provided")}</p>
            </div>
          </div>
        `;
      });

      html += `</div>`;
    } else {
      html += `
        <div class="empty-state">
          No matched technical skills found.
        </div>
      `;
    }

    if (soft.length > 0) {
      html += `
        <h3 class="section-heading">Soft Skills</h3>
        <div class="skills-list">
      `;

      soft.forEach(skill => {
        html += `
          <span class="skill-tag soft-skill">
            ${this.escapeHtml(skill)}
          </span>
        `;
      });

      html += `</div>`;
    }

    panel.innerHTML = html;
  },

  renderGapsPanel(data) {
    const panel = document.getElementById("panel-gaps");

    if (!panel) return;

    const critical =
      data.critical_missing_skills || [];

    const secondary =
      data.secondary_missing_skills || [];

    const discrepancies =
      data.experience_discrepancies || [];

    let html = `
      <div class="panel-header">
        <h2>Skill & Experience Gaps</h2>
        <p>Areas where your resume does not fully match the job requirements.</p>
      </div>
    `;

    html += `
      <h3 class="section-heading">Critical Missing Skills</h3>
    `;

    if (critical.length > 0) {
      html += `<div class="gap-list">`;

      critical.forEach(item => {
        html += `
          <div class="gap-card critical">
            <span class="gap-tag-critical">
              ${this.escapeHtml(item.skill)}
            </span>
            <p>
              <strong>JD requirement:</strong>
              ${this.escapeHtml(item.jd_clause || "Not specified")}
            </p>
          </div>
        `;
      });

      html += `</div>`;
    } else {
      html += `
        <div class="success-state">
          ✓ No critical skill gaps detected.
        </div>
      `;
    }

    html += `
      <h3 class="section-heading">Secondary Missing Skills</h3>
    `;

    if (secondary.length > 0) {
      html += `<div class="gap-list">`;

      secondary.forEach(item => {
        html += `
          <div class="gap-card secondary">
            <span class="gap-tag-secondary">
              ${this.escapeHtml(item.skill)}
            </span>
            <p>
              <strong>JD requirement:</strong>
              ${this.escapeHtml(item.jd_clause || "Not specified")}
            </p>
          </div>
        `;
      });

      html += `</div>`;
    } else {
      html += `
        <div class="success-state">
          ✓ No secondary skill gaps detected.
        </div>
      `;
    }

    if (discrepancies.length > 0) {
      html += `
        <h3 class="section-heading">Experience Discrepancies</h3>
        <ul class="bullet-list">
      `;

      discrepancies.forEach(item => {
        html += `<li>${this.escapeHtml(item)}</li>`;
      });

      html += `</ul>`;
    }

    panel.innerHTML = html;
  },

  renderImprovementsPanel(data) {
    const panel =
      document.getElementById("panel-improvements");

    if (!panel) return;

    const recommendations =
      data.star_bullet_recommendations || [];

    const keywords =
      data.high_value_keywords_to_include || [];

    let html = `
      <div class="panel-header">
        <h2>Resume Improvements</h2>
        <p>AI-generated suggestions to make your resume stronger for this role.</p>
      </div>
    `;

    if (data.tailored_summary_statement) {
      html += `
        <div class="improvement-summary">
          <h3>Tailored Summary</h3>
          <p>
            ${this.escapeHtml(data.tailored_summary_statement)}
          </p>
        </div>
      `;
    }

    html += `
      <h3 class="section-heading">STAR Bullet Recommendations</h3>
    `;

    if (recommendations.length > 0) {
      html += `<div class="recommendation-list">`;

      recommendations.forEach(item => {
        html += `
          <div class="recommendation-card">
            <span class="target-skill">
              ${this.escapeHtml(item.target_skill)}
            </span>

            <div class="recommendation-block">
              <strong>Current Context</strong>
              <p>
                ${this.escapeHtml(item.current_resume_context || "Not provided")}
              </p>
            </div>

            <div class="recommendation-block suggested">
              <strong>Suggested STAR Bullet</strong>
              <p>
                ${this.escapeHtml(item.suggested_star_bullet || "Not provided")}
              </p>
            </div>

            <div class="recommendation-block">
              <strong>Why Improve It?</strong>
              <p>
                ${this.escapeHtml(item.improvement_reason || "Not provided")}
              </p>
            </div>
          </div>
        `;
      });

      html += `</div>`;
    } else {
      html += `
        <div class="empty-state">
          No specific STAR recommendations were generated.
        </div>
      `;
    }

    if (keywords.length > 0) {
      html += `
        <h3 class="section-heading">High-Value ATS Keywords</h3>
        <div class="keyword-list">
      `;

      keywords.forEach(keyword => {
        html += `
          <span class="keyword-chip">
            ${this.escapeHtml(keyword)}
          </span>
        `;
      });

      html += `</div>`;
    }

    panel.innerHTML = html;
  },

  renderInterviewPanel(data) {
    const panel =
      document.getElementById("panel-interview");

    if (!panel) return;

    const technical =
      data.technical_questions || [];

    const behavioural =
      data.behavioural_questions || [];

    let html = `
      <div class="panel-header">
        <h2>Interview Preparation</h2>
        <p>Questions tailored to the job description and your skill profile.</p>
      </div>
    `;

    html += `
      <h3 class="section-heading">Technical Questions</h3>
    `;

    if (technical.length > 0) {
      html += `<div class="question-list">`;

      technical.forEach((item, index) => {
        html += `
          <details class="question-card">
            <summary>
              <span class="question-number">
                ${index + 1}
              </span>
              ${this.escapeHtml(item.question)}
            </summary>

            <div class="question-answer-guide">
              <p>
                <strong>Focus Area:</strong>
                ${this.escapeHtml(item.focus_area || "General")}
              </p>

              <p>
                <strong>What the interviewer evaluates:</strong>
                ${this.escapeHtml(
                  item.evaluation_criteria || "Not specified"
                )}
              </p>
            </div>
          </details>
        `;
      });

      html += `</div>`;
    } else {
      html += `
        <div class="empty-state">
          No technical questions generated.
        </div>
      `;
    }

    html += `
      <h3 class="section-heading">Behavioural Questions</h3>
    `;

    if (behavioural.length > 0) {
      html += `<div class="question-list">`;

      behavioural.forEach((item, index) => {
        html += `
          <details class="question-card">
            <summary>
              <span class="question-number">
                ${index + 1}
              </span>
              ${this.escapeHtml(item.question)}
            </summary>

            <div class="question-answer-guide">
              <p>
                <strong>Competency:</strong>
                ${this.escapeHtml(item.competency || "General")}
              </p>

              <p>
                <strong>What the interviewer evaluates:</strong>
                ${this.escapeHtml(
                  item.evaluation_criteria || "Not specified"
                )}
              </p>
            </div>
          </details>
        `;
      });

      html += `</div>`;
    } else {
      html += `
        <div class="empty-state">
          No behavioural questions generated.
        </div>
      `;
    }

    panel.innerHTML = html;
  },

  activateTab(tabName) {
    document.querySelectorAll(".tab-btn").forEach(button => {
      const active = button.dataset.tab === tabName;

      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", active ? "true" : "false");
    });

    document.querySelectorAll(".tab-panel").forEach(panel => {
      panel.classList.add("hidden");
    });

    const selectedPanel =
      document.getElementById(`panel-${tabName}`);

    if (selectedPanel) {
      selectedPanel.classList.remove("hidden");
    }
  },

  escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = String(value ?? "");
    return div.innerHTML;
  }
};

window.UI = UI;

console.log("UI layer loaded successfully");
