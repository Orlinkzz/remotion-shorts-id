// Diadaptasi dari "pixel-transition" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Transisi layar A -> B: blok piksel muncul acak menutup A, lalu hilang membuka B.
// Props: items[0] = teks layar A, title + subtitle = layar B, accent.
import { random } from "remotion";
import {
  colors,
  palette,
  TitleCard,
  useTemplate,
  useTransitionProgress,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  items: ["Versi lama"],
  title: "Versi *baru*",
  subtitle: "Sudah dirender ulang",
};

const BLOCK = 90;

export default function PixelTransition(props: TemplateProps) {
  const { items, title, subtitle, accent, width, height } = useTemplate(
    props,
    defaults,
  );
  const p = useTransitionProgress((t) => t);
  const cols = Math.ceil(width / BLOCK);
  const rows = Math.ceil(height / BLOCK);
  const tones = palette(accent)
    .slice(0, 2)
    .concat([colors.bgTo, colors.surfaceAlt]);

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
      {p > 0 && p < 1
        ? Array.from({ length: cols * rows }).map((_, k) => {
            const delay = random(`pixel-${k}`) * 0.45;
            // Muncul di paruh pertama, hilang di paruh kedua (urutan acak tetap).
            const visible = p < 0.5 ? p >= delay : p - 0.5 < delay;
            if (!visible) return null;
            return (
              <div
                key={k}
                style={{
                  position: "absolute",
                  left: (k % cols) * BLOCK,
                  top: Math.floor(k / cols) * BLOCK,
                  width: BLOCK,
                  height: BLOCK,
                  backgroundColor:
                    tones[Math.floor(random(`tone-${k}`) * tones.length)],
                }}
              />
            );
          })
        : null}
    </>
  );
}
