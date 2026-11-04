// Diadaptasi dari "end-card" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Kartu penutup bercahaya: judul, tombol ajakan, dan deretan tautan/akun.
// Props: title (judul), subtitle (teks tombol), items (tautan/akun, opsional), text (label kecil di bawah), accent.
import { interpolate, spring } from "remotion";
import {
  colors,
  contentArea,
  palette,
  sansFont,
  TemplateTitle,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  title: "Terima kasih sudah *nonton*",
  subtitle: "Follow untuk tips berikutnya",
  items: ["@senimankode", "github.com/senimankode"],
  text: "SENIMANKODE",
};

export default function EndCard(props: TemplateProps) {
  const { title, subtitle, items, text, accent, frame, fps } = useTemplate(
    props,
    defaults,
  );
  const scale = spring({
    frame,
    fps,
    from: 0.8,
    to: 1,
    config: { damping: 12, mass: 0.6 },
  });
  const fade = spring({ frame, fps, config: { damping: 100 } });
  const glow = interpolate(Math.sin(frame * 0.08), [-1, 1], [0.3, 0.8]);
  const buttonIn = spring({ frame: frame - 20, fps, config: { damping: 100 } });
  const tones = palette(accent);

  return (
    <div
      style={{
        ...contentArea,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: sansFont,
      }}
    >
      <div
        style={{
          width: "100%",
          padding: "72px 48px",
          borderRadius: 40,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          background: "rgba(17, 24, 39, 0.8)",
          border: `3px solid color-mix(in srgb, ${accent} ${Math.round(glow * 100)}%, transparent)`,
          boxShadow: `0 0 60px color-mix(in srgb, ${accent} ${Math.round(glow * 40)}%, transparent)`,
          opacity: fade,
          transform: `scale(${scale})`,
        }}
      >
        <TemplateTitle text={title} accent={accent} max={96} />
        {subtitle ? (
          <div
            style={{
              marginTop: 48,
              padding: "28px 56px",
              borderRadius: 20,
              fontSize: 46,
              fontWeight: 700,
              color: colors.text,
              background: `linear-gradient(90deg, ${accent}, ${colors.accent2})`,
              opacity: buttonIn,
              transform: `scale(${0.8 + 0.2 * buttonIn})`,
            }}
          >
            {subtitle}
          </div>
        ) : null}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            marginTop: 48,
            width: "100%",
          }}
        >
          {items.map((item, i) => {
            const p = spring({
              frame: frame - 30 - i * 6,
              fps,
              config: { damping: 14 },
            });
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 20,
                  fontSize: 42,
                  fontWeight: 600,
                  color: colors.text,
                  opacity: Math.min(1, p),
                  transform: `translateY(${(1 - p) * 20}px)`,
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    flexShrink: 0,
                    borderRadius: "50%",
                    background: tones[i % tones.length],
                  }}
                />
                {item}
              </div>
            );
          })}
        </div>
        {text ? (
          <div
            style={{
              marginTop: 44,
              fontSize: 40,
              fontWeight: 500,
              letterSpacing: "0.12em",
              color: "rgba(255,255,255,0.5)",
              opacity: buttonIn,
            }}
          >
            {text}
          </div>
        ) : null}
      </div>
    </div>
  );
}
