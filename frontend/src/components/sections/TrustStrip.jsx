/** Platform capability stats strip shown below the hero. */
function TrustStrip() {
  const stats = [
    { value: "5 DR Stages", label: "ICDR Clinical Scale (0–4)" },
    { value: "2 CNN Models", label: "ResNet50 Dual Ensemble" },
    { value: "6 Techniques", label: "Prompt Engineering Suite" },
    { value: "APTOS 2019", label: "3,662 Graded Fundus Scans" },
    { value: "Groq LPU", label: "Sub-3s Structured Reports" },
  ];

  return (
    <section
      aria-label="Platform Capabilities"
      className="border-y border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-navy-900/50 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-center sm:text-left">
          {stats.map((stat, idx) => (
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
  );
}

export default TrustStrip;
