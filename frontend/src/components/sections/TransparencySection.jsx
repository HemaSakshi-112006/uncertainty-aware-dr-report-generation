import RevealOnScroll from "../RevealOnScroll";

const METRICS = [
  { label: "Model A Top-1 Acc.", value: "84.6%", sub: "ResNet50 Backbone" },
  { label: "Model B Top-1 Acc.", value: "83.9%", sub: "ResNet50 Diverse Seed" },
  { label: "Quadratic Weighted κ", value: "0.912", sub: "Inter-Rater Agreement" },
  { label: "Referable DR Recall", value: "92.4%", sub: "Grades 2–4 Sensitivity" },
];

function TransparencySection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="bg-white/90 dark:bg-navy-900/85 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 rounded-3xl p-7 sm:p-10 shadow-glass dark:shadow-glass-dark">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left explanation */}
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
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0" />
                    <span>
                      <strong>2D Photography Scope:</strong> Single-field fundus scans cannot directly measure retinal thickening; OCT is required to confirm Diabetic Macular Edema.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0" />
                    <span>
                      <strong>Decision-Support Role:</strong> RetinaScan AI is strictly an assistive screening tool and never replaces a comprehensive dilated eye exam by a licensed clinician.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Right scorecards */}
              <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                {METRICS.map((m) => (
                  <div key={m.label} className="bg-slate-50 dark:bg-navy-950/70 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4">
                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400">{m.label}</div>
                    <div className="font-mono text-2xl font-bold text-navy-900 dark:text-white mt-1">{m.value}</div>
                    <div className="text-[11px] font-medium text-teal-700 dark:text-teal-400 mt-1">{m.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}

export default TransparencySection;
