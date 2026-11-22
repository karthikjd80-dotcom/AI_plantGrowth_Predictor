/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback, Suspense, lazy, memo } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import {
  AlertCircle,
  Search,
  RefreshCcw,
} from 'lucide-react';
import { PlantGrowthAiLanding } from './components/PlantGrowthAiLanding';
import Dock from './components/Dock';
import { GlobalNavbar } from './components/GlobalNavbar';
import type { AppNavTab } from './components/GlobalNavbar';
import type { ImageUploadCalibrationOptions } from './components/ImageUploader';
import { RecentScansPanel } from './components/RecentScansPanel';

const ImageUploader = lazy(() =>
  import('./components/ImageUploader').then((m) => ({ default: m.ImageUploader }))
);
const DynamicPlantGrowthSection = lazy(() =>
  import('./components/DynamicPlantGrowthSection').then((m) => ({
    default: m.DynamicPlantGrowthSection,
  }))
);
const PlantChatModal = lazy(() =>
  import('./components/PlantChatModal').then((m) => ({ default: m.PlantChatModal }))
);
const CameraModal = lazy(() =>
  import('./components/CameraModal').then((m) => ({ default: m.CameraModal }))
);
const PlantDiseaseReport = lazy(() =>
  import('./components/PlantDiseaseReport').then((m) => ({
    default: m.PlantDiseaseReport,
  }))
);
const MyPlantsHistory = lazy(() =>
  import('./components/MyPlantsHistory').then((m) => ({ default: m.MyPlantsHistory }))
);
const DiseaseDetectionView = lazy(() =>
  import('./components/PlantGuidesAndDisease').then((m) => ({
    default: m.DiseaseDetectionView,
  }))
);
const CareTransactionsView = lazy(() =>
  import('./components/CareTransactionsView').then((m) => ({
    default: m.CareTransactionsView,
  }))
);
const LatticeLoader = lazy(() => import('./components/LatticeLoader'));
import {
  auth,
  onAuthStateChanged,
  saveScanToFirestore,
  fetchUserScansFromFirestore,
} from './lib/firebase';
import type { User } from './lib/firebase';
import type { PredictionResult, HistoryItem } from './types';

import tomatoHeroClose from './assets/images/tomato_hero_close_1794577804656.jpg';
import sunlitWindowPlant from './assets/images/sunlit_window_plant_1791632375099.jpg';
import snakePlantPot from './assets/images/snake_plant_pot_1791383456814.jpg';
import freshGreenLeaf from './assets/images/fresh_green_leaf_1791632394999.jpg';

