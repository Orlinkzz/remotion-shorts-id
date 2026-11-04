// Diadaptasi dari "masonry-gallery" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Galeri bata 2 kolom dengan tinggi berbeda, tiap gambar muncul bergiliran.
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
  items: ["UI", "API", "Database", "Deploy", "Testing"],
};

// Bobot tinggi bergantian supaya kolom kiri-kanan tidak sejajar.
const WEIGHTS = [5, 4, 3, 5, 4, 3, 5, 4];

export default function MasonryGallery(props: TemplateProps) {
  const { title, items, images, accent, frame, fps } = useTemplate(
    props,
    defaults,
  );
  const count = images?.length ?? items.length;
  const stagger = Math.min(8, Math.floor((fps * 1.2) / Math.max(1, count)));
  const columns: number[][] = count === 1 ? [[0]] : [[], []];
  if (count > 1) {
    for (let i = 0; i < count; i++) columns[i % 2].push(i);
  }

  return (
    <div
      style={{
        ...contentArea,
        display: "flex",
        flexDirection: "column",
        gap: 36,
        fontFamily: sansFont,
      }}
    >
      {title ? <TemplateTitle text={title} accent={accent} max={84} /> : null}
      <div style={{ flex: 1, display: "flex", gap: 24, minHeight: 0 }}>
        {columns.map((col, c) => (
          <div
            key={c}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            {col.map((i) => {
              const s = spring({
                frame: frame - 4 - i * stagger,
                fps,
                config: { damping: 12, stiffness: 100 },
              });
              return (
                <div
                  key={i}
                  style={{
                    position: "relative",
                    flex: WEIGHTS[(i + c) % WEIGHTS.length],
                    minHeight: 0,
                    borderRadius: 28,
                    overflow: "hidden",
                    border: `2px solid ${colors.surfaceAlt}`,
                    boxShadow: "0 16px 40px rgba(0,0,0,0.35)",
                    opacity: Math.min(1, s),
                    transform: `translateY(${(1 - s) * 60}px) scale(${0.85 + 0.15 * s})`,
                  }}
                >
                  <TemplateImage src={images?.[i]} index={i} label="" />
                  {items[i] ? (
                    <div
                      style={{
                        position: "absolute",
                        left: 20,
                        bottom: 20,
                        padding: "8px 20px",
                        borderRadius: 999,
                        background: "rgba(0,0,0,0.6)",
                        color: colors.text,
                        fontSize: 40,
                        fontWeight: 700,
                      }}
                    >
                      {items[i]}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
