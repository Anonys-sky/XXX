"use client";

// ═══════════════════════════════════════════════════════════════
// PocketCFO — Main Dashboard
// 3-Panel Layout: Sidebar | Tactical Feed + Chat | Neural Brain
// Asian Water Painting theme
// ═══════════════════════════════════════════════════════════════

import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import TacticalFeed from "@/components/feed/TacticalFeed";
import ChatInput from "@/components/feed/ChatInput";

import { DEMO_COMPANY, DEMO_HEALTH, DEMO_FEED } from "@/lib/mock-data";
import type { TacticalFeedItem, PocketCFODecision } from "@/lib/types";

// Lazy-load React Flow (heavy, client-only)
const NeuralBrain = dynamic(
  () => import("@/components/neural/NeuralBrain"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          <span className="text-xs text-mist">
            Initializing Neural Graph...
          </span>
        </div>
      </div>
    ),
  }
);

export default function Dashboard() {
  const [feedItems, setFeedItems] = useState<TacticalFeedItem[]>(DEMO_FEED);
  const [isProcessing, setIsProcessing] = useState(false);

  const unreadCount = useMemo(
    () => feedItems.filter((i) => i.status === "UNREAD").length,
    [feedItems]
  );

  /** Handle new transaction analysis */
  const handleAnalyze = useCallback(async (input: string) => {
    setIsProcessing(true);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawInput: input }),
      });

      if (res.ok) {
        const data = await res.json();
        const decision: PocketCFODecision = data.decision;

        // Add to feed
        const newItem: TacticalFeedItem = {
          ...decision,
          id: `live-${Date.now()}`,
          parentId: `inv-${Date.now()}`,
          timestamp: new Date().toISOString(),
          status: "UNREAD",
        };

        setFeedItems((prev) => [newItem, ...prev]);
      } else {
        // If API fails (no key configured), add a demo response
        const demoResponse: TacticalFeedItem = {
          id: `demo-live-${Date.now()}`,
          parentId: `inv-${Date.now()}`,
          timestamp: new Date().toISOString(),
          status: "UNREAD",
          extracted_data: {
            vendor: input.slice(0, 30),
            amount_myr: Math.floor(Math.random() * 5000) + 100,
            is_lhdn_compliant: Math.random() > 0.3,
            classification: "LHDN_REVENUE_EXPENDITURE",
            date: new Date().toISOString().split("T")[0],
            description: input,
          },
          decision_logic: {
            action_priority: Math.random() > 0.5 ? "MEDIUM" : "LOW",
            recommendation:
              "Auto-classified as Revenue Expenditure. Verify SST ID with vendor.",
            rationale:
              "Based on transaction description. Section 33(1) — deductible if wholly and exclusively for business purposes.",
            tax_optimization_impact: `RM${(
              Math.floor(Math.random() * 1000) + 50
            ).toLocaleString()} potential deduction`,
          },
          ui_component: {
            type: "TACTICAL_CARD",
            display_message: `📝 Analyzed: "${input.slice(0, 50)}${
              input.length > 50 ? "..." : ""
            }"`,
          },
        };
        setFeedItems((prev) => [demoResponse, ...prev]);
      }
    } catch {
      console.warn("[PocketCFO] API unreachable, using demo mode");
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden ink-wash-bg">
      {/* Header */}
      <Header unreadCount={unreadCount} />

      {/* Main 3-Panel Layout */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* Left — Sidebar */}
        <Sidebar company={DEMO_COMPANY} health={DEMO_HEALTH} />

        {/* Center — Tactical Feed + Chat */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1 flex flex-col min-w-0 border-r border-border"
        >
          <TacticalFeed initialItems={feedItems} />
          <ChatInput onSubmit={handleAnalyze} isProcessing={isProcessing} />
        </motion.div>

        {/* Right — Neural Brain */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-[480px] min-w-[380px] hidden lg:block glass-warm"
        >
          <NeuralBrain />
        </motion.div>
      </div>
    </div>
  );
}
