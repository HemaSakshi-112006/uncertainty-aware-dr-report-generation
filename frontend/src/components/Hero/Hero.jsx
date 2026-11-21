import { useNavigate } from "react-router-dom";
import HeroRetinaIllustration from "./HeroRetinaIllustration";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden pt-10 pb-16 sm:pt-16 sm:pb-24">
      {/* Soft top gradient wash */}
      <div
        className="absolute inset-x-0 -top-24 h-[520px] bg-gradient-to-b from-teal-500/10 via-sky-500/5 to-transparent dark:from-teal-500/15 dark:via-navy-900/40 pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left: headline + CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="hero-stagger-1 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-navy-900/90 border border-teal-200/80 dark:border-teal-800/70 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
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
                onClick={() => navigate("/analyze")}
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

          {/* Right: Animated illustration */}
          <div className="lg:col-span-5">
            <HeroRetinaIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
