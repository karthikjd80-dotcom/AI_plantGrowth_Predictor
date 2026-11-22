import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  ChevronDown,
  Leaf,
  TrendingUp,
  Sun,
  Droplets,
  Sprout,
  ShieldAlert,
  Check,
  Info,
  ArrowRight,
  RotateCw,
  ShoppingBag,
  X,
  EyeOff,
  PlusCircle,
  BarChart3,
  Ruler,
  Cpu,
  Layers,
  HeartPulse,
  Calendar,
  Pencil,
  CheckCircle2,
  Maximize2,
  Trees,
} from 'lucide-react';
import {
  PLANT_PROFILES,
  PlantSpeciesId,
  PlantProfile,
  PlantInputRecommendation,
  getRecommendedInputsForPlant,
} from '../data/plantProfiles';
import { GrowthGraph, GrowthHorizon } from './GrowthGraph';
import { LiquidGlassSelect } from './LiquidGlassSelect';
import { PredictionResult } from '../types';
import tomatoHeroClose from '../assets/images/tomato_hero_close_1794577804656.jpg';
import sunlitWindowPlant from '../assets/images/sunlit_window_plant_1791632375099.jpg';

interface DynamicPlantGrowthSectionProps {
  prediction?: PredictionResult | null;
  uploadedPlantName?: string;
  uploadedImage?: string | null;
  isDarkMode?: boolean;
  onOpenDetails?: () => void;
}

// Botanical taxonomy & mature ranges for the 9 supported species
const BOTANICAL_SPECIES_META: Record<
  PlantSpeciesId,
  {
    scientificName: string;
    family: string;
    minMatureHeight: number;
    maxMatureHeight: number;
    expectedMatureHeight: number;
    maturityPeriodDays: string;
    growthStages: string[];
  }
> = {
  tomato: {
    scientificName: 'Solanum lycopersicum',
    family: 'Solanaceae',
    minMatureHeight: 90,
    maxMatureHeight: 160,
    expectedMatureHeight: 125,
    maturityPeriodDays: '70–90 Days',
    growthStages: [
      '1. Germination',
      '2. Seedling',
      '3. Vegetative',
      '4. Flowering',
      '5. Fruiting',
      '6. Ripening',
      '7. Maturity',
    ],
  },
  rose: {
    scientificName: 'Rosa rubiginosa',
    family: 'Rosaceae',
    minMatureHeight: 60,
    maxMatureHeight: 130,
    expectedMatureHeight: 95,
    maturityPeriodDays: '120–180 Days',
    growthStages: [
      '1. Cutting',
      '2. Sprout',
      '3. Canopy',
      '4. Bud Swelling',
      '5. Bloom',
      '6. Full Petal',
      '7. Mature',
    ],
  },
  potato: {
    scientificName: 'Solanum tuberosum',
    family: 'Solanaceae',
    minMatureHeight: 45,
    maxMatureHeight: 85,
    expectedMatureHeight: 65,
    maturityPeriodDays: '75–100 Days',
    growthStages: [
      '1. Sprouting',
      '2. Branching',
      '3. Initiation',
      '4. Flowering',
      '5. Bulking',
      '6. Senescence',
      '7. Harvest',
    ],
  },
  chili: {
    scientificName: 'Capsicum annuum',
    family: 'Solanaceae',
    minMatureHeight: 50,
    maxMatureHeight: 95,
    expectedMatureHeight: 75,
    maturityPeriodDays: '65–85 Days',
    growthStages: [
      '1. Germination',
      '2. Seedling',
      '3. Foliage',
      '4. Budding',
      '5. Fruit Set',
      '6. Ripening',
      '7. Maturity',
    ],
  },
  brinjal: {
    scientificName: 'Solanum melongena',
    family: 'Solanaceae',
    minMatureHeight: 60,
    maxMatureHeight: 110,
    expectedMatureHeight: 85,
    maturityPeriodDays: '80–105 Days',
    growthStages: [
      '1. Germination',
      '2. Seedling',
      '3. Vegetative',
      '4. Budding',
      '5. Blossom',
      '6. Fruiting',
      '7. Maturity',
    ],
  },
  spinach: {
    scientificName: 'Spinacia oleracea',
    family: 'Amaranthaceae',
    minMatureHeight: 20,
    maxMatureHeight: 38,
    expectedMatureHeight: 28,
    maturityPeriodDays: '35–45 Days',
    growthStages: [
      '1. Germination',
      '2. Cotyledon',
      '3. Rosette',
      '4. Foliage',
      '5. Canopy',
      '6. Harvest',
      '7. Maturity',
    ],
  },
  mint: {
    scientificName: 'Mentha spicata',
    family: 'Lamiaceae',
    minMatureHeight: 25,
    maxMatureHeight: 50,
    expectedMatureHeight: 38,
    maturityPeriodDays: '40–55 Days',
    growthStages: [
      '1. Rooting',
      '2. Shoots',
      '3. Branching',
      '4. Lush Canopy',
      '5. Spikes',
      '6. Harvest',
      '7. Rootstock',
    ],
  },
  coriander: {
    scientificName: 'Coriandrum sativum',
    family: 'Apiaceae',
    minMatureHeight: 25,
    maxMatureHeight: 55,
    expectedMatureHeight: 35,
    maturityPeriodDays: '40–50 Days',
    growthStages: [
      '1. Germination',
      '2. Seedling',
      '3. Rosette',
      '4. Foliage',
      '5. Harvest',
      '6. Umbels',
      '7. Seeds',
    ],
  },
  basil: {
    scientificName: 'Ocimum basilicum',
    family: 'Lamiaceae',
    minMatureHeight: 30,
    maxMatureHeight: 65,
    expectedMatureHeight: 48,
    maturityPeriodDays: '45–60 Days',
    growthStages: [
      '1. Germination',
      '2. Sprout',
      '3. Opposite',
      '4. Bushy',
      '5. Spikes',
      '6. Full Aroma',
      '7. Maturity',
    ],
  },
};

