// Diadaptasi dari "stat-counter" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Angka besar yang menghitung naik, dengan label dan keterangan kecil.
// Props: value (angka), unit (akhiran), title (label), subtitle (keterangan), accent.
import { interpolate, spring } from "remotion";
import {
  clamp,
  colors,
  contentArea,
  Emphasis,
  fitFontSize,
  formatNumber,
  sansFont,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  value: 1247,
  unit: "ms",
  title: "Waktu muat *sebelum* dioptimasi",
  subtitle: "↓ 85% setelah pakai cache",
};

export default function StatCounter(props: TemplateProps) {
  const { value, unit, title, subtitle, accent, frame, fps } = useTemplate(
    props,
    defaults,
  );

  const pop = spring({ frame, fps, config: { damping: 12, stiffness: 100 } });
  const decimals = Number.isInteger(value) ? 0 : 1;
  const count = interpolate(frame, [8, 8 + fps * 1.6], [0, value], {
    ...clamp,
    easing: (t) => 1 - (1 - t) ** 3,
  });
  const label = formatNumber(count, decimals) + unit;
  const subIn = interpolate(frame, [fps * 1.2, fps * 1.7], [0, 1], clamp);

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
          padding: "80px 48px",
          borderRadius: 40,
          textAlign: "center",
          background: "rgba(17, 24, 39, 0.72)",
          border: `2px solid ${colors.surfaceAlt}`,
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.35)",
          transform: `scale(${pop})`,
        }}
      >
        <div
          style={{
            fontSize: fitFontSize(
              formatNumber(value, decimals) + unit,
              220,
              120,
              6,
            ),
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: -4,
            color: accent,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {label}
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 54,
            fontWeight: 800,
            lineHeight: 1.2,
            color: colors.text,
          }}
        >
          <Emphasis text={title} color={accent} />
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 42,
            fontWeight: 600,
            color: colors.highlight,
            opacity: subIn,
            transform: `translateY(${(1 - subIn) * 20}px)`,
          }}
        >
          {subtitle}
        </div>
      </div>
    </div>
  );
}
