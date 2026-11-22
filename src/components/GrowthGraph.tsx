import React, { useState, useMemo } from 'react';
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart,
} from 'recharts';
import {
  Droplets,
  Sun,
  Leaf,
  ShieldCheck,
  CheckCircle2,
  Circle,
  BarChart2,
  Scissors,
} from 'lucide-react';
import { GrowthDataPoint } from '../types';

export type GrowthHorizon = '7d' | '15d' | '30d' | '60d' | 'full';

interface GrowthGraphProps {
  data: GrowthDataPoint[];
  unit?: 'cm' | 'inches';
  isDarkMode?: boolean;
  selectedDay?: number;
  horizon?: GrowthHorizon;
  onHorizonChange?: (h: GrowthHorizon) => void;
  onHoverDay?: (day: number, height: number) => void;
  onSelectDay?: (day: number) => void;
  className?: string;
  matureHeight?: number;
  minMatureHeight?: number;
  maxMatureHeight?: number;
  speciesName?: string;
  environmentalEfficiency?: number;
  healthStatus?: 'Healthy' | 'Warning' | 'Possible Issue' | 'Diseased' | 'Critical';
  compactChartOnly?: boolean;
  forecastPoints?: {
    currentHeightCm?: number;
    day7Cm: number;
    day14Cm: number;
    day30Cm: number;
    day60Cm: number;
  };
}

interface ActionableTip {
  id: string;
  category: 'Hydration' | 'Photoperiod' | 'Nutrition' | 'Pruning' | 'Protection';
  icon: typeof Sun;
  title: string;
  action: string;
  boostCm: number;
  timing: string;
  priority: 'Essential' | 'High Impact' | 'Recommended';
}

