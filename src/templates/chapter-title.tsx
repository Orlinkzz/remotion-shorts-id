// Diadaptasi dari "chapter-title" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Pembatas bab: label "BAGIAN", nomor besar, garis ornamen, lalu judul bab.
// Props: value (nomor bab, opsional), title (judul bab), subtitle (label di atas nomor, default "Bagian"), accent.
import { interpolate, spring } from "remotion";
import {
  clamp,
  colors,
  contentArea,
  formatNumber,
  sansFont,
  TemplateTitle,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  value: 1,
  title: "Dasar *Async/Await*",
  subtitle: "Bagian",
};

export default function ChapterTitle(props: TemplateProps) {
  const { value, title, subtitle, accent, frame, fps } = useTemplate(
    props,
    defaults,
  );
  const numberScale = spring({
    frame,
    fps,
    from: 0.5,
    to: 1,
    config: { damping: 12, stiffness: 80 },
  });
  const labelIn = interpolate(frame, [5, 20], [0, 1], clamp);
  const line = interpolate(frame, [10, 40], [0, 1], clamp);
  const titleIn = interpolate(frame, [20, 40], [0, 1], clamp);

  return (
    <div
      style={{
        ...contentArea,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        fontFamily: sansFont,
      }}
    >
      <div
        style={{
          fontSize: 44,
          fontWeight: 600,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: colors.muted,
          opacity: labelIn,
        }}
      >
        {subtitle}
      </div>
      <div
        style={{
          fontSize: 300,
          fontWeight: 900,
          lineHeight: 1,
          color: colors.text,
          transform: `scale(${numberScale})`,
          opacity: Math.min(1, numberScale),
        }}
      >
        {formatNumber(value)}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          margin: "40px 0",
        }}
      >
        <div style={{ height: 3, width: 220 * line, background: accent }} />
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: accent,
            opacity: labelIn,
          }}
        />
        <div style={{ height: 3, width: 220 * line, background: accent }} />
      </div>
      <div
        style={{
          opacity: titleIn,
          transform: `translateY(${(1 - titleIn) * 24}px)`,
        }}
      >
        <TemplateTitle text={title} accent={accent} max={96} />
      </div>
    </div>
  );
}
