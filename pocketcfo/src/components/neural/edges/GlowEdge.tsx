"use client";

// ═══════════════════════════════════════════════════════════════
// PocketCFO — Glow Edge (Animated Neural Connection)
// Asian Water Painting — Misty ink flow
// ═══════════════════════════════════════════════════════════════

import { memo } from "react";
import { BaseEdge, getSmoothStepPath, type EdgeProps } from "@xyflow/react";

function GlowEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  ...rest
}: EdgeProps) {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 16,
  });

  return (
    <>
      {/* Glow layer — soft mist */}
      <BaseEdge
        path={edgePath}
        style={{
          stroke: "rgba(130, 188, 213, 0.12)",
          strokeWidth: 6,
          ...style,
        }}
        {...rest}
      />
      {/* Main line — ink stroke */}
      <BaseEdge
        path={edgePath}
        style={{
          stroke: "rgba(53, 71, 97, 0.25)",
          strokeWidth: 1.5,
          strokeDasharray: "8 4",
          animation: "edge-flow 1.5s linear infinite",
          ...style,
        }}
        {...rest}
      />
    </>
  );
}

export default memo(GlowEdge);
