// Diadaptasi dari "letterbox-reveal" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Bilah hitam atas-bawah membuka seperti layar bioskop, menampilkan gambar atau judul.
// Props: images[0] (opsional), title + subtitle (kartu judul / label di atas gambar), accent.
import { Easing, interpolate } from "remotion";
import {
  clamp,
  contentArea,
  TemplateImage,
  TemplateTitle,
  TitleCard,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  title: "*Sinematik*",
  subtitle: "Bagian 1 — dasar-dasar",
};

export default function LetterboxReveal(props: TemplateProps) {
  const { title, subtitle, images, accent, frame, fps } = useTemplate(
    props,
    defaults,
  );
  // Bilah menutup 50% lalu menyusut ke 7% (pita sinematik tetap tersisa).
  const bar = interpolate(frame, [0, fps * 1.5], [50, 7], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const contentIn = interpolate(frame, [fps * 0.4, fps * 1.4], [0, 1], clamp);
  const image = images?.[0];

  const barStyle: React.CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    height: `${bar}%`,
    background: "#000000",
  };

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, opacity: contentIn }}>
        {image ? (
          <>
            <TemplateImage src={image} />
            <div style={{ ...contentArea, bottom: "auto" }}>
              <TemplateTitle
                text={title}
                accent={accent}
                max={92}
                style={{ textShadow: "0 4px 24px rgba(0,0,0,0.8)" }}
              />
            </div>
          </>
        ) : (
          <TitleCard
            title={title}
            subtitle={subtitle}
            accent={accent}
            style={{ letterSpacing: 2 }}
          />
        )}
      </div>
      <div style={{ ...barStyle, top: 0 }} />
      <div style={{ ...barStyle, bottom: 0 }} />
    </div>
  );
}
