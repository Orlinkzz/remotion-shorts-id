// Diadaptasi dari "picture-in-picture" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Gambar utama dengan jendela kecil (mis. wajah/webcam) yang muncul di pojok.
// Props: images[0] (utama), images[1] (jendela kecil), title (label utama), subtitle (label jendela), accent.
import { spring } from "remotion";
import {
  colors,
  contentArea,
  sansFont,
  TemplateImage,
  TemplateTitle,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  title: "Live *coding*",
  subtitle: "Kamu",
};

export default function PictureInPicture(props: TemplateProps) {
  const { title, subtitle, images, accent, frame, fps } = useTemplate(
    props,
    defaults,
  );
  const mainIn = spring({ frame, fps, config: { damping: 14 } });
  const pip = spring({
    frame: frame - Math.round(fps * 0.5),
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  return (
    <div
      style={{
        ...contentArea,
        display: "flex",
        flexDirection: "column",
        gap: 36,
        fontFamily: sansFont,
      }}
    >
      <TemplateTitle text={title} accent={accent} max={84} />
      <div
        style={{
          position: "relative",
          flex: 1,
          borderRadius: 36,
          overflow: "hidden",
          border: `2px solid ${colors.surfaceAlt}`,
          boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
          opacity: mainIn,
          transform: `scale(${0.94 + 0.06 * mainIn})`,
        }}
      >
        <TemplateImage src={images?.[0]} index={0} label="" />
        <div
          style={{
            position: "absolute",
            right: 32,
            bottom: 32,
            width: 380,
            height: 380,
            borderRadius: 32,
            overflow: "hidden",
            border: `5px solid ${accent}`,
            boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
            transform: `scale(${pip})`,
            transformOrigin: "bottom right",
          }}
        >
          <TemplateImage src={images?.[1]} index={1} label="" />
          {subtitle ? (
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                padding: "10px 0",
                background: "rgba(0,0,0,0.6)",
                color: colors.text,
                fontSize: 40,
                fontWeight: 700,
                textAlign: "center",
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
