import { Composition, Folder } from "remotion";
import {
  calculateShortMetadata,
  Short,
  shortSchema,
} from "./compositions/Short";
import { TemplateGallery } from "./compositions/TemplateGallery";
import { theme } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Short"
        component={Short}
        schema={shortSchema}
        calculateMetadata={calculateShortMetadata}
        width={theme.width}
        height={theme.height}
        fps={theme.fps}
        durationInFrames={theme.fps * 30}
        // Harus literal (bukan variabel) supaya tombol Save di panel Props
        // Studio bisa menulis ulang nilai ini. Awal = notebookPaperDefaults.
        defaultProps={{
          videoId: "n-plus-one",
          bg: {
            palette: "custom",
            baseColor: "#080b1a",
            blob1: "#4f46e5",
            blob2: "#7c3aed",
            blob3: "#1d4ed8",
            blob4: "#a5b4fc",
            gridColor: "rgba(255, 255, 255, 0.06)",
            gridSize: 54,
            glowOpacity: 0.4,
            animate: true,
          },
        }}
      />
      {/* Galeri: 81 template dengan isi contoh, props bisa dicoba di panel Studio.
          Dibuat otomatis oleh npm run gen:templates (src/compositions/TemplateGallery.tsx). */}
      <Folder name="Templates">
        <TemplateGallery />
      </Folder>
    </>
  );
};
