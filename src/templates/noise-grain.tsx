// Diadaptasi dari "noise-grain" (RVE Remotion Templates, MIT, https://www.reactvideoeditor.com).
// Tekstur grain film yang berganti tiap frame, di atas judul.
// Props: title, subtitle, accent.
import { random } from "remotion";
import {
  TitleCard,
  useTemplate,
  type TemplateProps,
} from "../lib/template-kit";

const defaults = {
  title: "Kode *lawas*",
  subtitle: "Masih jalan, tapi berdebu",
};

export default function NoiseGrain(props: TemplateProps) {
  const { title, subtitle, accent, frame, width, height } = useTemplate(
    props,
    defaults,
  );
  // Pola grain baru tiap 2 frame, dari seed deterministik.
  const step = Math.floor(frame / 2);
  const seed = Math.floor(random(`grain-${step}`) * 1000);
  const flicker = 0.85 + random(`flicker-${step}`) * 0.15;

  return (
    <>
      <TitleCard title={title} subtitle={subtitle} accent={accent} />
      <svg
        width={width}
        height={height}
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.16 * flicker,
          mixBlendMode: "overlay",
        }}
      >
        <filter id="noise-grain-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency={0.9}
            numOctaves={2}
            seed={seed}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise-grain-filter)" />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)",
        }}
      />
    </>
  );
}
