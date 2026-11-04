// Diadaptasi dari "lower-third" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Papan nama di bagian bawah area aman: garis aksen dan bar meluncur dari kiri.
// Props: title (nama), subtitle (jabatan/keterangan), accent.
import { spring } from "remotion";
import {
  colors,
  contentArea,
  fitFontSize,
  plain,
  sansFont,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  title: "Senimankode",
  subtitle: "Full-stack Developer",
};

export default function LowerThird(props: TemplateProps) {
  const { title, subtitle, accent, frame, fps } = useTemplate(props, defaults);
  const lineIn = spring({ frame, fps, config: { damping: 15, mass: 0.6 } });
  const barIn = spring({
    frame: frame - 5,
    fps,
    config: { damping: 14, mass: 0.7 },
  });
  const textIn = spring({ frame: frame - 15, fps, config: { damping: 100 } });

  return (
    <div
      style={{
        ...contentArea,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "flex-start",
        fontFamily: sansFont,
      }}
    >
      <div
        style={{
          width: 360,
          height: 8,
          marginBottom: 10,
          borderRadius: 4,
          background: `linear-gradient(90deg, ${accent}, ${colors.accent2})`,
          transform: `translateX(${(1 - lineIn) * -500}px)`,
        }}
      />
      <div
        style={{
          display: "flex",
          maxWidth: "100%",
          transform: `translateX(${(1 - barIn) * -1100}px)`,
        }}
      >
        <div
          style={{ width: 12, background: accent, borderRadius: "6px 0 0 6px" }}
        />
        <div
          style={{
            padding: "32px 48px",
            borderRadius: "0 16px 16px 0",
            background: "rgba(0, 0, 0, 0.7)",
          }}
        >
          <div
            style={{
              fontSize: fitFontSize(plain(title), 76, 52, 16),
              fontWeight: 800,
              color: colors.text,
              opacity: textIn,
            }}
          >
            {plain(title)}
          </div>
          {subtitle ? (
            <div
              style={{
                marginTop: 8,
                fontSize: 42,
                fontWeight: 500,
                letterSpacing: "0.04em",
                color: "rgba(255,255,255,0.75)",
                opacity: textIn,
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
