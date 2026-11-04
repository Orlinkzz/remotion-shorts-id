// Diadaptasi dari "gradient-shift" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Lapisan gradien warna yang perlahan berputar dan bergeser di belakang judul.
// Props: title, subtitle, accent.
import {
  colors,
  TitleCard,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  title: "Ganti *suasana*",
  subtitle: "Bagian berikutnya dimulai",
};

// Warna CSS apa pun (hex, rgb, nama) dengan transparansi.
const fade = (color: string, amount: number) =>
  `color-mix(in srgb, ${color} ${Math.round(amount * 100)}%, transparent)`;

export default function GradientShift(props: TemplateProps) {
  const { title, subtitle, accent, frame, durationInFrames } = useTemplate(
    props,
    defaults,
  );
  const t = (frame / durationInFrames) * Math.PI * 2;
  const angle = 135 + Math.sin(t) * 60;

  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(${angle}deg, ${fade(accent, 0.35 + 0.15 * Math.sin(t))}, ${fade(colors.accent2, 0.35 + 0.15 * Math.sin(t + 2))}, ${fade(colors.bgTo, 0.3 + 0.15 * Math.sin(t + 4))})`,
        }}
      />
      <TitleCard title={title} subtitle={subtitle} accent={accent} />
    </>
  );
}
