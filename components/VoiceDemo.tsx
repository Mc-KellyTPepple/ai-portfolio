"use client";

import { useEffect, useRef, useState } from "react";
import ServiceStatus from "@/components/ServiceStatus";
import VoiceWait from "@/components/VoiceWait";
import { resolveDue, resolveTime, tasksToIcs } from "@/lib/dueDate";
import { VOICE_API_URL, VOICE_MODES, VOICE_SAMPLE_NOTES, type VoiceMode } from "@/data/voiceToTasks";

type Task = { task: string; owner: string | null; due: string | null; quote: string; grounded: boolean; priority?: "high" | null; removed: string[] };
type Item = Task & { id: number; edited?: boolean };
type Note = { text: string; quote: string; grounded: boolean };
type Segment = { start: number; end: number; text: string; low: boolean };
type Mark = { start: number; end: number; kind: "quote" | "low" };
type Reply = {
  transcript: string;
  empty: boolean;
  note?: string;
  summary: string;
  mode?: VoiceMode;
  decisions?: Note[];
  questions?: Note[];
  tasks: Task[];
  segments?: Segment[];
  audio_seconds?: number;
  seconds: { transcribe: number; tasks: number; total: number };
};

const lowerFirst = (t: string) => t.charAt(0).toLowerCase() + t.slice(1);

/** Built only from tasks that were found in the transcript, so the spoken line cannot add anything you did not say. */
const clock = (t: { h: number; m: number }) => `${t.h % 12 || 12}${t.m ? `:${String(t.m).padStart(2, "0")}` : ""} ${t.h < 12 ? "AM" : "PM"}`;
const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

function confirmation(r: Reply): string {
  const ok = r.tasks.filter((t) => t.grounded);
  if (r.mode === "meeting") {
    const d = (r.decisions ?? []).filter((x) => x.grounded).length;
    const q = (r.questions ?? []).filter((x) => x.grounded).length;
    if (!d && !ok.length && !q) return "I did not hear any decisions, action items or open questions. " + (r.summary ? `What I understood: ${r.summary}` : "");
    return `Got it. I noted ${plural(d, "decision", "decisions")}, ${plural(ok.length, "action item", "action items")} and ${plural(q, "open question", "open questions")}.`;
  }
  if (!ok.length) return "I did not hear anything that needs doing. " + (r.summary ? `What I understood: ${r.summary}` : "");
  const parts = ok.map((t) => {
    const due = t.due && !t.task.toLowerCase().includes(t.due.toLowerCase()) ? ` ${t.due}` : "";
    const tm = resolveTime(t.due) ?? resolveTime(t.quote);
    const at = tm && !resolveTime(`${t.task} ${t.due ?? ""}`) ? ` at ${clock(tm)}` : "";
    return `${t.priority ? "urgent: " : ""}${t.owner ? `${t.owner} to ` : ""}${lowerFirst(t.task.replace(/[.!]+$/, ""))}${due}${at}`;
  });
  const list = parts.length === 1 ? parts[0] : parts.length === 2 ? `${parts[0]} and ${parts[1]}` : `${parts.slice(0, -1).join(", ")}, and ${parts[parts.length - 1]}`;
  return `Got it. You have ${ok.length === 1 ? "one task" : `${ok.length} tasks`}: ${list}.`;
}

