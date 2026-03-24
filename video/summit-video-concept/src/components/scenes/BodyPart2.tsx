import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS, S } from "../../constants";

// ---------------------------------------------------------------------------
// Shot 8 — Staged shipments / pallets (35–40s)
// ---------------------------------------------------------------------------
const Shot8: React.FC<{ f: number }> = ({ f }) => {
  const relF = f - S(35);
  const dur = S(5);
  const opacity  = interpolate(relF, [0, 18, dur - 18, dur], [0, 1, 1, 0], { extrapolateRight: "clamp" });
  const pushIn   = interpolate(relF, [0, dur], [1.0, 1.04], { extrapolateRight: "clamp" });

  const pallets = [
    { x: 160,  y: 500, boxes: 3, label: "OFP-2026-0041" },
    { x: 480,  y: 520, boxes: 4, label: "OFP-2026-0042" },
    { x: 800,  y: 510, boxes: 3, label: "OFP-2026-0043" },
    { x: 1120, y: 525, boxes: 4, label: "OFP-2026-0044" },
    { x: 1440, y: 505, boxes: 3, label: "OFP-2026-0045" },
  ];

  return (
    <AbsoluteFill style={{ opacity }}>
      <div style={{
        position: "absolute", inset: 0,
        transform: `scale(${pushIn})`,
        transformOrigin: "center",
        background: COLORS.bg,
      }}>
        {/* Floor */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 340,
          background: "linear-gradient(180deg, #0d1420 0%, #111720 100%)",
          borderTop: `1px solid ${COLORS.accentDim}`,
        }} />

        {/* Back wall */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 440,
          background: COLORS.surface,
          borderBottom: `2px solid ${COLORS.accentDim}`,
        }} />

        {/* Dock number markers on back wall */}
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} style={{
            position: "absolute", top: 40, left: 160 + (n - 1) * 320 + 100,
            color: COLORS.secondary, fontFamily: "monospace",
            fontSize: 22, letterSpacing: "0.1em",
          }}>
            DOCK {n.toString().padStart(2, "0")}
          </div>
        ))}

        {/* Pallets */}
        {pallets.map((pallet, i) => (
          <div key={i} style={{ position: "absolute", bottom: 340, left: pallet.x }}>
            {/* Pallet base */}
            <svg width={220} height={30} viewBox="0 0 220 30">
              <rect x={0}  y={18} width={220} height={12} fill={COLORS.surfaceLight} />
              <rect x={10} y={6}  width={40}  height={24} fill={COLORS.surfaceMid}   />
              <rect x={90} y={6}  width={40}  height={24} fill={COLORS.surfaceMid}   />
              <rect x={170} y={6} width={40}  height={24} fill={COLORS.surfaceMid}   />
            </svg>

            {/* Box stack */}
            {Array.from({ length: pallet.boxes }).map((_, b) => (
              <div key={b} style={{
                position: "absolute",
                bottom: 30 + b * 68,
                left: 10, width: 200, height: 68,
                background: COLORS.surfaceMid,
                border: `1px solid ${COLORS.accentDim}`,
                borderTop: `2px solid ${COLORS.accentBright}33`,
              }}>
                {/* Tape strip */}
                <div style={{
                  position: "absolute", top: "50%", left: 0, right: 0,
                  height: 8, background: COLORS.accentDim, opacity: 0.5,
                  transform: "translateY(-50%)",
                }} />
                {b === pallet.boxes - 1 && (
                  <div style={{
                    position: "absolute", top: 8, left: 12,
                    color: COLORS.secondary, fontFamily: "monospace", fontSize: 11,
                    letterSpacing: "0.05em",
                  }}>
                    {pallet.label}
                  </div>
                )}
              </div>
            ))}

            {/* Shrink wrap effect */}
            <div style={{
              position: "absolute",
              bottom: 30, left: 8,
              width: 204, height: pallet.boxes * 68,
              border: `1px solid ${COLORS.accent}44`,
              pointerEvents: "none",
            }} />
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Shot 9 — Loading dock, truck backed in (40–46s)
// ---------------------------------------------------------------------------
const Shot9: React.FC<{ f: number }> = ({ f }) => {
  const relF = f - S(40);
  const dur = S(6);
  const opacity = interpolate(relF, [0, 18, dur - 18, dur], [0, 1, 1, 0], { extrapolateRight: "clamp" });
  const truckX  = interpolate(relF, [0, 30, dur], [-60, 0, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity }}>
      <div style={{ position: "absolute", inset: 0, background: COLORS.bg }}>
        {/* Loading bay floor */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 360,
          background: COLORS.surface,
          borderTop: `2px solid ${COLORS.accentDim}`,
        }} />

        {/* Loading dock platform edge */}
        <div style={{
          position: "absolute", bottom: 360, left: 0, right: 0, height: 20,
          background: "#f5a623",
          opacity: 0.55,
        }}>
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} style={{
              position: "absolute", top: 0, left: i * 80,
              width: 40, height: 20,
              background: "#1a1e24",
            }} />
          ))}
        </div>

        {/* Dock door frame */}
        <div style={{
          position: "absolute", bottom: 380, left: "50%",
          transform: "translateX(-50%)",
          width: 640, height: 520,
          border: `6px solid ${COLORS.surfaceLight}`,
          background: "transparent",
        }}>
          {/* Door rolled up — horizontal slats */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{
              position: "absolute", top: -60 + i * 12, left: -6, right: -6,
              height: 10,
              background: COLORS.surfaceMid,
              borderTop: `1px solid ${COLORS.accentDim}`,
            }} />
          ))}
        </div>

        {/* Truck trailer */}
        <div style={{
          position: "absolute", bottom: 380, left: "50%",
          transform: `translateX(calc(-50% + ${truckX}px))`,
          width: 640, height: 480,
          background: COLORS.surfaceMid,
          border: `4px solid ${COLORS.accentDim}`,
          borderBottom: "none",
        }}>
          {/* Trailer interior — product boxes visible */}
          <div style={{ position: "absolute", inset: 24, background: COLORS.bg }}>
            {Array.from({ length: 3 }).map((_, row) =>
              Array.from({ length: 4 }).map((_, col) => (
                <div key={`${row}-${col}`} style={{
                  position: "absolute",
                  left: col * 142 + 8, bottom: row * 110 + 8,
                  width: 128, height: 100,
                  background: COLORS.surface,
                  border: `1px solid ${COLORS.accentDim}`,
                }} />
              ))
            )}
          </div>
          {/* Trailer branding strip */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 36,
            background: COLORS.accentDim,
            display: "flex", alignItems: "center", paddingLeft: 16,
          }}>
            <span style={{ color: COLORS.secondary, fontFamily: "monospace", fontSize: 14, letterSpacing: "0.1em" }}>
              ENVISION — FEDERAL SUPPLY LOGISTICS
            </span>
          </div>
        </div>

        {/* Worker loading boxes */}
        <svg style={{
          position: "absolute", bottom: 360, left: "calc(50% + 280px)", opacity: 0.6,
        }}
          width={80} height={200} viewBox="0 0 80 200"
        >
          <circle cx={40} cy={22} r={18} fill={COLORS.secondary} />
          <rect x={22} y={40} width={36} height={80} rx={4} fill={COLORS.secondary} />
          <rect x={10} y={44} width={12} height={48} rx={3} fill={COLORS.secondary} />
          <rect x={58} y={44} width={12} height={48} rx={3} fill={COLORS.secondary} />
          <rect x={20} y={120} width={16} height={64} rx={3} fill={COLORS.secondary} />
          <rect x={44} y={120} width={16} height={64} rx={3} fill={COLORS.secondary} />
          {/* Box being carried */}
          <rect x={56} y={40} width={50} height={40} rx={2} fill={COLORS.accentDim} />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Shot 10 — Shipping manifest / checklist (46–52s)
