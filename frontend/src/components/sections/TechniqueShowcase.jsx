import RevealOnScroll from "../RevealOnScroll";
import { PROMPT_TECHNIQUES } from "../../data/promptTechniques";

/**
 * Shows all six prompting technique cards.
 * Clicking a card calls onSelectTechnique(techId) so Home can update
 * the LiveDemo's selected technique and scroll to it.
 */
function TechniqueShowcase({ onSelectTechnique }) {
  return (
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
                onClick={() => onSelectTechnique(tech.id)}
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
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{tech.shortDesc}</p>
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
  );
}

export default TechniqueShowcase;
