// Diadaptasi dari "blinds-transition" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Transisi layar A -> B seperti tirai jendela yang menutup bilah demi bilah.
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
  items: ["Sebelum refactor"],
  title: "*Sesudah* refactor",
  subtitle: "Lebih rapi, lebih mudah dibaca",
};

const BLINDS = 8;

export default function BlindsTransition(props: TemplateProps) {
  const { items, title, subtitle, accent } = useTemplate(props, defaults);
  const p = useTransitionProgress();
  const slot = 100 / BLINDS;

  return (
    <>
      <TitleCard title={title} subtitle={subtitle} accent={accent} />
      {p < 1
        ? Array.from({ length: BLINDS }).map((_, i) => {
            // Bilah kiri menutup lebih dulu.
            const local = interpolate(
              p,
              [i * 0.06, i * 0.06 + 0.58],
              [0, 1],
              clamp,
            );
            const left = i * slot;
            const right = 100 - (i + 1) * slot + local * slot;
            return (
              <TitleCard
                key={i}
                title={items[0]}
                accent={accent}
                background={`linear-gradient(160deg, ${colors.bgFrom}, ${colors.bgTo})`}
                style={{ clipPath: `inset(0 ${right}% 0 ${left}%)` }}
              />
            );
          })
        : null}
    </>
  );
}
