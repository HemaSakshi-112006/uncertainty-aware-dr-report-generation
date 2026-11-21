import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useDarkMode } from "../context/DarkModeContext";
import "./Home.css";

/* ========================================================================
   DATA & CLINICAL CONFIGURATION
   ======================================================================== */
const DR_PROBABILITIES = [
  {
    grade: 0,
    label: "No DR",
    pct: 4.2,
    barColor: "bg-emerald-500",
    textColor: "text-emerald-700 dark:text-emerald-400",
    badgeBg:
      "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/60",
  },
  {
    grade: 1,
    label: "Mild DR",
    pct: 16.5,
    barColor: "bg-lime-500",
    textColor: "text-lime-700 dark:text-lime-400",
    badgeBg:
      "bg-lime-50 dark:bg-lime-950/60 border-lime-200 dark:border-lime-800/60",
  },
  {
    grade: 2,
    label: "Moderate DR",
    pct: 68.0,
    barColor: "bg-amber-500",
    textColor: "text-amber-700 dark:text-amber-400",
    badgeBg:
      "bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800/60",
    isPrimary: true,
  },
  {
    grade: 3,
    label: "Severe DR",
    pct: 9.4,
    barColor: "bg-orange-500",
    textColor: "text-orange-700 dark:text-orange-400",
    badgeBg:
      "bg-orange-50 dark:bg-orange-950/60 border-orange-200 dark:border-orange-800/60",
  },
  {
    grade: 4,
    label: "Proliferative DR",
    pct: 1.9,
    barColor: "bg-red-600",
    textColor: "text-red-700 dark:text-red-400",
    badgeBg:
      "bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-800/60",
  },
];

const PROMPT_TECHNIQUES = [
  {
    id: "zero-shot",
    name: "Zero-Shot",
    tag: "Fastest • 0.9s",
    shortDesc:
      "Direct clinical narrative synthesis from calibrated ResNet50 probabilities without contextual exemplars.",
    reportText:
      "SUMMARY: Dual-CNN screening classifies this right-eye fundus scan as Moderate Non-Proliferative Diabetic Retinopathy (Confidence: 68.0%, Model A & B concordant). Grad-CAM activation localizes to temporal parafoveal microaneurysms and dot-blot hemorrhages. RECOMMENDATION: Schedule dilated ophthalmology evaluation within 3–6 months and review HbA1c control.",
  },
  {
    id: "few-shot",
    name: "Few-Shot",
    tag: "Style-Aligned • 1.3s",
    shortDesc:
      "Anchors medical terminology and structure using curated specialist-authored reference reports.",
    reportText:
      "IMPRESSION: Moderate NPDR (ICDR Grade 2, 68.0% probability). FINDINGS: Scattered intraretinal hemorrhages and microaneurysms along the superotemporal vascular arcade; optic disc margins remain sharp with no neovascularization detected. PLAN: Routine ophthalmology follow-up in 3–6 months; consider macular OCT to exclude subtle edema.",
  },
  {
    id: "uncertainty-aware",
    name: "Uncertainty-Aware",
    tag: "Calibrated • 1.5s",
    shortDesc:
      "Explicitly quantifies confidence tiers and runner-up class overlap to flag borderline cases.",
    reportText:
      "TRIAGE TIER: Review Recommended (Top-1 Confidence: 68.0% Moderate DR vs. 16.5% Mild DR & 9.4% Severe DR). Because probability mass spans adjacent NPDR grades, automated staging carries moderate epistemic uncertainty. CLINICAL ACTION: Prioritize human specialist verification within 2–4 months to confirm 4-2-1 quadrant lesion counts.",
  },
  {
    id: "chain-of-verification",
    name: "Chain-of-Verification",
    tag: "Self-Audited • 2.4s",
    shortDesc:
      "Drafts findings, generates self-audit verification questions, and eliminates unsupported claims.",
    reportText:
      "VERIFIED SCREENING NOTE: [Check 1: Grade 2 (68.0%) exceeds proliferative threshold risk (1.9%) — Confirmed Non-Proliferative]. [Check 2: Grad-CAM saliency aligns with temporal macula rather than optic nerve head]. CONCLUSION: Moderate NPDR without high-risk proliferative markers. Recommend comprehensive dilated fundus exam within 3–6 months.",
  },
  {
    id: "evidence-grounded",
    name: "Evidence-Grounded",
    tag: "AAO Guideline • 1.9s",
    shortDesc:
      "Strictly binds every report statement to Grad-CAM saliency coordinates and AAO ICDR criteria.",
    reportText:
      "EVIDENCE-BOUND REPORT: Per AAO ICDR Preferred Practice Patterns, ResNet50 ensemble output (Grade 2: 68.0%) corresponds to Moderate NPDR—more advanced than microaneurysms alone (Grade 1: 16.5%) without meeting Severe NPDR criteria (Grade 3: 9.4%). Single-field 45° imaging cannot assess peripheral ischemia; refer for dilated exam in 3–6 months.",
  },
  {
    id: "self-consistency",
    name: "Self-Consistency",
    tag: "3x Consensus • 2.8s",
    shortDesc:
      "Samples three independent clinical reasoning trajectories and synthesizes the consensus report.",
    reportText:
      "CONSENSUS REPORT (3/3 Reasoning Paths Concordant): All three independent LLM reasoning passes converged on Moderate NPDR (68.0% ensemble confidence) with primary attention in the temporal macular arcade. Follow-up consensus: Ophthalmology consultation within 3–6 months alongside systemic glycemic and blood pressure optimization.",
  },
];

