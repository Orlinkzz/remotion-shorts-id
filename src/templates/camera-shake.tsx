// Diadaptasi dari "camera-shake" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Guncangan kamera yang meredam, untuk momen "boom"/kejutan pada gambar atau judul.
// Props: images[0] (opsional), title + subtitle (kartu judul / label di atas gambar), value (kekuatan px, default 24), accent.
import { interpolate } from "remotion";
import {
  clamp,
  contentArea,
  TemplateImage,
  TemplateTitle,
  TitleCard,
  theme,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  title: "*Error* di production!",
  subtitle: "Padahal di lokal aman…",
};

export default function CameraShake(props: TemplateProps) {
  const { title, subtitle, images, value, accent, frame, fps } = useTemplate(
    props,
    defaults,
  );
  // Guncangan kuat di awal lalu reda dalam ~1,5 dtk.
  const amp = interpolate(frame, [0, fps * 1.5], [value ?? 24, 0], clamp);
  const x = (Math.sin(frame * 0.8) + Math.sin(frame * 2.3) * 0.5) * amp;
  const y = (Math.cos(frame * 1.1) + Math.cos(frame * 1.9) * 0.5) * amp;
  const rot = Math.sin(frame * 0.9) * amp * 0.05;
  const image = images?.[0];

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: image ? -40 : 0,
          transform: `translate(${x}px, ${y}px) rotate(${rot}deg)`,
        }}
      >
        {image ? (
          <>
            <TemplateImage src={image} />
            <div
              style={{
                ...contentArea,
                top: theme.layout.top + 40,
                bottom: "auto",
              }}
            >
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
      </div>
    </div>
  );
}
