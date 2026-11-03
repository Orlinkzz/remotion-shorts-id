import { Composition, Folder } from "remotion";
import {
  calculateShortMetadata,
  Short,
  shortSchema,
} from "./compositions/Short";
import { notebookPaperDefaults } from "./compositions/notebook-paper.element";
import { theme } from "./theme";
import { templateNames } from "./templates/names";
import { templateRegistry } from "./templates/registry";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Short"
        component={Short}
        schema={shortSchema}
        calculateMetadata={calculateShortMetadata}
        width={theme.width}
        height={theme.height}
        fps={theme.fps}
        durationInFrames={theme.fps * 30}
        defaultProps={{
          videoId: "n-plus-one",
          bg: notebookPaperDefaults,
        }}
      />
      {/* Galeri: 81 template RVE apa adanya, untuk dicek satu per satu di Studio. */}
      <Folder name="Templates">
        {templateNames.map((name) => (
          <Composition
            key={name}
            id={`tpl-${name}`}
            component={templateRegistry[name]}
            width={theme.width}
            height={theme.height}
            fps={theme.fps}
            durationInFrames={theme.fps * 6}
          />
        ))}
      </Folder>
    </>
  );
};
