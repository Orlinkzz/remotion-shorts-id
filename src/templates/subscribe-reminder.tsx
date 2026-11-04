// Diadaptasi dari "subscribe-reminder" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Pil ajakan follow/subscribe dengan lonceng berdenyut, naik dari bawah area aman.
// Props: title (ajakan, mis. "Follow"), subtitle (handle akun), text (opsional, kalimat di atas pil), accent.
import { interpolate, spring } from "remotion";
import {
  colors,
  contentArea,
  fitFontSize,
  sansFont,
  TemplateTitle,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  title: "Follow",
  subtitle: "@senimankode",
  text: "Tips *coding* tiap hari",
};

const Bell: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
    <path d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm7-6V11a7 7 0 0 0-5.5-6.84V3.5a1.5 1.5 0 0 0-3 0v.66A7 7 0 0 0 5 11v5l-2 2v1h18v-1l-2-2Z" />
  </svg>
);

export default function SubscribeReminder(props: TemplateProps) {
  const { title, subtitle, text, accent, frame, fps } = useTemplate(
    props,
    defaults,
  );
  const slide = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14, stiffness: 100 },
  });
  const textIn = spring({ frame, fps, config: { damping: 100 } });
  const bell = interpolate(Math.sin(frame * 0.15), [-1, 1], [1, 1.15]);
  const ring = Math.sin(frame * 0.6) * 12 * (Math.floor(frame / 45) % 2);

  return (
    <div
      style={{
        ...contentArea,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 56,
        fontFamily: sansFont,
      }}
    >
      {text ? (
        <div style={{ textAlign: "center", opacity: textIn }}>
          <TemplateTitle text={text} accent={accent} max={96} />
        </div>
      ) : null}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 32,
          maxWidth: "100%",
          padding: "28px 56px 28px 28px",
          borderRadius: 999,
          background: "rgba(0, 0, 0, 0.75)",
          border: "2px solid rgba(255,255,255,0.12)",
          boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
          opacity: Math.min(1, slide),
          transform: `translateY(${(1 - slide) * 300}px)`,
        }}
      >
        <div
          style={{
            flexShrink: 0,
            width: 120,
            height: 120,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: accent,
            transform: `scale(${bell}) rotate(${ring}deg)`,
          }}
        >
          <Bell size={64} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
          <span
            style={{
              fontSize: fitFontSize(title, 64, 44, 12),
              fontWeight: 800,
              color: colors.text,
            }}
          >
            {title}
          </span>
          {subtitle ? (
            <span
              style={{ fontSize: 42, fontWeight: 500, color: colors.muted }}
            >
              {subtitle}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
