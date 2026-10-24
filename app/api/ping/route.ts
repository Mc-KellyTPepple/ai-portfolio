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
export async function GET(request: Request) {
  const target = TARGETS[new URL(request.url).searchParams.get("t") ?? ""];
  if (!target) return NextResponse.json({ error: "unknown service" }, { status: 404 });

  const headers = { "Cache-Control": "no-store" };
  try {
    const res = await fetch(target, { cache: "no-store", signal: AbortSignal.timeout(8000) });
    await res.body?.cancel();
    return NextResponse.json({ up: res.ok }, { headers });
  } catch {
    return NextResponse.json({ up: false }, { headers });
  }
}
