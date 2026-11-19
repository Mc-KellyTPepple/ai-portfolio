import BenchBars from "@/components/BenchBars";
import { wilson } from "@/lib/stats";

/** Pooled correct answers out of 200 per configuration (sample 1 + sample 2), from the repository's results/RESULTS.md. */
const CONFIGS = [
  { label: "One shot, no tools", big: 159, small: 163, tokens: 560 },
  { label: "Lean (the live demo)", big: 160, small: 169, tokens: 960 },
  { label: "Self-correcting agent", big: 159, small: 166, tokens: 2300 },
  { label: "Five candidates, majority", big: 157, small: 166, tokens: 2800 },
];
const mk = (label: string, k: number, n: number, detail = "") => {
  const [value, lo, hi] = wilson(k, n);
  return { label, value, lo, hi, detail: `${k} of ${n}. ${detail}` };
};

export default function AnalystBoard() {
  return (
    <div className="abBoard toolkitCard">
      <div className="abGroup">
        <h4>Execution accuracy on 200 Spider questions, both models side by side</h4>
        <p className="eaMeta" style={{ margin: "0 0 0.5rem" }}>
          Same 200 questions for every bar. The thin line is the 95% interval; all the bars overlap, so the four approaches tie.
        </p>
        <p className="abLegend">
          <span><i className="abDot" /> gpt-oss-120b (larger)</span>
          <span><i className="abDot" data-tone="alt" /> gpt-oss-20b (smaller)</span>
        </p>
        {CONFIGS.map((c) => (
          <div className="abPair" key={c.label}>
            <p className="abPairTitle">
              {c.label} <span className="eaMeta">· about {c.tokens.toLocaleString()} tokens per question</span>
            </p>
            <BenchBars title="" rows={[mk("120b", c.big, 200), { ...mk("20b", c.small, 200), tone: "alt" as const }]} />
          </div>
        ))}
      </div>
      <BenchBars
        title="Agreement as a confidence signal (five candidates, sample 1, 100 questions per model)"
        sub="When all five queries return the same rows the answer is far more likely to be right."
        rows={[
          mk("120b · all five agree", 77, 85),
          mk("120b · candidates split", 5, 15),
          { ...mk("20b · all five agree", 68, 72), tone: "alt" as const },
          { ...mk("20b · candidates split", 20, 28), tone: "alt" as const },
        ]}
      />
      <div className="abStats">
        <div className="abStat">
          <b>~40%</b>
          <span>Tokens the lean mode uses compared with the full agent, at the same accuracy</span>
        </div>
        <div className="abStat">
          <b>~30%</b>
          <span>Tokens saved by dropping sample rows from the prompt, with no accuracy cost</span>
        </div>
        <div className="abStat">
          <b>Read-only</b>
          <span>Tests try DROP, DELETE, UPDATE, INSERT, PRAGMA, ATTACH and stacked statements; all are refused</span>
        </div>
      </div>
    </div>
  );
}
