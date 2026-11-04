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
    .join(
      "\n",
    )}\n] as const;\n\nexport type TemplateName = (typeof templateNames)[number];\n`,
);

writeFileSync(
  path.join(dir, "registry.ts"),
  `// File ini dibuat otomatis oleh scripts/gen-template-registry.mjs\nimport type { ComponentType } from "react";\nimport type { TemplateProps } from "../lib/template-kit";\n${names
    .map((n) => `import ${pascal(n)} from "./${n}";`)
    .join(
      "\n",
    )}\nimport type { TemplateName } from "./names";\n\nexport const templateRegistry: Record<TemplateName, ComponentType<TemplateProps>> = {\n${names
    .map((n) => `  "${n}": ${pascal(n)},`)
    .join("\n")}\n};\n`,
);

// Galeri Studio: satu <Composition> per template dengan id dan defaultProps
// literal, supaya tombol Save di panel Props Studio bisa menulis ke file ini.
// Catatan: props yang disimpan dari Studio akan tertimpa saat skrip ini dijalankan ulang.
writeFileSync(
  path.join(process.cwd(), "src", "compositions", "TemplateGallery.tsx"),
  `// File ini dibuat otomatis oleh scripts/gen-template-registry.mjs
// Props yang disimpan dari Studio tertimpa saat npm run gen:templates dijalankan ulang.
import { Composition } from "remotion";
import { theme } from "../theme";
import { TemplatePreview, templatePreviewSchema } from "./TemplatePreview";

export const TemplateGallery: React.FC = () => (
  <>
${names
  .map(
    (n) => `    <Composition
      id="tpl-${n}"
      component={TemplatePreview}
      schema={templatePreviewSchema}
      defaultProps={{ template: "${n}", props: {} }}
      width={theme.width}
      height={theme.height}
      fps={theme.fps}
      durationInFrames={theme.fps * 6}
    />`,
  )
  .join("\n")}
  </>
);
`,
);

console.log(`${names.length} template terdaftar`);
