import { readdirSync, writeFileSync } from "fs";
import { join } from "path";

const publicDir = join(process.cwd(), ".output", "public");
const assetsDir = join(publicDir, "assets");

const files = readdirSync(assetsDir);
const jsFile = files.find((f) => f.startsWith("index-") && f.endsWith(".js"));
const cssFile = files.find((f) => f.startsWith("styles-") && f.endsWith(".css"));

if (!jsFile || !cssFile) {
  console.error("Could not find index JS or styles CSS in build output");
  process.exit(1);
}

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Novaris Nexus Tech</title>
    <link rel="icon" type="image/png" href="/favicon.png" />
    <link rel="stylesheet" href="/assets/${cssFile}" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/assets/${jsFile}"></script>
  </body>
</html>`;

writeFileSync(join(publicDir, "index.html"), html);
console.log(`Generated index.html referencing ${jsFile} and ${cssFile}`);
