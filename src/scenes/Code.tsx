import { Highlight, themes } from "prism-react-renderer";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { monoFont, sansFont } from "../fonts";
import { Prism } from "../lib/prism";
import type { CodeScene } from "../lib/schema";
import { contentArea, theme } from "../theme";

const { colors } = theme;

const WINDOW_PADDING = 36;
const GUTTER = 72;
const MONO_ADVANCE = 0.6; // lebar karakter JetBrains Mono (em)

export const Code: React.FC<
  Pick<CodeScene, "language" | "filename" | "code" | "highlightLines">
> = ({ language, filename, code, highlightLines }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const source = code.replace(/\s+$/, "");
  const lines = source.split("\n");
  const maxChars = Math.max(...lines.map((l) => l.length), 1);
  const innerWidth =
    theme.width - theme.layout.side * 2 - WINDOW_PADDING * 2 - GUTTER;
  const fontSize = Math.max(
    22,
    Math.min(44, Math.floor(innerWidth / (maxChars * MONO_ADVANCE))),
  );
  const lineHeight = Math.round(fontSize * 1.55);

  // Fase 1: baris muncul berurutan. Fase 2: rentang sorotan bergantian.
  const revealEnd = durationInFrames * 0.4;
  const perLine = Math.min(7, revealEnd / lines.length);
  const ranges = highlightLines ?? [];
  const spotlightProgress = interpolate(
    frame,
    [revealEnd, durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const activeRange =
    ranges.length > 0 && frame >= revealEnd
      ? Math.min(ranges.length - 1, Math.floor(spotlightProgress * ranges.length))
      : -1;
  const dim = spring({
    frame: frame - revealEnd,
    fps,
    config: { damping: 200 },
    durationInFrames: 12,
  });

  const windowIn = spring({ frame, fps, config: { damping: 18, mass: 0.7 } });

  return (
    <div
      style={{
        ...contentArea,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          borderRadius: 36,
          overflow: "hidden",
          background: "#0D1117",
          border: `2px solid ${colors.surfaceAlt}`,
          boxShadow: "0 30px 90px rgba(0,0,0,0.5)",
          opacity: Math.min(1, windowIn),
          transform: `translateY(${(1 - windowIn) * 60}px)`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "22px 30px",
            background: colors.surface,
            fontFamily: sansFont,
          }}
        >
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
            <div
              key={c}
              style={{ width: 22, height: 22, borderRadius: "50%", background: c }}
            />
          ))}
          <div style={{ marginLeft: 16, fontSize: 30, color: colors.muted }}>
            {filename ?? language}
          </div>
        </div>

        <Highlight
          prism={Prism}
          theme={themes.vsDark}
          code={source}
          language={language}
        >
          {({ tokens, getLineProps, getTokenProps }) => (
            <pre
              style={{
                margin: 0,
                padding: `${WINDOW_PADDING}px ${WINDOW_PADDING}px ${WINDOW_PADDING}px 0`,
                fontFamily: monoFont,
                fontSize,
                lineHeight: `${lineHeight}px`,
                background: "transparent",
              }}
            >
              {tokens.map((line, i) => {
                const lineNo = i + 1;
                const reveal = spring({
                  frame: frame - 6 - i * perLine,
                  fps,
                  config: { damping: 200 },
                  durationInFrames: 14,
                });
                const lit =
                  activeRange >= 0 &&
                  lineNo >= ranges[activeRange][0] &&
                  lineNo <= ranges[activeRange][1];
                const dimmed = activeRange >= 0 && !lit;
                const opacity = reveal * (dimmed ? 1 - 0.65 * dim : 1);
                const lineProps = getLineProps({ line });

                return (
                  <div
                    key={i}
                    {...lineProps}
                    style={{
                      ...lineProps.style,
                      display: "flex",
                      opacity,
                      transform: `translateX(${(1 - reveal) * 40}px)`,
                      background: lit ? `${colors.accent}26` : "transparent",
                      borderLeft: `6px solid ${lit ? colors.accent : "transparent"}`,
                    }}
                  >
                    <span
                      style={{
                        width: GUTTER - 6,
                        flexShrink: 0,
                        textAlign: "right",
                        paddingRight: 24,
                        color: lit ? colors.accent : "#4B5563",
                        userSelect: "none",
                      }}
                    >
                      {lineNo}
                    </span>
                    <span style={{ whiteSpace: "pre" }}>
                      {line.map((token, key) => {
                        const tokenProps = getTokenProps({ token });
                        return <span key={key} {...tokenProps} />;
                      })}
                    </span>
                  </div>
                );
              })}
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
};
