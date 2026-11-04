// Diadaptasi dari "bokeh-circles" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Lingkaran bokeh lembut melayang di belakang judul.
// Props: title, subtitle, accent.
import {
  palette,
  TitleCard,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  title: "Fokus ke *satu hal*",
  subtitle: "Sisanya biar jadi latar",
};

const COUNT = 22;

export default function BokehCircles(props: TemplateProps) {
  const { title, subtitle, accent, frame, durationInFrames, width, height } =
    useTemplate(props, defaults);
  const colorsList = palette(accent).slice(0, 3);
  // Satu putaran penuh sepanjang scene supaya geraknya mulus.
  const t = (frame / durationInFrames) * Math.PI * 2;

  return (
    <>
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        {Array.from({ length: COUNT }).map((_, i) => {
          const baseX = ((i * 173 + 53) % 100) / 100;
          const baseY = ((i * 241 + 97) % 100) / 100;
          const x = baseX * width + Math.sin(t + i * 1.3) * 60;
          const y = baseY * height + Math.cos(t + i * 0.9) * 80;
          const size =
            (120 + ((i * 37 + 11) % 200)) *
            (1 + 0.2 * Math.sin(t * 2 + i * 0.7));
          const opacity = 0.25 + ((i * 19 + 7) % 25) / 100;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: size,
                height: size,
                borderRadius: "50%",
                transform: "translate(-50%, -50%)",
                opacity,
                background: `radial-gradient(circle, ${colorsList[i % 3]} 0%, transparent 70%)`,
              }}
            />
          );
        })}
      </div>
      <TitleCard title={title} subtitle={subtitle} accent={accent} />
    </>
  );
}
