// Diadaptasi dari "logo-stroke-draw" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Garis heksagon dan segitiga tergambar, lalu terisi warna dan nama brand muncul.
// Props: title (nama brand), subtitle (tagline), images[0] (logo di tengah, opsional), accent.
import { interpolate } from "remotion";
import {
  clamp,
  colors,
  contentArea,
  Emphasis,
  fitFontSize,
  plain,
  sansFont,
  TemplateImage,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  title: "Senimankode",
  subtitle: "Kode rapi, video singkat",
};

const HEX = "60,10 103.3,35 103.3,85 60,110 16.7,85 16.7,35";
const TRI = "60,30 85.98,75 34.02,75";
const HEX_LEN = 300;
const TRI_LEN = 160;

export default function LogoStrokeDraw(props: TemplateProps) {
  const { title, subtitle, images, accent, frame, fps } = useTemplate(
    props,
    defaults,
  );

  const hexOffset = interpolate(frame, [0, fps * 1], [HEX_LEN, 0], clamp);
  const triOffset = interpolate(
    frame,
    [fps * 0.3, fps * 1.2],
    [TRI_LEN, 0],
    clamp,
  );
  const fill = interpolate(frame, [fps * 1.1, fps * 1.5], [0, 1], clamp);
  const nameIn = interpolate(frame, [fps * 1.2, fps * 1.6], [0, 1], clamp);
  const subIn = interpolate(frame, [fps * 1.4, fps * 1.8], [0, 1], clamp);
  const logo = images?.[0];

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
        textAlign: "center",
      }}
    >
      <div style={{ position: "relative", width: 420, height: 420 }}>
        <svg width="420" height="420" viewBox="0 0 120 120">
          <defs>
            <linearGradient
              id="strokeDrawFill"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor={accent} />
              <stop offset="100%" stopColor={colors.accent2} />
            </linearGradient>
          </defs>
          <polygon
            points={HEX}
            fill="url(#strokeDrawFill)"
            opacity={fill * 0.3}
          />
          <polygon
            points={HEX}
            fill="none"
            stroke={accent}
            strokeWidth={2.5}
            strokeDasharray={HEX_LEN}
            strokeDashoffset={hexOffset}
            strokeLinejoin="round"
          />
          {logo ? null : (
            <>
              <polygon
                points={TRI}
                fill="url(#strokeDrawFill)"
                opacity={fill}
              />
              <polygon
                points={TRI}
                fill="none"
                stroke={accent}
                strokeWidth={2.5}
                strokeDasharray={TRI_LEN}
                strokeDashoffset={triOffset}
                strokeLinejoin="round"
              />
            </>
          )}
        </svg>
        {logo ? (
          <div
            style={{
              position: "absolute",
              left: 120,
              top: 120,
              width: 180,
              height: 180,
              borderRadius: 32,
              overflow: "hidden",
              opacity: fill,
            }}
          >
            <TemplateImage src={logo} style={{ objectFit: "contain" }} />
          </div>
        ) : null}
      </div>
      <div
        style={{
          fontSize: fitFontSize(plain(title), 120, 64, 11),
          fontWeight: 900,
          lineHeight: 1.05,
          color: colors.text,
          opacity: nameIn,
          transform: `translateY(${(1 - nameIn) * 20}px)`,
        }}
      >
        <Emphasis text={title} color={accent} />
      </div>
      <div
        style={{
          fontSize: 46,
          fontWeight: 600,
          lineHeight: 1.3,
          color: colors.muted,
          opacity: subIn,
        }}
      >
        {subtitle}
      </div>
    </div>
  );
}
