// Diadaptasi dari "logo-bounce-drop" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Logo jatuh dari atas, memantul dengan efek squash & stretch, lalu nama brand muncul.
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

export default function LogoBounceDrop(props: TemplateProps) {
  const { title, subtitle, images, accent, frame, fps } = useTemplate(
    props,
    defaults,
  );
  const drop = spring({
    frame,
    fps,
    config: { damping: 8, stiffness: 120, mass: 0.8 },
  });
  const translateY = interpolate(drop, [0, 1], [-900, 0]);
  const squash = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: { damping: 6, stiffness: 200, mass: 0.5 },
  });
  const scaleX = interpolate(squash, [0, 0.5, 1], [1.3, 1.1, 1]);
  const scaleY = interpolate(squash, [0, 0.5, 1], [0.7, 0.9, 1]);
  const shadow = interpolate(drop, [0, 1], [0.2, 1], clamp);
  const nameIn = interpolate(frame, [fps * 0.8, fps * 1.3], [0, 1], clamp);

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
          transform: `translateY(${translateY}px) scaleX(${scaleX}) scaleY(${scaleY})`,
          transformOrigin: "center bottom",
        }}
      >
        <LogoMark title={title} image={images?.[0]} accent={accent} />
      </div>
      <div
        style={{
          width: 300 * shadow,
          height: 28,
          marginTop: 20,
          borderRadius: "50%",
          background: "rgba(0,0,0,0.35)",
          filter: "blur(8px)",
        }}
      />
      <div
        style={{
          marginTop: 36,
          fontSize: fitFontSize(plain(title), 120, 64, 11),
          fontWeight: 900,
          color: colors.text,
          letterSpacing: -2,
          opacity: nameIn,
          transform: `translateY(${(1 - nameIn) * 30}px)`,
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
          opacity: nameIn,
        }}
      >
        {subtitle}
      </div>
    </div>
  );
}
