import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS, S, DISSOLVE } from "../../constants";

// ---------------------------------------------------------------------------
// Shot 12 — Summit room setup, slow pan (60–66s)
// ---------------------------------------------------------------------------
const Shot12: React.FC<{ f: number }> = ({ f }) => {
  const relF = f - S(60);
  const dur = S(6);
  const opacity = interpolate(relF, [0, 18, dur - 18, dur], [0, 1, 1, 0], { extrapolateRight: "clamp" });
  const panX    = interpolate(relF, [0, dur], [60, -60], { extrapolateRight: "clamp" });

  const rowCount = 6;
  const colCount = 8;

  return (
    <AbsoluteFill style={{ opacity }}>
      <div style={{
        position: "absolute", inset: 0,
        background: COLORS.bg,
        overflow: "hidden",
      }}>
        <div style={{ transform: `translateX(${panX}px)`, width: "110%", height: "100%", position: "relative" }}>
          {/* Room floor */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 380,
            background: "linear-gradient(180deg, #0e1420 0%, #12192a 100%)",
            borderTop: `1px solid ${COLORS.accentDim}`,
          }} />

          {/* Stage/front platform */}
          <div style={{
            position: "absolute", bottom: 380, left: "50%",
            transform: "translateX(-50%)",
            width: 900, height: 28,
            background: COLORS.surfaceMid,
            borderTop: `3px solid ${COLORS.accent}`,
          }} />

          {/* Projection screen */}
          <div style={{
            position: "absolute", bottom: 410, left: "50%",
            transform: "translateX(-50%)",
            width: 640, height: 360,
            background: COLORS.surface,
            border: `3px solid ${COLORS.accentDim}`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {/* Screen content — summit branding */}
            <div style={{ textAlign: "center" }}>
              <div style={{
                color: COLORS.primary, fontFamily: "'Inter', 'Arial', sans-serif",
                fontSize: 28, fontWeight: 700, letterSpacing: "0.1em",
                textTransform: "uppercase", marginBottom: 12,
              }}>
                ENVISION
              </div>
              <div style={{
                color: COLORS.secondary, fontFamily: "'Inter', 'Arial', sans-serif",
                fontSize: 16, letterSpacing: "0.08em", textTransform: "uppercase",
              }}>
                2026 Supplier Summit
              </div>
              <div style={{
                width: 120, height: 2, background: COLORS.accent,
                margin: "16px auto 0",
              }} />
            </div>
          </div>

          {/* Attendee rows — chairs and tables */}
          {Array.from({ length: rowCount }).map((_, row) => (
            <div key={row} style={{
              position: "absolute",
              bottom: 380 + row * 80,
              left: "50%",
              transform: "translateX(-50%)",
            }}>
              {/* Table surface */}
              <div style={{
                width: 1100, height: 16,
                background: COLORS.surfaceMid,
                border: `1px solid ${COLORS.accentDim}`,
                marginBottom: 4,
              }}>
                {/* Items on table — water bottles, folders */}
                {Array.from({ length: colCount }).map((_, col) => (
                  <div key={col} style={{
                    position: "absolute",
                    top: -12, left: col * 137 + 52,
                    display: "flex", gap: 6,
                  }}>
                    <div style={{ width: 8,  height: 20, background: COLORS.accentDim, opacity: 0.6, borderRadius: 2 }} />
                    <div style={{ width: 28, height: 14, background: COLORS.accent + "55", opacity: 0.7 }} />
                  </div>
                ))}
              </div>

              {/* Chairs */}
              <div style={{ display: "flex", gap: 64, justifyContent: "center" }}>
                {Array.from({ length: colCount }).map((_, col) => (
                  <div key={col} style={{ position: "relative", opacity: 0.7 }}>
                    {/* Chair seat */}
                    <div style={{
                      width: 44, height: 20,
                      background: COLORS.surface,
                      border: `1px solid ${COLORS.accentDim}`,
                    }} />
                    {/* Person seated silhouette (alternating present/absent) */}
                    {(row + col) % 3 !== 0 && (
                      <div style={{
                        position: "absolute", top: -40, left: 8,
                        width: 28, height: 40,
                        background: COLORS.secondary, opacity: 0.5,
                        borderRadius: "50% 50% 0 0",
                      }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* A/V podium */}
          <div style={{
            position: "absolute", bottom: 408, left: "calc(50% + 380px)",
            width: 80, height: 100,
            background: COLORS.surfaceMid,
            borderTop: `2px solid ${COLORS.accent}`,
            clipPath: "polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)",
          }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Shot 13 — Speaker at podium (66–72s)
// ---------------------------------------------------------------------------
const Shot13: React.FC<{ f: number }> = ({ f }) => {
  const relF = f - S(66);
  const dur = S(6);
  const opacity = interpolate(relF, [0, 18, dur - 18, dur], [0, 1, 1, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, #080c12 0%, #0e1420 100%)",
      }}>
        {/* Stage platform */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 240,
          background: COLORS.surface,
          borderTop: `3px solid ${COLORS.accent}`,
        }} />

        {/* Spotlight cone from above */}
        <svg style={{ position: "absolute", inset: 0, opacity: 0.12 }}
          width={1920} height={1080} viewBox="0 0 1920 1080"
        >
          <defs>
            <radialGradient id="spot" cx="50%" cy="0%" r="60%">
              <stop offset="0%"   stopColor={COLORS.accentBright} stopOpacity={1} />
              <stop offset="100%" stopColor={COLORS.bg}           stopOpacity={0} />
            </radialGradient>
          </defs>
          <ellipse cx={960} cy={600} rx={300} ry={480} fill="url(#spot)" />
        </svg>

        {/* Podium */}
        <div style={{
          position: "absolute", bottom: 240, left: "50%",
          transform: "translateX(-50%)",
          width: 160, height: 240,
          background: COLORS.surfaceMid,
          borderTop: `2px solid ${COLORS.accent}`,
          clipPath: "polygon(8% 0%, 92% 0%, 100% 100%, 0% 100%)",
        }}>
          {/* Podium mic */}
          <div style={{
            position: "absolute", top: -60, left: "50%",
            transform: "translateX(-50%)",
            width: 4, height: 60,
            background: COLORS.secondary, opacity: 0.7,
          }} />
          <div style={{
            position: "absolute", top: -72, left: "50%",
            transform: "translateX(-50%)",
            width: 16, height: 16, borderRadius: "50%",
            background: COLORS.secondary, opacity: 0.7,
          }} />
        </div>

        {/* Speaker silhouette */}
        <svg style={{
          position: "absolute", bottom: 464, left: "50%",
          transform: "translateX(-50%)",
          opacity: 0.75,
        }}
          width={220} height={380} viewBox="0 0 220 380"
        >
          {/* Head */}
          <circle cx={110} cy={40} r={36} fill={COLORS.secondary} />
          {/* Neck */}
          <rect x={98} y={72} width={24} height={24} fill={COLORS.secondary} />
          {/* Shoulders / torso — suit */}
          <path d="M 20 100 Q 60 80 110 96 Q 160 80 200 100 L 195 300 L 25 300 Z"
            fill={COLORS.surfaceLight} />
          {/* Lapel details */}
          <path d="M 110 96 L 85 140 L 110 160 L 135 140 Z"
            fill={COLORS.surfaceMid} opacity={0.8} />
          {/* Arms — slightly gestural, forward-leaning */}
          <path d="M 25 110 Q 10 180 20 240 L 36 240 Q 30 180 40 110 Z"
            fill={COLORS.surfaceLight} />
          <path d="M 195 110 Q 210 180 200 240 L 184 240 Q 190 180 180 110 Z"
            fill={COLORS.surfaceLight} />
          {/* Hands on podium suggestion */}
          <ellipse cx={24}  cy={248} rx={14} ry={9} fill={COLORS.secondary} opacity={0.6} />
          <ellipse cx={196} cy={248} rx={14} ry={9} fill={COLORS.secondary} opacity={0.6} />
        </svg>

        {/* Background audience silhouettes — very faint */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 200,
          opacity: 0.12,
          background: `repeating-linear-gradient(90deg, ${COLORS.secondary} 0px, ${COLORS.secondary} 28px, transparent 28px, transparent 96px)`,
          maskImage: "linear-gradient(180deg, transparent 0%, #000 100%)",
        }} />
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Shot 14 — Logo lockup / title card (72–80s)
// Fade in centered title, hold, fade to black
// ---------------------------------------------------------------------------
const Shot14: React.FC<{ f: number }> = ({ f }) => {
  const relF = f - S(72);
  const dur = S(8);
  const opacity      = interpolate(relF, [0, 24, dur - 18, dur], [0, 1, 1, 0], { extrapolateRight: "clamp" });
  const logoScale    = interpolate(relF, [0, 24], [0.9, 1.0], { extrapolateRight: "clamp" });
  const dividerWidth = interpolate(relF, [12, 36], [0, 320], { extrapolateRight: "clamp" });
  const subOpacity   = interpolate(relF, [18, 36], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity }}>
      <div style={{
        position: "absolute", inset: 0,
        background: COLORS.bg,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 0,
      }}>
        {/* Subtle background grid */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.06,
          background: `
            linear-gradient(${COLORS.accentDim} 1px, transparent 1px),
            linear-gradient(90deg, ${COLORS.accentDim} 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }} />

        {/* Logo / brand mark */}
        <div style={{
          transform: `scale(${logoScale})`,
          transformOrigin: "center",
          textAlign: "center",
        }}>
          {/* Envision wordmark */}
          <div style={{
            color: COLORS.primary,
            fontFamily: "'Inter', 'DIN', 'Arial', sans-serif",
            fontSize: 96,
            fontWeight: 200,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            textIndent: "0.32em",
            lineHeight: 1,
          }}>
            ENVISION
          </div>

          {/* Divider */}
          <div style={{
            width: dividerWidth,
            height: 2,
            background: COLORS.accent,
            margin: "24px auto",
            transition: "width 0.3s ease",
          }} />

          {/* Summit subtitle */}
          <div style={{
            opacity: subOpacity,
            color: COLORS.secondary,
            fontFamily: "'Inter', 'DIN', 'Arial', sans-serif",
            fontSize: 28,
            fontWeight: 400,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            textIndent: "0.22em",
          }}>
            2026 Supplier Summit
          </div>

          {/* Year mark */}
          <div style={{
            opacity: subOpacity * 0.6,
            color: COLORS.accentDim,
            fontFamily: "monospace",
            fontSize: 15,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            marginTop: 20,
          }}>
            Base Supply Center · AbilityOne Program
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Close — sequence wrapper (60–80s)
// ---------------------------------------------------------------------------
export const Close: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <Shot12 f={frame} />
      <Shot13 f={frame} />
      <Shot14 f={frame} />
    </AbsoluteFill>
  );
};
