// ═══════════════════════════════════════════════════════════════
// PocketCFO — Z.AI GLM-5 Client (Server-side ONLY)
// IMPORTANT: This file must ONLY run on the server.
// The API key is read from env (NOT prefixed with NEXT_PUBLIC_)
// ═══════════════════════════════════════════════════════════════

import OpenAI from "openai";

// Server-side only — env vars without NEXT_PUBLIC_ prefix
// are never exposed to the browser bundle.
const zai = new OpenAI({
  apiKey: process.env.ZAI_API_KEY || "",
  baseURL: process.env.ZAI_BASE_URL || "https://api.z.ai/api/paas/v4",
});

export default zai;
