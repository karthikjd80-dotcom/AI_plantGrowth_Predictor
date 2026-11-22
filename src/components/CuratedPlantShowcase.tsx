import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Leaf, 
  Sun, 
  Droplets, 
  Wind, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  Pause, 
  ArrowRight, 
  Heart, 
  Check, 
  MapPin, 
  Home, 
  Sprout, 
  HelpCircle,
  Eye,
  Camera,
  Layers,
  LayoutGrid
} from 'lucide-react';
import DepthCarousel from './DepthCarousel';
import RubberSegment, { RubberSegmentItem } from './RubberSegment';

// Plant Images
import snakePlantImg from '../assets/images/snake_plant_pot_1791383456814.jpg';
import crassulaJadeImg from '../assets/images/crassula_jade_pot_1791383475340.jpg';
import spiderPlantImg from '../assets/images/spider_plant_pot_1791383493258.jpg';
import blueCactusImg from '../assets/images/blue_cactus_pot_1791383509294.jpg';
import peaceLilyImg from '../assets/images/peace_lily_pot_1791383576196.jpg';
import zebraHaworthiaImg from '../assets/images/zebra_succulent_1791059345245.jpg';
import jasmineImg from '../assets/images/jasmine_pot_1791383528522.jpg';
import roseImg from '../assets/images/rose_plant_1791175671018.jpg';
import tomatoImg from '../assets/images/tomato_plant_1791175685194.jpg';
import chiliImg from '../assets/images/chili_plant_1791175713631.jpg';
import basilImg from '../assets/images/basil_plant_1791175798741.jpg';
import mintImg from '../assets/images/mint_plant_1791175763146.jpg';
import aloeImg from '../assets/images/aloe_succulent_1791059360382.jpg';

export type PlantPlacementCategory = 'indoor' | 'outdoor' | 'balcony';

export interface ShowcasePlantItem {
  id: string;
  category: PlantPlacementCategory;
  botanicalName: string;
  commonName: string;
  tagline: string;
  description: string;
  image: string;
  sunlight: string;
  watering: string;
  idealLocation: string;
  difficulty: 'Beginner' | 'Easy' | 'Moderate';
  airPurifyingScore?: number;
  petSafe: boolean;
  benefits: string[];
  temperature: string;
  tag: string;
}

