import React from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Flame, 
  Droplets, 
  Sun, 
  CheckCircle2, 
  Leaf, 
  RefreshCcw, 
  Share2, 
  Download, 
  Check, 
  Activity,
  Scissors
} from 'lucide-react';
import { PredictionResult } from '../types';

interface PlantDiseaseReportProps {
  prediction: PredictionResult;
  uploadedImage: string | null;
  onScanAnother: () => void;
  onAskAI: (initialPrompt?: string) => void;
  onShare: () => void;
  onExportPDF: () => void;
  isCopied: boolean;
  isExporting: boolean;
}

export function PlantDiseaseReport({
  prediction,
  uploadedImage,
  onScanAnother,
  onAskAI,
  onShare,
  onExportPDF,
  isCopied,
  isExporting
}: PlantDiseaseReportProps) {
  const isHealthy = prediction.healthStatus === 'Healthy' || prediction.severity === 'None';
  const severity = prediction.severity || (isHealthy ? 'None' : 'Moderate');

  const severityBadgeColor = {
    None: 'bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border-zinc-300 dark:border-zinc-700',
    Mild: 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-400 dark:border-zinc-600',
    Moderate: 'bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-950 border-zinc-900 dark:border-zinc-100',
    High: 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 border-zinc-950 dark:border-white',
    Critical: 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white',
  }[severity] || 'bg-zinc-800 text-white border-zinc-900';

  return (
    <div className="space-y-4 animate-fade-in">
      {/* 1. TOP DIAGNOSIS BANNER */}
      <div className="botanical-glass-panel p-4 sm:p-5 rounded-3xl relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {uploadedImage && (
            <div className="md:col-span-4 flex flex-col items-center">
              <div className="w-full max-w-[200px] aspect-square rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-100 shadow-sm relative group">
                <img
                  src={uploadedImage}
                  alt="Scanned Plant Leaf"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1 rounded-lg bg-zinc-950/85 backdrop-blur-xl border border-white/15 text-white text-[10px] font-semibold flex items-center justify-between tabular-nums">
                  <span>Scanned Leaf</span>
                  <span className="font-bold">{prediction.confidenceScore}% Match</span>
                </div>
              </div>
            </div>
          )}

          <div className={uploadedImage ? 'md:col-span-8 space-y-2.5' : 'md:col-span-12 space-y-2.5'}>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider rounded-full bg-zinc-950 text-white">
                Leaf Diagnosis
              </span>
              <span className={`px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-full border ${severityBadgeColor}`}>
                Severity: {severity}
              </span>
              <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-zinc-100 text-zinc-800 border border-zinc-200 tabular-nums">
                Accuracy: {prediction.confidenceScore}%
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
                Plant Species
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight break-words">
                {prediction.plantName}
              </h2>
            </div>

            <div className="p-4 rounded-2xl border border-zinc-200 bg-zinc-50">
              <div className="flex items-center gap-2 mb-1">
                {isHealthy ? (
                  <ShieldCheck className="w-5 h-5 text-zinc-900" />
                ) : (
                  <ShieldAlert className="w-5 h-5 text-zinc-900" />
                )}
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Diagnosed Condition
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-zinc-950">
                {prediction.diseaseName || (isHealthy ? 'None - Healthy Leaf' : 'Plant Leaf Infection')}
              </h3>
              {prediction.predictionSummary && (
                <p className="text-xs sm:text-sm text-zinc-600 mt-1 leading-relaxed font-medium">
                  {prediction.predictionSummary}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. DETECTED DISEASE & SYMPTOMS */}
      <div className="botanical-glass-panel p-4 sm:p-5 rounded-3xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-2.5">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-zinc-950 text-white flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-zinc-950 tracking-tight">
                1. Detected Disease &amp; Visual Foliage Symptoms
              </h3>
              <p className="text-[11px] text-zinc-500">
                Pathology markers identified on the scanned plant foliage
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-zinc-100 text-zinc-900 border border-zinc-200">
            {prediction.diseaseName}
          </span>
        </div>

        <div>
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2.5">
            Observed Foliage Traits &amp; Visual Symptoms
          </span>
          {Array.isArray(prediction.symptoms) && prediction.symptoms.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {prediction.symptoms.map((symptom, idx) => (
                <div
                  key={idx}
                  className="botanical-glass-card p-3.5 rounded-2xl flex items-start space-x-3 text-xs text-zinc-800"
                >
                  {isHealthy ? (
                    <div className="w-5 h-5 rounded-lg bg-zinc-950 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-lg bg-zinc-100 text-zinc-900 flex items-center justify-center shrink-0 mt-0.5 border border-zinc-300">
                      <AlertTriangle className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <span className="font-semibold leading-relaxed">{symptom}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-zinc-100 border border-zinc-200 text-zinc-900 text-xs font-semibold flex items-center space-x-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Leaves show uniform pigmentation and no visible spots or lesions.</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. DISEASE CAUSES & PATHOGEN TRANSMISSION */}
      <div className="botanical-glass-panel p-4 sm:p-5 rounded-3xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-2.5">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-zinc-950 text-white flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-zinc-950 tracking-tight">
                2. Disease Causes &amp; Pathogen Transmission
              </h3>
              <p className="text-[11px] text-zinc-500">
                Primary causes, pathogen origins, and environmental triggering factors
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-zinc-100 text-zinc-900 border border-zinc-200">
            {prediction.causes?.pathogenType || 'Environmental / Microbial Factor'}
          </span>
        </div>

        <div className="p-4 rounded-2xl botanical-glass-card">
          <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
            Pathogen &amp; Causative Agent
          </span>
          <p className="text-xs font-extrabold text-zinc-950">
            {prediction.causes?.pathogenType || 'Microbial fungal spores and environmental stress'}
          </p>
          {prediction.causes?.environmentalFactors && (
            <p className="text-xs text-zinc-600 mt-1.5 leading-relaxed font-medium">
              {prediction.causes.environmentalFactors}
            </p>
          )}
        </div>

        <div>
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2.5">
            Key Contributing Causes
          </span>
          <div className="space-y-2">
            {(Array.isArray(prediction.causes?.rootCauses) && prediction.causes.rootCauses.length > 0 ? prediction.causes.rootCauses : [
              'High moisture on leaf surface from overhead spraying or evening dew',
              'Contaminated garden soil splashing onto bottom foliage during heavy waterings',
              'Stagnant airflow and poor spacing between stems allowing fungal spores to germinate',
              'Stressed plant immune resistance due to temporary sunlight or nutrient imbalance'
            ]).map((cause, idx) => (
              <div
                key={idx}
                className="botanical-glass-card p-3.5 rounded-2xl text-xs text-zinc-800 flex items-start space-x-3"
              >
                <div className="w-6 h-6 rounded-xl bg-zinc-950 text-white flex items-center justify-center shrink-0 font-bold text-[11px]">
                  {idx + 1}
                </div>
                <span className="font-semibold leading-relaxed pt-0.5">{cause}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. TARGETED CURE & CARE PLAN */}
      <div className="botanical-glass-panel p-4 sm:p-5 rounded-3xl space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-2.5">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-zinc-950 text-white flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-zinc-950 tracking-tight">
                3. Targeted Cure &amp; Comprehensive Care Plan
              </h3>
              <p className="text-[11px] text-zinc-500">
                Immediate Action, Organic Remedies, Fungicide, and Daily Care
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-zinc-950 text-white">
            Action Plan
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-zinc-100 border border-zinc-200 space-y-1.5">
          <div className="flex items-center space-x-2 text-zinc-950 font-bold text-xs sm:text-sm">
            <Scissors className="w-3.5 h-3.5 text-zinc-800" />
            <span>Immediate First-Aid Action (Contain &amp; Stop Spread)</span>
          </div>
          <p className="text-xs text-zinc-700 leading-relaxed font-semibold pl-5">
            {prediction.cureAndTreatment?.immediateAction ||
              'Sterilize garden scissors with rubbing alcohol and prune all affected leaves immediately. Dispose of infected foliage in the trash.'}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-zinc-950 font-bold text-xs sm:text-sm">
            <Leaf className="w-3.5 h-3.5 text-zinc-800" />
            <span>Natural &amp; Organic Remedies</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {(Array.isArray(prediction.cureAndTreatment?.organicRemedies) && prediction.cureAndTreatment.organicRemedies.length > 0 ? prediction.cureAndTreatment.organicRemedies : [
              'Cold-Pressed Neem Oil Spray: Mix 5ml neem oil with 2 drops mild soap in 1L water; spray on foliage every 5 days.',
              'Baking Soda & Potassium Bicarbonate: Dissolve 1 tsp baking soda in 1L water and mist leaves.',
              'Biological Fungicide: Inoculate soil with Trichoderma viride biological culture.',
              'Wood Ash or Diluted Sour Milk Spray: Natural anti-fungal barrier spray.'
            ]).map((remedy, idx) => (
              <div
                key={idx}
                className="botanical-glass-card p-3 rounded-2xl text-xs text-zinc-800 flex items-start space-x-2.5"
              >
                <div className="w-4 h-4 rounded-md bg-zinc-950 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3 h-3" />
                </div>
                <span className="font-semibold leading-relaxed text-[11px] sm:text-xs">{remedy}</span>
              </div>
            ))}
          </div>
        </div>

        {prediction.cureAndTreatment?.chemicalTreatment && (
          <div className="p-3.5 rounded-2xl botanical-glass-card space-y-1.5">
            <div className="flex items-center space-x-2 text-zinc-950 font-bold text-xs sm:text-sm">
              <Droplets className="w-3.5 h-3.5 text-zinc-800" />
              <span>Chemical Treatment &amp; Fungicide Guidance (If Severe)</span>
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed font-semibold pl-5">
              {prediction.cureAndTreatment.chemicalTreatment}
            </p>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-zinc-950 font-bold text-xs sm:text-sm">
            <Sun className="w-3.5 h-3.5 text-zinc-800" />
            <span>Daily Care Guidelines &amp; Disease Prevention</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {(Array.isArray(prediction.cureAndTreatment?.preventionAndCare) && prediction.cureAndTreatment.preventionAndCare.length > 0 ? prediction.cureAndTreatment.preventionAndCare : [
              'Water only at root base in early morning.',
              'Provide 6+ hours of bright natural sunlight.',
              'Maintain spacing between containers for airflow.',
              'Mulch potting soil surface with organic straw or coco peat.'
            ]).map((care, idx) => (
              <div
                key={idx}
                className="botanical-glass-card p-3 rounded-2xl text-xs text-zinc-700 flex items-start space-x-2.5"
              >
                <div className="w-2 h-2 rounded-full bg-zinc-900 shrink-0 mt-1" />
                <span className="font-medium leading-relaxed text-[11px] sm:text-xs">{care}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. BOTTOM ACTIONS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onShare}
            className="flex-1 sm:flex-none bg-white hover:bg-zinc-50 border border-zinc-200 flex items-center justify-center space-x-2 px-5 py-3 text-zinc-900 font-bold text-xs rounded-full transition-all cursor-pointer active:scale-95"
          >
            {isCopied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            <span>{isCopied ? 'Link Copied!' : 'Share Diagnosis'}</span>
          </button>

          <button
            type="button"
            onClick={onExportPDF}
            disabled={isExporting}
            className="flex-1 sm:flex-none bg-white hover:bg-zinc-50 border border-zinc-200 flex items-center justify-center space-x-2 px-5 py-3 text-zinc-900 font-bold text-xs rounded-full transition-all cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Exporting...' : 'Export PDF'}</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onScanAnother}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 px-7 py-3 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs rounded-full transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <RefreshCcw className="w-4 h-4" />
          <span>Scan Another Plant Leaf</span>
        </button>
      </div>
    </div>
  );
}

export default PlantDiseaseReport;
