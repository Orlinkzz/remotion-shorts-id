import React from "react";

/** Teks dengan segmen *beraksen* yang diberi warna. */
export const Emphasis: React.FC<{ text: string; color: string }> = ({
  text,
  color,
}) => (
  <>
    {text.split(/(\*[^*]+\*)/g).map((part, i) =>
      part.length > 2 && part.startsWith("*") && part.endsWith("*") ? (
        <span key={i} style={{ color }}>
          {part.slice(1, -1)}
        </span>
      ) : (
        <React.Fragment key={i}>{part}</React.Fragment>
      ),
    )}
  </>
);
