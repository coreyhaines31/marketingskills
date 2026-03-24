import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { CAPTIONS, COLORS, FADE } from "../../constants";

/**
 * Renders voiceover captions — one line at a time, bottom of frame.
 * Each caption fades in and out according to its timing window.
 */
export const Caption: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: "absolute",
        bottom: 64,
        left: "50%",
        transform: "translateX(-50%)",
        width: "80%",
        textAlign: "center",
        pointerEvents: "none",
      }}
    >
      {CAPTIONS.map((cap, i) => {
        if (frame < cap.from - FADE || frame > cap.to + FADE) return null;

        const opacity = interpolate(
          frame,
          [cap.from - FADE, cap.from, cap.to - FADE, cap.to],
          [0, 1, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        return (
          <div
            key={i}
            style={{
              opacity,
              backgroundColor: COLORS.caption,
              color: COLORS.primary,
              fontFamily: "'Inter', 'DIN', 'Arial', sans-serif",
              fontSize: 28,
              fontWeight: 400,
              lineHeight: 1.5,
              padding: "10px 24px",
              borderRadius: 4,
              letterSpacing: "0.01em",
            }}
          >
            {cap.text}
          </div>
        );
      })}
    </div>
  );
};
