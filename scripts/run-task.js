#!/usr/bin/env node

const runCmd = require("./run-cmd");
const { resolve, join } = require("path");
const cwd = resolve(__dirname, "../");
/**
 * @type {{workspaces: string[]}}
 */
const pkg = require(join(cwd, "package.json"));
const { workspaces } = pkg;
// ...
const argv = process.argv.slice(2);
// ....
const task = argv[0];
if (!task) return console.log("Task required:\n\tex. 'build'");

const args = argv.slice(1) || [];
console.log(
  "run Task '%s' with args '%s' in workspaces:\n%s",
  task,
  (args && args.join(",")) || "no-args",
  workspaces.join("\n"),
);
/**
 *
 * @param {{ [key: string]: string }} scripts
 */
function isValidTask(scripts) {
  /**
   * task name
   * @param task {string}
   */
  return task => scripts && task in scripts;
}
/**
 *
 * @param {string} task
 */
function inbuiltTask(task) {
  return (
    ["pack", "publish", "add", "remove"]
      // .filter(Boolean)
      .indexOf(task) !== -1
  );
}

/** */
async function run() {
  for (const wsPath of workspaces) {
    let wsPkg;
    try {
      /** @type {{ name: string , scripts: { [[key: string]: string]}}} */
      wsPkg = require(resolve(cwd, wsPath, "package.json"));
      console.log("Package: %s", wsPkg.name);      
      const cmd = ["yarn", "workspace", wsPkg.name, task, ...args];
      console.log("cmd: %s", cmd.join(" "));
      if (isValidTask(wsPkg.scripts)(task) || inbuiltTask(task)) {
        await runCmd(cmd[0], cmd.slice(1), resolve(cwd, wsPath));
      } else {
        console.warn(
          "'%s' doesn't have task '%s' or is not a supported inbuilt task (like 'build').",
          wsPkg.name,
          task,
        );
      }
    } catch (error) {
      console.log("%s error: \n", wsPkg.name, error);
      process.exit(-1);
    }
  }
  console.log("Done!");
}
run();
