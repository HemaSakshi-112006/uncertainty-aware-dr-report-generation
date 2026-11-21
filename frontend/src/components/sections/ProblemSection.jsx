import RevealOnScroll from "../RevealOnScroll";

const CARDS = [
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
];

function ProblemSection() {
  return (
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
          {CARDS.map((item, idx) => (
            <RevealOnScroll key={item.title} delay={idx * 110}>
              <div className="h-full bg-white/80 dark:bg-navy-900/75 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-2xl p-7 shadow-glass dark:shadow-glass-dark hover:border-teal-500/60 dark:hover:border-teal-400/50 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 border border-teal-200/70 dark:border-teal-800/60 flex items-center justify-center mb-5">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-navy-900 dark:text-white mb-3">{item.title}</h3>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">{item.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-teal-700 dark:text-teal-300">{item.stat}</span>
                  <span className="w-2 h-2 rounded-full bg-teal-500/60" />
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProblemSection;
