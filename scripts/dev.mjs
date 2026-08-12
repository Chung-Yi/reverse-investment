import { spawn } from "node:child_process";
import { createConnection } from "node:net";
import process from "node:process";

const children = new Set();

function run(command, args, options = {}) {
  const child = spawn(command, args, {
    stdio: "inherit",
    shell: false,
    ...options,
  });
  children.add(child);
  child.once("exit", () => children.delete(child));
  return child;
}

function waitForPort(port, host = "127.0.0.1") {
  return new Promise((resolve) => {
    const tryConnect = () => {
      const socket = createConnection({ port, host });
      socket.once("connect", () => {
        socket.destroy();
        resolve();
      });
      socket.once("error", () => setTimeout(tryConnect, 150));
    };
    tryConnect();
  });
}

function stop() {
  for (const child of children) child.kill("SIGTERM");
}

process.once("SIGINT", stop);
process.once("SIGTERM", stop);
process.once("exit", stop);

const vite = run("npm", ["run", "dev:web"]);
vite.once("exit", (code) => {
  if (code) process.exitCode = code;
  stop();
});

await waitForPort(5173);

const builds = [
  run("npm", ["run", "build:main"]),
  run("npm", ["run", "build:preload"]),
];

const codes = await Promise.all(
  builds.map(
    (child) =>
      new Promise((resolve) => child.once("exit", (code) => resolve(code ?? 1))),
  ),
);

if (codes.some(Boolean)) {
  stop();
  process.exit(1);
}

const electronEnvironment = {
  ...process.env,
  VITE_DEV_SERVER_URL: "http://127.0.0.1:5173",
};
delete electronEnvironment.ELECTRON_RUN_AS_NODE;

const electron = run("npm", ["exec", "electron", "."], {
  env: electronEnvironment,
});

electron.once("exit", (code) => {
  if (code) process.exitCode = code;
  stop();
});