const FEATURES_DATA = [
  {
    title: "Dual-CNN Prediction & Agreement",
    desc: "Runs two independently trained ResNet50 backbones in parallel and displays an explicit concordance indicator to catch single-model drift.",
    badge: "Ensemble Verification",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
        <rect x="3" y="4" width="7" height="7" rx="1.5" />
        <rect x="14" y="4" width="7" height="7" rx="1.5" />
        <path d="M6.5 11v3a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-3" />
        <path d="M12 16v4m-3 0h6" />
      </svg>
    ),
  },
  {
    title: "Grad-CAM Heatmap Explainability",
    desc: "Visualizes spatial pixel attribution directly over the retinal fundus photograph so clinicians can verify microaneurysm and exudate focus.",
    badge: "Visual Saliency",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41" />
      </svg>
    ),
  },
  {
    title: "Six Prompting Techniques",
    desc: "Generate tailored clinical reports via Zero-Shot, Few-Shot, Uncertainty-Aware, Chain-of-Verification, Evidence-Grounded, and Self-Consistency.",
    badge: "Groq LPU Powered",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
        <path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" />
      </svg>
    ),
  },
  {
    title: "Cross-Technique Comparison",
    desc: "Inspect all six LLM report strategies side by side on the exact same fundus scan to evaluate clinical specificity, latency, and safety.",
    badge: "Research Lab",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
        <rect x="3" y="4" width="7" height="16" rx="1.5" />
        <rect x="14" y="4" width="7" height="16" rx="1.5" />
        <path d="M6.5 8h.01M6.5 12h.01M17.5 8h.01M17.5 12h.01" />
      </svg>
    ),
  },
  {
    title: "Calibrated Confidence Tiers",
    desc: "Automatically categorizes predictions into Reliable (≥80%), Review Recommended (65–79%), or Low Confidence (<65%) triage banners.",
    badge: "Safety Guardrails",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Downloadable Clinical PDF",
    desc: "Exports a clean, structured screening summary containing probability distributions, Grad-CAM snapshot, LLM narrative, and disclaimers.",
    badge: "EHR-Ready Export",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="M12 18v-6m-3 3l3 3 3-3" />
      </svg>
    ),
  },
];

const PLACEHOLDER_PAGES = {
  analyze: {
    title: "Analyze Workspace",
    subtitle:
      "Two-Stage Retinal Fundus Upload, Dual-CNN Inference & Report Generation",
    badge: "Route: /analyze",
    description:
      "In the full application, clinicians drag-and-drop a 45° retinal fundus photograph here. Model A & Model B (ResNet50) classify the image across all 5 ICDR grades in ~1 second, pinning the probability distribution and Grad-CAM overlay on screen while Groq synthesizes the selected clinical report.",
    highlights: [
      "Drag-and-drop PNG/JPG/TIFF validation with sample fundus presets",
      "Dual-ResNet50 agreement badge & 5-grade severity bars",
      "Interactive Grad-CAM heatmap toggle & PDF export",
    ],
  },
  compare: {
    title: "Compare — Prompt Engineering Research Lab",
    subtitle: "Side-by-Side Evaluation of Six Clinical Prompting Strategies",
    badge: "Route: /compare",
    description:
      "Runs a single retinal fundus prediction through all six prompting strategies simultaneously—comparing token latency, hallucination suppression, uncertainty calibration, and adherence to AAO Diabetic Retinopathy guidelines.",
    highlights: [
      "6 synchronized side-by-side clinical report cards",
      "Per-technique Groq LPU latency & verification badges",
      "Direct diffing of clinical follow-up recommendations",
    ],
  },
  about: {
    title: "About Model & Methodology",
    subtitle:
      "Model A & Model B ResNet50 Architecture, APTOS 2019 Training & Ethics",
    badge: "Route: /about",
    description:
      "Documents the end-to-end architecture: Ben Graham local average color preprocessing, stratified 5-fold training on 3,662 APTOS 2019 retinal scans, confusion matrices, and responsible AI guardrails.",
    highlights: [
      "Model A (84.6% Acc, 0.912 QWK) & Model B (83.9% Acc, 0.906 QWK)",
      "Full 5×5 holdout confusion matrix & per-class sensitivity",
      "Clinical limitations & human-in-the-loop screening protocol",
    ],
  },
  history: {
    title: "Screening Session History",
    subtitle: "Recent Retinal Fundus Evaluations & Audit Log",
    badge: "Route: /history",
    description:
      "Maintains a local audit trail of screened fundus scans with thumbnail previews, timestamps, predicted ICDR grades, confidence tiers, and the prompting technique used to generate each note.",
    highlights: [
      "Filterable log by DR severity grade & confidence tier",
      "One-click reload into Analyze or Compare views",
      "Zero-retention privacy-first session storage",
    ],
  },
};

/* ========================================================================
   REUSABLE SCROLL-REVEAL WRAPPER (IntersectionObserver)
   ======================================================================== */
