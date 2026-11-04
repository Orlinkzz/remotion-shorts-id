// Diadaptasi dari "logo-fade-reveal" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Logo memudar masuk sambil membesar halus, disusul nama brand dan tagline.
// Props: title (nama brand), subtitle (tagline), images[0] (opsional, gambar logo), accent.
import { spring } from "remotion";
import {
  colors,
  contentArea,
  fitFontSize,
  plain,
  sansFont,
  TemplateImage,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  title: "Senimankode",
  subtitle: "Belajar coding, satu menit sehari",
};

const initials = (name: string) =>
  plain(name)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("") || "?";

const LogoMark: React.FC<{
  title: string;
  image?: string;
  accent: string;
  size?: number;
}> = ({ title, image, accent, size = 320 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.22,
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: image
        ? "transparent"
        : `linear-gradient(135deg, ${accent}, ${colors.accent2})`,
      boxShadow: image ? undefined : `0 20px 60px ${accent}55`,
    }}
  >
    {image ? (
      <TemplateImage src={image} style={{ objectFit: "contain" }} />
    ) : (
      <span
        style={{
          fontSize: size * 0.42,
          fontWeight: 900,
          color: "white",
          letterSpacing: -4,
        }}
      >
        {initials(title)}
      </span>
    )}
  </div>
);

export default function LogoFadeReveal(props: TemplateProps) {
  const { title, subtitle, images, accent, frame, fps } = useTemplate(
    props,
    defaults,
  );
  const logo = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 80, mass: 0.8 },
  });
  const text = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 14, stiffness: 60, mass: 0.6 },
  });
  const tag = spring({
    frame: Math.max(0, frame - 24),
    fps,
    config: { damping: 14, stiffness: 60, mass: 0.6 },
  });

  return (
    <div
      style={{
        ...contentArea,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        fontFamily: sansFont,
      }}
    >
      <div style={{ opacity: logo, transform: `scale(${0.8 + 0.2 * logo})` }}>
        <LogoMark title={title} image={images?.[0]} accent={accent} />
      </div>
      <div
        style={{
          marginTop: 56,
          fontSize: fitFontSize(plain(title), 120, 64, 11),
          fontWeight: 900,
          color: colors.text,
          letterSpacing: -2,
          opacity: text,
          transform: `translateY(${20 * (1 - text)}px)`,
        }}
      >
        {plain(title)}
      </div>
      <div
        style={{
          marginTop: 20,
          fontSize: 46,
          fontWeight: 600,
          color: colors.muted,
          opacity: tag,
          transform: `translateY(${20 * (1 - tag)}px)`,
        }}
      >
        {subtitle}
      </div>
    </div>
  );
}
