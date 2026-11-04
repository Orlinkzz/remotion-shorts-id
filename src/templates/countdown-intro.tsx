// Diadaptasi dari "countdown-intro" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Hitung mundur dengan cincin progres, lalu judul meletup ("MULAI!").
// Props: value (angka awal, default 3), title (teks setelah hitungan), subtitle (opsional), accent.
import { interpolate, spring } from "remotion";
import {
  clamp,
  colors,
  contentArea,
  sansFont,
  TemplateTitle,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  value: 3,
  title: "MULAI!",
  subtitle: "Tantangan coding hari ini",
};

const SIZE = 520;
const R = 220;

export default function CountdownIntro(props: TemplateProps) {
  const { value, title, subtitle, accent, frame, fps, durationInFrames } =
    useTemplate(props, defaults);
  const start = Math.max(1, Math.min(10, Math.round(value)));
  // Tiap angka maksimal 1 dtk; hitungan selesai paling lambat di 60% scene.
  const per = Math.max(4, Math.min(fps, (durationInFrames * 0.6) / start));
  const total = per * start;
  const done = frame >= total;
  const current = start - Math.floor(frame / per);
  const ring = (frame % per) / per;
  const circumference = 2 * Math.PI * R;
  const tick = spring({
    frame: frame % per,
    fps,
    from: 1.3,
    to: 1,
    config: { damping: 12 },
  });
  const go = spring({
    frame: frame - total,
    fps,
    config: { damping: 8, stiffness: 100 },
  });
  const subIn = interpolate(frame, [total + 8, total + 20], [0, 1], clamp);

  return (
    <div
      style={{
        ...contentArea,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        fontFamily: sansFont,
      }}
    >
      {!done ? (
        <div style={{ position: "relative", width: SIZE, height: SIZE }}>
          <svg
            width={SIZE}
            height={SIZE}
            style={{ transform: "rotate(-90deg)" }}
          >
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={R}
              fill="rgba(17,24,39,0.6)"
              stroke={colors.surfaceAlt}
              strokeWidth={18}
            />
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={R}
              fill="none"
              stroke={accent}
              strokeWidth={18}
              strokeDasharray={circumference}
              strokeDashoffset={circumference * ring}
              strokeLinecap="round"
            />
          </svg>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 260,
              fontWeight: 900,
              color: colors.text,
              transform: `scale(${tick})`,
            }}
          >
            {current}
          </div>
        </div>
      ) : (
        <>
          <div style={{ transform: `scale(${go})` }}>
            <TemplateTitle
              text={title}
              accent={accent}
              max={150}
              style={{ color: accent }}
            />
          </div>
          {subtitle ? (
            <div
              style={{
                marginTop: 36,
                fontSize: 50,
                fontWeight: 600,
                color: colors.muted,
                opacity: subIn,
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
