/**
 * Decorative, original illustration for a project landing page.
 * Pure inline SVG: no images to download, no network calls, no client JS.
 * It only adds a figure to the page; it never touches the live demos.
 */
export type BannerKind = "docextract" | "edgar" | "analyst" | "rag" | "habit" | "plant" | "animal" | "voice";

const META: Record<BannerKind, { color: string; caption: string }> = {
  docextract: { color: "#22d3ee", caption: "Receipt image → fields → arithmetic check → flag if it does not add up" },
  edgar: { color: "#fbbf24", caption: "Question → filing evidence → calculator-checked answer" },
  analyst: { color: "#34d399", caption: "Plain English → read-only SQL → result table" },
  rag: { color: "#22d3ee", caption: "Documents → hybrid search → cited answer" },
  habit: { color: "#a78bfa", caption: "Scheduled reminder → device confirms → retries stop" },
  plant: { color: "#a3e635", caption: "Leaf photo → disease class → confidence. Photo: PlantVillage dataset (Hughes & Salathé)." },
  animal: { color: "#fbbf24", caption: "Image → classifier → cat, dog or bird" },
  voice: { color: "#34d399", caption: "Speech → transcript → checked to-do list" },
};

function Scene({ kind, c }: { kind: BannerKind; c: string }) {
  const ink = "#e6ebf5";
  const dim = "rgba(230,235,245,0.28)";
  const faint = "rgba(230,235,245,0.12)";
  switch (kind) {
    case "docextract":
      return (
        <g>
          <g transform="translate(110 78) rotate(-2.5 114 113)">
            <rect x="6" y="8" width="228" height="226" rx="4" fill="#000" opacity="0.35" />
            <image href="/doc-extract/sample-cafe.jpg" width="228" height="226" preserveAspectRatio="xMidYMid slice" />
            {[[126, 14], [141.5, 14], [157.5, 15]].map(([y, h]) => (
              <rect key={y} x="12" y={y} width="204" height={h} rx="3" fill="none" stroke={c} strokeWidth="2" />
            ))}
          </g>
          <path d="M360 210 H430" stroke={c} strokeWidth="3" strokeDasharray="2 9" strokeLinecap="round" />
          <g transform="translate(445 80)">
            <rect width="300" height="250" rx="14" fill="#0a1024" stroke={c} strokeWidth="2" />
            <text x="24" y="42" fill={dim} fontSize="22" fontFamily="ui-monospace,monospace">{"{"}</text>
            {[
              ["vendor", "Harbour Cafe", 76],
              ["subtotal", "22.70", 108],
              ["tax", "1.82", 140],
              ["total", "24.52", 172],
            ].map(([k, v, y]) => (
              <g key={k as string}>
                <text x="44" y={y as number} fill={c} fontSize="17" fontFamily="ui-monospace,monospace">{k as string}:</text>
                <text x="140" y={y as number} fill={ink} fontSize="17" fontFamily="ui-monospace,monospace">{v as string}</text>
              </g>
            ))}
            <text x="24" y="216" fill={dim} fontSize="22" fontFamily="ui-monospace,monospace">{"}"}</text>
          </g>
          <path d="M770 210 H840" stroke={c} strokeWidth="3" strokeDasharray="2 9" strokeLinecap="round" />
          <g transform="translate(855 70)">
            <rect width="250" height="270" rx="16" fill="#101734" stroke={dim} strokeWidth="2" />
            <text x="24" y="40" fill={dim} fontSize="15" fontFamily="ui-monospace,monospace">ARITHMETIC CHECK</text>
            {[
              ["items = subtotal", true],
              ["subtotal + tax = total", true],
              ["line qty x price", true],
            ].map(([t, ok], i) => (
              <g key={t as string} transform={`translate(24 ${72 + i * 44})`}>
                <circle cx="11" cy="11" r="11" fill={c} opacity="0.2" />
                <path d="M5 11 l5 5 9-10" stroke={c} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <text x="34" y="17" fill={ink} fontSize="16" fontFamily="ui-sans-serif,system-ui">{t as string}</text>
              </g>
            ))}
            <rect x="24" y="214" width="202" height="34" rx="17" fill={c} opacity="0.16" stroke={c} />
            <text x="125" y="236" textAnchor="middle" fill={c} fontSize="14" fontWeight="700" fontFamily="ui-monospace,monospace">ALL CHECKS PASSED</text>
          </g>
        </g>
      );
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
            <clipPath id="pb-plant-clip">
              <rect width="320" height="320" rx="18" />
            </clipPath>
            <image href="/plant/tomato-early-blight.jpg" width="320" height="320" clipPath="url(#pb-plant-clip)" preserveAspectRatio="xMidYMid slice" />
            <rect width="320" height="320" rx="18" fill="none" stroke={c} strokeWidth="3" />
            <rect x="14" y="14" width="150" height="26" rx="13" fill="#0b1024" opacity="0.8" />
            <text x="26" y="32" fill={ink} fontSize="13" fontWeight="700" fontFamily="ui-monospace,monospace">LEAF PHOTO</text>
          </g>
          <path d="M495 210 H625" stroke={c} strokeWidth="3" strokeDasharray="2 9" strokeLinecap="round" />
          <g transform="translate(640 80)">
            <rect width="420" height="260" rx="16" fill="#101734" stroke={c} strokeWidth="2" />
            {[
              ["Early blight", 0.96],
              ["Late blight", 0.03],
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
    case "voice":
      return (
        <g>
          <g transform="translate(110 110)">
            <rect width="300" height="200" rx="16" fill="#101734" stroke={dim} strokeWidth="2" />
            {[20, 44, 70, 96, 70, 112, 60, 88, 40, 64, 28, 50, 22].map((h, k) => (
              <rect key={k} x={22 + k * 20} y={100 - h / 2} width="10" height={h} rx="5" fill={k > 3 && k < 9 ? c : dim} />
            ))}
            <text x="150" y="182" textAnchor="middle" fill={dim} fontSize="15" fontFamily="ui-monospace,monospace">0:20</text>
          </g>
          <path d="M435 210 H505" stroke={c} strokeWidth="3" strokeDasharray="2 9" strokeLinecap="round" />
          <g transform="translate(520 90)">
            <rect width="290" height="240" rx="16" fill="#0a1024" stroke={c} strokeWidth="2" />
            {[[24, 34, 220], [24, 62, 250], [24, 90, 180], [24, 118, 236], [24, 146, 140]].map(([x, y, w], k) => (
              <rect key={k} x={x} y={y} width={w} height="10" rx="5" fill={k === 1 ? c : dim} opacity={k === 1 ? 0.8 : 1} />
            ))}
            <text x="24" y="206" fill={dim} fontSize="14" fontFamily="ui-monospace,monospace">transcript</text>
          </g>
          <path d="M835 210 H895" stroke={c} strokeWidth="3" strokeDasharray="2 9" strokeLinecap="round" />
          <g transform="translate(910 100)">
            <rect width="200" height="220" rx="16" fill="#101734" stroke={c} strokeWidth="2" />
            {["Send invoice", "Book flights", "Renew domain"].map((t, k) => (
              <g key={t} transform={`translate(20 ${30 + k * 56})`}>
                <circle cx="11" cy="11" r="11" fill={c} opacity="0.2" />
                <path d="M5 11 l5 5 9-10" stroke={c} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <text x="34" y="17" fill={ink} fontSize="15" fontFamily="ui-sans-serif,system-ui">{t}</text>
              </g>
            ))}
          </g>
        </g>
      );
  }
}

const PHOTOS: Partial<Record<BannerKind, { src: string; width: number; height: number; alt: string; caption: string; bg?: string }>> = {
  plant: { src: "/plant/leaf-comparison.webp", width: 800, height: 534, alt: "A healthy green leaf next to a diseased leaf with yellow and brown spots", caption: "Healthy leaf and diseased leaf, side by side", bg: "linear-gradient(90deg, #e8e8f6, #ffffff)" },
  animal: { src: "/animal/cat-and-dog.webp", width: 858, height: 536, alt: "A small brown puppy facing an orange kitten", caption: "Cat or dog? The classifier decides" },
};

const CONCEPTS: Partial<Record<BannerKind, { src: string; alt: string }>> = {
  voice: { src: "/voice-to-tasks/banner.webp", alt: "Concept artwork: a man speaking to his laptop while floating cards show the recording, the summary and a to-do list produced from his words" },
  rag: { src: "/ask-your-files/banner.webp", alt: "Concept artwork: documents flowing through a retrieval pipeline into a chat window that answers a question with cited sources" },
};

export default function ProjectBanner({ kind }: { kind: BannerKind }) {
  const concept = CONCEPTS[kind];
  if (concept) {
    return (
      <figure className="projectBanner dxHeroImage">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={concept.src} width={1600} height={900} alt={concept.alt} decoding="async" />
        <figcaption>Concept artwork. The live demo below is the real thing.</figcaption>
      </figure>
    );
  }
  const photo = PHOTOS[kind];
  if (photo) {
    return (
      <figure className="projectBanner photoBanner" style={photo.bg ? { background: photo.bg } : undefined}>
        {!photo.bg && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="photoBackdrop" src={photo.src} alt="" aria-hidden="true" decoding="async" />
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="photoMain" src={photo.src} width={photo.width} height={photo.height} alt={photo.alt} decoding="async" />
        <figcaption>{photo.caption}</figcaption>
      </figure>
    );
  }
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
