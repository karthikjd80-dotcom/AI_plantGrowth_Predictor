import React, { useRef, useState, useEffect, useLayoutEffect, useCallback, memo } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';
import { LayoutGrid, UploadCloud, Clock, Bot, Plus } from 'lucide-react';
import type { AppNavTab } from './GlobalNavbar';
import './Dock.css';

export interface DockProps {
  className?: string;
  activeTab?: AppNavTab;
  onTabChange?: (tab: AppNavTab) => void;
  onBack?: () => void;
  onOpenUpload?: () => void;
  onOpenCamera?: () => void;
  onOpenHistory?: () => void;
  onOpenChat?: () => void;
  isChatOpen?: boolean;
  isCameraOpen?: boolean;
  hasActivePrediction?: boolean;
}

const SPRING_CONFIG = { stiffness: 480, damping: 36, mass: 0.65 };

const DOCK_TABS = [
  { id: 'home', label: 'Home', Icon: LayoutGrid },
  { id: 'upload', label: 'Upload', Icon: UploadCloud },
  { id: 'history', label: 'History', Icon: Clock },
  { id: 'flora', label: 'FloraAI', Icon: Bot },
] as const;

const Dock = memo(function Dock({
  className = '',
  activeTab = 'Home',
  onTabChange,
  onBack,
  onOpenUpload,
  onOpenCamera,
  onOpenHistory,
  onOpenChat,
  isChatOpen = false,
  hasActivePrediction = false,
}: DockProps) {
  const resolveExternalIndex = useCallback((): number => {
    if (isChatOpen) return 3;
    if (activeTab === 'My Plants') return 2;
    if (activeTab === 'Growth Prediction' && !hasActivePrediction) return 1;
    return 0;
  }, [isChatOpen, activeTab, hasActivePrediction]);

  const [activeIndex, setActiveIndex] = useState<number>(resolveExternalIndex);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [slotWidth, setSlotWidth] = useState<number>(78);

  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const metricsRef = useRef<{ left: number; width: number; slots: Array<{ x: number; w: number }> }>({
    left: 0,
    width: 344,
    slots: [],
  });

  // GPU-only horizontal transform for 60–120fps sliding highlight pill
  const pillX = useMotionValue(5);
  const springX = useSpring(pillX, SPRING_CONFIG);

  useEffect(() => {
    setActiveIndex(resolveExternalIndex());
  }, [resolveExternalIndex]);

  const measureSlots = useCallback(
    (snapImmediate = false, targetIdx = activeIndex) => {
      const container = containerRef.current;
      if (!container) return;

      const cRect = container.getBoundingClientRect();
      const slots: Array<{ x: number; w: number }> = [];

      for (let i = 0; i < DOCK_TABS.length; i++) {
        const el = itemsRef.current[i];
        if (el) {
          const r = el.getBoundingClientRect();
          slots.push({
            x: r.left - cRect.left,
            w: Math.max(54, r.width),
          });
        } else {
          const innerW = (cRect.width - 10) / DOCK_TABS.length;
          slots.push({ x: 5 + i * innerW, w: innerW });
        }
      }

      metricsRef.current = { left: cRect.left, width: cRect.width, slots };

      const refSlot = slots[0];
      if (refSlot && Math.abs(refSlot.w - slotWidth) > 0.5) {
        setSlotWidth(refSlot.w);
      }

      const slot = slots[targetIdx];
      if (slot) {
        if (snapImmediate) {
          pillX.jump(slot.x);
          springX.jump(slot.x);
        } else {
          pillX.set(slot.x);
        }
      }
    },
    [activeIndex, pillX, springX, slotWidth]
  );

  useLayoutEffect(() => {
    measureSlots(true, activeIndex);
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === 'undefined') return;

    const ro = new ResizeObserver(() => measureSlots(true));
    ro.observe(container);
    return () => ro.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isDragging) return;
    const slot = metricsRef.current.slots[activeIndex];
    if (slot) {
      pillX.set(slot.x);
    } else {
      measureSlots(false, activeIndex);
    }
  }, [activeIndex, isDragging, pillX, measureSlots]);

  const pointerDownRef = useRef(false);
  const startXRef = useRef(0);
  const draggedRef = useRef(false);
  const hoveredRef = useRef(activeIndex);

  const getIndexFromClientX = (clientX: number): number => {
    const { left, width } = metricsRef.current;
    if (width <= 0) return activeIndex;
    const rel = clientX - left;
    return Math.max(0, Math.min(DOCK_TABS.length - 1, Math.floor((rel / width) * DOCK_TABS.length)));
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    if (metricsRef.current.slots.length !== DOCK_TABS.length) {
      measureSlots(false, activeIndex);
    }
    pointerDownRef.current = true;
    startXRef.current = e.clientX;
    draggedRef.current = false;
    hoveredRef.current = activeIndex;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerDownRef.current) return;
    const deltaX = Math.abs(e.clientX - startXRef.current);

    if (!draggedRef.current && deltaX > 8) {
      draggedRef.current = true;
      setIsDragging(true);
    }

    if (draggedRef.current) {
      const { left, width } = metricsRef.current;
      const relX = e.clientX - left;
      const boundedX = Math.max(5, Math.min(width - slotWidth - 5, relX - slotWidth / 2));
      pillX.set(boundedX);

      const idx = getIndexFromClientX(e.clientX);
      if (idx !== hoveredRef.current) {
        hoveredRef.current = idx;
        setActiveIndex(idx);
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerDownRef.current) return;
    const wasDrag = draggedRef.current;
    pointerDownRef.current = false;
    draggedRef.current = false;
    setIsDragging(false);

    if (wasDrag) {
      const finalIdx = getIndexFromClientX(e.clientX);
      triggerTabAction(finalIdx);
    }
  };

  const handlePointerCancel = () => {
    pointerDownRef.current = false;
    draggedRef.current = false;
    setIsDragging(false);
    const slot = metricsRef.current.slots[activeIndex];
    if (slot) pillX.set(slot.x);
  };

  const triggerTabAction = (index: number) => {
    setActiveIndex(index);
    const slot = metricsRef.current.slots[index];
    if (slot) pillX.set(slot.x);

    try {
      if ('vibrate' in navigator) navigator.vibrate(8);
    } catch {}

    switch (index) {
      case 0:
        if (onBack) onBack();
        else onTabChange?.('Home');
        break;
      case 1:
        onOpenUpload?.();
        break;
      case 2:
        if (onOpenHistory) onOpenHistory();
        else onTabChange?.('My Plants');
        break;
      case 3:
        onOpenChat?.();
        break;
      default:
        break;
    }
  };

  return (
    <div className={`monochrome-dock-shell pointer-events-auto ${className}`}>
      {/* Left: 4-Tab Smoked Glass Capsule */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        className="monochrome-dock-pill"
        role="tablist"
        aria-label="Primary task bar"
      >
        {/* GPU-Composited Sliding Grey Capsule Indicator */}
        <motion.div
          className="monochrome-dock-active"
          style={{
            x: isDragging ? pillX : springX,
            width: slotWidth,
          }}
        />

        {DOCK_TABS.map(({ id, label, Icon }, idx) => {
          const isActive = activeIndex === idx;
          return (
            <button
              key={id}
              ref={(el) => {
                itemsRef.current[idx] = el;
              }}
              type="button"
              onClick={() => triggerTabAction(idx)}
              className="group relative z-10 flex-1 h-full rounded-full flex flex-col items-center justify-center gap-1 cursor-pointer focus:outline-none transition-transform duration-150 active:scale-95"
              role="tab"
              aria-selected={isActive}
              aria-label={label}
            >
              <Icon
                className={`w-[20px] h-[20px] stroke-[1.9] transition-colors duration-150 ${
                  isActive ? 'text-zinc-950' : 'text-zinc-600 group-hover:text-zinc-950'
                }`}
              />
              <span
                className={`text-[10.5px] leading-none tracking-tight transition-colors duration-150 ${
                  isActive
                    ? 'font-semibold text-zinc-950'
                    : 'font-medium text-zinc-600 group-hover:text-zinc-950'
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right: Separate Transparent Circular Plus Action Button */}
      <button
        type="button"
        onClick={() => {
          try {
            if ('vibrate' in navigator) navigator.vibrate(10);
          } catch {}
          onOpenCamera?.();
        }}
        className="monochrome-dock-plus focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/40"
        title="Scan or Add Plant"
        aria-label="Scan or Add Plant"
      >
        <Plus className="w-7 h-7 stroke-[1.9]" />
      </button>
    </div>
  );
});

export default Dock;
