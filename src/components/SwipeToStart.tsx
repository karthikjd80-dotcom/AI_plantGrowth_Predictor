import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowRight, Sparkles, Check, ChevronRight } from 'lucide-react';

interface SwipeToStartProps {
  onComplete: () => void;
  text?: string;
  className?: string;
}

export function SwipeToStart({ onComplete, text = "Swipe to Get Started", className = "" }: SwipeToStartProps) {
  const [dragProgress, setDragProgress] = useState(0); // 0 to 1
  const [isDragging, setIsDragging] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const railRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const currentXRef = useRef<number>(0);

  const getRailWidth = () => {
    if (!railRef.current) return 260;
    return railRef.current.clientWidth;
  };

  const knobSize = 48; // px
  const padding = 4; // px

  const handleDragStart = (clientX: number) => {
    if (isCompleted) return;
    setIsDragging(true);
    startXRef.current = clientX;
    currentXRef.current = clientX;
  };

  const handleDragMove = useCallback((clientX: number) => {
    if (!isDragging || isCompleted) return;
    const railWidth = getRailWidth();
    const maxDistance = railWidth - knobSize - padding * 2;
    if (maxDistance <= 0) return;

    const deltaX = Math.max(0, Math.min(maxDistance, clientX - startXRef.current));
    const progress = deltaX / maxDistance;
    setDragProgress(progress);
    currentXRef.current = clientX;

    // Trigger completion if dragged past 85%
    if (progress >= 0.85) {
      setIsCompleted(true);
      setIsDragging(false);
      setDragProgress(1);
      if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
        try {
          navigator.vibrate(40);
        } catch (e) {}
      }
      setTimeout(() => {
        onComplete();
      }, 300);
    }
  }, [isDragging, isCompleted, onComplete]);

  const handleDragEnd = useCallback(() => {
    if (isCompleted) return;
    setIsDragging(false);
    if (dragProgress < 0.85) {
      // Snap back smoothly
      setDragProgress(0);
    }
  }, [dragProgress, isCompleted]);

  // Window event listeners for mouse move and up while dragging
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleDragMove(e.clientX);
      }
    };

    const onMouseUp = () => {
      if (isDragging) {
        handleDragEnd();
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches[0]) {
        handleDragMove(e.touches[0].clientX);
      }
    };

    const onTouchEnd = () => {
      if (isDragging) {
        handleDragEnd();
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchmove', onTouchMove, { passive: true });
      window.addEventListener('touchend', onTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  const railWidth = railRef.current?.clientWidth || 280;
  const maxDistance = Math.max(0, railWidth - knobSize - padding * 2);
  const knobOffset = dragProgress * maxDistance;

  return (
    <div
      ref={railRef}
      role="slider"
      aria-label="Swipe to get started"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(dragProgress * 100)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsCompleted(true);
          setDragProgress(1);
          setTimeout(() => onComplete(), 250);
        }
      }}
      className={`relative h-14 w-full max-w-sm rounded-full bg-slate-900/90 dark:bg-black/80 backdrop-blur-xl p-1 select-none overflow-hidden border border-white/20 shadow-lg cursor-pointer ${className}`}
      onClick={(e) => {
        // If user simply clicks the right half of the track, complete it
        if (!isDragging && !isCompleted) {
          const rect = railRef.current?.getBoundingClientRect();
          if (rect && e.clientX - rect.left > rect.width * 0.5) {
            setIsCompleted(true);
            setDragProgress(1);
            setTimeout(() => onComplete(), 250);
          }
        }
      }}
    >
      {/* Background Track Fill indicating drag distance */}
      <div
        className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-600/60 to-emerald-500/80 rounded-full transition-all pointer-events-none"
        style={{
          width: `${knobOffset + knobSize + padding}px`,
          transition: isDragging ? 'none' : 'width 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
      />

      {/* Guide Text in center */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-200"
        style={{
          opacity: Math.max(0, 1 - dragProgress * 2),
        }}
      >
        <span className="text-xs sm:text-sm font-semibold tracking-wider text-emerald-100 flex items-center space-x-1 pl-8">
          <span>{text}</span>
          <ChevronRight className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <ChevronRight className="w-3.5 h-3.5 text-emerald-400/60 animate-pulse -ml-2" />
        </span>
      </div>

      {/* Draggable Knob */}
      <div
        onMouseDown={(e) => {
          e.stopPropagation();
          handleDragStart(e.clientX);
        }}
        onTouchStart={(e) => {
          e.stopPropagation();
          if (e.touches[0]) {
            handleDragStart(e.touches[0].clientX);
          }
        }}
        style={{
          transform: `translateX(${knobOffset}px)`,
          transition: isDragging ? 'none' : 'transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
        className={`absolute top-1 left-1 w-12 h-12 rounded-full flex items-center justify-center transition-shadow shadow-md z-10 ${
          isCompleted
            ? 'bg-emerald-400 text-slate-950 shadow-emerald-400/50 scale-105'
            : isDragging
            ? 'bg-emerald-500 text-white shadow-emerald-500/60 scale-105 ring-2 ring-white/40'
            : 'bg-white text-slate-900 hover:bg-emerald-50'
        }`}
      >
        {isCompleted ? (
          <Check className="w-5 h-5 text-slate-950 animate-bounce" />
        ) : (
          <div className="flex items-center justify-center">
            <ArrowRight className="w-5 h-5 text-emerald-700 transition-transform group-hover:translate-x-0.5" />
          </div>
        )}
      </div>
    </div>
  );
}
