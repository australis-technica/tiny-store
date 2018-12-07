#!/usr/bin/env node
const { resolve, join } = require("path");
const runCmd = require("./run-cmd");
const cwd = resolve(__dirname, "../");
/**
 * @type {{workspaces: string[]}}
 */
const pkg = require(join(cwd, "package.json"));
const { workspaces } = pkg;

/** Add Package|s to all workspaces */
async function run() {
  for (const ws of workspaces) {
    let wsPkg;
    try {
      throw new Error("TODO : Not implemented ")
    } catch (error) {
      console.log("%s error: \n", wsPkg.name, error);
      process.exit(-1);
    }
  }
  console.log("Done!");
}
run();
