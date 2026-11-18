"use client";

import { useEffect, useRef, useState } from "react";
import DocExtractWait from "@/components/DocExtractWait";
import ServiceStatus from "@/components/ServiceStatus";
import { DOCX_API_URL, DOCX_MAX_SIDE, DOCX_SAMPLES } from "@/data/docExtract";
import { receiptToCsv, verify, type DocReceipt } from "@/lib/docValidate";

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
  const [edited, setEdited] = useState<DocReceipt | null>(null);
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
    setEdited(null);
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
      else {
        setReply(data);
        setEdited(data.receipt);
      }
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

  const receipt: DocReceipt | null = edited ?? reply?.receipt ?? null;
  const live = receipt ? verify(receipt) : null;
  const issues = live?.issues ?? [];
  const needsReview = reply ? (edited ? issues.length > 0 || !reply.parsed : reply.needs_review) : false;
  const changed = !!(reply && edited && JSON.stringify(edited) !== JSON.stringify(reply.receipt));
  const flagged = (field: string) => issues.some((i) => i.fields.includes(field));

  function setAmount(key: "subtotal" | "discount" | "service" | "tax" | "total", text: string) {
    const v = text.trim() === "" ? null : Number(text);
    if (v !== null && !Number.isFinite(v)) return;
    setEdited((r) => (r ? { ...r, [key]: v } : r));
  }
  function setPrice(index: number, text: string) {
    const v = text.trim() === "" ? null : Number(text);
    if (v !== null && !Number.isFinite(v)) return;
    setEdited((r) => (r ? { ...r, items: r.items.map((it, n) => (n === index ? { ...it, price: v } : it)) } : r));
  }
  function download(name: string, type: string, body: string) {
    const url = URL.createObjectURL(new Blob([body], { type }));
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

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

      {reply && receipt && live && (
        <div className="toolkitCard eaResult dxResult" aria-live="polite">
          <div className="dxHead">
            <span className="dxBadge" data-state={needsReview ? "review" : "ok"}>
              {needsReview ? "Needs review" : "Checks passed"}
            </span>
            <p className="eaMeta">
              {changed
                ? needsReview
                  ? "You edited an amount. It is re-checked in your browser, and the numbers still do not add up."
                  : "You edited an amount and the numbers now add up."
                : needsReview
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
              {(receipt.vendor || receipt.date) && <p className="eaFinal">{[receipt.vendor, receipt.date].filter(Boolean).join(" · ")}</p>}
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
                    {receipt.items.map((it, i) => (
                      <tr key={i}>
                        <td>{it.name || "–"}</td>
                        <td>{it.qty ?? "–"}</td>
                        <td>
                          <input
                            className="dxEdit"
                            inputMode="decimal"
                            aria-label={`Price of ${it.name || "item " + (i + 1)}`}
                            value={it.price ?? ""}
                            onChange={(e) => setPrice(i, e.target.value)}
                          />
                        </td>
                      </tr>
                    ))}
                    {receipt.items.length === 0 && (
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
                  .filter(([, key]) => receipt[key] !== null || key === "total")
                  .map(([label, key]) => (
                    <div key={key} data-flag={flagged(key)} data-strong={key === "total"}>
                      <dt>
                        <label htmlFor={`dx-${key}`}>{label}</label>
                      </dt>
                      <dd>
                        <input
                          id={`dx-${key}`}
                          className="dxEdit"
                          inputMode="decimal"
                          value={receipt[key] ?? ""}
                          onChange={(e) => setAmount(key, e.target.value)}
                        />
                      </dd>
                    </div>
                  ))}
              </dl>
              <p className="eaMeta dxHint">
                Amounts are editable. Correct one and the checks below re-run in your browser.
                {changed && (
                  <>
                    {" "}
                    <button type="button" className="dxLink" onClick={() => setEdited(reply.receipt)}>
                      Reset to what the model read
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>

          <h3 className="dxH3">Verification report</h3>
          <ul className="dxChecks">
            {live.checks.map((c) => (
              <li key={c.id} data-status={c.status}>
                <span className="dxMark" aria-hidden="true">
                  {c.status === "pass" ? "✓" : c.status === "fail" ? "!" : "–"}
                </span>
                <div>
                  <strong>{c.label}</strong>
                  <span className="sr-only"> {c.status}.</span>
                  <p>{c.detail}</p>
                </div>
              </li>
            ))}
          </ul>
          {!reply.parsed && <p className="eaMeta">The model&apos;s reply could not be read as a receipt, so nothing is shown as trusted.</p>}

          <div className="htTryActions">
            <button type="button" className="btn" onClick={() => download("receipt.json", "application/json", JSON.stringify({ ...receipt, needs_review: needsReview, issues }, null, 2))}>
              Download JSON
            </button>
            <button type="button" className="btn" onClick={() => download("receipt.csv", "text/csv", receiptToCsv(receipt))}>
              Download CSV
            </button>
          </div>

          <details>
            <summary>The extracted JSON</summary>
            <pre className="eaPre">{JSON.stringify(receipt, null, 2)}</pre>
          </details>
          <p className="eaMeta">
            Model {reply.model || "unknown"}, {reply.calls} model {reply.calls === 1 ? "call" : "calls"}
            {reply.repaired ? " (re-read after a failed check)" : ""}, {reply.seconds}s.
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
