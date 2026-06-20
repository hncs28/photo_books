import React from 'react';

export const STICKER_ASSETS = {
  netherlands_map: {
    name: 'Netherlands Map',
    render: () => (
      <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <path d="M25,20 C35,15 45,18 55,20 C60,21 70,15 75,25 C80,35 85,38 80,48 C75,58 78,65 72,75 C68,80 62,82 55,80 C48,78 40,85 30,82 C20,78 15,70 18,60 C20,50 15,40 20,30 Z" fill="#e2e8f0" stroke="#475569" strokeWidth="2" strokeLinejoin="round" />
        <path d="M58,40 L60,35 L62,40 L67,40 L63,43 L65,48 L60,45 L55,48 L57,43 L53,40 Z" fill="#ef4444" stroke="#b91c1c" strokeWidth="0.5" />
        <circle cx="60" cy="41" r="1.5" fill="white" />
      </svg>
    )
  },
  eiffel_tower: {
    name: 'Eiffel Tower',
    render: () => (
      <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <path d="M48,15 L52,15 L53,30 L55,55 L58,85 L42,85 L45,55 L47,30 Z" fill="none" stroke="#78350f" strokeWidth="2" />
        <path d="M43,85 C46,75 54,75 57,85" fill="none" stroke="#78350f" strokeWidth="2" />
        <line x1="46" y1="60" x2="54" y2="60" stroke="#78350f" strokeWidth="2" />
        <line x1="48" y1="40" x2="52" y2="40" stroke="#78350f" strokeWidth="2" />
        <line x1="49" y1="25" x2="51" y2="25" stroke="#78350f" strokeWidth="2" />
        <line x1="45" y1="85" x2="54" y2="60" stroke="#78350f" strokeWidth="1" />
        <line x1="55" y1="85" x2="46" y2="60" stroke="#78350f" strokeWidth="1" />
        <line x1="46" y1="60" x2="52" y2="40" stroke="#78350f" strokeWidth="1" />
        <line x1="54" y1="60" x2="48" y2="40" stroke="#78350f" strokeWidth="1" />
        <line x1="48" y1="40" x2="51" y2="25" stroke="#78350f" strokeWidth="1" />
        <line x1="52" y1="40" x2="49" y2="25" stroke="#78350f" strokeWidth="1" />
        <line x1="50" y1="15" x2="50" y2="5" stroke="#78350f" strokeWidth="2" />
      </svg>
    )
  },
  statue_of_liberty: {
    name: 'Statue of Liberty',
    render: () => (
      <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <path d="M30,85 L70,85 L65,75 L35,75 Z" fill="#94a3b8" />
        <path d="M42,75 L40,40 L45,35 L55,35 L58,45 L55,75 Z" fill="#a7f3d0" stroke="#047857" strokeWidth="1.5" />
        <path d="M38,42 L34,48 L35,54 L42,50 Z" fill="#a7f3d0" stroke="#047857" strokeWidth="1.5" />
        <path d="M30,45 L35,42 L38,48 L33,51 Z" fill="#a7f3d0" stroke="#047857" strokeWidth="1.5" />
        <path d="M53,35 L56,22 L53,20 L51,24 L52,35 Z" fill="#a7f3d0" stroke="#047857" strokeWidth="1.5" />
        <path d="M56,22 C59,18 56,12 55,10 C53,13 52,18 53,22 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
        <circle cx="48" cy="32" r="5" fill="#a7f3d0" stroke="#047857" strokeWidth="1.5" />
        <path d="M48,27 L48,23 M44,28 L40,25 M52,28 L56,25 M43,31 L39,30 M53,31 L57,30 M45,34 L41,35 M51,34 L55,35" stroke="#047857" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  },
  stacked_suitcases: {
    name: 'Suitcases',
    render: () => (
      <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(15, 60)">
          <rect width="70" height="22" rx="4" fill="#ec4899" stroke="#be185d" strokeWidth="1.5" />
          <rect x="15" y="0" width="8" height="22" fill="#be185d" />
          <rect x="47" y="0" width="8" height="22" fill="#be185d" />
          <path d="M30,0 C30,-5 40,-5 40,0" fill="none" stroke="#475569" strokeWidth="2.5" />
        </g>
        <g transform="translate(22, 40)">
          <rect width="56" height="20" rx="4" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" />
          <rect x="12" y="0" width="6" height="20" fill="#c2410c" />
          <rect x="38" y="0" width="6" height="20" fill="#c2410c" />
          <path d="M24,0 C24,-4 32,-4 32,0" fill="none" stroke="#475569" strokeWidth="2.5" />
        </g>
        <g transform="translate(30, 23)">
          <rect width="40" height="17" rx="3" fill="#facc15" stroke="#a16207" strokeWidth="1.5" />
          <circle cx="20" cy="8.5" r="3" fill="#a16207" />
          <path d="M16,0 C16,-4 24,-4 24,0" fill="none" stroke="#475569" strokeWidth="2.5" />
          <rect x="5" y="4" width="8" height="8" rx="1" fill="#3b82f6" transform="rotate(15 5 4)" />
          <circle cx="32" cy="10" r="3" fill="#10b981" />
        </g>
      </svg>
    )
  },
  kangaroo: {
    name: 'Kangaroo',
    render: () => (
      <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <path d="M15,75 C25,75 30,73 38,65 C43,60 40,55 38,50 C36,45 38,30 45,20 C48,15 55,10 58,12 C60,13 58,17 56,19 C61,16 66,15 68,18 C70,20 66,24 64,25 C62,26 58,26 57,28 C56,30 57,32 55,35 C52,40 50,42 52,46 C55,50 63,55 70,52 C75,50 82,54 85,58 C88,62 82,65 72,67 C65,68 55,70 50,75 C45,80 52,82 58,82 C62,82 45,88 35,88 C25,88 15,80 15,75 Z" fill="#9a3412" stroke="#7c2d12" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    )
  },
  frangipani_flower: {
    name: 'Frangipani Flower',
    render: () => (
      <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="frangipani-center" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#facc15" />
            <stop offset="70%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g transform="translate(50, 50)">
          {Array.from({ length: 5 }).map((_, i) => (
            <path 
              key={i}
              d="M0,0 C-15,-25 -25,-40 0,-45 C25,-40 15,-25 0,0" 
              fill="#ffffff" 
              stroke="#cbd5e1" 
              strokeWidth="1"
              transform={`rotate(${i * 72})`} 
            />
          ))}
          <circle cx="0" cy="0" r="18" fill="url(#frangipani-center)" />
        </g>
      </svg>
    )
  },
  elliptical_trainer: {
    name: 'Trainer',
    render: () => (
      <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <path d="M15,80 L85,80 M25,80 L25,75 M75,80 L75,75" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
        <circle cx="30" cy="70" r="12" fill="#94a3b8" stroke="#475569" strokeWidth="2.5" />
        <circle cx="30" cy="70" r="4" fill="#475569" />
        <line x1="30" y1="70" x2="65" y2="30" stroke="#475569" strokeWidth="3" />
        <rect x="62" y="22" width="8" height="8" rx="1" fill="#334155" />
        <path d="M65,30 C60,25 55,20 53,10 M65,30 C70,25 75,20 77,10" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="30" y1="62" x2="70" y2="70" stroke="#64748b" strokeWidth="2" />
        <rect x="45" y="66" width="16" height="5" rx="1" fill="#334155" />
        <line x1="30" y1="78" x2="65" y2="72" stroke="#64748b" strokeWidth="2" opacity="0.6" />
        <rect x="40" y="71" width="16" height="5" rx="1" fill="#334155" opacity="0.6" />
        <line x1="50" y1="68" x2="65" y2="25" stroke="#64748b" strokeWidth="2" />
        <line x1="45" y1="73" x2="62" y2="28" stroke="#64748b" strokeWidth="2" opacity="0.6" />
      </svg>
    )
  },
  floral_heart: {
    name: 'Floral Heart',
    render: () => (
      <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="heart-clip">
            <path d="M12,35 C12,15 38,8 50,28 C62,8 88,15 88,35 C88,60 50,85 50,85 C50,85 12,60 12,35 Z" />
          </clipPath>
        </defs>
        <g clipPath="url(#heart-clip)">
          <rect x="0" y="0" width="100%" height="100%" fill="#f472b6" />
          <circle cx="35" cy="30" r="15" fill="#facc15" />
          <circle cx="35" cy="30" r="5" fill="#ea580c" />
          <circle cx="65" cy="35" r="18" fill="#60a5fa" />
          <circle cx="65" cy="35" r="6" fill="#1e40af" />
          <circle cx="50" cy="60" r="14" fill="#34d399" />
          <circle cx="50" cy="60" r="4" fill="#065f46" />
          <circle cx="30" cy="55" r="12" fill="#fb7185" />
          <circle cx="30" cy="55" r="4" fill="#be185d" />
          <circle cx="70" cy="58" r="10" fill="#c084fc" />
          <circle cx="70" cy="58" r="3" fill="#6b21a8" />
          <circle cx="50" cy="20" r="6" fill="#ffffff" />
          <circle cx="50" cy="20" r="2" fill="#facc15" />
          <circle cx="50" cy="42" r="7" fill="#ffffff" />
          <circle cx="50" cy="42" r="2" fill="#facc15" />
        </g>
        <path d="M12,35 C12,15 38,8 50,28 C62,8 88,15 88,35 C88,60 50,85 50,85 C50,85 12,60 12,35 Z" fill="none" stroke="#be185d" strokeWidth="2.5" />
      </svg>
    )
  }
};
