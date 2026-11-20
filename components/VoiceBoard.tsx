import BenchBars from "@/components/BenchBars";
import { VOICE_BENCH } from "@/data/voiceResults";

const MODEL: Record<string, string> = { turbo: "Whisper large-v3-turbo", v3: "Whisper large-v3" };
const SET: Record<string, string> = { clean: "clear speech", other: "harder speech" };

/** Everything here is read from the generated results file; nothing is typed in. */
export default function VoiceBoard() {
  const keys = Object.keys(VOICE_BENCH).sort();
  if (!keys.length) return <div className="toolkitCard"><p>Results will appear here after the first benchmark run.</p></div>;
  const label = (k: string) => `${MODEL[k.split("-")[0]] ?? k} · ${SET[k.split("-")[1]] ?? k}`;
  const hi = Math.max(...keys.map((k) => VOICE_BENCH[k].ci_hi), 1);
  const scale = Math.max(5, Math.ceil(hi * 1.15)); // the bars are scaled so small error rates are readable
  const rows = keys.map((k) => {
    const v = VOICE_BENCH[k];
    const s = 100 / scale;
    return {
      label: label(k), value: v.wer * s, lo: v.ci_lo * s, hi: v.ci_hi * s, tone: k.startsWith("v3") ? ("alt" as const) : undefined,
      detail: `${v.errors} word errors in ${v.words} words, ${v.utterances} clips`,
    };
  });
  const total = keys.reduce((n, k) => n + VOICE_BENCH[k].utterances, 0);
  const best = keys.reduce((a, k) => (VOICE_BENCH[k].wer < VOICE_BENCH[a].wer ? k : a), keys[0]);
  const worst = VOICE_BENCH[best].worst[0];
  return (
    <div className="abBoard toolkitCard">
      <div role="list" aria-label="Word error rate by configuration">
        {keys.map((k, i) => (
          <div className="abRow" role="listitem" key={k} style={{ gridTemplateColumns: "minmax(0, 1.3fr) minmax(0, 2fr) auto" }}>
            <span>{label(k)}</span>
            <div className="abTrack" aria-hidden="true">
              <div className="abBar" data-tone={rows[i].tone} style={{ width: `${rows[i].value}%` }} />
              <div className="abCi" style={{ left: `${rows[i].lo}%`, width: `${Math.max(0, rows[i].hi - rows[i].lo)}%` }} />
            </div>
            <span>
              {VOICE_BENCH[k].wer.toFixed(1)}%
              <span className="srOnly"> word error rate, 95% interval {VOICE_BENCH[k].ci_lo} to {VOICE_BENCH[k].ci_hi}. {rows[i].detail}</span>
            </span>
          </div>
        ))}
      </div>
      <p className="eaMeta">Word error rate: lower is better. The thin line is the 95% interval. Bars are drawn on a 0 to {scale}% scale.</p>
      <div className="abStats">
        <div className="abStat"><b>{total}</b><span>Recordings scored across {keys.length} configurations</span></div>
        <div className="abStat"><b>{VOICE_BENCH[best].wer.toFixed(1)}%</b><span>Lowest word error rate: {label(best)}</span></div>
        <div className="abStat"><b>{VOICE_BENCH[best].median_latency}s</b><span>Median time to transcribe a clip ({VOICE_BENCH[best].speed_x_realtime}× faster than real time)</span></div>
        <div className="abStat"><b>{VOICE_BENCH[best].perfect}/{VOICE_BENCH[best].utterances}</b><span>Clips with no word errors at all ({label(best)})</span></div>
      </div>
      {worst && (
        <div className="abGroup">
          <h4>The worst clip in the best configuration</h4>
          <p className="eaMeta">{worst.errors} errors in {worst.words} words.</p>
          <p className="vtQuote">Reference: {worst.reference.toLowerCase()}</p>
          <p className="vtQuote">Heard: {worst.hypothesis}</p>
        </div>
      )}
    </div>
  );
}