// ---------------------------------------------------------------------------
const Shot10: React.FC<{ f: number }> = ({ f }) => {
  const relF = f - S(46);
  const dur = S(6);
  const opacity  = interpolate(relF, [0, 18, dur - 18, dur], [0, 1, 1, 0], { extrapolateRight: "clamp" });

  const checkItems = [
    { label: "Order verified against contract",         checked: true  },
    { label: "Quantity confirmed — 240 units",          checked: true  },
    { label: "Item specifications: EP-4481-C",          checked: true  },
    { label: "Vendor compliance — CAGE code verified",  checked: true  },
    { label: "Packaging meets federal spec",            checked: true  },
    { label: "Shipping label applied / scanned",        checked: true  },
    { label: "Carrier confirmed — pickup scheduled",    checked: false },
    { label: "Final QC sign-off",                       checked: false },
  ];

  return (
    <AbsoluteFill style={{ opacity }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, #080b10 0%, #0e1218 100%)",
      }}>
        {/* Background blur — clipboard / desk suggestion */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.12,
          background: `repeating-linear-gradient(0deg, ${COLORS.grid} 0px, ${COLORS.grid} 1px, transparent 1px, transparent 48px)`,
        }} />

        {/* Manifest card */}
        <div style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 680, background: COLORS.surfaceMid,
          border: `1px solid ${COLORS.accentDim}`,
          borderTop: `4px solid ${COLORS.accent}`,
          padding: "32px 40px",
          boxShadow: "0 20px 80px rgba(0,0,0,0.7)",
        }}>
          <div style={{
            color: COLORS.primary, fontFamily: "monospace", fontSize: 18,
            fontWeight: 700, letterSpacing: "0.06em", marginBottom: 6,
          }}>
            OUTBOUND QUALITY CHECKLIST
          </div>
          <div style={{
            color: COLORS.secondary, fontFamily: "monospace", fontSize: 14,
            marginBottom: 28, borderBottom: `1px solid ${COLORS.accentDim}`, paddingBottom: 16,
          }}>
            Shipment: SHP-2026-04122  |  Destination: Andrews AFB Supply Office
          </div>

          {checkItems.map((item, i) => {
            const itemFrame = i * 14;
            const itemOpacity = interpolate(relF, [itemFrame, itemFrame + 12], [0, 1], { extrapolateRight: "clamp" });
            return (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 16,
                marginBottom: 14, opacity: itemOpacity,
              }}>
                {/* Checkbox */}
                <div style={{
                  width: 22, height: 22, flexShrink: 0,
                  border: `2px solid ${item.checked ? COLORS.accentBright : COLORS.secondary}`,
                  background: item.checked ? COLORS.accentBright + "22" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {item.checked && (
                    <svg width={14} height={14} viewBox="0 0 14 14">
                      <polyline points="2,7 5,11 12,3" stroke={COLORS.accentBright} strokeWidth={2} fill="none" />
                    </svg>
                  )}
                </div>
                <span style={{
                  color: item.checked ? COLORS.primary : COLORS.secondary,
                  fontFamily: "monospace", fontSize: 15,
                  textDecoration: item.checked ? "none" : "none",
                  letterSpacing: "0.02em",
                }}>
                  {item.label}
                </span>
              </div>
            );
          })}

          {/* Progress bar */}
          <div style={{ marginTop: 20, borderTop: `1px solid ${COLORS.accentDim}`, paddingTop: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ color: COLORS.secondary, fontFamily: "monospace", fontSize: 13 }}>COMPLIANCE RATE</span>
              <span style={{ color: COLORS.accentBright, fontFamily: "monospace", fontSize: 13 }}>6 / 8</span>
            </div>
            <div style={{
              height: 6, background: COLORS.surface,
              border: `1px solid ${COLORS.accentDim}`,
            }}>
              <div style={{
                height: "100%",
                width: `${interpolate(relF, [0, dur * 0.8], [0, 75], { extrapolateRight: "clamp" })}%`,
                background: COLORS.accentBright,
                transition: "width 0.5s ease",
              }} />
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Shot 11 — Wide floor, slow zoom out to reveal full scope (52–60s)
// ---------------------------------------------------------------------------
const Shot11: React.FC<{ f: number }> = ({ f }) => {
  const relF = f - S(52);
  const dur = S(8);
  const opacity = interpolate(relF, [0, 18, dur - 18, dur], [0, 1, 1, 0], { extrapolateRight: "clamp" });
  const scale   = interpolate(relF, [0, dur], [1.2, 0.88], { extrapolateRight: "clamp" });

  const workerGrid = [
    { x: 140,  y: 760 }, { x: 380,  y: 720 }, { x: 620,  y: 750 },
    { x: 860,  y: 700 }, { x: 1100, y: 740 }, { x: 1340, y: 720 },
    { x: 1580, y: 760 }, { x: 240,  y: 540 }, { x: 720,  y: 560 },
    { x: 1200, y: 540 }, { x: 480,  y: 860 }, { x: 1020, y: 840 },
  ];

  return (
    <AbsoluteFill style={{ opacity }}>
      <div style={{
        position: "absolute", inset: 0,
        background: COLORS.bg,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{
          transform: `scale(${scale})`,
          transformOrigin: "center",
          position: "absolute", inset: 0,
        }}>
          {/* Floor surface */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 480,
            background: "linear-gradient(180deg, #0d1420 0%, #10181f 100%)",
            borderTop: `1px solid ${COLORS.accentDim}`,
          }}>
            {/* Grid lines */}
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={`h-${i}`} style={{
                position: "absolute", top: i * 24, left: 0, right: 0,
                height: 1, background: COLORS.grid, opacity: 0.4,
              }} />
            ))}
            {Array.from({ length: 40 }).map((_, i) => (
              <div key={`v-${i}`} style={{
                position: "absolute", top: 0, bottom: 0, left: i * 48,
                width: 1, background: COLORS.grid, opacity: 0.25,
              }} />
            ))}
          </div>

          {/* Shelf banks — background */}
          {[0, 1, 2].map((row) => (
            <div key={row} style={{
              position: "absolute",
              top: 80 + row * 180,
              left: -80, right: -80, height: 100,
              background: COLORS.surface,
              borderTop:    `2px solid ${COLORS.accentDim}`,
              borderBottom: `1px solid ${COLORS.accentDim}`,
              opacity: 1 - row * 0.2,
            }} />
          ))}

          {/* Workers */}
          {workerGrid.map((w, i) => {
            const wobble = Math.sin(relF * 0.3 + i * 1.5) * 3;
            return (
              <svg key={i} style={{
                position: "absolute",
                left: w.x, top: w.y,
                opacity: 0.55,
                transform: `scale(0.6)`,
                transformOrigin: "bottom center",
              }}
                width={60} height={160} viewBox="0 0 60 160"
              >
                <circle cx={30} cy={20} r={16} fill={COLORS.secondary} />
                <rect x={16} y={36} width={28} height={64} rx={4} fill={COLORS.secondary} />
                <rect x={16} y={100} width={12} height={52} rx={3} fill={COLORS.secondary}
                  transform={`rotate(${wobble}, 22, 100)`} />
                <rect x={32} y={100} width={12} height={52} rx={3} fill={COLORS.secondary}
                  transform={`rotate(${-wobble}, 38, 100)`} />
              </svg>
            );
          })}

          {/* Activity pulse lines — horizontal conveyor suggestion */}
          {[480, 640].map((y, i) => (
            <div key={i} style={{
              position: "absolute", top: y, left: 0, right: 0, height: 3,
              background: `linear-gradient(90deg, transparent 0%, ${COLORS.accentBright} ${interpolate(relF, [0, dur], [0, 100], { extrapolateRight: "clamp" })}%, transparent 100%)`,
              opacity: 0.3,
            }} />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Body Part 2 — sequence wrapper (35–60s)
// ---------------------------------------------------------------------------
export const BodyPart2: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <Shot8  f={frame} />
      <Shot9  f={frame} />
      <Shot10 f={frame} />
      <Shot11 f={frame} />
    </AbsoluteFill>
  );
};
