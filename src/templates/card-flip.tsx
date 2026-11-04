// Diadaptasi dari "card-flip" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Kartu 3D: sisi depan berisi pertanyaan/istilah, berbalik di tengah scene ke jawabannya.
// Props: title (sisi depan), text (sisi belakang; kalau kosong pakai subtitle), accent.
import { interpolate, spring } from "remotion";
import {
  clamp,
  colors,
  contentArea,
  Emphasis,
  fitFontSize,
  plain,
  sansFont,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  title: "Apa itu *closure*?",
  subtitle: "Fungsi yang *mengingat* variabel dari scope tempat ia dibuat",
};

const faceStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
  borderRadius: 48,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  padding: "0 64px",
  fontWeight: 900,
  lineHeight: 1.15,
  color: colors.text,
  boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
};

export default function CardFlip(props: TemplateProps) {
  const { title, text, subtitle, accent, frame, fps, durationInFrames } =
    useTemplate(props, defaults);
  const back = text ?? subtitle;
  const flipAt = Math.max(
    Math.round(fps * 0.6),
    Math.round(durationInFrames * 0.4),
  );
  const enter = spring({ frame, fps, config: { damping: 14, mass: 0.6 } });
  const rotation = spring({
    frame: frame - flipAt,
    fps,
    from: 0,
    to: 180,
    config: { damping: 15, mass: 0.5 },
  });
  const tilt = interpolate(frame, [0, durationInFrames], [-4, 4], clamp);

  return (
    <div
      style={{
        ...contentArea,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective: 2400,
        fontFamily: sansFont,
      }}
    >
      <div
        style={{
          position: "relative",
          width: 820,
          height: 1040,
          transformStyle: "preserve-3d",
          transform: `scale(${0.6 + 0.4 * enter}) rotateY(${rotation + tilt}deg)`,
          opacity: Math.min(1, enter * 1.5),
        }}
      >
        <div
          style={{
            ...faceStyle,
            fontSize: fitFontSize(plain(title), 110, 64, 12),
            background: `linear-gradient(145deg, ${colors.surface}, ${colors.surfaceAlt})`,
            border: `4px solid ${accent}`,
          }}
        >
          <Emphasis text={title} color={accent} />
        </div>
        <div
          style={{
            ...faceStyle,
            fontSize: fitFontSize(plain(back), 84, 46, 24),
            fontWeight: 800,
            background: `linear-gradient(145deg, ${accent}, ${colors.accent2})`,
            color: colors.bgFrom,
            transform: "rotateY(180deg)",
          }}
        >
          <Emphasis text={back} color={colors.text} />
        </div>
      </div>
    </div>
  );
}
