// Diadaptasi dari "spotlight-reveal" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Lingkaran sorot membesar dari tengah, membuka gambar atau judul dari kegelapan.
// Props: images[0] (opsional), title + subtitle (kartu judul / label di atas gambar), accent.
import { Easing, interpolate } from "remotion";
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
  title: "Fitur *baru*",
  subtitle: "Yang jarang orang tahu",
};

const CENTER = "50% 42%";

export default function SpotlightReveal(props: TemplateProps) {
  const { title, subtitle, images, accent, frame, fps, height } = useTemplate(
    props,
    defaults,
  );
  const maxRadius = height * 0.75;
  const r = interpolate(frame, [0, fps * 1.5], [0, maxRadius], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const glow = interpolate(
    frame,
    [0, fps * 0.6, fps * 1.6],
    [0, 0.8, 0],
    clamp,
  );
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
      {/* Di luar sorotan: gelap transparan, latar tetap samar terlihat */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at ${CENTER}, transparent ${r}px, rgba(3,4,10,0.9) ${r + 6}px)`,
          opacity: r >= maxRadius ? 0 : 1,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at ${CENTER}, transparent ${Math.max(0, r - 30)}px, ${accent} ${r}px, transparent ${r + 30}px)`,
          opacity: glow,
        }}
      />
    </div>
  );
}
