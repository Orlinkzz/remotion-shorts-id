// Diadaptasi dari "iris-transition" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Transisi layar A -> B lewat lingkaran iris yang membuka dari tengah.
// Props: items[0] = teks layar A, title + subtitle = layar B, accent.
import {
  colors,
  TitleCard,
  useTemplate,
  useTransitionProgress,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  items: ["Gambaran besar"],
  title: "*Zoom* ke detail",
  subtitle: "Satu fungsi yang jadi masalah",
};

export default function IrisTransition(props: TemplateProps) {
  const { items, title, subtitle, accent, width, height } = useTemplate(
    props,
    defaults,
  );
  const p = useTransitionProgress();
  const r = p * Math.hypot(width / 2, height * 0.55);
  const mask = `radial-gradient(circle at 50% 45%, transparent ${r}px, black ${r + 2}px)`;

  return (
    <>
      <TitleCard title={title} subtitle={subtitle} accent={accent} />
      {p < 1 ? (
        <>
          <TitleCard
            title={items[0]}
            accent={accent}
            background={`linear-gradient(160deg, ${colors.bgFrom}, ${colors.bgTo})`}
            style={{ maskImage: mask, WebkitMaskImage: mask }}
          />
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "45%",
              width: r * 2,
              height: r * 2,
              borderRadius: "50%",
              border: `6px solid ${accent}`,
              transform: "translate(-50%, -50%)",
              opacity: p > 0 ? 1 - p * 0.6 : 0,
            }}
          />
        </>
      ) : null}
    </>
  );
}
