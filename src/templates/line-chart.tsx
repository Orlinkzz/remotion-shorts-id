// Diadaptasi dari "line-chart" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Garis tren yang tergambar dari kiri ke kanan, titik data muncul saat dilewati.
// Props: title, subtitle, items (label sumbu X), values (data), unit, accent.
import { interpolate } from "remotion";
import {
  clamp,
  colors,
  contentArea,
  Emphasis,
  formatNumber,
  sansFont,
  series,
  TemplateTitle,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  title: "Waktu *build* makin cepat",
  subtitle: "Detik per build, tiap versi",
  items: ["v1", "v2", "v3", "v4", "v5"],
  values: [48, 41, 30, 22, 9],
  unit: "s",
};

const W = 952;
const H = 760;
const PAD_X = 70;
const PAD_TOP = 80;
const PAD_BOTTOM = 90;

export default function LineChart(props: TemplateProps) {
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
  const x = (i: number) =>
    data.length === 1
      ? W / 2
      : PAD_X + (i / (data.length - 1)) * (W - PAD_X * 2);
  const y = (v: number) =>
    H - PAD_BOTTOM - (v / max) * (H - PAD_TOP - PAD_BOTTOM);

  const seg = data
    .slice(1)
    .map((d, i) => Math.hypot(x(i + 1) - x(i), y(d.value) - y(data[i].value)));
  const total = seg.reduce((s, l) => s + l, 0);
  const drawEnd = Math.max(
    fps * 0.8,
    Math.min(fps * 2, durationInFrames * 0.6),
  );
  const draw = interpolate(frame, [6, drawEnd], [0, 1], {
    ...clamp,
    easing: (t) => 1 - (1 - t) ** 2,
  });
  const drawn = total * draw;
  const reachedAt = (i: number) => seg.slice(0, i).reduce((s, l) => s + l, 0);
  const titleIn = interpolate(frame, [0, fps * 0.5], [0, 1], clamp);

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
          {[0, 0.25, 0.5, 0.75, 1].map((t) => (
            <line
              key={t}
              x1={PAD_X}
              x2={W - PAD_X}
              y1={y(max * t)}
              y2={y(max * t)}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth={2}
            />
          ))}
          <polyline
            points={data.map((d, i) => `${x(i)},${y(d.value)}`).join(" ")}
            fill="none"
            stroke={accent}
            strokeWidth={9}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={total}
            strokeDashoffset={total - drawn}
          />
          {data.map((d, i) => {
            const at = reachedAt(i);
            const shown =
              total === 0
                ? draw
                : interpolate(drawn, [at - 1, at + 30], [0, 1], clamp);
            return (
              <g key={i} opacity={shown}>
                <circle
                  cx={x(i)}
                  cy={y(d.value)}
                  r={14 * shown}
                  fill={colors.surface}
                  stroke={accent}
                  strokeWidth={6}
                />
                <text
                  x={x(i)}
                  y={y(d.value) - 30}
                  textAnchor="middle"
                  fill={colors.text}
                  fontSize={38}
                  fontWeight={800}
                >
                  {formatNumber(d.value, Number.isInteger(d.value) ? 0 : 1) +
                    unit}
                </text>
              </g>
            );
          })}
          {data.map((d, i) => (
            <text
              key={`label-${i}`}
              x={x(i)}
              y={H - 30}
              textAnchor="middle"
              fill={colors.muted}
              fontSize={34}
              fontWeight={600}
            >
              {d.label}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}
