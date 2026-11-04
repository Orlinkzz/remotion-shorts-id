// Diadaptasi dari "push-transition" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Transisi layar A -> B: B mendorong A keluar ke atas (cocok untuk layar vertikal).
// Props: items[0] = teks layar A, title + subtitle = layar B, accent.
import {
  colors,
  TitleCard,
  useTemplate,
  useTransitionProgress,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  items: ["Langkah 1: install"],
  title: "Langkah 2: *konfigurasi*",
  subtitle: "Atur file .env dulu",
};

export default function PushTransition(props: TemplateProps) {
  const { items, title, subtitle, accent } = useTemplate(props, defaults);
  const p = useTransitionProgress();

  return (
    <>
      <TitleCard
        title={title}
        subtitle={subtitle}
        accent={accent}
        style={{ transform: `translateY(${(1 - p) * 100}%)` }}
      />
      {p < 1 ? (
        <TitleCard
          title={items[0]}
          accent={accent}
          background={`linear-gradient(160deg, ${colors.bgFrom}, ${colors.bgTo})`}
          style={{ transform: `translateY(${-p * 100}%)` }}
        />
      ) : null}
    </>
  );
}
