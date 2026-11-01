"use client";

import { useState } from "react";
import AnalystWait from "@/components/AnalystWait";
import ServiceStatus from "@/components/ServiceStatus";
import { ANALYST_API_URL, DEMO_EXAMPLES, MAX_CSV_BYTES } from "@/data/analystAgent";

type Result = { columns: string[]; rows: unknown[][]; truncated: boolean; error?: string };
type Reply = {
  answer: string;
  clarify: string | null;
  sql: string | null;
  result: Result | null;
  queries: { sql: string; ok: boolean }[];
  model: string;
  seconds: number;
};
type Dataset = { id: string; label: string; columns?: string[] };

const MAX_LEN = 500;
const DEMO: Dataset = { id: "demo", label: "Demo shop (synthetic data)" };

function show(v: unknown): string {
  if (v === null || v === undefined) return "";
  return typeof v === "number" && !Number.isInteger(v) ? String(Math.round(v * 1000) / 1000) : String(v);
}

function summary(reply: Reply): string {
  const text = reply.answer.split("FINAL SQL:")[0].trim();
  if (text) return text;
  const r = reply.result;
  if (r && r.columns.length === 1 && r.rows.length === 1) return `${r.columns[0]}: ${show(r.rows[0][0])}`;
  if (r && r.rows.length > 0) return `${r.rows.length}${r.truncated ? "+" : ""} rows returned.`;
  return "No rows matched.";
}

function Bars({ result }: { result: Result }) {
  if (result.columns.length !== 2 || result.rows.length < 2 || result.rows.length > 20) return null;
  const values = result.rows.map((r) => (typeof r[1] === "number" ? r[1] : NaN));
  if (values.some((v) => Number.isNaN(v) || v < 0)) return null;
  const max = Math.max(...values) || 1;
  return (
    <div className="daBars" role="img" aria-label={`Bar chart of ${result.columns[1]} by ${result.columns[0]}`}>
      {result.rows.map((r, i) => (
        <div key={i} className="daBarRow">
          <span className="daBarLabel">{show(r[0])}</span>
          <span className="daBarTrack">
            <span className="daBarFill" style={{ width: `${Math.max(2, (values[i] / max) * 100)}%` }} />
          </span>
          <span className="daBarValue">{show(r[1])}</span>
        </div>
      ))}
    </div>
  );
}

