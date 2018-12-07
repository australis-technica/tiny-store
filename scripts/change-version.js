const { readFileSync, writeFileSync } = require("fs");
/**
 *
 * @param {string} path
 * @param {string} version
 */
function changeVersion(path, version) {
    writeFileSync(
      path,
      readFileSync(path, "utf-8").replace(
        /"version":\s+"(.*)"/,
        `"version": "${version}"`
      )
    );
  }
module.exports = changeVersion;