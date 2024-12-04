function getGitCommitHash() {
  try {
    const commitHash = require("child_process")
      .execSync("git rev-parse HEAD")
      .toString()
      .trim();
    return commitHash;
  } catch (error) {
    return "No git";
  }
}

module.exports = getGitCommitHash;
