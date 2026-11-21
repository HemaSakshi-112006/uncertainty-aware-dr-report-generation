/** Fundus scan card with Grad-CAM toggle — used inside LiveDemo. */
function LiveDemoFundusCard({ showGradCam, onToggleGradCam }) {
  return (
    <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 flex flex-col justify-between gap-4">
      <div className="flex items-center justify-between text-xs">
        <span className="font-mono text-slate-400">SCAN #APTOS-104 (OD)</span>
        <span className="px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30 font-mono text-[11px]">
          512×512 RGB
        </span>
      </div>

      {/* Fundus SVG */}
      <div className="relative aspect-square w-full max-w-[240px] mx-auto rounded-xl overflow-hidden bg-black border border-slate-800 shadow-inner">
        <svg viewBox="0 0 240 240" className="w-full h-full" role="img" aria-label="Retinal fundus scan with optional Grad-CAM heatmap overlay">
          <defs>
            <radialGradient id="demoFundusBg" cx="45%" cy="48%" r="50%">
              <stop offset="0%" stopColor="#d95b26" />
              <stop offset="58%" stopColor="#992b11" />
              <stop offset="90%" stopColor="#431006" />
              <stop offset="100%" stopColor="#090d16" />
            </radialGradient>
            <radialGradient id="demoDisc" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="gradCamOverlay" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.85" />
              <stop offset="40%" stopColor="#f59e0b" stopOpacity="0.62" />
              <stop offset="75%" stopColor="#10b981" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </radialGradient>
            <clipPath id="demoClip">
              <circle cx="120" cy="120" r="106" />
            </clipPath>
          </defs>
          <g clipPath="url(#demoClip)">
            <circle cx="120" cy="120" r="106" fill="url(#demoFundusBg)" />
            <circle cx="142" cy="122" r="28" fill="#1f0703" fillOpacity="0.55" />
            <circle cx="74" cy="118" r="20" fill="url(#demoDisc)" />
            <g fill="none" stroke="#450a0a" strokeLinecap="round" opacity="0.8">
              <path d="M74 118 Q95 72 144 68 T206 90" strokeWidth="2.8" />
              <path d="M74 118 Q98 166 146 170 T204 146" strokeWidth="2.8" />
              <path d="M115 80 Q136 90 156 102" strokeWidth="1.5" />
              <path d="M118 158 Q138 148 158 138" strokeWidth="1.5" />
              <path d="M74 118 Q50 92 32 82" strokeWidth="2" />
              <path d="M74 118 Q48 144 30 156" strokeWidth="2" />
            </g>
            <circle cx="154" cy="96" r="2.3" fill="#3b0707" />
            <circle cx="164" cy="104" r="2.6" fill="#3b0707" />
            <circle cx="159" cy="91" r="2" fill="#fef08a" opacity="0.88" />
            <circle cx="168" cy="98" r="1.8" fill="#fef08a" opacity="0.88" />
            <circle cx="148" cy="144" r="2.2" fill="#3b0707" />
            {showGradCam && (
              <g className="transition-opacity duration-300">
                <circle cx="158" cy="98" r="44" fill="url(#gradCamOverlay)" />
                <circle cx="148" cy="144" r="24" fill="url(#gradCamOverlay)" opacity="0.65" />
              </g>
            )}
          </g>
        </svg>
      </div>

      {/* Toggle */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-xs font-medium text-slate-300">Grad-CAM++ Overlay</span>
        <button
          type="button"
          role="switch"
          aria-checked={showGradCam}
          onClick={onToggleGradCam}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 ${
            showGradCam ? "bg-teal-500" : "bg-slate-700"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              showGradCam ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
}

export default LiveDemoFundusCard;
