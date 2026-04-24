// ═══════════════════════════════════════════════════════════════
// PocketCFO — Decision Engine API Route (Server-side)
// POST /api/analyze
// Receives raw transaction text, calls Z.AI, writes to Firestore
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import zai from "@/lib/zai";
import { POCKETCFO_SYSTEM_PROMPT, CONTEXT_TEMPLATE } from "@/lib/prompts";
import type { PocketCFODecision } from "@/lib/types";
import { DEMO_COMPANY, DEMO_HEALTH } from "@/lib/mock-data";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rawInput } = body as { rawInput: string };

    if (!rawInput || rawInput.trim().length === 0) {
      return NextResponse.json(
        { error: "No input provided" },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.ZAI_API_KEY) {
      return NextResponse.json(
        { error: "Z.AI API key not configured. Add ZAI_API_KEY to .env.local" },
        { status: 503 }
      );
    }

    console.log("[PocketCFO] Using API key prefix:", process.env.ZAI_API_KEY?.slice(0, 8) + "...");
    console.log("[PocketCFO] Using base URL:", process.env.ZAI_BASE_URL);

    // Build company context from Firestore (demo mode uses mock data)
    const companyContext = JSON.stringify(
      {
        company: DEMO_COMPANY,
        health: DEMO_HEALTH,
      },
      null,
      2
    );

    const userMessage = CONTEXT_TEMPLATE(companyContext, rawInput);

    // Call Z.AI GLM-5
    const completion = await zai.chat.completions.create({
      model: "ilmu-glm-5.1",
      messages: [
        { role: "system", content: POCKETCFO_SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    const responseContent = completion.choices[0]?.message?.content;

    if (!responseContent) {
      return NextResponse.json(
        { error: "Empty response from AI engine" },
        { status: 502 }
      );
    }

    const aiDecision: PocketCFODecision = JSON.parse(responseContent);

    // Return decision to the client — client will write to Firestore
    // (We write from client-side to leverage real-time onSnapshot)
    return NextResponse.json({
      success: true,
      decision: aiDecision,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[PocketCFO] Decision Engine Error:", error);

    const message =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      { error: `Decision engine failed: ${message}` },
      { status: 500 }
    );
  }
}