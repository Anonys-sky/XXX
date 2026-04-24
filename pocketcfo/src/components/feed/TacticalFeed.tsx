"use client";

// ═══════════════════════════════════════════════════════════════
// PocketCFO — Tactical Feed (Real-time Decision Feed)
// Now accepts external items and handlers from parent (Firestore)
// ═══════════════════════════════════════════════════════════════

import { AnimatePresence, motion } from "framer-motion";
import { Activity } from "lucide-react";
import type { TacticalFeedItem } from "@/lib/types";
import TacticalCard from "./TacticalCard";

interface TacticalFeedProps {
  initialItems: TacticalFeedItem[];
  onConfirm?: (id: string) => void;
  onDismiss?: (id: string) => void;
}

export default function TacticalFeed({
  initialItems,
  onConfirm,
  onDismiss,
}: TacticalFeedProps) {
  const unreadCount = initialItems.filter((i) => i.status === "UNREAD").length;

  return (
    <div className="flex flex-col h-full">
      {/* Feed Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-navy">Tactical Feed</h2>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-[10px] font-bold text-primary bg-primary-soft px-2 py-0.5 rounded-full"
            >
              {unreadCount} new
            </motion.span>
          )}
        </div>
        <span className="text-[10px] text-mist">
          {initialItems.length} decisions
        </span>
      </div>

      {/* Scrollable Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {initialItems.map((item, index) => (
            <motion.div
              key={item.id}
              transition={{ delay: index * 0.05 }}
            >
              <TacticalCard
                item={item}
                onConfirm={onConfirm}
                onDismiss={onDismiss}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {initialItems.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-surface-warm flex items-center justify-center mb-4">
              <Activity className="w-8 h-8 text-mist" />
            </div>
            <p className="text-sm text-mist">No decisions yet</p>
            <p className="text-xs text-mist-light mt-1">
              Upload a receipt or invoice to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
