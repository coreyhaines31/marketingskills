import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS, S } from "../../constants";

// ---------------------------------------------------------------------------
// Shot 4 — Product label close-up (12–17s)
// Rack focus: label sharp, shelf bg soft → label soft, shelf sharp
// ---------------------------------------------------------------------------
const Shot4: React.FC<{ f: number }> = ({ f }) => {
  // f is absolute frame; shot runs 360–510
  const relF = f - S(12);
  const dur = S(5);
  const opacity = interpolate(relF, [0, 18, dur - 18, dur], [0, 1, 1, 0], { extrapolateRight: "clamp" });

  // Rack focus: fg blur decreases, bg blur increases over time
  const bgBlur  = interpolate(relF, [0, dur], [2, 6],  { extrapolateRight: "clamp" });
  const fgBlur  = interpolate(relF, [0, dur], [0, 3],  { extrapolateRight: "clamp" });
  const labelY  = interpolate(relF, [0, dur], [0, -8], { extrapolateRight: "clamp" }); // subtle lift

  const labelLines = [
    { bold: true,  text: "ENVISION PROCUREMENT CATALOG" },
    { bold: false, text: "Item No. EP-4481-C" },
    { bold: false, text: "Janitorial Supply — Industrial Grade" },
    { bold: false, text: "Contract: GS-07F-0041N" },
    { bold: true,  text: "APPROVED VENDOR" },
  ];

  return (
    <AbsoluteFill style={{ opacity }}>
      {/* Background — blurred shelf rows */}
      <div style={{
        position: "absolute", inset: 0,
        background: COLORS.bg,
        filter: `blur(${bgBlur}px)`,
      }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            top: 60 + i * 128,
            left: 0, right: 0, height: 16,
            background: COLORS.surfaceLight,
            opacity: 0.6,
          }} />
        ))}
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            top: 76 + Math.floor(i / 5) * 128,
            left: 40 + (i % 5) * 190,
            width: 140, height: 100,
            background: [COLORS.accentDim, COLORS.surface, COLORS.surfaceMid][i % 3],
            opacity: 0.7,
          }} />
        ))}
      </div>

      {/* Product label — foreground, centered */}
      <div style={{
        position: "absolute",
        top: "50%", left: "50%",
        transform: `translate(-50%, calc(-50% + ${labelY}px))`,
        filter: `blur(${fgBlur}px)`,
        width: 540, padding: "28px 36px",
        background: COLORS.surface,
        border: `1.5px solid ${COLORS.accentDim}`,
        borderLeft: `6px solid ${COLORS.accent}`,
        boxShadow: `0 8px 40px rgba(0,0,0,0.7), 0 0 0 1px ${COLORS.accentDim}`,
      }}>
        {labelLines.map((line, i) => (
          <div key={i} style={{
            color: line.bold ? COLORS.primary : COLORS.secondary,
            fontFamily: "monospace",
            fontSize: line.bold ? 18 : 16,
            fontWeight: line.bold ? 700 : 400,
            letterSpacing: "0.04em",
            marginBottom: 8,
            borderBottom: i === 0 ? `1px solid ${COLORS.accentDim}` : "none",
            paddingBottom: i === 0 ? 10 : 0,
          }}>
            {line.text}
          </div>
        ))}
        {/* Barcode strip */}
        <div style={{ display: "flex", gap: 2, marginTop: 16 }}>
          {Array.from({ length: 32 }).map((_, i) => (
            <div key={i} style={{
              width: [2, 1, 3, 1, 2, 1, 2, 3][i % 8],
              height: 36,
              background: COLORS.primary,
              opacity: 0.7,
            }} />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Shot 5 — Hands reviewing contract document (17–22s)
// ---------------------------------------------------------------------------
const Shot5: React.FC<{ f: number }> = ({ f }) => {
  const relF = f - S(17);
  const dur = S(5);
  const opacity = interpolate(relF, [0, 18, dur - 18, dur], [0, 1, 1, 0], { extrapolateRight: "clamp" });

  const docLines = [
    { type: "header",  text: "FEDERAL SUPPLY CONTRACT — BASE SUPPLY CENTER AGREEMENT" },
    { type: "meta",    text: "Contract No.: GS-07F-0041N   |   Period: FY2026   |   Classification: Open" },
    { type: "section", text: "SECTION 4 — SUPPLIER PERFORMANCE REQUIREMENTS" },
    { type: "body",    text: "4.1  Envision, as the designated Base Supply Center operator, shall maintain an approved supplier network capable of fulfilling agency orders within contracted lead times." },
    { type: "body",    text: "4.2  Supplier performance metrics shall include on-time delivery rate (≥ 97%), fill rate (≥ 98.5%), and quality acceptance rate (≥ 99%)." },
    { type: "body",    text: "4.3  All catalog items must carry current CAGE code registration and comply with AbilityOne source priority rules." },
    { type: "body",    text: "4.4  Envision reserves the right to conduct semi-annual supplier reviews and adjust network composition to maintain contract compliance." },
    { type: "section", text: "SECTION 5 — ORDERING PROCEDURES" },
    { type: "body",    text: "5.1  Federal agencies place orders via GSA Advantage or direct agency procurement channels. Envision processes and routes fulfillment..." },
  ];

  return (
    <AbsoluteFill style={{ opacity }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, #080b10 0%, #0c1018 100%)",
      }} />

      {/* Document */}
      <div style={{
        position: "absolute",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 740, minHeight: 560,
        background: COLORS.surfaceMid,
        border: `1px solid ${COLORS.accentDim}`,
        padding: "40px 48px",
        boxShadow: "0 20px 80px rgba(0,0,0,0.8)",
      }}>
        {docLines.map((line, i) => (
          <div key={i} style={{
            fontFamily: line.type === "header" ? "'Inter', 'Arial', sans-serif" : "monospace",
            fontSize: line.type === "header" ? 17 : line.type === "meta" ? 13 : line.type === "section" ? 15 : 14,
            fontWeight: line.type === "header" ? 700 : line.type === "section" ? 600 : 400,
            color: line.type === "header" ? COLORS.primary : line.type === "section" ? COLORS.accentBright : COLORS.secondary,
            lineHeight: 1.6,
            marginBottom: line.type === "header" ? 8 : line.type === "section" ? 12 : 10,
            marginTop: line.type === "section" && i > 0 ? 16 : 0,
            borderBottom: line.type === "header" ? `2px solid ${COLORS.accent}` : "none",
            paddingBottom: line.type === "header" ? 10 : 0,
            letterSpacing: "0.02em",
          }}>
            {line.text}
          </div>
        ))}

        {/* Signature line */}
        <div style={{
          marginTop: 28, paddingTop: 16,
          borderTop: `1px solid ${COLORS.accentDim}`,
          display: "flex", justifyContent: "space-between",
          color: COLORS.secondary, fontFamily: "monospace", fontSize: 13,
        }}>
          <div>
            <div style={{ width: 200, height: 1, background: COLORS.secondary, marginBottom: 4 }} />
            Contracting Officer
          </div>
          <div>
            <div style={{ width: 200, height: 1, background: COLORS.secondary, marginBottom: 4 }} />
            BSC Representative
          </div>
        </div>
      </div>

      {/* Hands silhouettes at document edges */}
      <svg style={{ position: "absolute", bottom: 160, left: "50%", transform: "translateX(-50%)", opacity: 0.45 }}
           width={820} height={120} viewBox="0 0 820 120">
        {/* Left hand */}
        <ellipse cx={80}  cy={90} rx={70} ry={35} fill={COLORS.secondary} />
        <rect x={30}  y={50} width={28} height={60} rx={6} fill={COLORS.secondary} />
        <rect x={62}  y={30} width={24} height={60} rx={6} fill={COLORS.secondary} />
        <rect x={90}  y={28} width={22} height={60} rx={6} fill={COLORS.secondary} />
        <rect x={116} y={34} width={20} height={56} rx={6} fill={COLORS.secondary} />
        {/* Right hand */}
        <ellipse cx={740} cy={90} rx={70} ry={35} fill={COLORS.secondary} />
        <rect x={762} y={50} width={28} height={60} rx={6} fill={COLORS.secondary} />
        <rect x={734} y={30} width={24} height={60} rx={6} fill={COLORS.secondary} />
        <rect x={708} y={28} width={22} height={60} rx={6} fill={COLORS.secondary} />
        <rect x={684} y={34} width={20} height={56} rx={6} fill={COLORS.secondary} />
      </svg>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Shot 6 — Fulfillment floor, tracking shot (22–28s)
// ---------------------------------------------------------------------------
const Shot6: React.FC<{ f: number }> = ({ f }) => {
  const relF = f - S(22);
  const dur = S(6);
  const opacity  = interpolate(relF, [0, 18, dur - 18, dur], [0, 1, 1, 0], { extrapolateRight: "clamp" });
  const trackX   = interpolate(relF, [0, dur], [0, -200], { extrapolateRight: "clamp" });

  // Worker positions — 3 active workers
  const workers = [
    { x: 280,  y: 420, scale: 1.0,  speed: 1.2 },
    { x: 680,  y: 380, scale: 0.85, speed: 0.9 },
    { x: 1100, y: 410, scale: 0.75, speed: 1.1 },
  ];

  return (
    <AbsoluteFill style={{ opacity }}>
      <div style={{
        position: "absolute", inset: 0,
        transform: `translateX(${trackX}px)`,
        width: "120%",
        background: COLORS.bg,
      }}>
        {/* Floor */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 320,
          background: "linear-gradient(180deg, #0d1420 0%, #10181f 100%)",
          borderTop: `1px solid ${COLORS.accentDim}`,
        }} />
        {/* Floor tile grid */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={`row-${i}`} style={{
            position: "absolute", bottom: i * 28, left: 0, right: 0,
            height: 1, background: COLORS.grid, opacity: 0.3,
          }} />
        ))}
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={`col-${i}`} style={{
            position: "absolute", bottom: 0, top: "60%",
            left: i * 100, width: 1,
            background: COLORS.grid, opacity: 0.2,
          }} />
        ))}

        {/* Shelf rows in background */}
        {[0, 1].map((row) => (
          <div key={row} style={{
            position: "absolute",
            top: 100 + row * 200,
            left: -100, right: -100,
            height: 140,
            background: COLORS.surface,
            borderTop:    `2px solid ${COLORS.accentDim}`,
            borderBottom: `2px solid ${COLORS.accentDim}`,
            opacity: row === 0 ? 1 : 0.6,
          }}>
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} style={{
                position: "absolute", top: 8, left: i * 140 + 10,
                width: 120, height: 116,
                background: COLORS.surfaceMid, opacity: 0.9,
                borderTop: `3px solid ${COLORS.accentDim}`,
              }} />
            ))}
          </div>
        ))}

        {/* Workers */}
        {workers.map((w, i) => {
          const walkX = interpolate(relF, [0, dur], [0, w.speed * 80], { extrapolateRight: "clamp" });
          return (
            <svg
              key={i}
              style={{
                position: "absolute",
                left: w.x + walkX, bottom: 320,
                transform: `scaleX(-1) scale(${w.scale})`,
                transformOrigin: "bottom center",
                opacity: 0.7,
              }}
              width={60} height={160} viewBox="0 0 60 160"
            >
              {/* Head */}
              <circle cx={30} cy={20} r={16} fill={COLORS.secondary} />
              {/* Body */}
              <rect x={16} y={36} width={28} height={64} rx={4} fill={COLORS.secondary} />
              {/* Legs */}
              <rect x={16} y={100} width={12} height={52} rx={3}
                fill={COLORS.secondary}
                transform={`rotate(${Math.sin(relF * 0.25 + i) * 12}, 22, 100)`}
              />
              <rect x={32} y={100} width={12} height={52} rx={3}
                fill={COLORS.secondary}
                transform={`rotate(${-Math.sin(relF * 0.25 + i) * 12}, 38, 100)`}
              />
              {/* Arms */}
              <rect x={4}  y={40} width={10} height={40} rx={3}
                fill={COLORS.secondary}
                transform={`rotate(${-Math.sin(relF * 0.25 + i) * 18}, 9, 40)`}
              />
              <rect x={46} y={40} width={10} height={40} rx={3}
                fill={COLORS.secondary}
                transform={`rotate(${Math.sin(relF * 0.25 + i) * 18}, 51, 40)`}
              />
            </svg>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Shot 7 — Aerial warehouse, pull back (28–35s)
// ---------------------------------------------------------------------------
const Shot7: React.FC<{ f: number }> = ({ f }) => {
  const relF = f - S(28);
  const dur = S(7);
  const opacity  = interpolate(relF, [0, 18, dur - 18, dur], [0, 1, 1, 0], { extrapolateRight: "clamp" });
  const scale    = interpolate(relF, [0, dur], [1.15, 0.85], { extrapolateRight: "clamp" });
  const gridRows = 8;
  const gridCols = 12;

  return (
    <AbsoluteFill style={{ opacity }}>
      <div style={{
        position: "absolute", inset: 0,
        background: COLORS.bg,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {/* Aerial grid */}
        <div style={{
          transform: `scale(${scale})`,
          transformOrigin: "center",
          position: "relative",
          width: 1600, height: 900,
        }}>
          {/* Warehouse outline */}
          <div style={{
            position: "absolute", inset: 20,
            border: `2px solid ${COLORS.accent}`,
            opacity: 0.4,
          }} />

          {/* Shelf rows (aerial view — horizontal bands) */}
          {Array.from({ length: gridRows }).map((_, row) => (
            <div key={row} style={{
              position: "absolute",
              top: 40 + row * 100,
              left: 40, right: 40, height: 64,
              background: COLORS.surface,
              border: `1px solid ${COLORS.accentDim}`,
              display: "flex", gap: 8, padding: "4px 8px",
              overflow: "hidden",
            }}>
              {Array.from({ length: gridCols }).map((_, col) => (
                <div key={col} style={{
                  flex: "0 0 100px", height: "100%",
                  background: COLORS.surfaceMid,
                  border: `1px solid ${COLORS.grid}`,
                  opacity: 0.5 + (row + col) % 3 * 0.15,
                }} />
              ))}
            </div>
          ))}

          {/* Aisle lines */}
          {Array.from({ length: gridRows - 1 }).map((_, i) => (
            <div key={i} style={{
              position: "absolute",
              top: 104 + i * 100,
              left: 40, right: 40, height: 36,
              background: COLORS.bg,
              opacity: 0.9,
            }} />
          ))}

          {/* Workers as dots (aerial) */}
          {[{ x: 300, y: 200 }, { x: 780, y: 460 }, { x: 1200, y: 130 }, { x: 560, y: 620 }, { x: 1040, y: 350 }].map((dot, i) => {
            const dotX = interpolate(relF, [0, dur], [dot.x, dot.x + [20, -15, 25, -10, 18][i]], { extrapolateRight: "clamp" });
            return (
              <div key={i} style={{
                position: "absolute",
                top: dot.y, left: dotX,
                width: 14, height: 14,
                borderRadius: "50%",
                background: COLORS.accentBright,
                opacity: 0.8,
                boxShadow: `0 0 8px ${COLORS.accentBright}`,
              }} />
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Body Part 1 — sequence wrapper (12–35s, frames 360–1050)
// ---------------------------------------------------------------------------
export const BodyPart1: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <Shot4 f={frame} />
      <Shot5 f={frame} />
      <Shot6 f={frame} />
      <Shot7 f={frame} />
    </AbsoluteFill>
  );
};
