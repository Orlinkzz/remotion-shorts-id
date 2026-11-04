// Diadaptasi dari "cinematic-title-intro" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Pembuka sinematik: judul naik perlahan, garis bawah memanjang, subjudul berjarak lebar.
// Props: title (judul, *kata* = aksen), subtitle (opsional), accent.
import { interpolate, spring } from "remotion";
import {
  clamp,
  colors,
  contentArea,
  sansFont,
  TemplateTitle,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  title: "Perjalanan *Developer*",
  subtitle: "DARI NOL KE PRODUKSI",
};

export default function CinematicTitleIntro(props: TemplateProps) {
  const { title, subtitle, accent, frame, fps } = useTemplate(props, defaults);
  const rise = spring({ frame, fps, config: { damping: 14, mass: 0.8 } });
  const fade = interpolate(frame, [0, fps * 0.8], [0, 1], clamp);
  const underline = interpolate(frame, [fps * 0.6, fps * 1.4], [0, 1], {
    ...clamp,
    easing: (t) => 1 - (1 - t) ** 3,
  });
  const subIn = interpolate(frame, [fps * 1.2, fps * 1.8], [0, 1], clamp);
  // Zoom sangat pelan sepanjang scene memberi kesan sinematik.
  const drift = 1 + frame * 0.0006;

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
        transform: `scale(${drift})`,
      }}
    >
      <div
        style={{
          opacity: fade,
          transform: `translateY(${(1 - rise) * 60}px)`,
        }}
      >
        <TemplateTitle
          text={title}
          accent={accent}
          max={116}
          style={{ letterSpacing: "0.02em" }}
        />
      </div>
      <div
        style={{
          width: `${underline * 60}%`,
          height: 8,
          marginTop: 36,
          borderRadius: 4,
          background: `linear-gradient(90deg, ${accent}, ${colors.accent2})`,
        }}
      />
      {subtitle ? (
        <div
          style={{
            marginTop: 40,
            fontSize: 42,
            fontWeight: 600,
            letterSpacing: "0.18em",
            color: "rgba(248,250,252,0.8)",
            opacity: subIn,
          }}
        >
          {subtitle}
        </div>
      ) : null}
    </div>
  );
}
