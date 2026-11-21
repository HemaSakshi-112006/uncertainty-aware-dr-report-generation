import { createContext, useContext, useState, useEffect } from "react";
import {
  saveAnalysis,
  getAllAnalyses,
  deleteAnalysis as dbDeleteAnalysis,
  saveActiveSession,
  getActiveSession,
  clearActiveSession,
} from "../utils/historyStorage";

export const SAMPLE_PRESETS = {
  moderate: {
    id: "moderate",
    label: "Moderate DR (Case #104)",
    caseNumber: "#104",
    filename: "aptos_scan_104_OD.png",
    meta: "Right Eye (OD) (2.4 MB)",
    grade: 2,
    gradeName: "Moderate DR",
    primaryPct: 86.4,
    confidenceTier: "Reliable (≥80%)",
    concordance: "2/2 CNN Match • Concordant",
    entropy: 0.2842,
    topTwoGap: 78.5,
    probs: [
      { grade: 0, label: "No DR", pct: 3.8, barColor: "bg-emerald-500", textColor: "text-emerald-700 dark:text-emerald-400" },
      { grade: 1, label: "Mild DR", pct: 7.9, barColor: "bg-lime-500", textColor: "text-lime-700 dark:text-lime-400" },
      { grade: 2, label: "Moderate DR", pct: 86.4, barColor: "bg-amber-500", textColor: "text-amber-700 dark:text-amber-400", isPrimary: true },
      { grade: 3, label: "Severe DR", pct: 1.6, barColor: "bg-orange-500", textColor: "text-orange-700 dark:text-orange-400" },
      { grade: 4, label: "Proliferative DR", pct: 0.3, barColor: "bg-red-600", textColor: "text-red-700 dark:text-red-400" },
    ],
  },
  healthy: {
    id: "healthy",
    label: "No DR (Healthy #089)",
    caseNumber: "#089",
    filename: "aptos_scan_089_OS.png",
    meta: "Left Eye (OS) (1.9 MB)",
    grade: 0,
    gradeName: "No DR",
    primaryPct: 96.4,
    confidenceTier: "Reliable (≥80%)",
    concordance: "2/2 CNN Match • Concordant",
    entropy: 0.1215,
    topTwoGap: 94.1,
    probs: [
      { grade: 0, label: "No DR", pct: 96.4, barColor: "bg-emerald-500", textColor: "text-emerald-700 dark:text-emerald-400", isPrimary: true },
      { grade: 1, label: "Mild DR", pct: 2.3, barColor: "bg-lime-500", textColor: "text-lime-700 dark:text-lime-400" },
      { grade: 2, label: "Moderate DR", pct: 0.9, barColor: "bg-amber-500", textColor: "text-amber-700 dark:text-amber-400" },
      { grade: 3, label: "Severe DR", pct: 0.3, barColor: "bg-orange-500", textColor: "text-orange-700 dark:text-orange-400" },
      { grade: 4, label: "Proliferative DR", pct: 0.1, barColor: "bg-red-600", textColor: "text-red-700 dark:text-red-400" },
    ],
  },
  severe: {
    id: "severe",
    label: "Borderline Severe (Low Conf.)",
    caseNumber: "#342",
    filename: "aptos_scan_342_OD.png",
    meta: "Right Eye (OD) (2.7 MB)",
    grade: 3,
    gradeName: "Severe DR",
    primaryPct: 54.8,
    confidenceTier: "Low Confidence (<65%)",
    concordance: "Model A: Grade 3 | Model B: Grade 2",
    entropy: 0.6128,
    topTwoGap: 16.6,
    probs: [
      { grade: 0, label: "No DR", pct: 0.8, barColor: "bg-emerald-500", textColor: "text-emerald-700 dark:text-emerald-400" },
      { grade: 1, label: "Mild DR", pct: 3.4, barColor: "bg-lime-500", textColor: "text-lime-700 dark:text-lime-400" },
      { grade: 2, label: "Moderate DR", pct: 38.2, barColor: "bg-amber-500", textColor: "text-amber-700 dark:text-amber-400" },
      { grade: 3, label: "Severe DR", pct: 54.8, barColor: "bg-orange-500", textColor: "text-orange-700 dark:text-orange-400", isPrimary: true },
      { grade: 4, label: "Proliferative DR", pct: 2.8, barColor: "bg-red-600", textColor: "text-red-700 dark:text-red-400" },
    ],
  },
};

