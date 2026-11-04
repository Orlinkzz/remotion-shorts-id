// Diadaptasi dari "quote-card" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Kartu kutipan: tanda kutip besar, kutipan miring, lalu nama penulisnya.
// Props: text (kutipan), subtitle (penulis/sumber), accent.
import { interpolate, spring } from "remotion";
import {
  clamp,
  colors,
  contentArea,
  fitFontSize,
  sansFont,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  text: "Program harus ditulis agar dibaca manusia, dan hanya kebetulan bisa dijalankan mesin.",
  subtitle: "Harold Abelson",
};

export default function QuoteCard(props: TemplateProps) {
  const { text, subtitle, accent, frame, fps } = useTemplate(props, defaults);
  const markIn = spring({ frame, fps, config: { damping: 12 } });
  const textIn = interpolate(frame, [10, 30], [0, 1], clamp);
  const byIn = interpolate(frame, [30, 45], [0, 1], clamp);

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
          width: "100%",
          padding: "64px 56px",
          borderRadius: 40,
          background: "rgba(17, 24, 39, 0.72)",
          border: `2px solid ${colors.surfaceAlt}`,
          boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 220,
            fontWeight: 700,
            lineHeight: 0.8,
            height: 130,
            color: accent,
            opacity: markIn,
            transform: `scale(${markIn})`,
          }}
        >
          {"“"}
        </div>
        <div
          style={{
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            fontSize: fitFontSize(text, 72, 44, 40),
            lineHeight: 1.4,
            color: colors.text,
            opacity: textIn,
            transform: `translateY(${(1 - textIn) * 20}px)`,
          }}
        >
          {text}
        </div>
        {subtitle ? (
          <div
            style={{
              marginTop: 48,
              fontSize: 44,
              fontWeight: 700,
              color: colors.muted,
              opacity: byIn,
              transform: `translateX(${(1 - byIn) * 40}px)`,
            }}
          >
            — {subtitle}
          </div>
        ) : null}
      </div>
    </div>
  );
}
