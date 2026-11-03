import type { Scene } from "../lib/schema";
import { Code } from "./Code";
import { Hook } from "./Hook";
import { Outro } from "./Outro";
import { Points } from "./Points";
import { TemplateScene } from "./TemplateScene";

export const SceneView: React.FC<{ scene: Scene }> = ({ scene }) => {
  switch (scene.type) {
    case "hook":
      return <Hook text={scene.text} subtext={scene.subtext} />;
    case "code":
      return (
        <Code
          language={scene.language}
          filename={scene.filename}
          code={scene.code}
          highlightLines={scene.highlightLines}
        />
      );
    case "points":
      return <Points title={scene.title} items={scene.items} />;
    case "template":
      return <TemplateScene name={scene.template} />;
    case "outro":
      return <Outro cta={scene.cta} handle={scene.handle} />;
  }
};
