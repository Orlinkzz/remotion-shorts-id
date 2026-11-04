// Diadaptasi dari "popping-text" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Kata seru besar yang hurufnya meletup bergantian warna, cocok untuk "BERHASIL!".
// Props: title (kata pendek), subtitle (opsional), accent.
import { interpolate, spring } from "remotion";
import {
  clamp,
  colors,
  contentArea,
  palette,
  plain,
  sansFont,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  title: "BERHASIL!",
  subtitle: "Semua test lulus",
};

export default function PoppingText(props: TemplateProps) {
  const { title, subtitle, accent, frame, fps } = useTemplate(props, defaults);
  const words = plain(title).split(/\s+/).filter(Boolean);
  const longest = Math.max(1, ...words.map((w) => w.length));
  const fontSize = Math.max(80, Math.min(200, Math.floor(1500 / longest)));
  const total = words.reduce((n, w) => n + w.length, 0);
  const step = Math.min(7, (fps * 1.2) / Math.max(1, total));
  const tones = palette(accent).slice(0, 3);
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
        gap: 8,
        fontFamily: sansFont,
      }}
    >
      {words.map((word, w) => (
        <div key={w} style={{ whiteSpace: "nowrap" }}>
          {[...word].map((ch) => {
            const i = index++;
            const scale = spring({
              frame: frame - i * step,
              fps,
              config: { mass: 0.4, damping: 8, stiffness: 100 },
            });
            const tone = tones[i % tones.length];
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  margin: "0 0.04em",
                  fontSize,
                  fontWeight: 900,
                  color: tone,
                  opacity: Math.min(1, scale),
                  transform: `scale(${scale})`,
                  textShadow: `0 0 16px ${tone}, -3px -3px 0 #fff, 3px -3px 0 #fff, -3px 3px 0 #fff, 3px 3px 0 #fff`,
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>
      ))}
      {subtitle ? (
        <div
          style={{
            marginTop: 40,
            fontSize: 50,
            fontWeight: 700,
            color: colors.text,
            opacity: subIn,
          }}
        >
          {subtitle}
        </div>
      ) : null}
    </div>
  );
}
