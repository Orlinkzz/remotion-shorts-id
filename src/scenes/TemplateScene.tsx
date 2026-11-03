import { AbsoluteFill } from "remotion";
import { templateRegistry } from "../templates/registry";
import type { TemplateName } from "../templates/names";

/** Merender salah satu template RVE apa adanya, memenuhi seluruh frame. */
export const TemplateScene: React.FC<{ name: TemplateName }> = ({ name }) => {
  const Component = templateRegistry[name];
  return (
    <AbsoluteFill>
      <Component />
    </AbsoluteFill>
  );
};