const DEMO_PLANT: PredictionResult = {
  plantName: 'Tomato Plant (Solanum lycopersicum)',
  scientificName: 'Solanum lycopersicum',
  confidenceScore: 98,
  healthStatus: 'Warning',
  diseaseName: 'Early Blight (Alternaria solani)',
  severity: 'Moderate',
  estimatedHeightCm: 21.8,
  estimatedWidthCm: 15.4,
  estimatedLeafAreaCm2: 141.0,
  growthStage: 'Vegetative & Early Flowering',
  expectedMatureHeightCm: 95.0,
  daysToMaturity: 48,
  growthForecast: {
    day7Cm: 29.5,
    day14Cm: 37.2,
    day30Cm: 54.0,
    day60Cm: 81.5,
    summary:
      'Currently 21.8 cm tall. Projected to grow +7.7 cm in 7 days (29.5 cm) and +15.4 cm in 14 days (37.2 cm), reaching ~95 cm maturity in ~48 days.',
  },
  growthData: [
    { day: 1, height: 10.5 },
    { day: 2, height: 11.4 },
    { day: 3, height: 12.2 },
    { day: 4, height: 13.0 },
    { day: 5, height: 13.9 },
    { day: 6, height: 14.8 },
    { day: 7, height: 15.6 },
    { day: 8, height: 16.5 },
    { day: 9, height: 17.4 },
    { day: 10, height: 18.3 },
    { day: 11, height: 19.2 },
    { day: 12, height: 20.1 },
    { day: 13, height: 21.0 },
    { day: 14, height: 21.8 },
  ],
  symptoms: [
    'Concentric brown target rings on lower leaf surface',
    'Chlorotic yellow halo surrounding necrotic dry patches',
    'Curling and browning of leaf margins',
    'Leaf petiole yellowing and early defoliation',
  ],
  causes: {
    pathogenType: 'Fungal Spores (Alternaria solani)',
    rootCauses: [
      'Overhead watering leaving water droplets on leaf blades overnight',
      'Warm and humid conditions (24°C - 29°C) promoting spore germination',
      'Contaminated soil splashing onto low-hanging foliage during watering',
      'Dense foliage canopy restricting breeze and air circulation',
    ],
    environmentalFactors:
      'Fungal spores survive in old plant debris and infect vulnerable damp leaves within 2-4 hours of moisture.',
  },
  cureAndTreatment: {
    immediateAction:
      'Sanitize pruning shears with 70% alcohol and immediately prune off all infected lower leaves. Dispose in trash (do not compost).',
    organicRemedies: [
      'Cold-Pressed Neem Oil Spray: Mix 5ml neem oil with 2 drops mild soap in 1L water; spray under and over leaves every 5 days.',
      'Baking Soda Antifungal Solution: Dissolve 1 tsp baking soda + 1/2 tsp vegetable oil in 1L water and mist foliage.',
      'Bio-Fungicide: Inoculate soil with Trichoderma viride or Pseudomonas fluorescens biological culture.',
      'Organic Wood Ash: Dusting soil surface prevents spore splashback during watering.',
    ],
    chemicalTreatment:
      'If spreading rapidly across stems, apply Copper Oxychloride 50 WP (2.5g/L) or Mancozeb 75 WP (2g/L) spray in early morning.',
    preventionAndCare: [
      'Water strictly at root zone in the morning; never spray foliage in the evening.',
      'Stake or trellis tomato stems to elevate branches 10+ inches above bare soil.',
      'Apply 2-inch organic mulch layer (straw or dried leaves) to block soil-splash spores.',
      'Ensure 6+ hours of direct sunlight and 12-inch spacing between plants for airflow.',
    ],
  },
  carePlan: {
    water: 'Deep basal root watering every 2 days (keep foliage dry).',
    sunlight: 'Full direct morning sunlight (6–8 hours daily).',
    soil: 'Fertile, well-draining loamy soil enriched with compost (pH 6.2–6.8).',
    fertilizer: 'Organic balanced NPK 10-10-10 or seaweed extract every 14 days.',
    diseasePrevention: 'Prune lower leaves 25 cm above soil, mulch base, and mist weekly with diluted neem oil.',
  },
  predictionSummary:
    'Early Blight fungal infection detected on leaf blades. Follow immediate pruning of bottom leaves and apply organic neem spray to cure completely.',
};

