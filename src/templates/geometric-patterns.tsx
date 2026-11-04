// Diadaptasi dari "geometric-patterns" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Bingkai geometris berlapis yang berputar dan membesar di belakang judul.
// Props: title, subtitle, accent.
import { spring } from "remotion";
import {
  TitleCard,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  title: "Pola *berulang*",
  subtitle: "Kenali, lalu jadikan fungsi",
};

const LAYERS = 16;

export default function GeometricPatterns(props: TemplateProps) {
  const { title, subtitle, accent, frame, fps, durationInFrames } = useTemplate(
    props,
    defaults,
  );
  // Rotasi lambat terus-menerus setelah masuk, satu putaran tiap scene.
  const drift = (frame / durationInFrames) * 90;

  return (
    <>
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        {Array.from({ length: LAYERS }).map((_, i) => {
          const enter = spring({
            frame: frame - i * 2,
            fps,
            config: { damping: 100 },
          });
          const size = 360 + i * 110;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: "50%",
                top: "45%",
                width: size,
                height: size,
                border: `3px solid ${i % 3 === 0 ? accent : "rgba(255,255,255,0.12)"}`,
                borderRadius: `${(i * 6) % 50}%`,
                opacity: (i % 3 === 0 ? 0.45 : 1) * enter,
                transform: `translate(-50%, -50%) rotate(${enter * 180 + drift * (i % 2 ? 1 : -1)}deg) scale(${0.5 + 0.5 * enter})`,
              }}
            />
          );
        })}
      </div>
      <TitleCard title={title} subtitle={subtitle} accent={accent} />
    </>
  );
}
