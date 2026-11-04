// Diadaptasi dari "gallery-grid" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Grid gambar 2 kolom yang muncul satu per satu dengan efek pegas.
// Props: images (1-8 gambar), items (keterangan per gambar), title (opsional), accent.
import { spring } from "remotion";
import {
  colors,
  contentArea,
  sansFont,
  TemplateImage,
  TemplateTitle,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  title: "Struktur *proyek*",
  items: ["components", "hooks", "pages", "utils"],
};

export default function GalleryGrid(props: TemplateProps) {
  const { title, items, images, accent, frame, fps } = useTemplate(
    props,
    defaults,
  );
  const count = images?.length ?? items.length;
  const cols = count === 1 ? 1 : count <= 4 ? 2 : 3;
  const stagger = Math.min(8, Math.floor((fps * 1.2) / Math.max(1, count)));

  return (
    <div
      style={{
        ...contentArea,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 40,
        fontFamily: sansFont,
      }}
    >
      {title ? <TemplateTitle text={title} accent={accent} max={88} /> : null}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: 24,
        }}
      >
        {Array.from({ length: count }, (_, i) => {
          const s = spring({
            frame: frame - 6 - i * stagger,
            fps,
            config: { damping: 12, stiffness: 100 },
          });
          return (
            <div
              key={i}
              style={{
                position: "relative",
                aspectRatio: cols === 1 ? "4 / 3" : "1 / 1",
                borderRadius: 28,
                overflow: "hidden",
                border: `2px solid ${colors.surfaceAlt}`,
                boxShadow: "0 16px 40px rgba(0,0,0,0.35)",
                opacity: Math.min(1, s),
                transform: `scale(${0.8 + 0.2 * s})`,
              }}
            >
              <TemplateImage src={images?.[i]} index={i} label="" />
              {items[i] ? (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    padding: "48px 20px 18px",
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,0.75))",
                    color: colors.text,
                    fontSize: 40,
                    fontWeight: 700,
                    textAlign: "center",
                  }}
                >
                  {items[i]}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
