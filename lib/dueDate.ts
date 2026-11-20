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

const pad = (n: number) => String(n).padStart(2, "0");
const ymd = (d: Date) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
const esc = (t: string) => t.replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

export type CalTask = { task: string; owner: string | null; due: string | null; quote: string };

/** An iCalendar file with one all-day event for each task whose due phrase can be placed. Returns null if none can. */
export function tasksToIcs(tasks: CalTask[], now: Date = new Date()): { ics: string; placed: number } | null {
  const events: string[] = [];
  const stamp = `${ymd(now)}T${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  tasks.forEach((t, k) => {
    const d = resolveDue(t.due, now);
    if (!d) return;
    const end = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
    events.push(
      [
        "BEGIN:VEVENT",
        `UID:voice-to-tasks-${stamp}-${k}@portfolio`,
        `DTSTAMP:${stamp}`,
        `DTSTART;VALUE=DATE:${ymd(d)}`,
        `DTEND;VALUE=DATE:${ymd(end)}`,
        `SUMMARY:${esc(t.task + (t.owner ? ` (${t.owner})` : ""))}`,
        `DESCRIPTION:${esc(`You said: "${t.quote}"`)}`,
        "END:VEVENT",
      ].join("\r\n"),
    );
  });
  if (!events.length) return null;
  const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Voice to Tasks//EN", "CALSCALE:GREGORIAN", ...events, "END:VCALENDAR", ""].join("\r\n");
  return { ics, placed: events.length };
}