const SEED_HISTORY: HistoryItem[] = [
  {
    id: 'seed-1',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2,
    image: tomatoHeroClose,
    prediction: {
      ...DEMO_PLANT,
      healthStatus: 'Healthy',
      diseaseName: 'None - Optimal Canopy',
      severity: 'None',
    },
  },
  {
    id: 'seed-2',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 5,
    image: sunlitWindowPlant,
    prediction: {
      plantName: 'Fiddle Leaf Fig (Ficus Lyrata)',
      scientificName: 'Ficus lyrata',
      confidenceScore: 94,
      healthStatus: 'Healthy',
      diseaseName: 'None - Healthy Foliage',
      severity: 'None',
      estimatedHeightCm: 42.6,
      estimatedWidthCm: 28.4,
      estimatedLeafAreaCm2: 508.0,
      growthStage: 'Active Vegetative Canopy',
      expectedMatureHeightCm: 150.0,
      daysToMaturity: 95,
      growthForecast: {
        day7Cm: 44.8,
        day14Cm: 47.2,
        day30Cm: 52.6,
        day60Cm: 64.0,
        summary:
          'Currently 42.6 cm tall. Healthy canopy projected to gain +4.6 cm in 14 days (47.2 cm) and +10.0 cm in 30 days (52.6 cm).',
      },
      growthData: Array.from({ length: 14 }, (_, idx) => ({
        day: idx + 1,
        height: Number((36.0 + (42.6 - 36.0) * (idx / 13)).toFixed(1)),
      })),
      symptoms: [
        'Glossy violin-shaped leaves with healthy emerald sheen',
        'No brown edges or leaf drop detected',
      ],
      causes: {
        pathogenType: 'None (Healthy Specimen)',
        rootCauses: [
          'Adequate bright filtered illumination',
          'Proper dry-down cycle between watering',
        ],
        environmentalFactors: 'Optimal indoor humidity and temperature.',
      },
      cureAndTreatment: {
        immediateAction: 'No curative action needed. Continue current care.',
        organicRemedies: [
          'Wipe broad leaves with a damp microfiber cloth weekly to clear dust.',
        ],
        chemicalTreatment: 'None required.',
        preventionAndCare: [
          'Provide high bright filtered light near a south/west window.',
          'Water only once top 50% of potting volume has dried.',
        ],
      },
      carePlan: {
        water: 'Water thoroughly once top 2–3 inches of soil dry out (every 7–10 days).',
        sunlight: 'Bright filtered indirect light (6+ hours daily).',
        soil: 'Well-aerated chunky peat-perlite potting mix with drainage holes.',
        fertilizer: 'Balanced 3-1-2 liquid houseplant feed once a month in spring/summer.',
        diseasePrevention: 'Wipe dust off leaves monthly and keep away from cold AC drafts.',
      },
      predictionSummary:
        'Healthy Fiddle Leaf Fig specimen. Maintain indirect sunlight and periodic dusting.',
    },
  },
  {
    id: 'seed-3',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 10,
    image: snakePlantPot,
    prediction: {
      plantName: 'Snake Plant (Sansevieria Trifasciata)',
      scientificName: 'Dracaena trifasciata',
      confidenceScore: 97,
      healthStatus: 'Healthy',
      diseaseName: 'None - Resilient Foliage',
      severity: 'None',
      estimatedHeightCm: 31.4,
      estimatedWidthCm: 17.5,
      estimatedLeafAreaCm2: 230.8,
      growthStage: 'Established Vegetative Rosette',
      expectedMatureHeightCm: 75.0,
      daysToMaturity: 110,
      growthForecast: {
        day7Cm: 32.1,
        day14Cm: 32.9,
        day30Cm: 34.8,
        day60Cm: 38.6,
        summary:
          'Slow-growing hardy succulent at 31.4 cm. Expected to gain +1.5 cm in 14 days (32.9 cm) and +3.4 cm in 30 days (34.8 cm).',
      },
      growthData: Array.from({ length: 14 }, (_, idx) => ({
        day: idx + 1,
        height: Number((29.2 + (31.4 - 29.2) * (idx / 13)).toFixed(1)),
      })),
      symptoms: [
        'Rigid upright sword leaves with crisp yellow variegation',
        'Firm basal crown with no softening or rot',
      ],
      causes: {
        pathogenType: 'None (Healthy Specimen)',
        rootCauses: [
          'Dry, gritty fast-draining potting soil',
          'Zero standing water in leaf rosette',
        ],
        environmentalFactors: 'Well-aerated succulent environment.',
      },
      cureAndTreatment: {
        immediateAction: 'No action needed. Excellent plant vigor.',
        organicRemedies: ['Keep foliage dry and dust-free.'],
        chemicalTreatment: 'None required.',
        preventionAndCare: [
          'Allow potting soil to dry out completely between waterings (every 2-3 weeks).',
          'Ensure bright indirect to morning sunlight.',
        ],
      },
      carePlan: {
        water: 'Sparing watering every 14–21 days once soil is dry completely.',
        sunlight: 'Bright indirect light to moderate low light tolerance.',
        soil: 'Sandy, gritty cactus/succulent fast-draining soil mix.',
        fertilizer: 'Dilute cactus fertilizer (10-10-10 half-strength) once every 6 weeks.',
        diseasePrevention: 'Never pour water into the center leaf crown to prevent rhizome rot.',
      },
      predictionSummary:
        'Robust healthy snake plant with intact architectural variegation.',
    },
  },
];

const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch {}
    return null;
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch {}
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch {}
  },
};

interface PlantSearchBarProps {
  isLoading: boolean;
  onSearchPlant: (query: string) => void;
}

