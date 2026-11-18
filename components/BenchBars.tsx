export type BenchRow = { label: string; value: number; lo?: number; hi?: number; detail?: string };

/** Horizontal bars with an optional 95% interval line. Values are percentages. */
export default function BenchBars({ rows, title, sub }: { rows: BenchRow[]; title: string; sub?: string }) {
  return (
    <div className="abGroup">
      <h4>{title}</h4>
      {sub && (
        <p className="eaMeta" style={{ margin: "0 0 0.4rem" }}>
          {sub}
        </p>
      )}
      <div role="list">
        {rows.map((r) => (
          <div className="abRow" role="listitem" key={r.label}>
            <span>{r.label}</span>
            <div className="abTrack" aria-hidden="true">
              <div className="abBar" style={{ width: `${r.value}%` }} />
              {r.lo !== undefined && r.hi !== undefined && <div className="abCi" style={{ left: `${r.lo}%`, width: `${Math.max(0, r.hi - r.lo)}%` }} />}
            </div>
            <span>
              {Number.isInteger(r.value) ? r.value : r.value.toFixed(1)}%
              <span className="sr-only">
                {r.detail ? ` ${r.detail}` : ""}
                {r.lo !== undefined ? ` (95% interval ${r.lo} to ${r.hi})` : ""}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
