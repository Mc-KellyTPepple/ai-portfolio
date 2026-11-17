"use client";

import { useEffect, useRef, useState } from "react";
import DocExtractWait from "@/components/DocExtractWait";
import ServiceStatus from "@/components/ServiceStatus";
import { DOCX_API_URL, DOCX_MAX_SIDE, DOCX_SAMPLES } from "@/data/docExtract";

type Item = { name: string; qty: number | null; unit_price: number | null; price: number | null };
type Receipt = {
  vendor: string | null;
  date: string | null;
  items: Item[];
  subtotal: number | null;
  discount: number | null;
  service: number | null;
  tax: number | null;
  total: number | null;
};
type Issue = { code: string; message: string; fields: string[] };
type Reply = {
  receipt: Receipt;
  issues: Issue[];
  needs_review: boolean;
  calls: number;
  repaired: boolean;
  parsed: boolean;
  model: string;
  seconds: number;
};

const MAX_UPLOAD_BYTES = 12_000_000;

const money = (v: number | null | undefined) =>
  v === null || v === undefined ? "–" : v.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: Number.isInteger(v) ? 0 : 2 });

/** Shrink a photo in the browser so phone pictures upload quickly and stay under the server's size limit. */
async function toDataUrl(blob: Blob): Promise<string> {
  try {
    const bitmap = await createImageBitmap(blob, { imageOrientation: "from-image" });
    const scale = Math.min(1, DOCX_MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("no canvas");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.85);
  } catch {
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("read failed"));
      reader.readAsDataURL(blob);
    });
  }
}

export default function DocExtractDemo() {
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [reply, setReply] = useState<Reply | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const previewUrl = useRef<string | null>(null);

  useEffect(
    () => () => {
      if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
    },
    [],
  );

  function showPreview(blob: Blob) {
    if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
    previewUrl.current = URL.createObjectURL(blob);
    setPreview(previewUrl.current);
  }

  async function extract(blob: Blob) {
    if (busy) return;
    setError("");
    setReply(null);
    if (!blob.type.startsWith("image/")) {
      setError("Please choose a photo or image file (JPG, PNG or WebP).");
      return;
    }
    if (blob.size > MAX_UPLOAD_BYTES) {
      setError("That image is too large. Please use one under 12 MB.");
      return;
    }
    showPreview(blob);
    setBusy(true);
    try {
      const image = await toDataUrl(blob);
      const res = await fetch(`${DOCX_API_URL}/extract`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      });
      const data = (await res.json().catch(() => ({}))) as Reply & { error?: string };
      if (!res.ok) setError(data.error ?? "Something went wrong. Please try again.");
      else setReply(data);
    } catch {
      setError("Could not reach the server. It may still be waking up; wait a few seconds and try again.");
    } finally {
      setBusy(false);
    }
  }

  async function useSample(file: string) {
    try {
      const res = await fetch(file);
      await extract(await res.blob());
    } catch {
      setError("Could not load that sample.");
    }
  }

  const flagged = (field: string) => !!reply?.issues.some((i) => i.fields.includes(field));

  return (
    <div className="demoWrap">
      <ServiceStatus
        apiUrl={DOCX_API_URL}
        label="Doc Extract API · Render"
        onOnline={() => setReady(true)}
        readyText="The server is awake. Pick a sample or upload a receipt."
      />

      {!ready && !busy && <DocExtractWait mode="wake" />}

      <div className="toolkitCard eaForm">
        <p className="eaLabel">Choose a receipt</p>
        <div className="eaExamples" aria-label="Sample receipts">
          {DOCX_SAMPLES.map((s) => (
            <button key={s.id} type="button" className="eaChip" disabled={busy} onClick={() => void useSample(s.file)}>
              {s.label} <span className="dxChipNote">· {s.note}</span>
            </button>
          ))}
        </div>
        <div className="htTryActions">
          <label className="btn btnPrimary daFile">
            {busy ? "Working…" : "Upload your own"}
            <input
              type="file"
              accept="image/*"
              disabled={busy}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void extract(f);
                e.target.value = "";
              }}
            />
          </label>
          <span className="eaCount">Photo of a receipt or invoice, JPG, PNG or WebP</span>
        </div>
        <p className="eaNote">
          Samples are receipts drawn for this demo, not real documents. Your own image is processed in memory and is never stored.
        </p>
      </div>

      {busy && <DocExtractWait mode="extract" />}

      {error && (
        <div className="toolkitCard eaError" role="alert">
          <p>{error}</p>
        </div>
      )}

      {reply && (
        <div className="toolkitCard eaResult dxResult" aria-live="polite">
          <div className="dxHead">
            <span className="dxBadge" data-state={reply.needs_review ? "review" : "ok"}>
              {reply.needs_review ? "Needs review" : "Checks passed"}
            </span>
            <p className="eaMeta">
              {reply.needs_review
                ? "The numbers on this document do not add up, so a person should look at it."
                : reply.repaired
                  ? "The first reading failed a check; the second reading passed."
                  : "The line items, subtotal, tax and total are consistent."}
            </p>
          </div>

          <div className="dxGrid">
            {preview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="dxPreview" src={preview} alt="The receipt that was read" />
            )}
            <div>
              {(reply.receipt.vendor || reply.receipt.date) && (
                <p className="eaFinal">
                  {[reply.receipt.vendor, reply.receipt.date].filter(Boolean).join(" · ")}
                </p>
              )}
              <div className="eaTableWrap">
                <table className="eaTable">
                  <thead>
                    <tr>
                      <th scope="col">Item</th>
                      <th scope="col">Qty</th>
                      <th scope="col">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reply.receipt.items.map((it, i) => (
                      <tr key={i}>
                        <td>{it.name || "–"}</td>
                        <td>{it.qty ?? "–"}</td>
                        <td>{money(it.price)}</td>
                      </tr>
                    ))}
                    {reply.receipt.items.length === 0 && (
                      <tr>
                        <td colSpan={3}>No line items were read.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <dl className="dxTotals">
                {(
                  [
                    ["Subtotal", "subtotal"],
                    ["Discount", "discount"],
                    ["Service", "service"],
                    ["Tax", "tax"],
                    ["Total", "total"],
                  ] as const
                )
                  .filter(([, key]) => reply.receipt[key] !== null || key === "total")
                  .map(([label, key]) => (
                    <div key={key} data-flag={flagged(key)} data-strong={key === "total"}>
                      <dt>{label}</dt>
                      <dd>{money(reply.receipt[key])}</dd>
                    </div>
                  ))}
              </dl>
            </div>
          </div>

          {reply.issues.length > 0 && (
            <ul className="dxIssues">
              {reply.issues.map((i, n) => (
                <li key={n}>{i.message}</li>
              ))}
            </ul>
          )}
          {!reply.parsed && <p className="eaMeta">The model&apos;s reply could not be read as a receipt, so nothing is shown as trusted.</p>}

          <details>
            <summary>The extracted JSON</summary>
            <pre className="eaPre">{JSON.stringify(reply.receipt, null, 2)}</pre>
          </details>
          <p className="eaMeta">
            Model {reply.model || "unknown"}, {reply.calls} model {reply.calls === 1 ? "call" : "calls"}, {reply.seconds}s.
          </p>
        </div>
      )}

      <p className="cvNote">
        This demo runs on a limited daily model quota, so it can be slow or say it is busy. Each visitor gets 6 receipts an hour. Always check
        important amounts against the original document.
      </p>
    </div>
  );
}
