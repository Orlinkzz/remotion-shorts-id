// Diadaptasi dari "logo-blur-reveal" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Logo muncul dari blur menjadi tajam, lalu nama brand dan tagline naik masuk.
// Props: title (nama brand), subtitle (tagline), images[0] (opsional, gambar logo), accent.
import { interpolate, spring } from "remotion";
import {
  clamp,
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

export default function LogoBlurReveal(props: TemplateProps) {
  const { title, subtitle, images, accent, frame, fps } = useTemplate(
    props,
    defaults,
  );
  const blur = interpolate(frame, [0, fps * 1.2], [30, 0], clamp);
  const opacity = interpolate(frame, [0, fps * 1.2], [0.2, 1], clamp);
  const scale = interpolate(frame, [0, fps * 1.2], [1.15, 1], clamp);
  const name = spring({
    frame: frame - Math.round(fps * 1),
    fps,
    config: { damping: 12, stiffness: 100 },
  });
  const tag = spring({
    frame: frame - Math.round(fps * 1.3),
    fps,
    config: { damping: 14 },
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
      <div
        style={{
          filter: `blur(${blur}px)`,
          opacity,
          transform: `scale(${scale})`,
        }}
      >
        <LogoMark title={title} image={images?.[0]} accent={accent} />
      </div>
      <div
        style={{
          marginTop: 56,
          fontSize: fitFontSize(plain(title), 120, 64, 11),
          fontWeight: 900,
          color: colors.text,
          letterSpacing: -2,
          opacity: name,
          transform: `translateY(${(1 - name) * 30}px)`,
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
          transform: `translateY(${(1 - tag) * 20}px)`,
        }}
      >
        {subtitle}
      </div>
    </div>
  );
}
