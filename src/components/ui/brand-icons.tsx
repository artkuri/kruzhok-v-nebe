/**
 * Фирменные иконки и графические элементы «Кружок в небе»
 * Стиль: outline + мягкие формы, stroke без fill (если не указано иное)
 * Основной цвет: #36C5F0, акцент: #FFD93D / #A78BFA
 */

type IconProps = { className?: string; color?: string };
type ElementProps = { className?: string };

const BLUE   = "#36C5F0";
const YELLOW = "#FFD93D";
const PURPLE = "#A78BFA";

/* ─── Иконки (набор из бренд-бука) ─────────────────────────────── */

/** 🎨 Творчество — палитра */
export function IconPalette({ className, color = BLUE }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      <path d="M24 6C14 6 6 14 6 24c0 7 4 12 10 14 2 .7 3-.5 3-2v-3c-5.5 1.2-7-2.6-7-2.6-1-2.4-2.3-3-2.3-3-1.9-1.3.1-1.3.1-1.3 2.1.1 3.2 2.1 3.2 2.1 1.8 3.1 4.8 2.2 6 1.7.2-1.3.7-2.2 1.3-2.7-4.5-.5-9.2-2.2-9.2-9.9 0-2.2.8-4 2-5.4-.2-.5-.9-2.6.2-5.4 0 0 1.6-.5 5.4 2a18.5 18.5 0 0 1 10 0c3.7-2.5 5.3-2 5.3-2 1.1 2.8.4 4.9.2 5.4 1.3 1.4 2 3.2 2 5.4 0 7.7-4.7 9.4-9.2 9.9.7.6 1.4 1.9 1.4 3.8v5.6c0 1.5 1 2.7 3 2.2C38 36 42 31 42 24c0-10-8-18-18-18z"
        stroke={color} strokeWidth="2" fill="none"/>
      <circle cx="16" cy="26" r="2" fill={YELLOW}/>
      <circle cx="22" cy="18" r="2" fill={YELLOW}/>
      <circle cx="30" cy="18" r="2" fill={PURPLE}/>
      <circle cx="34" cy="26" r="2" fill={color}/>
    </svg>
  );
}

/** ⭐ Уверенность — звезда */
export function IconStar({ className, color = YELLOW }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      <path d="M24 6l4.5 13H42l-11 8 4.5 13L24 32l-11.5 8L17 27 6 19h13.5z"
        stroke={color} strokeWidth="2.5" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

/** 🧠 Развитие — мозг */
export function IconBrain({ className, color = PURPLE }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      <path d="M18 38h12M24 38v-6"
        stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M16 32c-5-2-8-7-8-13 0-7.7 7.2-14 16-14s16 6.3 16 14c0 6-3 11-8 13"
        stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M8 20c-2 0-2 4 0 4M40 20c2 0 2 4 0 4"
        stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M17 18c0-2 3-4 7-4s7 2 7 4"
        stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M15 26c1 2 4 3 9 3s8-1 9-3"
        stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

/** 👥 Друзья — люди */
export function IconPeople({ className, color = BLUE }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      <circle cx="18" cy="14" r="6" stroke={color} strokeWidth="2.5"/>
      <circle cx="30" cy="14" r="6" stroke={color} strokeWidth="2.5"/>
      <path d="M6 38c0-7 5-12 12-12h12c7 0 12 5 12 12"
        stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

/** ✈️ Воображение — самолётик */
export function IconAirplane({ className, color = BLUE }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      <polygon points="6,24 44,10 36,38" stroke={color} strokeWidth="2.5"
        strokeLinejoin="round" fill="none"/>
      <line x1="6" y1="24" x2="36" y2="38"
        stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <line x1="20" y1="28" x2="24" y2="40"
        stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

/** 🏆 Результат — кубок */
export function IconTrophy({ className, color = YELLOW }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      <path d="M16 8h16v18a8 8 0 0 1-16 0V8z"
        stroke={color} strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="M16 14H10a6 6 0 0 0 6 6M32 14h6a6 6 0 0 1-6 6"
        stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M24 34v6M16 40h16"
        stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

/** ❤️ Забота — сердце */
export function IconHeart({ className, color = "#F87171" }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      <path d="M24 40S8 30 8 18a9 9 0 0 1 16-5.7A9 9 0 0 1 40 18c0 12-16 22-16 22z"
        stroke={color} strokeWidth="2.5" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

/* ─── Графические элементы ──────────────────────────────────────── */

/** ☁️ Облако (мягкое) */
export function Cloud({ className }: ElementProps) {
  return (
    <svg viewBox="0 0 120 60" fill="white" className={className}>
      <circle cx="32" cy="42" r="22"/>
      <circle cx="58" cy="32" r="28"/>
      <circle cx="88" cy="40" r="20"/>
      <rect   x="10" y="42" width="100" height="18" rx="9"/>
    </svg>
  );
}

/** ☀️ Солнце с лучами */
export function Sun({ className }: ElementProps) {
  return (
    <svg viewBox="0 0 80 80" fill="none" className={className}>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <rect key={deg} x="36" y="4" width="8" height="16" rx="4"
          fill="#FFD93D" transform={`rotate(${deg} 40 40)`}/>
      ))}
      <circle cx="40" cy="40" r="18" fill="#FFD93D"/>
      <circle cx="40" cy="40" r="13" fill="#FFE680" opacity="0.55"/>
    </svg>
  );
}

/** ⭐ Звезда залитая */
export function StarFilled({ className, color = "#FFD93D" }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" className={className}>
      <polygon points="20,2 23,15 37,15 26,23 30,37 20,29 10,37 14,23 3,15 17,15"
        fill={color}/>
    </svg>
  );
}

/** ⭐ Звезда контурная */
export function StarOutline({ className, color = "#FFD93D" }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className}>
      <polygon points="20,2 23,15 37,15 26,23 30,37 20,29 10,37 14,23 3,15 17,15"
        stroke={color} strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  );
}

