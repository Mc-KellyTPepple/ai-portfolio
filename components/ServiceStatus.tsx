"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  /** Base URL of the Render service, without a trailing slash. */
  apiUrl: string;
};

type Phase = "checking" | "online" | "offline";

const ATTEMPT_TIMEOUT_MS = 15_000;
const TOTAL_BUDGET_MS = 120_000;
const RETRY_GAP_MS = 2_500;
const SLOW_AFTER_SECONDS = 4;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * "verified"  - CORS read succeeded and the API answered { status: "ok" }.
 * "reachable" - the server answered, but the browser could not read the body
 *               (CORS not enabled on the API yet), so we only know it is up.
 * "down"      - no usable answer within this attempt.
 */
async function ping(
  apiUrl: string,
  signal: AbortSignal,
): Promise<"verified" | "reachable" | "down"> {
  const url = `${apiUrl}/health`;
  try {
    const res = await fetch(url, { cache: "no-store", signal });
    if (!res.ok) return "down";
    const body: unknown = await res.json().catch(() => null);
    const status =
      typeof body === "object" && body !== null
        ? (body as { status?: unknown }).status
        : undefined;
    return status === "ok" ? "verified" : "down";
  } catch {
    if (signal.aborted) return "down";
    try {
      await fetch(url, { mode: "no-cors", cache: "no-store", signal });
      return "reachable";
    } catch {
      return "down";
    }
  }
}

export default function ServiceStatus({ apiUrl }: Props) {
  const [phase, setPhase] = useState<Phase>("checking");
  const [elapsed, setElapsed] = useState(0);
  const [verified, setVerified] = useState(false);
  const runId = useRef(0);

  const run = useCallback(async () => {
    const id = ++runId.current;
    const startedAt = Date.now();

    while (runId.current === id && Date.now() - startedAt < TOTAL_BUDGET_MS) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), ATTEMPT_TIMEOUT_MS);
      const result = await ping(apiUrl, controller.signal);
      clearTimeout(timer);
      if (runId.current !== id) return;

      if (result !== "down") {
        setVerified(result === "verified");
        setElapsed(Math.round((Date.now() - startedAt) / 1000));
        setPhase("online");
        return;
      }
      await sleep(RETRY_GAP_MS);
    }
    if (runId.current === id) setPhase("offline");
  }, [apiUrl]);

  const retry = () => {
    setPhase("checking");
    setElapsed(0);
    void run();
  };

  // Visiting the page wakes the free-tier server in the background, so it is
  // usually warm by the time the visitor has read the page.
  useEffect(() => {
    const start = setTimeout(() => void run(), 0);
    return () => {
      clearTimeout(start);
      runId.current += 1;
    };
  }, [run]);

  useEffect(() => {
    if (phase !== "checking") return;
    const tick = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(tick);
  }, [phase]);

  const waking = phase === "checking" && elapsed >= SLOW_AFTER_SECONDS;
  const state = waking ? "waking" : phase;

  const title = {
    checking: "Contacting the server…",
    waking: "Waking the server up…",
    online: "Server is online",
    offline: "Server didn't respond",
  }[state];

  const detail = {
    checking: "Sending a quick health check.",
    waking:
      "The backend runs on a free hosting plan that sleeps when idle. A cold start usually takes 30 to 60 seconds. This page stays available the whole time.",
    online: verified
      ? "Health check passed. The API is ready for testing."
      : "The API answered. It is ready for testing.",
    offline:
      "It did not wake within two minutes. This can happen on free hosting. Try again, or get in touch and I will look at it.",
  }[state];

  return (
    <div className="htStatus" data-state={state} role="status" aria-live="polite">
      <div className="htStatusTop">
        <span className="htStatusDot" aria-hidden="true" />
        <div>
          <p className="htStatusTitle">{title}</p>
          <p className="htStatusLabel">Reminder API &middot; Render</p>
        </div>
        {phase === "checking" && (
          <span className="htStatusTimer" aria-hidden="true">
            {elapsed}s
          </span>
        )}
      </div>

      {phase === "checking" && <div className="htStatusBar" aria-hidden="true" />}

      <p className="htStatusDetail">{detail}</p>

      {phase !== "checking" && (
        <button type="button" className="htStatusBtn" onClick={retry}>
          Check again
        </button>
      )}
    </div>
  );
}
