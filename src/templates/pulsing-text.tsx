// Diadaptasi dari "pulsing-text" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Huruf judul berdenyut bergantian dengan cahaya lembut di belakangnya.
// Props: title (kata pendek), subtitle (opsional), accent.
import { interpolate, spring } from "remotion";
import {
  clamp,
  colors,
  contentArea,
  plain,
  sansFont,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  title: "LIVE",
  subtitle: "Server sedang berjalan",
};

export default function PulsingText(props: TemplateProps) {
  const { title, subtitle, accent, frame, fps } = useTemplate(props, defaults);
  const words = plain(title).split(/\s+/).filter(Boolean);
  const longest = Math.max(1, ...words.map((w) => w.length));
  const fontSize = Math.max(80, Math.min(180, Math.floor(1300 / longest)));
  const enter = spring({ frame, fps, config: { damping: 100 } });
  const subIn = interpolate(frame, [fps * 0.8, fps * 1.3], [0, 1], clamp);
  let index = 0;

  return (
    <div
      style={{
        ...contentArea,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
        fontFamily: sansFont,
        opacity: enter,
      }}
    >
      {words.map((word, w) => (
        <div key={w} style={{ display: "flex", gap: fontSize * 0.12 }}>
          {[...word].map((ch) => {
            const i = index++;
            // Siklus 1 dtk per huruf, digeser 6 frame antarhuruf.
            const t = ((((frame - i * 6) % 30) + 30) % 30) / 30;
            const pulse = interpolate(t, [0, 0.5, 1], [1, 1.2, 1]);
            const glow = interpolate(t, [0, 0.5, 1], [0.4, 1, 0.4]);
            return (
              <div
                key={i}
                style={{ position: "relative", transform: `scale(${pulse})` }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    width: fontSize,
                    height: fontSize,
                    borderRadius: "50%",
                    transform: "translate(-50%, -50%)",
                    background: accent,
                    filter: "blur(36px)",
                    opacity: glow * 0.55,
                  }}
                />
                <span
                  style={{
                    position: "relative",
                    fontSize,
                    fontWeight: 900,
                    color: colors.text,
                  }}
                >
                  {ch}
                </span>
              </div>
            );
          })}
        </div>
      ))}
      {subtitle ? (
        <div
          style={{
            marginTop: 40,
            fontSize: 48,
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
