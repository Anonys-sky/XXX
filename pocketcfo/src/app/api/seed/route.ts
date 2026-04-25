// ═══════════════════════════════════════════════════════════════
// PocketCFO — Seed Demo Data API Route
// GET /api/seed — Populates Firestore with demo data
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from "next/server";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, addDoc, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { DEMO_COMPANY, DEMO_HEALTH, DEMO_FEED } from "@/lib/mock-data";

// Initialize Firebase directly here (client SDK, server context)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function getDb() {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  return getFirestore(app);
}

export async function GET() {
  try {
    const db = getDb();

    // 1. Seed company profile
    await setDoc(doc(db, "users", "demo-user"), {
      ...DEMO_COMPANY,
      updatedAt: serverTimestamp(),
    });

    // 2. Seed financial health
    await setDoc(doc(db, "financial_health", "demo-user"), {
      ...DEMO_HEALTH,
      updatedAt: serverTimestamp(),
    });

    // 3. Seed tactical feed items
    const feedIds: string[] = [];
    for (const item of DEMO_FEED) {
      const { id: _id, ...rest } = item;
      const docRef = await addDoc(collection(db, "tactical_feed"), {
        ...rest,
        timestamp: serverTimestamp(),
      });
      feedIds.push(docRef.id);
    }

    return NextResponse.json({
      success: true,
      message: "Demo data seeded to Firestore",
      seeded: {
        users: 1,
        financial_health: 1,
        tactical_feed: feedIds.length,
        feedIds,
      },
    });
  } catch (error) {
    console.error("[PocketCFO] Seed error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Seed failed: ${message}` },
      { status: 500 }
    );
  }
}
