// Diadaptasi dari "logo-typewriter" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Ikon muncul memantul, lalu nama brand diketik huruf demi huruf dengan kursor.
// Props: title (nama brand, diketik), subtitle (tagline), images[0] (ikon, opsional), accent.
import { interpolate, spring } from "remotion";
import {
  clamp,
  colors,
  contentArea,
  fitFontSize,
  monoFont,
  plain,
  sansFont,
  TemplateImage,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  title: "senimankode",
  subtitle: 'console.log("halo dunia")',
};

export default function LogoTypewriter(props: TemplateProps) {
  const { title, subtitle, images, accent, frame, fps } = useTemplate(
    props,
    defaults,
  );
  const text = plain(title);

  const iconScale = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 150, mass: 0.6 },
  });

  // Mengetik selesai dalam ~1,2 dtk berapa pun panjang teksnya.
  const typeStart = Math.round(fps * 0.4);
  const typeLength = Math.max(1, Math.round(fps * 1.2));
  const chars = Math.floor(
    interpolate(
      frame,
      [typeStart, typeStart + typeLength],
      [0, text.length],
      clamp,
    ),
  );
  const done = chars >= text.length;
  const cursorOn = !done || Math.floor(frame / (fps / 2)) % 2 === 0;
  const subIn = interpolate(
    frame,
    [typeStart + typeLength, typeStart + typeLength + fps * 0.4],
    [0, 1],
    clamp,
  );
  const fontSize = fitFontSize(text, 110, 60, 11);

  return (
    <div
      style={{
        ...contentArea,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 48,
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 220,
          height: 220,
          borderRadius: "50%",
          overflow: "hidden",
          background: `linear-gradient(135deg, ${accent}, ${colors.accent2})`,
          transform: `scale(${iconScale})`,
          boxShadow: `0 20px 60px ${accent}55`,
        }}
      >
        {images?.[0] ? <TemplateImage src={images[0]} /> : null}
      </div>
      <div
        style={{
          fontFamily: monoFont,
          fontSize,
          fontWeight: 700,
          color: colors.text,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          lineHeight: 1.1,
        }}
      >
        {text.slice(0, chars)}
        <span style={{ color: accent, opacity: cursorOn ? 1 : 0 }}>|</span>
      </div>
      <div
        style={{
          fontFamily: sansFont,
          fontSize: 44,
          fontWeight: 600,
          color: colors.muted,
          opacity: subIn,
        }}
      >
        {subtitle}
      </div>
    </div>
  );
}
