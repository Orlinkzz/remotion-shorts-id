// Diadaptasi dari "zoom-through" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Transisi layar A -> B: kamera menembus A (zoom besar) lalu B mendarat.
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
  items: ["Di balik layar"],
  title: "Cara kerja *event loop*",
  subtitle: "Call stack, queue, dan tick",
};

export default function ZoomThrough(props: TemplateProps) {
  const { items, title, subtitle, accent } = useTemplate(props, defaults);
  const p = useTransitionProgress((t) => t);
  const scaleA = interpolate(p, [0, 0.5], [1, 3], clamp);
  const opacityA = interpolate(p, [0.2, 0.5], [1, 0], clamp);
  const scaleB = interpolate(p, [0.5, 1], [0.4, 1], {
    ...clamp,
    easing: (t) => 1 - (1 - t) ** 3,
  });
  const opacityB = interpolate(p, [0.45, 0.75], [0, 1], clamp);

  return (
    <>
      <TitleCard
        title={title}
        subtitle={subtitle}
        accent={accent}
        style={{ opacity: opacityB, transform: `scale(${scaleB})` }}
      />
      {opacityA > 0 ? (
        <TitleCard
          title={items[0]}
          accent={accent}
          background={`linear-gradient(160deg, ${colors.bgFrom}, ${colors.bgTo})`}
          style={{ opacity: opacityA, transform: `scale(${scaleA})` }}
        />
      ) : null}
    </>
  );
}
