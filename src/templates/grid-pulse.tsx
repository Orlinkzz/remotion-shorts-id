// Diadaptasi dari "grid-pulse" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Grid titik dengan gelombang denyut yang menyebar dari tengah, di belakang judul.
// Props: title, subtitle, accent.
import {
  TitleCard,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  title: "Sinyal *menyebar*",
  subtitle: "Satu perubahan, efeknya ke mana-mana",
};

const COLS = 9;
const ROWS = 16;
const DOT = 18;

export default function GridPulse(props: TemplateProps) {
  const { title, subtitle, accent, frame, durationInFrames, width, height } =
    useTemplate(props, defaults);
  // Jumlah denyut bulat per scene supaya ujung dan awal menyambung.
  const pulses = Math.max(1, Math.round(durationInFrames / 45));
  const t = (frame / durationInFrames) * Math.PI * 2 * pulses;
  const spacingX = width / (COLS + 1);
  const spacingY = height / (ROWS + 1);
  const cx = (COLS - 1) / 2;
  const cy = (ROWS - 1) / 2;

  return (
    <>
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        {Array.from({ length: ROWS * COLS }).map((_, k) => {
          const row = Math.floor(k / COLS);
          const col = k % COLS;
          const distance = Math.hypot(col - cx, (row - cy) * 0.75);
          const wave = Math.sin(t - distance * 0.8) * 0.5 + 0.5;
          return (
            <div
              key={k}
              style={{
                position: "absolute",
                left: spacingX * (col + 1),
                top: spacingY * (row + 1),
                width: DOT,
                height: DOT,
                borderRadius: "50%",
                backgroundColor: accent,
                opacity: 0.08 + wave * 0.5,
                transform: `translate(-50%, -50%) scale(${0.4 + wave * 0.8})`,
              }}
            />
          );
        })}
      </div>
      <TitleCard title={title} subtitle={subtitle} accent={accent} />
    </>
  );
}
