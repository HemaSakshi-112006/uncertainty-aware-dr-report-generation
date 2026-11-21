/**
 * Animated retinal fundus SVG illustration used in the Hero section.
 * All animations are driven by CSS classes defined in src/index.css.
 */
function HeroRetinaIllustration() {
  return (
    <div className="relative flex items-center justify-center py-6 sm:py-10 hero-stagger-visual">
      {/* Ambient soft radial glow */}
      <div
        className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-teal-500/25 via-sky-500/15 to-amber-500/20 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Scanner container */}
      <div className="relative w-[300px] h-[300px] sm:w-[370px] sm:h-[370px] flex items-center justify-center">
        <svg
          viewBox="0 0 360 360"
          className="w-full h-full drop-shadow-2xl"
          role="img"
          aria-label="Animated AI retinal fundus scan showing optic disc, vascular arcades, and active laser scanning beam"
        >
          <defs>
            <radialGradient id="fundusCoreGrad" cx="46%" cy="48%" r="50%">
              <stop offset="0%" stopColor="#ea580c" />
              <stop offset="48%" stopColor="#9a3412" />
              <stop offset="82%" stopColor="#451a03" />
              <stop offset="100%" stopColor="#090d16" />
            </radialGradient>
            <radialGradient id="opticDiscGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef9c3" />
              <stop offset="55%" stopColor="#fbbf24" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="maculaGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1c0a00" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#1c0a00" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="laserBeamGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0" />
              <stop offset="50%" stopColor="#2dd4bf" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#5eead4" stopOpacity="0.95" />
            </linearGradient>
            <clipPath id="fundusCircleClip">
              <circle cx="180" cy="180" r="122" />
            </clipPath>
          </defs>

          {/* Outer HUD rings */}
          <circle cx="180" cy="180" r="170" fill="none" stroke="currentColor" strokeOpacity="0.14" strokeWidth="1" strokeDasharray="6 6" className="text-navy-900 dark:text-teal-300 animate-spin-slow" />
          <circle cx="180" cy="180" r="152" fill="none" stroke="#0d9488" strokeOpacity="0.32" strokeWidth="1.5" strokeDasharray="28 14 6 14" className="animate-spin-reverse" />

          {/* Cardinal crosshair ticks */}
          <g stroke="#0d9488" strokeOpacity="0.45" strokeWidth="1.5">
            <line x1="180" y1="14" x2="180" y2="26" />
            <line x1="180" y1="334" x2="180" y2="346" />
            <line x1="14" y1="180" x2="26" y2="180" />
            <line x1="334" y1="180" x2="346" y2="180" />
          </g>

          {/* Inner dark bezel */}
          <circle cx="180" cy="180" r="130" fill="#060f1e" stroke="#14b8a6" strokeOpacity="0.35" strokeWidth="1.5" />

          {/* Retinal fundus interior */}
          <g clipPath="url(#fundusCircleClip)">
            <circle cx="180" cy="180" r="122" fill="url(#fundusCoreGrad)" />
            <circle cx="204" cy="182" r="34" fill="url(#maculaGrad)" />
            <circle cx="126" cy="176" r="24" fill="url(#opticDiscGrad)" />

            {/* Vascular arcades */}
            <g fill="none" stroke="#450a0a" strokeLinecap="round" opacity="0.78">
              <path d="M126 176 Q148 124 202 118 T276 144" strokeWidth="3.2" />
              <path d="M168 134 Q192 142 214 156" strokeWidth="1.8" />
              <path d="M202 118 Q226 102 254 106" strokeWidth="1.7" />
              <path d="M126 176 Q152 232 206 238 T274 212" strokeWidth="3.2" />
              <path d="M172 222 Q195 212 218 202" strokeWidth="1.8" />
              <path d="M210 236 Q234 252 258 244" strokeWidth="1.6" />
              <path d="M126 176 Q98 144 74 132" strokeWidth="2.4" />
              <path d="M126 176 Q96 208 72 224" strokeWidth="2.4" />
            </g>

            {/* Grad-CAM hotspot */}
            <circle cx="226" cy="154" r="28" fill="#f59e0b" fillOpacity="0.28" />
            <circle cx="226" cy="154" r="14" fill="#ef4444" fillOpacity="0.35" />

            {/* Microaneurysm callout nodes */}
            <g>
              <circle cx="226" cy="154" r="4.5" fill="#fbbf24" stroke="#ffffff" strokeWidth="1.3" />
              <circle cx="226" cy="154" r="8" fill="none" stroke="#fbbf24" strokeWidth="1.2" className="animate-pulse-node" />
              <circle cx="196" cy="206" r="3.5" fill="#2dd4bf" stroke="#ffffff" strokeWidth="1.2" />
              <circle cx="196" cy="206" r="7" fill="none" stroke="#2dd4bf" strokeWidth="1.1" className="animate-pulse-node" />
            </g>

            {/* Animated laser scan line */}
            <g className="animate-scan-line">
              <rect x="54" y="156" width="252" height="24" fill="url(#laserBeamGrad)" />
              <line x1="54" y1="180" x2="306" y2="180" stroke="#5eead4" strokeWidth="2.2" />
            </g>
          </g>
        </svg>

        {/* Floating telemetry card — severity badge */}
        <div className="animate-float-1 absolute -top-2 -right-2 sm:top-3 sm:-right-7 bg-white/90 dark:bg-navy-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 rounded-2xl px-3.5 py-2.5 shadow-glass dark:shadow-glass-dark">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            ICDR Classification
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-amber-500/20" />
            <span className="text-sm font-bold text-amber-700 dark:text-amber-400">Moderate DR</span>
          </div>
        </div>

        {/* Floating telemetry card — confidence */}
        <div className="animate-float-2 absolute -bottom-2 -left-2 sm:bottom-4 sm:-left-8 bg-white/90 dark:bg-navy-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 rounded-2xl px-3.5 py-2.5 shadow-glass dark:shadow-glass-dark">
          <div className="flex items-center justify-between gap-4 mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Confidence
            </span>
            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200/70 dark:border-teal-800/60">
              2/2 CNN Match
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-lg font-bold text-slate-900 dark:text-white">68.0%</span>
            <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400">Review Tier</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroRetinaIllustration;
