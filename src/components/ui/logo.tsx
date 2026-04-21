/** Full logo: cloud blob + sun + text (for hero, docs, etc.) */
export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 145" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Cloud body — overlapping circles + base rect */}
      <circle cx="45"  cy="82" r="36" fill="#36C5F0" />
      <circle cx="90"  cy="64" r="44" fill="#36C5F0" />
      <circle cx="148" cy="54" r="50" fill="#36C5F0" />
      <circle cx="206" cy="64" r="42" fill="#36C5F0" />
      <circle cx="240" cy="80" r="30" fill="#36C5F0" />
      <rect   x="9"    y="82" width="261" height="57" rx="28" fill="#36C5F0" />

      {/* Sun rays */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <rect key={deg} x="286" y="18" width="9" height="20" rx="4.5"
          fill="#FFD93D" transform={`rotate(${deg} 291 56)`} />
      ))}
      {/* Sun circle */}
      <circle cx="291" cy="56" r="30" fill="#FFD93D" />
      <circle cx="291" cy="56" r="22" fill="#FFE680" opacity="0.45" />

      {/* Text: КРУЖОК */}
      <text
        x="138" y="93"
        textAnchor="middle"
        fill="white"
        style={{ fontFamily: "Comfortaa, sans-serif", fontWeight: 700, fontSize: 32 }}
      >
        КРУЖОК
      </text>
      {/* Text: В НЕБЕ */}
      <text
        x="138" y="128"
        textAnchor="middle"
        fill="white"
        style={{ fontFamily: "Comfortaa, sans-serif", fontWeight: 700, fontSize: 32 }}
      >
        В НЕБЕ
      </text>
    </svg>
  );
}

/** Icon mark — compact cloud+sun for header, favicon, avatar */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Rounded square bg */}
      <rect width="44" height="44" rx="12" fill="#36C5F0" />
      {/* Sun top-right */}
      <circle cx="37" cy="10" r="9"  fill="#FFD93D" />
      <circle cx="37" cy="10" r="6"  fill="#FFE680" opacity="0.5" />
      {/* White cloud */}
      <circle cx="13" cy="29" r="9"  fill="white" />
      <circle cx="22" cy="24" r="11" fill="white" />
      <circle cx="32" cy="28" r="8"  fill="white" />
      <rect   x="4"   y="29" width="36" height="12" rx="6" fill="white" />
    </svg>
  );
}
