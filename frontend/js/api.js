/**
 * TALENTPULSE AI
 * API CLIENT
 *
 * This file is responsible ONLY for communication with the
 * existing FastAPI backend.
 *
 * Backend base:
 *   /api/v1
 *
 * IMPORTANT:
 * Do not change backend routes here.
 */

const BASE_URL = "/api/v1";


class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}


/**
 * Generic API request helper.
 *
 * Supports:
 * - JSON requests
 * - FormData requests
 * - GET / POST
 */
async function apiFetch(endpoint, options = {}) {
  let response;

  try {
    response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
      },
    });
  } catch (error) {
    throw new ApiError(
      0,
      error?.message || "Unable to connect to the backend."
    );
  }

  let data = null;

  const contentType = response.headers.get("content-type") || "";

  try {
    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = text ? { detail: text } : null;
    }
  } catch {
    data = null;
  }

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    if (data) {
      if (typeof data.detail === "string") {
        message = data.detail;
      } else if (Array.isArray(data.detail)) {
        message = data.detail
          .map(item => {
            if (typeof item === "string") return item;

            if (item?.msg) {
              const location = Array.isArray(item.loc)
                ? item.loc.join(".")
                : "";

              return location
                ? `${location}: ${item.msg}`
                : item.msg;
            }

            return JSON.stringify(item);
          })
          .join("\n");
      } else if (data.message) {
        message = data.message;
      }
    }

    throw new ApiError(response.status, message);
  }

  return data;
}


/**
 * Public API used by main.js.
 */
window.API = {

  /**
   * Existing backend endpoint:
   * POST /api/v1/analysis/analyse
   *
   * Backend expects multipart/form-data.
   */
  analyseResume(formData) {
    return apiFetch("/analysis/analyse", {
      method: "POST",
      body: formData,
    });
  },


  /**
   * POST /api/v1/matching/match-skills
   */
  matchSkills(payload) {
    return apiFetch("/matching/match-skills", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  },


  /**
   * POST /api/v1/gaps/detect-gaps
   */
  detectGaps(payload) {
    return apiFetch("/gaps/detect-gaps", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  },


  /**
   * POST /api/v1/improvements/suggest
   */
  getImprovements(payload) {
    return apiFetch("/improvements/suggest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  },


  /**
   * POST /api/v1/interview/generate
   */
  generateInterviewQuestions(payload) {
    return apiFetch("/interview/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  },


  /**
   * POST /api/v1/screening/screen
   *
   * This is the primary endpoint used by the frontend.
   * ScreeningWorker performs the complete AI screening workflow.
   */
  screenCandidate(payload) {
    return apiFetch("/screening/screen", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  },


  /**
   * Backend health endpoint.
   *
   * NOTE:
   * Your main.py defines /health, NOT /api/v1/health.
   */
  checkHealth() {
    return fetch("/health")
      .then(async response => {
        let data = null;

        try {
          data = await response.json();
        } catch {
          data = null;
        }

        if (!response.ok) {
          throw new ApiError(
            response.status,
            data?.detail || "Backend health check failed."
          );
        }

        return data;
      })
      .catch(error => {
        if (error instanceof ApiError) {
          throw error;
        }

        throw new ApiError(
          0,
          error?.message || "Unable to connect to the backend."
        );
      });
  },
};


console.log("TalentPulse AI API layer loaded successfully.");