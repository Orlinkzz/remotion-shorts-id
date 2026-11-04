// Diadaptasi dari "logo-spin-reveal" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Logo bulat berputar 3D menghadap layar, lalu nama brand dan tagline naik masuk.
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

const SIZE = 320;

const initials = (name: string) =>
  plain(name)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("") || "?";

export default function LogoSpinReveal(props: TemplateProps) {
  const { title, subtitle, images, accent, frame, fps } = useTemplate(
    props,
    defaults,
  );
  const image = images?.[0];
  const spin = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 60, mass: 1 },
  });
  const text = spring({
    frame: Math.max(0, frame - 20),
    fps,
    config: { damping: 12, stiffness: 70, mass: 0.6 },
  });
  const tag = spring({
    frame: Math.max(0, frame - 28),
    fps,
    config: { damping: 12, stiffness: 70, mass: 0.6 },
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
      <div style={{ perspective: 1600 }}>
        <div
          style={{
            width: SIZE,
            height: SIZE,
            borderRadius: "50%",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: image
              ? "transparent"
              : `linear-gradient(135deg, ${accent}, ${colors.accent2})`,
            boxShadow: image ? undefined : `0 20px 60px ${accent}55`,
            transform: `rotateY(${90 * (1 - spin)}deg)`,
            opacity: spin,
          }}
        >
          {image ? (
            <TemplateImage src={image} style={{ objectFit: "contain" }} />
          ) : (
            <span
              style={{
                fontSize: SIZE * 0.42,
                fontWeight: 900,
                color: "white",
                letterSpacing: -4,
              }}
            >
              {initials(title)}
            </span>
          )}
        </div>
      </div>
      <div
        style={{
          marginTop: 64,
          fontSize: fitFontSize(plain(title), 120, 64, 11),
          fontWeight: 900,
          color: colors.text,
          letterSpacing: -2,
          opacity: text,
          transform: `translateY(${30 * (1 - text)}px)`,
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
          transform: `translateY(${30 * (1 - tag)}px)`,
        }}
      >
        {subtitle}
      </div>
    </div>
  );
}
