// Diadaptasi dari "sound-wave" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Visual gelombang suara bergerak (deterministik) dengan judul, cocok untuk topik audio/podcast.
// Props: title, subtitle, accent.
import { interpolate, random } from "remotion";
import {
  clamp,
  colors,
  contentArea,
  Emphasis,
  sansFont,
  TemplateTitle,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  title: "Ubah teks jadi *suara*",
  subtitle: "Gratis, pakai Edge TTS",
};

const BAR_COUNT = 30;

export default function SoundWave(props: TemplateProps) {
  const { title, subtitle, accent, frame, fps } = useTemplate(props, defaults);
  const appear = interpolate(frame, [0, fps * 0.6], [0, 1], clamp);

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
      <div style={{ opacity: appear }}>
        <TemplateTitle text={title} accent={accent} max={100} />
      </div>
      <div
        style={{
          width: "100%",
          height: 420,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        {Array.from({ length: BAR_COUNT }, (_, i) => {
          const center =
            1 - Math.abs(i - (BAR_COUNT - 1) / 2) / (BAR_COUNT / 2);
          const wave = Math.abs(Math.sin(frame / 7 + i / 2.2));
          const jitter = random(`sound-wave-${i}-${Math.floor(frame / 3)}`);
          const h =
            (40 + (wave * 0.7 + jitter * 0.3) * 360 * (0.35 + 0.65 * center)) *
            appear;
          const color = i % 2 === 0 ? accent : colors.accent2;
          return (
            <div
              key={i}
              style={{
                width: 20,
                height: Math.max(16, h),
                borderRadius: 10,
                background: `linear-gradient(180deg, ${color}, ${colors.text})`,
                boxShadow: `0 0 18px ${color}88`,
              }}
            />
          );
        })}
      </div>
      <div
        style={{
          fontSize: 48,
          fontWeight: 600,
          color: colors.muted,
          opacity: appear,
        }}
      >
        <Emphasis text={subtitle} color={accent} />
      </div>
    </div>
  );
}
