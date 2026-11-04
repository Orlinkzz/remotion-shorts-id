// Diadaptasi dari "circular-progress" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Cincin progres yang terisi sampai persen tertentu, dengan cincin putar halus.
// Props: value (persen 0–100), unit (default "%"), title (label di bawah), subtitle (keterangan), accent.
import { interpolate } from "remotion";
import {
  clamp,
  colors,
  contentArea,
  Emphasis,
  formatNumber,
  sansFont,
  TemplateTitle,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  value: 92,
  unit: "%",
  title: "*Test coverage*",
  subtitle: "Target minimal 80%",
};

const SIZE = 680;
const R = 280;
const STROKE = 44;

export default function CircularProgress(props: TemplateProps) {
  const { value, unit, title, subtitle, accent, frame, fps } = useTemplate(
    props,
    defaults,
  );
  const target = Math.max(0, Math.min(100, value));
  const fill = interpolate(frame, [6, fps * 1.8], [0, 1], {
    ...clamp,
    easing: (t) => 1 - (1 - t) ** 3,
  });
  const circumference = 2 * Math.PI * R;
  const rotation = (frame * 1.5) % 360;
  const pulse = 1 + Math.sin(frame / 12) * 0.015;
  const subIn = interpolate(frame, [fps * 1.2, fps * 1.7], [0, 1], clamp);

  return (
    <div
      style={{
        ...contentArea,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 56,
        fontFamily: sansFont,
        textAlign: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          width: SIZE,
          height: SIZE,
          transform: `scale(${pulse})`,
        }}
      >
        <svg
          width={SIZE}
          height={SIZE}
          style={{ position: "absolute", inset: 0 }}
        >
          <defs>
            <linearGradient
              id="circular-progress-grad"
              x1="0"
              y1="0"
              x2="1"
              y2="1"
            >
              <stop offset="0%" stopColor={accent} />
              <stop offset="100%" stopColor={colors.accent2} />
            </linearGradient>
          </defs>
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="rgba(17, 24, 39, 0.6)"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={STROKE}
          />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke="url(#circular-progress-grad)"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - (target / 100) * fill)}
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R - STROKE - 14}
            fill="none"
            stroke={accent}
            strokeOpacity={0.35}
            strokeWidth={6}
            strokeDasharray="40 30"
            transform={`rotate(${rotation} ${SIZE / 2} ${SIZE / 2})`}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 160,
            fontWeight: 900,
            color: colors.text,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {formatNumber(target * fill, Number.isInteger(target) ? 0 : 1) + unit}
        </div>
      </div>
      <div>
        <TemplateTitle text={title} accent={accent} max={84} />
        <div
          style={{
            marginTop: 20,
            fontSize: 44,
            fontWeight: 600,
            color: colors.muted,
            opacity: subIn,
          }}
        >
          <Emphasis text={subtitle} color={accent} />
        </div>
      </div>
    </div>
  );
}
