import { MODEL_LAB_BENCH } from "@/data/modelLabResults";

/** Everything here is read from the generated results file; nothing is typed in. */
export default function ModelLabBoard() {
  if (!MODEL_LAB_BENCH) {
    return (
      <div className="toolkitCard">
        <p>Results will appear here after the first benchmark run finishes.</p>
      </div>
    );
  }
  return null;
}
