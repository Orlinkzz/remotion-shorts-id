// Diadaptasi dari "pie-chart" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Diagram lingkaran penuh yang terisi per potongan, legenda dengan persentase.
// Props: title, items (label potongan), values (porsi, dinormalisasi ke 100%), accent.
import { interpolate } from "remotion";
import {
  clamp,
  colors,
  contentArea,
  palette,
  sansFont,
  series,
  TemplateTitle,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  title: "Bahasa paling *dipakai*",
  items: ["JavaScript", "Python", "TypeScript", "Go", "Lainnya"],
  values: [35, 25, 20, 12, 8],
};

const SIZE = 640;
const R = SIZE / 4;

export default function PieChart(props: TemplateProps) {
  const { title, items, values, accent, frame, fps, durationInFrames } =
    useTemplate(props, defaults);
  const data = series(items, values);
  const total = Math.max(
    1e-6,
    data.reduce((s, d) => s + d.value, 0),
  );
  const segColors = palette(accent);
  const circumference = 2 * Math.PI * R;
  const step = Math.min(fps * 0.35, (durationInFrames * 0.5) / data.length);
  const titleIn = interpolate(frame, [0, fps * 0.5], [0, 1], clamp);
  const pop = interpolate(frame, [0, fps * 0.4], [0.85, 1], clamp);

  let offset = 0;

  return (
    <div
      style={{
        ...contentArea,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 48,
        fontFamily: sansFont,
      }}
    >
      <div style={{ opacity: titleIn, textAlign: "center" }}>
        <TemplateTitle text={title} accent={accent} max={88} />
      </div>
      <svg
        width={SIZE}
        height={SIZE}
        style={{
          transform: `scale(${pop})`,
          filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.4))",
        }}
      >
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={SIZE / 2 - 4}
          fill="rgba(17, 24, 39, 0.6)"
        />
        {data.map((d, i) => {
          const len = (d.value / total) * circumference;
          const start = offset;
          offset += len;
          const p = interpolate(
            frame,
            [i * step, i * step + fps * 0.5],
            [0, 1],
            clamp,
          );
          return (
            <circle
              key={i}
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={R}
              fill="none"
              stroke={segColors[i % segColors.length]}
              strokeWidth={R * 2}
              strokeDasharray={`${len * p} ${circumference - len * p}`}
              strokeDashoffset={-start}
              transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
            />
          );
        })}
      </svg>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "16px 36px",
        }}
      >
        {data.map((d, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              opacity: interpolate(
                frame,
                [i * step + 4, i * step + 14],
                [0, 1],
                clamp,
              ),
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: segColors[i % segColors.length],
              }}
            />
            <span style={{ fontSize: 40, fontWeight: 600, color: colors.text }}>
              {d.label}
            </span>
            <span
              style={{ fontSize: 40, fontWeight: 800, color: colors.muted }}
            >
              {Math.round((d.value / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
