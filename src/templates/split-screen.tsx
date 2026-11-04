// Diadaptasi dari "split-screen" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Dua panel (atas/bawah di 9:16) yang meluncur masuk untuk membandingkan dua hal.
// Props: title (opsional, judul di atas), items[0..1] (label panel), images[0..1] (opsional, foto panel), accent.
import { interpolate, spring } from "remotion";
import {
  clamp,
  colors,
  contentArea,
  Emphasis,
  fitFontSize,
  plain,
  sansFont,
  TemplateImage,
  TemplateTitle,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  title: "*Tabs* atau *spaces*?",
  items: ["Tabs", "Spaces"],
};

export default function SplitScreen(props: TemplateProps) {
  const { title, items, images, accent, frame, fps } = useTemplate(
    props,
    defaults,
  );
  const panels = [items[0], items[1] ?? ""];
  const gradients = [
    `linear-gradient(135deg, ${accent}, #1d4ed8)`,
    `linear-gradient(135deg, ${colors.accent2}, #5b21b6)`,
  ];
  const titleIn = interpolate(frame, [0, fps * 0.5], [0, 1], clamp);
  const badge = spring({
    frame: frame - Math.round(fps * 0.6),
    fps,
    config: { damping: 10 },
  });

  return (
    <div
      style={{
        ...contentArea,
        display: "flex",
        flexDirection: "column",
        gap: 36,
        fontFamily: sansFont,
      }}
    >
      {title ? (
        <div style={{ opacity: titleIn, textAlign: "center" }}>
          <TemplateTitle text={title} accent={accent} max={92} />
        </div>
      ) : null}
      <div
        style={{
          position: "relative",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {panels.map((label, i) => {
          const slide = spring({
            frame: frame - i * 5,
            fps,
            config: { damping: 15, stiffness: 80 },
          });
          const dir = i === 0 ? -1 : 1;
          return (
            <div
              key={i}
              style={{
                position: "relative",
                flex: 1,
                borderRadius: 40,
                overflow: "hidden",
                transform: `translateX(${dir * (1 - slide) * 110}%)`,
                boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
              }}
            >
              {images?.[i] ? (
                <TemplateImage src={images[i]} />
              ) : (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: gradients[i],
                  }}
                />
              )}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: images?.[i] ? "flex-end" : "center",
                  justifyContent: "center",
                  padding: 40,
                  background: images?.[i]
                    ? "linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 100%)"
                    : undefined,
                }}
              >
                <div
                  style={{
                    fontSize: fitFontSize(plain(label), 120, 56, 10),
                    fontWeight: 900,
                    color: "white",
                    textAlign: "center",
                    textShadow: "0 4px 20px rgba(0,0,0,0.4)",
                  }}
                >
                  <Emphasis text={label} color={colors.highlight} />
                </div>
              </div>
            </div>
          );
        })}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 150,
            height: 150,
            marginLeft: -75,
            marginTop: -75,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 60,
            fontWeight: 900,
            color: colors.bgFrom,
            background: colors.text,
            border: `6px solid ${colors.bgFrom}`,
            transform: `scale(${badge})`,
          }}
        >
          VS
        </div>
      </div>
    </div>
  );
}
