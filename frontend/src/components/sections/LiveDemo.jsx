import { useState, useEffect, useRef } from "react";
import RevealOnScroll from "../RevealOnScroll";
import LiveDemoFundusCard from "./LiveDemoFundusCard";
import { DR_PROBABILITIES } from "../../data/drProbabilities";
import { PROMPT_TECHNIQUES } from "../../data/promptTechniques";

/**
 * Interactive live demo section.
 * Accepts selectedTechId + onSelectTech from the parent (Home) so that
 * the TechniqueShowcase section can also control which technique is active.
 */
function LiveDemo({ selectedTechId, onSelectTech }) {
  const [showGradCam, setShowGradCam] = useState(true);
  const [typedReport, setTypedReport] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [barsAnimated, setBarsAnimated] = useState(false);
  const sectionRef = useRef(null);

  // Animate probability bars on scroll into view
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
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Typewriter effect whenever selected technique changes
  useEffect(() => {
    if (!selectedTechId) return;
    const tech = PROMPT_TECHNIQUES.find((t) => t.id === selectedTechId) || PROMPT_TECHNIQUES[0];
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
    onSelectTech("");
    setTimeout(() => onSelectTech(current), 20);
  };

  const activeTech =
    PROMPT_TECHNIQUES.find((t) => t.id === selectedTechId) || PROMPT_TECHNIQUES[3];

  return (
    <section id="live-demo-section" ref={sectionRef} className="py-20 sm:py-24">
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
            {/* Window chrome bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  <span className="w-3 h-3 rounded-full bg-rose-400" />
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <span className="font-mono text-xs font-semibold text-slate-500 dark:text-slate-400">
                  RetinaScan Clinical Workstation • Sample Case #APTOS-104
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/70">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Primary: Moderate DR (68.0%)
                </span>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/70">
                  Dual-CNN Concordant
                </span>
              </div>
            </div>

            {/* 3-column grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-stretch">
              {/* Col 1: Fundus scan */}
              <div className="lg:col-span-4">
                <LiveDemoFundusCard
                  showGradCam={showGradCam}
                  onToggleGradCam={() => setShowGradCam((v) => !v)}
                />
              </div>

              {/* Col 2: Probability bars */}
              <div className="lg:col-span-4 flex flex-col justify-between bg-slate-50/90 dark:bg-navy-950/60 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-navy-900 dark:text-white">5-Stage ICDR Probabilities</h3>
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
                  <span className="font-semibold text-amber-700 dark:text-amber-400">Review Recommended (65–79%)</span>
                </div>
              </div>

              {/* Col 3: Typing report */}
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

                  {/* Technique pills */}
                  <div className="flex flex-wrap gap-1.5 mb-4" role="tablist" aria-label="Select prompting technique">
                    {PROMPT_TECHNIQUES.map((t) => {
                      const active = t.id === selectedTechId;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          role="tab"
                          aria-selected={active}
                          onClick={() => onSelectTech(t.id)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                            active
                              ? "bg-teal-600 text-white"
                              : "bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-teal-400"
                          }`}
                        >
                          {t.name}
                        </button>
                      );
                    })}
                  </div>

                  {/* Typing box */}
                  <div
                    className="min-h-[168px] rounded-xl bg-white dark:bg-navy-900/90 border border-slate-200/80 dark:border-slate-800 p-3.5 text-xs sm:text-[13px] text-slate-700 dark:text-slate-200 leading-relaxed"
                    aria-live="polite"
                  >
                    {typedReport}
                    {isTyping && <span className="typing-cursor" aria-hidden="true" />}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Strategy: <strong>{activeTech.name}</strong></span>
                  <span className="font-mono text-teal-700 dark:text-teal-400">{activeTech.tag}</span>
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}

export default LiveDemo;
