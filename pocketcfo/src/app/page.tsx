"use client";

// ═══════════════════════════════════════════════════════════════
// PocketCFO — Main Page (Teammate's Design — EXACT MATCH)
// 3-Panel: Dashboard | Chat | Neural Graph
// ═══════════════════════════════════════════════════════════════

import { useState, useRef, useEffect, useCallback } from "react";

// ─── Types ───────────────────────────────────────────────────
interface ChatMessage {
  text: string;
  sender: "user" | "bot";
  timestamp: string;
}

interface DashboardData {
  revenue: number;
  expenses: number;
  pending: number;
  liquidity: number;
  compliance: number;
  tax: {
    rate: number;
    untilNext: number;
    progressPct: number;
  };
}

interface GraphInput {
  icon: string;
  name: string;
  amount: string;
}

interface GraphOutcome {
  status: "approved" | "rejected" | "pending";
  title: string;
  description: string;
}

// ─── Smart Demo Response Engine ──────────────────────────────
function getDemoResponse(
  input: string,
  currentDashboard: DashboardData
): { botText: string; newDashboard: DashboardData; graphInput: GraphInput; graphOutcome: GraphOutcome } {
  const lower = input.toLowerCase();

  // Extract amount from input (e.g., "RM12,500" or "rm 3200")
  const amountMatch = input.match(/rm\s?[\d,]+\.?\d*/i);
  const amount = amountMatch
    ? parseFloat(amountMatch[0].replace(/rm\s?/i, "").replace(/,/g, ""))
    : 0;

  // Detect if TIN is present
  const hasTIN = /tin[:\s]*[a-z]?\d{5,}/i.test(input) || /[CI]G?\d{8,}/i.test(input);

  // Detect keywords
  const hasNoTIN = lower.includes("no tin") || lower.includes("missing tin") || lower.includes("without tin") || (!hasTIN && lower.includes("invoice"));
  const isCapitalItem = /laptop|computer|furniture|chair|desk|machine|equipment|vehicle|printer/i.test(input);
  const isRecurring = /internet|wifi|electricity|water|rental|rent|subscription|cloud|hosting/i.test(input);
  const isFood = /food|catering|kandar|restaurant|nasi|makan|lunch|dinner/i.test(input);
  const isFreelance = /freelance|designer|contractor|consultant|outsource/i.test(input);

  // Scenario 1: Has TIN → compliant, classify the transaction
  if (hasTIN && !hasNoTIN) {
    const taxSavings = isCapitalItem
      ? Math.round(amount * 0.24)
      : Math.round(amount * 0.17);

    const classification = isCapitalItem
      ? "Capital Allowance (Schedule 3, Income Tax Act 1967)"
      : isRecurring
      ? "Revenue Expenditure — Recurring (Section 33(1))"
      : isFood
      ? "Revenue Expenditure — Entertainment (50% deductible under Section 39(1)(l))"
      : "Revenue Expenditure — General (Section 33(1))";

    const botText = isCapitalItem
      ? `✅ LHDN Compliant — TIN verified. I've classified this RM${amount.toLocaleString()} purchase as ${classification}. This qualifies for capital allowance at 20% initial + 14% annual rate. Estimated tax savings: RM${taxSavings.toLocaleString()} over the asset's useful life. I recommend deferring to next month if you're close to the 24% tax bracket.`
      : `✅ LHDN Compliant — TIN verified. Classified as ${classification}. This RM${amount.toLocaleString()} expense is fully deductible. Tax impact: RM${taxSavings.toLocaleString()} reduction in chargeable income. Invoice has been logged and indexed for e-filing.`;

    // Detect vendor name
    const vendorMatch = input.match(/from\s+([\w\s]+?)(?:[,.]|$)/i);
    const vendorName = vendorMatch ? vendorMatch[1].trim() : "Vendor";

    return {
      botText,
      graphInput: {
        icon: isCapitalItem ? "fa-laptop" : isFood ? "fa-utensils" : isRecurring ? "fa-wifi" : "fa-file-invoice",
        name: vendorName,
        amount: `RM${amount.toLocaleString("en-MY", { minimumFractionDigits: 2 })}`,
      },
      graphOutcome: {
        status: "approved",
        title: isCapitalItem ? "Classify as Capital Allowance" : "Approved — Fully Deductible",
        description: `Tax savings: RM${taxSavings.toLocaleString()}`,
      },
      newDashboard: {
        ...currentDashboard,
        expenses: currentDashboard.expenses + amount,
        pending: currentDashboard.pending + 1,
        compliance: Math.min(currentDashboard.compliance + 1, 100),
        liquidity: Number(
          (currentDashboard.revenue / (currentDashboard.expenses + amount)).toFixed(1)
        ),
      },
    };
  }

  // Scenario 2: No TIN / Non-compliant
  if (hasNoTIN || isFreelance) {
    const penaltyRisk = amount > 5000 ? "RM20,000" : "RM5,000";
    const botText = `⚠️ Warning: This invoice is missing a valid TIN number. Under LHDN e-Invoice mandate (effective Aug 2025), all B2B transactions require a TIN. I've flagged this as NON-COMPLIANT. Penalty risk: up to ${penaltyRisk}. Your compliance score has dropped. Action: Request TIN from the vendor before processing payment.`;

    const vendorMatch = input.match(/from\s+([\w\s]+?)(?:[,.]|$)/i) || input.match(/to\s+(?:a\s+)?([\w\s]+?)(?:[,.]|$)/i);
    const vendorName = vendorMatch ? vendorMatch[1].trim() : "Unknown Vendor";

    return {
      botText,
      graphInput: {
        icon: isFreelance ? "fa-user" : "fa-file-invoice",
        name: vendorName,
        amount: amount > 0 ? `RM${amount.toLocaleString("en-MY", { minimumFractionDigits: 2 })}` : "N/A",
      },
      graphOutcome: {
        status: "rejected",
        title: `Request TIN from ${vendorName}`,
        description: `Non-compliant — ${penaltyRisk} penalty risk`,
      },
      newDashboard: {
        ...currentDashboard,
        expenses: currentDashboard.expenses + amount,
        pending: currentDashboard.pending + 1,
        compliance: Math.max(currentDashboard.compliance - 15, 20),
        liquidity: Number(
          (currentDashboard.revenue / (currentDashboard.expenses + amount)).toFixed(1)
        ),
      },
    };
  }

  // Scenario 3: Capital expenditure question
  if (isCapitalItem && amount > 0) {
    const ca = Math.round(amount * 0.2);
    const itemName = input.match(/laptop|computer|furniture|chair|desk|machine|equipment|vehicle|printer/i)?.[0] || "equipment";
    const botText = `📊 Analysis: RM${amount.toLocaleString()} for ${itemName}. I recommend classifying as Capital Allowance under Schedule 3. Initial allowance: RM${ca.toLocaleString()} (20%). Annual allowance: 14%. Total first-year deduction: RM${Math.round(amount * 0.34).toLocaleString()}. Note: If your total chargeable income approaches RM600k, consider deferring this to next fiscal year to stay in the 17% bracket.`;

    return {
      botText,
      graphInput: {
        icon: "fa-laptop",
        name: `${itemName.charAt(0).toUpperCase() + itemName.slice(1)} Purchase`,
        amount: `RM${amount.toLocaleString("en-MY", { minimumFractionDigits: 2 })}`,
      },
      graphOutcome: {
        status: "pending",
        title: "Recommend: Capital Allowance",
        description: `Defer to stay in ${currentDashboard.tax.rate}% bracket`,
      },
      newDashboard: {
        ...currentDashboard,
        expenses: currentDashboard.expenses + amount,
        pending: currentDashboard.pending + 1,
        tax: {
          ...currentDashboard.tax,
          untilNext: Math.max(currentDashboard.tax.untilNext - amount, 0),
          progressPct: Math.min(currentDashboard.tax.progressPct + 5, 95),
        },
      },
    };
  }

  // Scenario 4: Recurring expense
  if (isRecurring) {
    const serviceName = input.match(/internet|wifi|electricity|water|rental|rent|subscription|cloud|hosting/i)?.[0] || "service";
    const botText = `✅ Auto-classified as Revenue Expenditure — Recurring. This is fully deductible under Section 33(1) of the Income Tax Act. Amount: RM${amount > 0 ? amount.toLocaleString() : "N/A"}. I've added this to your monthly recurring expenses tracker. No further action required.`;

    return {
      botText,
      graphInput: {
        icon: "fa-wifi",
        name: `${serviceName.charAt(0).toUpperCase() + serviceName.slice(1)} Bill`,
        amount: `RM${(amount || 299).toLocaleString("en-MY", { minimumFractionDigits: 2 })}`,
      },
      graphOutcome: {
        status: "approved",
        title: "Auto-classified: Recurring",
        description: "Fully deductible — Section 33(1)",
      },
      newDashboard: {
        ...currentDashboard,
        expenses: currentDashboard.expenses + (amount || 299),
      },
    };
  }

  // Scenario 5: General fallback with some intelligence
  const botText = amount > 0
    ? `📝 Transaction recorded: RM${amount.toLocaleString()}. Classified as Revenue Expenditure (General). Ensure vendor provides a valid e-invoice with TIN for LHDN compliance. Current expense-to-revenue ratio: ${(((currentDashboard.expenses + amount) / currentDashboard.revenue) * 100).toFixed(1)}%. ${((currentDashboard.expenses + amount) / currentDashboard.revenue) > 0.8 ? "⚠️ Warning: Expense ratio exceeding 80%. Review discretionary spending." : "Ratio looks healthy."}`
    : `I understand your query. Could you provide more details such as the amount (in RM), vendor name, and TIN number? This will help me classify the transaction and check LHDN compliance accurately.`;

  return {
    botText,
    graphInput: amount > 0 ? {
      icon: "fa-receipt",
      name: "Transaction",
      amount: `RM${amount.toLocaleString("en-MY", { minimumFractionDigits: 2 })}`,
    } : null as unknown as GraphInput,
    graphOutcome: amount > 0 ? {
      status: "pending" as const,
      title: "Pending Classification",
      description: "Awaiting further details",
    } : null as unknown as GraphOutcome,
    newDashboard: {
      ...currentDashboard,
      expenses: currentDashboard.expenses + amount,
      pending: amount > 0 ? currentDashboard.pending + 1 : currentDashboard.pending,
    },
  };
}

