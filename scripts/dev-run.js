const { execFileSync, spawn } = require("node:child_process");
const path = require("node:path");

const binExt = process.platform === "win32" ? ".CMD" : "";
const tscAliasBin = path.join(__dirname, "..", "node_modules", ".bin", `tsc-alias${binExt}`);

execFileSync(tscAliasBin, [], { stdio: "inherit", shell: true });

const child = spawn(process.execPath, [path.join(__dirname, "..", "dist", "src", "main.js")], {
  stdio: "inherit",
});

child.on("exit", (code) => process.exit(code ?? 0));
