import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS, DISSOLVE, S } from "../../constants";

// ---------------------------------------------------------------------------
// Shot 1 — Federal building exterior (0–4s, 0–120f relative)
// Wide establishing, slow push in
// ---------------------------------------------------------------------------
const Shot1: React.FC<{ f: number }> = ({ f }) => {
  const scale = interpolate(f, [0, 120], [1.0, 1.06], { extrapolateRight: "clamp" });
  const opacity = interpolate(f, [0, 20, 100, 120], [0, 1, 1, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity }}>
      <div style={{ width: "100%", height: "100%", transform: `scale(${scale})`, transformOrigin: "center" }}>
        {/* Sky gradient */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, #0a0e14 0%, #0e1520 60%, #141e2e 100%)",
        }} />

        {/* Ground line */}
        <div style={{
          position: "absolute", bottom: 240, left: 0, right: 0,
          height: 2, background: COLORS.accentDim, opacity: 0.4,
        }} />

        {/* Main building body */}
        <div style={{
          position: "absolute", bottom: 242, left: "50%",
          transform: "translateX(-50%)",
          width: 480, height: 420,
          background: COLORS.surfaceMid,
          borderTop: `2px solid ${COLORS.accentDim}`,
        }} />

        {/* Building columns */}
        {[0, 1, 2, 3, 4].map((col) => (
          <div key={col} style={{
            position: "absolute", bottom: 242,
            left: `calc(50% - 240px + ${col * 96 + 24}px)`,
            width: 16, height: 340,
            background: COLORS.surfaceLight,
            opacity: 0.7,
          }} />
        ))}

        {/* Window grid — 4 rows × 6 cols */}
        {Array.from({ length: 4 }).map((_, row) =>
          Array.from({ length: 6 }).map((_, col) => (
            <div key={`${row}-${col}`} style={{
              position: "absolute",
              bottom: 300 + row * 76,
              left: `calc(50% - 220px + ${col * 72}px)`,
              width: 40, height: 52,
              background: COLORS.accent,
              opacity: 0.25 + Math.sin((row + col) * 1.2) * 0.1,
              border: `1px solid ${COLORS.accentDim}`,
            }} />
          ))
        )}

        {/* Pediment / roof edge */}
        <svg
          style={{ position: "absolute", bottom: 660, left: "50%", transform: "translateX(-50%)" }}
          width={520} height={60} viewBox="0 0 520 60"
        >
          <polygon points="260,0 0,60 520,60" fill={COLORS.surface} />
          <line x1="0" y1="60" x2="520" y2="60" stroke={COLORS.accentDim} strokeWidth="2" opacity={0.5} />
        </svg>

        {/* Flag pole */}
        <div style={{
          position: "absolute", bottom: 660, left: "calc(50% + 280px)",
          width: 3, height: 160,
          background: COLORS.secondary, opacity: 0.7,
        }} />
        {/* Flag */}
        <div style={{
          position: "absolute", bottom: 780, left: "calc(50% + 283px)",
          width: 50, height: 30,
          background: "linear-gradient(180deg, #8b0000 0%, #8b0000 33%, #e8eaec 33%, #e8eaec 66%, #1a3a6b 66%, #1a3a6b 100%)",
          opacity: 0.85,
        }} />

        {/* Wide steps at base */}
        {[0, 1, 2].map((step) => (
          <div key={step} style={{
            position: "absolute", bottom: 242 - step * 12,
            left: `calc(50% - ${200 + step * 40}px)`,
            width: 400 + step * 80, height: 12,
            background: COLORS.surfaceLight,
            borderTop: `1px solid ${COLORS.accentDim}`,
          }} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Shot 2 — Warehouse interior (4–8s, 120–240f relative)
// Wide, pan left-to-right
// ---------------------------------------------------------------------------
const Shot2: React.FC<{ f: number }> = ({ f }) => {
  const relF = f - 120;
  const panX = interpolate(relF, [0, 120], [0, -120], { extrapolateRight: "clamp" });
  const opacity = interpolate(relF, [0, 18, 100, 120], [0, 1, 1, 0], { extrapolateRight: "clamp" });

  // generate shelving units
  const shelfCount = 7;

  return (
    <AbsoluteFill style={{ opacity }}>
      <div style={{
        width: "110%", height: "100%",
        transform: `translateX(${panX}px)`,
        position: "relative",
        background: "linear-gradient(180deg, #080b10 0%, #0e1420 40%, #121820 100%)",
      }}>
        {/* Floor */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 280,
          background: "linear-gradient(180deg, #0d1219 0%, #141c28 100%)",
          borderTop: `1px solid ${COLORS.accentDim}`,
        }} />

        {/* Perspective floor lines */}
        {[1, 2, 3, 4].map((line) => (
          <div key={line} style={{
            position: "absolute", bottom: line * 60,
            left: 0, right: 0, height: 1,
            background: COLORS.accentDim, opacity: 0.25,
          }} />
        ))}

        {/* Ceiling */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 100,
          background: COLORS.surface,
          borderBottom: `2px solid ${COLORS.accentDim}`,
        }} />

        {/* Overhead lights */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{
            position: "absolute", top: 95,
            left: 160 + i * 260, width: 120, height: 6,
            background: COLORS.accentBright, opacity: 0.4,
            boxShadow: `0 4px 40px 8px ${COLORS.accentBright}22`,
          }} />
        ))}

        {/* Shelf units */}
        {Array.from({ length: shelfCount }).map((_, s) => (
          <div key={s} style={{ position: "absolute", bottom: 280, left: 80 + s * 260 }}>
            {/* Vertical uprights */}
            <div style={{ position: "absolute", left: 0, bottom: 0, width: 8, height: 480, background: COLORS.surfaceLight }} />
            <div style={{ position: "absolute", left: 192, bottom: 0, width: 8, height: 480, background: COLORS.surfaceLight }} />
            {/* Shelf planks — 5 levels */}
            {[0, 1, 2, 3, 4].map((level) => (
              <div key={level} style={{
                position: "absolute", left: 0, bottom: level * 96,
                width: 200, height: 8,
                background: COLORS.surfaceMid,
                borderTop: `1px solid ${COLORS.accentDim}`,
              }}>
                {/* Products on shelf */}
                {Array.from({ length: 4 }).map((__, p) => (
                  <div key={p} style={{
                    position: "absolute", bottom: 8, left: p * 48 + 6,
                    width: 36,
                    height: [52, 44, 60, 48][p % 4],
                    background: [COLORS.accentDim, COLORS.surfaceLight, COLORS.accent + "88", COLORS.surfaceMid][p % 4],
                    borderTop: `2px solid ${COLORS.accentDim}`,
                    opacity: 0.8,
                  }} />
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Shot 3 — Worker at workstation / manifest screen (8–12s, 240–360f relative)
// Medium close-up, static, shallow depth of field blur on bg
// ---------------------------------------------------------------------------
const Shot3: React.FC<{ f: number }> = ({ f }) => {
  const relF = f - 240;
  const opacity = interpolate(relF, [0, 18, 100, 120], [0, 1, 1, 0], { extrapolateRight: "clamp" });

  // Screen content row animation — simulates scanning an order manifest
  const rowOpacity = (row: number) => interpolate(relF, [row * 6, row * 6 + 12], [0, 1], { extrapolateRight: "clamp" });

  const orderLines = [
    { id: "OFP-2026-0041", desc: "Janitorial Supplies — Bulk", qty: "240 units", status: "CONFIRMED" },
    { id: "OFP-2026-0042", desc: "Office Paper — Case",        qty: "180 units", status: "CONFIRMED" },
    { id: "OFP-2026-0043", desc: "Safety Equipment — PPE Kit", qty: "96 units",  status: "PENDING"   },
    { id: "OFP-2026-0044", desc: "Cleaning Chemicals — 55gal", qty: "24 units",  status: "CONFIRMED" },
    { id: "OFP-2026-0045", desc: "Trash Liners — Palletized",  qty: "500 units", status: "CONFIRMED" },
  ];

  return (
    <AbsoluteFill style={{ opacity }}>
      {/* Blurred background — desk environment */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, #0a0d12 0%, #10161e 100%)",
        filter: "blur(4px)",
      }}>
        {/* Abstract desk surface */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 400,
          background: COLORS.surface, borderTop: `2px solid ${COLORS.accentDim}`,
        }} />
      </div>

      {/* Monitor — sharp / in focus */}
      <div style={{
        position: "absolute",
        top: "50%", left: "50%",
        transform: "translate(-50%, -54%)",
        width: 780, height: 500,
        background: "#080c10",
        border: `2px solid ${COLORS.accentDim}`,
        borderRadius: 4,
        overflow: "hidden",
        boxShadow: `0 0 60px ${COLORS.accent}22, inset 0 0 20px rgba(0,0,0,0.8)`,
      }}>
        {/* Monitor header bar */}
        <div style={{
          padding: "14px 24px",
          background: COLORS.surfaceMid,
          borderBottom: `1px solid ${COLORS.accentDim}`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ color: COLORS.secondary, fontFamily: "monospace", fontSize: 18 }}>
            ORDER FULFILLMENT — PENDING MANIFEST
          </span>
          <span style={{ color: COLORS.accent, fontFamily: "monospace", fontSize: 16 }}>
            {`${new Date("2026-03-24").toLocaleDateString("en-US")}`}
          </span>
        </div>

        {/* Order rows */}
        <div style={{ padding: "12px 24px" }}>
          {/* Header row */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 2fr 1fr 1fr",
            color: COLORS.secondary, fontFamily: "monospace", fontSize: 15,
            borderBottom: `1px solid ${COLORS.accentDim}`, paddingBottom: 8, marginBottom: 8,
          }}>
            <span>ORDER ID</span><span>DESCRIPTION</span><span>QTY</span><span>STATUS</span>
          </div>
          {orderLines.map((line, i) => (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "1fr 2fr 1fr 1fr",
              color: COLORS.primary, fontFamily: "monospace", fontSize: 15,
              padding: "7px 0", borderBottom: `1px solid ${COLORS.grid}`,
              opacity: rowOpacity(i),
            }}>
              <span style={{ color: COLORS.secondary }}>{line.id}</span>
              <span>{line.desc}</span>
              <span>{line.qty}</span>
              <span style={{ color: line.status === "CONFIRMED" ? COLORS.accentBright : COLORS.secondary }}>
                {line.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Monitor stand */}
      <div style={{
        position: "absolute",
        top: "calc(50% + 200px)",
        left: "50%", transform: "translateX(-50%)",
        width: 80, height: 60,
        background: COLORS.surfaceMid,
        clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
      }} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Intro — sequence wrapper
// ---------------------------------------------------------------------------
export const Intro: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <Shot1 f={frame} />
      <Shot2 f={frame} />
      <Shot3 f={frame} />
    </AbsoluteFill>
  );
};
