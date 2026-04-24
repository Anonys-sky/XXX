// ═══════════════════════════════════════════════════════════════
// PocketCFO — Demo / Mock Data
// Used when Firebase is not configured or for hackathon demo
// ═══════════════════════════════════════════════════════════════

import type {
  TacticalFeedItem,
  CompanyProfile,
  FinancialHealth,
} from "./types";

export const DEMO_COMPANY: CompanyProfile = {
  name: "Warung Pixel Sdn Bhd",
  sstId: "W10-1234-56789012",
  tin: "C-12345678",
  taxYear: 2026,
  annualRevenue: 520000,
  monthlyExpenses: 38500,
  currentTaxBracket: 17,
};

export const DEMO_HEALTH: FinancialHealth = {
  liquidityRatio: 1.8,
  monthToDateRevenue: 48200,
  monthToDateExpenses: 38500,
  expenseToRevenueRatio: 0.799,
  pendingInvoices: 3,
  complianceRate: 94,
  taxBracketDistance: 80000,
};

export const DEMO_FEED: TacticalFeedItem[] = [
  {
    id: "demo-1",
    parentId: "inv-001",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    status: "UNREAD",
    extracted_data: {
      vendor: "IKEA Damansara",
      amount_myr: 7850.0,
      is_lhdn_compliant: true,
      classification: "LHDN_CAPITAL_ALLOWANCE",
      sst_id: "W10-1823-32040218",
      date: "2026-04-24",
      description: "Office furniture — standing desks x3",
    },
    decision_logic: {
      action_priority: "MEDIUM",
      recommendation:
        "Reclassify as Capital Allowance under Schedule 3 for 20% annual write-off",
      rationale:
        "Furniture exceeding RM5,000 qualifies for CA instead of Revenue Expenditure. Section 33(1) — deductible over 5 years vs. immediate expense.",
      tax_optimization_impact: "Save RM1,884 in current FY tax liability",
    },
    ui_component: {
      type: "OPPORTUNITY",
      display_message:
        "💡 Reclassify IKEA purchase as Capital Allowance — save RM1,884 in tax",
    },
  },
  {
    id: "demo-2",
    parentId: "inv-002",
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    status: "UNREAD",
    extracted_data: {
      vendor: "Nasi Kandar Pelita",
      amount_myr: 485.6,
      is_lhdn_compliant: false,
      classification: "LHDN_ENTERTAINMENT_50PCT",
      date: "2026-04-24",
      description: "Client lunch meeting — 6 pax",
    },
    decision_logic: {
      action_priority: "CRITICAL",
      recommendation:
        "Request TIN from vendor — invoice missing Tax Identification Number",
      rationale:
        "Entertainment expense only 50% deductible. Missing TIN violates LHDN e-invoice mandate effective 2025. Non-compliance risk: RM20,000 fine.",
      tax_optimization_impact:
        "Only RM242.80 deductible. Risk of RM20,000 penalty if audited",
    },
    ui_component: {
      type: "ALERT",
      display_message:
        "🚨 Missing TIN on Pelita invoice — LHDN non-compliant. Request immediately.",
    },
  },
  {
    id: "demo-3",
    parentId: "inv-003",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    status: "CONFIRMED",
    extracted_data: {
      vendor: "TIME Internet",
      amount_myr: 299.0,
      is_lhdn_compliant: true,
      classification: "LHDN_REVENUE_EXPENDITURE",
      sst_id: "W10-1832-21040001",
      tin: "C-99887766",
      date: "2026-04-23",
      description: "Monthly broadband — Business 300Mbps plan",
    },
    decision_logic: {
      action_priority: "LOW",
      recommendation:
        "Auto-categorized as Revenue Expenditure — fully deductible",
      rationale:
        "Recurring utility expense. LHDN-compliant with valid TIN and SST ID. Monthly trend: consistent RM299.",
      tax_optimization_impact: "Full RM299 deduction applied to current FY",
    },
    ui_component: {
      type: "TACTICAL_CARD",
      display_message:
        "✅ TIME Internet auto-classified — RM299 fully deductible",
    },
  },
  {
    id: "demo-4",
    parentId: "inv-004",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    status: "UNREAD",
    extracted_data: {
      vendor: "Petronas Mesra",
      amount_myr: 180.0,
      is_lhdn_compliant: true,
      classification: "LHDN_REVENUE_EXPENDITURE",
      sst_id: "W10-0001-00000001",
      tin: "C-00112233",
      date: "2026-04-23",
      description: "Fuel — company vehicle RON95",
    },
    decision_logic: {
      action_priority: "MEDIUM",
      recommendation:
        "Monthly fuel trending 15% above budget. Consider carpooling or fuel card program.",
      rationale:
        "YTD fuel: RM2,160 vs budget RM1,800. Fully deductible but eroding profit margin. MTD expenses at 79.9% of revenue — approaching 80% threshold.",
      tax_optimization_impact:
        "⚠️ Approaching expense freeze threshold (80% of revenue)",
    },
    ui_component: {
      type: "TACTICAL_CARD",
      display_message:
        "⚠️ Fuel spend 15% over budget — MTD expenses at 79.9% of revenue",
    },
  },
  {
    id: "demo-5",
    parentId: "inv-005",
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    status: "UNREAD",
    extracted_data: {
      vendor: "Dell Technologies",
      amount_myr: 12500.0,
      is_lhdn_compliant: true,
      classification: "LHDN_CAPITAL_ALLOWANCE",
      sst_id: "W10-9192-83040001",
      tin: "C-55667788",
      date: "2026-04-22",
      description: "Laptop — Dell XPS 16 x2 for dev team",
    },
    decision_logic: {
      action_priority: "CRITICAL",
      recommendation:
        "Delay purchase to May 1 — avoid pushing into 24% tax bracket this quarter",
      rationale:
        "Adding RM12,500 this month pushes Q2 expenses to RM51,000. Annual revenue projection RM520k puts you RM80k from the 24% bracket (RM600k). Deferring allows Q2 cashflow buffer.",
      tax_optimization_impact:
        "Potential RM3,000 bracket savings + improved Q2 liquidity ratio (1.8x → 2.1x)",
    },
    ui_component: {
      type: "OPPORTUNITY",
      display_message:
        "💰 Delay Dell purchase to May — save RM3,000 and preserve liquidity",
    },
  },
];
