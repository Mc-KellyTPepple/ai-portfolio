/**
 * Single place to configure the Habit Tracker showcase page.
 * Leave a test link as "" to hide that option; the page then falls back to
 * "request test access" by email.
 */

/** Render service. Only /health is called from the browser. */
export const HABIT_API_URL = "https://habit-tracker-server-n1ax.onrender.com";

/** Public source repository. */
export const HABIT_REPO_URL = "https://github.com/Mc-KellyPepple/habit-tracker";

export const TEST_LINKS = {
  /** Browser version of the app (e.g. the Vite client in /web deployed on Vercel). */
  webApp: "https://habit-tracker-web-henna.vercel.app/",
  /** Installable Android build (e.g. an EAS "apk" build download link). */
  androidApk:
    "https://expo.dev/accounts/mckellypepple/projects/habit-tracker/builds/268c3897-8a3c-45d8-8542-12731f9067ce",
};
