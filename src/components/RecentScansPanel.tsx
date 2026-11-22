import React, { useState, useMemo, useEffect, memo } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  Clock,
  ArrowRight,
  X,
  Ruler,
  TrendingUp,
  Calendar,
  Sprout,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import type { HistoryItem } from '../types';

interface RecentScansPanelProps {
  history: HistoryItem[];
  onOpenFullReport: (item: HistoryItem) => void;
  onViewAllHistory?: () => void;
}

function getCleanPlantName(rawName?: string): string {
  if (!rawName) return 'Scanned Plant';
  const cleaned = rawName.replace(/\s*\([^)]*\)\s*/g, '').trim();
  return cleaned || rawName;
}

function getScientificSubtitle(item: HistoryItem): string | null {
  if (item.prediction?.scientificName) return item.prediction.scientificName;
  const match = item.prediction?.plantName?.match(/\(([^)]+)\)/);
  return match ? match[1] : null;
}

function formatShortDayDate(timestamp?: number): string {
  const date = new Date(timestamp || Date.now());
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

function formatFullDayDate(timestamp?: number): string {
  const date = new Date(timestamp || Date.now());
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export const RecentScansPanel = memo(function RecentScansPanel({
  history,
  onOpenFullReport,
  onViewAllHistory,
}: RecentScansPanelProps) {
  const [selectedScan, setSelectedScan] = useState<HistoryItem | null>(null);

  const recentItems = useMemo(() => history.slice(0, 3), [history]);

  useEffect(() => {
    if (!selectedScan) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedScan(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedScan]);

  if (recentItems.length === 0) return null;

  const isSelectedHealthy =
    !selectedScan ||
    selectedScan.prediction?.healthStatus === 'Healthy' ||
    selectedScan.prediction?.severity === 'None';

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="botanical-glass-panel p-4 sm:p-5 rounded-3xl space-y-3"
      aria-label="Recent Plant Scans"
    >
      {/* Header Row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-800 shrink-0">
            <Clock className="w-3.5 h-3.5" />
          </span>
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold tracking-tight text-zinc-950 leading-none">
              Recent Scans
            </h3>
            <p className="text-[10.5px] font-medium text-zinc-500 mt-0.5">
              Tap any plant to quick-preview
            </p>
          </div>
        </div>

        {onViewAllHistory && history.length > 0 && (
          <button
            type="button"
            onClick={onViewAllHistory}
            className="text-[11px] font-bold text-zinc-600 hover:text-zinc-950 px-2.5 py-1 rounded-full bg-zinc-100/80 hover:bg-zinc-200/70 transition-colors cursor-pointer"
          >
            View all ({history.length})
          </button>
        )}
      </div>

      {/* Neat Animated Scan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
        {recentItems.map((item, idx) => {
          const cleanName = getCleanPlantName(item.prediction?.plantName);
          const heightCm = item.prediction?.estimatedHeightCm;
          const status = item.prediction?.healthStatus || 'Healthy';
          const isHealthy = status === 'Healthy';

          return (
            <motion.button
              key={item.id}
              type="button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.28,
                delay: idx * 0.055,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileTap={{ scale: 0.975 }}
              onClick={() => setSelectedScan(item)}
              className="rgb-pink-glow rounded-[20px] text-left cursor-pointer focus:outline-none group will-change-transform"
            >
              <div className="rgb-pink-glow-surface w-full p-2.5 sm:p-3 rounded-[20px] bg-white border border-zinc-200/90 flex items-center gap-3 transition-colors group-hover:border-zinc-300">
                {/* Thumbnail */}
                <div className="relative w-13 h-13 rounded-2xl overflow-hidden shrink-0 bg-zinc-100 border border-zinc-200/80">
                  <img
                    src={item.image}
                    alt={cleanName}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300 ease-out"
                  />
                  <span
                    className={`absolute bottom-1 right-1 w-2 h-2 rounded-full ring-2 ring-white ${
                      isHealthy ? 'bg-zinc-900' : 'bg-pink-500'
                    }`}
                  />
                </div>

                {/* Clean Text Stack */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-extrabold text-[13px] sm:text-sm text-zinc-950 truncate leading-snug">
                    {cleanName}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-1 text-[11px] font-medium text-zinc-500 tabular-nums truncate">
                    <span className="font-semibold text-zinc-700">
                      {formatShortDayDate(item.timestamp)}
                    </span>
                    {heightCm ? (
                      <>
                        <span className="text-zinc-300">·</span>
                        <span>{heightCm.toFixed(1)} cm</span>
                      </>
                    ) : null}
                    <span className="text-zinc-300">·</span>
                    <span className={isHealthy ? 'text-zinc-600' : 'text-zinc-950 font-bold'}>
                      {status}
                    </span>
                  </div>
                </div>

                {/* Circular Arrow */}
                <span className="w-8 h-8 rounded-full bg-zinc-100 group-hover:bg-zinc-950 text-zinc-600 group-hover:text-white flex items-center justify-center shrink-0 transition-all duration-200">
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Animated Quick Preview Popup Modal */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {selectedScan && (
              <motion.div
                key="recent-scan-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                onClick={() => setSelectedScan(null)}
                className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/55 backdrop-blur-md"
                role="dialog"
                aria-modal="true"
                aria-label={getCleanPlantName(selectedScan.prediction?.plantName)}
              >
                <motion.div
                  key={selectedScan.id}
                  initial={{ opacity: 0, scale: 0.9, y: 18 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.93, y: 12 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full max-w-sm bg-white border border-zinc-200 rounded-[28px] overflow-hidden shadow-2xl"
                >
                  {/* Top Plant Photo Header */}
                  <div className="relative h-44 bg-zinc-100 overflow-hidden">
                    <motion.img
                      initial={{ scale: 1.06 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      src={selectedScan.image}
                      alt={getCleanPlantName(selectedScan.prediction?.plantName)}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent pointer-events-none" />

                    {/* Health Pill */}
                    <span
                      className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur-md border ${
                        isSelectedHealthy
                          ? 'bg-white/95 text-zinc-950 border-white/60'
                          : 'bg-zinc-950/90 text-white border-white/20'
                      }`}
                    >
                      {isSelectedHealthy ? (
                        <ShieldCheck className="w-3.5 h-3.5" />
                      ) : (
                        <ShieldAlert className="w-3.5 h-3.5" />
                      )}
                      <span>{selectedScan.prediction?.healthStatus || 'Healthy'}</span>
                    </span>

                    {/* Close Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedScan(null)}
                      aria-label="Close scan preview"
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-zinc-900 flex items-center justify-center shadow-sm cursor-pointer active:scale-95 transition-transform"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    {/* Title Overlay */}
                    <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                      <h3 className="text-lg font-extrabold leading-tight drop-shadow-xs">
                        {getCleanPlantName(selectedScan.prediction?.plantName)}
                      </h3>
                      {getScientificSubtitle(selectedScan) && (
                        <p className="text-[11px] italic text-white/85 mt-0.5">
                          {getScientificSubtitle(selectedScan)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-5 space-y-3.5">
                    {/* 3 Compact Telemetry Tiles */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-2.5 rounded-2xl bg-zinc-50 border border-zinc-200/80">
                        <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-zinc-500">
                          <Ruler className="w-3 h-3" />
                          <span>Height</span>
                        </div>
                        <div className="text-sm font-extrabold text-zinc-950 tabular-nums mt-1">
                          {selectedScan.prediction?.estimatedHeightCm
                            ? `${selectedScan.prediction.estimatedHeightCm.toFixed(1)} cm`
                            : '—'}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-2xl bg-zinc-50 border border-zinc-200/80">
                        <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-zinc-500">
                          <TrendingUp className="w-3 h-3" />
                          <span>7d Est.</span>
                        </div>
                        <div className="text-sm font-extrabold text-zinc-950 tabular-nums mt-1">
                          {selectedScan.prediction?.growthForecast?.day7Cm
                            ? `${selectedScan.prediction.growthForecast.day7Cm.toFixed(1)} cm`
                            : 'Steady'}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-2xl bg-zinc-50 border border-zinc-200/80">
                        <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-zinc-500">
                          <Calendar className="w-3 h-3" />
                          <span>Date</span>
                        </div>
                        <div className="text-xs font-extrabold text-zinc-950 tabular-nums mt-1.5 truncate">
                          {formatShortDayDate(selectedScan.timestamp)}
                        </div>
                      </div>
                    </div>

                    {/* Stage & Short Status Row */}
                    <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-1">
                      <div className="flex items-center justify-between gap-2 text-[11px]">
                        <span className="inline-flex items-center gap-1 font-bold text-zinc-600">
                          <Sprout className="w-3.5 h-3.5 text-zinc-700" />
                          <span>{selectedScan.prediction?.growthStage || 'Active Growth'}</span>
                        </span>
                        <span className="text-[10.5px] font-semibold text-zinc-500">
                          {formatFullDayDate(selectedScan.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-zinc-700 line-clamp-2 leading-relaxed">
                        {selectedScan.prediction?.diseaseName &&
                        !isSelectedHealthy
                          ? `Detected: ${selectedScan.prediction.diseaseName}`
                          : selectedScan.prediction?.predictionSummary ||
                            'Healthy specimen with steady forecasted growth.'}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          const target = selectedScan;
                          setSelectedScan(null);
                          onOpenFullReport(target);
                        }}
                        className="rgb-pink-glow-dark flex-1 rounded-full cursor-pointer focus:outline-none"
                      >
                        <span className="rgb-pink-glow-surface w-full py-2.5 px-4 rounded-full bg-zinc-950 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5">
                          <span>Open Full Report</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedScan(null)}
                        className="px-4 py-2.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold cursor-pointer active:scale-95 transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </motion.section>
  );
});

export default RecentScansPanel;
