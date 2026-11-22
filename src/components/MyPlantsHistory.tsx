import React, { useState, useMemo, memo } from 'react';
import { motion } from 'motion/react';
import { HistoryItem } from '../types';
import {
  Sprout,
  Calendar,
  Trash2,
  Search,
  ArrowRight,
  FileText,
} from 'lucide-react';
import SwipeRow from './SwipeRow';

const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;

interface MyPlantsHistoryProps {
  history: HistoryItem[];
  onSelectPlant: (item: HistoryItem) => void;
  onDeletePlant: (id: string) => void;
  onClearAll: () => void;
  isDarkMode?: boolean;
}

export const MyPlantsHistory = memo(function MyPlantsHistory({
  history,
  onSelectPlant,
  onDeletePlant,
  onClearAll,
}: MyPlantsHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const { healthyCount, attentionCount } = useMemo(() => {
    let healthy = 0;
    for (let i = 0; i < history.length; i++) {
      if (history[i]?.prediction?.healthStatus === 'Healthy') healthy++;
    }
    return { healthyCount: healthy, attentionCount: history.length - healthy };
  }, [history]);

  const filteredHistory = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return history;
    return history.filter((item) =>
      item?.prediction?.plantName?.toLowerCase().includes(q)
    );
  }, [history, searchTerm]);

  return (
    <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-6 py-4 sm:py-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, ease: EASE_OUT_EXPO }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5"
      >
        <div className="flex items-start gap-3">
          <span className="w-10 h-10 rounded-2xl bg-zinc-950 text-white flex items-center justify-center shadow-sm shrink-0">
            <Sprout className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
              My Plants
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
              Saved scans, diagnoses, and growth forecasts.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {history.length > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="rgb-pink-glow rounded-full border border-zinc-200 cursor-pointer focus:outline-none"
              title="Clear all search history"
            >
              <span className="rgb-pink-glow-surface inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white text-zinc-800 text-xs font-bold">
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </span>
            </button>
          )}
        </div>
      </motion.div>

      {/* Metrics Row */}
      {history.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, delay: 0.05, ease: EASE_OUT_EXPO }}
            whileHover={{ y: -2 }}
            className="p-3.5 rounded-3xl bg-zinc-950 text-white"
          >
            <span className="text-[10.5px] font-bold text-zinc-400 uppercase tracking-wider block mb-0.5">
              Total Plants
            </span>
            <span className="text-2xl font-extrabold tabular-nums">
              {history.length}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, delay: 0.1, ease: EASE_OUT_EXPO }}
            whileHover={{ y: -2 }}
            className="p-3.5 rounded-3xl bg-white border border-zinc-200"
          >
            <span className="text-[10.5px] font-bold text-zinc-500 uppercase tracking-wider block mb-0.5">
              Healthy
            </span>
            <span className="text-2xl font-extrabold text-zinc-950 tabular-nums">
              {healthyCount}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, delay: 0.15, ease: EASE_OUT_EXPO }}
            whileHover={{ y: -2 }}
            className="p-3.5 rounded-3xl bg-white border border-zinc-200 col-span-2 sm:col-span-1"
          >
            <span className="text-[10.5px] font-bold text-zinc-500 uppercase tracking-wider block mb-0.5">
              Attention Needed
            </span>
            <span className="text-2xl font-extrabold text-zinc-950 tabular-nums">
              {attentionCount}
            </span>
          </motion.div>
        </div>
      )}

      {/* Search Filter Input */}
      {history.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, delay: 0.18, ease: EASE_OUT_EXPO }}
          className="relative mb-4"
        >
          <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Filter your saved plants by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-zinc-200 rounded-2xl text-xs sm:text-sm text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-950 transition-colors"
          />
        </motion.div>
      )}

      {/* Plants History List */}
      {filteredHistory.length > 0 ? (
        <div className="flex flex-col gap-3 w-full">
          {filteredHistory.map((item, idx) => {
            const pred = item.prediction;
            const d = new Date(item.timestamp || Date.now());
            const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
            const datePart = d.toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });
            const dayAndDate = `${dayName}, ${datePart}`;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.34, delay: Math.min(idx * 0.04, 0.24), ease: EASE_OUT_EXPO }}
                className="gpu-list-item"
              >
                <SwipeRow
                  actions={[
                    {
                      id: 'delete',
                      label: 'Delete',
                      icon: <Trash2 className="w-5 h-5" />,
                    },
                    {
                      id: 'report',
                      label: 'Report',
                      icon: <FileText className="w-5 h-5" />,
                      color: '#27272a',
                      dismiss: true,
                      onSelect: () => onSelectPlant(item),
                    },
                  ]}
                  onCommit={(action) => {
                    if (action.id === 'delete') {
                      onDeletePlant(item.id);
                    }
                  }}
                  actionColor="#09090b"
                  drawerColor="#f4f4f5"
                  rowColor="#ffffff"
                  textColor="#09090b"
                  height={80}
                  radius={20}
                  actionWidth={84}
                  direction="left"
                  snapBounce={0.2}
                  resistance={0.55}
                  collapseMs={220}
                  commitAt={0.6}
                  fullSwipe={true}
                  className="rounded-[20px] shadow-2xs border border-zinc-200/90 hover:border-zinc-300 transition-colors"
                >
                  <div
                    onClick={() => onSelectPlant(item)}
                    className="group w-full h-full flex items-center justify-between gap-3 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl overflow-hidden shrink-0 bg-zinc-100 border border-zinc-200">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={pred.plantName}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-500">
                            <Sprout className="w-6 h-6" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1 flex flex-col justify-center gap-1">
                        <h3 className="font-bold text-sm sm:text-[15px] text-zinc-950 truncate leading-tight">
                          {pred.plantName}
                        </h3>

                        <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium whitespace-nowrap leading-none">
                          <Calendar className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                          <span>{dayAndDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="w-9 h-9 rounded-full bg-zinc-100 text-zinc-800 flex items-center justify-center shrink-0 group-hover:bg-zinc-950 group-hover:text-white transition-all duration-200">
                      <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </SwipeRow>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-dashed border-zinc-300 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-zinc-100 text-zinc-700 flex items-center justify-center mx-auto mb-4">
            <Sprout className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-zinc-950 mb-2">
            {searchTerm ? 'No matching plants found' : 'No plants saved yet'}
          </h3>
          <p className="text-sm text-zinc-500 max-w-sm mx-auto">
            {searchTerm
              ? `No plant found matching "${searchTerm}". Try searching for another name.`
              : 'Plants you search or scan will automatically appear here with their diagnoses and growth projections.'}
          </p>
        </div>
      )}
    </div>
  );
});

export default MyPlantsHistory;
