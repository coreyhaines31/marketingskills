import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { OVERLAYS, COLORS, FADE } from "../../constants";

const FONT_SIZES: Record<string, number> = { sm: 32, md: 52, lg: 72 };

/**
 * Renders the minimal on-screen text overlays defined in the storyboard.
 * Each overlay fades in cleanly and holds for its window.
 */
export const OnScreenText: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <>
      {OVERLAYS.map((ov, i) => {
        if (frame < ov.from - FADE || frame > ov.to + FADE) return null;

        const opacity = interpolate(
          frame,
          [ov.from - FADE, ov.from, ov.to - FADE, ov.to],
          [0, 1, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        const isSm = ov.size === "sm";
        const isLg = ov.size === "lg";

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              ...(isSm
                ? { bottom: 140, left: 80 }      // lower-third placement for brand intro
                : isLg
                ? { top: "50%", left: "50%", transform: "translate(-50%, -50%)" } // centered for final title
                : { top: "50%", left: "50%", transform: "translate(-50%, -50%)" }),
              opacity,
              color: COLORS.primary,
              fontFamily: "'Inter', 'DIN', 'Arial', sans-serif",
              fontSize: FONT_SIZES[ov.size] ?? 52,
              fontWeight: isSm ? 300 : 600,
              letterSpacing: isLg ? "0.08em" : "0.04em",
              textTransform: isLg ? "uppercase" : "none",
              textAlign: "center",
              whiteSpace: "nowrap",
              textShadow: "0 2px 12px rgba(0,0,0,0.8)",
            }}
          >
            {ov.text}
          </div>
        );
      })}
    </>
  );
};
