"use client";

// ═══════════════════════════════════════════════════════════════
// PocketCFO — Header Component
// Logo, AI engine status, notification bell
// Asian Water Painting aesthetic
// ═══════════════════════════════════════════════════════════════

import { motion } from "framer-motion";
import { Brain, Bell, Wifi, Shield } from "lucide-react";

interface HeaderProps {
  unreadCount: number;
}

export default function Header({ unreadCount }: HeaderProps) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="h-16 min-h-16 flex items-center justify-between px-6 glass border-b border-border z-50"
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-9 h-9 rounded-xl bg-primary-soft flex items-center justify-center animate-pulse-glow">
            <Brain className="w-5 h-5 text-navy" />
          </div>
          {/* Pulse indicator */}
          <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-primary rounded-full opacity-80" />
        </div>
        <div>
          <h1 className="text-base font-bold tracking-tight">
            <span className="gradient-text">Pocket</span>
            <span className="text-navy">CFO</span>
          </h1>
          <p className="text-[10px] text-mist -mt-0.5">
            Decision Intelligence Engine
          </p>
        </div>
      </div>

      {/* Center — Status Pills */}
      <div className="hidden md:flex items-center gap-3">
        <StatusPill icon={Brain} label="GLM-5 Online" color="primary" active />
        <StatusPill icon={Shield} label="LHDN Connected" color="jade" active />
        <StatusPill icon={Wifi} label="Real-time" color="primary" active />
      </div>

      {/* Right — Notifications */}
      <div className="flex items-center gap-3">
        <button
          className="relative p-2 rounded-xl hover:bg-surface-hover transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-mist" />
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-vermillion rounded-full flex items-center justify-center"
            >
              <span className="text-[10px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            </motion.div>
          )}
        </button>
      </div>
    </motion.header>
  );
}

function StatusPill({
  icon: Icon,
  label,
  color,
  active,
}: {
  icon: React.ElementType;
  label: string;
  color: string;
  active: boolean;
}) {
  const colorMap: Record<string, string> = {
    primary: "bg-primary",
    jade: "bg-jade",
    vermillion: "bg-vermillion",
  };
  const dotBg = active ? (colorMap[color] || "bg-primary") : "bg-mist";

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-warm text-xs text-mist">
      <div className="relative">
        <div className={`w-1.5 h-1.5 rounded-full ${dotBg}`} />
        {active && (
          <div
            className={`absolute inset-0 w-1.5 h-1.5 rounded-full ${dotBg} animate-ping opacity-50`}
          />
        )}
      </div>
      <Icon className="w-3 h-3" />
      <span>{label}</span>
    </div>
  );
}
