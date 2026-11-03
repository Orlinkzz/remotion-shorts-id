/**
 * Diadaptasi dari "animated-list" (Remotion Templates by RVE, MIT) —
 * https://www.reactvideoeditor.com — item muncul berurutan sepanjang scene.
 */
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Emphasis } from "../components/Emphasis";
import { sansFont } from "../fonts";
import type { PointsScene } from "../lib/schema";
import { contentArea, theme } from "../theme";

const { colors } = theme;

export const Points: React.FC<Pick<PointsScene, "title" | "items">> = ({
  title,
  items,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Item tersebar di 70% pertama scene supaya kira-kira ikut alur narasi.
  const revealSpan = Math.max(items.length, durationInFrames * 0.7);
  const stagger = revealSpan / items.length;
  const titleIn = spring({ frame, fps, config: { damping: 100 } });

  return (
    <div
      style={{
        ...contentArea,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 28,
        fontFamily: sansFont,
      }}
    >
      {title ? (
        <div
          style={{
            fontSize: 76,
            fontWeight: 900,
            color: colors.text,
            marginBottom: 12,
            opacity: titleIn,
            transform: `translateY(${(1 - titleIn) * 30}px)`,
          }}
        >
          <Emphasis text={title} color={colors.accent} />
        </div>
      ) : null}
      {items.map((item, i) => {
        const p = spring({
          frame: frame - 8 - i * stagger,
          fps,
          config: { damping: 12, mass: 0.5 },
        });
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 32,
              padding: "32px 36px",
              borderRadius: 32,
              background: colors.surface,
              border: `2px solid ${colors.surfaceAlt}`,
              opacity: Math.min(1, p),
              transform: `translateX(${(1 - p) * -120}px) scale(${0.85 + 0.15 * p})`,
              transformOrigin: "left center",
            }}
          >
            <div
              style={{
                flexShrink: 0,
                width: 88,
                height: 88,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 48,
                fontWeight: 900,
                color: colors.bgFrom,
                background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent2})`,
              }}
            >
              {i + 1}
            </div>
            <div
              style={{
                fontSize: 50,
                fontWeight: 700,
                lineHeight: 1.2,
                color: colors.text,
              }}
            >
              <Emphasis text={item} color={colors.accent} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
