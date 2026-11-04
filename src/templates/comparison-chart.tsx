// Diadaptasi dari "comparison-chart" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Dua batang berdampingan untuk membandingkan sebelum vs sesudah.
// Props: title, items[0..1] (label kiri/kanan), values[0..1] (nilai), unit, accent (warna batang kanan).
import { interpolate } from "remotion";
import {
  clamp,
  colors,
  contentArea,
  formatNumber,
  sansFont,
  series,
  TemplateTitle,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  title: "Query *sebelum* vs *sesudah* index",
  items: ["Tanpa index", "Pakai index"],
  values: [840, 12],
  unit: "ms",
};

const BAR_MAX = 640;

export default function ComparisonChart(props: TemplateProps) {
  const { title, items, values, unit, accent, frame, fps } = useTemplate(
    props,
    defaults,
  );
  const data = series(items, values).slice(0, 2);
  const max = Math.max(1, ...data.map((d) => d.value));
  const barColors = data.length > 1 ? ["#FB7185", accent] : [accent];
  const titleIn = interpolate(frame, [0, fps * 0.5], [0, 1], clamp);
  const divider = interpolate(frame, [0, fps * 0.7], [0, 1], clamp);

  return (
    <div
      style={{
        ...contentArea,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 56,
        fontFamily: sansFont,
      }}
    >
      <div style={{ opacity: titleIn, textAlign: "center" }}>
        <TemplateTitle text={title} accent={accent} max={84} />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          padding: "56px 40px 44px",
          borderRadius: 36,
          background: "rgba(17, 24, 39, 0.68)",
          border: `2px solid ${colors.surfaceAlt}`,
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.35)",
        }}
      >
        {data.map((d, i) => {
          const p = interpolate(
            frame,
            [fps * 0.3 + i * fps * 0.35, fps * 1.3 + i * fps * 0.35],
            [0, 1],
            { ...clamp, easing: (t) => 1 - (1 - t) ** 3 },
          );
          const color = barColors[i];
          return [
            i > 0 ? (
              <div
                key="divider"
                style={{
                  width: 3,
                  height: (BAR_MAX + 120) * divider,
                  margin: "0 36px",
                  alignSelf: "center",
                  background: "rgba(255,255,255,0.2)",
                }}
              />
            ) : null,
            <div
              key={i}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontSize: 76,
                  fontWeight: 900,
                  color,
                  marginBottom: 20,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {formatNumber(d.value * p, Number.isInteger(d.value) ? 0 : 1) +
                  unit}
              </div>
              <div
                style={{
                  width: 200,
                  height: Math.max(8, (d.value / max) * BAR_MAX * p),
                  borderRadius: "20px 20px 0 0",
                  background: color,
                  boxShadow: `0 0 40px ${color}55`,
                }}
              />
              <div
                style={{
                  marginTop: 24,
                  fontSize: 44,
                  fontWeight: 700,
                  color: colors.text,
                  textAlign: "center",
                }}
              >
                {d.label}
              </div>
            </div>,
          ];
        })}
      </div>
    </div>
  );
}
