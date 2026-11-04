// Diadaptasi dari "title-split" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Judul dua baris yang bertemu di tengah: baris atas garis tepi, baris bawah solid.
// Props: title (baris atas), subtitle (baris bawah), text (opsional, keterangan kecil), accent.
import { interpolate, spring } from "remotion";
import {
  clamp,
  colors,
  contentArea,
  fitFontSize,
  plain,
  sansFont,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  title: "CLEAN",
  subtitle: "CODE",
  text: "Prinsip yang wajib kamu tahu",
};

export default function TitleSplit(props: TemplateProps) {
  const { title, subtitle, text, accent, frame, fps } = useTemplate(
    props,
    defaults,
  );
  const top = plain(title);
  const bottom = plain(subtitle);
  const config = { damping: 14, stiffness: 80 };
  const topIn = spring({ frame, fps, config });
  const bottomIn = spring({ frame, fps, config });
  const met = interpolate(frame, [fps * 0.6, fps * 0.9], [0, 1], clamp);
  const glow = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.3, 0.8]) * met;
  const fontSize = Math.min(
    fitFontSize(top, 160, 72, 7),
    fitFontSize(bottom, 160, 72, 7),
  );
  const line: React.CSSProperties = {
    fontSize,
    fontWeight: 900,
    lineHeight: 1.05,
    letterSpacing: "0.1em",
    textAlign: "center",
    textShadow: `0 0 ${30 * glow}px ${accent}`,
  };
  const textIn = interpolate(frame, [fps * 0.9, fps * 1.4], [0, 1], clamp);

  return (
    <div
      style={{
        ...contentArea,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
        overflow: "hidden",
        fontFamily: sansFont,
      }}
    >
      <div
        style={{
          ...line,
          color: "transparent",
          WebkitTextStroke: `3px ${colors.text}`,
          transform: `translateY(${(1 - topIn) * -400}px)`,
        }}
      >
        {top}
      </div>
      <div
        style={{
          ...line,
          color: accent,
          transform: `translateY(${(1 - bottomIn) * 400}px)`,
        }}
      >
        {bottom}
      </div>
      {text ? (
        <div
          style={{
            marginTop: 40,
            fontSize: 44,
            fontWeight: 600,
            textAlign: "center",
            color: colors.muted,
            opacity: textIn,
          }}
        >
          {text}
        </div>
      ) : null}
    </div>
  );
}
