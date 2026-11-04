import type { CalculateMetadataFunction } from "remotion";
import {
  AbsoluteFill,
  getRemotionEnvironment,
  Html5Audio,
  Sequence,
} from "remotion";
import { z } from "zod";
import { Captions } from "../components/Captions";
import { sansFont } from "../fonts";
import { invalidateVideo, loadVideo } from "../lib/load-video";
import { SceneView } from "../scenes/SceneView";
import { theme } from "../theme";
import { NotebookPaper, notebookPaperSchema } from "./notebook-paper.element";
import { useResolvedVideo } from "./useResolvedVideo";

export const shortSchema = z.object({
  /** Nama folder di public/videos/<videoId>/ */
  videoId: z.string(),
  /** Pengaturan background (muncul sebagai grup "bg" di panel Props Studio) */
  bg: notebookPaperSchema,
});

export type ShortProps = z.infer<typeof shortSchema>;

export const calculateShortMetadata: CalculateMetadataFunction<
  ShortProps
> = async ({ props }) => {
  // Selalu baca ulang: durasi mengikuti audio + captions terbaru.
  invalidateVideo(props.videoId);
  const resolved = await loadVideo(props.videoId);
  return {
    fps: theme.fps,
    width: theme.width,
    height: theme.height,
    durationInFrames: resolved.durationInFrames,
  };
};

export const Short: React.FC<ShortProps> = ({ videoId, bg }) => {
  const resolved = useResolvedVideo(videoId);
  if (!resolved) {
    return null;
  }

  return (
    <AbsoluteFill durationInFrames={1163}>
      <NotebookPaper
        {...bg}
        durationInFrames={resolved.durationInFrames}
        name="Notebook Paper"
        style={{ position: "absolute" }}
      />
      {resolved.timings.map((timing, i) => (
        <Sequence
          key={i}
          from={timing.fromFrame}
          durationInFrames={timing.durationInFrames}
        >
          <SceneView scene={resolved.video.scenes[i]} videoId={videoId} />
        </Sequence>
      ))}
      <Html5Audio src={resolved.audioSrc} />
      <Captions tokens={resolved.captionTokens} />
      {!resolved.hasCaptions && getRemotionEnvironment().isStudio ? (
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: sansFont,
            fontSize: 30,
            color: theme.colors.highlight,
          }}
        >
          captions.json belum ada — timing hanya perkiraan. Jalankan: npm run
          transcribe {videoId}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
