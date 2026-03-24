import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
} from "remotion";
import {
  DURATION_FRAMES,
  FPS,
  SECTIONS,
  COLORS,
  DISSOLVE,
  S,
} from "./constants";
import { Intro }     from "./components/scenes/Intro";
import { BodyPart1 } from "./components/scenes/BodyPart1";
import { BodyPart2 } from "./components/scenes/BodyPart2";
import { Close }     from "./components/scenes/Close";
import { Caption }   from "./components/ui/Caption";
import { OnScreenText } from "./components/ui/OnScreenText";

// ---------------------------------------------------------------------------
// Background — persistent dark base, prevents flicker between scenes
// ---------------------------------------------------------------------------
const Background: React.FC = () => (
  <AbsoluteFill style={{ background: COLORS.bg }} />
);

// ---------------------------------------------------------------------------
// Section fade-in overlay — each section opens with a brief dissolve
// ---------------------------------------------------------------------------
const SectionDissolve: React.FC<{ from: number; to: number }> = ({ from, to }) => {
  const frame = useCurrentFrame();
  const absFrame = from + frame;
  const opacity = interpolate(absFrame, [from, from + DISSOLVE], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ background: COLORS.bg, opacity, pointerEvents: "none" }} />
  );
};

// ---------------------------------------------------------------------------
// Global fade-to-black at the very end
// ---------------------------------------------------------------------------
const FinalFade: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [DURATION_FRAMES - 24, DURATION_FRAMES],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return <AbsoluteFill style={{ background: "#000", opacity, pointerEvents: "none" }} />;
};

// ---------------------------------------------------------------------------
// Vignette — subtle darkening around edges for cinematic feel
// ---------------------------------------------------------------------------
const Vignette: React.FC = () => (
  <AbsoluteFill style={{
    background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.7) 100%)",
    pointerEvents: "none",
  }} />
);

// ---------------------------------------------------------------------------
// Main 80-second composition
// ---------------------------------------------------------------------------
export const SummitVideo: React.FC = () => {
  const { intro, body1, body2, close } = SECTIONS;

  return (
    <AbsoluteFill>
      <Background />

      {/* INTRO — 0–12s */}
      <Sequence from={intro.from} durationInFrames={intro.to - intro.from + DISSOLVE}>
        <Intro />
        <SectionDissolve from={intro.from} to={intro.to} />
      </Sequence>

      {/* BODY PART 1 — 12–35s (with dissolve overlap from intro) */}
      <Sequence from={body1.from - DISSOLVE} durationInFrames={body1.to - body1.from + DISSOLVE * 2}>
        <BodyPart1 />
        <SectionDissolve from={body1.from - DISSOLVE} to={body1.from} />
      </Sequence>

      {/* BODY PART 2 — 35–60s (clean cut from body1) */}
      <Sequence from={body2.from} durationInFrames={body2.to - body2.from + DISSOLVE}>
        <BodyPart2 />
        <SectionDissolve from={body2.from} to={body2.from + DISSOLVE} />
      </Sequence>

      {/* CLOSE — 60–80s (dissolve in from body2) */}
      <Sequence from={close.from - DISSOLVE} durationInFrames={close.to - close.from + DISSOLVE}>
        <Close />
        <SectionDissolve from={close.from - DISSOLVE} to={close.from} />
      </Sequence>

      {/* Global overlays — always on top */}
      <Vignette />
      <Caption />
      <OnScreenText />
      <FinalFade />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 30-second cut (shots 8–14, reframed)
// ---------------------------------------------------------------------------
export const SummitVideo30: React.FC = () => {
  // Start from shot 8 (35s) so suppliers see the most relevant section
  // then close section — 25s of content + 5s logo hold
  const START = S(35);
  const END   = S(80);
  const dur   = END - START;

  return (
    <AbsoluteFill>
      <Background />
      <Sequence from={-START} durationInFrames={DURATION_FRAMES}>
        <SummitVideo />
      </Sequence>
      <FinalFade />
    </AbsoluteFill>
  );
};
