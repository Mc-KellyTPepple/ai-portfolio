"use client";

import { useEffect, useState } from "react";
import EdgarShowcase from "@/components/EdgarShowcase";
import EdgarWait from "@/components/EdgarWait";
import ServiceStatus from "@/components/ServiceStatus";
import { EDGAR_API_URL, EDGAR_EXAMPLES } from "@/data/edgarAnalyst";

type Answer = {
  final_answer: string;
  answer: string;
  sources: string[];
  model: string;
  tool_calls: number;
  seconds: number;
};

const MAX_LEN = 500;

export default function EdgarDemo() {
  const [ready, setReady] = useState(false);
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Answer | null>(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (ready) return;
    const t = setInterval(() => setElapsed((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, [ready]);

  async function ask() {
    const q = question.trim();
    if (!q || busy) return;
    setBusy(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`${EDGAR_API_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const body = (await res.json().catch(() => null)) as
        | (Partial<Answer> & { error?: string })
        | null;
      if (!res.ok || !body) {
        setError(body?.error ?? "Something went wrong. Please try again.");
      } else {
        setResult({
          final_answer: body.final_answer ?? "",
          answer: body.answer ?? "",
          sources: body.sources ?? [],
          model: body.model ?? "",
          tool_calls: body.tool_calls ?? 0,
          seconds: body.seconds ?? 0,
        });
      }
    } catch {
      setError(
        "Could not reach the server. It may still be waking up; wait a few seconds and try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="demoWrap">
      <ServiceStatus
        apiUrl={EDGAR_API_URL}
        label="EDGAR Analyst API · Render"
        onOnline={() => setReady(true)}
        readyText="The server is awake. Ask a question below."
      />

      <EdgarShowcase elapsed={elapsed} ready={ready} />

      {!ready && !busy && <EdgarWait mode="wake" />}

      <div className="toolkitCard eaForm">
        <label htmlFor="ea-question" className="eaLabel">
          Your question
        </label>
        <textarea
          id="ea-question"
          className="eaInput"
          rows={3}
          maxLength={MAX_LEN}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about the 10-K filings of NVDA, AMD, INTC, MSFT, AAPL, GOOGL, AMZN, META, TSLA or ORCL"
        />
        <div className="eaExamples" aria-label="Example questions">
          {EDGAR_EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              className="eaChip"
              onClick={() => setQuestion(ex)}
            >
              {ex}
            </button>
          ))}
        </div>
        <div className="htTryActions">
          <button
            type="button"
            className="btn btnPrimary"
            onClick={() => void ask()}
            disabled={busy || !question.trim()}
          >
            {busy ? "Working…" : "Ask"}
          </button>
          <span className="eaCount">
            {question.length}/{MAX_LEN}
          </span>
        </div>
      </div>

      {busy && <EdgarWait mode="ask" />}

      {error && (
        <div className="toolkitCard eaError" role="alert">
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="toolkitCard eaResult" aria-live="polite">
          <p className="eyebrow">Answer</p>
          <p className="eaFinal">{result.final_answer || "No answer was returned."}</p>
          <details>
            <summary>Full reasoning and sources</summary>
            <pre className="eaPre">{result.answer}</pre>
          </details>
          <p className="eaMeta">
            {result.sources.length > 0 ? (
              <>Filings cited: {result.sources.join(", ")}. </>
            ) : (
              <>No filings cited. </>
            )}
            Model {result.model || "unknown"}, {result.tool_calls} tool calls, {result.seconds}s.
          </p>
        </div>
      )}

      <p className="cvNote">
        Free demo on a free model quota, so it can be slow or say it is busy. Each visitor gets 10
        questions an hour. Not investment advice.
      </p>
    </div>
  );
}
