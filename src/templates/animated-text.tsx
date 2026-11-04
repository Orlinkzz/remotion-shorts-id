// Diadaptasi dari "animated-text" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Judul muncul huruf demi huruf: jatuh dari atas sambil berputar.
// Props: title (judul, *kata* = aksen), subtitle (opsional, di bawah judul), accent.
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
  title: "Halo *Remotion*",
  subtitle: "Video dari kode React",
};

// Kata -> huruf, dengan tanda aksen dari *...*.
const toWords = (text: string) => {
  let on = false;
  return text.split(" ").map((word) =>
    [...word].flatMap((ch) => {
      if (ch === "*") {
        on = !on;
        return [];
      }
      return [{ ch, accent: on }];
    }),
  );
};

export default function AnimatedText(props: TemplateProps) {
  const { title, subtitle, accent, frame, fps } = useTemplate(props, defaults);
  const words = toWords(title);
  const total = plain(title).length;
  // Semua huruf sudah masuk dalam ~1,2 dtk berapa pun panjang judulnya.
  const step = Math.min(4, (fps * 1.2) / Math.max(1, total));
  const subIn = interpolate(frame, [fps * 1.1, fps * 1.6], [0, 1], clamp);
  let index = 0;

  return (
    <div
      style={{
        ...contentArea,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        gap: 36,
        fontFamily: sansFont,
      }}
    >
      <div
        style={{
          fontSize: fitFontSize(plain(title), 140, 72, 12),
          fontWeight: 900,
          lineHeight: 1.1,
          color: colors.text,
          textShadow: "0 6px 24px rgba(0,0,0,0.35)",
        }}
      >
        {words.map((word, w) => (
          <span
            key={w}
            style={{ display: "inline-block", whiteSpace: "nowrap" }}
          >
            {word.map(({ ch, accent: isAccent }) => {
              const delay = index++ * step;
              const p = spring({
                frame: frame - delay,
                fps,
                config: { mass: 0.5, damping: 11 },
              });
              return (
                <span
                  key={index}
                  style={{
                    display: "inline-block",
                    opacity: Math.min(1, p),
                    color: isAccent ? accent : undefined,
                    transform: `translateY(${(1 - p) * -60}px) rotate(${(1 - p) * -180}deg)`,
                  }}
                >
                  {ch}
                </span>
              );
            })}
            {w < words.length - 1 ? " " : null}
          </span>
        ))}
      </div>
      {subtitle ? (
        <div
          style={{
            fontSize: 50,
            fontWeight: 600,
            color: colors.muted,
            opacity: subIn,
            transform: `translateY(${(1 - subIn) * 20}px)`,
          }}
        >
          {subtitle}
        </div>
      ) : null}
    </div>
  );
}
