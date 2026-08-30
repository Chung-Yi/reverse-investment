import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const rendererOutput = resolve(projectRoot, "out", "renderer");
const sitesOutput = resolve(projectRoot, "dist");
const clientOutput = resolve(sitesOutput, "client");
const serverOutput = resolve(sitesOutput, "server");

await rm(clientOutput, { recursive: true, force: true });
await mkdir(serverOutput, { recursive: true });
await cp(rendererOutput, clientOutput, { recursive: true });

await writeFile(
  resolve(serverOutput, "index.js"),
  `export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);

    if (response.status !== 404 || request.method !== "GET") {
      return response;
    }

    const fallbackUrl = new URL("/index.html", request.url);
    return env.ASSETS.fetch(new Request(fallbackUrl, request));
  },
};
`,
);
