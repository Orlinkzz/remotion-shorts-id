import type { Caption } from "@remotion/captions";

export type VoiceResult = {
  /** URL audio yang bisa dimainkan Remotion (staticFile). */
  audioSrc: string;
  audioSeconds: number;
  /** Token Whisper mentah; null kalau captions.json belum dibuat. */
  captions: Caption[] | null;
};

/**
 * Sumber suara. Fase 1: RecordedVoice (rekaman sendiri + Whisper).
 * Fase 3: TtsVoice dengan kontrak yang sama, komposisi tidak perlu diubah.
 */
export interface VoiceProvider {
  load(videoId: string, voiceFile: string): Promise<VoiceResult>;
}
