"use client";

// ═══════════════════════════════════════════════════════════════
// PocketCFO — Neural Brain Visualization
// React Flow canvas showing the AI decision-making process
// ═══════════════════════════════════════════════════════════════

import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
  type NodeTypes,
  type EdgeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import BrainNode from "./nodes/BrainNode";
import InputNode from "./nodes/InputNode";
import ProcessNode from "./nodes/ProcessNode";
import DecisionNode from "./nodes/DecisionNode";
import GlowEdge from "./edges/GlowEdge";

// ─── Node Type Registry ──────────────────────────────────────
const nodeTypes: NodeTypes = {
  brain: BrainNode,
  input: InputNode,
  process: ProcessNode,
  decision: DecisionNode,
};

const edgeTypes: EdgeTypes = {
  glow: GlowEdge,
};

// ─── Demo Graph Data ─────────────────────────────────────────
const defaultNodes: Node[] = [
  // Central Brain
  {
    id: "brain",
    type: "brain",
    position: { x: 350, y: 180 },
    data: { label: "PocketCFO Engine" },
    draggable: false,
  },
  // Input Documents
  {
    id: "input-1",
    type: "input",
    position: { x: 30, y: 60 },
    data: {
      label: "IKEA Receipt",
      docType: "receipt",
      vendor: "IKEA Damansara",
      amount: 7850.0,
    },
  },
  {
    id: "input-2",
    type: "input",
    position: { x: 30, y: 230 },
    data: {
      label: "Pelita Invoice",
      docType: "invoice",
      vendor: "Nasi Kandar Pelita",
      amount: 485.6,
    },
  },
  {
    id: "input-3",
    type: "input",
    position: { x: 30, y: 390 },
    data: {
      label: "Dell Purchase",
      docType: "message",
      vendor: "Dell Technologies",
      amount: 12500.0,
    },
  },
  // Processing Nodes
  {
    id: "process-compliance",
    type: "process",
    position: { x: 600, y: 40 },
    data: {
      label: "LHDN",
      category: "compliance",
      status: "warning",
    },
  },
  {
    id: "process-cashflow",
    type: "process",
    position: { x: 600, y: 190 },
    data: {
      label: "Cashflow",
      category: "cashflow",
      status: "complete",
    },
  },
  {
    id: "process-tax",
    type: "process",
    position: { x: 600, y: 340 },
    data: {
      label: "Tax",
      category: "tax",
      status: "processing",
    },
  },
  // Decision Nodes
  {
    id: "decision-1",
    type: "decision",
    position: { x: 830, y: 30 },
    data: {
      label: "Request TIN from Pelita",
      outcome: "rejected",
      impact: "LHDN non-compliant — RM20k penalty risk",
    },
  },
  {
    id: "decision-2",
    type: "decision",
    position: { x: 830, y: 180 },
    data: {
      label: "Reclassify as Capital Allowance",
      outcome: "approved",
      impact: "Save RM1,884 in current FY",
    },
  },
  {
    id: "decision-3",
    type: "decision",
    position: { x: 830, y: 330 },
    data: {
      label: "Delay purchase to May",
      outcome: "pending",
      impact: "Avoid 24% bracket, preserve liquidity",
    },
  },
];

const defaultEdges: Edge[] = [
  // Inputs → Brain
  {
    id: "e-i1-b",
    source: "input-1",
    target: "brain",
    type: "glow",
    animated: true,
  },
  {
    id: "e-i2-b",
    source: "input-2",
    target: "brain",
    type: "glow",
    animated: true,
  },
  {
    id: "e-i3-b",
    source: "input-3",
    target: "brain",
    type: "glow",
    animated: true,
  },
  // Brain → Process
  {
    id: "e-b-p1",
    source: "brain",
    target: "process-compliance",
    type: "glow",
    animated: true,
  },
  {
    id: "e-b-p2",
    source: "brain",
    target: "process-cashflow",
    type: "glow",
    animated: true,
  },
  {
    id: "e-b-p3",
    source: "brain",
    target: "process-tax",
    type: "glow",
    animated: true,
  },
  // Process → Decisions
  {
    id: "e-p1-d1",
    source: "process-compliance",
    target: "decision-1",
    type: "glow",
    animated: true,
  },
  {
    id: "e-p2-d2",
    source: "process-cashflow",
    target: "decision-2",
    type: "glow",
    animated: true,
  },
  {
    id: "e-p3-d3",
    source: "process-tax",
    target: "decision-3",
    type: "glow",
    animated: true,
  },
];

export default function NeuralBrain() {
  const nodes = useMemo(() => defaultNodes, []);
  const edges = useMemo(() => defaultEdges, []);

  const proOptions = useMemo(() => ({ hideAttribution: true }), []);

  const onInit = useCallback(() => {
    // Could trigger entrance animations here
  }, []);

  return (
    <div className="w-full h-full relative">
      {/* Title overlay */}
      <div className="absolute top-3 left-4 z-10 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-teal animate-pulse" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-light">
          Neural Decision Graph
        </span>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onInit={onInit}
        proOptions={proOptions}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.4}
        maxZoom={1.5}
        nodesDraggable
        nodesConnectable={false}
        elementsSelectable={false}
        panOnScroll
        className="!bg-transparent"
      >
        <Background color="rgba(0, 212, 170, 0.03)" gap={24} size={1} />
        <Controls
          showInteractive={false}
          className="!bottom-4 !right-4 !left-auto"
        />
      </ReactFlow>
    </div>
  );
}
