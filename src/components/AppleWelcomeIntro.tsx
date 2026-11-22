import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';

interface AppleWelcomeIntroProps {
  onComplete: () => void;
  isDarkMode?: boolean;
}

export const AppleWelcomeIntro: React.FC<AppleWelcomeIntroProps> = ({
  onComplete,
}) => {
  const pathRef = useRef<SVGPathElement>(null);
  const glowPathRef = useRef<SVGPathElement>(null);
  const penTipRef = useRef<SVGGElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const mountTimeRef = useRef<number>(Date.now());
  const hasFinishedRef = useRef<boolean>(false);

  // High-level visual phase for entry/exit
  const [phase, setPhase] = useState<'writing' | 'completed' | 'exiting'>('writing');
  const [isExiting, setIsExiting] = useState(false);

  // Mathematically continuous, tangent-continuous calligraphy Bézier path for the iconic Apple "hello"
  // Crafted with G1 continuity across all joins for butter-smooth rendering without jagged corners
  const helloPath = [
    // 1. "h" - entry stroke and high ascender loop
    "M 74,146",
    "C 86,164 106,170 120,152",
    "C 136,130 152,76 160,46",
    "C 165,28 152,22 142,36",
    "C 130,56 126,110 126,162",
    // "h" - shoulder arch and descent to baseline
    "C 126,132 136,108 158,108",
    "C 180,108 190,128 190,162",
    // 2. Transition into "e"
    "C 190,168 198,172 210,160",
    "C 222,142 236,118 248,108",
    "C 258,98 252,88 238,92",
    "C 222,98 218,132 232,160",
    // 3. Transition into first "l"
    "C 242,172 254,174 266,158",
    "C 282,134 300,76 310,46",
    "C 315,28 302,22 294,36",
    "C 282,56 278,110 278,162",
    // 4. Transition into second "l"
    "C 278,170 288,172 302,158",
    "C 318,134 336,76 346,46",
    "C 351,28 338,22 330,36",
    "C 318,56 314,110 314,162",
    // 5. Transition into "o"
    "C 314,170 324,172 342,156",
    "C 358,138 376,112 396,108",
    "C 414,104 424,120 424,136",
    "C 424,156 408,168 388,168",
    "C 368,168 356,152 356,136",
    "C 356,118 370,106 392,106",
    // "o" - Apple signature top exit flick
    "C 406,106 414,100 424,100",
    "C 434,100 450,110 470,108"
  ].join(" ");

  // Graceful exit handler
  const handleExit = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);
    setPhase('exiting');
    
    // Smooth Apple OS dissolve transition (520ms)
    setTimeout(() => {
      onComplete();
    }, 520);
  }, [isExiting, onComplete]);

  // Safe dismiss on backdrop click
  const handleBackdropClick = useCallback(() => {
    const elapsedSinceMount = Date.now() - mountTimeRef.current;
    if (elapsedSinceMount > 1200 || phase === 'completed') {
      handleExit();
    }
  }, [handleExit, phase]);

  // High-performance animation loop (Zero React re-renders during active stroke drawing)
  useEffect(() => {
    const pathEl = pathRef.current;
    const glowEl = glowPathRef.current;
    const penTipEl = penTipRef.current;
    if (!pathEl) return;

    let totalLength = 1750;
    try {
      const measured = pathEl.getTotalLength();
      if (measured && measured > 300) {
        totalLength = measured;
      }
    } catch {
      totalLength = 1750;
    }

    // Set initial dasharray & dashoffset
    pathEl.style.strokeDasharray = `${totalLength}`;
    pathEl.style.strokeDashoffset = `${totalLength}`;
    if (glowEl) {
      glowEl.style.strokeDasharray = `${totalLength}`;
      glowEl.style.strokeDashoffset = `${totalLength}`;
    }

    // Set initial pen tip position via direct transform (no state re-renders)
    if (penTipEl) {
      try {
        const startPt = pathEl.getPointAtLength(0);
        penTipEl.style.transform = `translate3d(${startPt.x}px, ${startPt.y}px, 0)`;
        penTipEl.style.opacity = '1';
      } catch {
        penTipEl.style.transform = 'translate3d(74px, 146px, 0)';
      }
    }

    // Natural handwriting duration (~2.2s)
    const DURATION = 2200;

    // Organic cubic easing for natural cursive speed and flow
    const easeInOutCubic = (t: number) => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / DURATION, 1);
      const eased = easeInOutCubic(progress);

      const offset = totalLength * (1 - eased);
      const drawnLength = totalLength * eased;

      // Direct DOM manipulation - butter smooth 60fps/120fps GPU compositing
      pathEl.style.strokeDashoffset = `${offset}`;
      if (glowEl) glowEl.style.strokeDashoffset = `${offset}`;

      if (penTipEl && drawnLength <= totalLength) {
        try {
          const pt = pathEl.getPointAtLength(drawnLength);
          penTipEl.style.transform = `translate3d(${pt.x}px, ${pt.y}px, 0)`;
        } catch {
          // ignore potential frame error
        }
      }

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        if (hasFinishedRef.current) return;
        hasFinishedRef.current = true;

        // Hide pen tip smoothly
        if (penTipEl) {
          penTipEl.style.opacity = '0';
        }

        setPhase('completed');

        // Hold gracefully for 750ms so user enjoys the finished cursive script, then dissolve
        setTimeout(() => {
          handleExit();
        }, 750);
      }
    };

    // Tiny 150ms settle pause before ink starts flowing
    const startTimeout = setTimeout(() => {
      animFrameRef.current = requestAnimationFrame(animate);
    }, 150);

    return () => {
      clearTimeout(startTimeout);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [handleExit]);

  // Keyboard shortcut to skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleExit]);

  return (
    <div
      onClick={handleBackdropClick}
      className={`fixed inset-0 w-full h-full min-h-[100dvh] z-[99999] flex flex-col items-center justify-center select-none bg-white text-black transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isExiting
          ? 'opacity-0 scale-[1.03] blur-[4px] pointer-events-none'
          : 'opacity-100 scale-100 blur-0'
      }`}
      role="dialog"
      aria-label="Welcome screen: Hello"
    >
      {/* Subtle ambient lighting */}
      <div 
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[580px] h-[300px] sm:h-[380px] rounded-full blur-[100px] sm:blur-[140px] opacity-20 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(24, 24, 27, 0.14) 0%, rgba(113, 113, 122, 0.06) 50%, transparent 80%)',
          }}
        />
      </div>

      {/* Top-Right "Skip" Button */}
      <div className="absolute top-5 right-5 sm:top-8 sm:right-8 z-30 flex items-center">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleExit();
          }}
          className="group flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 shadow-xs border bg-black/5 hover:bg-black/10 active:scale-95 text-neutral-800 border-black/10 cursor-pointer touch-manipulation backdrop-blur-md"
        >
          <span>Skip</span>
          <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
        </button>
      </div>

      {/* Main Apple Script Canvas for "hello" */}
      <div className="relative w-full max-w-[520px] px-4 sm:px-8 flex flex-col items-center justify-center my-auto">
        
        {/* SVG Container: Apple Cursive "hello" */}
        <div className="relative w-full aspect-[540/220] flex items-center justify-center">
          <svg
            viewBox="0 0 540 220"
            className="w-full h-auto max-h-[45vh] overflow-visible"
            preserveAspectRatio="xMidYMid meet"
            style={{
              shapeRendering: 'geometricPrecision',
            }}
          >
            {/* Ambient Soft Bloom behind stroke */}
            <path
              ref={glowPathRef}
              d={helloPath}
              fill="none"
              stroke="#000000"
              strokeWidth="14"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-10"
              style={{
                filter: 'blur(6px)',
                willChange: 'stroke-dashoffset',
              }}
            />

            {/* Main Solid Ink Calligraphy Stroke */}
            <path
              ref={pathRef}
              d={helloPath}
              fill="none"
              stroke="#000000"
              strokeWidth="8.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                willChange: 'stroke-dashoffset',
              }}
            />

            {/* Fluid Organic Pen Tip Nib (Direct GPU translate3d, no React re-render lag) */}
            <g 
              ref={penTipRef}
              className="pointer-events-none transition-opacity duration-200"
              style={{ willChange: 'transform, opacity' }}
            >
              {/* Soft ink bloom */}
              <circle
                r="7"
                fill="rgba(0, 0, 0, 0.12)"
              />
              {/* Core ink nib */}
              <circle
                r="4.25"
                fill="#000000"
              />
            </g>
          </svg>
        </div>

        {/* Minimalist Subtitle (Fades in smoothly when stroke completes) */}
        <div 
          className={`mt-4 sm:mt-6 text-center transition-all duration-700 ease-out ${
            phase === 'completed' || phase === 'exiting'
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          <p className="text-xs sm:text-sm tracking-widest uppercase font-semibold text-neutral-500 font-sans">
            PlantGrowth AI
          </p>
        </div>

      </div>

      {/* Subtle Bottom Affordance */}
      <div className="absolute bottom-5 sm:bottom-8 text-center pointer-events-none px-4">
        <span className="text-[10px] sm:text-[11px] font-medium tracking-widest text-neutral-400 uppercase">
          Tap anywhere or skip to continue
        </span>
      </div>
    </div>
  );
};

export default AppleWelcomeIntro;
