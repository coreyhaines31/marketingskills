import React from "react";
import { Composition } from "remotion";
import { SummitVideo, SummitVideo30 } from "./SummitVideo";
import { DURATION_FRAMES, FPS, WIDTH, HEIGHT, S } from "./constants";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Full 80-second master */}
      <Composition
        id="SummitVideo"
        component={SummitVideo}
        durationInFrames={DURATION_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />

      {/* 30-second digital cut — supplier-focused section + close */}
      <Composition
        id="SummitVideo30"
        component={SummitVideo30}
        durationInFrames={S(45)} // 35s content + padding
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
