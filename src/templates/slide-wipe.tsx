// Diadaptasi dari "slide-wipe" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Transisi layar A -> B dengan sapuan garis beraksen dari kiri ke kanan.
// Props: items[0] = teks layar A, title + subtitle = layar B, accent.
import {
  colors,
  TitleCard,
  useTemplate,
  useTransitionProgress,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  items: ["Tanpa index"],
  title: "Dengan *index*",
  subtitle: "Query 40x lebih cepat",
};

export default function SlideWipe(props: TemplateProps) {
  const { items, title, subtitle, accent } = useTemplate(props, defaults);
  const p = useTransitionProgress();
  const edge = p * 100;

  return (
    <>
      <TitleCard title={title} subtitle={subtitle} accent={accent} />
      {p < 1 ? (
        <>
          <TitleCard
            title={items[0]}
            accent={accent}
            background={`linear-gradient(160deg, ${colors.bgFrom}, ${colors.bgTo})`}
            style={{ clipPath: `inset(0 0 0 ${edge}%)` }}
          />
          {p > 0 ? (
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: `${edge}%`,
                width: 16,
                transform: "translateX(-50%)",
                background: accent,
                boxShadow: `0 0 40px ${accent}`,
              }}
            />
          ) : null}
        </>
      ) : null}
    </>
  );
}
