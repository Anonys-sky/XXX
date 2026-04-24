"use client";

// ═══════════════════════════════════════════════════════════════
// PocketCFO — Decision Node (Final Output)
// Asian Water Painting aesthetic
// ═══════════════════════════════════════════════════════════════

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface DecisionNodeData {
  label?: string;
  outcome?: "approved" | "rejected" | "pending";
  impact?: string;
  [key: string]: unknown;
}

function DecisionNode({ data }: NodeProps) {
  const nodeData = data as DecisionNodeData;
  const outcome = nodeData.outcome || "pending";

  const config = {
    approved: {
      icon: CheckCircle,
      bg: "bg-jade-soft",
      border: "border-jade/30",
      text: "text-jade",
      shadow: "rgba(91, 158, 143, 0.15)",
      pillBg: "bg-jade",
    },
    rejected: {
      icon: XCircle,
      bg: "bg-vermillion-soft",
      border: "border-vermillion/30",
      text: "text-vermillion",
      shadow: "rgba(213, 55, 70, 0.12)",
      pillBg: "bg-vermillion",
    },
    pending: {
      icon: Clock,
      bg: "bg-warm-soft",
      border: "border-warm/30",
      text: "text-warm",
      shadow: "rgba(196, 149, 106, 0.12)",
      pillBg: "bg-warm",
    },
  }[outcome];

  const Icon = config.icon;

  return (
    <div className="relative animate-fade-in">
      <div
        className={`min-w-[160px] rounded-2xl ${config.bg} border ${config.border} p-3 transition-shadow duration-300`}
        style={{ boxShadow: `0 0 20px ${config.shadow}` }}
      >
        {/* Outcome pill */}
        <div className="flex items-center gap-2 mb-2">
          <div
            className={`px-2 py-0.5 rounded-full ${config.pillBg} flex items-center gap-1`}
          >
            <Icon className="w-3 h-3 text-white" />
            <span className="text-[9px] font-bold uppercase text-white">
              {outcome}
            </span>
          </div>
        </div>

        {/* Decision text */}
        <p className={`text-xs font-medium ${config.text}`}>
          {nodeData.label || "Strategic Action"}
        </p>

        {/* Impact */}
        {nodeData.impact && (
          <p className="text-[10px] text-mist mt-1.5">
            {nodeData.impact}
          </p>
        )}
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="!w-2 !h-2 !bg-jade !border-0"
      />
    </div>
  );
}

export default memo(DecisionNode);
