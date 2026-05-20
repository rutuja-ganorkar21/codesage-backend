const axios = require("axios");

const BASE_URL = "https://ce.judge0.com";

const getLanguageById = (lang) => {
  const l = lang.toLowerCase().trim();

  const language = {
    "cpp": 54,
    "c++": 54,
    "java": 62,
    "javascript": 63,
  };

  const langId = language[l];
  if (!langId) throw new Error("Unsupported Language: " + lang);

  return langId;
};

const submitBatch = async (submissions) => {
  try {
    // ✅ Empty check
    if (!submissions || submissions.length === 0) {
      throw new Error("No submissions provided to Judge0");
    }

    // ✅ Invalid submissions filter karo
    const validSubmissions = submissions.filter(
      (s) => s.source_code && s.language_id && s.stdin !== undefined
    );

    if (validSubmissions.length === 0) {
      throw new Error("All submissions are invalid — missing source_code, language_id or stdin");
    }

    
    const response = await axios.post(
      `${BASE_URL}/submissions/batch?base64_encoded=false`,
      { submissions: validSubmissions },
      { headers: { "Content-Type": "application/json" } }
    );

    const tokens = response.data.map((s) => s.token).join(",");
    

    while (true) {
      const result = await axios.get(
        `${BASE_URL}/submissions/batch`,
        { params: { tokens, base64_encoded: false } }
      );

      const subs = result.data.submissions;

      const stillProcessing = subs.some(
        (s) => s.status?.id === 1 || s.status?.id === 2
      );

      if (!stillProcessing) {
        return subs;
      }

      await new Promise((r) => setTimeout(r, 1000));
    }

  } catch (error) {
    console.error("Judge0 Error:", error.response?.data || error.message);
    throw new Error(error.message || "Batch execution failed");
  }
};

const submitToken = async (submission) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/submissions?base64_encoded=false&wait=false`,
      submission,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data.token;

  } catch (error) {
    console.error("Submit Error:", error.response?.data || error.message);
    throw new Error("Submission failed");
  }
};

const getSubmissionResult = async (token) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/submissions/${token}?base64_encoded=false`
    );

    return response.data;

  } catch (error) {
    console.error("Fetch Error:", error.response?.data || error.message);
    throw new Error("Fetching result failed");
  }
};

module.exports = {
  getLanguageById,
  submitBatch,
  submitToken,
  getSubmissionResult,
};