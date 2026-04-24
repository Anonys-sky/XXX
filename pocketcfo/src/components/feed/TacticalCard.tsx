"use client";

// ═══════════════════════════════════════════════════════════════
// PocketCFO — Tactical Card Component
// Asian Water Painting aesthetic
// ═══════════════════════════════════════════════════════════════

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronDown,
  Check,
  X,
  AlertTriangle,
  Lightbulb,
  FileText,
  Clock,
} from "lucide-react";
import type { TacticalFeedItem } from "@/lib/types";

interface TacticalCardProps {
  item: TacticalFeedItem;
  onConfirm?: (id: string) => void;
  onDismiss?: (id: string) => void;
}

export default function TacticalCard({
  item,
  onConfirm,
  onDismiss,
}: TacticalCardProps) {
  const [expanded, setExpanded] = useState(false);

  const cardTypeClass =
    item.ui_component.type === "ALERT"
      ? "card-alert"
      : item.ui_component.type === "OPPORTUNITY"
      ? "card-opportunity"
      : "card-tactical";

  const priorityClass =
    item.decision_logic.action_priority === "CRITICAL"
      ? "badge-critical"
      : item.decision_logic.action_priority === "MEDIUM"
      ? "badge-medium"
      : "badge-low";

  const TypeIcon =
    item.ui_component.type === "ALERT"
      ? AlertTriangle
      : item.ui_component.type === "OPPORTUNITY"
      ? Lightbulb
      : FileText;

  const iconConfig =
    item.ui_component.type === "ALERT"
      ? { bg: "bg-vermillion-soft", text: "text-vermillion" }
      : item.ui_component.type === "OPPORTUNITY"
      ? { bg: "bg-jade-soft", text: "text-jade" }
      : { bg: "bg-primary-soft", text: "text-primary" };

  const timeAgo = getTimeAgo(item.timestamp);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.97 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`glass-card ${cardTypeClass} p-4 ${
        item.status === "CONFIRMED" ? "opacity-50" : ""
      }`}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div
            className={`w-8 h-8 min-w-8 rounded-lg flex items-center justify-center ${iconConfig.bg}`}
          >
            <TypeIcon className={`w-4 h-4 ${iconConfig.text}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium leading-snug text-navy">
              {item.ui_component.display_message}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <span
                className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${priorityClass}`}
              >
                {item.decision_logic.action_priority}
              </span>
              <span className="text-[10px] text-mist flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {timeAgo}
              </span>
            </div>
          </div>
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1 rounded-lg hover:bg-surface-hover transition-colors"
          aria-label="Toggle details"
        >
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4 text-mist" />
          </motion.div>
        </button>
      </div>

      {/* Expandable Details */}
      <motion.div
        initial={false}
        animate={{
          height: expanded ? "auto" : 0,
          opacity: expanded ? 1 : 0,
        }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="pt-3 mt-3 border-t border-border space-y-3">
          {/* Vendor + Amount */}
          <div className="flex justify-between items-center">
            <span className="text-xs text-mist">
              {item.extracted_data.vendor}
            </span>
            <span className="font-mono-nums text-sm font-semibold text-navy">
              RM{item.extracted_data.amount_myr.toLocaleString("en-MY", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>

          {/* LHDN Status */}
          <div className="flex items-center gap-2">
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                item.extracted_data.is_lhdn_compliant
                  ? "bg-jade"
                  : "bg-vermillion animate-pulse"
              }`}
            />
            <span className="text-[11px] text-mist">
              {item.extracted_data.is_lhdn_compliant
                ? "LHDN Compliant"
                : "⚠ Non-Compliant"}
            </span>
            <span className="text-[10px] text-mist-light font-mono ml-auto">
              {item.extracted_data.classification.replace("LHDN_", "")}
            </span>
          </div>

          {/* Rationale */}
          <div className="p-3 rounded-xl bg-surface-warm text-xs text-navy/70 leading-relaxed">
            <span className="text-[10px] uppercase tracking-wider text-mist block mb-1.5">
              Rationale
            </span>
            {item.decision_logic.rationale}
          </div>

          {/* Tax Impact */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-mist">Tax Impact:</span>
            <span className="text-primary font-semibold">
              {item.decision_logic.tax_optimization_impact}
            </span>
          </div>

          {/* Actions */}
          {item.status !== "CONFIRMED" && item.status !== "DISMISSED" && (
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => onConfirm?.(item.id)}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-jade-soft text-jade text-xs font-medium hover:bg-jade/15 transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                Confirm
              </button>
              <button
                onClick={() => onDismiss?.(item.id)}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-navy-soft text-mist text-xs font-medium hover:bg-navy/10 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Dismiss
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function getTimeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
