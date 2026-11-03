// Pemakaian: npm run render <videoId>   -> out/<videoId>.mp4 (1080x1920, H.264)
import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const videoId = process.argv[2];
if (!videoId) {
  console.error("Pemakaian: npm run render <videoId>");
  process.exit(1);
}

mkdirSync("out", { recursive: true });
const propsPath = path.join("out", `.props-${videoId}.json`);
writeFileSync(propsPath, JSON.stringify({ videoId }));

const result = spawnSync(
  "npx",
  [
    "remotion",
    "render",
    "src/index.ts",
    "Short",
    path.join("out", `${videoId}.mp4`),
    `--props=${propsPath}`,
  ],
  { stdio: "inherit", shell: process.platform === "win32" },
);
process.exit(result.status ?? 1);
