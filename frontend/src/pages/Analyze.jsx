import { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import FundusViewer from "../components/FundusViewer";
import { useAnalysis } from "../context/AnalysisContext";
import { DR_PROBABILITIES } from "../data/drProbabilities";
import { PROMPT_TECHNIQUES, getPromptTechniquesForCase } from "../data/promptTechniques";

function Analyze() {
  const {
    activePreset,
    setActivePreset,
    handleSelectPreset,
    customImageSrc,
    setCustomImageSrc,
    customFileName,
    setCustomFileName,
    selectedFile,
    setSelectedFile,
    predictionResult,
    setPredictionResult,
    gradcamOverlay,
    setGradcamOverlay,
    apiError,
    setApiError,
    showGradCam,
    setShowGradCam,
    isAnalyzing,
    setIsAnalyzing,
    hasAnalyzed,
    setHasAnalyzed,
    selectedPromptTech,
    setSelectedPromptTech,
    showErrorBanner,
    setShowErrorBanner,
    demoControlsOpen,
    setDemoControlsOpen,
    handleFileUpload,
    triggerAnalyze,
    currentPreset,
    activeCaseData,
    samplePresets,
    generatedReports,
    isGeneratingReport,
    fetchAiReport,
  } = useAnalysis();

  const [copiedReport, setCopiedReport] = useState(false);
  const [showFullReport, setShowFullReport] = useState(false);
  const fileInputRef = useRef(null);

  // Trigger live AI report fetching when prompt tab changes or analysis finishes
  useEffect(() => {
    if (hasAnalyzed && !generatedReports[selectedPromptTech.replace(/-/g, "_")]) {
      fetchAiReport(selectedPromptTech);
    }
  }, [selectedPromptTech, hasAnalyzed]);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const techniques = getPromptTechniquesForCase(activeCaseData, generatedReports);
  const currentTech =
    techniques.find((t) => t.id === selectedPromptTech) || techniques[3];

  const handleCopyReport = () => {
    navigator.clipboard.writeText(currentTech.reportText);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-navy-950 dark:text-slate-100 antialiased selection:bg-teal-500/20 selection:text-teal-700 dark:selection:text-teal-300 transition-colors duration-200 bg-clinical-grid">
      {/* Top Reusable Navbar */}
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Workspace Page Header */}
        <div className="mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-300 bg-teal-50/70 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/80 shadow-xs mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
            CLINICAL SCREENING WORKSPACE
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-navy-900 dark:text-white">
            Retinal Fundus Analysis
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 max-w-3xl leading-relaxed">
            Stage 1 vision classification completes first and remains pinned while Stage 2 generates the clinical report.
          </p>
        </div>

        {/* Timeline Steps Container */}
        <div className="relative pl-6 sm:pl-10 space-y-10">
          {/* Vertical Connecting Line */}
          <div
            className="absolute left-3.5 sm:left-5 top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-800"
            aria-hidden="true"
          />

          {/* ==================================================================
              STEP 1: UPLOAD RETINAL FUNDUS IMAGE
              ================================================================== */}
          <div className="relative">
            {/* Step 1 Number Indicator */}
            <div className="absolute -left-6 sm:-left-10 top-6 -translate-x-1/2 w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-sm shadow-md ring-4 ring-slate-50 dark:ring-navy-950">
              1
            </div>

            {/* Step 1 Main Card */}
            <div className="bg-white dark:bg-navy-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-7 shadow-glass dark:shadow-glass-dark">
              {/* Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-navy-900 dark:text-white">
                    Upload Retinal Fundus Image
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Macula-centered 45° field-of-view fundus photography (PNG, JPG, TIFF • Max 10 MB)
                  </p>
                </div>
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    <span className="w-2 h-2 rounded-full bg-teal-500" />
                    {isAnalyzing ? "Analyzing..." : hasAnalyzed ? "Ready to Analyze" : "Waiting for Analysis"}
                  </span>
                </div>
              </div>

              {/* Card Body (2 Columns) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start mt-6">
                {/* Left Column: Drag & Drop Zone + Sample Presets + Alerts */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Dropzone */}
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-teal-200/90 dark:border-teal-800/80 bg-teal-50/20 dark:bg-navy-950/40 hover:bg-teal-50/40 dark:hover:bg-navy-950/60 rounded-2xl p-7 sm:p-9 text-center cursor-pointer transition-all duration-200 group flex flex-col items-center justify-center"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/tiff"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload(e.target.files[0]);
                        }
                      }}
                    />

                    {/* Upload Icon inside rounded square */}
                    <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950 border border-teal-200/70 dark:border-teal-800/70 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-xs">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    </div>

                    <p className="font-bold text-sm sm:text-base text-navy-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      Drag &amp; drop fundus scan here, or click to browse
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Supports high-resolution retinal photographs up to 10 MB
                    </p>
                  </div>

                  {/* Sample Presets Row */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mr-1">
                      Use sample image:
                    </span>
                    {Object.values(samplePresets).map((preset) => {
                      const isSelected = !customImageSrc && activePreset === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handleSelectPreset(preset.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            isSelected
                              ? "bg-teal-50 dark:bg-teal-950/80 border border-teal-400 text-teal-800 dark:text-teal-300 shadow-xs"
                              : "bg-white dark:bg-navy-950/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-teal-400"
                          }`}
                        >
                          {preset.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Invalid File Format Alert (as seen in screenshot) */}
                  {showErrorBanner && (
                    <div className="bg-rose-50/90 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl p-3.5 flex items-start justify-between gap-3 animate-fadeIn">
                      <div className="flex items-start gap-2.5">
                        <svg className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <div>
                          <p className="text-xs font-bold text-rose-700 dark:text-rose-400">
                            Invalid File Format
                          </p>
                          <p className="text-xs text-rose-600 dark:text-rose-300 mt-0.5">
                            Please upload a valid PNG, JPG, or TIFF retinal scan under 10 MB.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowErrorBanner(false)}
                        className="text-rose-400 hover:text-rose-600 dark:hover:text-rose-200 p-1 rounded-md"
                        title="Dismiss alert"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                {/* Right Column: Fundus Scan Preview Card + File Details + Analyze CTA */}
                <div className="lg:col-span-5 bg-slate-50/90 dark:bg-navy-950/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-between">
                  {/* Fundus Preview Canvas */}
                  <div className="w-full flex justify-center py-1">
                    <FundusViewer
                      variant={activePreset}
                      customImageSrc={customImageSrc}
                      showGradCam={showGradCam}
                      gradcamOverlay={gradcamOverlay}
                    />
                  </div>

                  {/* File Metadata Text below image */}
                  <div className="text-center mt-3">
                    <p className="font-mono text-xs font-medium text-slate-600 dark:text-slate-300">
                      {customImageSrc
                        ? customFileName
                        : `${currentPreset.filename} • ${currentPreset.meta}`}
                    </p>
                  </div>

                  {/* Grad-CAM Heatmap Toggle (when analyzed) */}
                  {hasAnalyzed && (
                    <div className="w-full flex items-center justify-between pt-3 mt-2 border-t border-slate-200/70 dark:border-slate-800 text-xs">
                      <span className="font-medium text-slate-600 dark:text-slate-300">
                        Grad-CAM++ Overlay
                      </span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={showGradCam}
                        onClick={() => setShowGradCam((v) => !v)}
                        className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none ${
                          showGradCam ? "bg-teal-500" : "bg-slate-300 dark:bg-slate-700"
                        }`}
                      >
                        <span
                          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                            showGradCam ? "translate-x-5" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  )}

                  {/* Analyze Scan Button */}
                  <button
                    type="button"
                    disabled={isAnalyzing}
                    onClick={triggerAnalyze}
                    className="w-full mt-4 py-3 px-4 rounded-xl font-bold text-sm bg-teal-600 hover:bg-teal-500 active:scale-[0.99] text-white shadow-md shadow-teal-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isAnalyzing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        <span>Analyzing Dual-CNN...</span>
                      </>
                    ) : (
                      <>
                        <span>Analyze Scan</span>
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ==================================================================
              STEP 2: CNN SEVERITY CLASSIFICATION
              ================================================================== */}
          <div id="step-2-section" className="relative">
            {/* Step 2 Number Indicator */}
            <div
              className={`absolute -left-6 sm:-left-10 top-6 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-md ring-4 ring-slate-50 dark:ring-navy-950 ${
                hasAnalyzed
                  ? "bg-teal-600 text-white"
                  : "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
              }`}
            >
              2
            </div>

            <div className="bg-white dark:bg-navy-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-7 shadow-glass dark:shadow-glass-dark">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-slate-800">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-lg sm:text-xl font-bold text-navy-900 dark:text-white">
                    CNN Severity Classification
                  </h2>
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800/80 font-semibold">
                    ResNet50
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    Stage 1 • ~1.0s
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                International Clinical Diabetic Retinopathy (ICDR) 5-grade probability distribution
              </p>

              {hasAnalyzed ? (
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  {/* Primary Diagnosis summary card */}
                  <div className="lg:col-span-5 bg-slate-50/90 dark:bg-navy-950/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Primary Classified Stage
                      </span>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="w-3.5 h-3.5 rounded-full bg-amber-500 ring-4 ring-amber-500/20" />
                        <h3 className="text-2xl font-extrabold text-navy-900 dark:text-white">
                          {predictionResult?.predicted_class || currentPreset.gradeName}
                        </h3>
                      </div>
                      <div className="font-mono text-3xl font-black text-amber-600 dark:text-amber-400 mt-2">
                        {predictionResult
? (predictionResult.maximum_probability * 100).toFixed(1)
  : currentPreset.primaryPct.toFixed(1)}%
                      </div>
                    </div>

                    <div className="space-y-2 mt-5 pt-4 border-t border-slate-200/80 dark:border-slate-800 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Ensemble Status:</span>
                        <span className="font-mono font-semibold text-teal-700 dark:text-teal-300">
                          {currentPreset.concordance}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Confidence Tier:</span>
                        <span className="font-semibold text-amber-600 dark:text-amber-400">
                          {predictionResult
  ? `Model confidence: ${(predictionResult.maximum_probability * 100).toFixed(1)}% • Clinical review required`
  : currentPreset.confidenceTier}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 5-Grade Probability Bars */}
                  <div className="lg:col-span-7 bg-slate-50/90 dark:bg-navy-950/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3.5 flex flex-col justify-center">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 pb-1">
                      <span>ICDR Grade &amp; Severity</span>
                      <span>Ensemble Probability</span>
                    </div>

                    {(predictionResult
    ? [
        { grade: 0, label: "No DR", pct: predictionResult.class_probabilities["No DR"], textColor: "text-slate-600", barColor: "bg-slate-500" },
        { grade: 1, label: "Mild", pct: predictionResult.class_probabilities["Mild"], textColor: "text-blue-600", barColor: "bg-blue-500" },
        { grade: 2, label: "Moderate", pct: predictionResult.class_probabilities["Moderate"], textColor: "text-amber-600", barColor: "bg-amber-500" },
        { grade: 3, label: "Severe", pct: predictionResult.class_probabilities["Severe"], textColor: "text-orange-600", barColor: "bg-orange-500" },
        { grade: 4, label: "Proliferative DR", pct: predictionResult.class_probabilities["Proliferative DR"], textColor: "text-red-600", barColor: "bg-red-500" },
      ]
    : currentPreset.probs
     ).map((item) => (
                      <div key={item.grade} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className={`font-semibold ${item.textColor}`}>
                            Grade {item.grade}: {item.label}
                          </span>
                          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                            {item.pct.toFixed(1)}%
                          </span>
                        </div>
                        <div
                          className="w-full h-2.5 rounded-full bg-slate-200/90 dark:bg-slate-800 overflow-hidden"
                          role="progressbar"
                          aria-valuenow={item.pct}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          <div
                            className={`h-full rounded-full ${item.barColor} transition-all duration-700 ease-out`}
                            style={{ width: `${item.pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-6 p-8 text-center bg-slate-50/50 dark:bg-navy-950/40 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Click <strong>Analyze Scan</strong> in Step 1 to generate CNN predictions and Grad-CAM saliency.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ==================================================================
              STEP 3: STRUCTURED CLINICAL LLM REPORT
              ================================================================== */}
          <div className="relative">
            {/* Step 3 Number Indicator */}
            <div
              className={`absolute -left-6 sm:-left-10 top-6 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-md ring-4 ring-slate-50 dark:ring-navy-950 ${
                hasAnalyzed
                  ? "bg-teal-600 text-white"
                  : "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
              }`}
            >
              3
            </div>

            <div className="bg-white dark:bg-navy-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-7 shadow-glass dark:shadow-glass-dark">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-slate-800">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-lg sm:text-xl font-bold text-navy-900 dark:text-white">
                    Structured Clinical LLM Report
                  </h2>
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800/80 font-semibold">
                    Groq LPU
                  </span>
                </div>
                <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                  Stage 2 • ~1.5s
                </span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Schema-grounded clinical narrative synthesized from CNN probability distribution across six prompting techniques
              </p>

              {/* Prompt Strategy Tabs */}
              <div className="mt-5 flex flex-wrap gap-1.5" role="tablist">
                {PROMPT_TECHNIQUES.map((tech) => {
                  const active = tech.id === selectedPromptTech;
                  return (
                    <button
                      key={tech.id}
                      type="button"
                      onClick={() => setSelectedPromptTech(tech.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        active
                          ? "bg-teal-600 text-white shadow-xs"
                          : "bg-slate-100 dark:bg-navy-950 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-teal-400"
                      }`}
                    >
                      {tech.name}
                    </button>
                  );
                })}
              </div>

              {/* Clinical Report Card */}
              <div className="mt-4 bg-slate-50 dark:bg-navy-950/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/80 dark:border-slate-800 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      Strategy: {currentTech.name}
                    </span>
                    <span className="font-mono text-[11px] text-teal-700 dark:text-teal-400">
                      ({currentTech.tag})
                    </span>
                    {isGeneratingReport && !generatedReports[selectedPromptTech.replace(/-/g, "_")] && (
                      <span className="inline-flex items-center gap-1.5 text-[10px] text-teal-600 dark:text-teal-300 font-semibold px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/80 border border-teal-200/60 dark:border-teal-800/60 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-ping" />
                        Generating with Groq LPU...
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyReport}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/80 border border-teal-200/70 dark:border-teal-800/70 hover:bg-teal-100 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    <span>{copiedReport ? "Copied!" : "Copy Report"}</span>
                  </button>
                </div>
                <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
  {showFullReport
    ? currentTech.reportText
    : `${currentTech.reportText.slice(0, 220)}${currentTech.reportText.length > 220 ? "..." : ""}`}
</div>

{currentTech.reportText.length > 220 && (
  <button
    type="button"
    onClick={() => setShowFullReport((prev) => !prev)}
    className="mt-3 text-sm font-semibold text-teal-700 dark:text-teal-400 hover:underline"
  >
    {showFullReport ? "Show Less" : "View Full Report"}
  </button>
)}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Clinical Disclaimer */}
        <div className="mt-12 text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
          <svg className="w-4 h-4 text-amber-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>Screening aid, not a medical diagnosis. Always correlate with clinical examination.</span>
        </div>
      </main>
    </div>
  );
}

export default Analyze;
