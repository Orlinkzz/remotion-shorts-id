// Diadaptasi dari "clock-wipe" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Transisi layar A -> B dengan sapuan jarum jam.
// Props: items[0] = teks layar A, title + subtitle = layar B, accent.
import {
  colors,
  TitleCard,
  useTemplate,
  useTransitionProgress,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  items: ["Masalahnya…"],
  title: "Ini *solusinya*",
  subtitle: "Cukup satu baris perubahan",
};

export default function ClockWipe(props: TemplateProps) {
  const { items, title, subtitle, accent } = useTemplate(props, defaults);
  const deg = useTransitionProgress() * 360;

  return (
    <>
      <TitleCard title={title} subtitle={subtitle} accent={accent} />
      <TitleCard
        title={items[0]}
        accent={accent}
        background={`linear-gradient(160deg, ${colors.bgFrom}, ${colors.bgTo})`}
        style={{
          maskImage: `conic-gradient(from 0deg, transparent ${deg}deg, black ${deg}deg)`,
          WebkitMaskImage: `conic-gradient(from 0deg, transparent ${deg}deg, black ${deg}deg)`,
          opacity: deg >= 360 ? 0 : 1,
        }}
      />
    </>
  );
}
