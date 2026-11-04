// Diadaptasi dari "bounce-text" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Kartu gradien yang membesar, judul meluncur masuk, subjudul menyusul.
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
  title: "Mulai *ngoding*",
  subtitle: "Tidak pernah ada waktu yang lebih baik",
};

export default function BounceText(props: TemplateProps) {
  const { title, subtitle, accent, frame, fps } = useTemplate(props, defaults);

  const slide = spring({ frame, fps, config: { damping: 14, stiffness: 160 } });
  const scale = spring({
    frame,
    fps,
    from: 0.6,
    to: 1,
    config: { damping: 12, stiffness: 180 },
  });
  const fade = spring({ frame, fps, config: { damping: 100 } });
  const subIn = spring({ frame: frame - 15, fps, config: { damping: 100 } });

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
          padding: "72px 56px",
          borderRadius: 40,
          overflow: "hidden",
          background: `linear-gradient(45deg, rgba(30,58,138,0.85), color-mix(in srgb, ${accent} 80%, transparent))`,
          boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
          opacity: fade,
          transform: `scale(${scale})`,
        }}
      >
        <div style={{ transform: `translateX(${(1 - slide) * -110}%)` }}>
          <TemplateTitle
            text={title}
            accent={colors.highlight}
            max={120}
            style={{ textShadow: "0 4px 8px rgba(0,0,0,0.3)" }}
          />
        </div>
        {subtitle ? (
          <div
            style={{
              marginTop: 28,
              fontSize: 48,
              fontWeight: 600,
              lineHeight: 1.25,
              color: colors.text,
              opacity: subIn,
              transform: `translateY(${(1 - subIn) * 20}px)`,
            }}
          >
            {subtitle}
          </div>
        ) : null}
      </div>
    </div>
  );
}
