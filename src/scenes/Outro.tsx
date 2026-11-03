/**
 * Diadaptasi dari "end-card" (Remotion Templates by RVE, MIT) —
 * https://www.reactvideoeditor.com
 */
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { sansFont } from "../fonts";
import type { OutroScene } from "../lib/schema";
import { contentArea, theme } from "../theme";

const { colors } = theme;

export const Outro: React.FC<Pick<OutroScene, "cta" | "handle">> = ({
  cta,
  handle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    from: 0.8,
    to: 1,
    config: { damping: 12, mass: 0.6 },
  });
  const fade = spring({ frame, fps, durationInFrames: 30 });
  const button = spring({ frame: frame - 18, fps, durationInFrames: 25 });
  const glow = interpolate(Math.sin(frame * 0.08), [-1, 1], [0.3, 0.8]);

  return (
    <div
      style={{
        ...contentArea,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: sansFont,
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 48,
          padding: "72px 48px",
          borderRadius: 48,
          background: "rgba(17, 24, 39, 0.82)",
          border: `3px solid rgba(56, 189, 248, ${glow})`,
          boxShadow: `0 0 80px rgba(56, 189, 248, ${glow * 0.25})`,
          opacity: fade,
          transform: `scale(${scale})`,
        }}
      >
        <div
          style={{
            fontSize: 84,
            fontWeight: 900,
            textAlign: "center",
            lineHeight: 1.1,
            color: colors.text,
          }}
        >
          {cta}
        </div>
        <div
          style={{
            opacity: button,
            transform: `translateY(${(1 - button) * 30}px)`,
            padding: "26px 72px",
            borderRadius: 24,
            fontSize: 56,
            fontWeight: 800,
            color: colors.bgFrom,
            background: `linear-gradient(90deg, ${colors.accent}, ${colors.accent2})`,
          }}
        >
          {handle ?? theme.brand.name}
        </div>
      </div>
    </div>
  );
};