export function GrowthGraph({
  data,
  unit = 'cm',
  isDarkMode = false,
  selectedDay = 14,
  horizon: controlledHorizon,
  onHorizonChange,
  onHoverDay,
  onSelectDay,
  className = '',
  matureHeight = 120,
  minMatureHeight = 90,
  maxMatureHeight = 150,
  environmentalEfficiency = 0.94,
  healthStatus = 'Healthy',
  compactChartOnly = false,
  forecastPoints,
}: GrowthGraphProps) {
  const [innerHorizon, setInnerHorizon] = useState<GrowthHorizon>('15d');
  const horizon = controlledHorizon ?? innerHorizon;
  const setHorizon = (h: GrowthHorizon) => {
    setInnerHorizon(h);
    onHorizonChange?.(h);
  };

  const [showConfidenceInterval, setShowConfidenceInterval] = useState(true);
  const [showMatureLine, setShowMatureLine] = useState(false);
  const [completedTipIds, setCompletedTipIds] = useState<Record<string, boolean>>({
    'tip-1': true,
  });

  const dailyTips: ActionableTip[] = useMemo(() => {
    if (healthStatus === 'Diseased' || healthStatus === 'Critical') {
      return [
        {
          id: 'tip-1',
          category: 'Pruning',
          icon: Scissors,
          title: 'Sanitized Foliar Debridement',
          action:
            'Sterilize shears with 70% alcohol. Prune lower diseased foliage to halt fungal spread and redirect vigor to terminal shoots.',
          boostCm: 2.1,
          timing: 'Morning (8:00 AM)',
          priority: 'Essential',
        },
        {
          id: 'tip-2',
          category: 'Protection',
          icon: ShieldCheck,
          title: 'Bio-Fungicide or Copper Soap Mist',
          action:
            'Apply mild organic copper soap or Trichoderma bio-spray under leaves at dusk to rebuild cellular cuticle barriers.',
          boostCm: 3.0,
          timing: 'Evening at Dusk',
          priority: 'Essential',
        },
        {
          id: 'tip-3',
          category: 'Hydration',
          icon: Droplets,
          title: 'Basal Sub-Surface Drip',
          action:
            'Switch exclusively to soil-level basal drip irrigation. Keeping foliage dry eliminates pathogen spore germination.',
          boostCm: 2.4,
          timing: 'Early Morning',
          priority: 'High Impact',
        },
      ];
    }

    if (healthStatus === 'Warning' || healthStatus === 'Possible Issue') {
      return [
        {
          id: 'tip-1',
          category: 'Hydration',
          icon: Droplets,
          title: 'Aerated Perimeter Hydration',
          action:
            'Water along the pot circumference rather than stem base to promote wide lateral root growth and oxygen uptake.',
          boostCm: 2.2,
          timing: '7:00 AM – 8:30 AM',
          priority: 'Essential',
        },
        {
          id: 'tip-2',
          category: 'Photoperiod',
          icon: Sun,
          title: 'Diffused Canopy PAR Optimization',
          action:
            'Provide 6–7 hours of diffused morning light; shade lightly during extreme midday sun to prevent transpiration shock.',
          boostCm: 2.5,
          timing: 'Full Morning',
          priority: 'High Impact',
        },
        {
          id: 'tip-3',
          category: 'Nutrition',
          icon: Leaf,
          title: 'Organic Seaweed & Bio-Potassium',
          action:
            'Apply dilute cold-pressed seaweed extract (1:500) to feed nodal meristems and accelerate 14-day stem elongation.',
          boostCm: 2.8,
          timing: 'After Watering',
          priority: 'Recommended',
        },
      ];
    }

    return [
      {
        id: 'tip-1',
        category: 'Photoperiod',
        icon: Sun,
        title: 'Morning Photoperiod & 90° Rotation',
        action:
          'Rotate container 90 degrees clockwise every morning to balance auxins and ensure symmetrical vegetative branch elongation.',
        boostCm: 2.4,
        timing: '8:00 AM Daily',
        priority: 'High Impact',
      },
      {
        id: 'tip-2',
        category: 'Hydration',
        icon: Droplets,
        title: 'Sub-Surface Root Zone Hydration',
        action:
          'Perform a deep soil soak until 10% drains out. Allows deep taproots to absorb micronutrients before peak sunlight hours.',
        boostCm: 2.7,
        timing: '7:00 AM – 9:00 AM',
        priority: 'Essential',
      },
      {
        id: 'tip-3',
        category: 'Nutrition',
        icon: Leaf,
        title: 'Calcium & Organic Compost Top-Dress',
        action:
          'Top-dress 1 tablespoon of rich organic compost around drip-line to bolster cell-wall rigidity and internode elongation.',
        boostCm: 3.2,
        timing: 'Weekly Cycle',
        priority: 'Recommended',
      },
    ];
  }, [healthStatus]);

  const toggleTip = (id: string) => {
    setCompletedTipIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const completedCount = dailyTips.filter((t) => completedTipIds[t.id]).length;
  const totalBoostCm = dailyTips.reduce((sum, t) => sum + (completedTipIds[t.id] ? t.boostCm : 0), 0);

  const extendedChartData = useMemo(() => {
    if (forecastPoints) {
      const existingPoints = Array.isArray(data) ? [...data].sort((a, b) => a.day - b.day) : [];
      const currH =
        forecastPoints.currentHeightCm ??
        existingPoints[existingPoints.length - 1]?.height ??
        14.5;
      const baseDay = existingPoints[existingPoints.length - 1]?.day || 14;
      const startH = existingPoints[0]?.height ?? Math.max(1.5, Number((currH * 0.48).toFixed(1)));

      // Anchor future points relative to Today (baseDay = 14)
      const knots: { day: number; height: number; isActual: boolean }[] = [
        { day: 0, height: startH, isActual: true },
        {
          day: Math.round(baseDay * 0.5),
          height:
            existingPoints.find((p) => p.day === Math.round(baseDay * 0.5))?.height ??
            Number(((startH + currH) / 2).toFixed(1)),
          isActual: true,
        },
        { day: baseDay, height: currH, isActual: true },
        { day: baseDay + 7, height: forecastPoints.day7Cm, isActual: false },
        { day: baseDay + 14, height: forecastPoints.day14Cm, isActual: false },
        { day: baseDay + 30, height: forecastPoints.day30Cm, isActual: false },
        { day: baseDay + 60, height: forecastPoints.day60Cm, isActual: false },
      ];

      const maxHorizonOffset =
        horizon === '7d' ? 7 : horizon === '15d' ? 14 : horizon === '30d' ? 30 : 60;
      const horizonMaxDay = baseDay + maxHorizonOffset;

      const interpolateAt = (d: number) => {
        for (let i = 0; i < knots.length - 1; i++) {
          const a = knots[i];
          const b = knots[i + 1];
          if (d >= a.day && d <= b.day) {
            const t = (d - a.day) / Math.max(1, b.day - a.day);
            return Number((a.height + (b.height - a.height) * t).toFixed(1));
          }
        }
        return knots[knots.length - 1].height;
      };

      const step = maxHorizonOffset <= 7 ? 3 : maxHorizonOffset <= 14 ? 4 : maxHorizonOffset <= 30 ? 6 : 10;
      const points: any[] = [];
      const dayMarks = new Set<number>([0, Math.round(baseDay * 0.5), baseDay]);
      for (let d = baseDay + step; d < horizonMaxDay; d += step) {
        dayMarks.add(d);
      }
      dayMarks.add(horizonMaxDay);

      const sortedDays = Array.from(dayMarks).sort((a, b) => a - b);
      for (const d of sortedDays) {
        const isActual = d <= baseDay;
        const height = interpolateAt(d);
        const daysAhead = Math.max(0, d - baseDay);
        const uncertainty = daysAhead === 0 ? 0 : Math.min(8.5, Number((0.4 + daysAhead * 0.12).toFixed(1)));
        const prevPt = points[points.length - 1];
        points.push({
          day: d,
          name: isActual ? (d === baseDay ? 'Today' : `Day ${d}`) : `+${d - baseDay}d`,
          height,
          actualHeight: isActual ? height : null,
          predictedHeight: !isActual || d === baseDay ? height : null,
          areaHeight: height,
          lowerBound: Math.max(0, Number((height - uncertainty).toFixed(1))),
          upperBound: Number((height + uncertainty).toFixed(1)),
          isActual,
          growthRate: prevPt
            ? Number(((height - prevPt.height) / Math.max(1, d - prevPt.day)).toFixed(2))
            : 0.9,
        });
      }
      return points;
    }

    const horizonMaxDay =
      horizon === '7d' ? 7 : horizon === '15d' ? 14 : horizon === '30d' ? 30 : horizon === '60d' ? 60 : 75;

    const existingPoints = Array.isArray(data) ? [...data].sort((a, b) => a.day - b.day) : [];
    const day0Height = existingPoints[0]?.height || 2.0;
    const currentObservationDay = horizonMaxDay <= 14 ? 10 : Math.min(10, horizonMaxDay);

    const effectiveL = matureHeight * (0.85 + environmentalEfficiency * 0.2);
    const k = 0.075;
    const t0 = 24;

    const points: any[] = [];
    const step = horizonMaxDay <= 15 ? 2 : horizonMaxDay <= 30 ? 3 : 6;

    for (let day = 0; day <= horizonMaxDay; day += step) {
      const existing = existingPoints.find((p) => p.day === day);
      const isActual = day <= currentObservationDay;

      let height = 0;
      if (isActual && existing) {
        height = existing.height;
      } else if (day === 0) {
        height = day0Height;
      } else {
        const logisticFactor = 1 / (1 + Math.exp(-k * (day - t0)));
        height = Math.round((day0Height + (effectiveL - day0Height) * logisticFactor) * 10) / 10;

        if (points.length > 0 && height < points[points.length - 1].height) {
          height = +(points[points.length - 1].height + 0.6).toFixed(1);
        }
      }

      const daysAhead = Math.max(0, day - currentObservationDay);
      const uncertainty = daysAhead === 0 ? 0 : Math.min(10, +(0.5 + daysAhead * 0.14).toFixed(1));
      const lowerBound = Math.max(0, +(height - uncertainty).toFixed(1));
      const upperBound = +(height + uncertainty).toFixed(1);

      points.push({
        day,
        name: `Day ${day}`,
        height,
        actualHeight: isActual ? height : null,
        predictedHeight: !isActual || day === currentObservationDay ? height : null,
        areaHeight: height,
        lowerBound,
        upperBound,
        isActual,
        growthRate:
          day > 0
            ? +((height - (points[points.length - 1]?.height || height)) / Math.max(1, day - (points[points.length - 1]?.day || 0))).toFixed(2)
            : 0.8,
      });
    }

    // Ensure final target day is always plotted
    if (points.length > 0 && points[points.length - 1].day !== horizonMaxDay) {
      const logisticFactor = 1 / (1 + Math.exp(-k * (horizonMaxDay - t0)));
      const lastPrev = points[points.length - 1].height;
      const finalHeight = Math.max(
        +(lastPrev + 1.2).toFixed(1),
        Math.round((day0Height + (effectiveL - day0Height) * logisticFactor) * 10) / 10
      );
      points.push({
        day: horizonMaxDay,
        name: `Day ${horizonMaxDay}`,
        height: finalHeight,
        actualHeight: horizonMaxDay <= currentObservationDay ? finalHeight : null,
        predictedHeight: finalHeight,
        areaHeight: finalHeight,
        lowerBound: Math.max(0, +(finalHeight - 2.4).toFixed(1)),
        upperBound: +(finalHeight + 2.4).toFixed(1),
        isActual: horizonMaxDay <= currentObservationDay,
        growthRate: 1.1,
      });
    }

    return points;
  }, [data, horizon, matureHeight, environmentalEfficiency, forecastPoints]);

  const heights = extendedChartData.map((d) => d.height);
  const peakHeight = heights.length ? Math.max(...heights) : 28.1;
  const maxPlotHeight = Math.max(peakHeight * 1.22, showMatureLine ? matureHeight * 1.05 : 35);
  const yMin = 0;
  const yMax = Math.ceil(maxPlotHeight / 10) * 10;

  const activePoint =
    extendedChartData.reduce((closest, pt) => {
      if (!closest) return pt;
      return Math.abs(pt.day - selectedDay) < Math.abs(closest.day - selectedDay) ? pt : closest;
    }, extendedChartData[0]) || { day: 14, height: peakHeight, isActual: false, growthRate: 1.1 };

  const lastHoverDayRef = React.useRef<number | null>(null);

  const handleChartClick = (state: any) => {
    if (state && state.activePayload && state.activePayload.length > 0) {
      const clickedPoint = state.activePayload[0].payload;
      if (clickedPoint && typeof clickedPoint.day === 'number') {
        onSelectDay?.(Math.min(14, Math.max(1, clickedPoint.day)));
      }
    }
  };

  const handleMouseMove = (state: any) => {
    if (state && state.activePayload && state.activePayload.length > 0) {
      const p = state.activePayload[0].payload;
      if (p && typeof p.day === 'number' && p.day !== lastHoverDayRef.current) {
        lastHoverDayRef.current = p.day;
        onHoverDay?.(Math.min(14, Math.max(1, p.day)), p.height);
      }
    }
  };

  return (
    <div className={`w-full botanical-glass-panel rounded-3xl p-4 sm:p-5 relative flex flex-col justify-between touch-pan-y ${className}`}>
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900">
            <BarChart2 className="w-4 h-4" />
          </div>
          <h4 className="text-sm sm:text-base font-extrabold text-zinc-950 tracking-tight">
            Growth Trajectory
          </h4>
        </div>

        {/* Inline Legend */}
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-zinc-200">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-950" />
            <span className="font-semibold text-zinc-800">Actual Growth</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-zinc-200">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 border border-zinc-600" />
            <span className="font-semibold text-zinc-800">Predicted Growth</span>
          </div>
        </div>
      </div>

      {/* Main Responsive Recharts Container */}
      <div className="w-full h-52 sm:h-56 relative touch-pan-x cursor-crosshair">
        {/* Floating Peak Tag */}
        <div className="absolute right-3 top-2 z-10 pointer-events-none">
          <div className="px-2.5 py-1 rounded-lg bg-zinc-950 text-white text-xs font-extrabold tabular-nums shadow-sm border border-zinc-800">
            {peakHeight.toFixed(1)} {unit}
          </div>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={extendedChartData}
            margin={{ top: 14, right: 14, left: -12, bottom: 2 }}
            onClick={handleChartClick}
            onMouseMove={handleMouseMove}
          >
            <defs>
              <linearGradient id="botanicalTrajectoryFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#18181b" stopOpacity={0.14} />
                <stop offset="95%" stopColor="#18181b" stopOpacity={0.01} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(24, 24, 27, 0.08)"
              vertical={false}
            />

            <XAxis
              dataKey="day"
              stroke="#71717a"
              fontSize={10.5}
              fontWeight={600}
              tickLine={false}
              axisLine={{ stroke: 'rgba(24, 24, 27, 0.14)' }}
              tickFormatter={(d) => `Day ${d}`}
            />

            <YAxis
              domain={[yMin, yMax]}
              stroke="#71717a"
              fontSize={10.5}
              fontWeight={600}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}`}
              label={{
                value: `Height (${unit})`,
                angle: -90,
                position: 'insideLeft',
                offset: 20,
                fill: '#52525b',
                fontSize: 10.5,
                fontWeight: 600,
              }}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="bg-white/95 backdrop-blur-xl p-2.5 rounded-xl border border-zinc-200 shadow-lg text-xs">
                      <p className="font-extrabold text-zinc-950">{d.name}</p>
                      <p className="text-zinc-900 font-black tabular-nums mt-0.5">
                        Height: {d.height} {unit}
                      </p>
                      <p className="text-[10px] text-zinc-500">
                        {d.isActual ? 'Observed Ground Truth' : 'AI Trajectory Forecast'}
                      </p>
                      {showConfidenceInterval && !d.isActual && (
                        <p className="text-[10px] text-zinc-600 tabular-nums mt-0.5">
                          95% CI: [{d.lowerBound} – {d.upperBound} {unit}]
                        </p>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />

            {selectedDay && (
              <ReferenceLine
                x={selectedDay}
                stroke="#3f3f46"
                strokeDasharray="3 3"
                strokeWidth={1.5}
              />
            )}

            {showMatureLine && (
              <ReferenceLine
                y={matureHeight}
                stroke="#52525b"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: `Mature: ${matureHeight} cm (${minMatureHeight}-${maxMatureHeight}cm)`,
                  fill: '#3f3f46',
                  fontSize: 10,
                  position: 'insideTopRight',
                }}
              />
            )}

            {/* Shaded Monochrome Gradient Area */}
            <Area
              type="monotone"
              dataKey="areaHeight"
              stroke="transparent"
              fill="url(#botanicalTrajectoryFill)"
              isAnimationActive={false}
            />

            {/* Actual Growth Curve (Solid Black) */}
            <Line
              type="monotone"
              dataKey="actualHeight"
              name="actualHeight"
              stroke="#09090b"
              strokeWidth={3}
              dot={{
                r: 4,
                fill: '#ffffff',
                stroke: '#09090b',
                strokeWidth: 2.2,
              }}
              activeDot={{
                r: 6.5,
                fill: '#09090b',
                stroke: '#ffffff',
                strokeWidth: 2,
              }}
              connectNulls={false}
              isAnimationActive={false}
            />

            {/* Predicted Growth Curve (Dashed Neutral Grey) */}
            <Line
              type="monotone"
              dataKey="predictedHeight"
              name="predictedHeight"
              stroke="#71717a"
              strokeWidth={2.5}
              strokeDasharray="5 4"
              dot={{
                r: 4,
                fill: '#ffffff',
                stroke: '#71717a',
                strokeWidth: 2,
              }}
              activeDot={{
                r: 6.5,
                fill: '#27272a',
                stroke: '#ffffff',
                strokeWidth: 2,
              }}
              connectNulls={true}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Compact Controls Bar */}
      <div className="mt-2.5 pt-2.5 border-t border-zinc-200 flex flex-wrap items-center justify-between gap-2 text-[11px]">
        <div className="flex items-center gap-1.5 flex-wrap">
          {(['7d', '15d', '30d', '60d', 'full'] as GrowthHorizon[]).map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => setHorizon(h)}
              className={`px-2 py-0.5 rounded-lg font-bold transition-colors cursor-pointer whitespace-nowrap ${
                horizon === h
                  ? 'bg-zinc-950 text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-950'
              }`}
            >
              {h === '15d' ? '14D' : h === 'full' ? 'Full' : h.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowConfidenceInterval(!showConfidenceInterval)}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
              showConfidenceInterval
                ? 'bg-zinc-900 border-zinc-900 text-white'
                : 'bg-white border-zinc-200 text-zinc-500'
            }`}
          >
            CI Range
          </button>
          <button
            type="button"
            onClick={() => setShowMatureLine(!showMatureLine)}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
              showMatureLine
                ? 'bg-zinc-900 border-zinc-900 text-white'
                : 'bg-white border-zinc-200 text-zinc-500'
            }`}
          >
            Mature Ref ({matureHeight}cm)
          </button>
        </div>
      </div>

      {/* Optional 3 Daily Actionable Tips */}
      {!compactChartOnly && (
        <div className="mt-3 pt-2.5 border-t border-zinc-200 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-zinc-800" />
              <span className="text-xs font-extrabold text-zinc-950">
                Daily Growth Boost Actions ({completedCount}/3)
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-800 tabular-nums">
              +{totalBoostCm.toFixed(1)} cm potential
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {dailyTips.map((tip) => {
              const isDone = !!completedTipIds[tip.id];
              const TipIcon = tip.icon;
              return (
                <button
                  key={tip.id}
                  type="button"
                  onClick={() => toggleTip(tip.id)}
                  className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isDone
                      ? 'bg-zinc-100 border-zinc-900'
                      : 'bg-white border-zinc-200 hover:border-zinc-400'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-zinc-700">
                      <TipIcon className="w-3 h-3" />
                      {tip.category}
                    </span>
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-zinc-950 shrink-0" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
                    )}
                  </div>
                  <div className="text-[11px] font-bold text-zinc-950 line-clamp-1">
                    {tip.title}
                  </div>
                  <div className="text-[10px] text-zinc-500 line-clamp-2 mt-0.5">
                    {tip.action}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default GrowthGraph;
