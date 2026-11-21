import { jsPDF } from "jspdf";

/**
 * Generates and downloads a clinical PDF report for a given prompting technique and case.
 */
export function generateClinicalPDF({ technique, caseData }) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = 18;

  // Header Bar
  doc.setFillColor(10, 25, 47); // Navy #0a192f
  doc.rect(margin, y, contentWidth, 20, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text("RetinaScan AI — Clinical DR Screening Report", margin + 6, y + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(20, 184, 166); // Teal #14b8a6
  doc.text("Dual-ResNet50 Computer Vision Ensemble + Groq LPU Clinical Reporting", margin + 6, y + 14);

  y += 26;

  // Case Metadata Box
  doc.setFillColor(248, 250, 252); // Slate-50
  doc.setDrawColor(226, 232, 240); // Slate-200
  doc.roundedRect(margin, y, contentWidth, 20, 2, 2, "FD");

  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "bold");
  doc.text("CASE METADATA", margin + 5, y + 6);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(15, 23, 42);
  const caseId = caseData?.caseNumber || "#104";
  const filename = caseData?.filename || "aptos_scan_104_OD.png";
  const dateStr = new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  doc.text(`Case ID: APTOS-2019 ${caseId}`, margin + 5, y + 11);
  doc.text(`File: ${filename}`, margin + 5, y + 16);

  doc.text(`Date: ${dateStr}`, margin + 70, y + 11);
  doc.text(`Modality: 45° Color Fundus (OD)`, margin + 70, y + 16);

  doc.text(`Ensemble: 2x ResNet50`, margin + 130, y + 11);
  doc.text(`Prompt Strategy: ${technique?.name || "Verified"}`, margin + 130, y + 16);

  y += 25;

  // Primary Classification Card
  doc.setFillColor(240, 253, 250); // Teal-50
  doc.setDrawColor(153, 246, 228); // Teal-200
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(13, 148, 136); // Teal-600
  doc.text("PRIMARY PREDICTION (STAGE 1 CNN ENSEMBLE)", margin + 5, y + 6);

  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  const gradeName = caseData?.gradeName || "Diabetic Retinopathy";
  const primaryPct = typeof caseData?.primaryPct === "number" ? caseData.primaryPct.toFixed(1) : (caseData?.primaryPct || "0.0");
  doc.text(`${gradeName} — ${primaryPct}% Confidence`, margin + 5, y + 13);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  const concordance = caseData?.concordance || "2/2 CNN Match • Concordant";
  const tier = caseData?.confidenceTier || (parseFloat(primaryPct) >= 80 ? "Reliable (≥80%)" : "Review Recommended (65–79%)");
  doc.text(`Status: ${concordance}  |  Triage Tier: ${tier}`, margin + 5, y + 18);

  y += 28;

  // Probability Distribution Table
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text("5-Stage ICDR Softmax Probability Breakdown", margin, y);
  y += 4;

  const probs = (caseData?.probs && caseData.probs.length === 5)
    ? caseData.probs
    : [
        { grade: 0, label: "No DR", pct: 0 },
        { grade: 1, label: "Mild DR", pct: 0 },
        { grade: 2, label: "Moderate DR", pct: 0 },
        { grade: 3, label: "Severe DR", pct: 0 },
        { grade: 4, label: "Proliferative DR", pct: 0 },
      ];

  const maxProb = Math.max(...probs.map((x) => x.pct));
  const isHealthy = caseData?.grade === 0 || gradeName.includes("No");
  const colWidth = contentWidth / 5;

  probs.forEach((p, idx) => {
    const x = margin + idx * colWidth;
    const isPrimary = p.isPrimary || (p.pct === maxProb && maxProb > 0);
    if (isPrimary) {
      if (isHealthy) {
        doc.setFillColor(209, 250, 229); // emerald-100
        doc.setDrawColor(52, 211, 153);  // emerald-400
      } else {
        doc.setFillColor(254, 243, 199); // amber-100
        doc.setDrawColor(245, 158, 11);  // amber-500
      }
    } else {
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
    }
    doc.rect(x, y, colWidth, 12, "FD");

    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 116, 139);
    doc.text(`Grade ${p.grade}`, x + 3, y + 4.5);

    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`${p.pct.toFixed(1)}%`, x + 3, y + 9.5);
  });

  y += 18;

  // Prompt Engineering Technique Section
  doc.setFillColor(15, 35, 66); // Dark navy
  doc.rect(margin, y, contentWidth, 8, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text(`CLINICAL REPORT: ${technique?.name?.toUpperCase() || "CHAIN-OF-VERIFICATION"} (Latency: ${technique?.latency || "1.5s"})`, margin + 4, y + 5.5);

  y += 12;

  // Full Clinical Report Text
  const reportBody = technique?.fullReport || technique?.summary || "Full clinical assessment report.";
  const paragraphs = reportBody.split("\n\n");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);

  paragraphs.forEach((para) => {
    const lines = doc.splitTextToSize(para.trim(), contentWidth);
    const blockHeight = lines.length * 4.2;

    // Page break check
    if (y + blockHeight > pageHeight - 20) {
      doc.addPage();
      y = 18;
    }

    // Check if line is a heading
    if (para.startsWith("1.") || para.startsWith("2.") || para.startsWith("3.") || para.startsWith("4.") || para.startsWith("5.") || para.includes("REPORT (") || para.includes("Case ID:")) {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
    } else {
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
    }

    doc.text(lines, margin, y);
    y += blockHeight + 3;
  });

  // Footer Disclaimer on each page
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text("Screening aid, not a medical diagnosis. Always correlate with clinical examination by an ophthalmologist.", margin, pageHeight - 7);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 18, pageHeight - 7);
  }

  // Trigger download
  const safeTechName = (technique?.name || "Report").toLowerCase().replace(/[^a-z0-9]/g, "_");
  doc.save(`RetinaScan_${safeTechName}_${caseId.replace("#", "case")}.pdf`);
}