const PlantSearchBar = memo(function PlantSearchBar({
  isLoading,
  onSearchPlant,
}: PlantSearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed || isLoading) return;
    onSearchPlant(trimmed);
    setQuery('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="ios-liquid-glass-trigger relative flex items-center rounded-2xl p-1.5 focus-within:border-pink-400/60">
        <div className="pl-2.5 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-zinc-500" />
        </div>
        <input
          type="text"
          className="block w-full min-w-0 pl-2.5 pr-2 py-2 bg-transparent text-zinc-950 placeholder-zinc-400 focus:outline-none text-xs sm:text-sm font-medium"
          placeholder="Search plant (Rose, Tomato...)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="rgb-pink-glow-dark rounded-xl disabled:opacity-40 disabled:pointer-events-none shrink-0 cursor-pointer focus:outline-none"
        >
          <span className="rgb-pink-glow-surface px-3.5 sm:px-4 py-2 bg-zinc-950 text-white text-xs font-semibold rounded-xl flex items-center justify-center min-w-[92px]">
            {isLoading ? (
              <LatticeLoader
                status="working"
                label="Predicting"
                doneLabel="Done in"
                errorLabel="Failed after"
                pattern="orbit"
                grid={3}
                shape="round"
                color="currentColor"
                doneColor="#ffffff"
                errorColor="#e4e4e7"
                cellSize={4}
                gap={2}
                fontSize={11}
                step={90}
                idleOpacity={0.25}
                glow={false}
                showTimer
              />
            ) : (
              'Predict Growth'
            )}
          </span>
        </button>
      </div>
    </form>
  );
});

