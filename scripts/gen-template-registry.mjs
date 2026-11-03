// Membuat src/templates/names.ts dan src/templates/registry.ts dari isi src/templates/*.tsx
// Jalankan ulang setelah menambah/menghapus template: npm run gen:templates
import { readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const dir = path.join(process.cwd(), "src", "templates");
const names = readdirSync(dir)
  .filter((f) => f.endsWith(".tsx"))
  .map((f) => f.replace(/\.tsx$/, ""))
  .sort();

const pascal = (n) =>
  n
    .split("-")
    .map((p) => p[0].toUpperCase() + p.slice(1))
    .join("");

writeFileSync(
  path.join(dir, "names.ts"),
  `// File ini dibuat otomatis oleh scripts/gen-template-registry.mjs\nexport const templateNames = [\n${names
    .map((n) => `  "${n}",`)
    .join("\n")}\n] as const;\n\nexport type TemplateName = (typeof templateNames)[number];\n`,
);

writeFileSync(
  path.join(dir, "registry.ts"),
  `// File ini dibuat otomatis oleh scripts/gen-template-registry.mjs\nimport type { ComponentType } from "react";\n${names
    .map((n) => `import ${pascal(n)} from "./${n}";`)
    .join("\n")}\nimport type { TemplateName } from "./names";\n\nexport const templateRegistry: Record<TemplateName, ComponentType> = {\n${names
    .map((n) => `  "${n}": ${pascal(n)},`)
    .join("\n")}\n};\n`,
);

console.log(`${names.length} template terdaftar`);
