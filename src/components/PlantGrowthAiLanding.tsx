import React, { useState, memo } from 'react';
import { motion } from 'motion/react';
import { UploadCloud, ArrowRight } from 'lucide-react';
import { PlantHeroShowcase } from './PlantHeroShowcase';

interface PlantGrowthAiLandingProps {
  onStartApp?: () => void;
  onOpenUpload?: () => void;
  onNavigateTab?: (tab: 'Home' | 'My Plants' | 'Growth Prediction' | 'Disease Detection') => void;
}

const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;

export const PlantGrowthAiLanding = memo(function PlantGrowthAiLanding({
  onStartApp,
  onOpenUpload,
  onNavigateTab,
}: PlantGrowthAiLandingProps) {
  const [litButton, setLitButton] = useState<'predict' | 'upload' | null>(null);

  const pulseButtonGlow = (key: 'predict' | 'upload') => {
    setLitButton(key);
    window.setTimeout(() => {
      setLitButton((curr) => (curr === key ? null : curr));
    }, 520);
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col justify-between text-zinc-950 pb-12">
      {/* Minimal Monochrome Hero with Staggered Motion & Pink-Dominant RGB CTA Glow */}
      <section className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 pb-12 sm:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Editorial Headline & Primary Actions */}
          <div className="lg:col-span-6 space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
              className="font-['Syne'] font-bold tracking-[-0.04em] text-zinc-950 leading-[1.04] max-w-xl"
              style={{ fontSize: 'clamp(2.25rem, 4.3vw, 3.75rem)', textWrap: 'balance' }}
            >
              Diagnose leaf health and{' '}
              <span className="text-zinc-500">forecast growth.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08, ease: EASE_OUT_EXPO }}
              className="text-base sm:text-lg text-zinc-600 max-w-lg leading-relaxed"
            >
              Upload a plant photo or scan a leaf to detect species, measure height, forecast multi-day growth, and get a tailored care plan.
            </motion.p>

            {/* Primary & Secondary Actions (Pink-Dominant Smooth RGB Backlight on Hover/Touch) */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.16, ease: EASE_OUT_EXPO }}
              className="flex flex-wrap items-center gap-3.5 pt-1"
            >
              <button
                type="button"
                data-rgb-lit={litButton === 'predict' ? 'true' : undefined}
                onPointerDown={() => pulseButtonGlow('predict')}
                onClick={onStartApp}
                className="rgb-pink-glow-dark group rounded-full cursor-pointer whitespace-nowrap shrink-0 focus:outline-none"
              >
                <span className="rgb-pink-glow-surface inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-950 text-white text-sm font-semibold">
                  <span>Predict Growth</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </button>

              <button
                type="button"
                data-rgb-lit={litButton === 'upload' ? 'true' : undefined}
                onPointerDown={() => pulseButtonGlow('upload')}
                onClick={onOpenUpload}
                className="rgb-pink-glow group rounded-full cursor-pointer whitespace-nowrap shrink-0 focus:outline-none border border-zinc-200"
              >
                <span className="rgb-pink-glow-surface inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white text-zinc-900 text-sm font-semibold">
                  <UploadCloud className="w-4 h-4 text-zinc-700 transition-transform duration-300 group-hover:-translate-y-0.5" />
                  <span>Upload Photo</span>
                </span>
              </button>
            </motion.div>
          </div>

          {/* Right Column: Monochrome Interactive Plant Growth Preview */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <PlantHeroShowcase onExplore={onStartApp} />
          </div>
        </div>
      </section>

      {/* Minimal Monochrome Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500"
      >
        <nav className="flex flex-wrap items-center gap-6">
          <button
            type="button"
            onClick={() => onNavigateTab?.('Growth Prediction')}
            className="hover:text-zinc-950 transition-colors cursor-pointer"
          >
            Growth Prediction
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab?.('Disease Detection')}
            className="hover:text-zinc-950 transition-colors cursor-pointer"
          >
            Disease Detection
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab?.('My Plants')}
            className="hover:text-zinc-950 transition-colors cursor-pointer"
          >
            My Plants
          </button>
        </nav>
        <div>Botanical Diagnostics &amp; Growth Forecast</div>
      </motion.footer>
    </div>
  );
});

export default PlantGrowthAiLanding;
