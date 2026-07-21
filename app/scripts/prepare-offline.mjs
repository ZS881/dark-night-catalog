import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const indexPath = resolve("dist/index.html");
const source = await readFile(indexPath, "utf8");
const moduleEntry = /<script type="module" crossorigin src="([^"]+)"><\/script>/;

if (!moduleEntry.test(source)) {
  throw new Error("Expected Vite module entry was not found in dist/index.html.");
}

// The production bundle is a single self-contained JavaScript file. Using a
// classic deferred entry avoids the file:// CORS restriction that blocks ES
// module scripts when a player double-clicks index.html after extraction.
const offlineHtml = source.replace(moduleEntry, '<script defer src="$1"></script>');

await writeFile(indexPath, offlineHtml, "utf8");
console.log("Prepared dist/index.html for file:// offline playback.");
