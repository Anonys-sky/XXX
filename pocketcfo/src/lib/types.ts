// ═══════════════════════════════════════════════════════════════
// PocketCFO — TypeScript Interfaces
// All data models for the Decision Intelligence pipeline
// ═══════════════════════════════════════════════════════════════

/** LHDN classification codes */
export type LHDNClassification =
  | "LHDN_REVENUE_EXPENDITURE"
  | "LHDN_CAPITAL_ALLOWANCE"
  | "LHDN_ENTERTAINMENT_50PCT"
  | "LHDN_SST_EXEMPT"
  | "LHDN_PERSONAL"
  | "LHDN_UNCLASSIFIED";

/** Action priority levels */
export type ActionPriority = "LOW" | "MEDIUM" | "CRITICAL";

/** UI card types for the Tactical Feed */
export type CardType = "TACTICAL_CARD" | "ALERT" | "OPPORTUNITY";

/** LHDN compliance status */
export type LHDNStatus = "VALIDATED" | "ACTION_REQUIRED" | "PENDING";

/** ─── Extracted Data ────────────────────────────────────── */
export interface ExtractedData {
  vendor: string;
  amount_myr: number;
  is_lhdn_compliant: boolean;
  classification: LHDNClassification;
  sst_id?: string;
  tin?: string;
  date?: string;
  description?: string;
}

/** ─── Decision Logic ────────────────────────────────────── */
export interface DecisionLogic {
  action_priority: ActionPriority;
  recommendation: string;
  rationale: string;
  tax_optimization_impact: string;
}

/** ─── UI Component Metadata ─────────────────────────────── */
export interface UIComponent {
  type: CardType;
  display_message: string;
}

/** ─── Full PocketCFO Decision (returned by Z.AI) ────────── */
export interface PocketCFODecision {
  extracted_data: ExtractedData;
  decision_logic: DecisionLogic;
  ui_component: UIComponent;
}

/** ─── Tactical Feed Document (Firestore) ────────────────── */
export interface TacticalFeedItem extends PocketCFODecision {
  id: string;
  parentId: string;
  timestamp: string;
  status: "UNREAD" | "READ" | "CONFIRMED" | "DISMISSED";
}

/** ─── Invoice Document (Firestore) ──────────────────────── */
export interface Invoice {
  id: string;
  rawInput: string;
  inputType: "text" | "receipt" | "pdf";
  isProcessed: boolean;
  lhdnStatus: LHDNStatus;
  createdAt: string;
  extractedData?: ExtractedData;
}

/** ─── Company Profile ───────────────────────────────────── */
export interface CompanyProfile {
  name: string;
  sstId: string;
  tin: string;
  taxYear: number;
  annualRevenue: number;
  monthlyExpenses: number;
  currentTaxBracket: number; // percentage: 15, 17, or 24
}

/** ─── Financial Health Snapshot ──────────────────────────── */
export interface FinancialHealth {
  liquidityRatio: number;
  monthToDateRevenue: number;
  monthToDateExpenses: number;
  expenseToRevenueRatio: number;
  pendingInvoices: number;
  complianceRate: number;
  taxBracketDistance: number; // RM until next bracket
}

/** ─── Neural Brain Node Types ───────────────────────────── */
export type NeuralNodeType = "brain" | "input" | "process" | "decision";
export type ProcessCategory = "LHDN Compliance" | "Cashflow Impact" | "Tax Strategy";
export type DecisionOutcome = "approved" | "rejected" | "pending";
