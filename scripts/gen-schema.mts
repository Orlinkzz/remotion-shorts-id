// Membuat video.schema.json dari skema Zod, untuk autocomplete & validasi di VS Code.
// Jalankan: npm run schema
import { writeFileSync } from "node:fs";
import { z } from "zod";
import { videoSchema } from "../src/lib/schema.ts";

const jsonSchema = z.toJSONSchema(videoSchema, { io: "input" });
writeFileSync("video.schema.json", JSON.stringify(jsonSchema, null, 2) + "\n");
console.log("video.schema.json dibuat");
