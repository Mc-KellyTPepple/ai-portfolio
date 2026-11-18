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
      <BenchBars
        title="Smaller model, execution accuracy on 200 Spider questions"
        sub="Same questions for every row. The thin line is the 95% interval; the rows overlap, so the approaches tie."
        rows={CONFIGS.map((c) => mk(`${c.label} · ~${c.tokens.toLocaleString()} tokens`, c.small, 200))}
      />
      <BenchBars
        title="Larger model, same questions"
        rows={CONFIGS.map((c) => mk(`${c.label} · ~${c.tokens.toLocaleString()} tokens`, c.big, 200))}
      />
      <BenchBars
        title="Agreement as a confidence signal (five candidates, sample 1)"
        sub="When all five queries return the same rows the answer is far more likely to be right."
        rows={[
          mk("Smaller model · all five agree", 68, 72),
          mk("Smaller model · candidates split", 20, 28),
          mk("Larger model · all five agree", 77, 85),
          mk("Larger model · candidates split", 5, 15),
        ]}
      />
      <div className="abStats">
        <div className="abStat">
          <b>~0.01</b>
          <span>SQL errors per question, so retry rarely fires</span>
        </div>
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
