// Diadaptasi dari "floating-bubble-text" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Kartu judul melayang naik-turun dengan bingkai gradien yang berputar.
// Props: title (judul, *kata* = aksen), subtitle (opsional), accent.
import { spring } from "remotion";
import {
  colors,
  contentArea,
  sansFont,
  TemplateTitle,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  title: "Tips *Git*",
  subtitle: "Commit kecil, sering, dan jelas",
};

export default function FloatingBubbleText(props: TemplateProps) {
  const { title, subtitle, accent, frame, fps } = useTemplate(props, defaults);
  const float = Math.sin(frame / 30) * 20;
  const scale = spring({ frame, fps, config: { damping: 12, mass: 0.5 } });
  // Bingkai berputar penuh tiap 3 dtk (pengganti animasi CSS asli).
  const angle = (frame / (fps * 3)) * 360;

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
          padding: 6,
          borderRadius: 44,
          background: `conic-gradient(from ${angle}deg, ${accent}, ${colors.accent2}, #F472B6, ${accent})`,
          boxShadow: "0 16px 48px rgba(0,0,0,0.35)",
          transform: `translateY(${float}px) scale(${scale})`,
        }}
      >
        <div
          style={{
            borderRadius: 38,
            padding: "72px 56px",
            textAlign: "center",
            background:
              "linear-gradient(45deg, rgba(30,58,138,0.95), rgba(17,24,39,0.95))",
          }}
        >
          <TemplateTitle text={title} accent={accent} max={124} />
          {subtitle ? (
            <div
              style={{
                marginTop: 28,
                fontSize: 46,
                fontWeight: 600,
                lineHeight: 1.3,
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
