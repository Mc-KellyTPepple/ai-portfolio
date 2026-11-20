/** Single place to configure the Voice to Tasks page (/voice-to-tasks). */

/** Live API on Render. It sleeps when idle; opening the page wakes it. Set to the service URL once it is deployed. */
export const VOICE_API_URL = "https://voice-to-tasks.onrender.com";

export const VOICE_REPO_URL = "https://github.com/Mc-KellyTPepple/voice-to-tasks";

export type VoiceMode = "reminders" | "meeting";

export const VOICE_MODES: { id: VoiceMode; label: string; hint: string; example: string; maxSeconds: number }[] = [
  { id: "reminders", label: "Personal reminders", maxSeconds: 30, hint: "Things to remember, with days and times.", example: "Remind me to call Sam at 5pm tomorrow, it's urgent, and send the invoice by Friday." },
  { id: "meeting", label: "Meeting notes", maxSeconds: 90, hint: "A spoken recap: decisions, action items with owners, open questions.", example: "We agreed to move the launch to March. Dana will update the roadmap by Monday. Nobody has the budget yet." },
];

/** Notes a visitor can try without a microphone. They are written for this demo. */
export const VOICE_SAMPLE_NOTES: { mode: VoiceMode; label: string; text: string }[] = [
  { mode: "reminders", label: "Errands", text: "Remind me to pick up the dry cleaning tomorrow at 5pm, book the dentist by Friday, and call mum tonight. The dentist one is urgent." },
  { mode: "reminders", label: "Trip planning", text: "For the trip I have to book the flights tonight, ask Amara about the visa letter tomorrow morning, and pack the camera charger. Nothing else is urgent." },
  { mode: "reminders", label: "No action needed", text: "The meeting went well today, everyone liked the new layout and we agreed the numbers look healthy. That was pretty much it." },
  { mode: "meeting", label: "Product sync", text: "We agreed to move the launch to March because the testing is not finished. Dana will update the roadmap by Monday and Marcus is going to book the venue for the offsite. We still do not know who owns the budget, and nobody has decided about the pricing page." },
  { mode: "meeting", label: "Weekly stand-up", text: "Design is done with the onboarding screens. We decided to drop the dark theme for the first release. Priya will send the survey to customers tomorrow, it is urgent. It is still open whether we hire a second engineer this quarter." },
];
