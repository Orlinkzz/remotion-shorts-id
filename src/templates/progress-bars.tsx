// Diadaptasi dari "progress-bars" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Beberapa bar horizontal berlabel yang terisi bergiliran sampai nilainya.
// Props: title, items (label bar), values (persen 0–100), unit (default "%"), accent.
import { interpolate } from "remotion";
import {
  clamp,
  colors,
  contentArea,
  formatNumber,
  palette,
  sansFont,
  series,
  TemplateTitle,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  title: "Skill yang paling *dicari*",
  items: ["React", "TypeScript", "Node.js", "Python", "Go"],
  values: [90, 85, 75, 60, 45],
  unit: "%",
};

export default function ProgressBars(props: TemplateProps) {
  const { title, items, values, unit, accent, frame, fps, durationInFrames } =
    useTemplate(props, defaults);
  const data = series(items, values);
  const barColors = palette(accent);
  const step = Math.min(fps * 0.3, (durationInFrames * 0.5) / data.length);
  const titleIn = interpolate(frame, [0, fps * 0.5], [0, 1], clamp);
  const barH = data.length > 5 ? 30 : 40;

  return (
    <div
      style={{
        ...contentArea,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 48,
        fontFamily: sansFont,
      }}
    >
      <div style={{ opacity: titleIn }}>
        <TemplateTitle text={title} accent={accent} max={88} />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: data.length > 5 ? 28 : 40,
          padding: "52px 48px",
          borderRadius: 36,
          background: "rgba(17, 24, 39, 0.68)",
          border: `2px solid ${colors.surfaceAlt}`,
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.35)",
        }}
      >
        {data.map((d, i) => {
          const start = 6 + i * step;
          const appear = interpolate(frame, [start, start + 8], [0, 1], clamp);
          const fill = interpolate(frame, [start, start + fps * 0.9], [0, 1], {
            ...clamp,
            easing: (t) => 1 - (1 - t) ** 3,
          });
          const pct = Math.max(0, Math.min(100, d.value));
          const color = barColors[i % barColors.length];
          return (
            <div key={i} style={{ opacity: appear }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginBottom: 14,
                }}
              >
                <span
                  style={{ fontSize: 44, fontWeight: 700, color: colors.text }}
                >
                  {d.label}
                </span>
                <span
                  style={{
                    fontSize: 44,
                    fontWeight: 900,
                    color,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {formatNumber(
                    d.value * fill,
                    Number.isInteger(d.value) ? 0 : 1,
                  ) + unit}
                </span>
              </div>
              <div
                style={{
                  height: barH,
                  borderRadius: barH / 2,
                  background: "rgba(255,255,255,0.08)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${pct * fill}%`,
                    height: "100%",
                    borderRadius: barH / 2,
                    background: `linear-gradient(90deg, ${color}, ${color}cc)`,
                    boxShadow: `0 0 24px ${color}66`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
