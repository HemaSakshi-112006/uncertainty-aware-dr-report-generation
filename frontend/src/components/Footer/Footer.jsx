import { Link } from "react-router-dom";
import "./Footer.css";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Analyze", to: "/analyze" },
  { label: "Compare", to: "/compare" },
  { label: "About", to: "/about" },
  { label: "History", to: "/history" },
];

function Footer() {
  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-navy-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-200/70 dark:border-slate-800/70">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-navy-900 to-teal-600 text-white flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <div>
              <span className="font-bold text-sm text-navy-900 dark:text-white">RetinaScan AI</span>
              <span className="block text-xs text-slate-500 dark:text-slate-400">
                Academic project, AI &amp; Data Science
              </span>
            </div>
          </div>

          {/* Footer Nav */}
          <nav
            className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300"
            aria-label="Footer Navigation"
          >
            {NAV_LINKS.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>Academic project, AI &amp; Data Science • Dual-ResNet50 &amp; Groq LPU Architecture</p>
          <p className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
            <svg className="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Screening aid, not a medical diagnosis.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