export const SHOWCASE_PLANTS: ShowcasePlantItem[] = [
  // ===================== INDOOR PLANTS =====================
  {
    id: 'snake-plant',
    category: 'indoor',
    botanicalName: 'Dracaena Trifasciata',
    commonName: 'Snake Plant (Sansevieria)',
    tagline: 'One of the most effective houseplants in air purification.',
    description: 'An architectural champion that releases oxygen at night and filters airborne formaldehyde, benzene, and trichloroethylene. Virtually indestructible in dim lighting.',
    image: snakePlantImg,
    sunlight: 'Low to Bright Indirect',
    watering: 'Every 2-3 weeks (allow soil to dry)',
    idealLocation: 'Living Room Corner, Bedroom, Work Desk',
    difficulty: 'Beginner',
    airPurifyingScore: 98,
    petSafe: false,
    benefits: ['NASA Top Air Filter', 'Releases Nighttime Oxygen', 'Thrives on Neglect'],
    temperature: '18°C - 30°C',
    tag: 'Top Air Purifier'
  },
  {
    id: 'jade-plant',
    category: 'indoor',
    botanicalName: 'Crassula Ovata',
    commonName: 'Jade Plant (Money Tree)',
    tagline: 'Low-maintenance succulent with delicate fleshy leaves.',
    description: 'A beloved symbol of prosperity with glossy coin-shaped leaves. Stored moisture inside its succulent foliage allows it to endure dry indoor air with effortless grace.',
    image: crassulaJadeImg,
    sunlight: 'Bright Indirect to Morning Sun',
    watering: 'Every 10-14 days',
    idealLocation: 'Sunny Windowsill, Study Desk, Entryway Console',
    difficulty: 'Easy',
    airPurifyingScore: 82,
    petSafe: false,
    benefits: ['Symbolizes Prosperity', 'Minimal Care Needed', 'Compact Desktop Specimen'],
    temperature: '15°C - 28°C',
    tag: 'Prosperity & Focus'
  },
  {
    id: 'spider-plant',
    category: 'indoor',
    botanicalName: 'Chlorophytum Comosum',
    commonName: 'Spider Plant (Ribbon Fern)',
    tagline: 'Cascading arching foliage safe for curious dogs and cats.',
    description: 'Produces whimsical plantlets along trailing stems. Highly regarded by NASA for eliminating carbon monoxide and xylene while being 100% non-toxic to furry pets.',
    image: spiderPlantImg,
    sunlight: 'Medium to Bright Filtered',
    watering: 'Once per week',
    idealLocation: 'Living Room Pedestal, Bookshelf, Plant Hanger',
    difficulty: 'Beginner',
    airPurifyingScore: 95,
    petSafe: true,
    benefits: ['100% Pet-Friendly', 'Fast Propagation', 'Airborne Toxin Neutralizer'],
    temperature: '16°C - 26°C',
    tag: 'Pet Safe & Pure'
  },
  {
    id: 'blue-cactus',
    category: 'indoor',
    botanicalName: 'Pilosocereus Pachycladus',
    commonName: 'Blue Columnar Cactus',
    tagline: 'Striking azure columnar desert succulent with architectural grandeur.',
    description: 'A stunning sculptural cactus with powdery blue skin and golden spines. Stores water for months and adds dramatic desert elegance to bright indoor living areas.',
    image: blueCactusImg,
    sunlight: 'Direct Full Sun to Very Bright Indirect',
    watering: 'Once every 3-4 weeks',
    idealLocation: 'South-Facing Window, Minimalist Living Room, Sunlit Study',
    difficulty: 'Beginner',
    airPurifyingScore: 78,
    petSafe: true,
    benefits: ['Zero Daily Care', 'Unique Azure Coloration', 'Architectural Anchor'],
    temperature: '15°C - 35°C',
    tag: 'Desert Sculpture'
  },
  {
    id: 'peace-lily',
    category: 'indoor',
    botanicalName: 'Spathiphyllum Wallisii',
    commonName: 'Peace Lily',
    tagline: 'Lush dark emerald leaves crowned with elegant white blooms.',
    description: 'One of the best natural humidifiers for interior rooms, producing serene porcelain-white spathes while indicating thirsty soil by gently bowing its leaves.',
    image: peaceLilyImg,
    sunlight: 'Low to Medium Filtered Light',
    watering: 'Once per week (keep moist, not soggy)',
    idealLocation: 'Living Room Corner, Bedroom Credenza, Office Lounge',
    difficulty: 'Easy',
    airPurifyingScore: 96,
    petSafe: false,
    benefits: ['Blooms Indoors', 'Natural Room Humidifier', 'Clear Thirst Indicator'],
    temperature: '18°C - 28°C',
    tag: 'Flowering Filter'
  },
  {
    id: 'zebra-succulent',
    category: 'indoor',
    botanicalName: 'Haworthiopsis Fasciata',
    commonName: 'Zebra Haworthia Succulent',
    tagline: 'Miniature geometric succulent with crisp white horizontal bands.',
    description: 'Stays petite and compact for years with striking zebra stripes. Extremely forgiving of forgotten watering schedules and fits naturally on desktop workstations.',
    image: zebraHaworthiaImg,
    sunlight: 'Bright Filtered Indirect',
    watering: 'Every 2-3 weeks',
    idealLocation: 'Computer Desk, Bookshelf Nook, Bathroom Vanity',
    difficulty: 'Beginner',
    airPurifyingScore: 80,
    petSafe: true,
    benefits: ['Stays Under 6 Inches', '100% Non-Toxic', 'Geometric Beauty'],
    temperature: '18°C - 28°C',
    tag: 'Desktop Gem'
  },

  // ===================== OUTDOOR PLANTS =====================
  {
    id: 'jasmine',
    category: 'outdoor',
    botanicalName: 'Jasminum Sambac',
    commonName: 'Arabian Jasmine (Mogra)',
    tagline: 'Intoxicating evening fragrance with double-white star petals.',
    description: 'A prized tropical flowering climber celebrated for its heavenly fragrance. Thrives in warm sunny spots and blossoms continuously through warm months.',
    image: jasmineImg,
    sunlight: 'Full Sun (4-6 Hours Daily)',
    watering: 'Daily or alternate morning watering',
    idealLocation: 'Sunny Patio, Entrance Arch, Outdoor Terrace Planter',
    difficulty: 'Easy',
    petSafe: true,
    benefits: ['Heavenly Night Fragrance', 'Continuous Seasonal Blooms', 'Attracts Pollinators'],
    temperature: '20°C - 35°C',
    tag: 'Divine Fragrance'
  },
  {
    id: 'rose',
    category: 'outdoor',
    botanicalName: 'Rosa Indica',
    commonName: 'Garden Rose',
    tagline: 'Timeless floral royalty with deep crimson velvety petals.',
    description: 'Vibrant outdoor rose specimen calibrated for container gardens and sunny walkways. Pruned regularly, it produces dramatic multi-bloom flushes year-round.',
    image: roseImg,
    sunlight: '6+ Hours Direct Sunlight',
    watering: 'Deep soak 3-4 times per week',
    idealLocation: 'Sunny Terrace, Garden Walkway, Patio Container',
    difficulty: 'Moderate',
    petSafe: true,
    benefits: ['Continuous Flowering Flushes', 'Classic Aesthetic Anchor', 'Cut Flower Harvest'],
    temperature: '15°C - 32°C',
    tag: 'Floral Queen'
  },
  {
    id: 'tomato',
    category: 'outdoor',
    botanicalName: 'Solanum Lycopersicum',
    commonName: 'Potted Cherry Tomato',
    tagline: 'Prolific vine heavy with sweet sun-ripened ruby fruits.',
    description: 'The ultimate kitchen garden prize. Compact cherry tomato specimen optimized for large terrace pots, delivering sweet clusters of vitamin-rich homegrown tomatoes.',
    image: tomatoImg,
    sunlight: '6-8 Hours Full Direct Sun',
    watering: 'Daily deep morning soak',
    idealLocation: 'Rooftop Terrace, Sunny Courtyard, South-Facing Garden',
    difficulty: 'Moderate',
    petSafe: false,
    benefits: ['Fresh Organic Produce', 'Rapid 60-Day Harvest', 'High Yield in Containers'],
    temperature: '20°C - 32°C',
    tag: 'Terrace Harvest'
  },
  {
    id: 'chili',
    category: 'outdoor',
    botanicalName: 'Capsicum Annuum',
    commonName: 'Patio Chili Pepper',
    tagline: 'Fiery crimson and emerald pods clustered along compact bushes.',
    description: 'Resilient and highly productive fruiting pepper plant. Tolerates intense summer heat with vigor and provides fresh organic chilies for everyday cooking.',
    image: chiliImg,
    sunlight: 'Full Direct Sun',
    watering: 'Every alternate day',
    idealLocation: 'Sunny Terrace Edge, Garden Border, Kitchen Balcony',
    difficulty: 'Easy',
    petSafe: false,
    benefits: ['Year-Round Spice Harvest', 'Drought & Heat Resistant', 'Pest-Deterrent Foliage'],
    temperature: '20°C - 36°C',
    tag: 'Fiery Harvest'
  },

  // ===================== BALCONY & HERBS =====================
  {
    id: 'basil',
    category: 'balcony',
    botanicalName: 'Ocimum Tenuiflorum',
    commonName: 'Holy Basil (Tulsi)',
    tagline: 'Sacred medicinal herbal icon with clove-spiced aromatic leaves.',
    description: 'Revered for millennia for purifying ambient air and strengthening holistic respiratory health. Thrives happily on morning sun-drenched balcony railings.',
    image: basilImg,
    sunlight: '4-6 Hours Morning Sunlight',
    watering: 'Daily light morning misting & soak',
    idealLocation: 'East-Facing Balcony, Kitchen Window Sill, Sacred Altar Spot',
    difficulty: 'Easy',
    petSafe: true,
    benefits: ['Releases Oxygen 20h Daily', 'Herbal Immunity Tea', 'Airborne Insect Repellent'],
    temperature: '20°C - 34°C',
    tag: 'Sacred Herbal'
  },
  {
    id: 'mint',
    category: 'balcony',
    botanicalName: 'Mentha Spicata',
    commonName: 'Spearmint (Pudina)',
    tagline: 'Fast-spreading fragrant groundcover for refreshing herbal teas.',
    description: 'Vigorous and refreshing aromatic culinary herb. Thrives in shallow balcony troughs, providing fresh cooling leaves for teas, chutneys, and summer drinks.',
    image: mintImg,
    sunlight: 'Partial Sun to Morning Light',
    watering: 'Every 1-2 days (prefers damp soil)',
    idealLocation: 'Balcony Railing Planter, Shaded Patio Trough, Kitchen Corner',
    difficulty: 'Beginner',
    petSafe: true,
    benefits: ['Rapid Endless Harvest', 'Cooling Aromatic Scent', 'Thrives in Container Troughs'],
    temperature: '15°C - 30°C',
    tag: 'Kitchen Herb'
  },
  {
    id: 'aloe',
    category: 'balcony',
    botanicalName: 'Aloe Barbadensis Miller',
    commonName: 'Aloe Vera Succulent',
    tagline: 'Ancient soothing succulent with thick restorative gel-filled leaves.',
    description: 'An indispensable balcony staple containing cooling healing gel for soothing sunburns and skin irritation. Filters airborne chemicals and needs minimal attention.',
    image: aloeImg,
    sunlight: 'Bright Filtered Indirect to Gentle Sun',
    watering: 'Every 2-3 weeks',
    idealLocation: 'Covered Balcony Shelf, Patio Console, Bright Kitchen Sill',
    difficulty: 'Beginner',
    petSafe: false,
    benefits: ['First-Aid Burn & Skin Gel', 'Air Quality Bio-Monitor', 'Extremely Drought Resilient'],
    temperature: '18°C - 35°C',
    tag: 'First-Aid Succulent'
  }
];

