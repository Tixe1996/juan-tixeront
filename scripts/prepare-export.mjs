import { copyFile, readdir, realpath, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

export async function prepareExport(root = path.resolve("out")) {
  let copied = 0;
  const resolvedRoot = await realpath(root);
  const visited = new Set();
  async function visit(directory, segmentRoot = null, prefix = "") {
    const resolved = await realpath(directory);
    if (resolved !== resolvedRoot && !resolved.startsWith(`${resolvedRoot}${path.sep}`)) return;
    if (visited.has(resolved)) return;
    visited.add(resolved);
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const source = path.join(directory, entry.name);
      const info = entry.isSymbolicLink() ? await stat(source) : entry;
      if (info.isDirectory()) {
        if (segmentRoot) {
          await visit(source, segmentRoot, `${prefix}.${entry.name}`);
        } else if (entry.name.startsWith("__next.")) {
          // Next 16.2 exports nested segment paths on Windows instead of dot-separated names.
          await visit(source, directory, entry.name);
        } else {
          await visit(source);
        }
      } else if (segmentRoot && info.isFile() && entry.name.endsWith(".txt")) {
        await copyFile(source, path.join(segmentRoot, `${prefix}.${entry.name}`));
        copied++;
      }
    }
  }
  await visit(root);
  await writeFile(path.join(root, ".nojekyll"), "", "utf8");
  return copied;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  console.log(`Prepared static export: ${await prepareExport()} segment paths normalised.`);
}