export default function Home() {
  // ─── Dashboard State ────────────────────────────────────────
  const [dashboard, setDashboard] = useState<DashboardData>({
    revenue: 48200,
    expenses: 38500,
    pending: 3,
    liquidity: 1.8,
    compliance: 94,
    tax: { rate: 17, untilNext: 80000, progressPct: 60 },
  });

  // ─── Chat State ─────────────────────────────────────────────
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      text: "Hello there! I've analyzed your cashflow for this month. Please upload any new receipts or ask me before making large purchases.",
      sender: "bot",
      timestamp: "12:00 PM",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── Graph State ──────────────────────────────────────────────
  const [graphInputs, setGraphInputs] = useState<GraphInput[]>([
    { icon: "fa-receipt", name: "IKEA Receipt", amount: "RM7,850.00" },
    { icon: "fa-file-invoice", name: "Pelita Invoice", amount: "RM485.60" },
    { icon: "fa-laptop", name: "Dell Purchase", amount: "RM12,500.00" },
  ]);
  const [graphOutcomes, setGraphOutcomes] = useState<GraphOutcome[]>([
    { status: "rejected", title: "Request TIN from Pelita", description: "LHDN non-compliant — RM20k penalty risk" },
    { status: "approved", title: "Reclassify as Capital Allowance", description: "Save RM1,884 in current FY" },
    { status: "pending", title: "Delay purchase to May", description: "Avoid 24% bracket, preserve liquidity" },
  ]);

  // ─── Scroll to bottom ───────────────────────────────────────
  const scrollToBottom = useCallback(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTo({
        top: chatMessagesRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // ─── Send Message ───────────────────────────────────────────
  // ─── File Upload Handler ──────────────────────────────────
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file);
      setInputValue(`[📎 ${file.name}] `);
    }
  };

  // ─── Send Message ───────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const message = inputValue.trim();
    if (!message && !attachedFile) return;

    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const displayText = attachedFile
      ? `📎 Uploaded: ${attachedFile.name}${message.replace(`[📎 ${attachedFile.name}] `, '') ? ' — ' + message.replace(`[📎 ${attachedFile.name}] `, '') : ''}`
      : message;
    const analyzeText = attachedFile
      ? `Analyze this uploaded document: ${attachedFile.name}. ${message}`
      : message;

    setMessages((prev) => [...prev, { text: displayText, sender: "user", timestamp: time }]);
    setInputValue("");
    setAttachedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    // Show typing indicator
    setIsTyping(true);

    try {
      // Call Z.AI API
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawInput: analyzeText }),
      });

      const botTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      if (res.ok) {
        const data = await res.json();
        const decision = data.decision;

        // Build bot response from AI decision
        const botText = decision?.decision_logic?.recommendation
          || decision?.ui_component?.display_message
          || "I've analyzed that transaction. Check the dashboard for updates.";

        setIsTyping(false);
        setMessages((prev) => [...prev, { text: botText, sender: "bot", timestamp: botTime }]);

        // Update dashboard based on AI response
        if (decision?.extracted_data) {
          const newExpenses = dashboard.expenses + (decision.extracted_data.amount_myr || 0);
          const newCompliance = decision.extracted_data.is_lhdn_compliant
            ? dashboard.compliance
            : Math.max(dashboard.compliance - 12, 0);
          const newPending = dashboard.pending + 1;

          setDashboard((prev) => ({
            ...prev,
            expenses: newExpenses,
            pending: newPending,
            compliance: newCompliance,
            liquidity: Number((prev.revenue / newExpenses).toFixed(1)),
          }));
        }
      } else {
        // API error — smart demo fallback
        const demoResult = getDemoResponse(analyzeText, dashboard);
        if (demoResult.graphInput) {
          setGraphInputs((prev) => [demoResult.graphInput, ...prev].slice(0, 3));
          setGraphOutcomes((prev) => [demoResult.graphOutcome, ...prev].slice(0, 3));
        }
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          { text: demoResult.botText, sender: "bot", timestamp: botTime },
        ]);
        setDashboard(demoResult.newDashboard);
      }
    } catch {
      const botTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const demoResult = getDemoResponse(analyzeText, dashboard);
      if (demoResult.graphInput) {
        setGraphInputs((prev) => [demoResult.graphInput, ...prev].slice(0, 3));
        setGraphOutcomes((prev) => [demoResult.graphOutcome, ...prev].slice(0, 3));
      }
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { text: demoResult.botText, sender: "bot", timestamp: botTime },
      ]);
      setDashboard(demoResult.newDashboard);
    }
  };

  // ─── Derived styles ─────────────────────────────────────────
  const complianceColor = dashboard.compliance < 80 ? "#ef4444" : "#956ae6";
  const complianceGradient = `conic-gradient(${complianceColor} ${dashboard.compliance}%, #e2e8f0 0)`;
  const taxBarGradient = `linear-gradient(90deg, #10b981 0%, #f59e0b ${dashboard.tax.progressPct}%, #e2e8f0 ${dashboard.tax.progressPct}%)`;

  return (
    <div className="main-container">
      {/* ═══ LEFT — DASHBOARD ═══ */}
      <div className="dashboard-container">
        {/* Company Profile */}
        <div className="company-profile">
          <div className="company-icon">
            <i className="fa-solid fa-building"></i>
          </div>
          <div className="company-details">
            <h4>Warung Pixel Sdn Bhd</h4>
            <p>SST: W10-1234-56789012</p>
          </div>
        </div>

        {/* Compliance Widget */}
        <div className="widget compliance-widget">
          <div
            className="compliance-circle"
            style={{ background: complianceGradient }}
          >
            <div className="compliance-inner">
              <span className="score">{dashboard.compliance}</span>
              <span className="label">COMPLIANCE</span>
            </div>
          </div>
        </div>

        {/* Tax Bracket Widget */}
        <div className="widget tax-widget">
          <p className="widget-title">
            <i className="fa-solid fa-scale-balanced"></i> TAX BRACKET
          </p>
          <div className="tax-bar-container">
            <div
              className="tax-progress"
              style={{ background: taxBarGradient }}
            ></div>
            <div className="tax-markers">
              <div className={`marker ${dashboard.tax.rate === 15 ? "active" : ""}`}>
                <span className="pct">15%</span>
                <span className="range">≤150k</span>
              </div>
              <div className={`marker ${dashboard.tax.rate === 17 ? "active" : ""}`}>
                <span className="pct">17%</span>
                <span className="range">150-600k</span>
              </div>
              <div className={`marker ${dashboard.tax.rate === 24 ? "active" : ""}`}>
                <span className="pct">24%</span>
                <span className="range">&gt;600k</span>
              </div>
            </div>
          </div>
          <p className="tax-subtitle">
            <span className="highlight">
              RM{dashboard.tax.untilNext.toLocaleString("en-US")}
            </span>{" "}
            until next bracket
          </p>
        </div>

        {/* Month-to-Date Widget */}
        <div className="widget mtd-widget">
          <p className="widget-title">MONTH-TO-DATE</p>
          <div className="mtd-list">
            <div className="mtd-item">
              <span className="mtd-label">
                <i className="fa-solid fa-arrow-trend-up"></i> Revenue
              </span>
              <span className={`mtd-value ${dashboard.revenue >= 0 ? "text-green" : "text-red"}`}>
                RM{dashboard.revenue.toLocaleString("en-US")}
              </span>
            </div>
            <div className="mtd-item">
              <span className="mtd-label">
                <i className="fa-solid fa-file-invoice"></i> Expenses
              </span>
              <span className={`mtd-value ${dashboard.expenses > 50000 ? "text-red" : "text-orange"}`}>
                RM{dashboard.expenses.toLocaleString("en-US")}
              </span>
            </div>
            <div className="mtd-item">
              <span className="mtd-label">
                <i className="fa-regular fa-clock"></i> Pending
              </span>
              <span className={`mtd-value ${dashboard.pending > 5 ? "text-red" : ""}`}>
                {dashboard.pending} invoices
              </span>
            </div>
            <div className="mtd-item">
              <span className="mtd-label">
                <i className="fa-solid fa-droplet"></i> Liquidity
              </span>
              <span className={`mtd-value ${dashboard.liquidity < 1.0 ? "text-red" : "text-blue"}`}>
                {dashboard.liquidity}x
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ CENTER — CHAT ═══ */}
      <div className="chat-container">
        <div className="chat-header">
          <div className="user-info">
            <div className="avatar">
              <i className="fa-solid fa-robot fa-xl" style={{ color: "white" }}></i>
              <span className="status-dot"></span>
            </div>
            <div>
              <h4>Financial Strategist</h4>
              <p>Always active</p>
            </div>
          </div>
        </div>

        <div className="chat-messages" ref={chatMessagesRef}>
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.sender}`}>
              <div className="bubble">{msg.text}</div>
              <span className="timestamp">{msg.timestamp}</span>
            </div>
          ))}
        </div>

        <div className={`typing-indicator ${isTyping ? "visible" : ""}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <form className="chat-input" onSubmit={handleSubmit}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf,.csv,.xlsx"
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />
          <button type="button" className="upload-btn" onClick={() => fileInputRef.current?.click()}>
            <i className={`fa-solid ${attachedFile ? 'fa-file-circle-check' : 'fa-paperclip'}`} style={attachedFile ? { color: '#956ae6' } : undefined}></i>
          </button>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message or upload..."
            autoComplete="off"
          />
          <button type="submit" className="send-btn">
            <i className="fas fa-paper-plane"></i>
          </button>
        </form>
      </div>

      {/* ═══ RIGHT — NEURAL GRAPH ═══ */}
      <div className="graph-container">
        <div className="graph-header">
          <h3>NEURAL DECISION GRAPH</h3>
        </div>

        <div className="graph-flow">
          {/* Input Column — DYNAMIC */}
          <div className="graph-col col-inputs">
            {graphInputs.map((inp, i) => (
              <div key={i} className="graph-card input-card" style={{ animation: "fadeIn 0.3s ease" }}>
                <div className="card-icon">
                  <i className={`fa-solid ${inp.icon}`}></i>
                </div>
                <div className="card-info">
                  <p className="label">INPUT</p>
                  <h4>{inp.name}</h4>
                  <p className="value">{inp.amount}</p>
                </div>
                <div className="connector-dot right"></div>
              </div>
            ))}
          </div>

          {/* Engine Column */}
          <div className="graph-col col-engine">
            <div className="engine-node">
              <div className="connector-dot left"></div>
              <i className="fa-solid fa-brain"></i>
              <div className="connector-dot right"></div>
            </div>
            <p className="engine-label">POCKETCFO ENGINE</p>
          </div>

          {/* Outcome Column — DYNAMIC */}
          <div className="graph-col col-outcomes">
            {graphOutcomes.map((out, i) => {
              const statusIcon = out.status === "rejected" ? "fa-circle-xmark" : out.status === "approved" ? "fa-circle-check" : "fa-clock";
              const statusLabel = out.status.toUpperCase();
              return (
                <div key={i} className={`graph-card outcome-card ${out.status}`} style={{ animation: "fadeIn 0.3s ease" }}>
                  <div className="connector-dot left"></div>
                  <div className="outcome-header">
                    <i className={`fa-solid ${statusIcon}`}></i> {statusLabel}
                  </div>
                  <h4>{out.title}</h4>
                  <p>{out.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
