// Diadaptasi dari "fade-through-black" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Transisi layar A -> B yang memudar ke hitam lalu muncul lagi.
// Props: items[0] = teks layar A, title + subtitle = layar B, accent.
import {
  colors,
  TitleCard,
  useTemplate,
  useTransitionProgress,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  items: ["Bagian 1 selesai"],
  title: "Bagian 2: *praktik*",
  subtitle: "Langsung ke contoh kode",
};

export default function FadeThroughBlack(props: TemplateProps) {
  const { items, title, subtitle, accent } = useTemplate(props, defaults);
  const p = useTransitionProgress();
  // 0..0,5: A menggelap, 0,5..1: hitam membuka ke B.
  const black = p < 0.5 ? p * 2 : 2 - p * 2;

  return (
    <>
      <TitleCard title={title} subtitle={subtitle} accent={accent} />
      {p < 0.5 ? (
        <TitleCard
          title={items[0]}
          accent={accent}
          background={`linear-gradient(160deg, ${colors.bgFrom}, ${colors.bgTo})`}
        />
      ) : null}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#000000",
          opacity: black,
        }}
      />
    </>
  );
}
