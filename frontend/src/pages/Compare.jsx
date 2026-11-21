import { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import FundusViewer from "../components/FundusViewer";
import { useAnalysis } from "../context/AnalysisContext";
import { getCompareTechniques } from "../data/fullClinicalReports";
import { generateClinicalPDF } from "../utils/pdfGenerator";

function Compare() {
  const {
    currentPreset,
    activePreset,
    customImageSrc,
    activeCaseData,
    generatedReports,
    fetchAiReport,
  } = useAnalysis();

  const [selectedReportModalId, setSelectedReportModalId] = useState(null);
  const [copiedText, setCopiedText] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  // Generate the 6 technique reports adapted dynamically to the current case
  const techniques = getCompareTechniques(activeCaseData, generatedReports);

  const selectedReportModal = selectedReportModalId
    ? techniques.find((t) => t.id === selectedReportModalId)
    : null;

  const handleOpenReportModal = (tech) => {
    setSelectedReportModalId(tech.id);
    if (tech.backendKey && !generatedReports[tech.backendKey]) {
      fetchAiReport(tech.backendKey);
    }
  };

  const handleDownload = (tech) => {
    setDownloadingId(tech.id);
    try {
      generateClinicalPDF({ technique: tech, caseData: activeCaseData });
    } catch (err) {
      console.error("PDF generation error:", err);
    } finally {
      setTimeout(() => setDownloadingId(null), 500);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const isHealthy = activeCaseData?.grade === 0 || activeCaseData?.gradeName?.includes("No");
  const isSevereOrProlif = (activeCaseData?.grade >= 3);
  const severityBadgeClass = isHealthy
    ? "bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60"
    : isSevereOrProlif
    ? "bg-rose-50 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border-rose-200/80 dark:border-rose-800/60"
    : "bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60";
  const severityDotClass = isHealthy
    ? "bg-emerald-500"
    : isSevereOrProlif
    ? "bg-rose-500"
    : "bg-amber-500";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-navy-950 dark:text-slate-100 antialiased selection:bg-teal-500/20 selection:text-teal-700 dark:selection:text-teal-300 transition-colors duration-200 bg-clinical-grid">
      {/* Top Shared Navbar with Active Compare Pill & Day/Night Toggle */}
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Page Header + Benchmark Case Card Row */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8 sm:mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-navy-900 dark:text-white">
              Cross-Technique Report Comparison
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Evaluating how six prompting paradigms shape clinical specificity, hallucination resistance, and latency on the same fundus scan.
            </p>
          </div>

          {/* Benchmark Case Card (Matches top-right in screenshot) */}
          <div className="flex items-center gap-3.5 bg-white dark:bg-navy-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 sm:px-4 sm:py-3 shadow-glass dark:shadow-glass-dark self-start lg:self-auto">
            {/* Small retinal fundus scan thumbnail */}
            <div className="w-12 h-12 rounded-xl bg-black overflow-hidden flex-shrink-0 border border-slate-800 shadow-inner">
              <FundusViewer
                variant={activePreset}
                customImageSrc={customImageSrc}
                showGradCam={false}
              />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                BENCHMARK CASE
              </span>
              <span className="text-xs sm:text-sm font-bold text-navy-900 dark:text-white">
                Case {activeCaseData?.caseNumber || "#104"} • {activeCaseData?.gradeName || "Moderate DR"} ({typeof activeCaseData?.primaryPct === "number" ? activeCaseData.primaryPct.toFixed(1) : (activeCaseData?.primaryPct || "86.4")}%)
              </span>
            </div>
          </div>
        </div>

        {/* 6-Technique Cards (3 Columns x 2 Rows) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {techniques.map((tech) => (
            <div
              key={tech.id}
              className="bg-white dark:bg-navy-900/85 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-glass dark:shadow-glass-dark hover:border-teal-500/60 dark:hover:border-teal-400/50 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Header: Title + Latency Badge */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-lg font-bold text-navy-900 dark:text-white">
                    {tech.name}
                  </h3>
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold border border-slate-200/70 dark:border-slate-700">
                    {tech.latency}
                  </span>
                </div>

                {/* Subtitle / Paradigm Description */}
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed min-h-[32px] mb-5">
                  {tech.subtitle}
                </p>

                {/* Summary Section */}
                <div className="space-y-4 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                  <div>
                    <p className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed">
                      <strong className="text-navy-900 dark:text-white">Summary: </strong>
                      {tech.summary.replace("Summary: ", "")}
                    </p>
                  </div>

                  {/* Uncertainty Handling Section */}
                  <div>
                    <p className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed">
                      <strong className="text-navy-900 dark:text-white">Uncertainty Handling: </strong>
                      {tech.uncertainty.replace("Uncertainty Handling: ", "")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Footer: Grade Pill + View Report & Download PDF Actions */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
                {/* Left: Dynamic Severity Badge */}
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${severityBadgeClass}`}>
                  <span className={`w-2 h-2 rounded-full ${severityDotClass}`} />
                  {activeCaseData?.gradeName || "Moderate DR"}
                </span>

                {/* Right: View Report + Download PDF Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenReportModal(tech)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                    title="View complete detailed clinical report"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    <span>View Report</span>
                  </button>

                  <button
                    type="button"
                    disabled={downloadingId === tech.id}
                    onClick={() => handleDownload(tech)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                    title="Download complete structured clinical report PDF"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    <span>{downloadingId === tech.id ? "PDF..." : "Download PDF"}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Clinical Disclaimer */}
        <div className="mt-14 text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
          <svg className="w-4 h-4 text-amber-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>Screening aid, not a medical diagnosis. Always correlate with clinical examination.</span>
        </div>
      </main>

      {/* ==================================================================
          FULL REPORT MODAL DIALOG
          ================================================================== */}
      {selectedReportModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedReportModalId(null)}
        >
          <div
            className="w-full max-w-3xl max-h-[90vh] bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                    Strategy: {selectedReportModal.name}
                  </span>
                  <span className="font-mono text-xs text-slate-400">
                    Latency: {selectedReportModal.latency}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-navy-900 dark:text-white mt-2">
                  Complete Clinical Screening Report
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Case {activeCaseData?.caseNumber || "#104"} • {activeCaseData?.gradeName || "Moderate DR"} ({typeof activeCaseData?.primaryPct === "number" ? activeCaseData.primaryPct.toFixed(1) : (activeCaseData?.primaryPct || "86.4")}%) • Dual-ResNet50 &amp; Groq LPU
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReportModalId(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Close modal"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable Report Content */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-4">
              {/* Report Body */}
              <div className="bg-slate-50 dark:bg-navy-950/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line font-mono">
                {selectedReportModal.fullReport}
              </div>

              {/* Class Probability Distribution Table */}
              <div className="bg-slate-50 dark:bg-navy-950/70 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  5-Stage ICDR Probability Breakdown
                </div>
                <div className="grid grid-cols-5 gap-2 text-center">
                  {(activeCaseData?.probs || []).map((p) => (
                    <div
                      key={p.grade}
                      className={`p-2 rounded-xl border ${
                        p.isPrimary
                          ? isHealthy
                            ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800"
                            : "bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800"
                          : "bg-white dark:bg-navy-900 border-slate-200 dark:border-slate-800"
                      }`}
                    >
                      <div className="text-[10px] font-bold text-slate-400">Grade {p.grade}</div>
                      <div className="font-mono text-xs font-bold text-navy-900 dark:text-white mt-0.5">
                        {p.pct.toFixed(1)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => handleCopy(selectedReportModal.fullReport)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                <span>{copiedText ? "Copied to Clipboard!" : "Copy Report Text"}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedReportModalId(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => handleDownload(selectedReportModal)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-sm transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>Download Full PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Compare;
