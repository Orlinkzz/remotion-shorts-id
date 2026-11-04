// Diadaptasi dari "image-zoom-reveal" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Gambar membesar dari blur ke tajam, lalu judul muncul di atasnya.
// Props: images[0], title (judul di atas gambar), subtitle (opsional), accent.
import { Easing, interpolate } from "remotion";
import {
  clamp,
  colors,
  contentArea,
  sansFont,
  TemplateImage,
  TemplateTitle,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  title: "Hasil *akhirnya*",
};

export default function ImageZoomReveal(props: TemplateProps) {
  const { title, subtitle, images, accent, frame, fps } = useTemplate(
    props,
    defaults,
  );
  const reveal = fps * 1.3;
  const scale = interpolate(frame, [0, reveal], [1.6, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const blur = interpolate(frame, [0, reveal], [16, 0], clamp);
  const frameIn = interpolate(frame, [0, fps * 0.5], [0, 1], clamp);
  const textIn = interpolate(frame, [reveal * 0.6, reveal], [0, 1], clamp);

  return (
    <div
      style={{
        ...contentArea,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: sansFont,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: 40,
          overflow: "hidden",
          border: `3px solid ${colors.surfaceAlt}`,
          boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
          opacity: frameIn,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `scale(${scale})`,
            filter: `blur(${blur}px)`,
          }}
        >
          <TemplateImage src={images?.[0]} label="" />
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            padding: "160px 48px 56px",
            background:
              "linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,0.8))",
            opacity: textIn,
            transform: `translateY(${(1 - textIn) * 30}px)`,
          }}
        >
          <TemplateTitle text={title} accent={accent} max={92} />
          {subtitle ? (
            <div
              style={{
                marginTop: 16,
                fontSize: 44,
                fontWeight: 600,
                color: colors.muted,
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
