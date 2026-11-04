// Diadaptasi dari "progress-steps" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Timeline langkah vertikal; langkah aktif maju bergiliran sepanjang scene.
// Props: title, items (nama langkah, berurutan), accent.
import { interpolate, spring } from "remotion";
import {
  clamp,
  colors,
  contentArea,
  Emphasis,
  sansFont,
  TemplateTitle,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  title: "Alur *deploy*",
  items: ["Commit", "Test", "Build", "Deploy"],
};

export default function ProgressSteps(props: TemplateProps) {
  const { title, items, accent, frame, fps, durationInFrames } = useTemplate(
    props,
    defaults,
  );
  const lead = Math.round(fps * 0.4);
  const per = Math.max(6, ((durationInFrames - lead) * 0.85) / items.length);
  const titleIn = interpolate(frame, [0, fps * 0.5], [0, 1], clamp);
  const dot = items.length > 5 ? 84 : 104;
  const gapLine = items.length > 5 ? 34 : 56;

  return (
    <div
      style={{
        ...contentArea,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 56,
        fontFamily: sansFont,
      }}
    >
      <div style={{ opacity: titleIn }}>
        <TemplateTitle text={title} accent={accent} max={96} />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {items.map((label, i) => {
          const start = lead + i * per;
          const fill = interpolate(
            frame,
            [start, start + per * 0.5],
            [0, 1],
            clamp,
          );
          const active =
            frame >= start && (i === items.length - 1 || frame < start + per);
          const reached = frame >= start;
          const pulse = active
            ? spring({
                frame: frame - start,
                fps,
                config: { damping: 8, stiffness: 150, mass: 0.4 },
              })
            : 1;
          const scale = active ? 0.9 + pulse * 0.15 : 1;
          const line = interpolate(
            frame,
            [start + per * 0.5, start + per],
            [0, 1],
            clamp,
          );
          return (
            <div key={i}>
              <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
                <div
                  style={{
                    flexShrink: 0,
                    width: dot,
                    height: dot,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: dot * 0.45,
                    fontWeight: 900,
                    color: reached ? colors.bgFrom : colors.muted,
                    border: `5px solid ${reached ? accent : colors.surfaceAlt}`,
                    background: reached
                      ? `linear-gradient(135deg, ${accent}, ${colors.accent2})`
                      : "rgba(17, 24, 39, 0.7)",
                    transform: `scale(${scale})`,
                    boxShadow: active ? `0 0 40px ${accent}88` : "none",
                  }}
                >
                  {i + 1}
                </div>
                <div
                  style={{
                    fontSize: items.length > 5 ? 48 : 58,
                    fontWeight: active ? 900 : 700,
                    color: reached ? colors.text : colors.muted,
                    opacity: 0.55 + 0.45 * fill,
                  }}
                >
                  <Emphasis text={label} color={accent} />
                </div>
              </div>
              {i < items.length - 1 ? (
                <div
                  style={{
                    width: 8,
                    height: gapLine,
                    marginLeft: dot / 2 - 4,
                    borderRadius: 4,
                    background: colors.surfaceAlt,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: `${line * 100}%`,
                      background: `linear-gradient(180deg, ${accent}, ${colors.accent2})`,
                    }}
                  />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
