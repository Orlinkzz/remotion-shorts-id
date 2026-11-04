// Diadaptasi dari "polaroid-frame" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Foto polaroid jatuh dari atas, berayun, lalu diam dengan tulisan tangan di bawahnya.
// Props: images[0], title (tulisan di bingkai; items[0] dipakai kalau diisi).
import { interpolate, spring } from "remotion";
import {
  clamp,
  contentArea,
  plain,
  TemplateImage,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  title: "Commit pertama ✨",
};

export default function PolaroidFrame(props: TemplateProps) {
  const { title, items, images, frame, fps } = useTemplate(props, defaults);
  const caption = plain(items?.[0] ?? title);
  const drop = spring({ frame, fps, config: { damping: 10, stiffness: 80 } });
  const opacity = interpolate(drop, [0, 0.3], [0, 1], clamp);

  return (
    <div
      style={{
        ...contentArea,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 820,
          padding: "32px 32px 0",
          background: "#ffffff",
          borderRadius: 8,
          boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
          opacity,
          transform: `translateY(${(1 - drop) * -700}px) rotate(${interpolate(drop, [0, 1], [10, -3])}deg)`,
        }}
      >
        <div
          style={{ width: "100%", aspectRatio: "1 / 1", overflow: "hidden" }}
        >
          <TemplateImage src={images?.[0]} label="" />
        </div>
        <div
          style={{
            padding: "36px 0 44px",
            textAlign: "center",
            color: "#374151",
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            fontSize: 56,
            lineHeight: 1.2,
          }}
        >
          {caption}
        </div>
      </div>
    </div>
  );
}
