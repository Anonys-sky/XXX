"use client";

// ═══════════════════════════════════════════════════════════════
// PocketCFO — Input Node (Document/Receipt Node)
// Asian Water Painting aesthetic
// ═══════════════════════════════════════════════════════════════

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { FileText, Receipt, Image } from "lucide-react";

interface InputNodeData {
  label?: string;
  docType?: "receipt" | "invoice" | "message";
  vendor?: string;
  amount?: number;
  [key: string]: unknown;
}

function InputNode({ data }: NodeProps) {
  const nodeData = data as InputNodeData;
  const Icon =
    nodeData.docType === "receipt"
      ? Receipt
      : nodeData.docType === "invoice"
      ? FileText
      : Image;

  return (
    <div className="relative animate-fade-in">
      <div className="min-w-[140px] rounded-2xl bg-surface border border-primary/20 p-3 shadow-[0_0_15px_rgba(130,188,213,0.1)] hover:shadow-[0_0_25px_rgba(130,188,213,0.2)] transition-shadow duration-300">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-primary-soft flex items-center justify-center">
            <Icon className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
            Input
          </span>
        </div>

        {/* Content */}
        <p className="text-xs font-medium text-navy truncate">
          {nodeData.label || "Document"}
        </p>
        {nodeData.vendor && (
          <p className="text-[10px] text-mist mt-0.5 truncate">
            {nodeData.vendor}
          </p>
        )}
        {nodeData.amount && (
          <p className="text-xs font-mono-nums text-navy font-semibold mt-1">
            RM{nodeData.amount.toLocaleString("en-MY", {
              minimumFractionDigits: 2,
            })}
          </p>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!w-2 !h-2 !bg-primary !border-0"
      />
    </div>
  );
}

export default memo(InputNode);
