// Diadaptasi dari "vignette-pulse" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Vinyet gelap di tepi yang berdenyut, memusatkan perhatian ke gambar atau judul.
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
  title: "Fokus *di sini*",
  subtitle: "Baris ini yang bikin lambat",
};

export default function VignettePulse(props: TemplateProps) {
  const { title, subtitle, images, accent, frame, fps } = useTemplate(
    props,
    defaults,
  );
  const fadeIn = interpolate(frame, [0, fps * 0.6], [0, 1], clamp);
  const strength =
    (0.55 + 0.25 * Math.sin((frame / fps) * Math.PI * 2)) * fadeIn;
  const image = images?.[0];

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {image ? (
        <>
          <TemplateImage src={image} />
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
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 50% 42%, transparent 35%, rgba(0, 0, 0, ${strength}) 100%)`,
        }}
      />
    </div>
  );
}
