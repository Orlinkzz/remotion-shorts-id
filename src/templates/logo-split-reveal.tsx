// Diadaptasi dari "logo-split-reveal" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Dua panel terbelah ke kiri-kanan dan membuka logo/nama brand.
// Props: title (nama brand), subtitle (tagline), images[0] (logo, opsional), accent.
import { interpolate, spring } from "remotion";
import {
  clamp,
  colors,
  contentArea,
  Emphasis,
  fitFontSize,
  plain,
  sansFont,
  TemplateImage,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  title: "Senimankode",
  subtitle: "Belajar coding lewat video pendek",
};

export default function LogoSplitReveal(props: TemplateProps) {
  const { title, subtitle, images, accent, frame, fps } = useTemplate(
    props,
    defaults,
  );

  const open = spring({
    frame: frame - 8,
    fps,
    config: { damping: 18, stiffness: 90 },
  });
  const subIn = interpolate(frame, [fps * 1, fps * 1.5], [0, 1], clamp);
  const logo = images?.[0];

  const panel = (side: "left" | "right"): React.CSSProperties => ({
    position: "absolute",
    top: 0,
    bottom: 0,
    width: "50%",
    [side]: 0,
    background:
      side === "left"
        ? `linear-gradient(135deg, ${accent}, ${colors.accent2})`
        : `linear-gradient(135deg, ${colors.accent2}, ${accent})`,
    borderRadius: side === "left" ? "36px 0 0 36px" : "0 36px 36px 0",
    transform: `translateX(${(side === "left" ? -1 : 1) * open * 110}%)`,
    opacity: 1 - open * 0.9,
  });

  return (
    <div
      style={{
        ...contentArea,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 48,
        fontFamily: sansFont,
        textAlign: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          minHeight: 280,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 32px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 32,
            opacity: open,
            transform: `scale(${0.85 + 0.15 * open})`,
          }}
        >
          {logo ? (
            <div
              style={{
                width: 260,
                height: 260,
                borderRadius: 48,
                overflow: "hidden",
              }}
            >
              <TemplateImage src={logo} style={{ objectFit: "contain" }} />
            </div>
          ) : null}
          <div
            style={{
              fontSize: fitFontSize(plain(title), 140, 72, 10),
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: -2,
              color: colors.text,
            }}
          >
            <Emphasis text={title} color={accent} />
          </div>
        </div>
        <div style={panel("left")} />
        <div style={panel("right")} />
      </div>
      <div
        style={{
          fontSize: 48,
          fontWeight: 600,
          lineHeight: 1.3,
          color: colors.muted,
          opacity: subIn,
          transform: `translateY(${(1 - subIn) * 20}px)`,
        }}
      >
        {subtitle}
      </div>
    </div>
  );
}
