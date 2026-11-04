// Diadaptasi dari "film-burn" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Kebocoran cahaya oranye-kuning melintas di atas gambar atau kartu judul.
// Props: images[0] (opsional), title + subtitle (kartu judul / label di atas gambar), accent.
import { interpolate } from "remotion";
import {
  clamp,
  contentArea,
  TemplateImage,
  TemplateTitle,
  TitleCard,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  title: "Kilas *balik*",
  subtitle: "Cara lama sebelum ES6",
};

export default function FilmBurn(props: TemplateProps) {
  const { title, subtitle, images, accent, frame, fps } = useTemplate(
    props,
    defaults,
  );
  // Ledakan cahaya di awal, lalu tersisa pendar tipis sepanjang scene.
  const intensity = interpolate(
    frame,
    [0, fps * 1.2, fps * 2.5],
    [0, 0.85, 0.22],
    clamp,
  );
  const leaks = [
    {
      x: 50 + Math.sin(frame * 0.05) * 30,
      y: 50 + Math.cos(frame * 0.04) * 25,
      c: "249, 115, 22",
      a: 0.7,
      size: 60,
    },
    {
      x: 50 + Math.sin(frame * 0.07 + 2) * 25,
      y: 50 + Math.cos(frame * 0.06 + 1) * 35,
      c: "251, 191, 36",
      a: 0.5,
      size: 50,
    },
    {
      x: 50 + Math.sin(frame * 0.03 + 4) * 20,
      y: 50 + Math.cos(frame * 0.08 + 3) * 20,
      c: "255, 255, 255",
      a: 0.3,
      size: 40,
    },
  ];
  const image = images?.[0];

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {image ? (
        <>
          <TemplateImage src={image} style={{ filter: "sepia(0.25)" }} />
          <div style={{ ...contentArea, bottom: "auto" }}>
            <TemplateTitle
              text={title}
              accent={accent}
              max={92}
              style={{ textShadow: "0 4px 24px rgba(0,0,0,0.8)" }}
            />
          </div>
        </>
      ) : (
        <TitleCard title={title} subtitle={subtitle} accent={accent} />
      )}
      {leaks.map((l, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            inset: 0,
            mixBlendMode: "screen",
            background: `radial-gradient(circle at ${l.x}% ${l.y}%, rgba(${l.c}, ${intensity * l.a}), transparent ${l.size}%)`,
          }}
        />
      ))}
    </div>
  );
}