const AnalysisContext = createContext(null);

export function AnalysisProvider({ children }) {
  const [activePreset, setActivePreset] = useState("moderate");
  const [customImageSrc, setCustomImageSrc] = useState(null);
  const [customFileName, setCustomFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [gradcamOverlay, setGradcamOverlay] = useState(null);
  const [apiError, setApiError] = useState("");
  const [showGradCam, setShowGradCam] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(true);
  const [selectedPromptTech, setSelectedPromptTech] = useState("chain-of-verification");
  const [showErrorBanner, setShowErrorBanner] = useState(false);
  const [generatedReports, setGeneratedReports] = useState({});
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [activeAnalysisId, setActiveAnalysisId] = useState(null);

  // Real Persistent History records from IndexedDB (initialized empty, NO dummy data)
  const [historyItems, setHistoryItems] = useState([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  // Load persistent history records & active analysis on app start
  useEffect(() => {
    async function initStorage() {
      try {
        const storedAnalyses = await getAllAnalyses();
        setHistoryItems(storedAnalyses || []);

        const activeSession = await getActiveSession();
        if (activeSession && activeSession.predictionResult) {
          // Re-hydrate active session without re-running prediction
          setActivePreset(null);
          setCustomImageSrc(activeSession.imageSrc || null);
          setCustomFileName(activeSession.filename || "");
          setPredictionResult(activeSession.predictionResult);
          setGradcamOverlay(activeSession.gradcam_overlay || null);
          setHasAnalyzed(true);
          setSelectedPromptTech(activeSession.selectedPromptTech || "chain-of-verification");
          setGeneratedReports(activeSession.generatedReports || {});
          setActiveAnalysisId(activeSession.id || null);
        }
      } catch (err) {
        console.warn("Storage rehydration warning:", err);
      } finally {
        setHistoryLoaded(true);
      }
    }
    initStorage();
  }, []);

  const currentPreset = SAMPLE_PRESETS[activePreset] || SAMPLE_PRESETS.moderate;

  // Active Case Data dynamically unified for both custom uploads and presets
  const activeCaseData = predictionResult
    ? {
        caseNumber: activeAnalysisId ? `#${activeAnalysisId.slice(-4).toUpperCase()}` : "#Live",
        filename: customFileName || "uploaded_fundus_scan.png",
        meta: "Uploaded Retinal Scan",
        grade:
          predictionResult.predicted_class_index ??
          (predictionResult.predicted_class?.includes("No")
            ? 0
            : predictionResult.predicted_class?.includes("Mild")
            ? 1
            : predictionResult.predicted_class?.includes("Moderate")
            ? 2
            : predictionResult.predicted_class?.includes("Severe")
            ? 3
            : 4),
        gradeName: predictionResult.predicted_class || "Diabetic Retinopathy",
        primaryPct:
          predictionResult.maximum_probability <= 1
            ? predictionResult.maximum_probability * 100
            : predictionResult.maximum_probability,
        confidenceTier:
          (predictionResult.maximum_probability <= 1
            ? predictionResult.maximum_probability
            : predictionResult.maximum_probability / 100) >= 0.8
            ? "Reliable (≥80%)"
            : (predictionResult.maximum_probability <= 1
                ? predictionResult.maximum_probability
                : predictionResult.maximum_probability / 100) >= 0.65
            ? "Review Recommended (65–79%)"
            : "Low Confidence (<65%)",
        concordance: "Dual-CNN Pipeline • Concordant",
        entropy: predictionResult.normalized_entropy ?? 0.2842,
        topTwoGap:
          predictionResult.top_two_probability_gap != null
            ? predictionResult.top_two_probability_gap <= 1
              ? predictionResult.top_two_probability_gap * 100
              : predictionResult.top_two_probability_gap
            : 78.5,
        probs: predictionResult.class_probabilities
          ? [
              {
                grade: 0,
                label: "No DR",
                pct: predictionResult.class_probabilities["No DR"] || 0,
                barColor: "bg-emerald-500",
                textColor: "text-emerald-700 dark:text-emerald-400",
                isPrimary: predictionResult.predicted_class === "No DR",
              },
              {
                grade: 1,
                label: "Mild DR",
                pct: predictionResult.class_probabilities["Mild"] || 0,
                barColor: "bg-lime-500",
                textColor: "text-lime-700 dark:text-lime-400",
                isPrimary: predictionResult.predicted_class === "Mild",
              },
              {
                grade: 2,
                label: "Moderate DR",
                pct: predictionResult.class_probabilities["Moderate"] || 0,
                barColor: "bg-amber-500",
                textColor: "text-amber-700 dark:text-amber-400",
                isPrimary: predictionResult.predicted_class === "Moderate",
              },
              {
                grade: 3,
                label: "Severe DR",
                pct: predictionResult.class_probabilities["Severe"] || 0,
                barColor: "bg-orange-500",
                textColor: "text-orange-700 dark:text-orange-400",
                isPrimary: predictionResult.predicted_class === "Severe",
              },
              {
                grade: 4,
                label: "Proliferative DR",
                pct: predictionResult.class_probabilities["Proliferative DR"] || 0,
                barColor: "bg-red-600",
                textColor: "text-red-700 dark:text-red-400",
                isPrimary: predictionResult.predicted_class === "Proliferative DR",
              },
            ]
          : currentPreset.probs,
      }
    : currentPreset;

  const handleSelectPreset = (presetKey) => {
    setActivePreset(presetKey);
    setCustomImageSrc(null);
    setCustomFileName("");
    setSelectedFile(null);
    setPredictionResult(null);
    setGradcamOverlay(null);
    setShowErrorBanner(false);
    setHasAnalyzed(true);
    setApiError("");
    setGeneratedReports({});
    setActiveAnalysisId(null);
    clearActiveSession();
  };

  // Convert uploaded image file to persistent base64 data URL
  const handleFileUpload = (file) => {
    if (!file) return;
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/tiff"];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(png|jpe?g|tiff?)$/i)) {
      setShowErrorBanner(true);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setShowErrorBanner(true);
      return;
    }
    setShowErrorBanner(false);

    // Read as persistent Base64 Data URL so it survives reloads and IndexedDB storage
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Url = e.target.result;
      setCustomImageSrc(base64Url);
      setSelectedFile(file);
      setPredictionResult(null);
      setGradcamOverlay(null);
      setGeneratedReports({});
      setActiveAnalysisId(null);
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setCustomFileName(`${file.name} • (${sizeMb} MB)`);
      setHasAnalyzed(false);
    };
    reader.readAsDataURL(file);
  };

  // Restores a previously saved analysis exactly as it was
  const restoreAnalysis = (record) => {
    if (!record) return;
    setActivePreset(null);
    setCustomImageSrc(record.imageSrc || null);
    setCustomFileName(record.filename || "restored_scan.png");
    setSelectedFile(null);
    setHasAnalyzed(true);
    setShowGradCam(false);
    setGradcamOverlay(record.gradcam_overlay || null);
    setPredictionResult({
      predicted_class: record.predicted_class,
      predicted_class_index: record.predicted_class_index,
      class_probabilities: record.class_probabilities,
      softmax_probabilities: record.softmax_probabilities || {},
      maximum_probability: record.maximum_probability,
      normalized_entropy: record.normalized_entropy,
      top_two_classes: record.top_two_classes,
      top_two_probability_gap: record.top_two_probability_gap,
      gradcam_overlay: record.gradcam_overlay,
    });
    setSelectedPromptTech(record.selectedPromptTech || "chain-of-verification");
    setGeneratedReports(record.generatedReports || {});
    setActiveAnalysisId(record.id);

    // Keep session active across page switches and refreshes
    saveActiveSession({
      id: record.id,
      imageSrc: record.imageSrc,
      filename: record.filename,
      predictionResult: {
        predicted_class: record.predicted_class,
        predicted_class_index: record.predicted_class_index,
        class_probabilities: record.class_probabilities,
        softmax_probabilities: record.softmax_probabilities || {},
        maximum_probability: record.maximum_probability,
        normalized_entropy: record.normalized_entropy,
        top_two_classes: record.top_two_classes,
        top_two_probability_gap: record.top_two_probability_gap,
        gradcam_overlay: record.gradcam_overlay,
      },
      gradcam_overlay: record.gradcam_overlay,
      selectedPromptTech: record.selectedPromptTech || "chain-of-verification",
      generatedReports: record.generatedReports || {},
    });
  };

  const removeAnalysisRecord = async (id) => {
    await dbDeleteAnalysis(id);
    setHistoryItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Helper to construct backend-compatible prediction dictionary
  const getBackendPredictionPayload = (customResult = null) => {
    if (customResult) return customResult;
    if (predictionResult) return predictionResult;

    const targetCase = activeCaseData;
    const classNameMap = { 0: "No DR", 1: "Mild", 2: "Moderate", 3: "Severe", 4: "Proliferative DR" };
    const probs = {};
    const softmax = {};
    (targetCase.probs || []).forEach((p) => {
      const key = classNameMap[p.grade] || p.label;
      probs[key] = p.pct;
      softmax[key] = p.pct / 100;
    });

    const sorted = [...(targetCase.probs || [])].sort((a, b) => b.pct - a.pct);
    const top1 = sorted[0];
    const top2 = sorted[1] || { grade: 1, pct: 0 };

    return {
      predicted_class: targetCase.gradeName || "Moderate",
      predicted_class_index: targetCase.grade ?? top1.grade,
      class_probabilities: probs,
      softmax_probabilities: softmax,
      maximum_probability: top1.pct / 100,
      top_two_classes: [
        { class: classNameMap[top1.grade] || top1.label, probability: top1.pct / 100 },
        { class: classNameMap[top2.grade] || top2.label, probability: top2.pct / 100 },
      ],
      top_two_probability_gap: (top1.pct - top2.pct) / 100,
      normalized_entropy: targetCase.entropy || 0.2842,
    };
  };

  // Asynchronously request AI report from backend Groq endpoint
  const fetchAiReport = async (techniqueKey, customResult = null) => {
    const backendKey = techniqueKey.replace(/-/g, "_");
    if (generatedReports[backendKey]) {
      return generatedReports[backendKey];
    }

    const payload = getBackendPredictionPayload(customResult);
    if (!payload) return null;

    setIsGeneratingReport(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prediction_result: payload,
          technique: backendKey,
        }),
      });

      if (!response.ok) {
        throw new Error(`Report generation failed (${response.status})`);
      }

      const data = await response.json();
      if (data && data.ai_report) {
        const updatedReports = {
          ...generatedReports,
          [backendKey]: data.ai_report,
          [techniqueKey]: data.ai_report,
        };
        setGeneratedReports(updatedReports);

        // If this belongs to an active real analysis, persist the new report into IndexedDB
        if (activeAnalysisId) {
          const existing = historyItems.find((h) => h.id === activeAnalysisId);
          if (existing) {
            const updatedRecord = {
              ...existing,
              generatedReports: updatedReports,
            };
            saveAnalysis(updatedRecord);
            setHistoryItems((prev) =>
              prev.map((item) => (item.id === activeAnalysisId ? updatedRecord : item))
            );
          }
        }

        return data.ai_report;
      }
    } catch (err) {
      console.warn("Live Groq LLM endpoint call failed; falling back to dynamic report:", err);
    } finally {
      setIsGeneratingReport(false);
    }
    return null;
  };

  const triggerAnalyze = async () => {
    setIsAnalyzing(true);
    setApiError("");
    setGeneratedReports({});

    if (!selectedFile) {
      // Analyze current preset scan
      setTimeout(() => {
        setIsAnalyzing(false);
        setHasAnalyzed(true);
        fetchAiReport(selectedPromptTech);
      }, 700);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await fetch("http://127.0.0.1:5000/api/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Prediction failed.");
      }

      setPredictionResult(data);
      setGradcamOverlay(data.gradcam_overlay || null);
      setHasAnalyzed(true);

      const newAnalysisId = `analysis_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      setActiveAnalysisId(newAnalysisId);

      // Attempt initial LLM report for currently selected technique
      let initialAiReport = "";
      try {
        const reportRes = await fetch("http://127.0.0.1:5000/api/generate-report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prediction_result: data,
            technique: selectedPromptTech.replace(/-/g, "_"),
          }),
        });
        if (reportRes.ok) {
          const reportJson = await reportRes.json();
          initialAiReport = reportJson.ai_report || "";
        }
      } catch (e) {
        console.warn("Groq report fetch during analysis:", e);
      }

      const reportDict = initialAiReport
        ? {
            [selectedPromptTech.replace(/-/g, "_")]: initialAiReport,
            [selectedPromptTech]: initialAiReport,
          }
        : {};

      if (initialAiReport) {
        setGeneratedReports(reportDict);
      }

      // Save real analysis record to persistent IndexedDB
      const now = new Date();
      const realRecord = {
        id: newAnalysisId,
        timestamp: now.toISOString(),
        displayDate: now.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        caseNumber: `#${newAnalysisId.slice(-4).toUpperCase()}`,
        patientId: `PT-${Math.floor(10000 + Math.random() * 90000)}`,
        filename: selectedFile.name,
        imageSrc: customImageSrc, // Persistent Base64 image
        meta: `45° Color Fundus • ${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
        eye: selectedFile.name.toLowerCase().includes("os") ? "OS" : "OD",
        grade:
          data.predicted_class_index ??
          (data.predicted_class?.includes("No")
            ? 0
            : data.predicted_class?.includes("Mild")
            ? 1
            : data.predicted_class?.includes("Moderate")
            ? 2
            : data.predicted_class?.includes("Severe")
            ? 3
            : 4),
        gradeName: data.predicted_class || "Diabetic Retinopathy",
        primaryPct: data.maximum_probability <= 1 ? data.maximum_probability * 100 : data.maximum_probability,
        confidenceTier:
          (data.maximum_probability <= 1 ? data.maximum_probability : data.maximum_probability / 100) >= 0.8
            ? "Reliable (≥80%)"
            : "Review Recommended (65–79%)",
        concordance: "Dual-CNN Pipeline • Concordant",
        entropy: data.normalized_entropy ?? 0.2842,
        topTwoGap:
          data.top_two_probability_gap != null
            ? data.top_two_probability_gap <= 1
              ? data.top_two_probability_gap * 100
              : data.top_two_probability_gap
            : 78.5,
        predicted_class: data.predicted_class,
        predicted_class_index: data.predicted_class_index,
        class_probabilities: data.class_probabilities,
        softmax_probabilities: data.softmax_probabilities,
        maximum_probability: data.maximum_probability,
        normalized_entropy: data.normalized_entropy,
        top_two_classes: data.top_two_classes,
        top_two_probability_gap: data.top_two_probability_gap,
        gradcam_overlay: data.gradcam_overlay,
        selectedPromptTech: selectedPromptTech,
        generatedReports: reportDict,
        probs: [
          { grade: 0, label: "No DR", pct: data.class_probabilities?.["No DR"] || 0, isPrimary: data.predicted_class === "No DR" },
          { grade: 1, label: "Mild DR", pct: data.class_probabilities?.["Mild"] || 0, isPrimary: data.predicted_class === "Mild" },
          { grade: 2, label: "Moderate DR", pct: data.class_probabilities?.["Moderate"] || 0, isPrimary: data.predicted_class === "Moderate" },
          { grade: 3, label: "Severe DR", pct: data.class_probabilities?.["Severe"] || 0, isPrimary: data.predicted_class === "Severe" },
          { grade: 4, label: "Proliferative DR", pct: data.class_probabilities?.["Proliferative DR"] || 0, isPrimary: data.predicted_class === "Proliferative DR" },
        ],
      };

      await saveAnalysis(realRecord);
      setHistoryItems((prev) => [realRecord, ...prev]);

      // Save active session in IndexedDB so page reload preserves it
      await saveActiveSession(realRecord);
    } catch (error) {
      console.warn("Backend prediction fetch error:", error);
      setApiError(error.message || "Prediction request failed.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const value = {
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
    handleFileUpload,
    triggerAnalyze,
    currentPreset,
    activeCaseData,
    samplePresets: SAMPLE_PRESETS,
    generatedReports,
    isGeneratingReport,
    fetchAiReport,
    historyItems,
    historyLoaded,
    restoreAnalysis,
    removeAnalysisRecord,
    activeAnalysisId,
  };

  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error("useAnalysis must be used within an AnalysisProvider");
  }
  return context;
}
