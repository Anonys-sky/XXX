"use client";

// ═══════════════════════════════════════════════════════════════
// PocketCFO — Brain Node (Central Neural Node)
// Asian Water Painting aesthetic — Ink wash style
// ═══════════════════════════════════════════════════════════════

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Brain } from "lucide-react";

function BrainNode({ data }: NodeProps) {
  return (
    <div className="relative group">
      {/* Outer glow ring — soft mist */}
      <div className="absolute -inset-4 rounded-full bg-primary/5 animate-[neural-pulse_4s_ease-in-out_infinite] pointer-events-none" />

      {/* Main node */}
      <div className="w-20 h-20 rounded-full flex items-center justify-center bg-surface border-2 border-primary/30 shadow-[0_0_25px_rgba(130,188,213,0.2)] group-hover:shadow-[0_0_40px_rgba(130,188,213,0.35)] transition-shadow duration-500">
        <Brain className="w-8 h-8 text-navy" />
      </div>

      {/* Label */}
      <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-semibold text-navy uppercase tracking-wider">
        {(data as { label?: string })?.label || "Neural Engine"}
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2 !h-2 !bg-primary !border-0"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-2 !h-2 !bg-primary !border-0"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="!w-2 !h-2 !bg-primary !border-0"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="!w-2 !h-2 !bg-primary !border-0"
      />
    </div>
  );
}

export default memo(BrainNode);
