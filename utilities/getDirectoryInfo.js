const fs = require('fs')
const path = require('path')

function getDirectoryInfo(directoryPath) {
  let totalSize = 0;
  let fileCount = 0;

  function exploreDirectory(dirPath) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const entryPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        exploreDirectory(entryPath);
      } else if (entry.isFile()) {
        const stats = fs.statSync(entryPath);
        totalSize += stats.size;
        fileCount++;
      }
    }
  }

  exploreDirectory(directoryPath);

  return { totalSize, fileCount };
}

module.exports = getDirectoryInfo;
