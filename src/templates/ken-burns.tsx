// Diadaptasi dari "ken-burns" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Foto layar penuh yang perlahan zoom dan bergeser sepanjang scene.
// Props: images[0], title (opsional, label di atas foto), accent.
import { Easing, interpolate } from "remotion";
import {
  clamp,
  contentArea,
  TemplateImage,
  TemplateTitle,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

export default function KenBurns(props: TemplateProps) {
  const { images, title, accent, progress, frame, fps } = useTemplate(
    props,
    {},
  );
  const p = Easing.out(Easing.ease)(progress);
  const titleIn = interpolate(frame, [fps * 0.3, fps * 0.9], [0, 1], clamp);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${1 + 0.35 * p}) translate(${-4 * p}%, ${-3 * p}%)`,
        }}
      >
        <TemplateImage src={images?.[0]} />
      </div>
      {title ? (
        <>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0) 65%, rgba(0,0,0,0.55) 100%)",
            }}
          />
          <div
            style={{
              ...contentArea,
              bottom: "auto",
              opacity: titleIn,
              transform: `translateY(${(1 - titleIn) * -30}px)`,
            }}
          >
            <TemplateTitle text={title} accent={accent} max={92} />
          </div>
        </>
      ) : null}
    </div>
  );
}
