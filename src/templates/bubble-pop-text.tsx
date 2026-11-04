// Diadaptasi dari "bubble-pop-text" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Tiap huruf judul muncul sebagai gelembung bulat yang meletup satu per satu.
// Props: title (kata pendek, maks ~8 huruf per baris), subtitle (opsional), accent.
import { interpolate, spring } from "remotion";
import {
  clamp,
  colors,
  contentArea,
  plain,
  sansFont,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  title: "DEBUG",
  subtitle: "Cari bug-nya, bukan kambing hitamnya",
};

export default function BubblePopText(props: TemplateProps) {
  const { title, subtitle, accent, frame, fps } = useTemplate(props, defaults);
  const words = plain(title).split(/\s+/).filter(Boolean);
  const longest = Math.max(1, ...words.map((w) => w.length));
  // Lebar area aman 952px; gelembung + jarak harus muat satu kata per baris.
  const size = Math.max(72, Math.min(150, Math.floor(920 / longest) - 14));
  const total = words.reduce((n, w) => n + w.length, 0);
  const step = Math.min(5, (fps * 1.2) / Math.max(1, total));
  const subIn = interpolate(frame, [fps * 1.2, fps * 1.7], [0, 1], clamp);
  let index = 0;

  return (
    <div
      style={{
        ...contentArea,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 24,
        fontFamily: sansFont,
      }}
    >
      {words.map((word, w) => (
        <div key={w} style={{ display: "flex", gap: 14 }}>
          {[...word].map((ch) => {
            const scale = spring({
              frame: frame - index++ * step,
              fps,
              config: { damping: 8, mass: 0.3, stiffness: 100 },
            });
            return (
              <div
                key={index}
                style={{
                  width: size,
                  height: size,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: size * 0.55,
                  fontWeight: 900,
                  color: colors.text,
                  border: "4px solid rgba(255,255,255,0.2)",
                  background: `linear-gradient(45deg, #1e3a8a, ${accent})`,
                  boxShadow: `0 6px 20px color-mix(in srgb, ${accent} 50%, transparent)`,
                  transform: `scale(${scale})`,
                }}
              >
                {ch}
              </div>
            );
          })}
        </div>
      ))}
      {subtitle ? (
        <div
          style={{
            marginTop: 24,
            textAlign: "center",
            fontSize: 46,
            fontWeight: 600,
            color: colors.muted,
            opacity: subIn,
          }}
        >
          {subtitle}
        </div>
      ) : null}
    </div>
  );
}
