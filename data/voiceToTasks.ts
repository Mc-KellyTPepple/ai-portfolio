/** Single place to configure the Voice to Tasks page (/voice-to-tasks). */

/** Live API on Render. It sleeps when idle; opening the page wakes it. Set to the service URL once it is deployed. */
export const VOICE_API_URL = "";

export const VOICE_REPO_URL = "https://github.com/Mc-KellyTPepple/voice-to-tasks";

export const VOICE_MAX_SECONDS = 30;

/** Notes a visitor can try without a microphone. They are written for this demo. */
export const VOICE_SAMPLE_NOTES = [
  { label: "Team stand-up", text: "Okay so before Friday I need to send the revised budget to Dana, and Marcus is going to book the venue for the offsite. Also remind me to renew the domain next week, it expires on the twentieth." },
  { label: "Trip planning", text: "For the trip I have to book the flights tonight, ask Amara about the visa letter tomorrow morning, and pack the camera charger. Nothing else is urgent." },
  { label: "No action needed", text: "The meeting went well today, everyone liked the new layout and we agreed the numbers look healthy. That was pretty much it." },
];
