// Diadaptasi dari "starfield" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Bintang melesat dari tengah ke tepi (efek warp) di belakang judul.
// Props: title, subtitle, accent.
import {
  TitleCard,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  title: "Skala ke *jutaan* user",
  subtitle: "Apa yang harus disiapkan?",
};

const STARS = 140;

export default function Starfield(props: TemplateProps) {
  const { title, subtitle, accent, frame, fps, width, height } = useTemplate(
    props,
    defaults,
  );
  const cx = width / 2;
  const cy = height * 0.45;
  const maxRadius = Math.hypot(cx, cy) * 1.1;
  const cycle = fps * 4;

  return (
    <>
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        {Array.from({ length: STARS }).map((_, i) => {
          const angle = ((i * 137.508) % 360) * (Math.PI / 180);
          const speed = 0.5 + ((i * 7 + 3) % 10) / 10;
          const p = ((frame * speed + i * 23) % cycle) / cycle;
          const radius = 20 + p * p * maxRadius;
          const size = (2 + ((i * 13 + 5) % 3)) * (1 + p * 2.5);
          const opacity = Math.min(p * 5, 1) * 0.85;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: cx + Math.cos(angle) * radius,
                top: cy + Math.sin(angle) * radius,
                width: size,
                height: size,
                borderRadius: "50%",
                backgroundColor: i % 5 === 0 ? accent : "#FFFFFF",
                opacity,
                transform: "translate(-50%, -50%)",
              }}
            />
          );
        })}
      </div>
      <TitleCard title={title} subtitle={subtitle} accent={accent} />
    </>
  );
}
