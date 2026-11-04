// Diadaptasi dari "logo-scale-rotate" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Logo membesar dari nol sambil berputar satu kali, lalu berdenyut dengan glow; nama brand naik.
// Props: title (nama brand), subtitle (tagline), images[0] (opsional, gambar logo), accent.
import { interpolate, spring } from "remotion";
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
  glow: number;
  size?: number;
}> = ({ title, image, accent, glow, size = 320 }) => (
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
      boxShadow: image ? undefined : `0 0 ${glow}px ${accent}cc`,
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

export default function LogoScaleRotate(props: TemplateProps) {
  const { title, subtitle, images, accent, frame, fps } = useTemplate(
    props,
    defaults,
  );
  const entrance = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 100, mass: 0.8 },
  });
  const rotation = interpolate(entrance, [0, 1], [0, 360]);
  const glow = frame > 20 ? 40 + Math.sin(frame * 0.15) * 20 : 0;
  const name = spring({
    frame: Math.max(0, frame - 20),
    fps,
    config: { damping: 12, stiffness: 100 },
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
      <div style={{ transform: `scale(${entrance}) rotate(${rotation}deg)` }}>
        <LogoMark
          title={title}
          image={images?.[0]}
          accent={accent}
          glow={glow}
        />
      </div>
      <div
        style={{
          marginTop: 64,
          fontSize: fitFontSize(plain(title), 120, 64, 11),
          fontWeight: 900,
          color: colors.text,
          letterSpacing: -2,
          opacity: name,
          transform: `translateY(${30 * (1 - name)}px)`,
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
          opacity: name,
        }}
      >
        {subtitle}
      </div>
    </div>
  );
}
