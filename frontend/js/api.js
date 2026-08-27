const BASE_URL = "/api/v1";

class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function apiFetch(endpoint, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);

    let data = {};
    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (!response.ok) {
      throw new ApiError(
        response.status,
        data.detail || `Request failed with status ${response.status}`
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      0,
      error.message || "Unable to connect to the backend."
    );
  }
}

window.API = {
  analyseResume(formData) {
    return apiFetch("/analysis/analyse", {
      method: "POST",
      body: formData
    });
  },

  matchSkills(payload) {
    return apiFetch("/matching/match-skills", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
  },

  detectGaps(payload) {
    return apiFetch("/gaps/detect-gaps", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
  },

  getImprovements(payload) {
    return apiFetch("/improvements/suggest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
  },

  generateInterviewQuestions(payload) {
    return apiFetch("/interview/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
  },

  screenCandidate(payload) {
    return apiFetch("/screening/screen", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
  },
};

console.log("API layer loaded successfully");
