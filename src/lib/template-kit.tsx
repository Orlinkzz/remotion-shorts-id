// Alat bersama untuk src/templates/*. Semua template memakai props yang sama
// (TemplateProps), warna/font dari theme, dan area aman 9:16 dari contentArea.
import type React from "react";
import {
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Emphasis } from "../components/Emphasis";
import { monoFont, sansFont } from "../fonts";
import { contentArea, theme } from "../theme";
import type { TemplateSceneProps } from "./schema";

export type TemplateProps = TemplateSceneProps;

export const colors = theme.colors;
export { contentArea, Emphasis, monoFont, sansFont, theme };

/** Opsi interpolate yang hampir selalu dipakai. */
export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

/** Palet untuk seri chart / item berwarna, dimulai dari warna aksen. */
export const palette = (accent: string): string[] => [
  accent,
  colors.accent2,
  colors.highlight,
  "#F472B6",
  "#FBBF24",
  "#FB7185",
  "#34D399",
  "#818CF8",
];

/**
 * Menggabungkan props scene dengan contoh bawaan template, plus nilai yang
 * sering dipakai: frame, fps, durasi scene, dan progres 0..1 sepanjang scene.
 * Durasi = panjang scene di video (dari Sequence), bukan durasi tetap.
 */
export const useTemplate = <D extends TemplateProps>(
  props: TemplateProps,
  defaults: D,
) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const merged = { ...defaults, ...stripUndefined(props) } as D & TemplateProps;
  return {
    ...merged,
    accent: merged.accent ?? colors.accent,
    frame,
    fps,
    width,
    height,
    durationInFrames,
    progress: interpolate(
      frame,
      [0, Math.max(1, durationInFrames - 1)],
      [0, 1],
      clamp,
    ),
  };
};

const stripUndefined = (o: object) =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined));

/** Opacity keluar di ujung scene (0 = tanpa fade-out). */
export const useExit = (frames = 10) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  if (frames <= 0) return 1;
  return interpolate(
    frame,
    [durationInFrames - frames, durationInFrames],
    [1, 0],
    clamp,
  );
};

/** Ukuran font mengecil untuk teks panjang, di antara max dan min. */
export const fitFontSize = (
  text: string,
  max: number,
  min: number,
  charsAtMax = 16,
) =>
  Math.round(
    Math.max(min, Math.min(max, (max * charsAtMax) / Math.max(1, text.length))),
  );

/** Teks tanpa penanda *aksen*, untuk dihitung/dipotong per huruf. */
export const plain = (text: string) => text.replace(/\*/g, "");

/** Pasangan label + nilai untuk chart; panjang mengikuti yang terpendek. */
export const series = (items: string[], values: number[]) =>
  items
    .slice(0, values.length)
    .map((label, i) => ({ label, value: values[i] }));

/** Format angka gaya Indonesia: 12.500 / 3,5. */
export const formatNumber = (n: number, decimals = 0) =>
  n.toLocaleString("id-ID", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

/**
 * Path gambar relatif ke folder video -> URL staticFile.
 * URL http(s)/data: dan path absolut ("/...") dibiarkan.
 */
export const resolveAsset = (videoId: string | undefined, src: string) => {
  if (/^(https?:|data:|blob:)/.test(src)) return src;
  if (src.startsWith("/")) return staticFile(src.slice(1));
  const clean = src.replace(/^\.\//, "");
  return staticFile(videoId ? `videos/${videoId}/${clean}` : clean);
};

/**
 * Gambar template. Tanpa src (props images kosong) tampil kotak gradien
 * bernomor supaya template tetap jalan tanpa internet dan tanpa aset.
 */
export const TemplateImage: React.FC<{
  src?: string;
  index?: number;
  label?: string;
  style?: React.CSSProperties;
}> = ({ src, index = 0, label, style }) => {
  if (src) {
    return (
      <Img
        src={src}
        style={{ width: "100%", height: "100%", objectFit: "cover", ...style }}
      />
    );
  }
  const hues = [
    [colors.accent, colors.accent2],
    [colors.accent2, "#F472B6"],
    ["#34D399", colors.accent],
    ["#FBBF24", "#FB7185"],
  ][index % 4];
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(135deg, ${hues[0]}, ${hues[1]})`,
        color: "rgba(255,255,255,0.85)",
        fontFamily: sansFont,
        fontWeight: 900,
        fontSize: 120,
        ...style,
      }}
    >
      {label ?? index + 1}
    </div>
  );
};

/** Judul standar template: tebal, *aksen* berwarna, mengecil kalau panjang. */
export const TemplateTitle: React.FC<{
  text: string;
  accent: string;
  max?: number;
  min?: number;
  style?: React.CSSProperties;
}> = ({ text, accent, max = 104, min = 60, style }) => (
  <div
    style={{
      fontFamily: sansFont,
      fontSize: fitFontSize(plain(text), max, min, 14),
      fontWeight: 900,
      lineHeight: 1.08,
      color: colors.text,
      textShadow: "0 6px 24px rgba(0,0,0,0.35)",
      ...style,
    }}
  >
    <Emphasis text={text} color={accent} />
  </div>
);

/**
 * Progres transisi 0..1 untuk template transisi (layar A -> layar B).
 * Layar A tampil dulu (~30% scene), lalu transisi berjalan ~0,8 dtk.
 */
export const useTransitionProgress = (
  easing: (t: number) => number = Easing.inOut(Easing.cubic),
) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const start = Math.min(Math.round(durationInFrames * 0.3), fps * 2);
  const length = Math.max(
    6,
    Math.min(Math.round(fps * 0.8), durationInFrames - start - 1),
  );
  return interpolate(frame, [start, start + length], [0, 1], {
    ...clamp,
    easing,
  });
};

/** Kartu judul + subjudul di tengah area aman (dipakai template transisi, dsb.). */
export const TitleCard: React.FC<{
  title: string;
  subtitle?: string;
  accent: string;
  background?: string;
  style?: React.CSSProperties;
}> = ({ title, subtitle, accent, background, style }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background,
      ...style,
    }}
  >
    <div
      style={{
        ...contentArea,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        gap: 32,
      }}
    >
      <div
        style={{
          width: 120,
          height: 12,
          borderRadius: 6,
          background: `linear-gradient(90deg, ${accent}, ${colors.accent2})`,
        }}
      />
      <TemplateTitle text={title} accent={accent} />
      {subtitle ? (
        <div
          style={{
            fontFamily: sansFont,
            fontSize: 50,
            fontWeight: 600,
            lineHeight: 1.3,
            color: colors.muted,
          }}
        >
          {subtitle}
        </div>
      ) : null}
    </div>
  </div>
);
