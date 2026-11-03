import type { Caption } from "@remotion/captions";
import { staticFile } from "remotion";
import { theme } from "../theme";
import {
  alignScriptToCaptions,
  computeSceneTimings,
  estimateTimedWords,
  splitNarration,
  toCaptionTokens,
  type SceneTiming,
  type TimedWord,
} from "./align";
import { videoSchema, type VideoSpec } from "./schema";
import { recordedVoice } from "./voice/RecordedVoice";
import type { VoiceProvider } from "./voice/types";

export type ResolvedVideo = {
  video: VideoSpec;
  audioSrc: string;
  words: TimedWord[];
  captionTokens: Caption[];
  timings: SceneTiming[];
  durationInFrames: number;
  /** false = captions.json belum ada, timing hanya perkiraan. */
  hasCaptions: boolean;
};

const cache = new Map<string, Promise<ResolvedVideo>>();

const resolve = async (
  videoId: string,
  voice: VoiceProvider,
): Promise<ResolvedVideo> => {
  const res = await fetch(staticFile(`videos/${videoId}/video.json`));
  if (!res.ok) {
    throw new Error(`public/videos/${videoId}/video.json tidak ditemukan`);
  }
  const video = videoSchema.parse(await res.json());

  const { audioSrc, audioSeconds, captions } = await voice.load(
    videoId,
    video.voice,
  );
  const totalMs = audioSeconds * 1000 + theme.tailMs;
  const script = splitNarration(video.scenes);
  const hasCaptions = Boolean(captions && captions.length > 0);
  const words = hasCaptions
    ? alignScriptToCaptions(script, captions as Caption[], totalMs)
    : estimateTimedWords(script, totalMs - theme.tailMs);
  const timings = computeSceneTimings(
    words,
    video.scenes.length,
    totalMs,
    theme.fps,
    theme.sceneLeadMs,
  );
  const last = timings[timings.length - 1];

  return {
    video,
    audioSrc,
    words,
    captionTokens: toCaptionTokens(words),
    timings,
    durationInFrames: last.fromFrame + last.durationInFrames,
    hasCaptions,
  };
};

export const invalidateVideo = (videoId: string): void => {
  cache.delete(videoId);
};

export const loadVideo = (
  videoId: string,
  voice: VoiceProvider = recordedVoice,
): Promise<ResolvedVideo> => {
  let promise = cache.get(videoId);
  if (!promise) {
    promise = resolve(videoId, voice);
    cache.set(videoId, promise);
    promise.catch(() => cache.delete(videoId));
  }
  return promise;
};
