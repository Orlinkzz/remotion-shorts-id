// Diadaptasi dari "matrix-rain" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Hujan karakter kode ala Matrix di belakang judul.
// Props: title, subtitle, accent.
import { random } from "remotion";
import {
  monoFont,
  TitleCard,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  title: "Masuk ke *kodenya*",
  subtitle: "Kita bedah baris demi baris",
};

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789{}[]()<>=+-*/;$#@&";
const FONT = 36;
const TRAIL = 12;

export default function MatrixRain(props: TemplateProps) {
  const { title, subtitle, accent, frame, width, height } = useTemplate(
    props,
    defaults,
  );
  const columns = Math.ceil(width / FONT);
  const span = height + TRAIL * FONT;

  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          fontFamily: monoFont,
          fontSize: FONT,
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        {Array.from({ length: columns }).map((_, c) => {
          const speed = 6 + random(`speed-${c}`) * 10;
          const head = (random(`start-${c}`) * span + frame * speed) % span;
          return Array.from({ length: TRAIL }).map((__, k) => {
            const y = head - k * FONT;
            if (y < -FONT || y > height) return null;
            const idx = Math.floor(
              random(`ch-${c}-${k}-${Math.floor(frame / 4)}`) * CHARS.length,
            );
            return (
              <div
                key={`${c}-${k}`}
                style={{
                  position: "absolute",
                  left: c * FONT,
                  top: y,
                  width: FONT,
                  textAlign: "center",
                  color: k === 0 ? "#FFFFFF" : accent,
                  opacity: (1 - k / TRAIL) * 0.55,
                  textShadow: k === 0 ? `0 0 12px ${accent}` : undefined,
                }}
              >
                {CHARS[idx]}
              </div>
            );
          });
        })}
      </div>
      <TitleCard
        title={title}
        subtitle={subtitle}
        accent={accent}
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(8,11,26,0.85) 0%, rgba(8,11,26,0) 60%)",
        }}
      />
    </>
  );
}