const escRe = (w: string) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Where the speaker's quote sits in the transcript, ignoring case and punctuation differences. */
function findSpan(transcript: string, quote: string): [number, number] | null {
  const words = quote.toLowerCase().match(/[a-z0-9']+/g);
  if (!words?.length) return null;
  const m = new RegExp(words.map(escRe).join("[^a-z0-9']+"), "i").exec(transcript);
  return m ? [m.index, m.index + m[0].length] : null;
}

/** Character ranges of the transcript the model was unsure about, found by walking the segments in order. */
function lowRanges(transcript: string, segments: Segment[] = []): [number, number][] {
  const out: [number, number][] = [];
  let at = 0;
  for (const seg of segments) {
    const i = transcript.indexOf(seg.text, at);
    if (i < 0) continue;
    at = i + seg.text.length;
    if (seg.low) out.push([i, at]);
  }
  return out;
}

function renderTranscript(text: string, marks: Mark[]) {
  const cuts = new Set<number>([0, text.length]);
  marks.forEach((m) => { cuts.add(m.start); cuts.add(m.end); });
  const pts = [...cuts].sort((a, b) => a - b);
  return pts.slice(0, -1).map((a, k) => {
    const b = pts[k + 1];
    const kinds = marks.filter((m) => m.start <= a && m.end >= b).map((m) => m.kind);
    return (
      <span key={a} className={kinds.includes("quote") ? "vtMarkQuote" : kinds.includes("low") ? "vtMarkLow" : undefined}>
        {text.slice(a, b)}
      </span>
    );
  });
}

const MIME_CHOICES = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"];

function pickMime(): string {
  if (typeof MediaRecorder === "undefined") return "";
  return MIME_CHOICES.find((m) => MediaRecorder.isTypeSupported(m)) ?? "";
}

export default function VoiceDemo() {
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [level, setLevel] = useState(0);
  const [clip, setClip] = useState<Blob | null>(null);
  const [clipUrl, setClipUrl] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [reply, setReply] = useState<Reply | null>(null);
  const [done, setDone] = useState<Record<number, boolean>>({});
  const [items, setItems] = useState<Item[]>([]);
  const [mode, setMode] = useState<VoiceMode>("reminders");
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const nextId = useRef(1000);
  const [copied, setCopied] = useState(false);
  const [readAloud, setReadAloud] = useState(true);
  const [speaking, setSpeaking] = useState(false);

  const rec = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const raf = useRef<number | null>(null);
  const audioCtx = useRef<AudioContext | null>(null);
  const urlRef = useRef<string | null>(null);

  function speak(text: string) {
    if (typeof window === "undefined" || !("speechSynthesis" in window) || !text.trim()) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.onstart = () => setSpeaking(true);
    u.onend = u.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  }
  function stopSpeaking() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    setSpeaking(false);
  }

  function cleanupCapture() {
    if (timer.current) clearInterval(timer.current);
    if (raf.current) cancelAnimationFrame(raf.current);
    stream.current?.getTracks().forEach((t) => t.stop());
    void audioCtx.current?.close().catch(() => {});
    timer.current = raf.current = null;
    stream.current = null;
    audioCtx.current = null;
    setLevel(0);
  }

  useEffect(
    () => () => {
      cleanupCapture();
      if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    },
    [],
  );

  const cfg = VOICE_MODES.find((m) => m.id === mode)!;
  const maxSec = cfg.maxSeconds;

  async function start() {
    stopSpeaking();
    setError("");
    setReply(null);
    setDone({});
    if (typeof MediaRecorder === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setError("This browser cannot record audio. Use the text box below instead.");
      return;
    }
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      stream.current = s;
      const mime = pickMime();
      const r = new MediaRecorder(s, mime ? { mimeType: mime } : undefined);
      chunks.current = [];
      r.ondataavailable = (e) => e.data.size && chunks.current.push(e.data);
      r.onstop = () => {
        const blob = new Blob(chunks.current, { type: r.mimeType || mime || "audio/webm" });
        cleanupCapture();
        setRecording(false);
        if (urlRef.current) URL.revokeObjectURL(urlRef.current);
        urlRef.current = URL.createObjectURL(blob);
        setClip(blob);
        setClipUrl(urlRef.current);
      };
      r.start();
      rec.current = r;
      setClip(null);
      setClipUrl(null);
      setRecording(true);
      setElapsed(0);
      const began = Date.now();
      timer.current = setInterval(() => {
        const sec = Math.floor((Date.now() - began) / 1000);
        setElapsed(sec);
        if (sec >= maxSec) stop();
      }, 250);
      try {
        const ctx = new AudioContext();
        audioCtx.current = ctx;
        const an = ctx.createAnalyser();
        an.fftSize = 256;
        ctx.createMediaStreamSource(s).connect(an);
        const buf = new Uint8Array(an.frequencyBinCount);
        const loop = () => {
          an.getByteTimeDomainData(buf);
          let peak = 0;
          for (const v of buf) peak = Math.max(peak, Math.abs(v - 128));
          setLevel(Math.min(1, peak / 64));
          raf.current = requestAnimationFrame(loop);
        };
        loop();
      } catch {
        /* the level meter is optional */
      }
    } catch {
      cleanupCapture();
      setError("The microphone is blocked or missing. Allow access in your browser, or use the text box below.");
    }
  }

  function stop() {
    if (rec.current && rec.current.state !== "inactive") rec.current.stop();
  }

  async function call(path: string, init: RequestInit) {
    if (busy) return;
    setError("");
    setReply(null);
    setItems([]);
    setDone({});
    setBusy(true);
    try {
      const res = await fetch(`${VOICE_API_URL}${path}`, init);
      const body = (await res.json().catch(() => null)) as (Reply & { error?: string }) | null;
      if (!res.ok || !body) {
        setError(body?.error ?? "The server did not answer. Try again in a moment.");
        return;
      }
      setReply(body);
      setItems((body.tasks ?? []).map((t, i) => ({ ...t, id: i })));
      setActiveKey(null);
      if (readAloud && !body.empty) speak(confirmation(body));
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  const sendClip = () => clip && call(`/transcribe${mode === "meeting" ? "?mode=meeting" : ""}`, { method: "POST", headers: { "Content-Type": clip.type || "audio/webm" }, body: clip });
  const sendText = () => call("/tasks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text, mode }) });

  const notesText = () =>
    [
      reply?.decisions?.length ? `Decisions:\n${reply.decisions.map((d) => `- ${d.text}`).join("\n")}\n` : "",
      reply?.questions?.length ? `Open questions:\n${reply.questions.map((d) => `- ${d.text}`).join("\n")}\n` : "",
    ].join("\n");
  const listText = () =>
    items.map((t) => `- [${done[t.id] ? "x" : " "}] ${t.task}${t.owner ? ` (${t.owner})` : ""}${t.due ? ` — ${t.due}` : ""}${t.priority ? " [urgent]" : ""}`).join("\n");
  const placeable = items.filter((t) => resolveDue(t.due)).length;
  const quoteFor = (key: string | null) =>
    !key ? "" : key[0] === "t" ? items.find((x) => `t${x.id}` === key)?.quote ?? "" : (key[0] === "d" ? reply?.decisions : reply?.questions)?.[Number(key.slice(1))]?.quote ?? "";

  async function copy() {
    if (!reply) return;
    try {
      await navigator.clipboard.writeText(`${reply.summary}\n\n${notesText()}${mode === "meeting" ? "Action items:\n" : ""}${listText()}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setError("Copy is blocked in this browser. Select the list and copy it by hand.");
    }
  }
  function save(name: string, type: string, body: string) {
    const url = URL.createObjectURL(new Blob([body], { type }));
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const downloadTxt = () => reply && save("tasks.txt", "text/plain", `${reply.summary}\n\n${notesText()}${mode === "meeting" ? "Action items:\n" : ""}${listText()}\n\nTranscript:\n${reply.transcript}\n`);
  const downloadJson = () => reply && save("tasks.json", "application/json", JSON.stringify({ mode: reply.mode, summary: reply.summary, decisions: reply.decisions, questions: reply.questions, tasks: items.map(({ id, ...t }) => ({ ...t, done: !!done[id] })), transcript: reply.transcript }, null, 2));
  const downloadIcs = () => {
    const out = tasksToIcs(items, new Date(), { alarm: reply?.mode !== "meeting" });
    if (out) save("tasks.ics", "text/calendar", out.ics);
  };
  const edit = (id: number, patch: Partial<Item>) => setItems((xs) => xs.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  const addItem = () => {
    nextId.current += 1;
    setItems((xs) => [...xs, { id: nextId.current, task: "", owner: null, due: null, quote: "", grounded: false, removed: [], edited: true }]);
  };

  const disabled = busy || recording;

  return (
    <div className="demoWrap">
      <ServiceStatus
        apiUrl={VOICE_API_URL}
        label="Voice to Tasks API · Render"
        onOnline={() => setReady(true)}
        readyText="The server is awake. Press record and say what you need to do."
      />
      {!ready && !busy && <VoiceWait />}

      <div className="toolkitCard eaForm">
        <p className="eaLabel">What are you saying?</p>
        <div className="vtModes" role="radiogroup" aria-label="Mode">
          {VOICE_MODES.map((m) => (
            <button key={m.id} type="button" role="radio" aria-checked={mode === m.id} className="eaChip vtMode" data-on={mode === m.id ? "true" : undefined} disabled={busy || recording} onClick={() => { setMode(m.id); setReply(null); setItems([]); setClip(null); setClipUrl(null); }}>
              {m.label}
            </button>
          ))}
        </div>
        <p className="eaMeta" style={{ margin: "0 0 0.75rem" }}>
          {cfg.hint} Up to {maxSec} seconds, for example: “{cfg.example}”
        </p>
        <div className="vtRecorder">
          {!recording ? (
            <button type="button" className="btn btnPrimary" disabled={disabled} onClick={() => void start()}>
              {clip ? "Record again" : "Start recording"}
            </button>
          ) : (
            <button type="button" className="btn btnPrimary vtStop" onClick={stop}>
              Stop · {elapsed}s / {maxSec}s
            </button>
          )}
          <div className="vtMeter" aria-hidden="true">
            <div style={{ transform: `scaleX(${recording ? Math.max(0.04, level) : 0})` }} />
          </div>
        </div>
        {clipUrl && !recording && (
          <div className="vtClip">
            <audio controls src={clipUrl} aria-label="Your recording" />
            <button type="button" className="btn btnPrimary" disabled={busy} onClick={() => void sendClip()}>
              {busy ? "Working…" : "Turn into tasks"}
            </button>
          </div>
        )}

        <details className="vtText">
          <summary>No microphone? Type or paste a note instead</summary>
          <div className="eaExamples" aria-label="Example notes">
            {VOICE_SAMPLE_NOTES.filter((n) => n.mode === mode).map((n) => (
              <button key={n.label} type="button" className="eaChip" disabled={busy} onClick={() => setText(n.text)}>
                {n.label}
              </button>
            ))}
          </div>
          <label className="srOnly" htmlFor="vt-text">Note text</label>
          <textarea id="vt-text" className="eaInput" rows={4} maxLength={4000} value={text} onChange={(e) => setText(e.target.value)} placeholder="Type what you would say out loud…" />
          <div className="htTryActions">
            <button type="button" className="btn btnGhost" disabled={busy || text.trim().split(/\s+/).length < 4} onClick={() => void sendText()}>
              {busy ? "Working…" : "Make tasks from text"}
            </button>
          </div>
        </details>
      </div>

      {busy && <p className="eaMeta" role="status">Listening to your recording and writing the list. This takes a few seconds.</p>}

      {error && (
        <div className="toolkitCard eaError" role="alert">
          <p>{error}</p>
        </div>
      )}

      {reply && (
        <div className="toolkitCard vtResult">
          {reply.empty ? (
            <p>{reply.note ?? "No speech found."}</p>
          ) : (
            <>
              <p className="eaLabel">Confirmation</p>
              <p className="vtConfirm">{confirmation(reply)}</p>
              <div className="htTryActions">
                <button type="button" className="btn btnGhost" onClick={() => (speaking ? stopSpeaking() : speak(confirmation(reply)))}>
                  {speaking ? "Stop" : "Hear it again"}
                </button>
                <label className="vtToggle">
                  <input type="checkbox" checked={readAloud} onChange={(e) => { setReadAloud(e.target.checked); if (!e.target.checked) stopSpeaking(); }} />
                  Read it back automatically
                </label>
              </div>
              <p className="eaLabel">Summary</p>
              <p>{reply.summary || "No summary."}</p>
              {mode === "meeting" && (
                <>
                  {(["decisions", "questions"] as const).map((k) => {
                    const rows = reply[k] ?? [];
                    return (
                      <div key={k}>
                        <p className="eaLabel">{k === "decisions" ? "Decisions" : "Open questions"}</p>
                        {rows.length === 0 ? <p className="eaMeta">None heard.</p> : (
                          <ul className="vtNotes">
                            {rows.map((n, i) => {
                              const key = `${k === "decisions" ? "d" : "q"}${i}`;
                              return (
                                <li key={key} data-active={activeKey === key ? "true" : undefined}>
                                  <span>{n.text}</span>
                                  <span className="vtMeta">
                                    <span className="vtChip" data-ok={n.grounded ? "yes" : "no"}>{n.grounded ? "from your words" : "not found in transcript"}</span>
                                    {n.quote && <button type="button" className="vtLink" onClick={() => setActiveKey(activeKey === key ? null : key)}>{activeKey === key ? "Hide evidence" : "Show evidence"}</button>}
                                  </span>
                                  {n.quote && <span className="vtQuote">“{n.quote}”</span>}
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </>
              )}
              <p className="eaLabel">{mode === "meeting" ? "Action items" : "To-do list"}</p>
              <p className="eaMeta" style={{ margin: "0 0 0.5rem" }}>Edit, tick off, add or remove tasks. Choose "Show evidence" to see the words you said highlighted in the transcript.</p>
              {items.length === 0 && <p className="eaMeta">No tasks found. Nothing in the note asked for action.</p>}
              <ul className="vtTasks">
                {items.map((t) => {
                  const due = resolveDue(t.due);
                  return (
                    <li key={t.id} data-done={done[t.id] ? "true" : undefined} data-active={activeKey === `t${t.id}` ? "true" : undefined}>
                      <div className="vtRow">
                        <input type="checkbox" checked={!!done[t.id]} onChange={() => setDone((d) => ({ ...d, [t.id]: !d[t.id] }))} aria-label={`Done: ${t.task}`} />
                        <input className="vtEdit" value={t.task} maxLength={200} placeholder="Describe the task" aria-label="Task" onChange={(e) => edit(t.id, { task: e.target.value, edited: true })} />
                        <button type="button" className="vtX" aria-label={`Remove: ${t.task || "task"}`} onClick={() => setItems((xs) => xs.filter((x) => x.id !== t.id))}>×</button>
                      </div>
                      <span className="vtMeta">
                        {t.priority && <span className="vtChip" data-ok="no">urgent: you said so</span>}
                        {t.owner && <span className="vtChip">{t.owner}</span>}
                        {t.due && <span className="vtChip">{t.due}</span>}
                        {resolveTime(t.due) ?? resolveTime(t.quote) ? <span className="vtChip">{clock((resolveTime(t.due) ?? resolveTime(t.quote))!)}</span> : null}
                        {due && <span className="vtChip">{due.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })}</span>}
                        {t.edited ? (
                          <span className="vtChip">edited by you</span>
                        ) : (
                          <span className="vtChip" data-ok={t.grounded ? "yes" : "no"}>{t.grounded ? "from your words" : "not found in transcript"}</span>
                        )}
                        {t.quote && !t.edited && (
                          <button type="button" className="vtLink" onClick={() => setActiveKey(activeKey === `t${t.id}` ? null : `t${t.id}`)}>
                            {activeKey === `t${t.id}` ? "Hide evidence" : "Show evidence"}
                          </button>
                        )}
                      </span>
                      {t.quote && !t.edited && <span className="vtQuote">“{t.quote}”</span>}
                    </li>
                  );
                })}
              </ul>
              <div className="htTryActions">
                <button type="button" className="btn btnGhost" onClick={addItem}>Add a task</button>
                <button type="button" className="btn btnGhost" onClick={() => void copy()} disabled={!items.length}>{copied ? "Copied" : "Copy list"}</button>
                <button type="button" className="btn btnGhost" onClick={downloadTxt}>Download .txt</button>
                <button type="button" className="btn btnGhost" onClick={downloadJson}>Download JSON</button>
                <button type="button" className="btn btnGhost" onClick={downloadIcs} disabled={!placeable}>{reply.mode === "meeting" ? "Add to calendar (.ics)" : "Add to calendar with alarm (.ics)"}</button>
              </div>
              <p className="eaMeta">
                {placeable ? `${placeable} of ${items.length} tasks have a day I can place (such as "tomorrow" or "Friday"). The rest are left out of the calendar file instead of guessing.` : "No task has a day I can place yet, so the calendar file is off. I only use days you actually said."}
              </p>
              <details className="vtText" open>
                <summary>Transcript</summary>
                <p className="vtTranscript">
                  {renderTranscript(reply.transcript, [
                    ...lowRanges(reply.transcript, reply.segments).map(([start, end]) => ({ start, end, kind: "low" as const })),
                    ...(() => {
                      const q = quoteFor(activeKey);
                      const span = q ? findSpan(reply.transcript, q) : null;
                      return span ? [{ start: span[0], end: span[1], kind: "quote" as const }] : [];
                    })(),
                  ])}
                </p>
                <p className="eaMeta">
                  {lowRanges(reply.transcript, reply.segments).length
                    ? "Underlined parts are where the speech model was less sure of what it heard. Check those first."
                    : reply.segments ? "The speech model was confident about every part of this clip." : ""}
                </p>
              </details>
              <p className="eaMeta">
                {reply.audio_seconds ? `${reply.audio_seconds}s of audio · ` : ""}transcribed in {reply.seconds.transcribe}s · list written in {reply.seconds.tasks}s · {reply.seconds.total}s total
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
