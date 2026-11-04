import { AbsoluteFill } from "remotion";
import { z } from "zod";
import { templatePropsSchema } from "../lib/schema";
import { TemplateScene } from "../scenes/TemplateScene";
import { templateNames } from "../templates/names";
import {
  NotebookPaper,
  notebookPaperDefaults,
  notebookPaperSchema,
} from "./notebook-paper.element";

// Galeri Studio: satu template di atas latar yang sama dengan video asli.
// Props bisa diubah di panel kanan Studio untuk mencoba isi video.json.
// bg opsional: kosong = notebookPaperDefaults (sama dengan video).
export const templatePreviewSchema = z.object({
  template: z.enum(templateNames),
  props: templatePropsSchema,
  bg: notebookPaperSchema.optional(),
});

export const TemplatePreview: React.FC<
  z.infer<typeof templatePreviewSchema>
> = ({ template, bg, props }) => (
  <AbsoluteFill>
    <NotebookPaper
      {...notebookPaperDefaults}
      {...bg}
      name="Notebook Paper"
      style={{ position: "absolute" }}
    />
    <TemplateScene name={template} props={props} />
  </AbsoluteFill>
);
