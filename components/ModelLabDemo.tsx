"use client";

import { useEffect, useRef, useState } from "react";
import ServiceStatus from "@/components/ServiceStatus";
import ModelLabWait from "@/components/ModelLabWait";
import { MODEL_LAB_API_URL, MODEL_LAB_DRIFT_SAMPLE, MODEL_LAB_SAMPLES, STAGE_LABELS } from "@/data/modelLab";

type Cv = { mean: number; se: number; lo: number; hi: number; folds: number[] };
type ModelRow = { id: string; name: string; rank: number; cv?: Cv; train_mean?: number; gap?: number; secs?: number; skipped?: boolean; note?: string; winner?: boolean };
type FormField = { name: string; kind: "numeric" | "categorical"; min?: number; max?: number; median?: number; levels?: string[] };
type Result = {
  task: "classification" | "regression";
  target: string;
  classes: string[] | null;
  primary: { name: string; label: string };
  rows: { total: number; used: number; train: number; test: number };
  folds: number;
  features: { name: string; kind: string }[];
  excluded: { name: string; reason: string }[];
  leaks: { column: string; score: number; note: string }[];
  contrast: { model: string; cv_with_leak: number; cv_without_leak: number; columns: string[] } | null;
  models: ModelRow[];
  winner: { id: string; name: string; reason: string };
  verdict: { beats_baseline: boolean; diff: { mean: number; lo: number; hi: number }; min_gain: number };
  test: { n: number; primary: { value: number; lo: number; hi: number }; baseline: number; metrics: Record<string, number>; baseline_metrics: Record<string, number>; typical_error: number | null; error_q90: number | null };
  importance: { column: string; drop: number }[];
  warnings: { level: string; text: string }[];
  form: FormField[];
  summary: string[];
  seconds: number;
  session: string;
  confusion?: { classes: string[]; matrix: number[][] };
  scatter?: [number, number][];
};
type ProfileCol = { name: string; kind: string; missing_pct: number; unique: number; examples: string[]; task: string | null };
type Profile = { rows: number; columns: ProfileCol[]; duplicates: number; warnings: { level: string; text: string }[]; suggested_target: string | null };
type Job = { status: "queued" | "running" | "done" | "error"; stage?: string; pct?: number; message?: string; position?: number; result?: Result; error?: string };
type Drift = {
  rows: number; verdict: "stable" | "moderate" | "large"; message: string;
  columns: { column: string; psi: number; level: string; missing_pct?: number; unseen_pct?: number }[];
  prediction_mix?: Record<string, number>; prediction_summary?: { mean: number; min: number; max: number };
  live_score?: { value: number; n: number; at_training: number; primary: string };
};
type Prediction = { prediction: string | number; candidates?: { label: string; probability: number }[]; typical_error?: number | null; notes: string[] };
type Source = { kind: "sample"; id: string } | { kind: "file"; name: string; text: string };

const KIND_LABEL: Record<string, string> = { numeric: "number", categorical: "category", id: "ID (not used)", text: "free text (not used)", constant: "same everywhere (not used)", empty: "empty (not used)", highcard: "too many values (not used)" };

const fmt = (primary: string, v: number) => (primary === "r2" ? v.toFixed(2) : `${(v * 100).toFixed(1)}%`);
const pts = (primary: string, v: number) => (primary === "r2" ? v.toFixed(2) : `${(v * 100).toFixed(1)} points`);
const num = (v: number) => (Math.abs(v) >= 100 ? v.toFixed(0) : Math.abs(v) >= 1 ? v.toFixed(2) : v.toPrecision(2));

async function api<T>(path: string, init?: RequestInit): Promise<{ ok: boolean; status: number; data: T & { error?: string } }> {
  const res = await fetch(`${MODEL_LAB_API_URL}${path}`, { cache: "no-store", ...init });
  const data = await res.json().catch(() => ({ error: "The server sent something unexpected." }));
  return { ok: res.ok, status: res.status, data };
}

const body = (s: Source) => (s.kind === "sample" ? { body: JSON.stringify({ sample: s.id }), headers: { "Content-Type": "application/json" } } : { body: s.text, headers: { "Content-Type": "text/csv" } });

