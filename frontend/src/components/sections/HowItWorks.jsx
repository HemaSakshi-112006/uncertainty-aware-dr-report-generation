import { useState } from "react";
import RevealOnScroll from "../RevealOnScroll";

const STEPS = [
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

function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  return (
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

        <div className="relative">
          {/* Desktop progress connector */}
          <div className="hidden lg:block absolute top-11 left-[12%] right-[12%] h-0.5 bg-slate-200 dark:bg-slate-800" aria-hidden="true">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-sky-500 transition-all duration-500"
              style={{ width: `${(activeStep / 3) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step, idx) => {
              const isSelected = activeStep === idx;
              return (
                <RevealOnScroll key={step.num} delay={idx * 100}>
                  <button
                    type="button"
                    onClick={() => setActiveStep(idx)}
                    onMouseEnter={() => setActiveStep(idx)}
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
                      <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-2">{step.title}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{step.desc}</p>
                    </div>
                    <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <span className="font-mono text-[11px] font-medium text-teal-700 dark:text-teal-400">{step.detail}</span>
                    </div>
                  </button>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
