// Diadaptasi dari "cross-dissolve" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Transisi layar A -> B dengan saling melebur (crossfade).
// Props: items[0] = teks layar A, title + subtitle = layar B, accent.
import {
  colors,
  TitleCard,
  useTemplate,
  useTransitionProgress,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  items: ["Kode sinkron"],
  title: "Jadi *async/await*",
  subtitle: "Tanpa memblokir thread utama",
};

export default function CrossDissolve(props: TemplateProps) {
  const { items, title, subtitle, accent } = useTemplate(props, defaults);
  const p = useTransitionProgress();

  return (
    <>
      <TitleCard
        title={title}
        subtitle={subtitle}
        accent={accent}
        style={{ opacity: p }}
      />
      {p < 1 ? (
        <TitleCard
          title={items[0]}
          accent={accent}
          background={`linear-gradient(160deg, ${colors.bgFrom}, ${colors.bgTo})`}
          style={{ opacity: 1 - p }}
        />
      ) : null}
    </>
  );
}
