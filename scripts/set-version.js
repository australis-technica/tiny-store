#!/usr/bin/env node
const { join, resolve } = require("path");
const { existsSync } = require("fs");
const { workspaces, version } = require("../package.json");
const validVersion = require("./valid-version");
const changeVersion = require("./change-version");
const cwd = process.cwd();
const projectVersion = version;
const args = process.argv.slice(2);
let quiet = args.find(a => /(--quiet|-v)/.test(a));
quiet = typeof quiet === "string";
log = !quiet ? console.log.bind(console) : () => {};
/**
 * Start
 */
if (!projectVersion) {
  showUsage();
  process.exit(-1);
}
log("root-version: %s", projectVersion);
if (!validVersion(projectVersion)) {
  log("invalid version '%s' use: \\d+.\\d+.\\d+(-\\d+)?", projectVersion);
  showUsage();
  process.exit(-1);
}
const packages = workspaces.map(x => {
  const path = join(cwd, x, "package.json");
  const { name, version, dependencies } = require(path);
  return {
    path,
    name,
    version,
    dependencies,
  };
});
const workspaceNames = packages.map(x => x.name);
log("Workspaces:\n", workspaceNames.join("\n"));
// run
let changed = false;
for (const workspace of packages) {
  if (workspace.version !== projectVersion) {
    changeVersion(workspace.path, projectVersion);
    log("set-version: %s => %s", workspace.path, version);
    changed = true;
  }
  if (workspace.dependencies) {
    for (const dependencyName of workspaceNames) {
      if (dependencyName in workspace.dependencies) {
        //  Todo Change Dependecy Version
        if (workspace.dependencies[dependencyName] !== projectVersion) {
          console.log(
            '"%s" reference "%s":"%s"',
            workspace.name,
            dependencyName,
            workspace.dependencies[dependencyName],
          );
        }
      }
    }
  }
}
if (existsSync(resolve(cwd, "lerna.json"))) {
  changeVersion(resolve("lerna.json"), projectVersion);
  log("set-version: %s => %s", "lerna.json", version);
  changed = true;
}
log("%s", changed ? "Changed" : "No changes");
/**
 *
 */
function showUsage() {
  console.log("set new version on ROOT package.json");
}
