// Diadaptasi dari "logo-glitch-reveal" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Logo muncul dari glitch kanal RGB yang mereda, lalu bersinar bersih dengan nama brand.
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

const SIZE = 320;

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
  background: string;
  color?: string;
}> = ({ title, image, background, color = "white" }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      borderRadius: SIZE * 0.22,
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: image ? "transparent" : background,
    }}
  >
    {image ? (
      <TemplateImage src={image} style={{ objectFit: "contain" }} />
    ) : (
      <span
        style={{
          fontSize: SIZE * 0.42,
          fontWeight: 900,
          color,
          letterSpacing: -4,
        }}
      >
        {initials(title)}
      </span>
    )}
  </div>
);

const CHANNELS = [
  { color: "rgba(239, 68, 68, 0.6)", fx: 7.3, fy: 5.1 },
  { color: "rgba(34, 197, 94, 0.6)", fx: 11.7, fy: 3.9 },
  { color: "rgba(59, 130, 246, 0.6)", fx: 9.2, fy: 6.4 },
];

export default function LogoGlitchReveal(props: TemplateProps) {
  const { title, subtitle, images, accent, frame, fps } = useTemplate(
    props,
    defaults,
  );
  const image = images?.[0];
  const decay = interpolate(frame, [0, fps], [1, 0], clamp);
  const channelOpacity = interpolate(
    frame,
    [fps * 0.65, fps * 1.15],
    [0.8, 0],
    clamp,
  );
  const clean = spring({
    frame: Math.max(0, frame - Math.round(fps * 0.8)),
    fps,
    config: { damping: 14, stiffness: 80, mass: 0.6 },
  });
  const glow = interpolate(frame, [fps * 0.7, fps * 1.3], [0, 1], clamp);
  const nameShift = Math.sin(frame * 13.1) * 24 * decay;
  const nameIn = interpolate(frame, [fps * 0.2, fps * 0.6], [0, 1], clamp);

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
      <div style={{ position: "relative", width: SIZE, height: SIZE }}>
        {CHANNELS.map((c, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              opacity: channelOpacity,
              mixBlendMode: "screen",
              transform: `translate(${Math.sin(frame * c.fx) * 40 * decay}px, ${Math.sin(frame * c.fy) * 26 * decay}px)`,
            }}
          >
            <LogoMark title={title} image={image} background={c.color} />
          </div>
        ))}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: clean,
            borderRadius: SIZE * 0.22,
            boxShadow: `0 0 ${80 * glow}px ${accent}aa`,
          }}
        >
          <LogoMark
            title={title}
            image={image}
            background={`linear-gradient(135deg, ${accent}, ${colors.accent2})`}
          />
        </div>
      </div>
      <div
        style={{
          marginTop: 64,
          fontSize: fitFontSize(plain(title), 120, 64, 11),
          fontWeight: 900,
          color: colors.text,
          letterSpacing: -2,
          opacity: nameIn,
          transform: `translateX(${nameShift}px)`,
          textShadow:
            decay > 0.05
              ? `${-6 * decay}px 0 rgba(239,68,68,0.8), ${6 * decay}px 0 rgba(59,130,246,0.8)`
              : "none",
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
          opacity: clean,
        }}
      >
        {subtitle}
      </div>
    </div>
  );
}
