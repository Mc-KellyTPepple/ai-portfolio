import { DOCX_BENCH, type DocxConfigResult } from "@/data/docExtractResults";

type Metric = "total" | "allFields";
const METRICS: { key: Metric; title: string; sub: string }[] = [
  { key: "total", title: "Total read correctly", sub: "Exact within 0.5 currency units" },
  { key: "allFields", title: "Every labelled key field correct", sub: "Total, subtotal and tax all right" },
];

function Bars({ metric, configs }: { metric: Metric; configs: DocxConfigResult[] }) {
  return (
    <div role="list">
      {configs
        .slice()
        .sort((a, b) => a[metric][0] - b[metric][0])
        .map((c) => {
          const [v, lo, hi] = c[metric];
          return (
            <div className="abRow" role="listitem" key={c.key}>
              <span>{c.name}</span>
              <div className="abTrack" aria-hidden="true">
                <div className="abBar" style={{ width: `${v}%` }} />
                <div className="abCi" style={{ left: `${lo}%`, width: `${Math.max(0, hi - lo)}%` }} />
              </div>
              <span>
                {Math.round(v)}%<span className="sr-only"> (95% interval {lo} to {hi})</span>
              </span>
            </div>
          );
        })}
    </div>
  );
}

/** Measured benchmark numbers, read from data/docExtractResults.ts (generated from the repo's results). Nothing here is typed by hand. */
export default function AccuracyBoard() {
  const b = DOCX_BENCH;
  const vision = b.configs.find((c) => c.key === "vision");
  const failureTotal = b.visionFailures.reduce((s, f) => s + f.documents, 0);
  return (
    <div className="abBoard toolkitCard">
      <div>
        <span className="abTag" data-final={b.final}>
          {b.final ? "Final result" : "Interim result"}
        </span>
        <p className="htCardText">
          {b.final
            ? `Scored on ${b.documentsScored} CORD v2 test receipts.`
            : `Scored on ${b.documentsScored} of ${b.documentsPlanned} planned CORD v2 test receipts (every method finished the same ${b.documentsScored}). Counts are small, so the thin line on each bar is the 95% interval: differences inside it are noise. The table is updated when the remaining receipts finish.`}
        </p>
      </div>

      {METRICS.map((m) => (
        <div className="abGroup" key={m.key}>
          <h4>{m.title}</h4>
          <p className="eaMeta" style={{ margin: "0 0 0.4rem" }}>{m.sub}</p>
          <Bars metric={m.key} configs={b.configs} />
        </div>
      ))}

      {vision && (
        <div className="abStats">
          <div className="abStat">
            <b>{vision.itemF1.toFixed(2)}</b>
            <span>Line-item F1 (vision) vs {b.configs.find((c) => c.key === "ocr_llm")?.itemF1.toFixed(2)} for OCR + text model</span>
          </div>
          <div className="abStat">
            <b>{b.visionTokensPerReceipt?.toLocaleString() ?? "–"}</b>
            <span>Tokens per receipt for the vision model, one call</span>
          </div>
          <div className="abStat">
            <b>{b.visionFlagged}</b>
            <span>Of {b.visionDocuments} vision-read receipts flagged for review by the arithmetic check</span>
          </div>
        </div>
      )}

      {b.visionFailures.length > 0 && (
        <div className="abGroup">
          <h4>Where the vision model went wrong</h4>
          <p className="eaMeta" style={{ margin: "0 0 0.4rem" }}>
            Counted over {b.visionDocuments} receipts; one receipt can appear under more than one heading ({failureTotal} entries).
          </p>
          <ul className="dxIssues">
            {b.visionFailures.map((f) => (
              <li key={f.label}>
                {f.label}: {f.documents}
              </li>
            ))}
          </ul>
          <p className="eaMeta">
            “Label error in the dataset” means the CORD answer key itself is garbled for that receipt, not a model mistake.
          </p>
        </div>
      )}
    </div>
  );
}
