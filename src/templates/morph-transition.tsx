// Diadaptasi dari "morph-transition" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Transisi layar A -> B: A mengecil dan memudar, B masuk dari skala besar.
// Props: items[0] = teks layar A, title + subtitle = layar B, accent.
import { interpolate } from "remotion";
import {
  clamp,
  colors,
  TitleCard,
  useTemplate,
  useTransitionProgress,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  items: ["Class component"],
  title: "Jadi *function component*",
  subtitle: "Lebih ringkas dengan hooks",
};

export default function MorphTransition(props: TemplateProps) {
  const { items, title, subtitle, accent } = useTemplate(props, defaults);
  const p = useTransitionProgress();
  const opacityA = interpolate(p, [0, 0.6], [1, 0], clamp);
  const opacityB = interpolate(p, [0.4, 1], [0, 1], clamp);

  return (
    <>
      <TitleCard
        title={title}
        subtitle={subtitle}
        accent={accent}
        style={{ opacity: opacityB, transform: `scale(${1.5 - 0.5 * p})` }}
      />
      {opacityA > 0 ? (
        <TitleCard
          title={items[0]}
          accent={accent}
          background={`linear-gradient(160deg, ${colors.bgFrom}, ${colors.bgTo})`}
          style={{
            opacity: opacityA,
            transform: `scale(${1 - 0.5 * p})`,
            borderRadius: p * 120,
            overflow: "hidden",
          }}
        />
      ) : null}
    </>
  );
}
