import React, { useState, useCallback, memo } from 'react';
import { motion } from 'motion/react';
import { Ruler, Activity, ShieldCheck } from 'lucide-react';
import plantHeroImage from '../assets/images/sunlit_window_plant_1791632375099.jpg';

interface PlantHeroShowcaseProps {
  onExplore?: () => void;
}

type HeroCardKey = 'height' | 'forecast' | 'projection' | 'health';

const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;
const CARD_SURFACE_CLASSES =
  'rgb-pink-glow-surface overflow-hidden rounded-2xl bg-white/94 backdrop-blur-xl border border-zinc-200/90 shadow-[0_16px_36px_-10px_rgba(0,0,0,0.12)] transition-colors duration-300';

export const PlantHeroShowcase: React.FC<PlantHeroShowcaseProps> = memo(() => {
  const [litCard, setLitCard] = useState<HeroCardKey | null>(null);

  const toggleCardGlow = useCallback((key: HeroCardKey) => {
    setLitCard((prev) => (prev === key ? null : key));
  }, []);

  const cardSurfaceClasses = CARD_SURFACE_CLASSES;

  return (
    <div className="relative w-full max-w-[540px] h-[440px] sm:h-[480px] flex items-center justify-center select-none scale-[0.84] sm:scale-92 md:scale-95 lg:scale-100 origin-center">
      {/* Main Center Plant Photo Frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.65, ease: EASE_OUT_EXPO }}
        onClick={() => setLitCard(null)}
        className="relative w-[290px] sm:w-[345px] md:w-[370px] h-[335px] sm:h-[390px] md:h-[410px] rounded-[28px] overflow-hidden shadow-[0_24px_54px_-14px_rgba(0,0,0,0.18)] border border-zinc-200 bg-zinc-100 group"
      >
        <img
          src={plantHeroImage}
          alt="Plant Growth Monitoring Specimen"
          decoding="async"
          fetchPriority="high"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />

        {/* Subtle animated optical scan line */}
        <motion.div
          animate={{ y: ['14%', '82%', '14%'] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-x-[16%] top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/75 to-transparent pointer-events-none"
        />

        {/* Clean Monochrome Measurement Reticle */}
        <div className="absolute inset-x-[16%] inset-y-[16%] pointer-events-none">
          <div className="absolute top-0 left-0 w-7 h-7 border-t-2 border-l-2 border-white/90 rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-7 h-7 border-t-2 border-r-2 border-white/90 rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-7 h-7 border-b-2 border-l-2 border-white/90 rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-7 h-7 border-b-2 border-r-2 border-white/90 rounded-br-lg" />

          <div className="absolute left-1/2 top-4 bottom-4 -translate-x-1/2 flex flex-col items-center justify-between">
            <div className="w-3.5 h-[2px] bg-white/90" />
            <div className="w-[2px] flex-1 border-l-2 border-dashed border-white/80 my-1" />
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.35, ease: EASE_OUT_EXPO }}
              className="absolute top-1/2 -translate-y-1/2 px-3 py-1 rounded-full bg-zinc-950/90 text-white text-[11px] font-semibold tracking-wide shadow-md whitespace-nowrap border border-white/20 tabular-nums"
            >
              15.3 cm
            </motion.div>
            <div className="w-3.5 h-[2px] bg-white/90" />
          </div>
        </div>
      </motion.div>

      {/* 1. Top-Left Card: Current Height */}
      <motion.div
        initial={{ opacity: 0, x: -20, y: 12 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.6, delay: 0.16, ease: EASE_OUT_EXPO }}
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className={`absolute top-2 sm:top-4 -left-2 sm:-left-6 ${
          litCard === 'height' ? 'z-40' : 'z-30'
        } w-[188px] sm:w-[204px] animate-float-slow`}
      >
        <div
          role="button"
          tabIndex={0}
          aria-pressed={litCard === 'height'}
          data-hero-card="height"
          data-rgb-lit={litCard === 'height' ? 'true' : undefined}
          onClick={() => toggleCardGlow('height')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleCardGlow('height');
            }
          }}
          className="rgb-pink-glow rounded-2xl w-full cursor-pointer focus:outline-none"
        >
          <div
            className={`${cardSurfaceClasses} p-3 sm:p-3.5 flex items-center gap-3 ${
              litCard === 'height' ? 'border-pink-400/50' : ''
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
              <Ruler className="w-4 h-4 text-zinc-900" />
            </div>
            <div>
              <div className="text-[11px] font-medium text-zinc-500">Current Height</div>
              <div className="text-base sm:text-lg font-bold text-zinc-950 leading-tight tabular-nums">
                15.3 cm
              </div>
              <div className="text-[11px] font-semibold text-zinc-600 mt-0.5 tabular-nums">
                +2.1 cm this week
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. Bottom-Left Card: 60-Day Growth Forecast */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.24, ease: EASE_OUT_EXPO }}
        whileHover={{ y: -4, scale: 1.015 }}
        whileTap={{ scale: 0.98 }}
        className={`absolute -bottom-3 sm:-bottom-6 -left-3 sm:-left-8 ${
          litCard === 'forecast' ? 'z-40' : 'z-30'
        } w-[280px] sm:w-[325px]`}
      >
        <div
          role="button"
          tabIndex={0}
          aria-pressed={litCard === 'forecast'}
          data-hero-card="forecast"
          data-rgb-lit={litCard === 'forecast' ? 'true' : undefined}
          onClick={() => toggleCardGlow('forecast')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleCardGlow('forecast');
            }
          }}
          className="rgb-pink-glow rounded-2xl w-full cursor-pointer focus:outline-none"
        >
          <div
            className={`${cardSurfaceClasses} p-3.5 sm:p-4 ${
              litCard === 'forecast' ? 'border-pink-400/50' : ''
            }`}
          >
            <div className="font-bold text-zinc-950 text-xs sm:text-sm mb-1.5">
              Growth Forecast (60 Days)
            </div>

            <div className="flex items-center gap-3 text-[10px] sm:text-[11px] font-medium text-zinc-500 mb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-[2px] bg-zinc-950" />
                <span>Actual</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-[2px] border-t-2 border-dashed border-zinc-500" />
                <span>Predicted</span>
              </div>
            </div>

            <div className="relative w-full h-[76px] sm:h-[84px] mt-1">
              <div className="absolute left-0 top-0 bottom-4 w-4 flex flex-col justify-between text-[9px] font-semibold text-zinc-400 text-right pr-1 tabular-nums">
                <span>30</span>
                <span>20</span>
                <span>10</span>
                <span>0</span>
              </div>

              <div className="ml-5 h-[62px] sm:h-[70px] relative">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 240 70" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="heroMonoGrowthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#18181b" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#18181b" stopOpacity="0.01" />
                    </linearGradient>
                  </defs>

                  <line x1="0" y1="5" x2="240" y2="5" stroke="#e4e4e7" strokeWidth="1" strokeDasharray="2 2" />
                  <line x1="0" y1="25" x2="240" y2="25" stroke="#e4e4e7" strokeWidth="1" strokeDasharray="2 2" />
                  <line x1="0" y1="46" x2="240" y2="46" stroke="#e4e4e7" strokeWidth="1" strokeDasharray="2 2" />
                  <line x1="0" y1="68" x2="240" y2="68" stroke="#d4d4d8" strokeWidth="1" />

                  <motion.path
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.45 }}
                    d="M 10 52 L 40 45 L 80 38 L 220 12 L 220 68 L 10 68 Z"
                    fill="url(#heroMonoGrowthGrad)"
                  />

                  <motion.line
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.9, delay: 0.6, ease: EASE_OUT_EXPO }}
                    x1="80"
                    y1="38"
                    x2="220"
                    y2="12"
                    stroke="#71717a"
                    strokeWidth="2.2"
                    strokeDasharray="4 4"
                  />

                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.75, delay: 0.35, ease: EASE_OUT_EXPO }}
                    d="M 10 52 L 40 45 L 80 38"
                    fill="none"
                    stroke="#09090b"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                  />

                  <motion.circle
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.45 }}
                    cx="10"
                    cy="52"
                    r="3"
                    fill="#09090b"
                  />
                  <motion.circle
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.55 }}
                    cx="40"
                    cy="45"
                    r="3"
                    fill="#09090b"
                  />
                  <motion.circle
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.65 }}
                    cx="80"
                    cy="38"
                    r="3.5"
                    fill="#09090b"
                  />
                </svg>

                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.85, ease: EASE_OUT_EXPO }}
                  className="absolute right-0 -top-3 bg-zinc-950 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm tabular-nums"
                >
                  28.1 cm
                </motion.div>
              </div>

              <div className="ml-5 flex justify-between text-[9px] font-medium text-zinc-400 mt-1 tabular-nums">
                <span>0</span>
                <span>10</span>
                <span>20</span>
                <span>30</span>
                <span>40</span>
                <span>50</span>
                <span>60d</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3. Right Card: 7-Day Prediction */}
      <motion.div
        initial={{ opacity: 0, x: 20, y: 8 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.6, delay: 0.22, ease: EASE_OUT_EXPO }}
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className={`absolute top-[30%] -right-3 sm:-right-8 ${
          litCard === 'projection' ? 'z-40' : 'z-30'
        } w-[178px] sm:w-[196px] animate-float-reverse`}
      >
        <div
          role="button"
          tabIndex={0}
          aria-pressed={litCard === 'projection'}
          data-hero-card="projection"
          data-rgb-lit={litCard === 'projection' ? 'true' : undefined}
          onClick={() => toggleCardGlow('projection')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleCardGlow('projection');
            }
          }}
          className="rgb-pink-glow rounded-2xl w-full cursor-pointer focus:outline-none"
        >
          <div
            className={`${cardSurfaceClasses} p-3 sm:p-3.5 ${
              litCard === 'projection' ? 'border-pink-400/50' : ''
            }`}
          >
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500 mb-0.5">
              <Activity className="w-3.5 h-3.5 text-zinc-800" />
              <span>7-Day Projection</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-zinc-950 leading-tight tabular-nums">
              +2.4 cm
            </div>
            <div className="text-[11px] font-medium text-zinc-500 mt-0.5 tabular-nums">
              Expected: 17.7 cm
            </div>
          </div>
        </div>
      </motion.div>

      {/* 4. Bottom-Right Card: Health Status */}
      <motion.div
        initial={{ opacity: 0, x: 18, y: 14 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: EASE_OUT_EXPO }}
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className={`absolute bottom-3 sm:bottom-5 -right-2 sm:-right-6 ${
          litCard === 'health' ? 'z-40' : 'z-30'
        } w-[170px] sm:w-[186px] animate-float-delayed`}
      >
        <div
          role="button"
          tabIndex={0}
          aria-pressed={litCard === 'health'}
          data-hero-card="health"
          data-rgb-lit={litCard === 'health' ? 'true' : undefined}
          onClick={() => toggleCardGlow('health')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleCardGlow('health');
            }
          }}
          className="rgb-pink-glow rounded-2xl w-full cursor-pointer focus:outline-none"
        >
          <div
            className={`${cardSurfaceClasses} p-3 sm:p-3.5 ${
              litCard === 'health' ? 'border-pink-400/50' : ''
            }`}
          >
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500 mb-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-800" />
              <span>Health Status</span>
            </div>
            <div className="text-sm sm:text-base font-bold text-zinc-950 leading-tight">
              Healthy
            </div>
            <div className="text-[11px] font-medium text-zinc-500 mt-0.5 leading-snug">
              No visible leaf issues
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
});

export default PlantHeroShowcase;
