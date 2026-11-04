// Diadaptasi dari "liquid-wave" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Gelombang cair berlapis di bagian bawah layar, di belakang judul.
// Props: title, subtitle, accent.
import {
  colors,
  TitleCard,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  title: "Data *mengalir*",
  subtitle: "Dari request sampai response",
};

const POINTS = 48;

export default function LiquidWave(props: TemplateProps) {
  const { title, subtitle, accent, frame, durationInFrames, width, height } =
    useTemplate(props, defaults);
  const loops = Math.max(1, Math.round(durationInFrames / 90));
  const t = (frame / durationInFrames) * Math.PI * 2 * loops;

  const wave = (base: number, amp: number, phase: number, k: number) => {
    const pts = Array.from({ length: POINTS + 1 }).map((_, i) => {
      const x = (i / POINTS) * width;
      const y =
        base + Math.sin(t + phase + (i / POINTS) * Math.PI * 2 * k) * amp;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    return `M 0,${height} L ${pts.join(" L ")} L ${width},${height} Z`;
  };

  return (
    <>
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <linearGradient id="liquid-wave-a" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={accent} stopOpacity={0.5} />
            <stop offset="100%" stopColor={colors.accent2} stopOpacity={0.5} />
          </linearGradient>
        </defs>
        <path
          d={wave(height * 0.62, 50, 0, 1)}
          fill={colors.accent2}
          opacity={0.18}
        />
        <path d={wave(height * 0.68, 60, 2, 1.5)} fill="url(#liquid-wave-a)" />
        <path d={wave(height * 0.76, 40, 4, 2)} fill={accent} opacity={0.25} />
      </svg>
      <TitleCard title={title} subtitle={subtitle} accent={accent} />
    </>
  );
}
