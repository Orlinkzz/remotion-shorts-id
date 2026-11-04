// Diadaptasi dari "credits-roll" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Daftar bergulir ke atas sepanjang scene, seperti credit film.
// Props: title (judul di awal gulungan), items ("Peran: Nama" atau teks biasa), accent.
import { interpolate } from "remotion";
import {
  clamp,
  colors,
  contentArea,
  sansFont,
  theme,
  TemplateTitle,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  title: "Terima *kasih*",
  items: [
    "Bahasa: TypeScript",
    "Framework: Remotion",
    "Suara: Edge TTS",
    "Caption: Whisper.cpp",
    "Template: React Video Editor",
    "Dibuat oleh: Senimankode",
  ],
};

const ROW = 170; // tinggi perkiraan per baris credit

export default function CreditsRoll(props: TemplateProps) {
  const { title, items, accent, frame, durationInFrames, height } = useTemplate(
    props,
    defaults,
  );
  const areaHeight = height - theme.layout.top - theme.layout.bottom;
  const listHeight = 260 + items.length * ROW;
  // Mulai dari bawah area, habis keluar di atas tepat di akhir scene.
  const y = interpolate(
    frame,
    [0, durationInFrames],
    [areaHeight, -listHeight],
    clamp,
  );
  const fadeMask =
    "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)";

  return (
    <div
      style={{
        ...contentArea,
        overflow: "hidden",
        fontFamily: sansFont,
        maskImage: fadeMask,
        WebkitMaskImage: fadeMask,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 56,
          transform: `translateY(${y}px)`,
        }}
      >
        <TemplateTitle text={title} accent={accent} max={100} />
        {items.map((item, i) => {
          const at = item.indexOf(":");
          const role = at > 0 ? item.slice(0, at).trim() : "";
          const name = at > 0 ? item.slice(at + 1).trim() : item;
          return (
            <div key={i}>
              {role ? (
                <div
                  style={{
                    marginBottom: 8,
                    fontSize: 40,
                    fontWeight: 600,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: accent,
                  }}
                >
                  {role}
                </div>
              ) : null}
              <div
                style={{ fontSize: 60, fontWeight: 700, color: colors.text }}
              >
                {name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