/** ✈️ Бумажный самолётик */
export function PaperPlane({ className }: ElementProps) {
  return (
    <svg viewBox="0 0 80 50" fill="none" className={className}>
      <polygon points="2,25 78,6 60,44" fill="white" opacity="0.95"/>
      <polygon points="2,25 60,44 30,30" fill="rgba(54,197,240,0.25)"/>
      <polygon points="30,30 60,44 44,54" fill="white" opacity="0.75"/>
      <line x1="1" y1="25" x2="60" y2="44" stroke="rgba(54,197,240,0.3)" strokeWidth="1"/>
    </svg>
  );
}

/** ➿ Пунктирная траектория */
export function DotTrail({ className }: ElementProps) {
  return (
    <svg viewBox="0 0 120 30" fill="none" className={className}>
      <path d="M5,25 Q40,5 115,10"
        stroke="#36C5F0" strokeWidth="2.5" strokeDasharray="7 6" strokeLinecap="round"/>
    </svg>
  );
}

/** ≋ Волнистая линия */
export function WavyLine({ className, color = BLUE }: IconProps) {
  return (
    <svg viewBox="0 0 120 20" fill="none" className={className}>
      <path d="M0,10 C20,2 40,18 60,10 S100,2 120,10"
        stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

/** Фоновый паттерн (повторяющиеся элементы) */
export function BrandPattern({ className }: ElementProps) {
  return (
    <svg viewBox="0 0 400 300" fill="none" className={className}>
      {/* Clouds */}
      <g opacity="0.18" fill="#36C5F0">
        <circle cx="40"  cy="40"  r="18"/><circle cx="62"  cy="30"  r="22"/><circle cx="86"  cy="40"  r="16"/>
        <rect   x="22"   y="40"   width="80" height="18" rx="9"/>
        <circle cx="280" cy="200" r="14"/><circle cx="298" cy="192" r="18"/><circle cx="318" cy="200" r="13"/>
        <rect   x="266"  y="200"  width="66" height="14" rx="7"/>
      </g>
      {/* Stars */}
      <polygon points="160,30 162,40 172,40 164,46 167,56 160,50 153,56 156,46 148,40 158,40"
        fill="#FFD93D" opacity="0.3"/>
      <polygon points="330,80 332,88 340,88 334,93 336,101 330,96 324,101 326,93 320,88 328,88"
        fill="#FFD93D" opacity="0.25"/>
      <polygon points="60,200 62,207 69,207 63,211 65,218 60,214 55,218 57,211 51,207 58,207"
        fill="#36C5F0" opacity="0.25"/>
      {/* Airplane */}
      <g opacity="0.2">
        <polygon points="200,150 270,132 255,170" fill="#36C5F0"/>
        <line x1="200" y1="150" x2="255" y2="170" stroke="#36C5F0" strokeWidth="1"/>
      </g>
      {/* Trail */}
      <path d="M190,155 Q230,138 265,135"
        stroke="#36C5F0" strokeWidth="1.5" strokeDasharray="5,5" opacity="0.2"/>
      {/* Wavy lines */}
      <path d="M0,250 C40,242 80,258 120,250 S200,242 240,250"
        stroke="#A78BFA" strokeWidth="1.5" opacity="0.15"/>
      <path d="M160,280 C190,272 220,288 250,280 S310,272 340,280"
        stroke="#36C5F0" strokeWidth="1.5" opacity="0.15"/>
    </svg>
  );
}
