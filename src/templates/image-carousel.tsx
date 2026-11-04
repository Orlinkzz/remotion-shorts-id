// Diadaptasi dari "image-carousel" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Carousel horizontal: kartu gambar bergeser satu per satu sepanjang scene.
// Props: images (1-8 gambar), items (keterangan per gambar), title (opsional), accent.
import { Easing, interpolate, spring } from "remotion";
import {
  clamp,
  colors,
  contentArea,
  sansFont,
  TemplateImage,
  TemplateTitle,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  items: ["Desain", "Kode", "Uji", "Rilis"],
};

const CARD_W = 620;
const CARD_H = 820;

export default function ImageCarousel(props: TemplateProps) {
  const { title, items, images, accent, frame, fps, durationInFrames } =
    useTemplate(props, defaults);
  const count = images?.length ?? items.length;

  // Tiap gambar dapat jatah waktu sama; geser di 20% akhir jatahnya.
  const segment = durationInFrames / count;
  const t = frame / segment;
  const idx = Math.min(count - 1, Math.floor(t));
  const slide =
    idx >= count - 1
      ? 0
      : interpolate(t - idx, [0.8, 1], [0, 1], {
          ...clamp,
          easing: Easing.inOut(Easing.cubic),
        });
  const pos = idx + slide;
  const enter = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div
      style={{
        ...contentArea,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 40,
        fontFamily: sansFont,
      }}
    >
      {title ? (
        <TemplateTitle
          text={title}
          accent={accent}
          max={80}
          style={{ textAlign: "center" }}
        />
      ) : null}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: CARD_H,
          opacity: enter,
          transform: `translateY(${(1 - enter) * 60}px)`,
        }}
      >
        {Array.from({ length: count }, (_, i) => {
          const offset = i - pos;
          const dist = Math.abs(offset);
          const scale = interpolate(dist, [0, 1, 2], [1, 0.78, 0.6], clamp);
          const opacity = interpolate(dist, [0, 1, 2], [1, 0.45, 0], clamp);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: "50%",
                top: 0,
                width: CARD_W,
                height: CARD_H,
                marginLeft: -CARD_W / 2,
                borderRadius: 36,
                overflow: "hidden",
                border: `3px solid ${dist < 0.5 ? accent : colors.surfaceAlt}`,
                boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
                transform: `translateX(${offset * 560}px) scale(${scale})`,
                opacity,
                zIndex: 10 - Math.round(dist),
              }}
            >
              <TemplateImage src={images?.[i]} index={i} />
              {items[i] ? (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    padding: "80px 32px 32px",
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,0.8))",
                    color: colors.text,
                    fontSize: 52,
                    fontWeight: 800,
                    textAlign: "center",
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
