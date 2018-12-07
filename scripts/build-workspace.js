#!/usr/bin/env node

const runCmd = require("./run-cmd");
const workspaces = require("minimist")(process.argv.slice(2))._;
/** */
async function run() {
    for (const ws of workspaces) {
        console.log("ws: %s", ws);
        try {
            await runCmd("yarn", ["workspace", ws, "build"]);
        } catch (error) {
            console.log("%s error: \n", wsPkg.name, error);
            process.exit(-1);
        }
    }
    console.log("Done!");
}
run();
