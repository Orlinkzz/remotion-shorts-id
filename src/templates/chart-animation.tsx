// Diadaptasi dari "chart-animation" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Grafik batang berwarna yang tumbuh satu per satu dari bawah.
// Props: title, subtitle, items (label batang), values (tinggi batang), unit, accent.
import { interpolate } from "remotion";
import {
  clamp,
  colors,
  contentArea,
  Emphasis,
  formatNumber,
  palette,
  sansFont,
  series,
  TemplateTitle,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  title: "Request per detik",
  subtitle: "Benchmark framework *backend*",
  items: ["Express", "Fastify", "Hono", "Elysia"],
  values: [15, 48, 62, 71],
  unit: "rb",
};

const W = 952;
const H = 780;
const PAD_X = 40;
const PAD_TOP = 80;
const PAD_BOTTOM = 90;

export default function ChartAnimation(props: TemplateProps) {
  const {
    title,
    subtitle,
    items,
    values,
    unit,
    accent,
    frame,
    fps,
    durationInFrames,
  } = useTemplate(props, defaults);
  const data = series(items, values);
  const max = Math.max(1, ...data.map((d) => d.value));
  const colorsList = palette(accent);
  const slot = (W - PAD_X * 2) / data.length;
  const barW = slot * 0.66;
  const stagger = Math.min(fps * 0.25, (durationInFrames * 0.4) / data.length);
  const titleIn = interpolate(frame, [0, fps * 0.5], [0, 1], clamp);
  const labelSize = Math.min(
    36,
    Math.round((slot * 1.6) / Math.max(4, ...data.map((d) => d.label.length))),
  );

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
      <div style={{ opacity: titleIn }}>
        <TemplateTitle text={title} accent={accent} max={88} />
        <div
          style={{
            marginTop: 16,
            fontSize: 42,
            fontWeight: 600,
            color: colors.muted,
          }}
        >
          <Emphasis text={subtitle} color={accent} />
        </div>
      </div>
      <div
        style={{
          borderRadius: 36,
          background: "rgba(17, 24, 39, 0.68)",
          border: `2px solid ${colors.surfaceAlt}`,
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.35)",
        }}
      >
        <svg
          width="100%"
          viewBox={`0 0 ${W} ${H}`}
          style={{ display: "block" }}
        >
          <line
            x1={PAD_X}
            x2={W - PAD_X}
            y1={H - PAD_BOTTOM}
            y2={H - PAD_BOTTOM}
            stroke="rgba(255,255,255,0.25)"
            strokeWidth={3}
          />
          {data.map((d, i) => {
            const p = interpolate(
              frame,
              [6 + i * stagger, 6 + i * stagger + fps * 0.6],
              [0, 1],
              {
                ...clamp,
                easing: (t) => 1 - (1 - t) ** 3,
              },
            );
            const full = (d.value / max) * (H - PAD_TOP - PAD_BOTTOM);
            const h = full * p;
            const cx = PAD_X + slot * (i + 0.5);
            const top = H - PAD_BOTTOM - h;
            return (
              <g key={i}>
                <rect
                  x={cx - barW / 2}
                  y={top}
                  width={barW}
                  height={h}
                  rx={14}
                  fill={colorsList[i % colorsList.length]}
                />
                <text
                  x={cx}
                  y={top - 20}
                  textAnchor="middle"
                  fill={colors.text}
                  fontSize={40}
                  fontWeight={900}
                  opacity={interpolate(p, [0.7, 1], [0, 1], clamp)}
                >
                  {formatNumber(d.value, Number.isInteger(d.value) ? 0 : 1) +
                    unit}
                </text>
                <text
                  x={cx}
                  y={H - 36}
                  textAnchor="middle"
                  fill={colors.muted}
                  fontSize={labelSize}
                  fontWeight={700}
                >
                  {d.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
