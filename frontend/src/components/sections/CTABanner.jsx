import { useNavigate } from "react-router-dom";
import RevealOnScroll from "../RevealOnScroll";

function CTABanner() {
  const navigate = useNavigate();

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-950 via-navy-900 to-teal-900 px-6 py-12 sm:px-12 sm:py-16 text-center text-white shadow-xl">
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-teal-400/20 blur-3xl pointer-events-none" aria-hidden="true" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-sky-400/15 blur-3xl pointer-events-none" aria-hidden="true" />

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
                  onClick={() => navigate("/analyze")}
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
  );
}

export default CTABanner;
