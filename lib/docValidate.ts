/**
 * TypeScript port of the arithmetic checks in the doc-extract repo (src/docextract/validate.py), so the page can
 * re-check a receipt live when a visitor corrects an amount. Same rules, same tolerance.
 */
export type DocItem = { name: string; qty: number | null; unit_price: number | null; price: number | null };
export type DocReceipt = {
  vendor: string | null;
  date: string | null;
  items: DocItem[];
  subtotal: number | null;
  discount: number | null;
  service: number | null;
  tax: number | null;
  total: number | null;
};
export type DocIssue = { code: string; message: string; fields: string[] };
export type DocCheck = { id: string; label: string; status: "pass" | "fail" | "skipped"; detail: string };

const g = (n: number) => String(Number(n.toPrecision(12)));
const tol = (...a: (number | null)[]) => Math.max(0.011, 0.002 * Math.max(0, ...a.filter((x): x is number => x !== null).map(Math.abs)));
const close = (a: number, b: number) => Math.abs(a - b) <= tol(a, b);

/** Run every check and report each one, so the page can show what was verified and not only what failed. */
export function verify(r: DocReceipt): { issues: DocIssue[]; checks: DocCheck[] } {
  const issues: DocIssue[] = [];
  const checks: DocCheck[] = [];

  // total present
  if (r.total === null) {
    issues.push({ code: "missing_total", message: "No total was found.", fields: ["total"] });
    checks.push({ id: "total", label: "A total is present", status: "fail", detail: "No total was found." });
  } else if (r.total <= 0) {
    issues.push({ code: "bad_total", message: `The total (${g(r.total)}) is not a positive amount.`, fields: ["total"] });
    checks.push({ id: "total", label: "A total is present", status: "fail", detail: `The total (${g(r.total)}) is not a positive amount.` });
  } else checks.push({ id: "total", label: "A total is present", status: "pass", detail: `Total ${g(r.total)}.` });

  const priced = r.items.filter((i) => i.price !== null);
  const itemsSum = priced.length ? priced.reduce((s, i) => s + (i.price as number), 0) : null;

  // line math
  const withMath = r.items.filter((i) => i.qty && i.unit_price && i.price !== null);
  const lineIssues: DocIssue[] = [];
  for (const i of withMath) {
    const expect = (i.qty as number) * (i.unit_price as number);
    if (!close(expect, i.price as number))
      lineIssues.push({
        code: "line_math",
        message: `'${i.name}': ${g(i.qty as number)} x ${g(i.unit_price as number)} is ${g(expect)}, but the line says ${g(i.price as number)}.`,
        fields: ["items"],
      });
  }
  issues.push(...lineIssues);
  checks.push(
    withMath.length === 0
      ? { id: "lines", label: "Each line: quantity × unit price = line price", status: "skipped", detail: "No lines print both a quantity and a unit price." }
      : lineIssues.length
        ? { id: "lines", label: "Each line: quantity × unit price = line price", status: "fail", detail: lineIssues.map((x) => x.message).join(" ") }
        : { id: "lines", label: "Each line: quantity × unit price = line price", status: "pass", detail: `${withMath.length} line${withMath.length === 1 ? "" : "s"} checked.` },
  );

  const discount = r.discount ?? 0;
  const service = r.service ?? 0;
  const tax = r.tax ?? 0;

  // items vs subtotal
  if (itemsSum !== null && r.subtotal !== null) {
    if (!(close(itemsSum, r.subtotal) || close(itemsSum - Math.abs(discount), r.subtotal))) {
      const m = `The line items add up to ${g(itemsSum)} but the subtotal is ${g(r.subtotal)}.`;
      issues.push({ code: "items_vs_subtotal", message: m, fields: ["items", "subtotal"] });
      checks.push({ id: "subtotal", label: "Line items add up to the subtotal", status: "fail", detail: m });
    } else checks.push({ id: "subtotal", label: "Line items add up to the subtotal", status: "pass", detail: `${g(itemsSum)} matches subtotal ${g(r.subtotal)}.` });
  } else checks.push({ id: "subtotal", label: "Line items add up to the subtotal", status: "skipped", detail: "The receipt has no subtotal or no priced lines to compare." });

  // total composition
  const base = r.subtotal !== null ? r.subtotal : itemsSum;
  if (base !== null && r.total !== null && r.total > 0) {
    const net = base - Math.abs(discount);
    const accepted = [net + tax + service, net + service, net + tax, net];
    if (!accepted.some((a) => close(r.total as number, a))) {
      const m = `Subtotal ${g(base)} with tax ${g(tax)}, service ${g(service)} and discount ${g(Math.abs(discount))} gives ${g(net + tax + service)}, but the total is ${g(r.total)}.`;
      issues.push({ code: "total_composition", message: m, fields: ["total", "subtotal", "tax"] });
      checks.push({ id: "composition", label: "Subtotal − discount + tax + service = total", status: "fail", detail: m });
    } else checks.push({ id: "composition", label: "Subtotal − discount + tax + service = total", status: "pass", detail: `Total ${g(r.total)} is consistent with the parts.` });
  } else checks.push({ id: "composition", label: "Subtotal − discount + tax + service = total", status: "skipped", detail: "Needs a total and a subtotal or priced lines." });

  return { issues, checks };
}

export const validateReceipt = (r: DocReceipt) => verify(r).issues;

export function receiptToCsv(r: DocReceipt): string {
  const q = (v: string | number | null) => (v === null ? "" : /[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
  const rows: (string | number | null)[][] = [["type", "name", "qty", "unit_price", "amount"]];
  for (const i of r.items) rows.push(["item", i.name, i.qty, i.unit_price, i.price]);
  for (const k of ["subtotal", "discount", "service", "tax", "total"] as const) if (r[k] !== null) rows.push([k, "", null, null, r[k]]);
  return rows.map((row) => row.map(q).join(",")).join("\n") + "\n";
}
