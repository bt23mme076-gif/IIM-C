const axios = require("axios");

const OWNER = process.env.GITHUB_OWNER;
const REPO = process.env.GITHUB_REPO;
const BRANCH = process.env.GITHUB_BRANCH || "main";
const TOKEN = process.env.GITHUB_TOKEN;

async function uploadBufferToGitHub({ buffer, path: filePath, message }) {
  const apiUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${filePath}`;

  let sha = null;

  try {
    const existing = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: "application/vnd.github+json",
      },
      params: { ref: BRANCH },
    });
    sha = existing.data.sha;
  } catch (err) {
    if (err.response?.status !== 404) throw err;
  }

  const body = {
    message: message || `upload ${filePath}`,
    content: buffer.toString("base64"),
    branch: BRANCH,
    ...(sha ? { sha } : {}),
  };

  await axios.put(apiUrl, body, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/vnd.github+json",
    },
  });

  const cdnUrl = `https://cdn.jsdelivr.net/gh/${OWNER}/${REPO}@${BRANCH}/${filePath}`;
  return { cdnUrl, githubPath: filePath };
}

module.exports = { uploadBufferToGitHub };