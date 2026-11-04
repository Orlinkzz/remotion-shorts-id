// Diadaptasi dari "notification-pop" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Notifikasi ponsel meluncur masuk satu per satu dari kanan, yang pertama berlencana jumlah.
// Props: title (nama aplikasi/pengirim), text (isi notifikasi utama), subtitle (waktu),
//        items (notifikasi tambahan, opsional), accent.
import { interpolate, spring } from "remotion";
import {
  colors,
  contentArea,
  fitFontSize,
  palette,
  plain,
  sansFont,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  title: "GitHub Actions",
  text: "Build gagal di branch main",
  subtitle: "baru saja",
  items: ["Pull request #42 disetujui", "3 komentar baru di review kamu"],
};

export default function NotificationPop(props: TemplateProps) {
  const { title, text, subtitle, items, accent, frame, fps, durationInFrames } =
    useTemplate(props, defaults);
  const all = [text, ...items].slice(0, 6);
  const tones = palette(accent);
  // Jeda antarnotifikasi mengecil kalau scene pendek.
  const gap = Math.min(20, (durationInFrames * 0.5) / Math.max(1, all.length));

  return (
    <div
      style={{
        ...contentArea,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 28,
        fontFamily: sansFont,
      }}
    >
      {all.map((body, i) => {
        const slide = spring({
          frame: frame - i * gap,
          fps,
          config: { damping: 14, stiffness: 180, mass: 0.6 },
        });
        return (
          <div
            key={i}
            style={{
              position: "relative",
              display: "flex",
              alignItems: "flex-start",
              gap: 28,
              padding: "32px 36px",
              borderRadius: 36,
              background: "rgba(31, 41, 55, 0.92)",
              border: "2px solid rgba(255,255,255,0.1)",
              boxShadow: "0 12px 36px rgba(0,0,0,0.35)",
              opacity: interpolate(slide, [0, 1], [0, 1]),
              transform: `translateX(${(1 - slide) * 1000}px)`,
            }}
          >
            <div
              style={{
                width: 88,
                height: 88,
                flexShrink: 0,
                borderRadius: 24,
                background: tones[i % tones.length],
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 48,
                fontWeight: 900,
                color: colors.bgFrom,
              }}
            >
              {plain(title).slice(0, 1).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 16,
                  marginBottom: 8,
                }}
              >
                <span
                  style={{ fontSize: 40, fontWeight: 700, color: colors.text }}
                >
                  {plain(title)}
                </span>
                {subtitle ? (
                  <span
                    style={{ fontSize: 34, color: colors.muted, flexShrink: 0 }}
                  >
                    {subtitle}
                  </span>
                ) : null}
              </div>
              <div
                style={{
                  fontSize: fitFontSize(body, 46, 40, 30),
                  lineHeight: 1.3,
                  color: "#CBD5E1",
                }}
              >
                {body}
              </div>
            </div>
            {i === 0 && all.length > 1 ? (
              <div
                style={{
                  position: "absolute",
                  top: -14,
                  right: -14,
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "#EF4444",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 32,
                  fontWeight: 800,
                  color: "white",
                }}
              >
                {all.length}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
