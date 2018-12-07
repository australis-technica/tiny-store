#!/usr/bin/env node
const runCmd = require("./run-cmd");
/**
 * add package with types
 */
async function run() {
  try {
    for (const arg of process.argv.slice(2)) {
      await runCmd(`yarn`, ["add", arg]);
      await runCmd(`yarn`, ["add", `@types/${arg}`, '-D']);
    }
    return "OK";
  } catch (error) {      
      return Promise.reject(error);
  }
}
run().then(console.log).catch(e=> {
    console.error(e);
    process.exit(-1);
})