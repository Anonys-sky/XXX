"use client";

// ═══════════════════════════════════════════════════════════════
// PocketCFO — Sidebar Component
// Company profile, Financial Health Score, Tax Bracket Meter
// Asian Water Painting aesthetic
// ═══════════════════════════════════════════════════════════════

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  TrendingUp,
  FileCheck,
  AlertTriangle,
  Landmark,
  Wallet,
} from "lucide-react";
import type { CompanyProfile, FinancialHealth } from "@/lib/types";

interface SidebarProps {
  company: CompanyProfile;
  health: FinancialHealth;
}

/** Animated circular progress ring */
function HealthRing({
  value,
  max = 100,
  label,
  color,
}: {
  value: number;
  max?: number;
  label: string;
  color: string;
}) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const progress = (animatedValue / max) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(value), 300);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-32 h-32">
        <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
          {/* Background ring */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="rgba(53, 71, 97, 0.06)"
            strokeWidth="8"
          />
          {/* Progress ring */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            style={{
              transition: "stroke-dashoffset 1.5s ease-in-out",
              filter: `drop-shadow(0 0 6px ${color}30)`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono-nums text-2xl font-bold text-navy">
            {animatedValue}
          </span>
          <span className="text-[10px] text-mist uppercase tracking-wider">
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}

/** Tax bracket visualization */
function TaxBracketMeter({ bracket, distance }: { bracket: number; distance: number }) {
  const brackets = [
    { rate: 15, label: "≤150k", color: "#5B9E8F" },
    { rate: 17, label: "150-600k", color: "#C4956A" },
    { rate: 24, label: ">600k", color: "#D53746" },
  ];

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2 text-xs text-mist">
        <Landmark className="w-3.5 h-3.5" />
        <span className="uppercase tracking-wider">Tax Bracket</span>
      </div>
      <div className="flex gap-1.5">
        {brackets.map((b) => (
          <div key={b.rate} className="flex-1">
            <div
              className="h-2 rounded-full transition-all duration-700"
              style={{
                background:
                  b.rate <= bracket
                    ? b.color
                    : "rgba(53, 71, 97, 0.06)",
                boxShadow:
                  b.rate === bracket ? `0 0 10px ${b.color}30` : "none",
              }}
            />
            <div className="mt-1.5 flex justify-between">
              <span
                className="text-[10px] font-medium"
                style={{
                  color: b.rate === bracket ? b.color : "#8A9BAA",
                }}
              >
                {b.rate}%
              </span>
              <span className="text-[10px] text-mist">{b.label}</span>
            </div>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-mist mt-1">
        <span className="font-mono-nums text-warm font-semibold">
          RM{distance.toLocaleString()}
        </span>{" "}
        until next bracket
      </p>
    </div>
  );
}

/** Quick stat row */
function StatRow({
  icon: Icon,
  label,
  value,
  color = "text-navy",
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <div className="flex items-center gap-2 text-xs text-mist">
        <Icon className="w-3.5 h-3.5" />
        <span>{label}</span>
      </div>
      <span className={`font-mono-nums text-sm font-medium ${color}`}>
        {value}
      </span>
    </div>
  );
}

export default function Sidebar({ company, health }: SidebarProps) {
  return (
    <motion.aside
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-[280px] min-w-[280px] h-full flex flex-col glass-warm border-r border-border overflow-y-auto"
    >
      {/* Company Header */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-navy-soft flex items-center justify-center">
            <Building2 className="w-5 h-5 text-navy" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-navy truncate">{company.name}</h2>
            <p className="text-[10px] text-mist font-mono">
              SST: {company.sstId}
            </p>
          </div>
        </div>
      </div>

      {/* Health Score */}
      <div className="p-5 border-b border-border flex justify-center">
        <HealthRing
          value={health.complianceRate}
          label="Compliance"
          color="#82BCD5"
        />
      </div>

      {/* Tax Bracket */}
      <div className="p-5 border-b border-border">
        <TaxBracketMeter
          bracket={company.currentTaxBracket}
          distance={health.taxBracketDistance}
        />
      </div>

      {/* Quick Stats */}
      <div className="p-5 flex-1">
        <div className="text-[10px] uppercase tracking-wider text-mist mb-3">
          Month-to-Date
        </div>
        <div className="divide-y divide-border">
          <StatRow
            icon={TrendingUp}
            label="Revenue"
            value={`RM${health.monthToDateRevenue.toLocaleString()}`}
            color="text-jade"
          />
          <StatRow
            icon={Wallet}
            label="Expenses"
            value={`RM${health.monthToDateExpenses.toLocaleString()}`}
            color={
              health.expenseToRevenueRatio > 0.8 ? "text-vermillion" : "text-warm"
            }
          />
          <StatRow
            icon={FileCheck}
            label="Pending"
            value={`${health.pendingInvoices} invoices`}
          />
          <StatRow
            icon={AlertTriangle}
            label="Liquidity"
            value={`${health.liquidityRatio.toFixed(1)}x`}
            color={
              health.liquidityRatio < 1.5 ? "text-vermillion" : "text-primary"
            }
          />
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-[10px] text-center text-mist">
          FY{company.taxYear} · Bracket {company.currentTaxBracket}%
        </div>
      </div>
    </motion.aside>
  );
}
