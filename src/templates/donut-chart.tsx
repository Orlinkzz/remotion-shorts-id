// Diadaptasi dari "donut-chart" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Donat bersegmen yang tergambar bergiliran, angka utama di tengah, legenda di bawah.
// Props: title, items (label segmen), values (porsi), value (angka di tengah, default segmen pertama dalam %), unit, subtitle (label tengah), accent.
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
  title: "Isi *bundle* JavaScript",
  subtitle: "kode sendiri",
  items: ["Kode sendiri", "React", "Lodash", "Lainnya"],
  values: [38, 27, 20, 15],
  unit: "%",
};

const SIZE = 700;
const R = 270;
const STROKE = 70;

export default function DonutChart(props: TemplateProps) {
  const {
    title,
    subtitle,
    items,
    values,
    value,
    unit,
    accent,
    frame,
    fps,
    durationInFrames,
  } = useTemplate(props, defaults);
  const data = series(items, values);
  const total = Math.max(
    1e-6,
    data.reduce((s, d) => s + d.value, 0),
  );
  const center = value ?? Math.round(((data[0]?.value ?? 0) / total) * 100);
  const segColors = palette(accent);
  const circumference = 2 * Math.PI * R;
  const step = Math.min(fps * 0.4, (durationInFrames * 0.5) / data.length);
  const titleIn = interpolate(frame, [0, fps * 0.5], [0, 1], clamp);
  const count = interpolate(frame, [6, fps * 1.6], [0, center], clamp);

  let offset = 0;

  return (
    <div
      style={{
        ...contentArea,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 44,
        fontFamily: sansFont,
      }}
    >
      <div style={{ opacity: titleIn, textAlign: "center" }}>
        <TemplateTitle text={title} accent={accent} max={88} />
      </div>
      <div style={{ position: "relative", width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE}>
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="rgba(17, 24, 39, 0.6)"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={STROKE}
          />
          {data.map((d, i) => {
            const len = (d.value / total) * circumference;
            const start = offset;
            offset += len;
            const p = interpolate(
              frame,
              [i * step, i * step + fps * 0.6],
              [0, 1],
              clamp,
            );
            const shown = Math.max(0, len * p - 4);
            return (
              <circle
                key={i}
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={R}
                fill="none"
                stroke={segColors[i % segColors.length]}
                strokeWidth={STROKE}
                strokeDasharray={`${shown} ${circumference - shown}`}
                strokeDashoffset={-start}
                transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
              />
            );
          })}
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: 128,
              fontWeight: 900,
              color: colors.text,
              lineHeight: 1,
            }}
          >
            {formatNumber(count, Number.isInteger(center) ? 0 : 1) + unit}
          </div>
          <div
            style={{
              marginTop: 12,
              fontSize: 40,
              fontWeight: 600,
              color: colors.muted,
            }}
          >
            {subtitle}
          </div>
        </div>
      </div>
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
                borderRadius: "50%",
                background: segColors[i % segColors.length],
              }}
            />
            <span style={{ fontSize: 40, fontWeight: 600, color: colors.text }}>
              {d.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
