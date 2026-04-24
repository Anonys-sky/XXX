"use client";

// ═══════════════════════════════════════════════════════════════
// PocketCFO — Process Node (Analysis Step)
// Asian Water Painting aesthetic
// ═══════════════════════════════════════════════════════════════

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Shield, TrendingUp, Landmark } from "lucide-react";

interface ProcessNodeData {
  label?: string;
  category?: "compliance" | "cashflow" | "tax";
  status?: "processing" | "complete" | "warning";
  [key: string]: unknown;
}

function ProcessNode({ data }: NodeProps) {
  const nodeData = data as ProcessNodeData;

  const config = {
    compliance: {
      icon: Shield,
      borderColor: "border-warm/30",
      shadowColor: "rgba(196, 149, 106, 0.12)",
      bgColor: "bg-warm-soft",
      textColor: "text-warm",
    },
    cashflow: {
      icon: TrendingUp,
      borderColor: "border-primary/30",
      shadowColor: "rgba(130, 188, 213, 0.12)",
      bgColor: "bg-primary-soft",
      textColor: "text-primary",
    },
    tax: {
      icon: Landmark,
      borderColor: "border-navy/20",
      shadowColor: "rgba(53, 71, 97, 0.08)",
      bgColor: "bg-navy-soft",
      textColor: "text-navy",
    },
  }[nodeData.category || "compliance"];

  const Icon = config.icon;

  return (
    <div className="relative animate-fade-in">
      {/* Diamond rotation wrapper */}
      <div
        className={`w-24 h-24 rotate-45 rounded-2xl bg-surface border ${config.borderColor} flex items-center justify-center transition-shadow duration-300`}
        style={{ boxShadow: `0 0 15px ${config.shadowColor}` }}
      >
        <div className="-rotate-45 flex flex-col items-center gap-1">
          <div
            className={`w-7 h-7 rounded-lg ${config.bgColor} flex items-center justify-center`}
          >
            <Icon className={`w-4 h-4 ${config.textColor}`} />
          </div>
          <span
            className={`text-[9px] font-semibold uppercase tracking-wider ${config.textColor}`}
          >
            {nodeData.label || "Process"}
          </span>
        </div>
      </div>

      {/* Status indicator */}
      {nodeData.status === "processing" && (
        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-warm animate-pulse" />
      )}
      {nodeData.status === "complete" && (
        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-jade" />
      )}
      {nodeData.status === "warning" && (
        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-vermillion animate-pulse" />
      )}

      <Handle
        type="target"
        position={Position.Left}
        className="!w-2 !h-2 !bg-warm !border-0"
        style={{ top: "50%" }}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-2 !h-2 !bg-warm !border-0"
        style={{ top: "50%" }}
      />
    </div>
  );
}

export default memo(ProcessNode);
