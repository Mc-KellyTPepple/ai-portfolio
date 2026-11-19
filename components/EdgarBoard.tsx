import BenchBars from "@/components/BenchBars";
import { wilson } from "@/lib/stats";

const row = (label: string, k: number, n: number, detail: string) => {
  const [value, lo, hi] = wilson(k, n);
  return { label, value, lo, hi, detail: `${k} of ${n}. ${detail}` };
};

/** Numbers are from the repository README (evals/results). Counts are shown so the intervals can be checked. */
export default function EdgarBoard() {
  return (
    <div className="abBoard toolkitCard">
      <BenchBars
        title="Answerable questions right (tiers 1 to 3, 150 questions)"
        sub="Memory alone vs the same model with the filing tools. The thin line is the 95% interval."
        rows={[row("Closed book (model memory)", 26, 150, "Closed book."), row("Facts agent (SQL, ratios, calculator)", 150, 150, "Facts agent."), row("Full agent (adds filing search)", 150, 150, "Full agent.")]}
      />
      <BenchBars
        title="Held-out questions, never seen while fixing the agent"
        sub="Set 2 was generated with a new seed after the fixes and run once. Set 1 was held out when first run, then used for fixing."
        rows={[
          row("Set 1 · facts agent (66 questions)", 62, 66, "Four misses led to fixes."),
          row("Set 1 · full agent (66 questions)", 66, 66, "Full agent."),
          row("Set 2 · facts agent (89 questions)", 89, 89, "After the fixes."),
          row("Set 2 · full agent (89 questions)", 89, 89, "After the fixes."),
        ]}
      />
      <div className="abStats">
        <div className="abStat">
          <b>100%</b>
          <span>Citation precision: every cited filing was a real source for the answer</span>
        </div>
        <div className="abStat">
          <b>99.8%</b>
          <span>Citation recall for the full agent (the right filing was named)</span>
        </div>
        <div className="abStat">
          <b>100%</b>
          <span>Unanswerable questions correctly declined (future years, companies outside the corpus)</span>
        </div>
        <div className="abStat">
          <b>1.9</b>
          <span>Tool calls per question, about 2,700 tokens for the full agent</span>
        </div>
      </div>
      <div className="abGroup">
        <h4>Operations</h4>
        <p className="eaMeta" style={{ margin: "0 0 0.5rem" }}>
          Cost and latency are from the stored evaluation records. The load test ran the real HTTP server with the model stubbed, so it measures the service, not the model.
        </p>
        <div className="abStats">
          <div className="abStat">
            <b>~2,500</b>
            <span>Tokens per question for the agents (about 2,100 to 2,750 across the three sets)</span>
          </div>
          <div className="abStat">
            <b>2 to 6 s</b>
            <span>Median answer time. The 95th percentile (~59 s) is rate-limit waiting during the evaluation</span>
          </div>
          <div className="abStat">
            <b>200 / 200</b>
            <span>Requests served with 20 visitors at once; a visitor sending 60 got 10 answers and 50 refusals</span>
          </div>
        </div>
      </div>
      <p className="eaMeta">
        100% on 89 questions is consistent with a true rate of roughly 96 to 100%. The held-out sets reuse the same question templates and 10 companies, so they show
        the agent handles new instances of these question types, not new kinds of question. Filing-text questions (23) are covered only by the tuned set.
      </p>
    </div>
  );
}
