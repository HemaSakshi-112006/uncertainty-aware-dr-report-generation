// Features data — uses JSX for icons so this file uses .jsx extension
export const FEATURES_DATA = [
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
