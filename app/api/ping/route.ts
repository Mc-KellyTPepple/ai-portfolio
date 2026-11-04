import { NextResponse } from "next/server";

// Only these services can be checked. Never accept a URL from the browser.
const TARGETS: Record<string, string> = {
  plant: "https://plant-disease-diagnosis-alvy.onrender.com/",
  animal: "https://my-first-ai-image-classifier.onrender.com/",
  rag: "https://rag-api-c6b1.onrender.com/health",
};

export const dynamic = "force-dynamic";

/**
 * Wakes a sleeping Render service and reports whether it is up yet.
 * The request is made from the server, so no CORS is involved and the real HTTP status is visible.
 * It gives up after 8 seconds (the service keeps waking up); the page simply asks again.
 */
const lastCall = new Map<string, number>();
const MIN_GAP_MS = 2000; // a visitor's page asks every ~2.5 s while waking; anything faster is not a normal visitor

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("t") ?? "";
  const target = TARGETS[id];
  if (!target) return NextResponse.json({ error: "unknown service" }, { status: 404 });

  const now = Date.now();
  if (now - (lastCall.get(id) ?? 0) < MIN_GAP_MS) return NextResponse.json({ up: false, throttled: true }, { headers: { "Cache-Control": "no-store" } });
  lastCall.set(id, now);

  const headers = { "Cache-Control": "no-store" };
  try {
    const res = await fetch(target, { cache: "no-store", signal: AbortSignal.timeout(8000) });
    await res.body?.cancel();
    return NextResponse.json({ up: res.ok }, { headers });
  } catch {
    return NextResponse.json({ up: false }, { headers });
  }
}
