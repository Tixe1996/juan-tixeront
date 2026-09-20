import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { prepareExport } from "./prepare-export.mjs";

const root = process.cwd();
const outDir = path.join(root, "out");
const distDir = path.join(root, "dist");

if (!existsSync(outDir)) {
  throw new Error("Expected Next static export folder 'out' to exist after build.");
}

await prepareExport(outDir);
await rm(distDir, { recursive: true, force: true });
await writeFile(path.join(outDir, ".nojekyll"), "", "utf8");
await cp(outDir, distDir, { recursive: true });
await cp(outDir, path.join(distDir, "client"), { recursive: true });

await mkdir(path.join(distDir, ".openai"), { recursive: true });
await cp(path.join(root, ".openai", "hosting.json"), path.join(distDir, ".openai", "hosting.json"));

await mkdir(path.join(distDir, "server"), { recursive: true });
await writeFile(
  path.join(distDir, "server", "index.js"),
  `export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    const url = new URL(request.url);

    if (response.status === 404 && !url.pathname.includes(".")) {
      return env.ASSETS.fetch(new Request(new URL("/", url), request));
    }

    return response;
  }
};
`,
  "utf8",
);
