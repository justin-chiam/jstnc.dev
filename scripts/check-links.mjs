import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative, resolve, dirname } from "node:path";

const DIST = resolve("dist");

async function htmlFiles(dir) {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await htmlFiles(path)));
    else if (entry.name.endsWith(".html")) found.push(path);
  }
  return found;
}

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function resolves(path) {
  if (path.endsWith("/")) return exists(join(path, "index.html"));
  return (
    (await exists(path)) ||
    (await exists(join(path, "index.html"))) ||
    (await exists(`${path}.html`))
  );
}

const pages = await htmlFiles(DIST);
const broken = [];

for (const page of pages) {
  const html = await readFile(page, "utf8");
  const links = [...html.matchAll(/(?:href|src)="([^"]*)"/g)].map((m) => m[1]);

  for (const link of links) {
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(link) || link === "") continue;

    const target = link.split(/[?#]/)[0];
    if (target === "") continue;

    const path = target.startsWith("/")
      ? join(DIST, target)
      : resolve(dirname(page), target);

    if (!(await resolves(path))) {
      broken.push(`${relative(DIST, page)} -> ${link}`);
    }
  }
}

if (broken.length > 0) {
  console.error(`Broken local links (${broken.length}):`);
  for (const b of broken) console.error(`  ${b}`);
  process.exit(1);
}

console.log(`Checked ${pages.length} page(s), all local links resolve.`);