interface CuratedPlantShowcaseProps {
  onSelectPlantForGrowth?: (plantName: string) => void;
  onSelectPlantForDisease?: () => void;
  onExploreCareGuide?: () => void;
  onAddPlantToMonitor?: (plantName: string) => void;
}

export function CuratedPlantShowcase({
  onSelectPlantForGrowth,
  onSelectPlantForDisease,
  onExploreCareGuide,
  onAddPlantToMonitor
}: CuratedPlantShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState<PlantPlacementCategory>('indoor');
  const [selectedPlantId, setSelectedPlantId] = useState<string>('snake-plant');
  const [viewMode, setViewMode] = useState<'depth' | 'grid'>('depth');
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [savedPlants, setSavedPlants] = useState<string[]>([]);

  // Filtered plants for currently selected environment category
  const filteredPlants = useMemo(() => {
    return SHOWCASE_PLANTS.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  // Active spotlight plant
  const activePlant = useMemo(() => {
    return SHOWCASE_PLANTS.find(p => p.id === selectedPlantId) || filteredPlants[0] || SHOWCASE_PLANTS[0];
  }, [selectedPlantId, filteredPlants]);

  // Category slots for RubberSegment
  const categoryItems: RubberSegmentItem[] = useMemo(() => [
    {
      value: 'indoor',
      label: 'Indoor Plants',
      icon: <Home className="w-4 h-4" />
    },
    {
      value: 'outdoor',
      label: 'Outdoor Plants',
      icon: <Sun className="w-4 h-4" />
    },
    {
      value: 'balcony',
      label: 'Balcony & Herbs',
      icon: <Sprout className="w-4 h-4" />
    }
  ], []);

  // Map plants to DepthCarousel items
  const carouselItems = useMemo(() => {
    return filteredPlants.map(plant => ({
      image: plant.image,
      alt: `${plant.botanicalName} (${plant.commonName})`,
      title: plant.botanicalName,
      subtitle: plant.commonName,
      tag: plant.tag,
      id: plant.id,
      plant
    }));
  }, [filteredPlants]);

  // Auto-switch to first plant when category changes if active doesn't belong to it
  useEffect(() => {
    if (!filteredPlants.some(p => p.id === selectedPlantId)) {
      if (filteredPlants.length > 0) {
        setSelectedPlantId(filteredPlants[0].id);
      }
    }
  }, [activeCategory, selectedPlantId, filteredPlants]);

  // Load saved favorites from storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('plantGuruFavorites');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setSavedPlants(parsed);
      }
    } catch (e) {}
  }, []);

  const toggleSaveFavorite = (id: string, name: string) => {
    const updated = savedPlants.includes(id) 
      ? savedPlants.filter(i => i !== id)
      : [...savedPlants, id];
    setSavedPlants(updated);
    try {
      localStorage.setItem('plantGuruFavorites', JSON.stringify(updated));
    } catch (e) {}

    if (!savedPlants.includes(id) && onAddPlantToMonitor) {
      onAddPlantToMonitor(name);
    }
  };

  // Auto play carousel rotation
  useEffect(() => {
    if (!isAutoPlaying || viewMode !== 'depth') return;
    const timer = setInterval(() => {
      const currentIndex = filteredPlants.findIndex(p => p.id === selectedPlantId);
      const nextIndex = (currentIndex + 1) % filteredPlants.length;
      setSelectedPlantId(filteredPlants[nextIndex].id);
    }, 4500);

    return () => clearInterval(timer);
  }, [isAutoPlaying, viewMode, filteredPlants, selectedPlantId]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    const currentIndex = filteredPlants.findIndex(p => p.id === selectedPlantId);
    const prevIndex = (currentIndex - 1 + filteredPlants.length) % filteredPlants.length;
    setSelectedPlantId(filteredPlants[prevIndex].id);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    const currentIndex = filteredPlants.findIndex(p => p.id === selectedPlantId);
    const nextIndex = (currentIndex + 1) % filteredPlants.length;
    setSelectedPlantId(filteredPlants[nextIndex].id);
  };

  return (
    <section 
      id="plant-world-showcase" 
      className="w-full py-10 sm:py-16 relative overflow-hidden transition-all duration-300"
    >
      <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10 sm:space-y-14">
        
        {/* ========================================================= */}
        {/* 1. HEADER SECTION                                         */}
        {/* ========================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-3 border-b border-zinc-200">
          <div className="max-w-2xl space-y-1.5">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-950 tracking-tight leading-tight">
              The world of plants
            </h2>

            <p className="text-sm sm:text-base text-zinc-500 font-medium leading-relaxed max-w-xl">
              Explore indoor, outdoor, and balcony species with light, watering, and growth forecasts.
            </p>
          </div>

          {/* Interactive Category Selector with RubberSegment */}
          <div className="shrink-0 overflow-x-auto py-1">
            <RubberSegment
              items={categoryItems}
              value={activeCategory}
              onChange={(val) => {
                setActiveCategory(val as PlantPlacementCategory);
                setIsAutoPlaying(true);
              }}
              trackColor="rgba(9, 9, 11, 0.06)"
              thumbColor="#09090b"
              textColor="#52525b"
              activeTextColor="#ffffff"
              size="md"
              radius={9999}
              inset={4}
              equalSlots={false}
              stretch={80}
              squash={3}
              speed={1}
              glide={70}
              draggable={true}
              className="rubber-segment--plant-category"
              aria-label="Plant environment category"
            />
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. THE MAIN SHOWCASE STAGE: LEFT SPOTLIGHT + RIGHT CAROUSEL */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* =================== LEFT: SPOTLIGHT PLANT =================== */}
          <div className="lg:col-span-5 flex flex-col justify-between botanical-glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden">
            {/* Spotlight Header / Tag */}
            <div className="flex items-center justify-between mb-4 relative z-10">
              <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                {activePlant.tag}
              </span>

              <button
                type="button"
                onClick={() => toggleSaveFavorite(activePlant.id, activePlant.commonName)}
                className={`p-2.5 rounded-xl transition-all cursor-pointer border ${
                  savedPlants.includes(activePlant.id)
                    ? 'bg-zinc-950 text-white border-zinc-950'
                    : 'bg-white border-zinc-200 text-zinc-500 hover:text-zinc-950 hover:border-zinc-300'
                }`}
                title={savedPlants.includes(activePlant.id) ? 'Saved to Favorites' : 'Add to Favorites'}
              >
                <Heart className={`w-4 h-4 ${savedPlants.includes(activePlant.id) ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Big Featured Plant Image */}
            <div className="relative w-full aspect-[4/3] sm:aspect-square max-h-[340px] flex items-center justify-center my-2 group">
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/5 to-transparent rounded-2xl pointer-events-none" />
              
              <img
                key={activePlant.id}
                src={activePlant.image}
                alt={activePlant.botanicalName}
                className="w-full h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.12)] animate-in fade-in zoom-in-95 duration-500 select-none group-hover:scale-105 transition-transform"
              />

              {activePlant.airPurifyingScore && (
                <div className="absolute bottom-2 left-2 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-zinc-200 shadow-xs flex items-center space-x-1.5 text-xs font-bold text-zinc-900 tabular-nums">
                  <ShieldCheck className="w-3.5 h-3.5 text-zinc-700" />
                  <span>Air Score: {activePlant.airPurifyingScore}%</span>
                </div>
              )}
            </div>

            {/* Plant Details & Specs Card */}
            <div className="space-y-4 pt-2">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight leading-tight">
                  {activePlant.botanicalName}
                </h3>
                <span className="text-xs sm:text-sm font-semibold text-zinc-500 block mt-0.5">
                  {activePlant.commonName}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-medium">
                {activePlant.tagline}
              </p>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                <div className="botanical-glass-card p-2.5 rounded-xl flex items-center space-x-2">
                  <Sun className="w-4 h-4 text-zinc-700 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] text-zinc-500 block uppercase font-bold">Light</span>
                    <span className="font-bold text-zinc-950 truncate block">{activePlant.sunlight}</span>
                  </div>
                </div>

                <div className="botanical-glass-card p-2.5 rounded-xl flex items-center space-x-2">
                  <Droplets className="w-4 h-4 text-zinc-700 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] text-zinc-500 block uppercase font-bold">Water</span>
                    <span className="font-bold text-zinc-950 truncate block">{activePlant.watering}</span>
                  </div>
                </div>
              </div>

              {/* Best Placement Location Pod */}
              <div className="p-3 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-start space-x-2.5 text-xs">
                <MapPin className="w-4 h-4 text-zinc-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-zinc-950 block">
                    Ideal Spot
                  </span>
                  <span className="text-zinc-600 font-medium">
                    {activePlant.idealLocation}
                  </span>
                </div>
              </div>

              {/* Interactive Buttons */}
              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => onSelectPlantForGrowth?.(activePlant.commonName)}
                  className="px-3.5 py-3 rounded-2xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs shadow-sm transition-all active:scale-95 flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Predict Growth</span>
                </button>

                <button
                  type="button"
                  onClick={onSelectPlantForDisease}
                  className="px-3.5 py-3 rounded-2xl bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-900 font-bold text-xs transition-all active:scale-95 flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-zinc-700" />
                  <span>Scan Leaf</span>
                </button>
              </div>

            </div>
          </div>

          {/* =================== RIGHT: HORIZONTAL CAROUSEL =================== */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            
            {/* Carousel Control Bar */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  {activeCategory === 'indoor' ? 'Top Indoor Houseplants' : activeCategory === 'outdoor' ? 'Top Outdoor Sun Plants' : 'Top Balcony Herb Collection'}
                </span>
              </div>

              {/* View Mode & Autoplay Controls */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center p-1 rounded-xl botanical-glass-card">
                  <button
                    type="button"
                    onClick={() => setViewMode('depth')}
                    className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                      viewMode === 'depth'
                        ? 'bg-zinc-950 text-white shadow-xs'
                        : 'text-zinc-600 hover:text-zinc-950'
                    }`}
                    title="3D Depth Stack Carousel"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">3D Depth</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                      viewMode === 'grid'
                        ? 'bg-zinc-950 text-white shadow-xs'
                        : 'text-zinc-600 hover:text-zinc-950'
                    }`}
                    title="Grid Layout"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Grid</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className="p-2 rounded-xl botanical-glass-card text-zinc-600 hover:text-zinc-950 text-xs font-medium transition-colors cursor-pointer"
                  title={isAutoPlaying ? 'Pause rotation' : 'Resume auto rotation'}
                >
                  {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>

                {viewMode === 'grid' && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="p-2 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 border border-zinc-200 transition-colors cursor-pointer"
                      title="Previous plant"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="p-2 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 border border-zinc-200 transition-colors cursor-pointer"
                      title="Next plant"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Viewport: DepthCarousel 3D Stack OR Grid Layout */}
            {viewMode === 'depth' ? (
              <div className="w-full flex-1 flex items-center justify-center min-h-[460px] sm:min-h-[500px]">
                <DepthCarousel
                  items={carouselItems}
                  cardWidth={280}
                  cardHeight={400}
                  radius={24}
                  depth={240}
                  spread={85}
                  tilt={16}
                  duration={0.8}
                  autoplay={false}
                  onChange={(index) => {
                    const plant = filteredPlants[index];
                    if (plant) setSelectedPlantId(plant.id);
                  }}
                  className="w-full h-full"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4 flex-1">
                {filteredPlants.map((plant) => (
                  <div
                    key={plant.id}
                    onClick={() => setSelectedPlantId(plant.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                      selectedPlantId === plant.id
                        ? 'border-zinc-950 ring-2 ring-zinc-950/15 bg-zinc-50'
                        : 'bg-white border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <div className="w-full aspect-square rounded-xl overflow-hidden bg-zinc-100 p-2 flex items-center justify-center mb-2">
                      <img
                        src={plant.image}
                        alt={plant.commonName}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-zinc-500 block uppercase">
                        {plant.tag}
                      </span>
                      <h4 className="text-xs sm:text-sm font-extrabold text-zinc-950 truncate">
                        {plant.commonName}
                      </h4>
                      <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                        {plant.sunlight}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom Pagination Indicator */}
            <div className="flex items-center justify-center px-1 pt-1">
              <div className="flex items-center space-x-1.5">
                {filteredPlants.map((plant) => (
                  <button
                    key={plant.id}
                    type="button"
                    onClick={() => setSelectedPlantId(plant.id)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      selectedPlantId === plant.id
                        ? 'w-6 bg-zinc-950'
                        : 'w-1.5 bg-zinc-300 hover:bg-zinc-500'
                    }`}
                    title={plant.commonName}
                  />
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default CuratedPlantShowcase;
