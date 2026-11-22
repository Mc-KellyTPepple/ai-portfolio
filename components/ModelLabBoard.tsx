import { MODEL_LAB_BENCH } from "@/data/modelLabResults";

const pct = (v: number, d = 0) => `${(v * 100).toFixed(d)}%`;

/** Everything here is read from the generated results file; nothing is typed in. */
export default function ModelLabBoard() {
  const b = MODEL_LAB_BENCH;
  if (!b) {
    return (
      <div className="toolkitCard">
        <p>Results will appear here after the benchmark has run.</p>
      </div>
    );
  }
  return (
    <>
      <div className="toolkitCard">
        <p className="eaLabel">
          {b.datasets} public datasets, {b.runs} runs ({b.seeds} different splits each)
        </p>
        <div className="abStats">
          <div className="abStat">
            <b>
              {b.falseAlarms} of {b.shuffledRuns}
            </b>
            <span>Shuffled answers wrongly called useful. With no signal to find, it should say so.</span>
          </div>
          <div className="abStat">
            <b>
              {b.leakCaught} of {b.leakRuns}
            </b>
            <span>Planted answer-giveaway columns caught. {b.falseLeakFlags} false flags on {b.cleanRuns} unmodified datasets.</span>
          </div>
          <div className="abStat">
            <b>{pct(b.regretWithin2)}</b>
            <span>
              Runs where the chosen model was within 2 points of the best candidate on kept-back rows (median regret {(b.regretMedian * 100).toFixed(1)} points).
            </span>
          </div>
          <div className="abStat">
            <b>{(b.gapMedian * 100).toFixed(1)} pts</b>
            <span>
              Typical gap between its stated test score and the kept-back score. Its 95% interval contained the kept-back score in {pct(b.coverage)} of runs.
            </span>
          </div>
        </div>
        <p className="eaMeta">
          When it called a model useful ({b.usefulAndIs + b.usefulButIsnt} runs), the model really beat the baseline on kept-back rows in {b.usefulAndIs}.{" "}
          {b.missedUseful > 0 ? `It said "not clearly better" in ${b.missedUseful} runs where the model did beat the baseline, which is the cautious direction to be wrong in. ` : ""}
          {b.skipped.length > 0 ? `Skipped, could not be downloaded or read: ${b.skipped.join(", ")}.` : ""}
        </p>
      </div>

      <div className="toolkitCard" style={{ marginTop: "1rem" }}>
        <p className="eaLabel">By dataset (averages over the splits; classification scores are accuracy or balanced accuracy, numeric targets R²)</p>
        <div role="table" aria-label="Benchmark results by dataset" className="mlBench">
          <div role="row" className="mlBenchRow mlBenchHead">
            <span role="columnheader">Dataset</span>
            <span role="columnheader">Rows</span>
            <span role="columnheader">Stated</span>
            <span role="columnheader">Kept-back</span>
            <span role="columnheader">Baseline</span>
            <span role="columnheader">Leak caught</span>
            <span role="columnheader">False alarms</span>
          </div>
          {b.perDataset.map((d) => (
            <div key={d.name} role="row" className="mlBenchRow">
              <b role="cell">{d.name}</b>
              <span role="cell">{d.rows.toLocaleString()}</span>
              <span role="cell">{d.primary === "r2" ? d.claimed.toFixed(2) : pct(d.claimed, 1)}</span>
              <span role="cell">{d.primary === "r2" ? d.outer.toFixed(2) : pct(d.outer, 1)}</span>
              <span role="cell">{d.primary === "r2" ? d.baseline.toFixed(2) : pct(d.baseline, 1)}</span>
              <span role="cell">
                {d.leak[0]}/{d.leak[1]}
              </span>
              <span role="cell">
                {d.shuffled[0]}/{d.shuffled[1]}
              </span>
            </div>
          ))}
        </div>
        <p className="eaMeta">
          Stated is Model Lab&apos;s own held-out score; kept-back is the score on rows the benchmark hid from it entirely. The baseline always guesses the most common answer, or the average.
        </p>
      </div>

      {b.live && b.live.runs.length > 0 && (
        <div className="toolkitCard" style={{ marginTop: "1rem" }}>
          <p className="eaLabel">How long a visitor waits (measured on this live server, {b.live.when})</p>
          <ul className="eaLimits">
            {b.live.runs.map((r) => (
              <li key={r.sample}>
                <b>{r.sample}</b>
                {r.rows ? `, ${r.rows.toLocaleString()} rows` : ""}: {r.seconds.toFixed(0)} seconds from click to full result
              </li>
            ))}
          </ul>
          <p className="eaMeta">Timed from a GitHub-hosted runner calling the deployed service, one run at a time.</p>
        </div>
      )}
    </>
  );
}
