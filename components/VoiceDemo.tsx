"use client";

import { useEffect, useRef, useState } from "react";
import ServiceStatus from "@/components/ServiceStatus";
import VoiceWait from "@/components/VoiceWait";
import { VOICE_API_URL, VOICE_MAX_SECONDS, VOICE_SAMPLE_NOTES } from "@/data/voiceToTasks";

type Task = { task: string; owner: string | null; due: string | null; quote: string; grounded: boolean; removed: string[] };
type Reply = {
  transcript: string;
  empty: boolean;
  note?: string;
  summary: string;
  tasks: Task[];
  audio_seconds?: number;
  seconds: { transcribe: number; tasks: number; total: number };
};

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
  const [copied, setCopied] = useState(false);

  const rec = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const raf = useRef<number | null>(null);
  const audioCtx = useRef<AudioContext | null>(null);
  const urlRef = useRef<string | null>(null);

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
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    },
    [],
  );

  async function start() {
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
        if (sec >= VOICE_MAX_SECONDS) stop();
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
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  const sendClip = () => clip && call("/transcribe", { method: "POST", headers: { "Content-Type": clip.type || "audio/webm" }, body: clip });
  const sendText = () => call("/tasks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) });

  function listText(r: Reply) {
    return r.tasks.map((t) => `- [ ] ${t.task}${t.owner ? ` (${t.owner})` : ""}${t.due ? ` — ${t.due}` : ""}`).join("\n");
  }
  async function copy() {
    if (!reply) return;
    try {
      await navigator.clipboard.writeText(`${reply.summary}\n\n${listText(reply)}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setError("Copy is blocked in this browser. Select the list and copy it by hand.");
    }
  }
  function download() {
    if (!reply) return;
    const url = URL.createObjectURL(new Blob([`${reply.summary}\n\n${listText(reply)}\n\nTranscript:\n${reply.transcript}\n`], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "tasks.txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

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
        <p className="eaLabel">Say what you need to do</p>
        <p className="eaMeta" style={{ margin: "0 0 0.75rem" }}>
          Up to {VOICE_MAX_SECONDS} seconds, for example: “Remind me to send the invoice to Sam by Friday and book the flights tonight.”
        </p>
        <div className="vtRecorder">
          {!recording ? (
            <button type="button" className="btn btnPrimary" disabled={disabled} onClick={() => void start()}>
              {clip ? "Record again" : "Start recording"}
            </button>
          ) : (
            <button type="button" className="btn btnPrimary vtStop" onClick={stop}>
              Stop · {elapsed}s / {VOICE_MAX_SECONDS}s
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
            {VOICE_SAMPLE_NOTES.map((n) => (
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
              <p className="eaLabel">Summary</p>
              <p>{reply.summary || "No summary."}</p>
              <p className="eaLabel">To-do list</p>
              {reply.tasks.length === 0 ? (
                <p className="eaMeta">No tasks found. Nothing in the note asked for action.</p>
              ) : (
                <ul className="vtTasks">
                  {reply.tasks.map((t, i) => (
                    <li key={i} data-done={done[i] ? "true" : undefined}>
                      <label>
                        <input type="checkbox" checked={!!done[i]} onChange={() => setDone((d) => ({ ...d, [i]: !d[i] }))} />
                        <span>{t.task}</span>
                      </label>
                      <span className="vtMeta">
                        {t.owner && <span className="vtChip">{t.owner}</span>}
                        {t.due && <span className="vtChip">{t.due}</span>}
                        <span className="vtChip" data-ok={t.grounded ? "yes" : "no"} title={t.quote ? `You said: “${t.quote}”` : undefined}>
                          {t.grounded ? "from your words" : "not found in transcript"}
                        </span>
                      </span>
                      {t.quote && <span className="vtQuote">“{t.quote}”</span>}
                    </li>
                  ))}
                </ul>
              )}
              <div className="htTryActions">
                <button type="button" className="btn btnGhost" onClick={() => void copy()} disabled={!reply.tasks.length}>
                  {copied ? "Copied" : "Copy list"}
                </button>
                <button type="button" className="btn btnGhost" onClick={download}>Download .txt</button>
              </div>
              <details className="vtText" open>
                <summary>Transcript</summary>
                <p className="vtTranscript">{reply.transcript}</p>
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
