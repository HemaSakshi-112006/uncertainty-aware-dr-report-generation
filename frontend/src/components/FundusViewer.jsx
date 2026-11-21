import React from "react";

/**
 * High-fidelity Retinal Fundus Scan Visualizer.
 * Displays either a realistic vector fundus scan (matching the user's reference screenshot)
 * or an uploaded user fundus image, with optional Grad-CAM++ saliency heatmap.
 */
function FundusViewer({
  variant = "moderate",
  customImageSrc = null,
  showGradCam = false,
  gradcamOverlay = null,
  className = "",
}) {
  if (customImageSrc) {
    return (
      <div className={`relative aspect-square w-full max-w-[270px] mx-auto rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-xl ${className}`}>
        <img
          src={customImageSrc}
          alt="Retinal fundus scan preview"
          className="w-full h-full object-cover"
        />
        {showGradCam && gradcamOverlay && (
  <img
    src={gradcamOverlay}
    alt="Grad-CAM heatmap overlay"
    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
  />
)}
      </div>
    );
  }

  const isHealthy = variant === "healthy";
  const isSevere = variant === "severe";

  return (
    <div className={`relative aspect-square w-full max-w-[270px] mx-auto rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-xl ${className}`}>
      <svg
        viewBox="0 0 240 240"
        className="w-full h-full select-none"
        role="img"
        aria-label="High-resolution retinal fundus scan"
      >
        <defs>
          {/* Fundus Radial Base Gradient */}
          <radialGradient id="analyzeFundusBg" cx="44%" cy="48%" r="52%">
            <stop offset="0%" stopColor="#db5d27" />
            <stop offset="48%" stopColor="#9a2f10" />
            <stop offset="82%" stopColor="#431205" />
            <stop offset="100%" stopColor="#080c14" />
          </radialGradient>

          {/* Optic Disc Radiance */}
          <radialGradient id="analyzeOpticDisc" cx="48%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef9c3" />
            <stop offset="55%" stopColor="#f59e0b" stopOpacity="0.9" />
            <stop offset="88%" stopColor="#d97706" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
          </radialGradient>

          {/* Physiological Cup Center */}
          <radialGradient id="physioCup" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="65%" stopColor="#fef08a" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>

          {/* Macula Lutea Shadow */}
          <radialGradient id="analyzeMacula" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1a0602" stopOpacity="0.75" />
            <stop offset="70%" stopColor="#1a0602" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#1a0602" stopOpacity="0" />
          </radialGradient>

          {/* Grad-CAM Heatmap Radial Flare */}
          <radialGradient id="analyzeGradCamHeatmap" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
            <stop offset="35%" stopColor="#f97316" stopOpacity="0.7" />
            <stop offset="65%" stopColor="#eab308" stopOpacity="0.45" />
            <stop offset="85%" stopColor="#10b981" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </radialGradient>

          {/* Circular aperture clip */}
          <clipPath id="fundusApertureClip">
            <circle cx="120" cy="120" r="108" />
          </clipPath>
        </defs>

        {/* Clipped Fundus Interior */}
        <g clipPath="url(#fundusApertureClip)">
          {/* Base retinal choroid tone */}
          <circle cx="120" cy="120" r="108" fill="url(#analyzeFundusBg)" />

          {/* Macular depression (temporal to disc) */}
          <ellipse cx="148" cy="124" rx="34" ry="30" fill="url(#analyzeMacula)" />

          {/* Foveal reflex pinpoint */}
          <circle cx="148" cy="124" r="1.8" fill="#fef08a" opacity="0.4" />

          {/* Optic Disc (nasal) */}
          <ellipse cx="76" cy="120" rx="20" ry="22" fill="url(#analyzeOpticDisc)" />
          <ellipse cx="76" cy="120" rx="10" ry="11" fill="url(#physioCup)" />

          {/* Retinal Vascular Arcades (Arterioles and Venules) */}
          <g fill="none" strokeLinecap="round" opacity="0.82">
            {/* Superotemporal Venous Trunk */}
            <path
              d="M76 120 Q98 70 148 66 T210 88"
              stroke="#380606"
              strokeWidth="3.2"
            />
            {/* Superotemporal Arteriole */}
            <path
              d="M76 120 Q102 76 154 74 T214 96"
              stroke="#590d0d"
              strokeWidth="2.1"
            />
            {/* Superotemporal Branches */}
            <path d="M118 78 Q138 88 160 102" stroke="#480a0a" strokeWidth="1.6" />
            <path d="M148 66 Q170 54 196 58" stroke="#480a0a" strokeWidth="1.5" />
            <path d="M172 74 Q190 82 208 94" stroke="#480a0a" strokeWidth="1.3" />

            {/* Inferotemporal Venous Trunk */}
            <path
              d="M76 120 Q100 168 150 172 T210 148"
              stroke="#380606"
              strokeWidth="3.2"
            />
            {/* Inferotemporal Arteriole */}
            <path
              d="M76 120 Q104 162 154 164 T212 140"
              stroke="#590d0d"
              strokeWidth="2.0"
            />
            {/* Inferotemporal Branches */}
            <path d="M120 160 Q142 150 164 140" stroke="#480a0a" strokeWidth="1.6" />
            <path d="M150 172 Q174 184 200 178" stroke="#480a0a" strokeWidth="1.5" />
            <path d="M174 164 Q194 154 212 144" stroke="#480a0a" strokeWidth="1.3" />

            {/* Nasal Arcades */}
            <path d="M76 120 Q52 92 32 82" stroke="#480a0a" strokeWidth="2.2" />
            <path d="M76 120 Q50 146 30 160" stroke="#480a0a" strokeWidth="2.2" />
            <path d="M76 120 Q48 118 26 120" stroke="#480a0a" strokeWidth="1.6" />
            <path d="M54 94 Q40 82 28 78" stroke="#480a0a" strokeWidth="1.3" />
          </g>

          {/* Pathology Lesions: Microaneurysms, Hemorrhages & Hard Exudates */}
          {!isHealthy && (
            <g id="pathologyLayer">
              {/* Microaneurysms (Deep Red Pinpoints) */}
              <circle cx="156" cy="98" r="2.2" fill="#300303" />
              <circle cx="166" cy="106" r="2.5" fill="#300303" />
              <circle cx="140" cy="94" r="2.0" fill="#300303" />
              <circle cx="180" cy="116" r="2.2" fill="#300303" />
              <circle cx="150" cy="146" r="2.4" fill="#300303" />
              <circle cx="164" cy="138" r="2.1" fill="#300303" />
              <circle cx="176" cy="148" r="2.3" fill="#300303" />
              <circle cx="132" cy="144" r="1.9" fill="#300303" />

              {/* Hard Exudates (Punctate Yellow Lipoprotein Deposits) */}
              <circle cx="161" cy="92" r="2.2" fill="#fef08a" opacity="0.95" />
              <circle cx="169" cy="100" r="1.9" fill="#fef08a" opacity="0.95" />
              <circle cx="174" cy="94" r="1.7" fill="#fef08a" opacity="0.9" />
              <circle cx="158" cy="104" r="1.6" fill="#fef08a" opacity="0.9" />
              <circle cx="184" cy="108" r="1.8" fill="#fde047" opacity="0.85" />
              <circle cx="154" cy="140" r="1.9" fill="#fef08a" opacity="0.9" />
              <circle cx="168" cy="146" r="1.8" fill="#fef08a" opacity="0.88" />

              {/* Dot-Blot Hemorrhages */}
              <ellipse cx="144" cy="108" rx="3.5" ry="2.2" fill="#280303" opacity="0.9" />
              <ellipse cx="178" cy="136" rx="4.0" ry="2.6" fill="#280303" opacity="0.9" />

              {isSevere && (
                <g id="severeLesions">
                  <ellipse cx="136" cy="80" rx="5" ry="3" fill="#250202" />
                  <ellipse cx="192" cy="120" rx="6" ry="3.5" fill="#250202" />
                  <ellipse cx="160" cy="162" rx="5.5" ry="3.2" fill="#250202" />
                  {/* Cotton Wool Spot (Axoplasmic Stasis) */}
                  <ellipse cx="138" cy="102" rx="4" ry="3" fill="#f8fafc" opacity="0.5" />
                  <ellipse cx="188" cy="140" rx="4.5" ry="3" fill="#f8fafc" opacity="0.45" />
                </g>
              )}
            </g>
          )}

          {/* Grad-CAM Saliency Overlay */}
          {showGradCam && !isHealthy && (
            <g className="transition-opacity duration-300">
              <circle cx="164" cy="100" r="48" fill="url(#analyzeGradCamHeatmap)" />
              <circle cx="152" cy="144" r="28" fill="url(#analyzeGradCamHeatmap)" opacity="0.75" />
            </g>
          )}
        </g>

        {/* Outer Fine Telemetry Ring */}
        <circle
          cx="120"
          cy="120"
          r="115"
          fill="none"
          stroke="#14b8a6"
          strokeOpacity="0.25"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
      </svg>
    </div>
  );
}

export default FundusViewer;
