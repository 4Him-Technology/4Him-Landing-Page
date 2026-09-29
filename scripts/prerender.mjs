// Injeta o HTML pré-renderizado da home em dist/index.html depois do build.
import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const indexPath = resolve(root, "dist/index.html");
const serverEntry = resolve(root, "dist-server/entry-server.js");
const MARKER = '<div id="root"></div>';

try {
  const { render } = await import(pathToFileURL(serverEntry).href);
  const template = readFileSync(indexPath, "utf8");
  if (!template.includes(MARKER)) {
    throw new Error(`marcador ${MARKER} não encontrado em dist/index.html`);
  }
  const appHtml = render();
  if (!appHtml.includes("<h1")) {
    throw new Error("o HTML renderizado não tem <h1>; a pré-renderização saiu vazia");
  }
  writeFileSync(indexPath, template.replace(MARKER, `<div id="root">${appHtml}</div>`));
  console.log(`[prerender] dist/index.html com ${(appHtml.length / 1024).toFixed(1)} KB de HTML da home`);
} catch (err) {
  console.error("[prerender] falhou:", err);
  process.exitCode = 1;
} finally {
  rmSync(resolve(root, "dist-server"), { recursive: true, force: true });
}
