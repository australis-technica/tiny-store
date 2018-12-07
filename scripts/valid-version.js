/**
 *
 * @param {string} version
 */
function validVersion(version) {
  // source: https://github.com/sindresorhus/semver-regex
  return /\bv?(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[\da-z-]+(?:\.[\da-z-]+)*)?(?:\+[\da-z-]+(?:\.[\da-z-]+)*)?\b/gi.test(
    version
  );
}
module.exports = validVersion;
