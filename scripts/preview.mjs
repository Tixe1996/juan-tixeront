import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("out");
const prefix = process.env.NEXT_PUBLIC_BASE_PATH || "";
const port = Number(process.env.PORT || 4173);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".txt": "text/plain",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
};
http
  .createServer(async (request, response) => {
    try {
      const url = new URL(request.url, "http://localhost");
      if (url.pathname === "/" && prefix) {
        response.writeHead(302, { Location: `${prefix}/` });
        response.end();
        return;
      }
      if (
        prefix &&
        url.pathname !== prefix &&
        !url.pathname.startsWith(`${prefix}/`)
      )
        throw new Error("Not found");
      const relative = decodeURIComponent(
        url.pathname.slice(prefix.length),
      ).replace(/^\/+/, "");
      let file = path.resolve(root, relative || "index.html");
      if (file !== root && !file.startsWith(`${root}${path.sep}`))
        throw new Error("Not found");
      if ((await stat(file)).isDirectory()) {
        if (!url.pathname.endsWith("/")) {
          response.writeHead(301, {
            Location: `${url.pathname}/${url.search}`,
          });
          response.end();
          return;
        }
        file = path.join(file, "index.html");
      }
      const data = await readFile(file);
      response.writeHead(200, {
        "Content-Type": types[path.extname(file)] || "application/octet-stream",
        "Cache-Control": "no-cache",
      });
      response.end(request.method === "HEAD" ? undefined : data);
    } catch {
      response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      response.end(
        await readFile(path.join(root, "404.html")).catch(() => "Not found"),
      );
    }
  })
  .listen(port, "127.0.0.1", () =>
    console.log(`Preview: http://127.0.0.1:${port}${prefix}/`),
  );
