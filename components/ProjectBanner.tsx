/**
 * Decorative, original illustration for a project landing page.
 * Pure inline SVG: no images to download, no network calls, no client JS.
 * It only adds a figure to the page; it never touches the live demos.
 */
export type BannerKind = "edgar" | "analyst" | "rag" | "habit" | "plant" | "animal";

const META: Record<BannerKind, { color: string; caption: string }> = {
  edgar: { color: "#fbbf24", caption: "Question → filing evidence → calculator-checked answer" },
  analyst: { color: "#34d399", caption: "Plain English → read-only SQL → result table" },
  rag: { color: "#22d3ee", caption: "Documents → hybrid search → cited answer" },
  habit: { color: "#a78bfa", caption: "Scheduled reminder → device confirms → retries stop" },
  plant: { color: "#a3e635", caption: "Leaf photo → disease class → confidence" },
  animal: { color: "#fbbf24", caption: "Image → classifier → cat, dog or bird" },
};

function Scene({ kind, c }: { kind: BannerKind; c: string }) {
  const ink = "#e6ebf5";
  const dim = "rgba(230,235,245,0.28)";
  const faint = "rgba(230,235,245,0.12)";
  switch (kind) {
    case "edgar":
      return (
        <g>
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${190 + i * 34} ${70 - i * 12})`}>
              <rect width="210" height="270" rx="14" fill="#101734" stroke={i === 2 ? c : dim} strokeWidth="2" />
              {i === 2 && (
                <>
                  <rect x="22" y="26" width="90" height="12" rx="6" fill={ink} opacity="0.85" />
                  {[62, 88, 114, 140, 166, 192, 218].map((y, k) => (
                    <rect key={y} x="22" y={y} width={k % 3 === 2 ? 120 : 166} height="9" rx="4.5" fill={dim} />
                  ))}
                  <rect x="18" y="108" width="174" height="22" rx="6" fill={c} opacity="0.22" />
                </>
              )}
            </g>
          ))}
          <path d="M470 200 H560" stroke={c} strokeWidth="3" strokeDasharray="2 9" strokeLinecap="round" />
          <path d="M552 190 l14 10 -14 10" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" />
          <g transform="translate(590 100)">
            <rect width="230" height="200" rx="16" fill="#101734" stroke={c} strokeWidth="2" />
            <text x="24" y="46" fill={dim} fontSize="15" fontFamily="ui-monospace,monospace">REVENUE GROWTH</text>
            <text x="24" y="100" fill={ink} fontSize="46" fontWeight="700" fontFamily="ui-sans-serif,system-ui">+7.8%</text>
            {[26, 52, 40, 74, 62, 96].map((h, k) => (
              <rect key={k} x={24 + k * 34} y={180 - h} width="22" height={h} rx="5" fill={k === 5 ? c : dim} />
            ))}
          </g>
          <g transform="translate(850 118)">
            {["[1]", "[2]", "[3]"].map((t, k) => (
              <g key={t} transform={`translate(0 ${k * 62})`}>
                <rect width="150" height="46" rx="23" fill={faint} stroke={c} strokeOpacity="0.7" />
                <text x="22" y="29" fill={c} fontSize="17" fontWeight="700" fontFamily="ui-monospace,monospace">{t}</text>
                <rect x="62" y="19" width="68" height="8" rx="4" fill={dim} />
              </g>
            ))}
          </g>
        </g>
      );
    case "analyst":
      return (
        <g>
          <g transform="translate(120 90)">
            <rect width="250" height="240" rx="14" fill="#101734" stroke={dim} strokeWidth="2" />
            <rect width="250" height="42" rx="14" fill={faint} />
            {[0, 1, 2, 3, 4].map((r) =>
              [0, 1, 2].map((k) => (
                <rect key={`${r}${k}`} x={20 + k * 78} y={64 + r * 34} width={k === 0 ? 56 : 52} height="10" rx="5" fill={r === 2 ? c : dim} opacity={r === 2 ? 0.8 : 1} />
              )),
            )}
          </g>
          <path d="M395 210 H455" stroke={c} strokeWidth="3" strokeDasharray="2 9" strokeLinecap="round" />
          <g transform="translate(470 80)">
            <rect width="290" height="260" rx="14" fill="#0a1024" stroke={c} strokeWidth="2" />
            <circle cx="24" cy="24" r="5" fill="#f87171" />
            <circle cx="42" cy="24" r="5" fill="#fbbf24" />
            <circle cx="60" cy="24" r="5" fill={c} />
            {[
              [20, 70, 60, c],
              [90, 70, 90, ink],
              [20, 104, 36, ink],
              [66, 104, 120, dim],
              [20, 138, 70, c],
              [100, 138, 84, ink],
              [20, 172, 110, dim],
              [20, 206, 54, c],
              [84, 206, 70, dim],
            ].map(([x, y, w, f], k) => (
              <rect key={k} x={x as number} y={y as number} width={w as number} height="12" rx="6" fill={f as string} opacity="0.85" />
            ))}
          </g>
          <path d="M785 210 H845" stroke={c} strokeWidth="3" strokeDasharray="2 9" strokeLinecap="round" />
          <g transform="translate(860 110)">
            <rect width="230" height="200" rx="14" fill="#101734" stroke={dim} strokeWidth="2" />
            {[70, 120, 96, 150, 112].map((h, k) => (
              <rect key={k} x={26 + k * 38} y={176 - h} width="24" height={h} rx="6" fill={k === 3 ? c : dim} />
            ))}
            <path d="M20 176 H210" stroke={dim} strokeWidth="2" />
          </g>
        </g>
      );
    case "rag":
      return (
        <g>
          {[0, 1, 2, 3].map((i) => (
            <g key={i} transform={`translate(${110 + (i % 2) * 120} ${80 + Math.floor(i / 2) * 130}) rotate(${i % 2 ? 4 : -4})`}>
              <rect width="96" height="116" rx="10" fill="#101734" stroke={dim} strokeWidth="2" />
              {[22, 44, 66].map((y) => (
                <rect key={y} x="14" y={y} width="68" height="8" rx="4" fill={dim} />
              ))}
              <path d="M70 0 h16 v16 z" fill={c} opacity="0.6" />
            </g>
          ))}
          <path d="M385 210 H455" stroke={c} strokeWidth="3" strokeDasharray="2 9" strokeLinecap="round" />
          <g transform="translate(470 75)">
            <rect width="270" height="270" rx="135" fill={faint} />
            {Array.from({ length: 34 }).map((_, k) => {
              const a = k * 2.399;
              const r = 12 + ((k * 37) % 112);
              const hit = k === 5 || k === 11 || k === 19;
              return <circle key={k} cx={135 + Math.cos(a) * r} cy={135 + Math.sin(a) * r} r={hit ? 8 : 4.5} fill={hit ? c : dim} />;
            })}
            <circle cx="135" cy="135" r="132" fill="none" stroke={c} strokeOpacity="0.5" strokeDasharray="3 8" />
          </g>
          <path d="M765 210 H835" stroke={c} strokeWidth="3" strokeDasharray="2 9" strokeLinecap="round" />
          <g transform="translate(850 85)">
            <rect width="260" height="250" rx="14" fill="#101734" stroke={c} strokeWidth="2" />
            {[0, 1, 2].map((i) => (
              <g key={i} transform={`translate(22 ${28 + i * 70})`}>
                <rect width="216" height="10" rx="5" fill={ink} opacity="0.85" />
                <rect y="22" width="150" height="8" rx="4" fill={dim} />
                <rect x="170" y="14" width="46" height="26" rx="13" fill={c} opacity="0.25" stroke={c} />
                <text x="193" y="32" textAnchor="middle" fill={c} fontSize="14" fontWeight="700" fontFamily="ui-monospace,monospace">[{i + 1}]</text>
              </g>
            ))}
          </g>
        </g>
      );
    case "habit":
      return (
        <g>
          <g transform="translate(150 40)">
            <rect width="170" height="340" rx="28" fill="#101734" stroke={ink} strokeOpacity="0.5" strokeWidth="3" />
            <rect x="60" y="12" width="50" height="8" rx="4" fill={dim} />
            {[0, 1, 2, 3].map((i) => (
              <g key={i} transform={`translate(18 ${50 + i * 68})`}>
                <rect width="134" height="52" rx="12" fill={faint} />
                <circle cx="26" cy="26" r="12" fill={i < 2 ? c : "none"} stroke={c} strokeWidth="2.5" />
                {i < 2 && <path d="M20 26 l5 5 9-10" stroke="#101734" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />}
                <rect x="48" y="17" width="64" height="9" rx="4.5" fill={ink} opacity="0.8" />
                <rect x="48" y="33" width="40" height="7" rx="3.5" fill={dim} />
              </g>
            ))}
          </g>
          <g transform="translate(420 150)">
            {[0, 1, 2].map((i) => (
              <circle key={i} cx="60" cy="60" r={34 + i * 22} fill="none" stroke={c} strokeOpacity={0.55 - i * 0.16} strokeWidth="2.5" />
            ))}
            <path d="M60 36 c-16 0-24 12-24 28 v14 l-8 10 h64 l-8-10 V64 c0-16-8-28-24-28 z" fill={c} />
            <path d="M50 96 a10 10 0 0 0 20 0" fill={c} />
          </g>
          <path d="M610 210 H700" stroke={c} strokeWidth="3" strokeDasharray="2 9" strokeLinecap="round" />
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${720 + i * 130} ${130 + (i % 2) * 40})`}>
              <rect width="110" height="110" rx="20" fill="#101734" stroke={i === 2 ? c : dim} strokeWidth="2" />
              <text x="55" y="48" textAnchor="middle" fill={i === 2 ? c : ink} fontSize="26" fontWeight="700" fontFamily="ui-sans-serif,system-ui">{["8:00", "13:00", "20:00"][i]}</text>
              {i === 2 ? (
                <path d="M38 76 l12 12 24-26" stroke={c} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              ) : (
                <rect x="30" y="74" width="50" height="8" rx="4" fill={dim} />
              )}
            </g>
          ))}
        </g>
      );
    case "plant":
      return (
        <g>
          <g transform="translate(150 50)">
            <rect width="360" height="320" rx="18" fill="#0d1a24" stroke={dim} strokeWidth="2" />
            <path d="M180 270 C 40 220 40 90 180 36 C 320 90 320 220 180 270 Z" fill={c} opacity="0.35" />
            <path d="M180 270 V60 M180 120 L120 90 M180 160 L110 135 M180 120 L240 90 M180 160 L250 135 M180 205 L130 185 M180 205 L230 185" stroke="#0d1a24" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.7" />
            <circle cx="132" cy="148" r="15" fill="#7c4a1d" opacity="0.9" />
            <circle cx="238" cy="118" r="11" fill="#7c4a1d" opacity="0.9" />
            <circle cx="214" cy="196" r="9" fill="#7c4a1d" opacity="0.9" />
            <rect x="100" y="116" width="64" height="64" rx="6" fill="none" stroke={ink} strokeWidth="3" strokeDasharray="8 6" />
            <rect x="100" y="94" width="108" height="22" rx="6" fill={ink} />
            <text x="110" y="110" fill="#0d1a24" fontSize="13" fontWeight="700" fontFamily="ui-monospace,monospace">BLIGHT 0.96</text>
          </g>
          <path d="M545 210 H625" stroke={c} strokeWidth="3" strokeDasharray="2 9" strokeLinecap="round" />
          <g transform="translate(640 80)">
            <rect width="420" height="260" rx="16" fill="#101734" stroke={c} strokeWidth="2" />
            {[
              ["Leaf blight", 0.96],
              ["Rust", 0.03],
              ["Healthy", 0.01],
            ].map(([n, v], i) => (
              <g key={n as string} transform={`translate(28 ${40 + i * 74})`}>
                <text fill={i === 0 ? ink : dim} fontSize="18" fontWeight="600" fontFamily="ui-sans-serif,system-ui">{n as string}</text>
                <rect y="16" width="364" height="16" rx="8" fill={faint} />
                <rect y="16" width={Math.max(364 * (v as number), 10)} height="16" rx="8" fill={i === 0 ? c : dim} />
              </g>
            ))}
          </g>
        </g>
      );
    case "animal":
      return (
        <g>
          {[
            { x: 130, label: "cat" },
            { x: 340, label: "dog" },
            { x: 550, label: "bird" },
          ].map((t, i) => (
            <g key={t.label} transform={`translate(${t.x} 70)`}>
              <rect width="180" height="210" rx="16" fill="#101734" stroke={i === 0 ? c : dim} strokeWidth={i === 0 ? 3 : 2} />
              {t.label === "cat" && (
                <g fill={i === 0 ? c : dim}>
                  <path d="M50 120 L56 60 L84 86 H96 L124 60 L130 120 C130 154 50 154 50 120 Z" />
                </g>
              )}
              {t.label === "dog" && (
                <g fill={dim}>
                  <path d="M56 70 C36 80 36 130 58 138 C70 120 70 90 66 78 Z" />
                  <path d="M124 70 C144 80 144 130 122 138 C110 120 110 90 114 78 Z" />
                  <ellipse cx="90" cy="108" rx="32" ry="38" />
                  <ellipse cx="90" cy="132" rx="16" ry="12" fill="rgba(230,235,245,0.2)" />
                  <circle cx="78" cy="100" r="4" fill="#101734" />
                  <circle cx="102" cy="100" r="4" fill="#101734" />
                  <ellipse cx="90" cy="127" rx="6" ry="4" fill="#101734" />
                </g>
              )}
              {t.label === "bird" && (
                <g fill={dim}>
                  <path d="M48 128 C60 82 110 70 134 96 L160 92 L140 112 C136 150 82 166 48 128 Z" />
                </g>
              )}
              <text x="90" y="192" textAnchor="middle" fill={i === 0 ? c : dim} fontSize="18" fontWeight="700" fontFamily="ui-monospace,monospace">{t.label}</text>
            </g>
          ))}
          <path d="M760 210 H830" stroke={c} strokeWidth="3" strokeDasharray="2 9" strokeLinecap="round" />
          <g transform="translate(850 85)">
            <rect width="260" height="250" rx="16" fill="#101734" stroke={c} strokeWidth="2" />
            {[
              ["cat", 0.94],
              ["dog", 0.04],
              ["bird", 0.02],
            ].map(([n, v], i) => (
              <g key={n as string} transform={`translate(24 ${34 + i * 70})`}>
                <text fill={i === 0 ? ink : dim} fontSize="17" fontWeight="600" fontFamily="ui-sans-serif,system-ui">{n as string}</text>
                <text x="212" textAnchor="end" fill={i === 0 ? c : dim} fontSize="15" fontFamily="ui-monospace,monospace">{Math.round((v as number) * 100)}%</text>
                <rect y="14" width="212" height="14" rx="7" fill={faint} />
                <rect y="14" width={Math.max(212 * (v as number), 10)} height="14" rx="7" fill={i === 0 ? c : dim} />
              </g>
            ))}
          </g>
        </g>
      );
  }
}

export default function ProjectBanner({ kind }: { kind: BannerKind }) {
  const { color, caption } = META[kind];
  const id = `pb-${kind}`;
  return (
    <figure className="projectBanner" style={{ ["--pb" as string]: color }}>
      <svg viewBox="0 0 1200 420" role="img" aria-label={caption} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#0b1024" />
            <stop offset="1" stopColor="#141a3a" />
          </linearGradient>
          <radialGradient id={`${id}-glow`} cx="0.5" cy="0.5" r="0.6">
            <stop offset="0" stopColor={color} stopOpacity="0.28" />
            <stop offset="1" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <pattern id={`${id}-grid`} width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" fill="none" stroke="rgba(230,235,245,0.05)" />
          </pattern>
        </defs>
        <rect width="1200" height="420" fill={`url(#${id}-bg)`} />
        <rect width="1200" height="420" fill={`url(#${id}-grid)`} />
        <ellipse cx="600" cy="210" rx="520" ry="240" fill={`url(#${id}-glow)`} />
        <Scene kind={kind} c={color} />
      </svg>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
