"use client";
// Diadaptasi dari RVE Remotion Templates (MIT, https://www.reactvideoeditor.com):
// next/image -> <Img> Remotion, animasi CSS -> interpolasi berbasis frame.
import React from "react";
import { Img, useCurrentFrame, useVideoConfig } from "remotion";

interface ZoomPulseProps {
  imageUrl?: string;
  duration?: number;
  minScale?: number;
  maxScale?: number;
}

export const ZoomPulse: React.FC<ZoomPulseProps> = ({
  imageUrl = "https://images.pexels.com/photos/1726310/pexels-photo-1726310.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  duration = 4,
  minScale = 1,
  maxScale = 1.1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const phase = (frame / (duration * fps)) % 1;
  const wave = (1 - Math.cos(phase * Math.PI * 2)) / 2; // 0 -> 1 -> 0
  const scale = minScale + (maxScale - minScale) * wave;

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
        overflow: "hidden",
      }}
    >
      <Img
        src={imageUrl}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale})`,
        }}
      />
    </div>
  );
};

export default ZoomPulse;