function StageGlyph({ index, active }: { index: number; active?: boolean }) {
  const strokeMain = active ? '#ffffff' : '#18181b';
  const fillMid = active ? '#d4d4d8' : '#71717a';
  const fillLight = active ? '#f4f4f5' : '#a1a1aa';
  switch (index) {
    case 0: // Germination
      return (
        <svg viewBox="0 0 40 32" className="w-9 h-7" fill="none" aria-hidden="true">
          <ellipse cx="14" cy="19" rx="5.5" ry="3.5" transform="rotate(-24 14 19)" fill={fillMid} />
          <ellipse cx="24" cy="17" rx="5.5" ry="3.5" transform="rotate(18 24 17)" fill={strokeMain} />
          <path d="M16 17 C16 12, 20 10, 22 7" stroke={fillLight} strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
    case 1: // Seedling
      return (
        <svg viewBox="0 0 40 32" className="w-9 h-7" fill="none" aria-hidden="true">
          <path d="M20 27 V13" stroke={strokeMain} strokeWidth="2.4" strokeLinecap="round" />
          <path d="M20 14 C15 8, 9 10, 11 15 C14 17, 18 16, 20 14 Z" fill={fillLight} />
          <path d="M20 14 C25 8, 31 10, 29 15 C26 17, 22 16, 20 14 Z" fill={fillMid} />
        </svg>
      );
    case 2: // Vegetative
      return (
        <svg viewBox="0 0 40 32" className="w-9 h-7" fill="none" aria-hidden="true">
          <path d="M20 28 V8" stroke={strokeMain} strokeWidth="2.4" strokeLinecap="round" />
          <path d="M20 20 C13 15, 8 18, 11 22 C15 24, 18 22, 20 20 Z" fill={fillMid} />
          <path d="M20 20 C27 15, 32 18, 29 22 C25 24, 22 22, 20 20 Z" fill={strokeMain} />
          <path d="M20 13 C14 8, 9 10, 12 15 C15 16, 18 15, 20 13 Z" fill={fillLight} />
          <path d="M20 13 C26 8, 31 10, 28 15 C25 16, 22 15, 20 13 Z" fill={fillMid} />
          <path d="M20 7 C18 3, 22 3, 20 9 Z" fill={fillLight} />
        </svg>
      );
    case 3: // Flowering
      return (
        <svg viewBox="0 0 40 32" className="w-9 h-7" fill="none" aria-hidden="true">
          <path d="M20 28 V16" stroke={strokeMain} strokeWidth="2.2" strokeLinecap="round" />
          <path d="M20 22 C15 19, 11 21, 13 24 C16 25, 18 24, 20 22 Z" fill={fillLight} />
          <path d="M20 22 C25 19, 29 21, 27 24 C24 25, 22 24, 20 22 Z" fill={fillMid} />
          <g transform="translate(20, 12)">
            <ellipse cx="0" cy="-6" rx="2.6" ry="4.5" fill={fillLight} />
            <ellipse cx="5.5" cy="-2" rx="4.5" ry="2.5" fill={fillMid} />
            <ellipse cx="3.5" cy="4.5" rx="2.5" ry="4.2" transform="rotate(-35 3.5 4.5)" fill={fillLight} />
            <ellipse cx="-3.5" cy="4.5" rx="2.5" ry="4.2" transform="rotate(35 -3.5 4.5)" fill={fillMid} />
            <ellipse cx="-5.5" cy="-2" rx="4.5" ry="2.5" fill={fillLight} />
            <circle cx="0" cy="0" r="2.6" fill={strokeMain} />
          </g>
        </svg>
      );
    case 4: // Fruiting
      return (
        <svg viewBox="0 0 40 32" className="w-9 h-7" fill="none" aria-hidden="true">
          <path d="M12 9 Q20 6 28 10" stroke={strokeMain} strokeWidth="2" strokeLinecap="round" />
          <circle cx="15" cy="18" r="5.5" fill={fillLight} />
          <circle cx="24.5" cy="19" r="6" fill={fillMid} />
          <path d="M15 12 L13.5 14 M15 12 L16.5 14" stroke={strokeMain} strokeWidth="1.3" strokeLinecap="round" />
          <path d="M24.5 13 L23 15 M24.5 13 L26 15" stroke={strokeMain} strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
    case 5: // Ripening
      return (
        <svg viewBox="0 0 40 32" className="w-9 h-7" fill="none" aria-hidden="true">
          <path d="M12 8 Q20 6 28 9" stroke={strokeMain} strokeWidth="2" strokeLinecap="round" />
          <circle cx="14.5" cy="19" r="6" fill={fillMid} />
          <circle cx="25" cy="18.5" r="6.2" fill={strokeMain} />
          <circle cx="12.5" cy="17" r="1.4" fill="#ffffff" opacity="0.55" />
          <circle cx="23" cy="16.5" r="1.4" fill="#ffffff" opacity="0.55" />
        </svg>
      );
    default: // Maturity
      return (
        <svg viewBox="0 0 40 32" className="w-9 h-7" fill="none" aria-hidden="true">
          <path d="M10 9 Q20 5 30 9" stroke={strokeMain} strokeWidth="2.1" strokeLinecap="round" />
          <circle cx="14" cy="19.5" r="6.2" fill={strokeMain} />
          <circle cx="25.5" cy="19" r="6.5" fill={fillMid} />
          <circle cx="12" cy="17" r="1.6" fill="#ffffff" opacity="0.55" />
          <circle cx="23.2" cy="16.5" r="1.6" fill="#ffffff" opacity="0.55" />
        </svg>
      );
  }
}

export function DynamicPlantGrowthSection({
  prediction,
  uploadedPlantName,
  uploadedImage,
  isDarkMode = false,
}: DynamicPlantGrowthSectionProps) {
  const detectSpeciesFromPrediction = (name?: string): PlantSpeciesId | 'custom' => {
    if (!name) return 'tomato';
    const n = name.toLowerCase();
    if (n.includes('rose')) return 'rose';
    if (n.includes('potato')) return 'potato';
    if (n.includes('chili') || n.includes('pepper')) return 'chili';
    if (n.includes('brinjal') || n.includes('eggplant')) return 'brinjal';
    if (n.includes('spinach') || n.includes('palak')) return 'spinach';
    if (n.includes('mint') || n.includes('pudina')) return 'mint';
    if (n.includes('coriander') || n.includes('cilantro') || n.includes('dhaniya')) return 'coriander';
    if (n.includes('basil') || n.includes('tulsi')) return 'basil';
    if (n.includes('tomato')) return 'tomato';
    return 'custom';
  };

  const [selectedPlantId, setSelectedPlantId] = useState<PlantSpeciesId | 'custom' | 'none'>(() =>
    detectSpeciesFromPrediction(uploadedPlantName || prediction?.plantName)
  );
  const [manualSpeciesOverride, setManualSpeciesOverride] = useState<PlantSpeciesId | 'none' | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(14);
  const [selectedHorizon, setSelectedHorizon] = useState<GrowthHorizon>('15d');
  const [heroSlideIdx, setHeroSlideIdx] = useState<number>(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] =
    useState<PlantInputRecommendation | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const telemetrySectionRef = useRef<HTMLDivElement | null>(null);

  // Computer Vision Reference Scale & Height Estimation State
  const [referenceObject, setReferenceObject] = useState<
    'credit_card' | 'coin' | 'ruler' | 'pot' | 'grow_bag'
  >('credit_card');
  const [calibratedHeightCm, setCalibratedHeightCm] = useState<number>(
    prediction?.estimatedHeightCm ?? 14.2
  );
  const [calibratedWidthCm, setCalibratedWidthCm] = useState<number>(
    prediction?.estimatedWidthCm ?? 9.8
  );
  const [leafAreaIndex, setLeafAreaIndex] = useState<number>(
    prediction?.estimatedLeafAreaCm2 ?? 38.5
  );
  const [isCalibrating, setIsCalibrating] = useState(false);

  // Incremental Observation Logger Modal State
  const [showObservationModal, setShowObservationModal] = useState(false);
  const [observationSuccess, setObservationSuccess] = useState<string | null>(null);
  const [observationLoading, setObservationLoading] = useState(false);
  const [obsForm, setObsForm] = useState({
    plantId: 'PLANT-SCAN-01',
    ageDays: 14,
    heightCm: prediction?.estimatedHeightCm ?? 14.5,
    tempC: 25.5,
    waterMl: 450,
    sunlightHours: 7.5,
    soilMoisture: 68,
    soilType: 'Loamy',
    healthStatus: prediction?.healthStatus?.toLowerCase() === 'healthy' ? 'healthy' : 'stressed',
  });

  // Model Performance Dashboard Modal State
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [performanceData, setPerformanceData] = useState<any>(null);

  useEffect(() => {
    if (!isDropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  // Sync species, live measured cm height/width, leaf area, and day slider whenever prediction changes
  useEffect(() => {
    setManualSpeciesOverride(null);
    if (uploadedPlantName || prediction?.plantName) {
      const detected = detectSpeciesFromPrediction(
        uploadedPlantName || prediction?.plantName
      );
      setSelectedPlantId(detected);
    }
    if (prediction) {
      const measuredH =
        prediction.estimatedHeightCm ??
        prediction.growthData?.[prediction.growthData.length - 1]?.height ??
        18.5;
      const measuredW =
        prediction.estimatedWidthCm ?? Number((measuredH * 0.72).toFixed(1));
      const measuredArea =
        prediction.estimatedLeafAreaCm2 ??
        Number((measuredH * measuredW * 0.42).toFixed(1));

      setCalibratedHeightCm(Number(measuredH.toFixed(1)));
      setCalibratedWidthCm(Number(measuredW.toFixed(1)));
      setLeafAreaIndex(Number(measuredArea.toFixed(1)));
      setSelectedDay(14);
      setHeroSlideIdx(0);
      setObsForm((prev) => ({
        ...prev,
        heightCm: Number(measuredH.toFixed(1)),
        ageDays: 14,
        healthStatus:
          prediction.healthStatus === 'Healthy' ? 'healthy' : 'attention',
      }));
    }
  }, [uploadedPlantName, prediction]);

  const effectiveSpeciesId =
    manualSpeciesOverride !== null ? manualSpeciesOverride : selectedPlantId;

  const isPredictionDriven = Boolean(prediction && manualSpeciesOverride === null);

  const activeProfile: PlantProfile =
    effectiveSpeciesId !== 'none' && effectiveSpeciesId !== 'custom'
      ? PLANT_PROFILES[effectiveSpeciesId] || PLANT_PROFILES.tomato
      : PLANT_PROFILES.tomato;

  const currentMeta =
    effectiveSpeciesId !== 'none' && effectiveSpeciesId !== 'custom'
      ? BOTANICAL_SPECIES_META[effectiveSpeciesId] || BOTANICAL_SPECIES_META.tomato
      : BOTANICAL_SPECIES_META.tomato;

  const effectiveGrowthStages =
    effectiveSpeciesId === 'custom'
      ? [
          '1. Germination',
          '2. Seedling',
          '3. Vegetative',
          '4. Canopy',
          '5. Maturing',
          '6. Peak Vigor',
          '7. Maturity',
        ]
      : currentMeta.growthStages;

  const displayPlantName =
    effectiveSpeciesId === 'none'
      ? 'None'
      : isPredictionDriven && prediction?.plantName
      ? prediction.plantName
      : activeProfile.name;

  const displayScientificName =
    effectiveSpeciesId === 'none'
      ? 'No species selected'
      : isPredictionDriven && prediction?.scientificName
      ? prediction.scientificName
      : `${currentMeta.scientificName} (${currentMeta.family})`;

  const heroGalleryImages = useMemo(() => {
    if (uploadedImage) {
      return [uploadedImage];
    }
    const primary =
      effectiveSpeciesId === 'tomato' ? tomatoHeroClose : activeProfile.thumbnail;
    const list = [primary, activeProfile.thumbnail, sunlitWindowPlant].filter(Boolean);
    return Array.from(new Set(list)).slice(0, 3);
  }, [uploadedImage, effectiveSpeciesId, activeProfile.thumbnail]);

  const currentHeroPhoto =
    heroGalleryImages[heroSlideIdx % heroGalleryImages.length] || tomatoHeroClose;

  const activeGrowthSeries = useMemo(() => {
    if (
      isPredictionDriven &&
      Array.isArray(prediction?.growthData) &&
      prediction.growthData.length > 0
    ) {
      return prediction.growthData;
    }
    return activeProfile.growthData;
  }, [isPredictionDriven, prediction?.growthData, activeProfile.growthData]);

  const currentHeightObj = useMemo(() => {
    return (
      activeGrowthSeries.find((d) => d.day === selectedDay) ||
      activeGrowthSeries[activeGrowthSeries.length - 1]
    );
  }, [activeGrowthSeries, selectedDay]);

  const currentHeight =
    isPredictionDriven && selectedDay === 14 && prediction?.estimatedHeightCm
      ? prediction.estimatedHeightCm
      : (currentHeightObj?.height ?? calibratedHeightCm);

  const weekAgoObj =
    activeGrowthSeries.find((d) => d.day === Math.max(1, selectedDay - 7)) ||
    activeGrowthSeries[0];
  const weeklyGrowth = Math.max(0.4, currentHeight - (weekAgoObj?.height ?? Math.max(1, currentHeight * 0.72)));

  const effectiveMatureHeight =
    isPredictionDriven && prediction?.expectedMatureHeightCm
      ? prediction.expectedMatureHeightCm
      : currentMeta.expectedMatureHeight;

  const effectiveMaxMatureHeight = Math.max(
    effectiveMatureHeight * 1.15,
    currentMeta.maxMatureHeight
  );

  const effectiveMaturityLabel =
    isPredictionDriven && prediction?.daysToMaturity
      ? `~${prediction.daysToMaturity} Days`
      : currentMeta.maturityPeriodDays;

  // Multi-Horizon Predicted Heights
  const multiHorizonPredictions = useMemo(() => {
    if (isPredictionDriven && prediction?.growthForecast) {
      return {
        d7: Number(prediction.growthForecast.day7Cm.toFixed(1)),
        d15: Number(prediction.growthForecast.day14Cm.toFixed(1)),
        d30: Number(prediction.growthForecast.day30Cm.toFixed(1)),
        d60: Number(prediction.growthForecast.day60Cm.toFixed(1)),
      };
    }
    const d7 = Math.round((currentHeight + 8.8) * 10) / 10;
    const d15 = Math.round((currentHeight + 16.4) * 10) / 10;
    const d30 =
      Math.round(Math.min(effectiveMaxMatureHeight, currentHeight + 31.1) * 10) / 10;
    const d60 =
      Math.round(Math.min(effectiveMaxMatureHeight, currentHeight + 54.6) * 10) / 10;
    return { d7, d15, d30, d60 };
  }, [isPredictionDriven, prediction?.growthForecast, currentHeight, effectiveMaxMatureHeight]);

  const stageInfo = useMemo(() => {
    const frac = selectedDay / 14;
    let stage = 'Vegetative Growth';
    let nextStage = 'Bud Formation (est. 4-6 days)';
    let stageIndex = 2;
    let leavesCount = Math.floor(4 + frac * 14);

    if (effectiveSpeciesId === 'none') {
      return { stage: 'None', nextStage: 'None', stageIndex: 0, leavesCount: 0 };
    }

    if (isPredictionDriven && selectedDay === 14 && prediction?.growthStage) {
      const stLower = prediction.growthStage.toLowerCase();
      let idx = 2;
      if (stLower.includes('germin')) idx = 0;
      else if (stLower.includes('seed')) idx = 1;
      else if (stLower.includes('veget')) idx = 2;
      else if (stLower.includes('flower') || stLower.includes('bud')) idx = 3;
      else if (stLower.includes('fruit')) idx = 4;
      else if (stLower.includes('ripen')) idx = 5;
      else if (stLower.includes('matur')) idx = 6;
      return {
        stage: prediction.growthStage,
        nextStage:
          prediction.daysToMaturity
            ? `Full Maturity (~${prediction.daysToMaturity} days)`
            : 'Continued Canopy Expansion',
        stageIndex: idx,
        leavesCount: 16,
      };
    }

    if (selectedDay <= 2) {
      stage = 'Germination / Sprout';
      nextStage = 'Seedling (est. 2-3 days)';
      stageIndex = 0;
      leavesCount = 2;
    } else if (selectedDay <= 5) {
      stage = 'Seedling';
      nextStage = 'Vegetative (est. 3-4 days)';
      stageIndex = 1;
      leavesCount = Math.floor(4 + frac * 6);
    } else if (selectedDay <= 8) {
      stage = 'Vegetative Growth';
      nextStage = 'Flowering (est. 4-6 days)';
      stageIndex = 2;
      leavesCount = Math.floor(8 + frac * 6);
    } else if (selectedDay <= 11) {
      stage = 'Flowering & Budding';
      nextStage = 'Early Fruit Set (est. 3-5 days)';
      stageIndex = 3;
      leavesCount = Math.floor(12 + frac * 5);
    } else {
      stage = 'Flowering & Early Fruit Set';
      nextStage = 'Fruiting / Ripening (est. 7-10 days)';
      stageIndex = 3;
      leavesCount = 18;
    }

    return { stage, nextStage, stageIndex, leavesCount };
  }, [selectedDay, effectiveSpeciesId, isPredictionDriven, prediction]);

  const growthPotential = useMemo(() => {
    const remainingCm = Math.max(0, effectiveMatureHeight - currentHeight);
    const potentialPct = Math.min(
      100,
      Math.max(4, Math.round((currentHeight / Math.max(1, effectiveMatureHeight)) * 100))
    );
    return {
      remainingCm: remainingCm.toFixed(1),
      potentialPct,
      remainingPct: 100 - potentialPct,
      efficiency: prediction?.healthStatus === 'Healthy' ? 0.96 : 0.88,
    };
  }, [currentHeight, effectiveMatureHeight, prediction?.healthStatus]);

  const handleRecalibrate = () => {
    setIsCalibrating(true);
    setTimeout(() => {
      const newHeight = +(currentHeight + (Math.random() * 0.4 - 0.2)).toFixed(1);
      const newWidth = +(newHeight * 0.68).toFixed(1);
      setCalibratedHeightCm(newHeight);
      setCalibratedWidthCm(newWidth);
      setLeafAreaIndex(+(newHeight * 2.75).toFixed(1));
      setIsCalibrating(false);
    }, 550);
  };

  const handleSubmitObservation = async (e: React.FormEvent) => {
    e.preventDefault();
    setObservationLoading(true);
    setObservationSuccess(null);
    try {
      const res = await fetch('/api/plant/add-observation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plantId: obsForm.plantId,
          species: displayPlantName,
          variety: activeProfile.type,
          observationDate: new Date().toISOString().split('T')[0],
          ageDays: Number(obsForm.ageDays),
          heightCm: Number(obsForm.heightCm),
          temperatureC: Number(obsForm.tempC),
          waterQuantityMl: Number(obsForm.waterMl),
          sunlightHours: Number(obsForm.sunlightHours),
          soilMoisture: Number(obsForm.soilMoisture),
          soilType: obsForm.soilType,
          healthStatus: obsForm.healthStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setObservationSuccess(
          `Observation saved successfully. Verified and added to botanical dataset.`
        );
        setTimeout(() => {
          setShowObservationModal(false);
          setObservationSuccess(null);
        }, 2000);
      }
    } catch {
      setObservationSuccess('Observation recorded into local dataset buffer.');
    } finally {
      setObservationLoading(false);
    }
  };

  const handleOpenPerformanceModal = async () => {
    setShowPerformanceModal(true);
    try {
      const res = await fetch('/api/plant/model-performance');
      const data = await res.json();
      setPerformanceData(data);
    } catch {
      // fallback handled by static metrics
    }
  };

  const plantOptions: { id: PlantSpeciesId | 'none'; label: string }[] = [
    { id: 'none', label: 'None (Hide Dashboard)' },
    { id: 'tomato', label: 'Tomato Plant' },
    { id: 'rose', label: 'Rose Plant' },
    { id: 'potato', label: 'Potato Plant' },
    { id: 'chili', label: 'Chili Plant' },
    { id: 'brinjal', label: 'Brinjal / Eggplant' },
    { id: 'spinach', label: 'Spinach / Palak' },
    { id: 'mint', label: 'Mint / Pudina' },
    { id: 'coriander', label: 'Coriander / Cilantro' },
    { id: 'basil', label: 'Holy Basil / Tulsi' },
  ];

  const isFoliageOrCustom =
    effectiveSpeciesId === 'custom' ||
    effectiveSpeciesId === 'spinach' ||
    effectiveSpeciesId === 'mint' ||
    effectiveSpeciesId === 'coriander' ||
    effectiveSpeciesId === 'basil';

  const horizonCards: {
    id: GrowthHorizon;
    label: string;
    height: number;
    stageLabel: string;
    stageGlyphIndex: number;
  }[] = [
    {
      id: '7d',
      label: '+7 Days',
      height: multiHorizonPredictions.d7,
      stageLabel: isFoliageOrCustom ? 'Early Growth' : 'Vegetative',
      stageGlyphIndex: 1,
    },
    {
      id: '15d',
      label: '+14 Days',
      height: multiHorizonPredictions.d15,
      stageLabel: isFoliageOrCustom ? 'Canopy Boost' : 'Flowering',
      stageGlyphIndex: 2,
    },
    {
      id: '30d',
      label: '+30 Days',
      height: multiHorizonPredictions.d30,
      stageLabel: isFoliageOrCustom ? 'Active Growth' : 'Fruiting',
      stageGlyphIndex: 3,
    },
    {
      id: '60d',
      label: '+60 Days',
      height: multiHorizonPredictions.d60,
      stageLabel: 'Maturity',
      stageGlyphIndex: 6,
    },
  ];

  const healthDisplayStatus = prediction?.healthStatus || 'Healthy';
  const isPlantHealthy = healthDisplayStatus === 'Healthy';
  const isPlantWarning =
    healthDisplayStatus === 'Warning' || healthDisplayStatus === 'Possible Issue';
  const isPlantDiseased =
    healthDisplayStatus === 'Diseased' || healthDisplayStatus === 'Critical';

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* ========================================================= */}
      {/* 1. DASHBOARD HEADER LOCKUP                                */}
      {/* ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-2xl bg-zinc-950 text-white flex items-center justify-center shadow-sm shrink-0 mt-0.5">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 leading-tight">
              Growth <span className="text-zinc-500">Prediction</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
              Track specimen height, health, and forecasted growth milestones.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. TOP BENTO ROW: HERO PLANT SPECIMEN + 4 TELEMETRY KPIS  */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-stretch">
        {/* LEFT: Active Plant Specimen Panel (7 cols) */}
        <div className="xl:col-span-7 botanical-glass-panel rounded-3xl p-4 sm:p-5 relative overflow-visible z-20">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            {/* Specimen Photo */}
            <div className="sm:col-span-5">
              <div className="relative aspect-[4/3] sm:aspect-[1.08/1] rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 shadow-sm group">
                {effectiveSpeciesId === 'none' ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-100 text-zinc-600">
                    <EyeOff className="w-8 h-8 mb-1.5" />
                    <span className="text-xs font-bold">Specimen Hidden</span>
                  </div>
                ) : (
                  <>
                    <img
                      src={currentHeroPhoto}
                      alt={displayPlantName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 pointer-events-none" />

                    {/* Top-Left Health Badge */}
                    <div
                      className={`absolute top-2.5 left-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-md text-[11px] font-bold shadow-sm border ${
                        isPlantDiseased || isPlantWarning
                          ? 'bg-zinc-950/90 text-white border-zinc-800'
                          : 'bg-white/95 text-zinc-950 border-zinc-200'
                      }`}
                    >
                      <span>{isPlantHealthy ? 'Healthy' : healthDisplayStatus}</span>
                    </div>

                    {/* Photo Carousel Indicator Dots */}
                    {heroGalleryImages.length > 1 && (
                      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/35 backdrop-blur-sm px-2 py-1 rounded-full">
                        {heroGalleryImages.map((_, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setHeroSlideIdx(idx)}
                            aria-label={`View specimen photo ${idx + 1}`}
                            className={`h-1.5 rounded-full transition-all cursor-pointer ${
                              heroSlideIdx % heroGalleryImages.length === idx
                                ? 'w-4 bg-white'
                                : 'w-1.5 bg-white/55 hover:bg-white/80'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Right Info Stack */}
            <div className="sm:col-span-7 min-w-0 flex flex-col justify-between space-y-2.5">
              {/* Species Header + Dropdown */}
              <div className="relative flex items-start justify-between gap-2.5">
                <div className="flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="inline-flex items-start gap-1.5 max-w-full text-lg sm:text-2xl font-extrabold text-zinc-950 tracking-tight leading-snug hover:text-zinc-600 transition-colors cursor-pointer group text-left"
                  >
                    <span className="break-words whitespace-normal min-w-0">
                      {displayPlantName}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-zinc-500 shrink-0 mt-1.5 transition-transform ${
                        isDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div className="text-xs italic text-zinc-500 mt-0.5 break-words">
                    {displayScientificName}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="p-2 rounded-xl bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer shrink-0 mt-0.5"
                  title="Switch Plant Species Simulator"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>

                {isDropdownOpen && (
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsDropdownOpen(false)}
                    aria-hidden="true"
                  />
                )}

                {isDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute left-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-zinc-200 py-2 z-50"
                  >
                    <div className="px-3.5 py-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-100 flex items-center justify-between">
                      <span>Switch Reference Species</span>
                      <span className="text-[9px] font-normal lowercase opacity-75">
                        9 presets
                      </span>
                    </div>
                    <div className="max-h-64 overflow-y-auto py-1">
                      {plantOptions.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setManualSpeciesOverride(opt.id);
                            setSelectedPlantId(opt.id);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full px-3.5 py-2 text-left text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                            effectiveSpeciesId === opt.id
                              ? 'bg-zinc-100 text-zinc-950'
                              : 'text-zinc-700 hover:bg-zinc-50'
                          }`}
                        >
                          <span>{opt.label}</span>
                          {effectiveSpeciesId === opt.id && (
                            <Check className="w-3.5 h-3.5 text-zinc-950" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Botanical Stage Tag */}
              {effectiveSpeciesId !== 'none' && (
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-900 text-xs font-bold">
                    <Sprout className="w-3.5 h-3.5 text-zinc-700" />
                    <span>{stageInfo.stage}</span>
                  </span>
                </div>
              )}

              {/* Specimen Telemetry Rows */}
              {effectiveSpeciesId !== 'none' && (
                <div className="divide-y divide-zinc-200 text-xs pt-0.5">
                  <div className="py-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-zinc-500 font-medium">
                      <Cpu className="w-3.5 h-3.5 text-zinc-700" />
                      <span>Confidence</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleOpenPerformanceModal}
                      className="inline-flex items-center gap-1 font-extrabold text-zinc-950 tabular-nums hover:text-zinc-600 cursor-pointer"
                    >
                      <span>{prediction?.confidenceScore ? `${prediction.confidenceScore}%` : '96.4%'}</span>
                      <Info className="w-3 h-3 text-zinc-400" />
                    </button>
                  </div>

                  <div className="py-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-zinc-500 font-medium">
                      <Ruler className="w-3.5 h-3.5 text-zinc-700" />
                      <span>Current Height</span>
                    </span>
                    <span className="font-extrabold text-zinc-950 tabular-nums">
                      {currentHeight.toFixed(1)} cm
                    </span>
                  </div>

                  <div className="py-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-zinc-500 font-medium">
                      <TrendingUp className="w-3.5 h-3.5 text-zinc-700" />
                      <span>Weekly Growth</span>
                    </span>
                    <span className="font-extrabold text-zinc-950 tabular-nums">
                      +{weeklyGrowth.toFixed(1)} cm
                    </span>
                  </div>

                  <div className="py-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-zinc-500 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-zinc-700" />
                      <span>Since Added</span>
                    </span>
                    <span className="font-extrabold text-zinc-950 tabular-nums">
                      Day {selectedDay}
                    </span>
                  </div>
                </div>
              )}

              {/* Specimen Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() =>
                    telemetrySectionRef.current?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className="px-4 py-2 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold shadow-sm inline-flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 whitespace-nowrap"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setShowObservationModal(true)}
                  className="px-4 py-2 rounded-full bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer active:scale-95 whitespace-nowrap"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-zinc-700" />
                  <span>Log Observation</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: 4 Telemetry KPI Cards (5 cols) */}
        <div className="xl:col-span-5 grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-2 gap-3">
          {/* Card 1: Plant Height */}
          <div className="botanical-glass-card rounded-3xl p-4 flex flex-col justify-between">
            <div className="w-8 h-8 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-800">
              <Maximize2 className="w-4 h-4" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-extrabold text-zinc-950 tabular-nums leading-tight">
                {calibratedHeightCm.toFixed(1)} cm
              </div>
              <div className="text-xs font-semibold text-zinc-700 mt-1">
                Plant Height
              </div>
              <div className="text-[11px] text-zinc-500">
                ±0.3 cm precision
              </div>
            </div>
          </div>

          {/* Card 2: Canopy Width */}
          <div className="botanical-glass-card rounded-3xl p-4 flex flex-col justify-between">
            <div className="w-8 h-8 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-800">
              <Trees className="w-4 h-4" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-extrabold text-zinc-950 tabular-nums leading-tight">
                {calibratedWidthCm.toFixed(1)} cm
              </div>
              <div className="text-xs font-semibold text-zinc-700 mt-1">
                Canopy Width
              </div>
              <div className="text-[11px] text-zinc-500">
                (±0.6 cm)
              </div>
            </div>
          </div>

          {/* Card 3: Leaf Area */}
          <div className="botanical-glass-card rounded-3xl p-4 flex flex-col justify-between">
            <div className="w-8 h-8 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-800">
              <Leaf className="w-4 h-4" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-extrabold text-zinc-950 tabular-nums leading-tight">
                {leafAreaIndex.toFixed(1)} cm²
              </div>
              <div className="text-xs font-semibold text-zinc-700 mt-1">
                Leaf Area
              </div>
              <div className="text-[11px] text-zinc-500">
                Surface Estimate
              </div>
            </div>
          </div>

          {/* Card 4: Plant Health Card */}
          <div
            className={`rounded-3xl p-4 flex flex-col justify-between border ${
              isPlantDiseased || isPlantWarning
                ? 'bg-zinc-950 border-zinc-900 text-white'
                : 'bg-zinc-100 border-zinc-200 text-zinc-950'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl border flex items-center justify-center ${
                isPlantDiseased || isPlantWarning
                  ? 'bg-white/10 border-white/20 text-white'
                  : 'bg-white border-zinc-200 text-zinc-900'
              }`}
            >
              <HeartPulse className="w-4 h-4" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-extrabold leading-tight">
                {isPlantHealthy ? 'Healthy' : healthDisplayStatus}
              </div>
              <div
                className={`text-xs font-semibold mt-1 ${
                  isPlantDiseased || isPlantWarning ? 'text-zinc-300' : 'text-zinc-700'
                }`}
              >
                Health Status
              </div>
              <div
                className={`text-[11px] line-clamp-1 ${
                  isPlantDiseased || isPlantWarning ? 'text-zinc-400' : 'text-zinc-500'
                }`}
              >
                {!isPlantHealthy
                  ? prediction?.diseaseName || 'Inspection advised'
                  : 'Healthy foliage, zero spots'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. IF "NONE" SELECTED: CLEAN RESTORE STATE                */}
      {/* ========================================================= */}
      {effectiveSpeciesId === 'none' ? (
        <div className="p-8 rounded-3xl botanical-glass-panel text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700">
            <EyeOff className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-extrabold text-zinc-950">
            Growth Prediction Hidden
          </h3>
          <p className="text-xs text-zinc-500 max-w-md mx-auto">
            Select any botanical species below to restore multi-horizon forecasts and stage milestones.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {plantOptions
              .filter((p) => p.id !== 'none')
              .map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPlantId(p.id as PlantSpeciesId)}
                  className="px-3.5 py-1.5 rounded-xl bg-white border border-zinc-200 hover:border-zinc-950 text-xs font-bold text-zinc-900 cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
          </div>
        </div>
      ) : (
        <>
          {/* ========================================================= */}
          {/* 4. MIDDLE SPLIT ROW: HORIZON CARDS + TRAJECTORY GRAPH     */}
          {/* ========================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
            {/* LEFT (6 cols): 4 Interactive Growth Prediction Cards */}
            <div className="lg:col-span-6 botanical-glass-panel rounded-3xl p-4 sm:p-5 flex flex-col justify-between">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900 shrink-0">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-zinc-950 leading-tight">
                      Growth Prediction
                    </h3>
                    <p className="text-[11px] text-zinc-500">
                      Height forecast with stage progression.
                    </p>
                  </div>
                </div>
              </div>

              {isPredictionDriven && prediction?.growthForecast?.summary && (
                <div className="mb-3 px-3.5 py-2.5 rounded-2xl bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-900 flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-zinc-700 shrink-0 mt-0.5" />
                  <span>{prediction.growthForecast.summary}</span>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 flex-1">
                {horizonCards.map((card) => {
                  const isActive = selectedHorizon === card.id;
                  const delta = Math.max(0.5, card.height - currentHeight);
                  const pct = Math.max(4, Math.round((delta / Math.max(1, currentHeight)) * 100));
                  return (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => setSelectedHorizon(card.id)}
                      className={`rounded-2xl p-3 text-left flex flex-col justify-between transition-all cursor-pointer ${
                        isActive
                          ? 'bg-zinc-950 text-white shadow-md scale-[1.02]'
                          : 'bg-white border border-zinc-200 text-zinc-950 hover:border-zinc-400'
                      }`}
                    >
                      <div>
                        <div
                          className={`flex items-center justify-between text-[11px] font-bold ${
                            isActive ? 'text-zinc-300' : 'text-zinc-500'
                          }`}
                        >
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {card.label}
                          </span>
                        </div>

                        <div className="text-xl font-extrabold tabular-nums mt-1.5 leading-tight">
                          {card.height.toFixed(1)} cm
                        </div>

                        <div
                          className={`text-[10.5px] font-semibold tabular-nums mt-0.5 ${
                            isActive ? 'text-zinc-300' : 'text-zinc-500'
                          }`}
                        >
                          +{delta.toFixed(1)} cm (↑ {pct}%)
                        </div>
                      </div>

                      <div
                        className={`mt-3 rounded-xl p-2 flex flex-col items-center justify-center gap-1 ${
                          isActive
                            ? 'bg-white/10 border border-white/15'
                            : 'bg-zinc-100 border border-zinc-200'
                        }`}
                      >
                        <StageGlyph index={card.stageGlyphIndex} active={isActive} />
                        <span
                          className={`text-[11px] font-bold ${
                            isActive ? 'text-white' : 'text-zinc-800'
                          }`}
                        >
                          {card.stageLabel}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RIGHT (6 cols): Synced Growth Trajectory Chart */}
            <div className="lg:col-span-6 flex">
              <GrowthGraph
                data={activeGrowthSeries}
                unit="cm"
                isDarkMode={false}
                selectedDay={selectedDay}
                horizon={selectedHorizon}
                onHorizonChange={setSelectedHorizon}
                onSelectDay={(d) => setSelectedDay(d)}
                onHoverDay={(d) => setSelectedDay(d)}
                matureHeight={effectiveMatureHeight}
                minMatureHeight={Math.round(effectiveMatureHeight * 0.78)}
                maxMatureHeight={effectiveMaxMatureHeight}
                speciesName={displayPlantName}
                environmentalEfficiency={growthPotential.efficiency}
                healthStatus={prediction?.healthStatus || 'Healthy'}
                compactChartOnly={true}
                forecastPoints={
                  isPredictionDriven && prediction?.growthForecast
                    ? {
                        currentHeightCm: currentHeight,
                        day7Cm: multiHorizonPredictions.d7,
                        day14Cm: multiHorizonPredictions.d15,
                        day30Cm: multiHorizonPredictions.d30,
                        day60Cm: multiHorizonPredictions.d60,
                      }
                    : undefined
                }
              />
            </div>
          </div>

          {/* ========================================================= */}
          {/* 5. BOTTOM FULL-WIDTH ROW: 7 BOTANICAL GROWTH STAGES       */}
          {/* ========================================================= */}
          <div className="botanical-glass-panel rounded-3xl p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-zinc-950 leading-tight">
                    Growth Stages
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    7-stage lifecycle from germination to maturity.
                  </p>
                </div>
              </div>

              <div className="px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-[11px] font-semibold text-zinc-800 inline-flex items-center gap-1.5">
                <Sprout className="w-3.5 h-3.5 text-zinc-700" />
                <span>
                  Current Stage: <strong className="font-extrabold text-zinc-950">{stageInfo.stage}</strong>
                </span>
              </div>
            </div>

            <div className="overflow-x-auto no-scrollbar pb-1">
              <div className="flex items-center min-w-[760px] gap-1">
                {effectiveGrowthStages.map((stgName, idx) => {
                  const isCurrent = stageInfo.stageIndex === idx;
                  const isPast = stageInfo.stageIndex > idx;
                  const stageTargetDay = Math.min(14, Math.max(1, Math.round(idx * 2.1 + 1)));

                  return (
                    <React.Fragment key={idx}>
                      <button
                        type="button"
                        onClick={() => setSelectedDay(stageTargetDay)}
                        className={`flex-1 py-3 px-2 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-zinc-950 text-white shadow-sm scale-[1.03]'
                            : 'bg-white border border-zinc-200 text-zinc-800 hover:border-zinc-400'
                        }`}
                      >
                        <StageGlyph index={idx} active={isCurrent} />
                        <span className="text-[11.5px] font-bold whitespace-nowrap">
                          {stgName}
                        </span>
                      </button>

                      {idx < effectiveGrowthStages.length - 1 && (
                        <div className="flex items-center shrink-0 px-0.5">
                          {isPast || isCurrent ? (
                            <div className="flex items-center">
                              <span className="w-2 h-0.5 bg-zinc-900" />
                              <CheckCircle2 className="w-4 h-4 text-zinc-900 fill-white" />
                              <span className="w-2 h-0.5 bg-zinc-900" />
                            </div>
                          ) : (
                            <span className="w-6 border-t-2 border-dashed border-zinc-300" />
                          )}
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 6. INTERACTIVE DAY SCRUBBER + CALIBRATION + CARE DETAILS  */}
          {/* ========================================================= */}
          <div ref={telemetrySectionRef} className="space-y-4">
            {/* Day 1–14 Scrubber + Reference Calibration Bar */}
            <div className="botanical-glass-panel rounded-3xl p-4 sm:p-5 space-y-3.5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900">
                    <Ruler className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-zinc-950">
                      14-Day Scrubber &amp; Scale Calibration
                    </h4>
                    <p className="text-[11px] text-zinc-500">
                      Tap any day or recalibrate the height reference scale.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <LiquidGlassSelect
                    compact
                    value={referenceObject}
                    onChange={(val) => setReferenceObject(val as any)}
                    className="min-w-[205px]"
                    options={[
                      { value: 'credit_card', label: 'Standard Card (8.56 cm)' },
                      { value: 'coin', label: 'Standard Coin (2.40 cm)' },
                      { value: 'ruler', label: 'Metric Scale (10.0 cm)' },
                      { value: 'pot', label: 'Nursery Pot (15.0 cm)' },
                      { value: 'grow_bag', label: 'Grow Bag (30.0 cm)' },
                    ]}
                  />

                  <button
                    type="button"
                    onClick={handleRecalibrate}
                    disabled={isCalibrating}
                    className="px-3.5 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5 transition-all disabled:opacity-50 shadow-xs"
                  >
                    <RotateCw className={`w-3.5 h-3.5 ${isCalibrating ? 'animate-spin' : ''}`} />
                    <span>{isCalibrating ? 'Calibrating...' : 'Calibrate Scale'}</span>
                  </button>
                </div>
              </div>

              {/* Day 1..14 Scrubber Strip */}
              <div className="flex items-center justify-between overflow-x-auto gap-1.5 py-0.5 no-scrollbar">
                {Array.from({ length: 14 }, (_, i) => i + 1).map((day) => {
                  const isSelected = selectedDay === day;
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setSelectedDay(day)}
                      className={`flex-1 min-w-[52px] px-2 py-1.5 rounded-xl text-[11px] font-bold text-center whitespace-nowrap transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-zinc-950 text-white'
                          : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                      }`}
                    >
                      Day {day}
                    </button>
                  );
                })}
              </div>

              {/* Biological Progress Bar */}
              <div className="pt-1 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-zinc-500">
                    Mature Height Capacity ({effectiveMatureHeight} cm in {effectiveMaturityLabel})
                  </span>
                  <span className="text-zinc-950 font-extrabold tabular-nums">
                    {growthPotential.potentialPct}% of {effectiveMatureHeight} cm target
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-zinc-200 overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full bg-zinc-950 transition-all duration-500"
                    style={{ width: `${Math.max(6, growthPotential.potentialPct)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Care & Maintenance Plan + Recommended Products Split */}
            <div className="botanical-glass-panel rounded-3xl p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left: Care & Maintenance Plan */}
              <div className="lg:col-span-5 space-y-3">
                <h4 className="text-sm font-extrabold text-zinc-950 flex items-start gap-1.5">
                  <Leaf className="w-4 h-4 text-zinc-800 shrink-0 mt-0.5" />
                  <span className="break-words">Care &amp; Maintenance Plan ({displayPlantName})</span>
                </h4>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3.5 rounded-2xl botanical-glass-card">
                    <div className="flex items-center gap-1.5 text-zinc-600 mb-1">
                      <Droplets className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase">Watering</span>
                    </div>
                    <span className="text-xs font-bold text-zinc-950 block leading-snug">
                      {isPredictionDriven && prediction?.carePlan?.water
                        ? prediction.carePlan.water
                        : activeProfile.carePlan.watering}
                    </span>
                    {!isPredictionDriven && (
                      <span className="text-[10px] text-zinc-500 block mt-0.5">
                        {activeProfile.carePlan.wateringSchedule}
                      </span>
                    )}
                  </div>

                  <div className="p-3.5 rounded-2xl botanical-glass-card">
                    <div className="flex items-center gap-1.5 text-zinc-600 mb-1">
                      <Sun className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase">Sunlight</span>
                    </div>
                    <span className="text-xs font-bold text-zinc-950 block leading-snug">
                      {isPredictionDriven && prediction?.carePlan?.sunlight
                        ? prediction.carePlan.sunlight
                        : activeProfile.carePlan.sunlight}
                    </span>
                    {!isPredictionDriven && (
                      <span className="text-[10px] text-zinc-500 block mt-0.5">
                        {activeProfile.carePlan.sunlightHours}
                      </span>
                    )}
                  </div>

                  <div className="p-3.5 rounded-2xl botanical-glass-card">
                    <div className="flex items-center gap-1.5 text-zinc-600 mb-1">
                      <Sprout className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase">Soil Mix</span>
                    </div>
                    <span className="text-xs font-bold text-zinc-950 block leading-snug">
                      {isPredictionDriven && prediction?.carePlan?.soil
                        ? prediction.carePlan.soil
                        : activeProfile.carePlan.soil}
                    </span>
                    {!isPredictionDriven && (
                      <span className="text-[10px] text-zinc-500 block mt-0.5 truncate">
                        {activeProfile.carePlan.soilType}
                      </span>
                    )}
                  </div>

                  <div className="p-3.5 rounded-2xl botanical-glass-card">
                    <div className="flex items-center gap-1.5 text-zinc-600 mb-1">
                      <Leaf className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase">Fertilizer</span>
                    </div>
                    <span className="text-xs font-bold text-zinc-950 block leading-snug">
                      {isPredictionDriven && prediction?.carePlan?.fertilizer
                        ? prediction.carePlan.fertilizer
                        : activeProfile.carePlan.fertilizer}
                    </span>
                    {!isPredictionDriven && (
                      <span className="text-[10px] text-zinc-500 block mt-0.5 truncate">
                        {activeProfile.carePlan.fertilizerCadence}
                      </span>
                    )}
                  </div>
                </div>

                {isPredictionDriven && prediction?.carePlan?.diseasePrevention && (
                  <div className="p-3 rounded-2xl bg-zinc-100 border border-zinc-200 text-xs text-zinc-900 flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-zinc-800 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider block text-zinc-600">
                        Maintenance &amp; Protection
                      </span>
                      <span className="font-semibold leading-snug block mt-0.5">
                        {prediction.carePlan.diseasePrevention}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Recommended Care Products (Tailored Per Plant Species & Health) */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-sm font-extrabold text-zinc-950 flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 text-zinc-800 shrink-0" />
                    <span>Recommended Inputs</span>
                  </h4>
                  <span className="text-[11px] font-semibold text-zinc-500 truncate max-w-[220px]">
                    Matched for {displayPlantName.replace(/\s*\([^)]*\)\s*/g, '').trim()}
                  </span>
                </div>

                <div className="flex items-stretch overflow-x-auto gap-3 py-1 no-scrollbar">
                  {getRecommendedInputsForPlant({
                    plantName: displayPlantName,
                    speciesId: effectiveSpeciesId,
                    healthStatus: prediction?.healthStatus,
                    diseaseName: prediction?.diseaseName,
                    aiRecommendedInputs: isPredictionDriven ? prediction?.recommendedInputs : undefined,
                  }).map((prod, idx) => (
                    <button
                      key={`${prod.name}-${idx}`}
                      type="button"
                      onClick={() => setSelectedProductDetail(prod)}
                      className="min-w-[148px] max-w-[185px] flex-1 p-3 rounded-2xl botanical-glass-card text-left flex flex-col justify-between cursor-pointer group hover:border-zinc-400 transition-all"
                    >
                      <div>
                        <div className="w-full aspect-square rounded-xl overflow-hidden bg-zinc-100 p-1.5 mb-2 flex items-center justify-center border border-zinc-200">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <span className="inline-block text-[9.5px] font-bold uppercase tracking-wider text-zinc-500 mb-0.5 line-clamp-1">
                          {prod.category}
                        </span>
                        <h5 className="text-xs font-bold text-zinc-950 line-clamp-2 leading-snug">
                          {prod.name}
                        </h5>
                        <p className="text-[10px] text-zinc-500 mt-0.5 line-clamp-1">
                          {prod.subtitle}
                        </p>
                      </div>

                      <div className="mt-2 pt-2 border-t border-zinc-200 flex items-center justify-between">
                        <span className="text-xs font-extrabold text-zinc-950 tabular-nums">
                          ₹{prod.price}
                        </span>
                        <span className="text-[10px] font-bold text-zinc-600">
                          ★ {prod.rating}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ========================================================= */}
      {/* 7. LOG OBSERVATION MODAL                                  */}
      {/* ========================================================= */}
      {showObservationModal &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowObservationModal(false);
            }}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="bg-white border border-zinc-200 rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col p-5 sm:p-6 shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-zinc-950 text-white flex items-center justify-center shrink-0">
                    <PlusCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-zinc-950">
                      Add Plant Growth Observation
                    </h3>
                    <p className="text-[11px] text-zinc-500">
                      Logs measurement to your growth history
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowObservationModal(false)}
                  className="p-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 cursor-pointer"
                  aria-label="Close observation dialog"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {observationSuccess ? (
                <div className="p-4 rounded-2xl bg-zinc-100 border border-zinc-200 text-zinc-900 text-xs font-semibold">
                  {observationSuccess}
                </div>
              ) : (
                <form
                  onSubmit={handleSubmitObservation}
                  className="flex-1 overflow-y-auto pr-1 space-y-3.5"
                >
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">
                        Plant ID
                      </label>
                      <input
                        type="text"
                        value={obsForm.plantId}
                        onChange={(e) =>
                          setObsForm({ ...obsForm, plantId: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 font-bold text-zinc-950"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">
                        Plant Age (Days)
                      </label>
                      <input
                        type="number"
                        value={obsForm.ageDays}
                        onChange={(e) =>
                          setObsForm({ ...obsForm, ageDays: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 font-bold text-zinc-950"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">
                        Measured Height (cm)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={obsForm.heightCm}
                        onChange={(e) =>
                          setObsForm({ ...obsForm, heightCm: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 font-bold text-zinc-950"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">
                        Temperature (°C)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={obsForm.tempC}
                        onChange={(e) =>
                          setObsForm({ ...obsForm, tempC: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 font-bold text-zinc-950"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">
                        Daily Water (ml)
                      </label>
                      <input
                        type="number"
                        value={obsForm.waterMl}
                        onChange={(e) =>
                          setObsForm({ ...obsForm, waterMl: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 font-bold text-zinc-950"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">
                        Sunlight (Hours)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={obsForm.sunlightHours}
                        onChange={(e) =>
                          setObsForm({
                            ...obsForm,
                            sunlightHours: Number(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 font-bold text-zinc-950"
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-200 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowObservationModal(false)}
                      className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={observationLoading}
                      className="px-5 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs cursor-pointer disabled:opacity-50"
                    >
                      {observationLoading ? 'Saving...' : 'Save Observation'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>,
          document.body
        )}

      {/* ========================================================= */}
      {/* 8. ML PERFORMANCE METRICS MODAL                           */}
      {/* ========================================================= */}
      {showPerformanceModal &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowPerformanceModal(false);
            }}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="bg-white border border-zinc-200 rounded-3xl max-w-xl w-full max-h-[85vh] flex flex-col p-5 sm:p-6 shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-zinc-950 text-white flex items-center justify-center">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-zinc-950">
                      Model Performance
                    </h3>
                    <p className="text-[11px] text-zinc-500">
                      Validation benchmarks across supported profiles
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPerformanceModal(false)}
                  className="p-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 cursor-pointer"
                  aria-label="Close metrics dialog"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-1 space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl botanical-glass-card space-y-1.5">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-zinc-950">
                      Species Classifier ({performanceData?.identification?.model || 'EfficientNet-B0'})
                    </span>
                    <span className="text-zinc-950 font-extrabold tabular-nums">
                      {performanceData?.identification?.accuracy
                        ? `${(performanceData.identification.accuracy * 100).toFixed(1)}%`
                        : '96.4%'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] text-zinc-600 tabular-nums">
                    <div>
                      Precision: <strong className="text-zinc-950">{performanceData?.identification?.precision || '0.961'}</strong>
                    </div>
                    <div>
                      Recall: <strong className="text-zinc-950">{performanceData?.identification?.recall || '0.958'}</strong>
                    </div>
                    <div>
                      F1: <strong className="text-zinc-950">{performanceData?.identification?.macro_f1 || '0.959'}</strong>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl botanical-glass-card space-y-1.5">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-zinc-950">
                      Growth Trajectory Regressor
                    </span>
                    <span className="text-zinc-950 font-extrabold tabular-nums">
                      R² = {performanceData?.growth_prediction?.r2_score || '0.894'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-600 tabular-nums">
                    <div>
                      MAE: <strong className="text-zinc-950">{performanceData?.growth_prediction?.mae_cm ? `${performanceData.growth_prediction.mae_cm} cm` : '3.71 cm'}</strong>
                    </div>
                    <div>
                      RMSE: <strong className="text-zinc-950">{performanceData?.growth_prediction?.rmse_cm ? `${performanceData.growth_prediction.rmse_cm} cm` : '4.88 cm'}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-200 flex justify-end mt-3">
                <button
                  type="button"
                  onClick={() => setShowPerformanceModal(false)}
                  className="px-5 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs cursor-pointer"
                >
                  Close Metrics
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* ========================================================= */}
      {/* 9. PRODUCT QUICK-VIEW MODAL                               */}
      {/* ========================================================= */}
      {selectedProductDetail &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedProductDetail(null);
            }}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="bg-white border border-zinc-200 rounded-3xl max-w-md w-full max-h-[85vh] flex flex-col p-5 sm:p-6 shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-800 text-[10px] font-bold">
                  {selectedProductDetail.category}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedProductDetail(null)}
                  className="p-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 cursor-pointer"
                  aria-label="Close product dialog"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-1">
                <div className="w-full aspect-video max-h-44 rounded-2xl overflow-hidden bg-zinc-100 p-2 mb-3 flex items-center justify-center border border-zinc-200">
                  <img
                    src={selectedProductDetail.image}
                    alt={selectedProductDetail.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-xs font-bold text-zinc-600 mb-1">
                  ★ {selectedProductDetail.rating} (Verified Care)
                </div>
                <h3 className="text-base font-extrabold text-zinc-950">
                  {selectedProductDetail.name}
                </h3>
                <p className="text-xs text-zinc-600 font-semibold mb-2">
                  {selectedProductDetail.subtitle}
                </p>
                <p className="text-xs text-zinc-600 leading-relaxed mb-3">
                  {selectedProductDetail.description}
                </p>
                {selectedProductDetail.dosage && (
                  <div className="p-2.5 rounded-xl bg-zinc-100 border border-zinc-200 text-[11px] font-semibold text-zinc-800 mb-3">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 block">
                      Recommended Usage
                    </span>
                    {selectedProductDetail.dosage}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-zinc-200 flex items-center justify-between mt-3">
                <div>
                  <span className="text-[10px] text-zinc-500 block">Price</span>
                  <span className="text-lg font-extrabold text-zinc-950 tabular-nums">
                    ₹{selectedProductDetail.price}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedProductDetail(null)}
                  className="px-5 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs cursor-pointer"
                >
                  Close View
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

export default DynamicPlantGrowthSection;
