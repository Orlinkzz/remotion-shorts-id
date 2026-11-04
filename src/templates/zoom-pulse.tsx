// Diadaptasi dari "zoom-pulse" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Foto layar penuh yang berdenyut zoom masuk-keluar; judul ikut berdenyut kecil.
// Props: images[0], title (opsional), value (detik per denyut, default 2), accent.
import { interpolate } from "remotion";
import {
  clamp,
  contentArea,
  TemplateImage,
  TemplateTitle,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

export default function ZoomPulse(props: TemplateProps) {
  const { images, title, value, accent, frame, fps } = useTemplate(props, {});
  const period = Math.max(0.5, value ?? 2) * fps;
  const wave = (1 - Math.cos(((frame % period) / period) * Math.PI * 2)) / 2;
  const titleIn = interpolate(frame, [fps * 0.3, fps * 0.9], [0, 1], clamp);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${1 + 0.1 * wave})`,
        }}
      >
        <TemplateImage src={images?.[0]} label="" />
      </div>
      {title ? (
        <>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0) 65%, rgba(0,0,0,0.55) 100%)",
            }}
          />
          <div
            style={{
              ...contentArea,
              bottom: "auto",
              opacity: titleIn,
              transform: `scale(${1 + 0.03 * wave})`,
              transformOrigin: "left top",
            }}
          >
            <TemplateTitle text={title} accent={accent} max={92} />
          </div>
        </>
      ) : null}
    </div>
  );
}
