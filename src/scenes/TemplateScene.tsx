import { AbsoluteFill } from "remotion";
import type { TemplateSceneProps } from "../lib/schema";
import { resolveAsset } from "../lib/template-kit";
import { templateRegistry } from "../templates/registry";
import type { TemplateName } from "../templates/names";

/** Merender salah satu template dengan props dari video.json, memenuhi frame. */
export const TemplateScene: React.FC<{
  name: TemplateName;
  props?: TemplateSceneProps;
  videoId?: string;
}> = ({ name, props, videoId }) => {
  const Component = templateRegistry[name];
  const resolved: TemplateSceneProps = {
    ...props,
    images: props?.images?.map((src) => resolveAsset(videoId, src)),
  };
  return (
    <AbsoluteFill>
      <Component {...resolved} />
    </AbsoluteFill>
  );
};
