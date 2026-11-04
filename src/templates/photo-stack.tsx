// Diadaptasi dari "photo-stack" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Foto berbingkai putih jatuh bertumpuk satu per satu sepanjang scene.
// Props: images (1-8 gambar), items (keterangan foto teratas), title (opsional), accent.
import { random, spring } from "remotion";
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
  items: ["v1.0 — prototipe", "v2.0 — refactor", "v3.0 — rilis"],
};

export default function PhotoStack(props: TemplateProps) {
  const { title, items, images, accent, frame, fps, durationInFrames } =
    useTemplate(props, defaults);
  const count = images?.length ?? items.length;
  // Foto terakhir mendarat di ~70% scene.
  const gap =
    count > 1 ? (durationInFrames * 0.7 - fps * 0.5) / (count - 1) : 0;
  const delays = Array.from({ length: count }, (_, i) =>
    Math.round(4 + i * Math.max(6, gap)),
  );
  const top = delays.reduce((last, d, i) => (frame >= d ? i : last), 0);

  return (
    <div
      style={{
        ...contentArea,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 40,
        fontFamily: sansFont,
      }}
    >
      {title ? (
        <TemplateTitle
          text={title}
          accent={accent}
          max={84}
          style={{ textAlign: "center" }}
        />
      ) : null}
      <div style={{ position: "relative", flex: 1, width: "100%" }}>
        {delays.map((delay, i) => {
          const s = spring({
            frame: frame - delay,
            fps,
            config: { damping: 12, stiffness: 100 },
          });
          const rot = (random(`photo-stack-r-${i}`) - 0.5) * 16;
          const dx = (random(`photo-stack-x-${i}`) - 0.5) * 80;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: 700,
                height: 760,
                marginLeft: -350,
                marginTop: -380,
                padding: 20,
                paddingBottom: 20,
                background: "#ffffff",
                borderRadius: 16,
                boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
                opacity: Math.min(1, s * 2),
                transform: `translate(${dx}px, ${(1 - s) * -400}px) rotate(${rot * s + (1 - s) * rot * 3}deg) scale(${1.2 - 0.2 * s})`,
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                <TemplateImage src={images?.[i]} index={i} />
              </div>
            </div>
          );
        })}
      </div>
      {items[top] ? (
        <div
          style={{
            padding: "16px 36px",
            borderRadius: 999,
            background: colors.surface,
            border: `2px solid ${accent}`,
            color: colors.text,
            fontSize: 44,
            fontWeight: 800,
          }}
        >
          {items[top]}
        </div>
      ) : null}
    </div>
  );
}
