import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDarkMode } from "../../context/DarkModeContext";
import "./Navbar.css";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Analyze", to: "/analyze" },
  { label: "Compare", to: "/compare" },
  { label: "History", to: "/history" },
];

function Navbar() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (to) => {
    if (to === "/") return location.pathname === "/";
    return location.pathname.startsWith(to);
  };

  const isAnalyzePage = location.pathname.startsWith("/analyze");

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/85 dark:bg-navy-950/85 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-navy-900 to-teal-600 dark:from-teal-500 dark:to-navy-850 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight text-navy-900 dark:text-white leading-none">
              RetinaScan <span className="text-teal-600 dark:text-teal-400">AI</span>
            </span>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              Clinical DR Screening &amp; Reporting
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5" aria-label="Primary Navigation">
          {NAV_LINKS.map(({ label, to }) => {
            const active = isActive(to);
            return (
              <Link
                key={to}
                to={to}
                className={`px-3.5 py-1.5 rounded-lg text-sm transition-all ${
                  active
                    ? "bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 font-semibold border border-teal-200/70 dark:border-teal-800/60 shadow-xs"
                    : "text-slate-600 dark:text-slate-300 hover:text-navy-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60 font-medium"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Dark/Light Mode Toggle */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={toggleDarkMode}
            aria-label="Toggle day and night mode"
            title={darkMode ? "Switch to Day Mode (Light)" : "Switch to Night Mode (Dark)"}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900/90 text-slate-600 dark:text-slate-300 hover:border-teal-500 dark:hover:border-teal-400 hover:text-teal-600 dark:hover:text-teal-300 shadow-xs transition-all hover:scale-105 active:scale-95"
          >
            {darkMode ? (
              // Sun icon when in dark mode (click to switch to day)
              <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
            ) : (
              // Sun / Brightness icon when in light mode (click to switch to night)
              <svg className="w-4 h-4 text-slate-700 hover:text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
            )}
          </button>

          {!isAnalyzePage && (
            <Link
              to="/analyze"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-navy-900 hover:bg-navy-850 dark:bg-teal-500 dark:hover:bg-teal-400 text-white dark:text-navy-950 shadow-sm transition-all hover:-translate-y-0.5"
            >
              <span>Start Analysis</span>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          )}

          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-navy-950/95 backdrop-blur-xl px-4 py-3 space-y-1">
          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                isActive(to)
                  ? "bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 font-semibold"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

export default Navbar;
