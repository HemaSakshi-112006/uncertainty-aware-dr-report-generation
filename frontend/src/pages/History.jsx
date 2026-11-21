import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import FundusViewer from "../components/FundusViewer";
import { useAnalysis } from "../context/AnalysisContext";
import { getCompareTechniques } from "../data/fullClinicalReports";
import { generateClinicalPDF } from "../utils/pdfGenerator";

function History() {
  const navigate = useNavigate();
  const { historyItems, historyLoaded, restoreAnalysis, removeAnalysisRecord } = useAnalysis();

  const [searchQuery, setSearchQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [eyeFilter, setEyeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedCaseModal, setSelectedCaseModal] = useState(null);
  const [copiedText, setCopiedText] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  // Filter and sort real analyses
  const filteredItems = useMemo(() => {
    return (historyItems || [])
      .filter((item) => {
        const matchesSearch =
          (item.caseNumber || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.patientId || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.filename || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.gradeName || "").toLowerCase().includes(searchQuery.toLowerCase());

        const matchesGrade =
          gradeFilter === "all" || item.grade?.toString() === gradeFilter;

        const matchesEye =
          eyeFilter === "all" || (item.eye || "").toLowerCase() === eyeFilter.toLowerCase();

        return matchesSearch && matchesGrade && matchesEye;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.timestamp) - new Date(a.timestamp);
        }
        if (sortBy === "severity") {
          return (b.grade ?? 0) - (a.grade ?? 0);
        }
        if (sortBy === "confidence") {
          return (b.primaryPct ?? 0) - (a.primaryPct ?? 0);
        }
        return 0;
      });
  }, [historyItems, searchQuery, gradeFilter, eyeFilter, sortBy]);

  // Statistics derived purely from real stored analyses
  const totalScans = historyItems.length;
  const referableCases = historyItems.filter((item) => (item.grade ?? 0) >= 2).length;
  const healthyCases = historyItems.filter((item) => item.grade === 0).length;
  const avgConfidence = totalScans > 0
    ? (historyItems.reduce((acc, curr) => acc + (curr.primaryPct || 0), 0) / totalScans).toFixed(1)
    : "0.0";

  // Navigation & Restoration handlers
  const handleOpenInAnalyze = (item) => {
    restoreAnalysis(item);
    navigate("/analyze");
  };

  const handleOpenInCompare = (item) => {
    restoreAnalysis(item);
    navigate("/compare");
  };

  const handleDownloadPDF = (item) => {
    setDownloadingId(item.id);
    try {
      const techniques = getCompareTechniques(item, item.generatedReports || {});
      const selectedTech =
        techniques.find((t) => t.id === item.selectedPromptTech) ||
        techniques[0] || {
          name: "Clinical Screening Report",
          fullReport: "Full Screening Report.",
        };
      generateClinicalPDF({ technique: selectedTech, caseData: item });
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setTimeout(() => setDownloadingId(null), 500);
    }
  };

  const handleCopyReport = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const getSeverityBadge = (grade, gradeName) => {
    if (grade === 0) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          {gradeName} (Grade 0)
        </span>
      );
    }
    if (grade === 1) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-lime-50 dark:bg-lime-950/70 text-lime-800 dark:text-lime-300 border border-lime-200/80 dark:border-lime-800/60">
          <span className="w-2 h-2 rounded-full bg-lime-500" />
          {gradeName} (Grade 1)
        </span>
      );
    }
    if (grade === 2) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          {gradeName} (Grade 2)
        </span>
      );
    }
    if (grade === 3) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 dark:bg-orange-950/70 text-orange-800 dark:text-orange-300 border border-orange-200/80 dark:border-orange-800/60">
          <span className="w-2 h-2 rounded-full bg-orange-500" />
          {gradeName} (Grade 3)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/60">
        <span className="w-2 h-2 rounded-full bg-rose-500" />
        {gradeName} (Grade 4)
      </span>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-navy-950 dark:text-slate-100 antialiased selection:bg-teal-500/20 selection:text-teal-700 dark:selection:text-teal-300 transition-colors duration-200 bg-clinical-grid">
      {/* Top Persistent Shared Navbar */}
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Page Header */}
        <div className="mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-300 bg-teal-50/70 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/80 shadow-xs mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
            CLINICAL AUDIT TRAIL &amp; SCREENING ARCHIVE
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-navy-900 dark:text-white">
            Screening History &amp; Case Archives
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 max-w-3xl leading-relaxed">
            Review past retinal fundus screenings, dual-CNN confidence metrics, Grad-CAM saliency logs, and exported clinical reports.
          </p>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white dark:bg-navy-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-glass dark:shadow-glass-dark">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Analyses</span>
            <div className="font-mono text-3xl font-black text-navy-900 dark:text-white mt-1.5">
              {totalScans}
            </div>
            <span className="text-xs text-teal-600 dark:text-teal-400 mt-1 inline-block">Persisted in IndexedDB</span>
          </div>

          <div className="bg-white dark:bg-navy-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-glass dark:shadow-glass-dark">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Average Confidence</span>
            <div className="font-mono text-3xl font-black text-teal-600 dark:text-teal-400 mt-1.5">
              {avgConfidence}%
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 inline-block">Actual CNN Confidence</span>
          </div>

          <div className="bg-white dark:bg-navy-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-glass dark:shadow-glass-dark">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Referable DR (Grade ≥2)</span>
            <div className="font-mono text-3xl font-black text-amber-600 dark:text-amber-400 mt-1.5">
              {referableCases}
            </div>
            <span className="text-xs text-amber-600 dark:text-amber-400 mt-1 inline-block">Action Required</span>
          </div>

          <div className="bg-white dark:bg-navy-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-glass dark:shadow-glass-dark">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">No DR (Healthy)</span>
            <div className="font-mono text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1.5">
              {healthyCases}
            </div>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 inline-block">Annual Screening Recall</span>
          </div>
        </div>

        {/* Search, Filter & Sort Bar (shown when records exist) */}
        {totalScans > 0 && (
          <div className="bg-white dark:bg-navy-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-glass dark:shadow-glass-dark mb-8 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Box */}
            <div className="relative flex-1">
              <svg
                className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search by Case #, Patient ID, or file name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-navy-950/70 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Grade Filter */}
              <select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-navy-950/70 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-teal-500 cursor-pointer"
              >
                <option value="all">All ICDR Grades</option>
                <option value="0">Grade 0 (No DR)</option>
                <option value="1">Grade 1 (Mild DR)</option>
                <option value="2">Grade 2 (Moderate DR)</option>
                <option value="3">Grade 3 (Severe DR)</option>
                <option value="4">Grade 4 (Proliferative DR)</option>
              </select>

              {/* Eye Filter */}
              <select
                value={eyeFilter}
                onChange={(e) => setEyeFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-navy-950/70 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-teal-500 cursor-pointer"
              >
                <option value="all">Both Eyes (OD &amp; OS)</option>
                <option value="OD">Right Eye (OD)</option>
                <option value="OS">Left Eye (OS)</option>
              </select>

              {/* Sort Filter */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-navy-950/70 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-teal-500 cursor-pointer"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="severity">Sort: Highest Severity</option>
                <option value="confidence">Sort: Highest Confidence</option>
              </select>
            </div>
          </div>
        )}

        {/* Clean Empty State when no analyses exist */}
        {totalScans === 0 ? (
          <div className="bg-white dark:bg-navy-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 sm:p-16 text-center shadow-glass dark:shadow-glass-dark animate-fadeIn">
            <div className="w-16 h-16 rounded-3xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 mx-auto flex items-center justify-center mb-5 border border-teal-200/60 dark:border-teal-800/60 shadow-inner">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-navy-900 dark:text-white">
              No analyses yet
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
              Your completed analyses will appear here. Upload and analyze a retinal fundus image in the workspace to save your first clinical record.
            </p>
            <Link
              to="/analyze"
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-md shadow-teal-600/20 transition-all hover:scale-105 cursor-pointer"
            >
              <span>Start an Analysis</span>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        ) : filteredItems.length === 0 ? (
          /* Filtered empty state */
          <div className="bg-white dark:bg-navy-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center shadow-glass dark:shadow-glass-dark">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 mx-auto flex items-center justify-center mb-4">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-navy-900 dark:text-white">
              No matching screening records found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Try adjusting your search criteria or resetting filters to view all historical retinal scans.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setGradeFilter("all");
                setEyeFilter("all");
              }}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white transition-colors cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          /* Real Analysis Records List */
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-navy-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-glass dark:shadow-glass-dark hover:border-teal-500/60 dark:hover:border-teal-400/50 transition-all duration-200 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5"
              >
                {/* Left Side: Thumbnail + Case Info */}
                <div className="flex items-center gap-4">
                  {/* Small Fundus Scan Preview */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-black overflow-hidden flex-shrink-0 border border-slate-800 shadow-md">
                    {item.imageSrc ? (
                      <img
                        src={item.imageSrc}
                        alt={item.filename}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FundusViewer
                        variant={item.presetId || "moderate"}
                        customImageSrc={item.imageSrc}
                        showGradCam={false}
                      />
                    )}
                  </div>

                  {/* Metadata */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-teal-700 dark:text-teal-300">
                        {item.caseNumber}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                        {item.patientId}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {item.eye === "OD" ? "Right Eye (OD)" : "Left Eye (OS)"}
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-navy-900 dark:text-white">
                      {item.filename}
                    </h4>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span>{item.displayDate || item.timestamp}</span>
                      <span>•</span>
                      <span>{item.concordance}</span>
                    </div>
                  </div>
                </div>

                {/* Center / Severity Status */}
                <div className="flex flex-wrap items-center gap-3">
                  {getSeverityBadge(item.grade, item.gradeName)}

                  <div className="text-left sm:text-right">
                    <div className="font-mono text-sm font-bold text-navy-900 dark:text-white">
                      {(item.primaryPct || 0).toFixed(1)}% Confidence
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {item.confidenceTier}
                    </div>
                  </div>
                </div>

                {/* Right Side: Actions */}
                <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSelectedCaseModal(item)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                    title="View complete clinical details"
                  >
                    View Details
                  </button>

                  <button
                    type="button"
                    disabled={downloadingId === item.id}
                    onClick={() => handleDownloadPDF(item)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                    title="Download clinical screening PDF report"
                  >
                    {downloadingId === item.id ? "PDF..." : "Download PDF"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenInAnalyze(item)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-xs transition-colors cursor-pointer"
                    title="Restore into Analyze workspace"
                  >
                    Analyze
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenInCompare(item)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-navy-900 hover:bg-navy-850 dark:bg-slate-800 dark:hover:bg-slate-700 text-white transition-colors cursor-pointer"
                    title="Restore into Compare prompt lab"
                  >
                    Compare
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Delete analysis record for ${item.filename}?`)) {
                        removeAnalysisRecord(item.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    title="Delete record from history"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Medical Disclaimer */}
        <div className="mt-14 text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
          <svg className="w-4 h-4 text-amber-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>Screening aid, not a medical diagnosis. Always correlate with clinical examination.</span>
        </div>
      </main>

      {/* Case Details Inspection Modal */}
      {selectedCaseModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedCaseModal(null)}
        >
          <div
            className="w-full max-w-3xl max-h-[90vh] bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-teal-700 dark:text-teal-300">
                    {selectedCaseModal.caseNumber}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedCaseModal.patientId}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedCaseModal.displayDate || selectedCaseModal.timestamp}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-navy-900 dark:text-white mt-1.5">
                  Retinal Fundus Screening Record
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {selectedCaseModal.filename} • {selectedCaseModal.meta}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCaseModal(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto space-y-5 pr-1">
              {/* Scan & Diagnosis Banner */}
              <div className="flex flex-col sm:flex-row items-center gap-5 bg-slate-50 dark:bg-navy-950/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
                <div className="w-24 h-24 rounded-2xl bg-black overflow-hidden flex-shrink-0 border border-slate-800 shadow-md">
                  {selectedCaseModal.imageSrc ? (
                    <img
                      src={selectedCaseModal.imageSrc}
                      alt={selectedCaseModal.filename}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FundusViewer
                      variant={selectedCaseModal.presetId || "moderate"}
                      customImageSrc={selectedCaseModal.imageSrc}
                      showGradCam={false}
                    />
                  )}
                </div>
                <div className="space-y-2 text-center sm:text-left flex-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    {getSeverityBadge(selectedCaseModal.grade, selectedCaseModal.gradeName)}
                    <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700">
                      Confidence: {(selectedCaseModal.primaryPct || 0).toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    <strong>Ensemble Status: </strong>{selectedCaseModal.concordance}. Entropy score: {(selectedCaseModal.entropy ?? 0.2842).toFixed(4)}. Top-two probability separation: {(selectedCaseModal.topTwoGap ?? 78.5).toFixed(1)} percentage points.
                  </p>
                </div>
              </div>

              {/* 5-Stage Probability Breakdown */}
              <div className="bg-slate-50 dark:bg-navy-950/70 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  5-Stage ICDR Softmax Probability Breakdown
                </div>
                <div className="grid grid-cols-5 gap-2 text-center">
                  {(selectedCaseModal.probs || []).map((p) => (
                    <div
                      key={p.grade}
                      className={`p-2.5 rounded-xl border ${
                        p.isPrimary
                          ? selectedCaseModal.grade === 0
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

              {/* Clinical Narrative Summary */}
              <div className="bg-slate-50 dark:bg-navy-950/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Clinical Synthesis Summary
                </div>
                <p className="font-mono text-xs sm:text-[13px] text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                  {getCompareTechniques(selectedCaseModal, selectedCaseModal.generatedReports || {})[0]?.fullReport || "Detailed clinical screening report."}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() =>
                  handleCopyReport(
                    getCompareTechniques(selectedCaseModal, selectedCaseModal.generatedReports || {})[0]?.fullReport || ""
                  )
                }
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                <span>{copiedText ? "Copied!" : "Copy Report"}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCaseModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadPDF(selectedCaseModal)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-sm transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default History;
