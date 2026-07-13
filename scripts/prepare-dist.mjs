import { cp, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "out");
const distDir = path.join(root, "dist");

if (!existsSync(outDir)) {
  throw new Error("Expected Next static export folder 'out' to exist after build.");
}

await rm(distDir, { recursive: true, force: true });
await cp(outDir, distDir, { recursive: true });
