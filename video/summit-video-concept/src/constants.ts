// ---------------------------------------------------------------------------
// Video constants — 2026 Envision Supplier Summit
// ---------------------------------------------------------------------------

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const DURATION_FRAMES = 80 * FPS; // 2400 frames

// Section boundaries (seconds → frames)
export const S = (sec: number) => Math.round(sec * FPS);

export const SECTIONS = {
  intro:  { from: S(0),  to: S(12) },
  body1:  { from: S(12), to: S(35) },
  body2:  { from: S(35), to: S(60) },
  close:  { from: S(60), to: S(80) },
};

// Shot boundaries within sections
export const SHOTS = {
  // Intro
  shot1: { from: S(0),  to: S(4)  }, // federal building
  shot2: { from: S(4),  to: S(8)  }, // warehouse wide
  shot3: { from: S(8),  to: S(12) }, // worker at screen
  // Body 1
  shot4: { from: S(12), to: S(17) }, // product label close-up
  shot5: { from: S(17), to: S(22) }, // contract document
  shot6: { from: S(22), to: S(28) }, // fulfillment floor tracking
  shot7: { from: S(28), to: S(35) }, // aerial warehouse pullback
  // Body 2
  shot8:  { from: S(35), to: S(40) }, // staged shipments
  shot9:  { from: S(40), to: S(46) }, // loading dock
  shot10: { from: S(46), to: S(52) }, // shipping manifest
  shot11: { from: S(52), to: S(60) }, // wide floor zoom out
  // Close
  shot12: { from: S(60), to: S(66) }, // summit room
  shot13: { from: S(66), to: S(72) }, // speaker at podium
  shot14: { from: S(72), to: S(80) }, // logo lockup
};

// On-screen text overlays
export const OVERLAYS = [
  { from: S(2),  to: S(4),  text: "Envision",                         size: "sm" },
  { from: S(10), to: S(12), text: "Base Supply Center",               size: "md" },
  { from: S(28), to: S(32), text: "Sourcing. Fulfillment. Delivery.", size: "md" },
  { from: S(52), to: S(56), text: "Your performance is our performance.", size: "md" },
  { from: S(74), to: S(80), text: "2026 Envision Supplier Summit",    size: "lg" },
];

// Voiceover captions (timed to approx. speech pace)
export const CAPTIONS = [
  { from: S(0),    to: S(5.5),  text: "Federal agencies require a consistent, reliable supply of products to keep operations running." },
  { from: S(5.5),  to: S(12),   text: "Envision operates as a Base Supply Center — a designated provider within the AbilityOne program responsible for sourcing, managing, and delivering those supplies." },
  { from: S(12),   to: S(17.5), text: "As a BSC, Envision holds the procurement relationship with federal customers." },
  { from: S(17.5), to: S(24),   text: "We manage the catalog, fulfill the contracts, and maintain the supply chain that agencies depend on." },
  { from: S(24),   to: S(35),   text: "That means coordinating across a network of approved suppliers — each one contributing to the reliability of the whole system." },
  { from: S(35),   to: S(41),   text: "The suppliers in this room are a direct part of how Envision performs." },
  { from: S(41),   to: S(46),   text: "When an agency places an order, it moves through this network." },
  { from: S(46),   to: S(53),   text: "Your production quality, your lead times, your capacity — these are the variables that determine whether we deliver." },
  { from: S(53),   to: S(60),   text: "This is not a passive relationship." },
  { from: S(60),   to: S(66),   text: "The 2026 Supplier Summit is about aligning on that shared responsibility." },
  { from: S(66),   to: S(72),   text: "We'll cover contract priorities, performance expectations, and what's ahead for the year." },
  { from: S(72),   to: S(79),   text: "Thank you for being here. Let's get to work." },
];

// Color palette — cool-neutral, desaturated industrial
export const COLORS = {
  bg:           "#0e1117", // very dark background
  surface:      "#161b24", // card/scene surface
  surfaceMid:   "#1e2530", // lighter surface
  surfaceLight: "#252d3a", // lightest surface
  primary:      "#dde1e7", // near-white text
  secondary:    "#8b96a8", // muted text
  accent:       "#3d6b9e", // corporate blue
  accentBright: "#5588c0", // slightly brighter blue
  accentDim:    "#2a4d72", // dim blue for structure
  grid:         "#1a2030", // subtle grid lines
  caption:      "rgba(0,0,0,0.72)", // caption background
};

// Dissolve/fade transition duration (frames)
export const DISSOLVE = 18; // 0.6s
export const FADE     = 12; // 0.4s
