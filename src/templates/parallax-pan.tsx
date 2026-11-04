// Diadaptasi dari "parallax-pan" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Foto layar penuh bergeser pelan dari kiri ke kanan; judul melayang lebih lambat (paralaks).
// Props: images[0], title (opsional), subtitle (opsional), accent.
import { Easing, interpolate } from "remotion";
import {
  clamp,
  colors,
  contentArea,
  TemplateImage,
  TemplateTitle,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

export default function ParallaxPan(props: TemplateProps) {
  const { images, title, subtitle, accent, progress, frame, fps } = useTemplate(
    props,
    {},
  );
  const p = Easing.inOut(Easing.ease)(progress);
  const titleIn = interpolate(frame, [fps * 0.3, fps * 0.9], [0, 1], clamp);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          width: "130%",
          transform: `translateX(${-23 * p}%)`,
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
              transform: `translateX(${(1 - p) * 40 - 20}px)`,
            }}
          >
            <TemplateTitle text={title} accent={accent} max={92} />
            {subtitle ? (
              <div
                style={{
                  marginTop: 20,
                  fontSize: 46,
                  fontWeight: 600,
                  color: colors.text,
                  opacity: 0.85,
                }}
              >
                {subtitle}
              </div>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
}
