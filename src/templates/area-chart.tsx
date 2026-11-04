// Diadaptasi dari "area-chart" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Grafik area yang terbuka dari kiri ke kanan, cocok untuk tren naik/turun.
// Props: title, subtitle, items (label sumbu X), values (data, urut dengan items), unit, accent.
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
  title: "Pengguna *aktif* aplikasi",
  subtitle: "Ribuan pengguna per bulan",
  items: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"],
  values: [12, 18, 15, 27, 33, 46],
  unit: "",
};

const W = 952;
const H = 760;
const PAD_X = 60;
const PAD_TOP = 70;
const PAD_BOTTOM = 80;

export default function AreaChart(props: TemplateProps) {
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
  const revealEnd = Math.max(
    fps * 0.8,
    Math.min(fps * 2, durationInFrames * 0.6),
  );
  const reveal = interpolate(frame, [6, revealEnd], [0, 1], {
    ...clamp,
    easing: (t) => 1 - (1 - t) ** 2,
  });
  const titleIn = interpolate(frame, [0, fps * 0.5], [0, 1], clamp);

  const x = (i: number) =>
    data.length === 1
      ? W / 2
      : PAD_X + (i / (data.length - 1)) * (W - PAD_X * 2);
  const y = (v: number) =>
    H - PAD_BOTTOM - (v / max) * (H - PAD_TOP - PAD_BOTTOM);
  const line = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(d.value)}`)
    .join(" ");
  const area = `${line} L ${x(data.length - 1)} ${H - PAD_BOTTOM} L ${x(0)} ${H - PAD_BOTTOM} Z`;
  const clipW = PAD_X + reveal * (W - PAD_X);

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
          {subtitle}
        </div>
      </div>
      <div
        style={{
          borderRadius: 36,
          background: "rgba(17, 24, 39, 0.68)",
          border: `2px solid ${colors.surfaceAlt}`,
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.35)",
          overflow: "hidden",
        }}
      >
        <svg
          width="100%"
          viewBox={`0 0 ${W} ${H}`}
          style={{ display: "block" }}
        >
          <defs>
            <linearGradient id="area-chart-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={accent} stopOpacity={0.6} />
              <stop offset="100%" stopColor={accent} stopOpacity={0} />
            </linearGradient>
            <clipPath id="area-chart-clip">
              <rect x={0} y={0} width={clipW} height={H} />
            </clipPath>
          </defs>
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
          <path
            d={area}
            fill="url(#area-chart-fill)"
            clipPath="url(#area-chart-clip)"
          />
          <path
            d={line}
            fill="none"
            stroke={accent}
            strokeWidth={8}
            strokeLinecap="round"
            strokeLinejoin="round"
            clipPath="url(#area-chart-clip)"
          />
          {data.map((d, i) => {
            const shown = interpolate(
              clipW,
              [x(i) - 10, x(i) + 10],
              [0, 1],
              clamp,
            );
            return (
              <g key={i} opacity={shown}>
                <circle
                  cx={x(i)}
                  cy={y(d.value)}
                  r={12 * shown}
                  fill="white"
                  stroke={accent}
                  strokeWidth={5}
                />
                <text
                  x={x(i)}
                  y={y(d.value) - 28}
                  textAnchor="middle"
                  fill={colors.text}
                  fontSize={36}
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
              y={H - 26}
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
