/**
 * Turns a due phrase the speaker said ("by Friday", "tomorrow", "tonight") into a calendar day.
 * It only resolves phrases it is sure about and returns null otherwise: a wrong date in a calendar is worse than none.
 */
const DAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

export function resolveDue(phrase: string | null, now: Date = new Date()): Date | null {
  if (!phrase) return null;
  const p = phrase.toLowerCase();
  const day = (offset: number) => new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
  if (/\b(today|tonight|this (morning|afternoon|evening))\b/.test(p)) return day(0);
  if (/\btomorrow\b/.test(p)) return day(1);
  if (/\bnext week\b/.test(p)) return day(7);
  const i = DAYS.findIndex((d) => new RegExp(`\\b${d}\\b`).test(p));
  if (i >= 0) {
    const ahead = (i - now.getDay() + 7) % 7 || 7; // the next such day, never today
    return day(ahead);
  }
  return null;
}

/** A clock time the speaker said ("5pm", "5:30 pm", "noon"). "Morning" or "o'clock" alone are not placed. */
export function resolveTime(phrase: string | null): { h: number; m: number } | null {
  if (!phrase) return null;
  const p = phrase.toLowerCase();
  if (/\bnoon\b/.test(p)) return { h: 12, m: 0 };
  if (/\bmidnight\b/.test(p)) return { h: 0, m: 0 };
  const x = /\b(1[0-2]|0?[1-9])(?::([0-5]\d))?\s*(a\.?m\.?|p\.?m\.?)(?![a-z])/.exec(p);
  if (!x) return null;
  const pm = x[3].startsWith("p");
  return { h: (Number(x[1]) % 12) + (pm ? 12 : 0), m: Number(x[2] ?? 0) };
}

const pad = (n: number) => String(n).padStart(2, "0");
const ymd = (d: Date) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
const esc = (t: string) => t.replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

export type CalTask = { task: string; owner: string | null; due: string | null; quote: string };

export type IcsOptions = { alarm?: boolean };

/** An iCalendar file with one all-day event for each task whose due phrase can be placed. Returns null if none can. */
export function tasksToIcs(tasks: CalTask[], now: Date = new Date(), opts: IcsOptions = {}): { ics: string; placed: number } | null {
  const events: string[] = [];
  const stamp = `${ymd(now)}T${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  tasks.forEach((t, k) => {
    const d = resolveDue(t.due, now);
    if (!d) return;
    const time = resolveTime(t.due) ?? resolveTime(t.quote);   // the time may be in the quote while the day is in the due phrase
    const text = esc(t.task + (t.owner ? ` (${t.owner})` : ""));
    const lines = ["BEGIN:VEVENT", `UID:voice-to-tasks-${stamp}-${k}@portfolio`, `DTSTAMP:${stamp}`];
    if (time) {
      const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), time.h, time.m);
      const end = new Date(start.getTime() + 30 * 60000);
      const dt = (x: Date) => `${ymd(x)}T${pad(x.getHours())}${pad(x.getMinutes())}00`;
      lines.push(`DTSTART:${dt(start)}`, `DTEND:${dt(end)}`);   // floating local time: shows at the same clock time wherever it is opened
    } else {
      const end = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
      lines.push(`DTSTART;VALUE=DATE:${ymd(d)}`, `DTEND;VALUE=DATE:${ymd(end)}`);
    }
    lines.push(`SUMMARY:${text}`, `DESCRIPTION:${esc(`You said: "${t.quote}"`)}`);
    if (opts.alarm && time) lines.push("BEGIN:VALARM", "ACTION:DISPLAY", `DESCRIPTION:${text}`, "TRIGGER:-PT10M", "END:VALARM");
    lines.push("END:VEVENT");
    events.push(lines.join("\r\n"));
  });
  if (!events.length) return null;
  const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Voice to Tasks//EN", "CALSCALE:GREGORIAN", ...events, "END:VCALENDAR", ""].join("\r\n");
  return { ics, placed: events.length };
}
