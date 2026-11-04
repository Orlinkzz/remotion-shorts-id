// Diadaptasi dari "rotating-carousel" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Kartu berputar seperti korsel 3D; tiap kartu bergiliran tampil di depan.
// Props: items (label kartu), images (opsional, gambar kartu), title (judul atas), accent.
import { Easing, interpolate, spring } from "remotion";
import {
  clamp,
  colors,
  contentArea,
  palette,
  sansFont,
  TemplateImage,
  TemplateTitle,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  title: "Fitur *ES2024*",
  items: [
    "Array.groupBy",
    "Promise.withResolvers",
    "toSorted()",
    "Set methods",
  ],
};

const CARD_W = 460;
const CARD_H = 620;

export default function RotatingCarousel(props: TemplateProps) {
  const { title, items, images, accent, frame, fps, progress } = useTemplate(
    props,
    defaults,
  );
  const count = Math.max(images?.length ?? 0, items.length);
  const colorsFor = palette(accent);
  // Berputar sampai kartu terakhir di depan di ujung scene.
  const angle =
    Easing.inOut(Easing.ease)(
      interpolate(progress, [0.05, 0.95], [0, 1], clamp),
    ) *
    ((Math.PI * 2 * (count - 1)) / count);
  const enter = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div
      style={{
        ...contentArea,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 40,
        fontFamily: sansFont,
      }}
    >
      <TemplateTitle
        text={title}
        accent={accent}
        max={88}
        style={{ textAlign: "center" }}
      />
      <div
        style={{
          position: "relative",
          flex: 1,
          width: "100%",
          opacity: enter,
        }}
      >
        {Array.from({ length: count }, (_, i) => {
          const a = (i * Math.PI * 2) / count - angle;
          const x = Math.sin(a) * 300;
          const depth = (Math.cos(a) + 1) / 2;
          const scale = interpolate(depth, [0, 1], [0.55, 1]);
          const opacity = interpolate(depth, [0, 1], [0.25, 1]);
          const color = colorsFor[i % colorsFor.length];
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: CARD_W,
                height: CARD_H,
                marginLeft: -CARD_W / 2,
                marginTop: -CARD_H / 2,
                transform: `translateX(${x}px) scale(${scale})`,
                opacity,
                zIndex: Math.round(depth * 100),
                borderRadius: 36,
                overflow: "hidden",
                background: `linear-gradient(160deg, ${colors.surfaceAlt}, ${colors.surface})`,
                border: `3px solid ${depth > 0.95 ? color : "rgba(255,255,255,0.12)"}`,
                boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ flex: 1, minHeight: 0 }}>
                {images?.[i] ? (
                  <TemplateImage src={images[i]} index={i} />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        width: 140,
                        height: 140,
                        borderRadius: 36,
                        background: `linear-gradient(135deg, ${color}, ${colors.accent2})`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 72,
                        fontWeight: 900,
                        color: colors.bgFrom,
                      }}
                    >
                      {i + 1}
                    </div>
                  </div>
                )}
              </div>
              {items[i] ? (
                <div
                  style={{
                    padding: "28px 24px 36px",
                    textAlign: "center",
                    color: colors.text,
                    fontSize: 44,
                    fontWeight: 800,
                    lineHeight: 1.15,
                    wordBreak: "break-word",
                  }}
                >
                  {items[i]}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
