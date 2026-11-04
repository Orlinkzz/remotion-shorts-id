// Diadaptasi dari "whip-pan" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Transisi layar A -> B dengan sentakan kamera horizontal cepat dan motion blur.
// Props: items[0] = teks layar A, title + subtitle = layar B, accent.
import { Easing } from "remotion";
import {
  colors,
  TitleCard,
  useTemplate,
  useTransitionProgress,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  items: ["Frontend"],
  title: "Sekarang *backend*",
  subtitle: "Bagaimana API-nya bekerja",
};

export default function WhipPan(props: TemplateProps) {
  const { items, title, subtitle, accent } = useTemplate(props, defaults);
  const p = useTransitionProgress(Easing.inOut(Easing.exp));
  // Blur dan regangan paling kuat di tengah gerakan.
  const speed = Math.sin(Math.PI * p);
  const blur = speed * 28;
  const stretch = 1 + speed * 0.6;

  return (
    <>
      <TitleCard
        title={title}
        subtitle={subtitle}
        accent={accent}
        style={{
          transform: `translateX(${(1 - p) * 100}%) scaleX(${stretch})`,
          filter: blur > 0.5 ? `blur(${blur}px)` : undefined,
        }}
      />
      {p < 1 ? (
        <TitleCard
          title={items[0]}
          accent={accent}
          background={`linear-gradient(160deg, ${colors.bgFrom}, ${colors.bgTo})`}
          style={{
            transform: `translateX(${-p * 100}%) scaleX(${stretch})`,
            filter: blur > 0.5 ? `blur(${blur}px)` : undefined,
          }}
        />
      ) : null}
    </>
  );
}
