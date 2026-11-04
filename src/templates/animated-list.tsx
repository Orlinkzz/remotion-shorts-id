// Diadaptasi dari "animated-list" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Daftar dengan bulatan warna; item meluncur masuk bergiliran sepanjang scene.
// Props: title (opsional), items (isi daftar), accent.
import { interpolate, spring } from "remotion";
import {
  clamp,
  colors,
  contentArea,
  Emphasis,
  palette,
  sansFont,
  TemplateTitle,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  title: "Hindari ini di *React*",
  items: ["Key dari index", "State berlebihan", "useEffect untuk semuanya"],
};

export default function AnimatedList(props: TemplateProps) {
  const { title, items, accent, frame, fps, durationInFrames } = useTemplate(
    props,
    defaults,
  );
  const dots = palette(accent);
  const lead = title ? Math.round(fps * 0.4) : 0;
  const stagger = Math.max(4, ((durationInFrames - lead) * 0.6) / items.length);
  const titleIn = interpolate(frame, [0, fps * 0.5], [0, 1], clamp);
  const fontSize = items.length > 5 ? 50 : 60;
  const dot = items.length > 5 ? 64 : 84;

  return (
    <div
      style={{
        ...contentArea,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: items.length > 5 ? 28 : 40,
        fontFamily: sansFont,
      }}
    >
      {title ? (
        <div style={{ opacity: titleIn, marginBottom: 16 }}>
          <TemplateTitle text={title} accent={accent} max={96} />
        </div>
      ) : null}
      {items.map((item, i) => {
        const p = spring({
          frame: frame - lead - i * stagger,
          fps,
          config: { damping: 12, mass: 0.5 },
        });
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 32,
              opacity: Math.min(1, p),
              transform: `translateX(${(1 - p) * -160}px) scale(${0.3 + 0.7 * p})`,
              transformOrigin: "left center",
            }}
          >
            <div
              style={{
                flexShrink: 0,
                width: dot,
                height: dot,
                borderRadius: "50%",
                background: dots[i % dots.length],
                boxShadow: `0 0 30px ${dots[i % dots.length]}66`,
              }}
            />
            <span
              style={{
                fontSize,
                fontWeight: 700,
                lineHeight: 1.15,
                color: colors.text,
              }}
            >
              <Emphasis text={item} color={accent} />
            </span>
          </div>
        );
      })}
    </div>
  );
}