function RevealOnScroll({ children, delay = 0, className = "" }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-7"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* ========================================================================
   HERO ANIMATED RETINAL FUNDUS SVG ILLUSTRATION
   ======================================================================== */
function HeroRetinaIllustration() {
  return (
    <div className="relative flex items-center justify-center py-6 sm:py-10 hero-stagger-visual">
      {/* Ambient Soft Radial Glow */}
      <div
        className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-teal-500/25 via-sky-500/15 to-amber-500/20 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Main Retinal Scanner Container */}
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

          {/* Outer HUD Telemetry Ring 1 */}
          <circle
            cx="180" cy="180" r="170"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.14"
            strokeWidth="1"
            strokeDasharray="6 6"
            className="text-navy-900 dark:text-teal-300 animate-spin-slow"
          />

          {/* Outer HUD Telemetry Ring 2 */}
          <circle
            cx="180" cy="180" r="152"
            fill="none"
            stroke="#0d9488"
            strokeOpacity="0.32"
            strokeWidth="1.5"
            strokeDasharray="28 14 6 14"
            className="animate-spin-reverse"
          />

          {/* Cardinal Crosshair Ticks */}
          <g stroke="#0d9488" strokeOpacity="0.45" strokeWidth="1.5">
            <line x1="180" y1="14" x2="180" y2="26" />
            <line x1="180" y1="334" x2="180" y2="346" />
            <line x1="14" y1="180" x2="26" y2="180" />
            <line x1="334" y1="180" x2="346" y2="180" />
          </g>

          {/* Inner Dark Bezel */}
          <circle cx="180" cy="180" r="130" fill="#060f1e" stroke="#14b8a6" strokeOpacity="0.35" strokeWidth="1.5" />

          {/* Retinal Fundus Interior (Clipped) */}
          <g clipPath="url(#fundusCircleClip)">
            <circle cx="180" cy="180" r="122" fill="url(#fundusCoreGrad)" />
            {/* Macular Region */}
            <circle cx="204" cy="182" r="34" fill="url(#maculaGrad)" />
            {/* Optic Disc (Nasal) */}
            <circle cx="126" cy="176" r="24" fill="url(#opticDiscGrad)" />

            {/* Retinal Vascular Arcades */}
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

            {/* Grad-CAM Hotspot Glow */}
            <circle cx="226" cy="154" r="28" fill="#f59e0b" fillOpacity="0.28" />
            <circle cx="226" cy="154" r="14" fill="#ef4444" fillOpacity="0.35" />

            {/* Detected Microaneurysm / Exudate Callout Nodes */}
            <g>
              <circle cx="226" cy="154" r="4.5" fill="#fbbf24" stroke="#ffffff" strokeWidth="1.3" />
              <circle cx="226" cy="154" r="8" fill="none" stroke="#fbbf24" strokeWidth="1.2" className="animate-pulse-node" />
              <circle cx="196" cy="206" r="3.5" fill="#2dd4bf" stroke="#ffffff" strokeWidth="1.2" />
              <circle cx="196" cy="206" r="7" fill="none" stroke="#2dd4bf" strokeWidth="1.1" className="animate-pulse-node" />
            </g>

            {/* Animated Laser Scanning Line + Trail */}
            <g className="animate-scan-line">
              <rect x="54" y="156" width="252" height="24" fill="url(#laserBeamGrad)" />
              <line x1="54" y1="180" x2="306" y2="180" stroke="#5eead4" strokeWidth="2.2" />
            </g>
          </g>
        </svg>

        {/* Floating Telemetry Card 1: Top-Right Severity Badge */}
        <div className="animate-float-1 absolute -top-2 -right-2 sm:top-3 sm:-right-7 bg-white/90 dark:bg-navy-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 rounded-2xl px-3.5 py-2.5 shadow-glass dark:shadow-glass-dark">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-1">
            ICDR Classification
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-amber-500/20"></span>
            <span className="text-sm font-bold text-amber-700 dark:text-amber-400">Moderate DR</span>
          </div>
        </div>

        {/* Floating Telemetry Card 2: Bottom-Left Confidence & Dual-CNN Concordance */}
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

/* ========================================================================
   PROCEDURAL RETINAL FUNDUS SVG FOR LIVE DEMO PREVIEW (WITH GRAD-CAM TOGGLE)
   ======================================================================== */
function LiveDemoFundusCard({ showGradCam, onToggleGradCam }) {
  return (
    <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 flex flex-col justify-between gap-4">
      <div className="flex items-center justify-between text-xs">
        <span className="font-mono text-slate-400">SCAN #APTOS-104 (OD)</span>
        <span className="px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30 font-mono text-[11px]">
          512×512 RGB
        </span>
      </div>

      {/* Fundus Visualization */}
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
            {/* Macula */}
            <circle cx="142" cy="122" r="28" fill="#1f0703" fillOpacity="0.55" />
            {/* Optic Disc */}
            <circle cx="74" cy="118" r="20" fill="url(#demoDisc)" />

            {/* Vessels */}
            <g fill="none" stroke="#450a0a" strokeLinecap="round" opacity="0.8">
              <path d="M74 118 Q95 72 144 68 T206 90" strokeWidth="2.8" />
              <path d="M74 118 Q98 166 146 170 T204 146" strokeWidth="2.8" />
              <path d="M115 80 Q136 90 156 102" strokeWidth="1.5" />
              <path d="M118 158 Q138 148 158 138" strokeWidth="1.5" />
              <path d="M74 118 Q50 92 32 82" strokeWidth="2" />
              <path d="M74 118 Q48 144 30 156" strokeWidth="2" />
            </g>

            {/* Microaneurysms & Hard Exudates */}
            <circle cx="154" cy="96" r="2.3" fill="#3b0707" />
            <circle cx="164" cy="104" r="2.6" fill="#3b0707" />
            <circle cx="159" cy="91" r="2" fill="#fef08a" opacity="0.88" />
            <circle cx="168" cy="98" r="1.8" fill="#fef08a" opacity="0.88" />
            <circle cx="148" cy="144" r="2.2" fill="#3b0707" />

            {/* Toggleable Grad-CAM Heatmap Overlay */}
            {showGradCam && (
              <g className="transition-opacity duration-300">
                <circle cx="158" cy="98" r="44" fill="url(#gradCamOverlay)" />
                <circle cx="148" cy="144" r="24" fill="url(#gradCamOverlay)" opacity="0.65" />
              </g>
            )}
          </g>
        </svg>
      </div>

      {/* Grad-CAM Toggle Control */}
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

/* ========================================================================
   MAIN HOME PAGE COMPONENT
   ======================================================================== */
function Home() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePlaceholderModal, setActivePlaceholderModal] = useState(null);

  // Interactive How It Works Step State
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);

  // Live Demo Preview States
  const [showGradCam, setShowGradCam] = useState(true);
  const [selectedTechId, setSelectedTechId] = useState("chain-of-verification");
  const [typedReport, setTypedReport] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [barsAnimated, setBarsAnimated] = useState(false);
  const demoSectionRef = useRef(null);

  // Trigger probability bar animation when Live Demo enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setBarsAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (demoSectionRef.current) observer.observe(demoSectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Typewriter Effect for Live Demo Clinical Report
  useEffect(() => {
    const tech =
      PROMPT_TECHNIQUES.find((t) => t.id === selectedTechId) ||
      PROMPT_TECHNIQUES[0];
    const fullText = tech.reportText;
    setTypedReport("");
    setIsTyping(true);

    let index = 0;
    const interval = setInterval(() => {
      index += 3;
      if (index >= fullText.length) {
        setTypedReport(fullText);
        setIsTyping(false);
        clearInterval(interval);
      } else {
        setTypedReport(fullText.slice(0, index));
      }
    }, 16);

    return () => clearInterval(interval);
  }, [selectedTechId]);

  const replayTypewriter = () => {
    const current = selectedTechId;
    setSelectedTechId("");
    setTimeout(() => setSelectedTechId(current), 20);
  };

  const handleSelectTechniqueFromShowcase = (techId) => {
    setSelectedTechId(techId);
    const el = document.getElementById("live-demo-section");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const activeTechniqueObj =
    PROMPT_TECHNIQUES.find((t) => t.id === selectedTechId) ||
    PROMPT_TECHNIQUES[3];

  const workflowSteps = [
    {
      num: "01",
      title: "Upload Fundus Scan",
      desc: "Drop a 45° macula-centered retinal fundus image (PNG, JPG, or TIFF). Automated quality gates verify framing and illumination.",
      detail: "Input: 512×512 RGB • Ben Graham Color Normalized",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      ),
    },
    {
      num: "02",
      title: "CNN Prediction",
      desc: "Two ResNet50 architectures classify the scan across 5 ICDR stages, returning calibrated probabilities, agreement score, and Grad-CAM heatmaps.",
      detail: "Latency: ~1.0s • Dual-ResNet50 Ensemble",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
        </svg>
      ),
    },
    {
      num: "03",
      title: "LLM Report",
      desc: "Groq LPU inference converts the CNN probability vector into a structured screening note using your chosen prompting strategy.",
      detail: "Latency: ~1.5–2.8s • Schema-Grounded NLG",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
    },
    {
      num: "04",
      title: "Compare Techniques",
      desc: "Evaluate all six prompting paradigms side by side to audit uncertainty hedging, guideline adherence, and clinical clarity.",
      detail: "6 Strategies • Side-by-Side Research Lab",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-navy-950 dark:text-slate-100 antialiased selection:bg-teal-500/20 selection:text-teal-700 dark:selection:text-teal-300 transition-colors duration-300 bg-clinical-grid">
      {/* ==================================================================
          STICKY BLURRED GLASSMORPHISM NAVBAR
          ================================================================== */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/80 dark:bg-navy-950/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-navy-900 to-teal-600 dark:from-teal-500 dark:to-navy-850 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-navy-900 dark:text-white leading-none">
                RetinaScan <span className="text-teal-600 dark:text-teal-400">AI</span>
              </span>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                Ophthalmic DR Triage
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Primary Navigation">
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="px-3.5 py-2 rounded-lg text-sm font-semibold bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300"
            >
              Home
            </a>
            {["Analyze", "Compare", "History"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setActivePlaceholderModal(item.toLowerCase())}
                className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-navy-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-colors"
              >
                {item}
              </button>
            ))}
          </nav>

          {/* Right Actions: Dark Mode Toggle + CTA */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-navy-900/80 text-slate-600 dark:text-slate-300 hover:border-teal-500 dark:hover:border-teal-400 hover:text-teal-600 dark:hover:text-teal-300 transition-all"
            >
              {darkMode ? (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActivePlaceholderModal("analyze")}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-navy-900 hover:bg-navy-850 dark:bg-teal-500 dark:hover:bg-teal-400 text-white dark:text-navy-950 shadow-sm transition-all hover:-translate-y-0.5"
            >
              <span>Start Analysis</span>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-label="Toggle navigation menu"
              className="md:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileMenuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-navy-950/95 backdrop-blur-xl px-4 py-3 space-y-1">
            <a
              href="#top"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300"
            >
              Home
            </a>
            {["Analyze", "Compare", "History"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setActivePlaceholderModal(item.toLowerCase());
                }}
                className="w-full text-left block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ==================================================================
          MAIN CONTENT (ALL SECTIONS IN EXACT ORDER)
          ================================================================== */}
      <main id="top" className="flex-1">
        {/* ----------------------------------------------------------------
            SECTION 1: HERO
            ---------------------------------------------------------------- */}
        <section className="relative overflow-hidden pt-10 pb-16 sm:pt-16 sm:pb-24">
          {/* Soft Top Gradient Wash */}
          <div
            className="absolute inset-x-0 -top-24 h-[520px] bg-gradient-to-b from-teal-500/10 via-sky-500/5 to-transparent dark:from-teal-500/15 dark:via-navy-900/40 pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Column: Staggered Headline, Subtext & CTAs */}
              <div className="lg:col-span-7 space-y-6">
                <div className="hero-stagger-1 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-navy-900/90 border border-teal-200/80 dark:border-teal-800/70 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                  <span className="text-xs font-semibold tracking-wide text-teal-800 dark:text-teal-300">
                    Dual-CNN Vision + Groq LPU Clinical Reporting
                  </span>
                </div>

                <h1 className="hero-stagger-2 text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold tracking-tight text-navy-900 dark:text-white leading-[1.1]">
                  Early Diabetic Retinopathy screening,{" "}
                  <span className="bg-gradient-to-r from-teal-600 to-sky-600 dark:from-teal-400 dark:to-sky-400 bg-clip-text text-transparent">
                    explained with clinical precision.
                  </span>
                </h1>

                <p className="hero-stagger-3 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                  Upload a retinal fundus scan for dual-ResNet50 5-stage grading, Grad-CAM visual attribution, and structured clinical reports synthesized across six verified prompting techniques.
                </p>

                <div className="hero-stagger-4 flex flex-wrap items-center gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => setActivePlaceholderModal("analyze")}
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-base font-semibold bg-gradient-to-r from-navy-900 to-navy-850 hover:from-teal-700 hover:to-teal-600 dark:from-teal-500 dark:to-teal-400 dark:hover:from-teal-400 dark:hover:to-teal-300 text-white dark:text-navy-950 shadow-lg shadow-navy-900/15 dark:shadow-teal-500/20 transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <span>Start Analysis</span>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>

                  <a
                    href="#live-demo-section"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold bg-white/90 dark:bg-navy-900/90 hover:bg-white dark:hover:bg-navy-850 text-navy-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <svg className="w-5 h-5 text-teal-600 dark:text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    <span>View Sample Result</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Animated Retina-Style Illustration */}
              <div className="lg:col-span-5">
                <HeroRetinaIllustration />
              </div>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------------
            SECTION 2: TRUST STRIP
            ---------------------------------------------------------------- */}
        <section aria-label="Platform Capabilities" className="border-y border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-navy-900/50 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-center sm:text-left">
              {[
                { value: "5 DR Stages", label: "ICDR Clinical Scale (0–4)" },
                { value: "2 CNN Models", label: "ResNet50 Dual Ensemble" },
                { value: "6 Techniques", label: "Prompt Engineering Suite" },
                { value: "APTOS 2019", label: "3,662 Graded Fundus Scans" },
                { value: "Groq LPU", label: "Sub-3s Structured Reports" },
              ].map((stat, idx) => (
                <div
                  key={stat.value}
                  className={`flex flex-col justify-center ${idx === 4 ? "col-span-2 sm:col-span-1" : ""}`}
                >
                  <span className="font-mono text-lg sm:text-xl font-bold text-navy-900 dark:text-white">
                    {stat.value}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------------
            SECTION 3: PROBLEM SECTION ("WHY EARLY DR DETECTION MATTERS")
            ---------------------------------------------------------------- */}
        <section className="py-20 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll className="max-w-3xl mx-auto text-center mb-14">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-3">
                Clinical Urgency
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-navy-900 dark:text-white">
                Why early Diabetic Retinopathy detection matters
              </h2>
              <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300">
                Timely retinal screening prevents over 90% of severe vision loss—yet subtle early lesions frequently go unnoticed until irreversible damage occurs.
              </p>
            </RevealOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              {[
                {
                  title: "Silent Asymptomatic Progression",
                  desc: "Early microaneurysms and intraretinal hemorrhages rarely affect central visual acuity. Patients often notice blurred vision only after proliferative neovascularization or macular edema develops.",
                  stat: "90%+ Preventable",
                  icon: (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                      <line x1="3" y1="3" x2="21" y2="21" />
                    </svg>
                  ),
                },
                {
                  title: "Leading Cause of Working-Age Blindness",
                  desc: "Diabetic Retinopathy remains the primary cause of preventable blindness among working-age adults globally, impacting over 100 million people living with diabetes.",
                  stat: "1 in 3 Diabetics Affected",
                  icon: (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  ),
                },
                {
                  title: "Ophthalmology Triage Bottlenecks",
                  desc: "Primary care clinics capture thousands of retinal images, but specialist shortages delay grading. Explainable AI triage prioritizes high-risk Moderate-to-Proliferative cases immediately.",
                  stat: "Rapid Triage Support",
                  icon: (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  ),
                },
              ].map((item, idx) => (
                <RevealOnScroll key={item.title} delay={idx * 110}>
                  <div className="h-full bg-white/80 dark:bg-navy-900/75 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-2xl p-7 shadow-glass dark:shadow-glass-dark hover:border-teal-500/60 dark:hover:border-teal-400/50 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 border border-teal-200/70 dark:border-teal-800/60 flex items-center justify-center mb-5">
                        {item.icon}
                      </div>
                      <h3 className="text-xl font-bold text-navy-900 dark:text-white mb-3">
                        {item.title}
                      </h3>
                      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-teal-700 dark:text-teal-300">
                        {item.stat}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-teal-500/60"></span>
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------------
            SECTION 4: HOW IT WORKS (4-STEP ANIMATED TIMELINE)
            ---------------------------------------------------------------- */}
        <section className="py-20 sm:py-24 bg-slate-100/70 dark:bg-navy-900/40 border-y border-slate-200/70 dark:border-slate-800/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll className="max-w-3xl mx-auto text-center mb-14">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-3">
                End-to-End Architecture
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-navy-900 dark:text-white">
                How RetinaScan AI works
              </h2>
              <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300">
                A decoupled two-stage pipeline separates calibrated computer vision grading from controllable clinical language generation.
              </p>
            </RevealOnScroll>

            {/* 4-Step Interactive Timeline */}
            <div className="relative">
              {/* Desktop Animated Progress Connector Line */}
              <div className="hidden lg:block absolute top-11 left-[12%] right-[12%] h-0.5 bg-slate-200 dark:bg-slate-800" aria-hidden="true">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-sky-500 transition-all duration-500"
                  style={{ width: `${(activeWorkflowStep / 3) * 100}%` }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {workflowSteps.map((step, idx) => {
                  const isSelected = activeWorkflowStep === idx;
                  return (
                    <RevealOnScroll key={step.num} delay={idx * 100}>
                      <button
                        type="button"
                        onClick={() => setActiveWorkflowStep(idx)}
                        onMouseEnter={() => setActiveWorkflowStep(idx)}
                        className={`w-full h-full text-left relative rounded-2xl p-6 border transition-all duration-300 flex flex-col justify-between ${
                          isSelected
                            ? "bg-white dark:bg-navy-900 border-teal-500 shadow-glass dark:shadow-glass-dark -translate-y-1"
                            : "bg-white/70 dark:bg-navy-900/50 border-slate-200/80 dark:border-slate-800 hover:border-teal-400/60"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-5">
                            <div
                              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                                isSelected
                                  ? "bg-teal-600 text-white shadow-md shadow-teal-600/25"
                                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                              }`}
                            >
                              {step.icon}
                            </div>
                            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              STEP {step.num}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-2">
                            {step.title}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                            {step.desc}
                          </p>
                        </div>

                        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                          <span className="font-mono text-[11px] font-medium text-teal-700 dark:text-teal-400">
                            {step.detail}
                          </span>
                        </div>
                      </button>
                    </RevealOnScroll>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------------
            SECTION 5: LIVE DEMO PREVIEW
            ---------------------------------------------------------------- */}
        <section id="live-demo-section" ref={demoSectionRef} className="py-20 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll className="max-w-3xl mx-auto text-center mb-12">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-3">
                Interactive Diagnostic Sandbox
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-navy-900 dark:text-white">
                Live screening output preview
              </h2>
              <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300">
                Toggle the Grad-CAM heatmap overlay and switch between all six prompting techniques to watch the clinical screening report synthesize in real time.
              </p>
            </RevealOnScroll>

            <RevealOnScroll>
              <div className="bg-white/90 dark:bg-navy-900/85 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 sm:p-8 shadow-glass dark:shadow-glass-dark">
                {/* Top Window Chrome Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-slate-200/80 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5" aria-hidden="true">
                      <span className="w-3 h-3 rounded-full bg-rose-400"></span>
                      <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                      <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                    </div>
                    <span className="font-mono text-xs font-semibold text-slate-500 dark:text-slate-400">
                      RetinaScan Clinical Workstation • Sample Case #APTOS-104
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/70">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      Primary: Moderate DR (68.0%)
                    </span>
                    <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/70">
                      Dual-CNN Concordant
                    </span>
                  </div>
                </div>

                {/* 3-Column Interactive Preview Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-stretch">
                  {/* Col 1: Fundus Scan + Grad-CAM Toggle */}
                  <div className="lg:col-span-4">
                    <LiveDemoFundusCard
                      showGradCam={showGradCam}
                      onToggleGradCam={() => setShowGradCam((v) => !v)}
                    />
                  </div>

                  {/* Col 2: 5-Stage Severity Probability Bars */}
                  <div className="lg:col-span-4 flex flex-col justify-between bg-slate-50/90 dark:bg-navy-950/60 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-navy-900 dark:text-white">
                          5-Stage ICDR Probabilities
                        </h3>
                        <span className="font-mono text-[11px] text-slate-400">ResNet50</span>
                      </div>

                      <div className="space-y-3.5">
                        {DR_PROBABILITIES.map((item) => (
                          <div key={item.grade} className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className={`font-semibold ${item.textColor}`}>
                                Grade {item.grade}: {item.label}
                              </span>
                              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                                {item.pct.toFixed(1)}%
                              </span>
                            </div>
                            <div
                              className="w-full h-2.5 rounded-full bg-slate-200/90 dark:bg-slate-800 overflow-hidden"
                              role="progressbar"
                              aria-valuenow={item.pct}
                              aria-valuemin="0"
                              aria-valuemax="100"
                              aria-label={`${item.label} probability`}
                            >
                              <div
                                className={`h-full rounded-full ${item.barColor} transition-all duration-1000 ease-out`}
                                style={{ width: barsAnimated ? `${item.pct}%` : "0%" }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 pt-3.5 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400">Confidence Tier:</span>
                      <span className="font-semibold text-amber-700 dark:text-amber-400">
                        Review Recommended (65–79%)
                      </span>
                    </div>
                  </div>

                  {/* Col 3: Typing Clinical LLM Report Snippet */}
                  <div className="lg:col-span-4 flex flex-col justify-between bg-slate-50/90 dark:bg-navy-950/60 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                          Groq Clinical Report
                        </span>
                        <button
                          type="button"
                          onClick={replayTypewriter}
                          className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-300 transition-colors"
                          title="Replay typing animation"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                            <path d="M3 3v5h5" />
                          </svg>
                          Replay
                        </button>
                      </div>

                      {/* Technique Pill Selector */}
                      <div className="flex flex-wrap gap-1.5 mb-4" role="tablist" aria-label="Select prompting technique">
                        {PROMPT_TECHNIQUES.map((t) => {
                          const active = t.id === selectedTechId;
                          return (
                            <button
                              key={t.id}
                              type="button"
                              role="tab"
                              aria-selected={active}
                              onClick={() => setSelectedTechId(t.id)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                                active
                                  ? "bg-teal-600 text-white shadow-xs"
                                  : "bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-teal-400"
                              }`}
                            >
                              {t.name}
                            </button>
                          );
                        })}
                      </div>

                      {/* Live Typing Report Box */}
                      <div
                        className="min-h-[168px] rounded-xl bg-white dark:bg-navy-900/90 border border-slate-200/80 dark:border-slate-800 p-3.5 text-xs sm:text-[13px] text-slate-700 dark:text-slate-200 leading-relaxed font-normal"
                        aria-live="polite"
                      >
                        {typedReport}
                        {isTyping && <span className="typing-cursor" aria-hidden="true"></span>}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>
                        Strategy: <strong>{activeTechniqueObj.name}</strong>
                      </span>
                      <span className="font-mono text-teal-700 dark:text-teal-400">{activeTechniqueObj.tag}</span>
                    </div>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* ----------------------------------------------------------------
            SECTION 6: FEATURES GRID (6 GLASSMORPHISM CARDS)
            ---------------------------------------------------------------- */}
        <section className="py-20 sm:py-24 bg-slate-100/70 dark:bg-navy-900/40 border-y border-slate-200/70 dark:border-slate-800/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll className="max-w-3xl mx-auto text-center mb-14">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-3">
                Clinical Feature Suite
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-navy-900 dark:text-white">
                Engineered for clinical trust &amp; transparency
              </h2>
              <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300">
                Every prediction pairs visual explainability with calibrated confidence guardrails and structured medical reporting.
              </p>
            </RevealOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES_DATA.map((feat, idx) => (
                <RevealOnScroll key={feat.title} delay={idx * 80}>
                  <div className="h-full bg-white/85 dark:bg-navy-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-glass dark:shadow-glass-dark hover:border-teal-500/60 dark:hover:border-teal-400/50 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-11 h-11 rounded-xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 border border-teal-200/70 dark:border-teal-800/60 flex items-center justify-center">
                          {feat.icon}
                        </div>
                        <span className="font-mono text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {feat.badge}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-2">
                        {feat.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {feat.desc}
                      </p>
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------------
            SECTION 7: TECHNIQUE SHOWCASE (6 PROMPTING CARDS)
            ---------------------------------------------------------------- */}
        <section className="py-20 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll className="max-w-3xl mx-auto text-center mb-14">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-3">
                Controllable Medical NLG
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-navy-900 dark:text-white">
                Six prompting techniques, one clinical standard
              </h2>
              <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300">
                Select any prompting strategy below to test how it formats clinical findings and mitigates LLM hallucination in the live preview above.
              </p>
            </RevealOnScroll>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {PROMPT_TECHNIQUES.map((tech, idx) => (
                <RevealOnScroll key={tech.id} delay={idx * 70}>
                  <button
                    type="button"
                    onClick={() => handleSelectTechniqueFromShowcase(tech.id)}
                    className="w-full h-full text-left group bg-white/85 dark:bg-navy-900/75 backdrop-blur-md border border-slate-200/85 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:shadow-glass dark:hover:shadow-glass-dark hover:border-teal-500 dark:hover:border-teal-400 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <h3 className="text-base font-bold text-navy-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                          {tech.name}
                        </h3>
                        <span className="font-mono text-[11px] font-medium px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60">
                          {tech.tag}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {tech.shortDesc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-teal-600 dark:text-teal-400">
                      <span>Preview in Live Demo</span>
                      <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                    </div>
                  </button>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------------
            SECTION 8: HONEST ACCURACY SECTION ("BUILT WITH TRANSPARENCY")
            ---------------------------------------------------------------- */}
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="bg-white/90 dark:bg-navy-900/85 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 rounded-3xl p-7 sm:p-10 shadow-glass dark:shadow-glass-dark">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Left Explanation */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border border-sky-200/80 dark:border-sky-800/60 text-xs font-semibold">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                      </svg>
                      Built with Clinical Transparency
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 dark:text-white">
                      Honest validation metrics &amp; known model boundaries
                    </h2>

                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                      Evaluated on a stratified holdout split of the{" "}
                      <strong>APTOS 2019 Blindness Detection</strong> cohort, our dual-ResNet50 ensemble achieves strong ordinal agreement—while openly surfacing uncertainty when image quality or borderline pathology warrants specialist review.
                    </p>

                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                      <li className="flex items-start gap-2.5">
                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0"></span>
                        <span>
                          <strong>2D Photography Scope:</strong> Single-field fundus scans cannot directly measure retinal thickening; OCT is required to confirm Diabetic Macular Edema.
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0"></span>
                        <span>
                          <strong>Decision-Support Role:</strong> RetinaScan AI is strictly an assistive screening tool and never replaces a comprehensive dilated eye exam by a licensed clinician.
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* Right Validation Scorecards */}
                  <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                    {[
                      { label: "Model A Top-1 Acc.", value: "84.6%", sub: "ResNet50 Backbone" },
                      { label: "Model B Top-1 Acc.", value: "83.9%", sub: "ResNet50 Diverse Seed" },
                      { label: "Quadratic Weighted κ", value: "0.912", sub: "Inter-Rater Agreement" },
                      { label: "Referable DR Recall", value: "92.4%", sub: "Grades 2–4 Sensitivity" },
                    ].map((m) => (
                      <div
                        key={m.label}
                        className="bg-slate-50 dark:bg-navy-950/70 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4"
                      >
                        <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          {m.label}
                        </div>
                        <div className="font-mono text-2xl font-bold text-navy-900 dark:text-white mt-1">
                          {m.value}
                        </div>
                        <div className="text-[11px] font-medium text-teal-700 dark:text-teal-400 mt-1">
                          {m.sub}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* ----------------------------------------------------------------
            SECTION 9: FINAL CALL-TO-ACTION BANNER
            ---------------------------------------------------------------- */}
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-950 via-navy-900 to-teal-900 px-6 py-12 sm:px-12 sm:py-16 text-center text-white shadow-xl">
                {/* Decorative Radial Glow */}
                <div
                  className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-teal-400/20 blur-3xl pointer-events-none"
                  aria-hidden="true"
                />
                <div
                  className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-sky-400/15 blur-3xl pointer-events-none"
                  aria-hidden="true"
                />

                <div className="relative max-w-2xl mx-auto space-y-6">
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                    Ready to screen a retinal fundus scan?
                  </h2>
                  <p className="text-base sm:text-lg text-slate-300">
                    Upload your own fundus photograph or test pre-validated APTOS clinical cases with dual-CNN classification and six prompting techniques.
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setActivePlaceholderModal("analyze")}
                      className="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl text-base font-bold bg-teal-400 hover:bg-teal-300 text-navy-950 shadow-lg shadow-teal-500/25 transition-all duration-200 hover:-translate-y-0.5"
                    >
                      <span>Start Analysis</span>
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </section>
      </main>

      {/* ==================================================================
          SECTION 10: FOOTER
          ================================================================== */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-navy-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-200/70 dark:border-slate-800/70">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-navy-900 to-teal-600 text-white flex items-center justify-center">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <div>
                <span className="font-bold text-sm text-navy-900 dark:text-white">RetinaScan AI</span>
                <span className="block text-xs text-slate-500 dark:text-slate-400">
                  Academic project, AI &amp; Data Science
                </span>
              </div>
            </div>

            {/* Footer Navigation Links */}
            <nav className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300" aria-label="Footer Navigation">
              <a
                href="#top"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              >
                Home
              </a>
              {["Analyze", "Compare", "History"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setActivePlaceholderModal(item.toLowerCase())}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
            <p>Academic project, AI &amp; Data Science • Dual-ResNet50 &amp; Groq LPU Architecture</p>
            <p className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <svg className="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              Screening aid, not a medical diagnosis.
            </p>
          </div>
        </div>
      </footer>

      {/* ==================================================================
          INTERACTIVE PLACEHOLDER ROUTE MODAL (ANALYZE / COMPARE / ABOUT / HISTORY)
          ================================================================== */}
      {activePlaceholderModal && PLACEHOLDER_PAGES[activePlaceholderModal] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-route-title"
          onClick={() => setActivePlaceholderModal(null)}
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  {PLACEHOLDER_PAGES[activePlaceholderModal].badge}
                </span>
                <h3 id="modal-route-title" className="text-2xl font-bold text-navy-900 dark:text-white mt-3">
                  {PLACEHOLDER_PAGES[activePlaceholderModal].title}
                </h3>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                  {PLACEHOLDER_PAGES[activePlaceholderModal].subtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActivePlaceholderModal(null)}
                aria-label="Close preview modal"
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {PLACEHOLDER_PAGES[activePlaceholderModal].description}
            </p>

            <div className="bg-slate-50 dark:bg-navy-950/70 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Module Capabilities
              </div>
              {PLACEHOLDER_PAGES[activePlaceholderModal].highlights.map((h) => (
                <div key={h} className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                  <span>{h}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActivePlaceholderModal(null)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Back to Home
              </button>
              <Link
                to={
                  activePlaceholderModal === "compare"
                    ? "/compare"
                    : activePlaceholderModal === "history"
                    ? "/history"
                    : "/analyze"
                }
                onClick={() => setActivePlaceholderModal(null)}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-sm transition-colors"
              >
                {activePlaceholderModal === "history"
                  ? "View Screening History"
                  : activePlaceholderModal === "compare"
                  ? "Open Compare Lab"
                  : "Start the Analysis"}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
