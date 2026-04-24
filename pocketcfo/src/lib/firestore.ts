// ═══════════════════════════════════════════════════════════════
// PocketCFO — Firestore Operations
// Read/write to collections: users, invoices, tactical_feed
// ═══════════════════════════════════════════════════════════════

import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  where,
  serverTimestamp,
  type Unsubscribe,
  type DocumentData,
} from "firebase/firestore";
import { getFirestoreDb } from "./firebase";
import type {
  TacticalFeedItem,
  CompanyProfile,
  FinancialHealth,
  Invoice,
  PocketCFODecision,
} from "./types";

const db = () => getFirestoreDb();

// ─── Collection References ──────────────────────────────────
const COLLECTIONS = {
  USERS: "users",
  INVOICES: "invoices",
  TACTICAL_FEED: "tactical_feed",
  HEALTH: "financial_health",
} as const;

// ═══════════════════════════════════════════════════════════════
// COMPANY PROFILE
// ═══════════════════════════════════════════════════════════════

export async function getCompanyProfile(
  userId: string
): Promise<CompanyProfile | null> {
  const docRef = doc(db(), COLLECTIONS.USERS, userId);
  const snap = await getDoc(docRef);
  return snap.exists() ? (snap.data() as CompanyProfile) : null;
}

export async function setCompanyProfile(
  userId: string,
  profile: CompanyProfile
): Promise<void> {
  const docRef = doc(db(), COLLECTIONS.USERS, userId);
  await setDoc(docRef, { ...profile, updatedAt: serverTimestamp() });
}

// ═══════════════════════════════════════════════════════════════
// INVOICES
// ═══════════════════════════════════════════════════════════════

export async function addInvoice(
  invoiceData: Omit<Invoice, "id">
): Promise<string> {
  const docRef = await addDoc(collection(db(), COLLECTIONS.INVOICES), {
    ...invoiceData,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateInvoiceStatus(
  invoiceId: string,
  update: Partial<Invoice>
): Promise<void> {
  const docRef = doc(db(), COLLECTIONS.INVOICES, invoiceId);
  await updateDoc(docRef, { ...update, updatedAt: serverTimestamp() });
}

// ═══════════════════════════════════════════════════════════════
// TACTICAL FEED (Real-time)
// ═══════════════════════════════════════════════════════════════

/** Add a new decision to the tactical feed */
export async function addTacticalFeedItem(
  decision: PocketCFODecision,
  parentInvoiceId: string
): Promise<string> {
  const docRef = await addDoc(collection(db(), COLLECTIONS.TACTICAL_FEED), {
    ...decision,
    parentId: parentInvoiceId,
    timestamp: serverTimestamp(),
    status: "UNREAD",
  });
  return docRef.id;
}

/** Subscribe to real-time tactical feed updates */
export function subscribeTacticalFeed(
  onUpdate: (items: TacticalFeedItem[]) => void,
  maxItems: number = 50
): Unsubscribe {
  const q = query(
    collection(db(), COLLECTIONS.TACTICAL_FEED),
    orderBy("timestamp", "desc"),
    limit(maxItems)
  );

  return onSnapshot(q, (snapshot) => {
    const items: TacticalFeedItem[] = snapshot.docs.map((doc) => {
      const data = doc.data() as DocumentData;
      return {
        id: doc.id,
        parentId: data.parentId || "",
        timestamp:
          data.timestamp?.toDate?.()?.toISOString?.() ||
          new Date().toISOString(),
        status: data.status || "UNREAD",
        extracted_data: data.extracted_data || {},
        decision_logic: data.decision_logic || {},
        ui_component: data.ui_component || {},
      } as TacticalFeedItem;
    });
    onUpdate(items);
  });
}

/** Update tactical feed item status (confirm/dismiss) */
export async function updateFeedItemStatus(
  itemId: string,
  status: "CONFIRMED" | "DISMISSED" | "READ"
): Promise<void> {
  const docRef = doc(db(), COLLECTIONS.TACTICAL_FEED, itemId);
  await updateDoc(docRef, { status, updatedAt: serverTimestamp() });
}

// ═══════════════════════════════════════════════════════════════
// FINANCIAL HEALTH
// ═══════════════════════════════════════════════════════════════

export async function getFinancialHealth(
  userId: string
): Promise<FinancialHealth | null> {
  const docRef = doc(db(), COLLECTIONS.HEALTH, userId);
  const snap = await getDoc(docRef);
  return snap.exists() ? (snap.data() as FinancialHealth) : null;
}

export async function updateFinancialHealth(
  userId: string,
  health: Partial<FinancialHealth>
): Promise<void> {
  const docRef = doc(db(), COLLECTIONS.HEALTH, userId);
  await setDoc(docRef, { ...health, updatedAt: serverTimestamp() }, { merge: true });
}

// ═══════════════════════════════════════════════════════════════
// SEED DEMO DATA (for hackathon demo)
// ═══════════════════════════════════════════════════════════════

export async function seedDemoData(): Promise<void> {
  const { DEMO_COMPANY, DEMO_HEALTH, DEMO_FEED } = await import("./mock-data");

  // Seed company profile
  await setCompanyProfile("demo-user", DEMO_COMPANY);

  // Seed financial health
  await updateFinancialHealth("demo-user", DEMO_HEALTH);

  // Seed tactical feed items
  for (const item of DEMO_FEED) {
    const { id, ...rest } = item;
    await addDoc(collection(db(), COLLECTIONS.TACTICAL_FEED), {
      ...rest,
      timestamp: serverTimestamp(),
    });
  }

  console.log("[PocketCFO] Demo data seeded to Firestore ✓");
}
