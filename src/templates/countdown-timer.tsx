// Diadaptasi dari "countdown-timer" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Hitung mundur angka besar sepanjang scene, ditutup kata penutup.
// Props: value (mulai dari angka berapa), title (label di atas), subtitle (kata penutup), accent.
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
  value: 5,
  title: "Tebak *output*-nya!",
  subtitle: "Jawab!",
};

export default function CountdownTimer(props: TemplateProps) {
  const { value, title, subtitle, accent, frame, fps, durationInFrames } =
    useTemplate(props, defaults);

  const start = Math.max(1, Math.min(20, Math.round(value)));
  const labels = [
    ...Array.from({ length: start }, (_, i) => String(start - i)),
    subtitle,
  ];
  const perLabel = Math.max(
    6,
    Math.floor((durationInFrames * 0.92) / labels.length),
  );
  const index = Math.min(Math.floor(frame / perLabel), labels.length - 1);
  const local = frame - index * perLabel;
  const isLast = index === labels.length - 1;

  const scale = spring({
    frame: local,
    fps,
    config: { damping: 12, stiffness: 200, mass: 0.5 },
  });
  // perLabel >= 6, jadi fade <= 2 tetap membuat inputRange naik ketat.
  const fade = Math.min(4, Math.floor((perLabel - 1) / 2));
  const opacity = isLast
    ? 1
    : interpolate(
        local,
        [0, fade, perLabel - fade, perLabel],
        [0, 1, 1, 0],
        clamp,
      );
  const titleIn = interpolate(frame, [0, fps * 0.5], [0, 1], clamp);
  const ring = isLast ? 1 : local / perLabel;

  return (
    <div
      style={{
        ...contentArea,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 80,
        fontFamily: sansFont,
        textAlign: "center",
      }}
    >
      <div style={{ opacity: titleIn }}>
        <TemplateTitle text={title} accent={accent} max={96} />
      </div>
      <div
        style={{
          position: "relative",
          width: 620,
          height: 620,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width={620}
          height={620}
          style={{ position: "absolute", inset: 0 }}
        >
          <circle
            cx={310}
            cy={310}
            r={290}
            fill="rgba(17, 24, 39, 0.6)"
            stroke={colors.surfaceAlt}
            strokeWidth={14}
          />
          <circle
            cx={310}
            cy={310}
            r={290}
            fill="none"
            stroke={accent}
            strokeWidth={14}
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 290}
            strokeDashoffset={2 * Math.PI * 290 * (1 - ring)}
            transform="rotate(-90 310 310)"
          />
        </svg>
        <div
          style={{
            transform: `scale(${scale})`,
            opacity,
            fontSize: isLast
              ? Math.min(
                  200,
                  Math.round(1100 / Math.max(3, labels[index].length)),
                )
              : 320,
            fontWeight: 900,
            lineHeight: 1,
            color: isLast ? accent : colors.text,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {labels[index]}
        </div>
      </div>
    </div>
  );
}
