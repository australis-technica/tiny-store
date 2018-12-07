/**
 *
 * @param cmd {string}
 * @param args {string[]}
 */
const run = (cmd, args, cwd) => {
    const cp = require("child_process");
    return new Promise((resolve, reject) => {
      const exec = cp.spawn(cmd, args, {
        stdio: "inherit",
        shell: true,
        cwd
      });
      exec.on("error", error => {
        reject(error);
      });
      exec.on("exit", code => {
        if (code === 0) {
          resolve();
        } else {
          reject();
        }
      });
    });
  };
  module.exports = run;