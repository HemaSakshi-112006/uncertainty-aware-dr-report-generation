import RevealOnScroll from "../RevealOnScroll";
import { FEATURES_DATA } from "../../data/features";

function FeaturesGrid() {
  return (
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
                  <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-2">{feat.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesGrid;