export default function ModelLabDemo() {
  const [ready, setReady] = useState(false);
  const [source, setSource] = useState<Source | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [target, setTarget] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [job, setJob] = useState<Job | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [tab, setTab] = useState<"results" | "predict" | "monitor">("results");
  const [sampleId, setSampleId] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const reset = () => {
    if (timer.current) clearTimeout(timer.current);
    setProfile(null); setResult(null); setJob(null); setError(""); setTab("results");
  };

  async function choose(src: Source, label?: string) {
    reset();
    setSource(src);
    setSampleId(src.kind === "sample" ? src.id : null);
    setBusy(true);
    try {
      const r = await api<Profile>("/profile", { method: "POST", ...body(src) });
      if (!r.ok) throw new Error(r.data.error || "Could not read that file.");
      setProfile(r.data);
      const sample = MODEL_LAB_SAMPLES.find((s) => s.id === (src.kind === "sample" ? src.id : ""));
      setTarget(sample?.target ?? r.data.suggested_target ?? "");
    } catch (e) {
      setError(e instanceof Error ? e.message : `Could not load ${label ?? "the data"}.`);
      setSource(null);
    } finally {
      setBusy(false);
    }
  }

  function onFile(file: File | undefined) {
    if (!file) return;
    if (file.size > 1_000_000) return setError("That file is over 1 MB. Try a smaller file or a sample of its rows.");
    const reader = new FileReader();
    reader.onload = () => void choose({ kind: "file", name: file.name, text: String(reader.result ?? "") });
    reader.onerror = () => setError("Could not read that file.");
    reader.readAsText(file);
  }

  async function train(leaks?: "keep") {
    if (!source || !target) return;
    setError(""); setResult(null); setBusy(true); setTab("results");
    setJob({ status: "queued", stage: "queued", pct: 0, message: STAGE_LABELS.queued });
    try {
      const q = `?target=${encodeURIComponent(target)}${leaks ? "&leaks=keep" : ""}`;
      const r = await api<{ job: string }>(`/train${q}`, { method: "POST", ...body(source) });
      if (!r.ok) throw new Error(r.data.error || "Could not start training.");
      poll(r.data.job);
    } catch (e) {
      setBusy(false); setJob(null);
      setError(e instanceof Error ? e.message : "Could not start training.");
    }
  }

  function poll(id: string, misses = 0) {
    timer.current = setTimeout(async () => {
      if (!alive.current) return;
      try {
        const r = await api<Job>(`/jobs/${id}`);
        if (!alive.current) return;
        if (!r.ok) throw new Error(r.data.error || "Lost track of this run.");
        setJob(r.data);
        if (r.data.status === "done" && r.data.result) { setResult(r.data.result); setBusy(false); return; }
        if (r.data.status === "error") { setError(r.data.error || "Training failed."); setBusy(false); setJob(null); return; }
        poll(id, 0);
      } catch (e) {
        if (misses >= 4) { setBusy(false); setJob(null); setError(e instanceof Error ? e.message : "Lost the connection."); return; }
        poll(id, misses + 1);
      }
    }, 1000);
  }

  const taskNote = profile && target ? profile.columns.find((c) => c.name === target)?.task : null;
  const targets = profile?.columns.filter((c) => c.task) ?? [];

  return (
    <div className="mlDemo">
      <ServiceStatus apiUrl={MODEL_LAB_API_URL} label="Model Lab · Render" onOnline={() => setReady(true)} readyText="The server is awake. Pick a dataset or upload your own." />
      {!ready && !busy && <ModelLabWait />}

      {ready && (
        <div className="toolkitCard">
          <p className="eaLabel">1 · Choose data</p>
          <ul className="mlSamples">
            {MODEL_LAB_SAMPLES.map((s) => (
              <li key={s.id}>
                <button type="button" className="vtMode mlSample" data-on={source?.kind === "sample" && source.id === s.id} disabled={busy} onClick={() => void choose({ kind: "sample", id: s.id })}>
                  <b>{s.title}</b>
                  <span>{s.blurb}</span>
                  <i data-kind={s.kind}>{s.kind === "real" ? "real public data" : "synthetic, made up for this demo"}</i>
                </button>
              </li>
            ))}
          </ul>
          <label className="btn btnGhost mlUpload" aria-disabled={busy}>
            Or upload a CSV (up to 1 MB)
            <input type="file" accept=".csv,text/csv,text/plain" hidden disabled={busy} onChange={(e) => { onFile(e.target.files?.[0]); e.target.value = ""; }} />
          </label>
          <p className="eaMeta">Your file is read in memory, never stored or logged, and the model is forgotten after an hour. Please do not upload personal or confidential data.</p>
        </div>
      )}

      {error && <p className="mlError" role="alert">{error}</p>}

      {ready && profile && source && (
        <div className="toolkitCard">
          <p className="eaLabel">2 · What should it predict?</p>
          <div className="mlTarget">
            <label>
              <span>Column to predict</span>
              <select value={target} onChange={(e) => setTarget(e.target.value)} disabled={busy}>
                {targets.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
            </label>
            <p className="eaMeta">{source.kind === "file" ? `${source.name}: ` : ""}{profile.rows.toLocaleString()} rows, {profile.columns.length} columns.{taskNote ? ` This is a ${taskNote === "classification" ? "category" : "number"} prediction.` : ""}</p>
          </div>
          {profile.warnings.length > 0 && <ul className="eaLimits">{profile.warnings.map((w) => <li key={w.text}>{w.text}</li>)}</ul>}
          <div className="mlCols" role="table" aria-label="Columns found">
            {profile.columns.slice(0, 40).map((c) => (
              <div key={c.name} className="mlCol" role="row" data-target={c.name === target}>
                <b role="cell">{c.name}</b>
                <span role="cell">{KIND_LABEL[c.kind] ?? c.kind}</span>
                <span role="cell">{c.missing_pct ? `${c.missing_pct}% empty` : ""}</span>
                <span role="cell" className="mlEx">{c.examples.slice(0, 3).join(", ")}</span>
              </div>
            ))}
          </div>
          <button type="button" className="btn btnPrimary" disabled={busy || !target} onClick={() => void train()}>
            {busy ? "Working…" : "Train and test models"}
          </button>
        </div>
      )}

      {job && !result && <Progress job={job} />}

      {result && (
        <>
          <div className="vtModes" role="tablist" aria-label="Results sections">
            {(["results", "predict", "monitor"] as const).map((t) => (
              <button key={t} type="button" role="tab" aria-selected={tab === t} className="btn btnGhost vtMode" data-on={tab === t} onClick={() => setTab(t)}>
                {t === "results" ? "Results" : t === "predict" ? "Try the model" : "Monitor new data"}
              </button>
            ))}
          </div>
          {tab === "results" && <Results r={result} onKeepLeak={() => void train("keep")} />}
          {tab === "predict" && <Predict r={result} />}
          {tab === "monitor" && <Monitor r={result} canUseSample={sampleId === "churn" || sampleId === "churn_leaky"} />}
        </>
      )}
    </div>
  );
}

function Progress({ job }: { job: Job }) {
  const pct = job.pct ?? 0;
  return (
    <div className="toolkitCard" role="status" aria-live="polite">
      <p className="eaLabel">3 · Training</p>
      <p className="mlStage">{job.status === "queued" ? (job.position && job.position > 1 ? `In line: ${job.position - 1} ahead of you` : "Waiting for a turn") : job.message || STAGE_LABELS[job.stage ?? ""] || "Working"}</p>
      <div className="eaBar" aria-hidden="true"><div className="eaBarFill" style={{ width: `${Math.max(3, pct)}%` }} /></div>
      <p className="eaMeta">A small server does the training, so larger files take a minute or two. Nothing is skipped: 20% of the rows are set aside first, and every model is scored the same way.</p>
    </div>
  );
}

function Bar({ value, lo, hi, tone, domain }: { value: number; lo?: number; hi?: number; tone?: "alt" | "dim"; domain: [number, number] }) {
  const span = domain[1] - domain[0] || 1;
  const at = (v: number) => Math.min(100, Math.max(0, ((v - domain[0]) / span) * 100));
  return (
    <div className="abTrack" aria-hidden="true">
      <div className="abBar" data-tone={tone} style={{ width: `${at(value)}%` }} />
      {lo !== undefined && hi !== undefined && <div className="abCi" style={{ left: `${at(lo)}%`, width: `${Math.max(0, at(hi) - at(lo))}%` }} />}
    </div>
  );
}

function Results({ r, onKeepLeak }: { r: Result; onKeepLeak: () => void }) {
  const p = r.primary.name;
  const ok = r.models.filter((m) => m.cv);
  const lows = ok.map((m) => m.cv!.lo);
  const domain: [number, number] = [Math.min(0, ...lows), 1];
  const t = r.test.primary;
  const maxImp = Math.max(...r.importance.map((i) => i.drop), 0.0001);
  return (
    <div className="mlResults">
      <div className="toolkitCard mlVerdict" data-ok={r.verdict.beats_baseline}>
        <p className="eaLabel">Result</p>
        <h3>{r.verdict.beats_baseline ? "Clearly better than guessing" : "Not clearly better than guessing"}</h3>
        {r.summary.map((s) => <p key={s} className="htCardText">{s}</p>)}
        <p className="eaMeta">Trained on {r.rows.train.toLocaleString()} rows, tested on {r.rows.test.toLocaleString()} it had not seen. {r.seconds}s on a small server.</p>
      </div>

      {r.warnings.length > 0 && (
        <div className="toolkitCard">
          <p className="eaLabel">Things to know</p>
          <ul className="eaLimits">{r.warnings.map((w) => <li key={w.text} data-level={w.level}>{w.text}</li>)}</ul>
        </div>
      )}

      {r.leaks.length > 0 && (
        <div className="toolkitCard mlLeak">
          <p className="eaLabel">Suspected leak caught</p>
          {r.leaks.map((l) => (
            <p key={l.column} className="htCardText"><b>{l.column}</b>: on its own it predicts {fmt(p, l.score)}. {l.note}</p>
          ))}
          {r.contrast && (
            <div className="abStats">
              <div className="abStat"><b>{fmt(p, r.contrast.cv_with_leak)}</b><span>Score if left in (looks great, would fail in real use)</span></div>
              <div className="abStat"><b>{fmt(p, r.contrast.cv_without_leak)}</b><span>Honest score with it removed</span></div>
            </div>
          )}
          <button type="button" className="btn btnGhost" onClick={onKeepLeak}>Run again with the leak left in</button>
        </div>
      )}

      <div className="toolkitCard">
        <p className="eaLabel">Models compared ({r.folds}-fold cross-validation on the training rows)</p>
        <div role="list" aria-label="Cross-validated score by model">
          {r.models.map((m) => (
            <div key={m.id} className="abRow mlModel" role="listitem" data-winner={m.winner} style={{ gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 2fr) auto" }}>
              <span>{m.name}{m.winner && <em className="mlPick">chosen</em>}</span>
              {m.cv ? <Bar value={m.cv.mean} lo={m.cv.lo} hi={m.cv.hi} tone={m.id === "baseline" ? "dim" : m.winner ? undefined : "alt"} domain={domain} /> : <span className="eaMeta">{m.note}</span>}
              <span>{m.cv ? fmt(p, m.cv.mean) : "skipped"}<span className="srOnly">, interval {m.cv ? `${fmt(p, m.cv.lo)} to ${fmt(p, m.cv.hi)}` : ""}</span></span>
            </div>
          ))}
        </div>
        <p className="eaMeta">Score: {r.primary.label}. The thin line is the 95% interval across folds. {r.winner.reason} Versus the baseline, the chosen model is ahead by {pts(p, r.verdict.diff.mean)} (95% interval {pts(p, r.verdict.diff.lo)} to {pts(p, r.verdict.diff.hi)}); it must be clearly above zero and by at least {pts(p, r.verdict.min_gain)} to count as better.</p>
        <details className="mlDetails">
          <summary>Does any model memorise the training rows?</summary>
          <ul className="eaLimits">
            {ok.map((m) => <li key={m.id}>{m.name}: {fmt(p, m.train_mean ?? 0)} on rows it trained on, {fmt(p, m.cv!.mean)} on rows it had not seen (gap {pts(p, m.gap ?? 0)}).</li>)}
          </ul>
        </details>
      </div>

      <div className="toolkitCard">
        <p className="eaLabel">The test rows, scored once</p>
        <div className="abStats">
          <div className="abStat"><b>{fmt(p, t.value)}</b><span>{r.primary.label} of {r.winner.name} (95% interval {fmt(p, t.lo)} to {fmt(p, t.hi)})</span></div>
          <div className="abStat"><b>{fmt(p, r.test.baseline)}</b><span>Baseline on the same rows</span></div>
          {Object.entries(r.test.metrics).filter(([k]) => k !== p).map(([k, v]) => (
            <div key={k} className="abStat"><b>{k === "mae" || k === "rmse" ? num(v) : k === "r2" ? v.toFixed(2) : k === "auc" ? v.toFixed(2) : `${(v * 100).toFixed(1)}%`}</b><span>{({ accuracy: "Accuracy", balanced_accuracy: "Balanced accuracy", macro_f1: "Macro F1", auc: "AUC", r2: "R²", mae: "Mean absolute error", rmse: "Root mean squared error" } as Record<string, string>)[k] ?? k}</span></div>
          ))}
        </div>
        <p className="eaMeta">These {r.test.n} rows were not used to train or to choose. The interval comes from resampling them 1,000 times.</p>
      </div>

      <div className="toolkitCard">
        <p className="eaLabel">Which columns mattered</p>
        {r.importance.length === 0 || r.importance[0].drop <= 0 ? (
          <p className="htCardText">No single column moved the score when shuffled, so none stands out.</p>
        ) : (
          <div role="list" aria-label="Permutation importance">
            {r.importance.filter((i) => i.drop > 0).map((i) => (
              <div key={i.column} className="abRow" role="listitem" style={{ gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 2fr) auto" }}>
                <span>{i.column}</span>
                <Bar value={i.drop} domain={[0, maxImp]} />
                <span>−{p === "r2" ? i.drop.toFixed(2) : `${(i.drop * 100).toFixed(1)} pts`}</span>
              </div>
            ))}
          </div>
        )}
        <p className="eaMeta">Each column is shuffled in the test rows and the drop in score is measured. Importance says what the model uses, not what causes the outcome.</p>
      </div>

      {r.confusion && <Confusion c={r.confusion} />}
      {r.scatter && <Scatter pts={r.scatter} typical={r.test.typical_error} />}

      {r.excluded.length > 0 && (
        <div className="toolkitCard">
          <p className="eaLabel">Columns left out</p>
          <ul className="eaLimits">{r.excluded.map((e) => <li key={e.name}><b>{e.name}</b>: {e.reason}</li>)}</ul>
        </div>
      )}
    </div>
  );
}

function Confusion({ c }: { c: { classes: string[]; matrix: number[][] } }) {
  const max = Math.max(...c.matrix.flat(), 1);
  return (
    <div className="toolkitCard">
      <p className="eaLabel">Right and wrong, on the test rows</p>
      <div className="mlConf" style={{ gridTemplateColumns: `minmax(4rem, auto) repeat(${c.classes.length}, minmax(2.4rem, 1fr))` }} role="table" aria-label="Confusion matrix">
        <span />
        {c.classes.map((k) => <b key={k} className="mlConfHead">said {k}</b>)}
        {c.matrix.map((row, i) => (
          <div key={c.classes[i]} className="mlConfRow" role="row" style={{ display: "contents" }}>
            <b className="mlConfHead">was {c.classes[i]}</b>
            {row.map((v, j) => (
              <span key={j} role="cell" className="mlConfCell" data-diag={i === j} style={{ ["--a" as string]: v / max }}>{v}</span>
            ))}
          </div>
        ))}
      </div>
      <p className="eaMeta">Rows are what the answer really was; columns are what the model said. The diagonal is correct.</p>
    </div>
  );
}

function Scatter({ pts, typical }: { pts: [number, number][]; typical: number | null }) {
  const all = pts.flat();
  const lo = Math.min(...all), hi = Math.max(...all);
  const sx = (v: number) => 30 + ((v - lo) / (hi - lo || 1)) * 260;
  const sy = (v: number) => 270 - ((v - lo) / (hi - lo || 1)) * 250;
  return (
    <div className="toolkitCard">
      <p className="eaLabel">Predicted against actual, on the test rows</p>
      <svg viewBox="0 0 310 290" className="mlScatter" role="img" aria-label="Predicted values against actual values. Points near the diagonal are accurate.">
        <path d={`M${sx(lo)} ${sy(lo)} L${sx(hi)} ${sy(hi)}`} stroke="currentColor" strokeOpacity="0.35" strokeDasharray="4 4" />
        {pts.map(([a, b], i) => <circle key={i} cx={sx(a)} cy={sy(b)} r="3" fill="var(--brand)" fillOpacity="0.65" />)}
        <text x="160" y="288" textAnchor="middle" fontSize="11" fill="currentColor" fillOpacity="0.6">actual</text>
        <text x="8" y="150" fontSize="11" fill="currentColor" fillOpacity="0.6" transform="rotate(-90 8 150)" textAnchor="middle">predicted</text>
      </svg>
      <p className="eaMeta">Points on the dashed line are perfect predictions.{typical !== null ? ` The typical error is ${num(typical)}.` : ""}</p>
    </div>
  );
}

function Predict({ r }: { r: Result }) {
  const [vals, setVals] = useState<Record<string, string>>({});
  const [out, setOut] = useState<Prediction | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  async function go() {
    setBusy(true); setErr(""); setOut(null);
    try {
      const x = await api<Prediction>("/predict", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ session: r.session, values: vals }) });
      if (!x.ok) throw new Error(x.data.error || "Could not predict.");
      setOut(x.data);
    } catch (e) { setErr(e instanceof Error ? e.message : "Could not predict."); }
    finally { setBusy(false); }
  }
  return (
    <div className="toolkitCard">
      <p className="eaLabel">Try the model</p>
      <p className="htCardText">This form was generated from your columns. Leave a box empty and a typical value is assumed.</p>
      <div className="mlForm">
        {r.form.map((f) => (
          <label key={f.name}>
            <span>{f.name}</span>
            {f.kind === "categorical" ? (
              <select value={vals[f.name] ?? ""} onChange={(e) => setVals({ ...vals, [f.name]: e.target.value })}>
                <option value="">(typical)</option>
                {f.levels?.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            ) : (
              <input type="text" inputMode="decimal" placeholder={`${num(f.median ?? 0)} (${num(f.min ?? 0)} to ${num(f.max ?? 0)})`} value={vals[f.name] ?? ""} onChange={(e) => setVals({ ...vals, [f.name]: e.target.value })} />
            )}
          </label>
        ))}
      </div>
      <button type="button" className="btn btnPrimary" onClick={() => void go()} disabled={busy}>{busy ? "Predicting…" : `Predict ${r.target}`}</button>
      {err && <p className="mlError" role="alert">{err}</p>}
      {out && (
        <div className="mlOut" role="status">
          <p className="mlAnswer">{typeof out.prediction === "number" ? num(out.prediction) : out.prediction}</p>
          {out.typical_error != null && typeof out.prediction === "number" && <p className="eaMeta">On the test rows, 90% of predictions were within ±{num(out.typical_error)} of the real value.</p>}
          {out.candidates && (
            <div role="list" aria-label="Probabilities">
              {out.candidates.map((c) => (
                <div key={c.label} className="abRow" role="listitem" style={{ gridTemplateColumns: "minmax(0, 1fr) minmax(0, 2fr) auto" }}>
                  <span>{c.label}</span><Bar value={c.probability} domain={[0, 1]} /><span>{(c.probability * 100).toFixed(0)}%</span>
                </div>
              ))}
              <p className="eaMeta">These are the model&apos;s own scores. They are not guaranteed to be calibrated.</p>
            </div>
          )}
          {out.notes.length > 0 && <ul className="eaLimits">{out.notes.map((n) => <li key={n}>{n}</li>)}</ul>}
        </div>
      )}
    </div>
  );
}

function Monitor({ r, canUseSample }: { r: Result; canUseSample: boolean }) {
  const [drift, setDrift] = useState<Drift | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  async function run(init: { body: string; headers: Record<string, string> }) {
    setBusy(true); setErr(""); setDrift(null);
    try {
      const x = await api<Drift>(`/monitor?session=${encodeURIComponent(r.session)}`, { method: "POST", ...init });
      if (!x.ok) throw new Error(x.data.error || "Could not check that file.");
      setDrift(x.data);
    } catch (e) { setErr(e instanceof Error ? e.message : "Could not check that file."); }
    finally { setBusy(false); }
  }
  function onFile(f?: File) {
    if (!f) return;
    if (f.size > 1_000_000) return setErr("That file is over 1 MB.");
    const rd = new FileReader();
    rd.onload = () => void run({ body: String(rd.result ?? ""), headers: { "Content-Type": "text/csv" } });
    rd.readAsText(f);
  }
  const worst = Math.max(...(drift?.columns.map((c) => c.psi) ?? [0]), 0.3);
  return (
    <div className="toolkitCard">
      <p className="eaLabel">Monitor new data</p>
      <p className="htCardText">A model is only good for data that looks like what it learned from. Upload newer rows with the same columns and see whether they have drifted. If the file also has the answers, the real score is shown.</p>
      <div className="mlActions">
        {canUseSample && <button type="button" className="btn btnPrimary" disabled={busy} onClick={() => void run({ body: JSON.stringify({ sample: MODEL_LAB_DRIFT_SAMPLE.id }), headers: { "Content-Type": "application/json" } })}>{MODEL_LAB_DRIFT_SAMPLE.label}</button>}
        <label className="btn btnGhost" aria-disabled={busy}>Upload a CSV<input type="file" accept=".csv,text/csv,text/plain" hidden disabled={busy} onChange={(e) => { onFile(e.target.files?.[0]); e.target.value = ""; }} /></label>
      </div>
      {err && <p className="mlError" role="alert">{err}</p>}
      {drift && (
        <div className="mlOut" role="status">
          <p className="mlAnswer" data-level={drift.verdict}>{drift.verdict === "stable" ? "Looks the same" : drift.verdict === "moderate" ? "Shifted somewhat" : "Shifted a lot"}</p>
          <p className="htCardText">{drift.message}</p>
          {drift.live_score && (
            <div className="abStats">
              <div className="abStat"><b>{fmt(drift.live_score.primary, drift.live_score.value)}</b><span>Score on these {drift.live_score.n} rows</span></div>
              <div className="abStat"><b>{fmt(drift.live_score.primary, drift.live_score.at_training)}</b><span>Score on the original test rows</span></div>
            </div>
          )}
          <div role="list" aria-label="Drift by column">
            {drift.columns.slice(0, 10).map((c) => (
              <div key={c.column} className="abRow" role="listitem" style={{ gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 2fr) auto" }}>
                <span>{c.column}</span><Bar value={c.psi} domain={[0, worst]} tone={c.level === "stable" ? "dim" : undefined} /><span>{c.psi.toFixed(2)} {c.level}</span>
              </div>
            ))}
          </div>
          <p className="eaMeta">Population Stability Index per column, after subtracting the amount two samples of the same data would differ by chance: under 0.10 is stable, 0.10 to 0.25 is a moderate shift, above 0.25 is large.</p>
          {drift.prediction_mix && <p className="eaMeta">What the model now predicts: {Object.entries(drift.prediction_mix).map(([k, v]) => `${k} ${(v * 100).toFixed(0)}%`).join(", ")}.</p>}
        </div>
      )}
    </div>
  );
}
