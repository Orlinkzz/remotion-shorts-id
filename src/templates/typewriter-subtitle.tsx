// Diadaptasi dari "typewriter-subtitle" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Kalimat diketik huruf demi huruf (selesai di ~60% scene) dengan kursor berkedip.
// Props: text (kalimat yang diketik), title (opsional, label kecil di atas), accent.
import { interpolate, spring } from "remotion";
import {
  clamp,
  colors,
  contentArea,
  fitFontSize,
  monoFont,
  sansFont,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  text: "Jangan pernah push langsung ke main...",
};

export default function TypewriterSubtitle(props: TemplateProps) {
  const { title, text, accent, frame, fps, durationInFrames } = useTemplate(
    props,
    defaults,
  );
  const chars = [...text];
  const end = Math.max(fps * 0.5, durationInFrames * 0.6);
  const visible = Math.floor(
    interpolate(frame, [fps * 0.2, end], [0, chars.length], clamp),
  );
  const cursorOn = Math.floor(frame / 15) % 2 === 0 || visible < chars.length;
  const titleIn = spring({ frame, fps, config: { damping: 100 } });
  const fontSize = fitFontSize(text, 80, 44, 22);

  return (
    <div
      style={{
        ...contentArea,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 32,
      }}
    >
      {title ? (
        <div
          style={{
            fontFamily: sansFont,
            fontSize: 44,
            fontWeight: 800,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: accent,
            opacity: titleIn,
          }}
        >
          {title}
        </div>
      ) : null}
      <div
        style={{
          fontFamily: monoFont,
          fontSize,
          fontWeight: 700,
          lineHeight: 1.35,
          color: colors.text,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {chars.slice(0, visible).join("")}
        <span style={{ color: accent, opacity: cursorOn ? 1 : 0 }}>▌</span>
      </div>
    </div>
  );
}
