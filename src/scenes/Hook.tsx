/**
 * Diadaptasi dari "bounce-text" (Remotion Templates by RVE, MIT) —
 * https://www.reactvideoeditor.com — dijadikan berparameter dan 9:16.
 */
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Emphasis } from "../components/Emphasis";
import { sansFont } from "../fonts";
import type { HookScene } from "../lib/schema";
import { contentArea, theme } from "../theme";

const { colors } = theme;

export const Hook: React.FC<Pick<HookScene, "text" | "subtext">> = ({
  text,
  subtext,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    from: 0.6,
    to: 1,
    config: { damping: 14, mass: 0.8, stiffness: 160 },
  });
  const fade = spring({ frame, fps, config: { damping: 100 } });
  const subFade = spring({ frame: frame - 12, fps, config: { damping: 100 } });
  const bar = spring({ frame: frame - 6, fps, config: { damping: 30 } });

  const fontSize = text.length <= 22 ? 132 : text.length <= 36 ? 112 : 92;

  return (
    <div
      style={{
        ...contentArea,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 40,
        fontFamily: sansFont,
      }}
    >
      <div
        style={{
          width: 140 * bar,
          height: 14,
          borderRadius: 8,
          background: `linear-gradient(90deg, ${colors.accent}, ${colors.accent2})`,
        }}
      />
      <div
        style={{
          fontSize,
          fontWeight: 900,
          lineHeight: 1.05,
          color: colors.text,
          opacity: fade,
          transform: `scale(${scale})`,
          transformOrigin: "left center",
          textShadow: "0 6px 24px rgba(0,0,0,0.35)",
        }}
      >
        <Emphasis text={text} color={colors.accent} />
      </div>
      {subtext ? (
        <div
          style={{
            fontSize: 52,
            fontWeight: 600,
            color: colors.muted,
            opacity: subFade,
            transform: `translateY(${(1 - subFade) * 24}px)`,
          }}
        >
          {subtext}
        </div>
      ) : null}
    </div>
  );
};
