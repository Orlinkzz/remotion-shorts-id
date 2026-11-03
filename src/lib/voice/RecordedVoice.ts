import type { Caption } from "@remotion/captions";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { staticFile } from "remotion";
import type { VoiceProvider, VoiceResult } from "./types";

const fetchCaptions = async (videoId: string): Promise<Caption[] | null> => {
  try {
    const res = await fetch(staticFile(`videos/${videoId}/captions.json`));
    const type = res.headers.get("content-type") ?? "";
    if (!res.ok || !type.includes("json")) return null;
    const data: unknown = await res.json();
    return Array.isArray(data) ? (data as Caption[]) : null;
  } catch {
    return null;
  }
};

export const recordedVoice: VoiceProvider = {
  async load(videoId, voiceFile): Promise<VoiceResult> {
    const audioSrc = staticFile(`videos/${videoId}/${voiceFile}`);
    const [audioSeconds, captions] = await Promise.all([
      getAudioDurationInSeconds(audioSrc),
      fetchCaptions(videoId),
    ]);
    return { audioSrc, audioSeconds, captions };
  },
};
