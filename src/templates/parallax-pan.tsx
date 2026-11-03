"use client";
// Diadaptasi dari RVE Remotion Templates (MIT, https://www.reactvideoeditor.com):
// next/image -> <Img> Remotion, animasi CSS -> interpolasi berbasis frame.
import React from "react";
import { Easing, Img, useCurrentFrame, useVideoConfig } from "remotion";

interface ParallaxPanProps {
  imageUrl?: string;
  duration?: number;
  direction?: "left-right" | "right-left" | "top-bottom" | "bottom-top";
  scale?: number;
}

export const ParallaxPan: React.FC<ParallaxPanProps> = ({
  imageUrl = "https://images.pexels.com/photos/1644724/pexels-photo-1644724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  duration = 15,
  direction = "left-right",
  scale = 1.2,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Bolak-balik (alternate) dengan ease-out, seperti animasi CSS aslinya.
  const phase = (frame / (duration * fps)) % 2;
  const t = phase <= 1 ? phase : 2 - phase;
  const eased = Easing.out(Easing.ease)(t);

  const horizontal = direction === "left-right" || direction === "right-left";
  const forward = direction === "left-right" || direction === "top-bottom";
  const from = forward ? 0 : -20;
  const to = forward ? -20 : 0;
  const offset = from + (to - from) * eased;
  const translate = horizontal
    ? `translateX(${offset}%)`
    : `translateY(${offset}%)`;

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
          transform: `${translate} scale(${scale})`,
        }}
      />
    </div>
  );
};

export default ParallaxPan;
