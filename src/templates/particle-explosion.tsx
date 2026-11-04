// Diadaptasi dari "particle-explosion" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Ledakan partikel di awal scene di belakang judul, lalu partikel melayang pelan.
// Props: title, subtitle, accent.
import { interpolate, random, spring } from "remotion";
import {
  clamp,
  palette,
  TitleCard,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  title: "*Boom!* Bug-nya hilang",
  subtitle: "Cuma dengan satu perbaikan",
};

const COUNT = 120;

export default function ParticleExplosion(props: TemplateProps) {
  const { title, subtitle, accent, frame, fps, height } = useTemplate(
    props,
    defaults,
  );
  const colorsList = palette(accent);
  const titlePop = spring({ frame: frame - 4, fps, config: { damping: 10 } });
  const settle = interpolate(frame, [fps * 0.8, fps * 2], [1, 0.35], clamp);
  const burst = spring({ frame, fps, config: { mass: 0.4, damping: 10 } });

  return (
    <>
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        {Array.from({ length: COUNT }).map((_, i) => {
          const angle = (i / COUNT) * Math.PI * 2 + random(`a-${i}`) * 0.3;
          const distance = burst * (220 + random(`d-${i}`) * 420) + frame * 0.6;
          const size = 8 + random(`s-${i}`) * 18;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: "50%",
                top: height * 0.45,
                width: size,
                height: size,
                borderRadius: "50%",
                backgroundColor: colorsList[i % 4],
                boxShadow: `0 0 10px ${colorsList[i % 4]}`,
                opacity: settle * (0.5 + random(`o-${i}`) * 0.5),
                transform: `translate(-50%, -50%) translate(${Math.cos(angle + frame * 0.004) * distance}px, ${Math.sin(angle + frame * 0.004) * distance}px)`,
              }}
            />
          );
        })}
      </div>
      <TitleCard
        title={title}
        subtitle={subtitle}
        accent={accent}
        style={{ transform: `scale(${titlePop})` }}
      />
    </>
  );
}