export default function AnalystDemo() {
  const [ready, setReady] = useState(false);
  const [dataset, setDataset] = useState<Dataset>(DEMO);
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [reply, setReply] = useState<Reply | null>(null);

  async function post<T>(path: string, body: unknown): Promise<{ ok: boolean; data: T & { error?: string } }> {
    const res = await fetch(`${ANALYST_API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await res.json().catch(() => ({}))) as T & { error?: string };
    return { ok: res.ok, data };
  }

  async function ask() {
    const q = question.trim();
    if (!q || busy) return;
    setBusy(true);
    setError("");
    setReply(null);
    try {
      const { ok, data } = await post<Reply>("/ask", { question: q, dataset: dataset.id });
      if (!ok) setError(data.error ?? "Something went wrong. Please try again.");
      else setReply(data);
    } catch {
      setError("Could not reach the server. It may still be waking up; wait a few seconds and try again.");
    } finally {
      setBusy(false);
    }
  }

  async function onFile(file: File | undefined) {
    if (!file) return;
    setError("");
    if (file.size > MAX_CSV_BYTES) {
      setError(`That file is too large. The limit is ${Math.round(MAX_CSV_BYTES / 1000)} KB.`);
      return;
    }
    setUploading(true);
    try {
      const text = await file.text();
      const { ok, data } = await post<{ dataset: string; table: string; columns: string[]; rows: number }>("/upload", {
        name: file.name,
        csv: text,
      });
      if (!ok) setError(data.error ?? "Could not read that CSV.");
      else {
        setDataset({ id: data.dataset, label: `${file.name} (${data.rows} rows)`, columns: data.columns });
        setReply(null);
      }
    } catch {
      setError("Could not upload. The server may still be waking up; try again in a few seconds.");
    } finally {
      setUploading(false);
    }
  }

  const examples = dataset.id === "demo" ? DEMO_EXAMPLES : [];

  return (
    <div className="demoWrap">
      <ServiceStatus
        apiUrl={ANALYST_API_URL}
        label="Data Analyst API · Render"
        onOnline={() => setReady(true)}
        readyText="The server is awake. Ask a question below."
      />

      {!ready && !busy && <AnalystWait mode="wake" />}

      <div className="toolkitCard eaForm">
        <div className="daDataset">
          <p className="eaLabel">Data</p>
          <p className="daDatasetName">{dataset.label}</p>
          <div className="htTryActions">
            <label className="btn btnGhost daFile">
              {uploading ? "Uploading…" : "Upload a CSV"}
              <input
                type="file"
                accept=".csv,text/csv"
                disabled={uploading}
                onChange={(e) => {
                  void onFile(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </label>
            {dataset.id !== "demo" && (
              <button type="button" className="btn btnGhost" onClick={() => setDataset(DEMO)}>
                Use the demo shop
              </button>
            )}
          </div>
          {dataset.columns && <p className="eaNote">Columns: {dataset.columns.join(", ")}</p>}
        </div>

        <label htmlFor="da-question" className="eaLabel">
          Your question
        </label>
        <textarea
          id="da-question"
          className="eaInput"
          rows={3}
          maxLength={MAX_LEN}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={dataset.id === "demo" ? "Ask about customers, products, orders and order items" : "Ask a question about your CSV"}
        />
        {examples.length > 0 && (
          <div className="eaExamples" aria-label="Example questions">
            {examples.map((ex) => (
              <button key={ex} type="button" className="eaChip" onClick={() => setQuestion(ex)}>
                {ex}
              </button>
            ))}
          </div>
        )}
        <div className="htTryActions">
          <button type="button" className="btn btnPrimary" onClick={() => void ask()} disabled={busy || !question.trim()}>
            {busy ? "Working…" : "Ask"}
          </button>
          <span className="eaCount">
            {question.length}/{MAX_LEN}
          </span>
        </div>
      </div>

      {busy && <AnalystWait mode="ask" />}

      {error && (
        <div className="toolkitCard eaError" role="alert">
          <p>{error}</p>
        </div>
      )}

      {reply && (
        <div className="toolkitCard eaResult" aria-live="polite">
          {reply.clarify ? (
            <>
              <p className="eyebrow">The agent has a question</p>
              <p className="eaFinal">{reply.clarify}</p>
              <p className="eaMeta">Add the detail to your question and ask again.</p>
            </>
          ) : (
            <>
              <p className="eyebrow">Answer</p>
              <p className="eaFinal">{summary(reply)}</p>
              {reply.result && reply.result.columns.length > 0 && (
                <>
                  <Bars result={reply.result} />
                  <div className="eaTableWrap">
                    <table className="eaTable">
                      <thead>
                        <tr>
                          {reply.result.columns.map((c) => (
                            <th key={c} scope="col">
                              {c}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {reply.result.rows.slice(0, 25).map((r, i) => (
                          <tr key={i}>
                            {r.map((v, j) => (
                              <td key={j}>{show(v)}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {(reply.result.rows.length > 25 || reply.result.truncated) && (
                    <p className="eaMeta">Showing the first 25 rows.</p>
                  )}
                </>
              )}
              {reply.result?.error && <p className="eaMeta">The final query failed: {reply.result.error}</p>}
              {reply.sql && (
                <details>
                  <summary>The SQL it ran</summary>
                  <pre className="eaPre">{reply.sql}</pre>
                </details>
              )}
              {reply.queries.length > 0 && (
                <details>
                  <summary>
                    Every query it tried ({reply.queries.length}, {reply.queries.filter((x) => !x.ok).length} failed)
                  </summary>
                  <ol className="daQueries">
                    {reply.queries.map((x, i) => (
                      <li key={i} data-ok={x.ok}>
                        <code>{x.sql}</code>
                        <span>{x.ok ? "ran" : "failed, retried"}</span>
                      </li>
                    ))}
                  </ol>
                </details>
              )}
            </>
          )}
          <p className="eaMeta">
            Model {reply.model || "unknown"}, {reply.seconds}s.
          </p>
        </div>
      )}

      <p className="cvNote">
        Free demo on a free model quota, so it can be slow or say it is busy. Each visitor gets 10 questions an hour. The demo
        shop is made-up data. Check important numbers against the SQL shown.
      </p>
    </div>
  );
}
