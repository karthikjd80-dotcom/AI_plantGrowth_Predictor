import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, Check } from 'lucide-react';

export interface LiquidGlassOption {
  value: string;
  label: string;
  sublabel?: string;
}

interface LiquidGlassSelectProps {
  label?: string;
  value: string;
  options: LiquidGlassOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  compact?: boolean;
  className?: string;
}

export const LiquidGlassSelect = memo(function LiquidGlassSelect({
  label,
  value,
  options,
  onChange,
  disabled = false,
  icon,
  compact = false,
  className = '',
}: LiquidGlassSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    width: number;
    openUpward: boolean;
  } | null>(null);

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const selectedOption =
    options.find((o) => o.value === value) || options[0];

  const updatePosition = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const estimatedMenuHeight = Math.min(options.length * 44 + 20, 280);
    const spaceBelow = window.innerHeight - rect.bottom - 16;
    const openUpward = spaceBelow < estimatedMenuHeight && rect.top > estimatedMenuHeight;
    const width = Math.max(rect.width, 210);
    const left = Math.min(
      Math.max(12, rect.left),
      window.innerWidth - width - 12
    );

    setCoords({
      top: openUpward ? rect.top - 8 : rect.bottom + 8,
      left,
      width,
      openUpward,
    });
  }, [options.length]);

  useEffect(() => {
    if (!isOpen) return;
    updatePosition();

    let rafId = 0;
    const handleScrollOrResize = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        updatePosition();
      });
    };
    const handlePointerDownOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        popoverRef.current?.contains(target)
      ) {
        return;
      }
      setIsOpen(false);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('resize', handleScrollOrResize, { passive: true });
    window.addEventListener('scroll', handleScrollOrResize, { capture: true, passive: true });
    document.addEventListener('mousedown', handlePointerDownOutside);
    document.addEventListener('touchstart', handlePointerDownOutside, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      document.removeEventListener('mousedown', handlePointerDownOutside);
      document.removeEventListener('touchstart', handlePointerDownOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, updatePosition]);

  const handleSelect = (optValue: string) => {
    onChange(optValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        data-open={isOpen ? 'true' : 'false'}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => {
          if (disabled) return;
          if (!isOpen) updatePosition();
          setIsOpen((prev) => !prev);
        }}
        className={`ios-liquid-glass-trigger w-full text-left flex items-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none active:scale-[0.985] ${
          compact
            ? 'rounded-xl px-3 py-1.5 text-xs'
            : 'rounded-2xl px-3.5 py-2.5 text-xs'
        }`}
      >
        {icon && <span className="text-zinc-700 shrink-0">{icon}</span>}

        <div className="flex-1 min-w-0">
          {label && (
            <span className="block text-[9.5px] font-bold uppercase tracking-wider text-zinc-500 leading-tight">
              {label}
            </span>
          )}
          <span className="block text-xs font-extrabold text-zinc-950 truncate leading-snug mt-0.5">
            {selectedOption?.label}
          </span>
        </div>

        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 420, damping: 28 }}
          className="w-6 h-6 rounded-full bg-white/70 border border-zinc-200/70 flex items-center justify-center text-zinc-600 shrink-0"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </motion.span>
      </button>

      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isOpen && coords && (
              <motion.div
                ref={popoverRef}
                role="listbox"
                aria-label={label || 'Select option'}
                initial={{
                  opacity: 0,
                  scale: 0.92,
                  y: coords.openUpward ? 10 : -10,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.94,
                  y: coords.openUpward ? 6 : -6,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 460,
                  damping: 30,
                  mass: 0.72,
                }}
                style={{
                  position: 'fixed',
                  top: coords.top,
                  left: coords.left,
                  width: coords.width,
                  transformOrigin: coords.openUpward ? 'bottom center' : 'top center',
                  ...(coords.openUpward ? { transform: 'translateY(-100%)' } : {}),
                }}
                className="ios-liquid-glass-popover z-[100000] rounded-[22px] p-1.5"
              >
                <div className="relative z-10 space-y-1 max-h-80 overflow-y-auto no-scrollbar">
                  {options.map((opt, idx) => {
                    const isSelected = opt.value === value;
                    return (
                      <motion.button
                        key={opt.value}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        data-selected={isSelected ? 'true' : 'false'}
                        initial={{ opacity: 0, y: coords.openUpward ? 4 : -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.18,
                          delay: idx * 0.024,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleSelect(opt.value)}
                        className="ios-liquid-glass-option w-full px-3 py-2.5 rounded-[15px] text-left flex items-center justify-between gap-2 cursor-pointer focus:outline-none"
                      >
                        <div className="min-w-0">
                          <span
                            className={`block text-xs font-bold truncate ${
                              isSelected ? 'text-white' : 'text-zinc-900'
                            }`}
                          >
                            {opt.label}
                          </span>
                          {opt.sublabel && (
                            <span
                              className={`block text-[10px] truncate mt-0.5 ${
                                isSelected ? 'text-zinc-300' : 'text-zinc-500'
                              }`}
                            >
                              {opt.sublabel}
                            </span>
                          )}
                        </div>

                        {isSelected && (
                          <motion.span
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 520, damping: 24 }}
                            className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center shrink-0"
                          >
                            <Check className="w-3 h-3 text-white stroke-[2.8]" />
                          </motion.span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
});

export default LiquidGlassSelect;
