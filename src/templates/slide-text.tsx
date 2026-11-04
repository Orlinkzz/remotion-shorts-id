// Diadaptasi dari "slide-text" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Judul meluncur masuk dari kanan, subjudul menyusul dari kiri.
// Props: title (judul, *kata* = aksen), subtitle (opsional), accent.
import { spring } from "remotion";
import {
  colors,
  contentArea,
  sansFont,
  TemplateTitle,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  title: "Belajar *TypeScript*",
  subtitle: "Dalam 60 detik",
};

export default function SlideText(props: TemplateProps) {
  const { title, subtitle, accent, frame, fps } = useTemplate(props, defaults);
  const slide = spring({ frame, fps, config: { damping: 12, mass: 0.5 } });
  const subSlide = spring({
    frame: frame - 10,
    fps,
    config: { damping: 12, mass: 0.5 },
  });

  return (
    <div
      style={{
        ...contentArea,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        gap: 32,
        fontFamily: sansFont,
      }}
    >
      <div
        style={{
          opacity: Math.min(1, slide),
          transform: `translateX(${(1 - slide) * 300}px)`,
        }}
      >
        <TemplateTitle text={title} accent={accent} max={130} />
      </div>
      {subtitle ? (
        <div
          style={{
            fontSize: 52,
            fontWeight: 600,
            color: colors.muted,
            opacity: Math.min(1, subSlide),
            transform: `translateX(${(1 - subSlide) * -300}px)`,
          }}
        >
          {subtitle}
        </div>
      ) : null}
    </div>
  );
}
