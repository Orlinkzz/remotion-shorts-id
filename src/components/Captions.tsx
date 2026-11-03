/**
 * Caption gaya TikTok (kata aktif menyala). Pola dasarnya dari template-tiktok
 * (remotion-dev), disesuaikan: font Inter, warna dari tema, dan token berasal
 * dari NASKAH yang sudah disejajarkan dengan timestamp Whisper.
 */
import { makeTransform, scale, translateY } from "@remotion/animation-utils";
import {
  createTikTokStyleCaptions,
  type Caption,
  type TikTokPage,
} from "@remotion/captions";
import { fitText } from "@remotion/layout-utils";
import { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { sansFont } from "../fonts";
import { theme } from "../theme";

const PAGE_LINGER_MS = 600;

const Page: React.FC<{ page: TikTokPage }> = ({ page }) => {
  const frame = useCurrentFrame();
  const { width, fps } = useVideoConfig();
  const timeInMs = (frame / fps) * 1000;

  const enter = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: 5,
  });

  const textTransform = theme.caption.uppercase ? "uppercase" : "none";
  const fitted = fitText({
    fontFamily: sansFont,
    fontWeight: 900,
    text: page.text,
    withinWidth: width * 0.88,
    textTransform,
  });
  const fontSize = Math.min(theme.caption.maxFontSize, fitted.fontSize);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        top: undefined,
        bottom: theme.caption.bottom,
        height: theme.caption.height,
      }}
    >
      <div
        style={{
          fontSize,
          fontFamily: sansFont,
          fontWeight: 900,
          textTransform,
          color: "white",
          WebkitTextStroke: `${Math.round(fontSize * 0.2)}px black`,
          paintOrder: "stroke",
          textAlign: "center",
          transform: makeTransform([
            scale(interpolate(enter, [0, 1], [0.8, 1])),
            translateY(interpolate(enter, [0, 1], [40, 0])),
          ]),
        }}
      >
        {page.tokens.map((t, index) => {
          const from = t.fromMs - page.startMs;
          const to = t.toMs - page.startMs;
          const active = from <= timeInMs && to > timeInMs;
          return (
            <span
              key={`${t.fromMs}-${index}`}
              style={{
                display: "inline",
                whiteSpace: "pre",
                color: active ? theme.colors.highlight : "white",
              }}
            >
              {t.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const Captions: React.FC<{ tokens: Caption[] }> = ({ tokens }) => {
  const { fps } = useVideoConfig();
  const { pages } = useMemo(
    () =>
      createTikTokStyleCaptions({
        combineTokensWithinMilliseconds: theme.caption.switchEveryMs,
        captions: tokens,
      }),
    [tokens],
  );

  return (
    <>
      {pages.map((page, index) => {
        const next = pages[index + 1] ?? null;
        const lastToken = page.tokens[page.tokens.length - 1];
        const endMs = Math.min(
          next ? next.startMs : Infinity,
          (lastToken?.toMs ?? page.startMs) + PAGE_LINGER_MS,
        );
        const from = Math.round((page.startMs / 1000) * fps);
        const durationInFrames = Math.round((endMs / 1000) * fps) - from;
        if (durationInFrames <= 0) {
          return null;
        }
        return (
          <Sequence key={index} from={from} durationInFrames={durationInFrames}>
            <Page page={page} />
          </Sequence>
        );
      })}
    </>
  );
};
