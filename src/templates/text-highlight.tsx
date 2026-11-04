// Diadaptasi dari "text-highlight" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Kalimat besar; kata ber-*aksen* disapu stabilo satu per satu sepanjang scene.
// Props: title (kalimat; *kata* = disorot, tanpa * semua kata disorot), subtitle (opsional), accent.
import { interpolate, spring } from "remotion";
import {
  clamp,
  colors,
  contentArea,
  fitFontSize,
  plain,
  sansFont,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  title: "Kode yang *mudah dibaca* lebih penting dari kode yang *pintar*",
};

// Pecah kalimat jadi kata, tandai yang ada di dalam *...*.
const toWords = (text: string) => {
  let on = false;
  return text
    .split(/\s+/)
    .filter(Boolean)
    .map((raw) => {
      const starts = raw.startsWith("*");
      if (starts) on = true;
      const marked = on;
      if (raw.replace(/^\*/, "").includes("*")) on = false;
      return { word: raw.replace(/\*/g, ""), marked };
    });
};

export default function TextHighlight(props: TemplateProps) {
  const { title, subtitle, accent, frame, fps, durationInFrames } = useTemplate(
    props,
    defaults,
  );
  const words = toWords(title);
  const hasMarks = words.some((w) => w.marked);
  const targets = words
    .map((w, i) => ({ ...w, i }))
    .filter((w) => (hasMarks ? w.marked : true))
    .map((w) => w.i);
  // Sorotan dimulai setelah 0,5 dtk dan selesai di ~60% scene.
  const start = fps * 0.5;
  const span = Math.max(fps * 0.4, durationInFrames * 0.6 - start);
  const per = span / Math.max(1, targets.length);
  const enter = spring({ frame, fps, config: { damping: 100 } });
  const subIn = interpolate(frame, [fps * 0.6, fps * 1.1], [0, 1], clamp);

  return (
    <div
      style={{
        ...contentArea,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 48,
        fontFamily: sansFont,
        opacity: enter,
        transform: `translateY(${(1 - enter) * 30}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "8px 18px",
          fontSize: fitFontSize(plain(title), 104, 64, 26),
          fontWeight: 800,
          lineHeight: 1.2,
          color: colors.text,
        }}
      >
        {words.map(({ word }, i) => {
          const order = targets.indexOf(i);
          const p =
            order < 0
              ? 0
              : interpolate(
                  frame,
                  [
                    start + order * per,
                    start + order * per + Math.min(per, fps * 0.4),
                  ],
                  [0, 1],
                  clamp,
                );
          return (
            <span key={i} style={{ position: "relative", padding: "0 10px" }}>
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  top: "8%",
                  bottom: "8%",
                  width: `${p * 100}%`,
                  borderRadius: 10,
                  background: `linear-gradient(135deg, ${accent}, ${colors.accent2})`,
                  opacity: 0.85,
                }}
              />
              <span style={{ position: "relative" }}>{word}</span>
            </span>
          );
        })}
      </div>
      {subtitle ? (
        <div
          style={{
            fontSize: 46,
            fontWeight: 600,
            textAlign: "center",
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
