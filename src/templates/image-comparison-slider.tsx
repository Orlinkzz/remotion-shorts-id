// Diadaptasi dari "image-comparison-slider" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Perbandingan sebelum/sesudah: garis pembatas menyapu gambar lalu berhenti di tengah.
// Props: images[0] (sebelum), images[1] (sesudah), items[0..1] (label), title (opsional), accent.
import { Easing, interpolate, spring } from "remotion";
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
  items: ["Sebelum", "Sesudah"],
};

const Label: React.FC<{
  text: string;
  side: "left" | "right";
  color: string;
}> = ({ text, side, color }) => (
  <div
    style={{
      position: "absolute",
      top: 28,
      [side]: 28,
      padding: "12px 26px",
      borderRadius: 999,
      background: "rgba(0,0,0,0.6)",
      border: `2px solid ${color}`,
      color: colors.text,
      fontSize: 40,
      fontWeight: 800,
    }}
  >
    {text}
  </div>
);

export default function ImageComparisonSlider(props: TemplateProps) {
  const { title, items, images, accent, frame, fps, durationInFrames } =
    useTemplate(props, defaults);

  const d = durationInFrames;
  const divider = interpolate(
    frame,
    [d * 0.1, d * 0.45, d * 0.7],
    [96, 4, 50],
    { ...clamp, easing: Easing.inOut(Easing.cubic) },
  );
  const enter = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div
      style={{
        ...contentArea,
        display: "flex",
        flexDirection: "column",
        gap: 40,
        fontFamily: sansFont,
      }}
    >
      {title ? (
        <TemplateTitle
          text={title}
          accent={accent}
          max={80}
          style={{ textAlign: "center" }}
        />
      ) : null}
      <div
        style={{
          position: "relative",
          flex: 1,
          borderRadius: 36,
          overflow: "hidden",
          border: `2px solid ${colors.surfaceAlt}`,
          boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
          opacity: enter,
          transform: `scale(${0.92 + 0.08 * enter})`,
        }}
      >
        <div style={{ position: "absolute", inset: 0 }}>
          <TemplateImage src={images?.[1]} index={1} label={items[1] ?? ""} />
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            clipPath: `inset(0 ${100 - divider}% 0 0)`,
          }}
        >
          <TemplateImage
            src={images?.[0]}
            index={3}
            label={items[0] ?? ""}
            style={images?.[0] ? undefined : { filter: "grayscale(0.8)" }}
          />
        </div>
        {items[0] ? (
          <Label text={items[0]} side="left" color={colors.muted} />
        ) : null}
        {items[1] ? (
          <Label text={items[1]} side="right" color={accent} />
        ) : null}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${divider}%`,
            width: 6,
            marginLeft: -3,
            background: colors.text,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 72,
              height: 72,
              marginLeft: -36,
              marginTop: -36,
              borderRadius: "50%",
              background: colors.text,
              border: `6px solid ${accent}`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
