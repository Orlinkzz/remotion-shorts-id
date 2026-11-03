import { useEffect, useState } from "react";
import {
  cancelRender,
  staticFile,
  useDelayRender,
  watchStaticFile,
} from "remotion";
import {
  invalidateVideo,
  loadVideo,
  type ResolvedVideo,
} from "../lib/load-video";

export const useResolvedVideo = (videoId: string): ResolvedVideo | null => {
  const { delayRender, continueRender } = useDelayRender();
  const [handle] = useState(() => delayRender(`Memuat video "${videoId}"`));
  const [data, setData] = useState<ResolvedVideo | null>(null);

  useEffect(() => {
    let alive = true;
    const run = () =>
      loadVideo(videoId)
        .then((d) => {
          if (alive) {
            setData(d);
            continueRender(handle);
          }
        })
        .catch((e) => cancelRender(e));

    run();

    // Di Studio: muat ulang saat video.json / captions.json berubah.
    const watchers = ["video.json", "captions.json"].map((file) =>
      watchStaticFile(staticFile(`videos/${videoId}/${file}`), () => {
        invalidateVideo(videoId);
        run();
      }),
    );

    return () => {
      alive = false;
      watchers.forEach((w) => w.cancel());
    };
  }, [videoId, handle, continueRender]);

  return data;
};
