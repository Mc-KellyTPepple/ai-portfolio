import { ImageResponse } from "next/og";

export const alt = "Mc-Kelly Pepple | AI / ML Engineer & Full Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          color: "#eef1f7",
          background:
            "radial-gradient(circle at 15% 10%, rgba(109,91,240,0.55), transparent 55%), radial-gradient(circle at 90% 95%, rgba(14,165,214,0.45), transparent 55%), #0b0d12",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 6,
            color: "#59d9ff",
            marginBottom: 28,
          }}
        >
          AI / ML ENGINEER · FULL STACK · COMPUTER VISION
        </div>
        <div style={{ display: "flex", fontSize: 84, fontWeight: 800, lineHeight: 1.05 }}>
          Mc-Kelly Pepple
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 36,
            color: "#a3acbd",
            marginTop: 28,
            maxWidth: 900,
          }}
        >
          Building &amp; deploying scalable intelligent applications.
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            letterSpacing: 2,
            color: "#59d9ff",
            marginTop: 36,
          }}
        >
          PyTorch · Python · React · Node.js
        </div>
      </div>
    ),
    { ...size }
  );
}