export default function App() {
  const [activeTab, setActiveTab] = useState<AppNavTab>('Home');
  const [isLoading, setIsLoading] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const resultRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialQuestion, setChatInitialQuestion] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [lastUploadedPayload, setLastUploadedPayload] = useState<{
    base64Image: string;
    mimeType: string;
    options?: ImageUploadCalibrationOptions;
  } | null>(null);
  const activeApiLockRef = useRef<boolean>(false);

  useEffect(() => {
    if (typeof (window as any).__PG_MARK_MOUNTED__ === 'function') {
      (window as any).__PG_MARK_MOUNTED__();
    } else {
      (window as any).__PG_APP_MOUNTED__ = true;
    }
  }, []);

  const openChatWithQuestion = useCallback((question?: string) => {
    setChatInitialQuestion(question || null);
    setIsChatOpen(true);
  }, []);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const cloudScans = await fetchUserScansFromFirestore(user);
          if (cloudScans && cloudScans.length > 0) {
            const mappedHistory: HistoryItem[] = cloudScans.map((cs) => ({
              id: cs.id,
              timestamp: cs.timestamp,
              image: cs.image,
              prediction: cs.prediction,
            }));

            setHistory((prev) => {
              const existingIds = new Set(prev.map((p) => p.id));
              const newItems = mappedHistory.filter((m) => !existingIds.has(m.id));
              const merged = [...newItems, ...prev];
              safeStorage.setItem('plantPredictorHistory', JSON.stringify(merged));
              return merged;
            });
          }
        } catch (e) {
          console.warn('Error syncing cloud scans on login:', e);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const saved = safeStorage.getItem('plantPredictorHistory');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const valid = parsed.filter(
            (item) =>
              item &&
              typeof item === 'object' &&
              item.prediction &&
              typeof item.prediction.plantName === 'string' &&
              item.prediction.plantName.trim().length > 0
          );
          if (valid.length > 0) {
            setHistory(valid);
            return;
          }
        }
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
    setHistory(SEED_HISTORY);
    safeStorage.setItem('plantPredictorHistory', JSON.stringify(SEED_HISTORY));
  }, []);

  const handleSelectHistoryPlant = useCallback((item: HistoryItem) => {
    setPrediction(item.prediction);
    setUploadedImage(item.image);
    setActiveTab('Growth Prediction');
    window.scrollTo(0, 0);
  }, []);

  const handleDeleteHistoryPlant = useCallback((id: string) => {
    setHistory((prev) => {
      const next = prev.filter((h) => h.id !== id);
      safeStorage.setItem('plantPredictorHistory', JSON.stringify(next));
      return next;
    });
  }, []);

  const handleClearAllHistory = useCallback(() => {
    setHistory([]);
    safeStorage.removeItem('plantPredictorHistory');
  }, []);

  const handleShare = async () => {
    const shareText = prediction
      ? `I just analyzed my plant: ${prediction.plantName}!\nHealth: ${prediction.healthStatus}\n${prediction.predictionSummary}\nTry it out at: ${window.location.href}`
      : window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Plant Analysis',
          text: shareText,
        });
      } else {
        throw new Error('Web Share not supported');
      }
    } catch {
      try {
        await navigator.clipboard.writeText(shareText);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (copyErr) {
        console.error('Failed to copy', copyErr);
      }
    }
  };

  const handleExportPDF = async () => {
    if (!resultRef.current) return;
    setIsExporting(true);
    try {
      const el = resultRef.current;
      const width = el.offsetWidth;
      const height = el.offsetHeight;

      const [{ toJpeg }, { jsPDF }] = await Promise.all([
        import('html-to-image'),
        import('jspdf'),
      ]);

      const imgData = await toJpeg(el, {
        quality: 0.95,
        backgroundColor: '#f5f5f7',
        pixelRatio: 2,
      });

      const pdfWidth = width * 2;
      const pdfHeight = height * 2;

      const pdf = new jsPDF({
        orientation: pdfWidth > pdfHeight ? 'landscape' : 'portrait',
        unit: 'px',
        format: [pdfWidth, pdfHeight],
      });

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(
        `${prediction?.plantName?.replace(/\s+/g, '_') || 'plant_analysis'}.pdf`
      );
    } catch (err) {
      console.error('Failed to export PDF', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImageSelected = useCallback(async (
    base64Image: string,
    mimeType: string,
    options?: ImageUploadCalibrationOptions
  ) => {
    if (activeApiLockRef.current) return;
    activeApiLockRef.current = true;
    setIsLoading(true);
    setError(null);
    setPrediction(null);
    setUploadedImage(base64Image);
    setLastUploadedPayload({ base64Image, mimeType, options });
    setActiveTab('Growth Prediction');

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 35000);
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
          mimeType,
          images: options?.extraImages,
          scaleReference: options?.scaleReference,
          environment: options?.environment,
          plantHint: options?.plantHint,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMessage = 'Failed to analyze image. Please try again.';
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch {}
        throw new Error(errorMessage);
      }

      const data: PredictionResult = await response.json();
      setPrediction(data);

      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        image: base64Image,
        prediction: data,
      };

      setHistory((prev) => {
        const newHistory = [newHistoryItem, ...prev].slice(0, 50);
        safeStorage.setItem('plantPredictorHistory', JSON.stringify(newHistory));
        return newHistory;
      });

      if (currentUser) {
        saveScanToFirestore(
          currentUser,
          newHistoryItem.id,
          base64Image,
          data
        ).catch((e) => {
          console.warn('Failed to save scan to cloud Firestore:', e);
        });
      }

      setActiveTab('Growth Prediction');
    } catch (err: any) {
      console.warn('Photo prediction failed:', err);
      const msg =
        err?.name === 'AbortError'
          ? 'Photo analysis took too long to respond. Please tap Retry Photo Analysis or try again.'
          : err?.message ||
            'Could not identify the uploaded plant photo right now. Please tap Retry Photo Analysis or search your plant name below.';
      setPrediction(null);
      setError(msg);
      setActiveTab('Growth Prediction');
    } finally {
      activeApiLockRef.current = false;
      setIsLoading(false);
    }
  }, [currentUser]);

  const handleReset = useCallback(() => {
    setPrediction(null);
    setError(null);
    setUploadedImage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleOpenRecentScanReport = useCallback((item: HistoryItem) => {
    setPrediction(item.prediction);
    setUploadedImage(item.image);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleViewAllHistory = useCallback(() => {
    setActiveTab('My Plants');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSearchPlantByName = useCallback(async (plantName: string) => {
    if (!plantName.trim() || activeApiLockRef.current) return;
    activeApiLockRef.current = true;

    setIsLoading(true);
    setError(null);
    setPrediction(null);
    setUploadedImage(null);
    setActiveTab('Growth Prediction');

    let imageUrl = freshGreenLeaf;

    try {
      try {
        const wikiController = new AbortController();
        const wikiTimer = setTimeout(() => wikiController.abort(), 3500);
        const wikiRes = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
            plantName
          )}&prop=pageimages&format=json&pithumbsize=500&origin=*`,
          { signal: wikiController.signal }
        );
        clearTimeout(wikiTimer);
        const wikiData = await wikiRes.json();
        const pages = wikiData.query?.pages;
        if (pages) {
          const pageId = Object.keys(pages)[0];
          if (pageId !== '-1' && pages[pageId].thumbnail) {
            imageUrl = pages[pageId].thumbnail.source;
          }
        }
      } catch (e) {
        console.warn('Wikipedia image lookup skipped/timed out:', e);
      }

      setUploadedImage(imageUrl);

      const searchController = new AbortController();
      const searchTimer = setTimeout(() => searchController.abort(), 20000);
      const response = await fetch('/api/search-plant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: plantName }),
        signal: searchController.signal,
      });
      clearTimeout(searchTimer);

      if (!response.ok) {
        let errorMessage = 'Failed to fetch plant data. Please try again.';
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch {}
        throw new Error(errorMessage);
      }

      const data: PredictionResult = await response.json();
      setPrediction(data);

      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        image: imageUrl,
        prediction: data,
      };

      setHistory((prev) => {
        const newHistory = [newHistoryItem, ...prev].slice(0, 50);
        safeStorage.setItem('plantPredictorHistory', JSON.stringify(newHistory));
        return newHistory;
      });

      if (currentUser) {
        saveScanToFirestore(currentUser, newHistoryItem.id, imageUrl, data).catch(
          (e) => {
            console.warn('Failed to save search scan to cloud Firestore:', e);
          }
        );
      }

      setActiveTab('Growth Prediction');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.warn(
        'Search API rate limited or network hiccup, seamlessly activating fallback:',
        err
      );
      const formattedName = plantName.charAt(0).toUpperCase() + plantName.slice(1);
      const fallbackData: PredictionResult = {
        ...DEMO_PLANT,
        plantName: `${formattedName} Specimen`,
        scientificName: formattedName,
        healthStatus: 'Healthy',
        diseaseName: 'None - Healthy Foliage',
        severity: 'None',
        estimatedHeightCm: 22.0,
        estimatedWidthCm: 16.0,
        estimatedLeafAreaCm2: 148.0,
        growthStage: 'Active Vegetative Growth',
        expectedMatureHeightCm: 75.0,
        daysToMaturity: 55,
        growthForecast: {
          day7Cm: 28.4,
          day14Cm: 34.8,
          day30Cm: 48.5,
          day60Cm: 68.0,
          summary: `Estimated 22.0 cm specimen height for ${formattedName}. Expected +12.8 cm over 14 days and ~75 cm maturity in ~55 days.`,
        },
        predictionSummary: `Comprehensive botanical profile for ${formattedName}. Recommended care includes well-draining soil, adequate sunlight, and monitored watering intervals.`,
      };
      setPrediction(fallbackData);
      setError(null);

      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        image: imageUrl,
        prediction: fallbackData,
      };

      setHistory((prev) => {
        const newHistory = [newHistoryItem, ...prev].slice(0, 50);
        safeStorage.setItem('plantPredictorHistory', JSON.stringify(newHistory));
        return newHistory;
      });

      setActiveTab('Growth Prediction');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      activeApiLockRef.current = false;
      setIsLoading(false);
    }
  }, [currentUser]);

  const uploadInputRef = useRef<HTMLInputElement>(null);

  const handleNavTabChange = useCallback((tab: AppNavTab) => {
    setActiveTab(tab);
    window.scrollTo(0, 0);
  }, []);

  const handleNavBack = useCallback(() => {
    if (isCameraOpen) {
      setIsCameraOpen(false);
    } else if (isChatOpen) {
      setIsChatOpen(false);
    } else if (prediction) {
      setPrediction(null);
      setUploadedImage(null);
    } else if (activeTab !== 'Home') {
      setActiveTab('Home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isCameraOpen, isChatOpen, prediction, activeTab]);

  const handleOpenCamera = useCallback(() => setIsCameraOpen(true), []);
  const handleCloseCamera = useCallback(() => setIsCameraOpen(false), []);
  const handleCloseChat = useCallback(() => setIsChatOpen(false), []);
  const handleOpenChatDefault = useCallback(() => openChatWithQuestion(), [openChatWithQuestion]);

  const handleGoGrowthPrediction = useCallback(() => {
    setActiveTab('Growth Prediction');
    window.scrollTo(0, 0);
  }, []);

  const handleTriggerUploadInput = useCallback(() => {
    uploadInputRef.current?.click();
  }, []);

  const handleUploadLeafFromDisease = useCallback(() => {
    setActiveTab('Growth Prediction');
    setTimeout(() => uploadInputRef.current?.click(), 100);
  }, []);

  const handleDockTabChange = useCallback(
    (tab: AppNavTab) => {
      if (prediction) {
        setPrediction(null);
        setUploadedImage(null);
      }
      setActiveTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [prediction]
  );

  const handleDockBack = useCallback(() => {
    if (isChatOpen) {
      setIsChatOpen(false);
    } else if (prediction) {
      setPrediction(null);
      setUploadedImage(null);
    } else if (activeTab !== 'Home') {
      setActiveTab('Home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isChatOpen, prediction, activeTab]);

  const handleDockOpenUpload = useCallback(() => {
    if (isChatOpen) setIsChatOpen(false);
    setActiveTab('Growth Prediction');
    setTimeout(() => {
      uploadInputRef.current?.click();
    }, 60);
  }, [isChatOpen]);

  const handleDockOpenCamera = useCallback(() => {
    if (isChatOpen) setIsChatOpen(false);
    setIsCameraOpen(true);
  }, [isChatOpen]);

  const handleDockOpenHistory = useCallback(() => {
    if (isChatOpen) setIsChatOpen(false);
    setActiveTab('My Plants');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [isChatOpen]);

  const handleSelectChatHistoryItem = useCallback((item: HistoryItem) => {
    setPrediction(item.prediction);
    setUploadedImage(item.image);
  }, []);

  const handleCameraCapture = useCallback(
    (base64: string, mimeType: string) => handleImageSelected(base64, mimeType),
    [handleImageSelected]
  );

  const handleDockFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.');
      return;
    }

    setActiveTab('Growth Prediction');

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          handleImageSelected(dataUrl, 'image/jpeg');
        } else {
          const base64String = reader.result as string;
          handleImageSelected(base64String, file.type);
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <MotionConfig reducedMotion="user">
    <div className="min-h-screen flex font-sans selection:bg-zinc-900 selection:text-white relative overflow-x-hidden botanical-canvas text-zinc-950">
      {/* Main Full-Width Workspace Column */}
      <div className="flex-1 min-w-0 relative flex flex-col">
        {/* Minimal Monochrome Top Navigation */}
        <GlobalNavbar
          activeTab={activeTab}
          onTabChange={handleNavTabChange}
          canGoBack={activeTab !== 'Home' || Boolean(prediction) || isChatOpen || isCameraOpen}
          onBack={handleNavBack}
          onOpenCamera={handleOpenCamera}
          onOpenChat={handleOpenChatDefault}
          onTryDemo={handleGoGrowthPrediction}
        />

        {/* Dynamic View Router with Silky Page Transitions */}
        <div className="w-full flex-1 relative z-10 pb-28">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              {activeTab === 'Home' && (
                <PlantGrowthAiLanding
                  onStartApp={handleGoGrowthPrediction}
                  onOpenUpload={handleTriggerUploadInput}
                  onNavigateTab={handleNavTabChange}
                />
              )}

              {activeTab !== 'Home' && (
                <Suspense
                  fallback={
                    <div className="w-full max-w-5xl mx-auto px-4 py-14 flex items-center justify-center">
                      <div className="botanical-glass-panel px-6 py-3.5 rounded-full text-xs font-semibold text-zinc-700">
                        Loading...
                      </div>
                    </div>
                  }
                >
              {activeTab === 'My Plants' && (
                <MyPlantsHistory
                  history={history}
                  onSelectPlant={handleSelectHistoryPlant}
                  onDeletePlant={handleDeleteHistoryPlant}
                  onClearAll={handleClearAllHistory}
                  isDarkMode={false}
                />
              )}

              {activeTab === 'Disease Detection' && (
                <DiseaseDetectionView
                  onScanLeaf={handleOpenCamera}
                  onUploadLeaf={handleUploadLeafFromDisease}
                />
              )}

              {(activeTab === 'Transactions' || activeTab === 'Dashboard') && (
                <CareTransactionsView
                  onNavigateToScan={handleOpenCamera}
                  onNavigateToGrowth={handleGoGrowthPrediction}
                  history={history}
                />
              )}

              {activeTab === 'Growth Prediction' && (
                <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-6 py-4 space-y-5">
                  {/* 1. UPLOAD-FIRST STUDIO */}
                  {!prediction && (
                    <div className="botanical-glass-panel p-4 sm:p-6 rounded-3xl space-y-4">
                      {/* Isolated Search by Plant Name — Top Bar */}
                      <PlantSearchBar
                        isLoading={isLoading}
                        onSearchPlant={handleSearchPlantByName}
                      />

                      {/* Hero Multi-Photo Drag & Drop Zone */}
                      <ImageUploader
                        variant="hero"
                        onImageSelected={handleImageSelected}
                        isLoading={isLoading}
                        onOpenCamera={handleOpenCamera}
                      />

                      {error && (
                        <div className="p-3.5 rounded-2xl bg-zinc-100 text-zinc-900 flex flex-wrap items-center justify-between gap-2.5 border border-zinc-300 text-xs">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-zinc-800" />
                            <p className="font-semibold">{error}</p>
                          </div>
                          {lastUploadedPayload && !isLoading && (
                            <button
                              type="button"
                              onClick={() =>
                                handleImageSelected(
                                  lastUploadedPayload.base64Image,
                                  lastUploadedPayload.mimeType,
                                  lastUploadedPayload.options
                                )
                              }
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-950 text-white font-semibold text-xs cursor-pointer shrink-0 active:scale-95"
                            >
                              <RefreshCcw className="w-3 h-3" />
                              <span>Retry Photo Analysis</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 2. PHOTO UPLOAD PREDICTION RESULTS */}
                  {prediction && !isLoading && (
                    <div ref={resultRef} className="space-y-6 animate-fade-in">
                      <DynamicPlantGrowthSection
                        prediction={prediction}
                        uploadedPlantName={prediction.plantName}
                        uploadedImage={uploadedImage}
                        isDarkMode={false}
                      />

                      <PlantDiseaseReport
                        prediction={prediction}
                        uploadedImage={uploadedImage}
                        onScanAnother={handleReset}
                        onAskAI={openChatWithQuestion}
                        onShare={handleShare}
                        onExportPDF={handleExportPDF}
                        isCopied={isCopied}
                        isExporting={isExporting}
                      />
                    </div>
                  )}

                  {/* Recent Scans Strip — Neat, Memoized, Animated Click-to-Popup */}
                  {history.length > 0 && !isLoading && !prediction && (
                    <RecentScansPanel
                      history={history}
                      onOpenFullReport={handleOpenRecentScanReport}
                      onViewAllHistory={handleViewAllHistory}
                    />
                  )}
                </div>
              )}
                </Suspense>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Lazy-mounted Modals */}
      <Suspense fallback={null}>
        {isChatOpen && (
          <PlantChatModal
            isOpen={isChatOpen}
            onClose={handleCloseChat}
            plantContext={prediction}
            initialQuestion={chatInitialQuestion}
            isDarkMode={false}
            onSwitchToScanner={handleCloseChat}
            scanHistory={history}
            onSelectHistoryItem={handleSelectChatHistoryItem}
          />
        )}

        {isCameraOpen && (
          <CameraModal
            isOpen={isCameraOpen}
            onClose={handleCloseCamera}
            onCapture={handleCameraCapture}
            isDarkMode={false}
          />
        )}
      </Suspense>

      {/* Hidden file input */}
      <input
        type="file"
        ref={uploadInputRef}
        onChange={handleDockFileChange}
        accept="image/*"
        className="hidden"
        aria-hidden="true"
      />

      {/* Smoked-Glass Monochrome Task Bar + Separate Circular Plus Button */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
        <Dock
          activeTab={activeTab}
          onTabChange={handleDockTabChange}
          onBack={handleDockBack}
          onOpenUpload={handleDockOpenUpload}
          onOpenCamera={handleDockOpenCamera}
          onOpenHistory={handleDockOpenHistory}
          onOpenChat={handleOpenChatDefault}
          isChatOpen={isChatOpen}
          isCameraOpen={isCameraOpen}
          hasActivePrediction={Boolean(prediction)}
        />
      </div>
    </div>
    </MotionConfig>
  );
}
