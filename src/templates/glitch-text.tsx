// Diadaptasi dari "glitch-text" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Judul bergaya glitch: lapisan cyan/magenta bergeser, sesekali tersentak.
// Props: title (judul, *kata* = aksen), subtitle (opsional), accent.
import { interpolate, random, spring } from "remotion";
import {
  clamp,
  colors,
  contentArea,
  Emphasis,
  fitFontSize,
  monoFont,
  plain,
  sansFont,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  title: "ERROR *404*",
  subtitle: "Halaman yang kamu cari tidak ada",
};

export default function GlitchText(props: TemplateProps) {
  const { title, subtitle, accent, frame, fps } = useTemplate(props, defaults);
  const enter = spring({ frame, fps, config: { damping: 100 } });
  // Sentakan acak tapi deterministik: berganti tiap 3 frame.
  const bucket = Math.floor(frame / 3);
  const burst = random(`glitch-${bucket}`) > 0.8 ? 1 : 0;
  const jitter = (random(`glitch-x-${bucket}`) - 0.5) * 40 * burst;
  const offset = Math.sin(frame / 5) * 6 + jitter;
  const drift = Math.sin(frame / 10) * 8;
  const subIn = interpolate(frame, [fps * 0.6, fps * 1.1], [0, 1], clamp);

  const textStyle: React.CSSProperties = {
    fontFamily: monoFont,
    fontSize: fitFontSize(plain(title), 140, 72, 10),
    fontWeight: 700,
    lineHeight: 1.1,
    textAlign: "center",
  };

  return (
    <div
      style={{
        ...contentArea,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 40,
        opacity: enter,
      }}
    >
      <div style={{ position: "relative" }}>
        <div
          style={{
            ...textStyle,
            position: "absolute",
            inset: 0,
            color: "cyan",
            mixBlendMode: "screen",
            transform: `translate(${offset}px, ${drift}px)`,
          }}
        >
          {plain(title)}
        </div>
        <div
          style={{
            ...textStyle,
            position: "absolute",
            inset: 0,
            color: "magenta",
            mixBlendMode: "screen",
            transform: `translate(${-offset}px, ${-drift}px)`,
          }}
        >
          {plain(title)}
        </div>
        <div
          style={{
            ...textStyle,
            position: "relative",
            color: colors.text,
            opacity: 0.9,
            transform: `translateX(${jitter * 0.3}px)`,
          }}
        >
          <Emphasis text={title} color={accent} />
        </div>
      </div>
      {subtitle ? (
        <div
          style={{
            fontFamily: sansFont,
            fontSize: 46,
            fontWeight: 600,
            textAlign: "center",
            color: colors.muted,
            opacity: subIn,
          }}
        >
          {subtitle}
        </div>
      ) : null}
    </div>
  );
}
