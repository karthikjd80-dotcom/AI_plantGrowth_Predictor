import React, { useState, useMemo } from 'react';
import { 
  X, 
  Home, 
  Sun, 
  Droplets, 
  Sparkles, 
  MapPin, 
  Check, 
  Bot, 
  Info,
  Layers
} from 'lucide-react';
import { AccordionGallery, AccordionGalleryItem } from './AccordionGallery';
import RubberSegment, { RubberSegmentItem } from './RubberSegment';

// Import project plant image assets
import snakePlantImg from '../assets/images/snake_plant_pot_1791383456814.jpg';
import crassulaJadeImg from '../assets/images/crassula_jade_pot_1791383475340.jpg';
import spiderPlantImg from '../assets/images/spider_plant_pot_1791383493258.jpg';
import peaceLilyImg from '../assets/images/peace_lily_pot_1791383576196.jpg';
import zebraHaworthiaImg from '../assets/images/zebra_succulent_1791059345245.jpg';
import aloeImg from '../assets/images/aloe_succulent_1791059360382.jpg';

import freshLeafImg from '../assets/images/fresh_green_leaf_1791632394999.jpg';
import basilImg from '../assets/images/basil_plant_1791175798741.jpg';
import jasmineImg from '../assets/images/jasmine_pot_1791383528522.jpg';
import roseImg from '../assets/images/rose_plant_1791175671018.jpg';
import tomatoImg from '../assets/images/tomato_plant_1791175685194.jpg';
import mintImg from '../assets/images/mint_plant_1791175763146.jpg';

export interface PlantSuggestionItem {
  id: string;
  category: 'indoor' | 'outdoor';
  commonName: string;
  subtitle: string;
  botanicalName: string;
  image: string;
  tagline: string;
  sunlight: string;
  watering: string;
  idealLocation: string;
  difficulty: 'Very Easy' | 'Easy' | 'Moderate';
  airPurifyingScore?: number;
  benefits: string[];
  whyChoose: string;
}

export const INDOOR_SUGGESTIONS: PlantSuggestionItem[] = [
  {
    id: 'money-plant',
    category: 'indoor',
    commonName: 'Money Plant (Jade & Pothos)',
    subtitle: 'Air-Purifying Prosperity Vine',
    botanicalName: 'Epipremnum aureum / Crassula ovata',
    image: crassulaJadeImg,
    tagline: 'Prosperity icon that purifies indoor air and thrives on minimal care.',
    sunlight: 'Low to Bright Indirect Light',
    watering: 'Every 8-10 days (allow soil to dry)',
    idealLocation: 'Living Room Table, Office Desk, Bookshelf, Window Sill',
    difficulty: 'Very Easy',
    airPurifyingScore: 92,
    benefits: ['Brings Positive Vibe & Prosperity', 'Filters Formaldehyde & Airborne Toxins', 'Grows in both water vases and soil'],
    whyChoose: 'The most popular houseplant in modern homes; virtually effortless to maintain indoors.'
  },
  {
    id: 'snake-plant',
    category: 'indoor',
    commonName: 'Snake Plant (Sansevieria)',
    subtitle: 'Nighttime Oxygen Champion',
    botanicalName: 'Dracaena trifasciata',
    image: snakePlantImg,
    tagline: 'Architectural bedroom champion that releases fresh oxygen during the night.',
    sunlight: 'Low light to bright filtered',
    watering: 'Once every 2-3 weeks',
    idealLocation: 'Bedroom Nightstand, Living Room Corners, Dim Corridors',
    difficulty: 'Very Easy',
    airPurifyingScore: 98,
    benefits: ['NASA Top-Rated Air Purifier', 'Releases Nighttime Oxygen for Better Sleep', 'Thrives in AC rooms with low light'],
    whyChoose: 'Near-indestructible indoor plant that continuously filters airborne toxins.'
  },
  {
    id: 'peace-lily',
    category: 'indoor',
    commonName: 'Peace Lily',
    subtitle: 'Porcelain White Blooming Flora',
    botanicalName: 'Spathiphyllum wallisii',
    image: peaceLilyImg,
    tagline: 'Lush dark green leaves crowned with serene porcelain white blooms.',
    sunlight: 'Low to medium filtered indirect light',
    watering: 'Once a week (leaves droop slightly when thirsty)',
    idealLocation: 'Living Room, Dining Corner, Hallway Credenza',
    difficulty: 'Easy',
    airPurifyingScore: 95,
    benefits: ['Produces Elegant White Blooms Indoors', 'Natural Room Humidifier', 'Absorbs indoor mold spores & pollutants'],
    whyChoose: 'One of the few houseplants that reliably produces elegant white flowers indoors.'
  },
  {
    id: 'spider-plant',
    category: 'indoor',
    commonName: 'Spider Plant',
    subtitle: 'Pet-Friendly Air Filter',
    botanicalName: 'Chlorophytum comosum',
    image: spiderPlantImg,
    tagline: 'Arching variegated ribbon leaves with baby plantlets cascading gracefully.',
    sunlight: 'Medium indirect to bright light',
    watering: 'Once a week',
    idealLocation: 'Hanging Baskets, Balcony Corner, Living Room Pedestal',
    difficulty: 'Very Easy',
    airPurifyingScore: 90,
    benefits: ['100% Pet Friendly & Non-Toxic', 'Absorbs Carbon Monoxide', 'Rapid and easy to propagate'],
    whyChoose: 'Safe for curious cats and dogs, excellent for hanging pots.'
  },
  {
    id: 'aloe-vera',
    category: 'indoor',
    commonName: 'Aloe Vera Succulent',
    subtitle: 'Medicinal First-Aid Healer',
    botanicalName: 'Aloe barbadensis Miller',
    image: aloeImg,
    tagline: 'Ancient soothing succulent with healing gel for burns and glowing skin.',
    sunlight: 'Bright indirect to gentle morning sun',
    watering: 'Every 2-3 weeks',
    idealLocation: 'Kitchen Window Sill, Sunny Study Table, Balcony Shelf',
    difficulty: 'Very Easy',
    airPurifyingScore: 84,
    benefits: ['Natural First-Aid Burn Gel', 'Monitors Ambient Air Quality', 'Needs virtually no daily maintenance'],
    whyChoose: 'Medicinal and aesthetic multipurpose succulent for every household.'
  },
  {
    id: 'zebra-succulent',
    category: 'indoor',
    commonName: 'Zebra Haworthia',
    subtitle: 'Compact Desk Companion',
    botanicalName: 'Haworthiopsis fasciata',
    image: zebraHaworthiaImg,
    tagline: 'Petite geometric desk gem with crisp white horizontal bands.',
    sunlight: 'Bright indirect light',
    watering: 'Every 2-3 weeks',
    idealLocation: 'Computer Workstation, Study Desk, Bookshelf Nook',
    difficulty: 'Very Easy',
    airPurifyingScore: 78,
    benefits: ['Stays Under 6 Inches Tall Forever', 'Zero Fallen Leaves Mess', 'Highly Drought Resilient'],
    whyChoose: 'The ultimate compact work-from-home desk companion.'
  }
];

export const OUTDOOR_SUGGESTIONS: PlantSuggestionItem[] = [
  {
    id: 'banana-plant',
    category: 'outdoor',
    commonName: 'Dwarf Banana Plant (Musa)',
    subtitle: 'Tropical Broadleaf Statement',
    botanicalName: 'Musa acuminata (Dwarf Cavendish)',
    image: freshLeafImg,
    tagline: 'Lush tropical giant with magnificent emerald paddle leaves.',
    sunlight: '6+ Hours Direct Full Sunlight',
    watering: 'Daily deep watering (prefers moist, organic-rich soil)',
    idealLocation: 'Outdoor Terrace, Garden Courtyard, Large Patio Planter',
    difficulty: 'Moderate',
    benefits: ['Brings Tropical Resort Ambiance', 'Traditional Leaves for Eco-Dining', 'Delicious Homegrown Fruit Yield'],
    whyChoose: 'A beloved outdoor statement plant in tropical gardens that thrives in full sun.'
  },
  {
    id: 'holy-basil',
    category: 'outdoor',
    commonName: 'Holy Basil (Tulsi)',
    subtitle: 'Sacred Queen of Herbs',
    botanicalName: 'Ocimum tenuiflorum',
    image: basilImg,
    tagline: 'Sacred medicinal queen of herbs with clove-scented aromatic leaves.',
    sunlight: '4-6 Hours Direct Morning Sunlight',
    watering: 'Daily light morning watering',
    idealLocation: 'East-Facing Balcony, Terrace Altar, Garden Entrance',
    difficulty: 'Easy',
    benefits: ['Emits Oxygen 20 Hours Daily', 'Medicinal Herbal Immunity Tea', 'Natural Mosquito & Bug Deterrent'],
    whyChoose: 'Essential auspicious plant for fresh air, spiritual harmony, and daily wellness.'
  },
  {
    id: 'arabian-jasmine',
    category: 'outdoor',
    commonName: 'Arabian Jasmine (Mogra)',
    subtitle: 'Sweet Fragrant Evening Star',
    botanicalName: 'Jasminum sambac',
    image: jasmineImg,
    tagline: 'Intoxicating sweet evening fragrance with double-white star blossoms.',
    sunlight: '5+ Hours Direct Sun',
    watering: 'Daily or alternate morning watering',
    idealLocation: 'Sunny Balcony Railing, Entrance Arch, Terrace Planter',
    difficulty: 'Easy',
    benefits: ['Heavenly Natural Fragrance', 'Continuous Year-Round Blooms', 'Attracts Friendly Pollinators'],
    whyChoose: 'Iconic fragrant flower that perfumes your entire balcony and terrace every evening.'
  },
  {
    id: 'garden-rose',
    category: 'outdoor',
    commonName: 'Garden Rose',
    subtitle: 'Velvety Crimson Patio Classic',
    botanicalName: 'Rosa indica',
    image: roseImg,
    tagline: 'Velvety crimson floral royalty calibrated for container gardens.',
    sunlight: '6+ Hours Direct Sunshine',
    watering: 'Deep soak 3-4 times per week',
    idealLocation: 'Sunny Terrace Walkway, Rooftop Garden, Patio Trough',
    difficulty: 'Moderate',
    benefits: ['Vibrant Multi-Bloom Flushes', 'Classic Garden Centerpiece', 'Fresh Cut Flowers for Home'],
    whyChoose: 'Timeless floral classic that delivers dramatic color and charm in outdoor containers.'
  },
  {
    id: 'cherry-tomato',
    category: 'outdoor',
    commonName: 'Potted Cherry Tomato',
    subtitle: 'Sweet High-Yield Edible Bush',
    botanicalName: 'Solanum lycopersicum',
    image: tomatoImg,
    tagline: 'Prolific vine heavy with sweet sun-ripened ruby red fruit clusters.',
    sunlight: '6-8 Hours Full Direct Sun',
    watering: 'Daily morning soak',
    idealLocation: 'Rooftop Grow Bag, Sunny Balcony Corner, Kitchen Garden',
    difficulty: 'Moderate',
    benefits: ['100% Organic Homegrown Harvest', 'Ready to Pick in 60 Days', 'Heavy Fruit Yield in Pots'],
    whyChoose: 'The most rewarding fruit-bearing edible plant to grow on your balcony or terrace.'
  },
  {
    id: 'spearmint',
    category: 'outdoor',
    commonName: 'Spearmint (Garden Mint)',
    subtitle: 'Cooling Refreshing Herb',
    botanicalName: 'Mentha spicata',
    image: mintImg,
    tagline: 'Vigorous cooling aromatic herb for fresh teas, garnishes, and summer drinks.',
    sunlight: 'Morning sunlight or partial afternoon shade',
    watering: 'Every 1-2 days (likes consistently damp soil)',
    idealLocation: 'Balcony Trough, Kitchen Window Planter, Patio Edge',
    difficulty: 'Very Easy',
    benefits: ['Endless Fresh Leaf Harvest', 'Cooling Refreshing Aroma', 'Fast Growth in Shallow Pots'],
    whyChoose: 'Instant kitchen harvest: pinch the leaves and enjoy organic mint every single day.'
  }
];

interface PlantSuggestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlantForGrowth?: (plantName: string) => void;
  onAskDoctorAI?: (question: string) => void;
  isDarkMode?: boolean;
}

export function PlantSuggestionsModal({
  isOpen,
  onClose,
  onSelectPlantForGrowth,
  onAskDoctorAI,
  isDarkMode = false
}: PlantSuggestionsModalProps) {
  const [activeTab, setActiveTab] = useState<'indoor' | 'outdoor'>('indoor');
  const [selectedPlantId, setSelectedPlantId] = useState<string>('money-plant');

  const currentList = useMemo(() => {
    return activeTab === 'indoor' ? INDOOR_SUGGESTIONS : OUTDOOR_SUGGESTIONS;
  }, [activeTab]);

  const activePlant = useMemo(() => {
    return currentList.find(p => p.id === selectedPlantId) || currentList[0];
  }, [selectedPlantId, currentList]);

  // Convert to AccordionGallery items
  const accordionItems: AccordionGalleryItem[] = useMemo(() => {
    return currentList.map(item => ({
      image: item.image,
      label: item.commonName,
      alt: item.botanicalName,
      id: item.id
    }));
  }, [currentList]);

  const rubberSegmentItems: RubberSegmentItem[] = useMemo(() => [
    {
      value: 'indoor',
      label: 'Indoor Plants',
      icon: <Home className="w-4 h-4" />
    },
    {
      value: 'outdoor',
      label: 'Outdoor Plants',
      icon: <Sun className="w-4 h-4" />
    }
  ], []);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-2.5 sm:p-6 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="relative w-full max-w-5xl max-h-[94vh] flex flex-col rounded-2xl sm:rounded-3xl bg-white/95 dark:bg-zinc-950/95 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 shadow-2xl backdrop-blur-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header with Title, Close Button, and Responsive Switcher */}
        <div className="sticky top-0 z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-b border-black/10 dark:border-white/10 px-3.5 sm:px-8 py-3 sm:py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-4">
            
            {/* Top row on mobile / Left group on desktop */}
            <div className="flex items-center justify-between w-full sm:w-auto">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-zinc-950 dark:bg-white flex items-center justify-center text-white dark:text-zinc-950 shadow-md shrink-0">
                  <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 fill-current" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-zinc-950/10 dark:bg-white/15 text-zinc-900 dark:text-zinc-100 font-bold border border-zinc-950/20 dark:border-white/20 shrink-0">
                      AI PLANT CURATOR
                    </span>
                    <span className="text-xs text-zinc-600 dark:text-zinc-400 font-semibold hidden md:inline">
                      Top Recommendations
                    </span>
                  </div>
                  <h2 className="text-base sm:text-2xl font-black tracking-tight text-zinc-950 dark:text-white mt-0.5 truncate sm:overflow-visible">
                    <span>Plant Suggestions</span>
                    <span className="hidden sm:inline"> &amp; Recommendations</span>
                  </h2>
                </div>
              </div>

              {/* Mobile Close Button - ALWAYS pinned at top right on mobile */}
              <button
                type="button"
                onClick={onClose}
                className="sm:hidden w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-zinc-300/80 dark:border-zinc-700 flex items-center justify-center text-zinc-700 dark:text-zinc-200 shadow-sm hover:shadow-md cursor-pointer transition-all active:scale-90 group shrink-0 ml-2"
                title="Close / Go Back"
                aria-label="Close and Go Back"
              >
                <X className="w-4 h-4 text-zinc-800 dark:text-zinc-100 group-hover:rotate-90 transition-transform duration-200" />
              </button>
            </div>

            {/* Switcher & Desktop Close Button */}
            <div className="flex items-center justify-center sm:justify-end gap-2 sm:gap-3 w-full sm:w-auto">
              {/* RubberSegment Switcher: Centered and full view on mobile, inline on desktop */}
              <div className="shrink-0 max-w-full overflow-x-auto py-0.5 flex justify-center">
                <RubberSegment
                  items={rubberSegmentItems}
                  value={activeTab}
                  onChange={(val) => {
                    const nextTab = val as 'indoor' | 'outdoor';
                    setActiveTab(nextTab);
                    setSelectedPlantId(nextTab === 'indoor' ? 'money-plant' : 'banana-plant');
                  }}
                  trackColor={isDarkMode ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.06)"}
                  thumbColor={isDarkMode ? "#ffffff" : "#09090b"}
                  textColor={isDarkMode ? "#a1a1aa" : "#52525b"}
                  activeTextColor={isDarkMode ? "#09090b" : "#ffffff"}
                  size="sm"
                  radius={9999}
                  inset={3}
                  equalSlots={false}
                  stretch={40}
                  squash={2}
                  speed={1}
                  glide={50}
                  draggable={true}
                />
              </div>

              {/* Desktop Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="hidden sm:flex w-10 h-10 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-zinc-300/80 dark:border-zinc-700 items-center justify-center text-zinc-700 dark:text-zinc-200 shadow-sm hover:shadow-md cursor-pointer transition-all active:scale-90 group shrink-0"
                title="Close / Go Back"
                aria-label="Close and Go Back"
              >
                <X className="w-5 h-5 text-zinc-800 dark:text-zinc-100 group-hover:rotate-90 transition-transform duration-200" />
              </button>
            </div>

          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-5 sm:p-8 space-y-6">
          
          {/* Subtitle / Tip Bar */}
          <div className="p-3.5 rounded-2xl bg-zinc-950/5 dark:bg-white/10 border border-zinc-950/15 dark:border-white/15 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
              <Info className="w-4 h-4 text-zinc-900 dark:text-white shrink-0" />
              <span>
                {activeTab === 'indoor' ? (
                  <>
                    <strong>Recommended for Indoors:</strong> Money Plant, Snake Plant, and Peace Lily thrive in low to medium indirect light and actively purify indoor room air.
                  </>
                ) : (
                  <>
                    <strong>Recommended for Outdoors &amp; Terraces:</strong> Dwarf Banana Plant, Holy Basil, Jasmine, and Rose thrive in direct sunshine and open outdoor airflow.
                  </>
                )}
              </span>
            </div>
            <span className="hidden md:inline-block font-mono text-[11px] text-zinc-700 dark:text-zinc-300 font-bold shrink-0">
              {currentList.length} Plants Available
            </span>
          </div>

          {/* Main Content Stage: Interactive AccordionGallery + Active Plant Spotlight */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Left Column: Interactive React Bits AccordionGallery */}
            <div className="lg:col-span-7 flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-zinc-950 dark:text-white" />
                  <span>Click Card to View Plant Specs</span>
                </span>
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  {activePlant.subtitle}
                </span>
              </div>

              {/* Accordion Gallery Component */}
              <div className="w-full rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-black/5 dark:bg-black/20 p-2">
                <AccordionGallery
                  items={accordionItems}
                  height={320}
                  gap={8}
                  radius={16}
                  expandRatio={0.48}
                  orientation="horizontal"
                  duration={0.5}
                  accentColor={isDarkMode ? "#ffffff" : "#09090b"}
                  overlayColor="#000000"
                  trigger="click"
                  grayscale={false}
                  onItemSelect={(item) => {
                    if (item.id) setSelectedPlantId(item.id);
                  }}
                />
              </div>

              {/* Quick 6-Pills Selector Thumbnails */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
                {currentList.map((plant) => (
                  <button
                    key={plant.id}
                    onClick={() => setSelectedPlantId(plant.id)}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      selectedPlantId === plant.id
                        ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 border-zinc-950 dark:border-white shadow-md ring-2 ring-zinc-950/20 dark:ring-white/20'
                        : 'bg-white/60 dark:bg-white/5 border-black/10 dark:border-white/10 hover:border-zinc-950/40 dark:hover:border-white/40 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    <img
                      src={plant.image}
                      alt={plant.commonName}
                      className="w-10 h-10 rounded-lg object-cover shadow-xs"
                    />
                    <span className="text-[10px] font-bold truncate max-w-full leading-tight">
                      {plant.commonName.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Detailed Spotlight Card for Selected Plant */}
            <div className="lg:col-span-5 flex flex-col justify-between p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 shadow-lg relative overflow-hidden backdrop-blur-xl">
              {/* Top specular highlight */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

              <div className="space-y-4">
                {/* Plant Names & Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block font-mono">
                      {activePlant.botanicalName}
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-zinc-950 dark:text-white leading-tight">
                      {activePlant.commonName}
                    </h3>
                    <span className="inline-block mt-0.5 text-xs font-bold text-zinc-800 dark:text-zinc-200 bg-zinc-950/10 dark:bg-white/15 px-2 py-0.5 rounded-md">
                      {activePlant.subtitle}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shrink-0 shadow-xs">
                    {activePlant.difficulty}
                  </span>
                </div>

                {/* Tagline / Overview */}
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium">
                  {activePlant.tagline}
                </p>

                {/* Specifications Pills */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white/70 dark:bg-black/30 border border-black/5 dark:border-white/10 flex items-center gap-2">
                    <Sun className="w-4 h-4 text-zinc-950 dark:text-white shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[9px] uppercase font-bold text-zinc-400 block">Sunlight</span>
                      <span className="font-bold truncate block">{activePlant.sunlight}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/70 dark:bg-black/30 border border-black/5 dark:border-white/10 flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-zinc-950 dark:text-white shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[9px] uppercase font-bold text-zinc-400 block">Watering</span>
                      <span className="font-bold truncate block">{activePlant.watering}</span>
                    </div>
                  </div>
                </div>

                {/* Ideal Location Pod */}
                <div className="p-2.5 rounded-xl bg-zinc-950/5 dark:bg-white/10 border border-zinc-950/15 dark:border-white/15 flex items-start gap-2 text-xs">
                  <MapPin className="w-4 h-4 text-zinc-900 dark:text-white shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-zinc-950 dark:text-zinc-100 block text-[11px]">
                      Ideal Placement:
                    </span>
                    <span className="text-zinc-700 dark:text-zinc-300 font-medium text-[11px]">
                      {activePlant.idealLocation}
                    </span>
                  </div>
                </div>

                {/* Benefits Checklist */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wide block">
                    Key Benefits &amp; Highlights:
                  </span>
                  {activePlant.benefits.map((b, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-xs text-zinc-700 dark:text-zinc-300 font-medium">
                      <Check className="w-3.5 h-3.5 text-zinc-950 dark:text-white shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2.5 pt-4 mt-2 border-t border-black/10 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    if (onSelectPlantForGrowth) {
                      onSelectPlantForGrowth(activePlant.commonName);
                    }
                    onClose();
                  }}
                  className="px-3 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  <span>Predict Growth</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (onAskDoctorAI) {
                      onAskDoctorAI(`Tell me how to grow and care for ${activePlant.commonName} at home.`);
                    }
                    onClose();
                  }}
                  className="px-3 py-2.5 rounded-xl bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 text-zinc-900 dark:text-white font-bold text-xs border border-black/10 dark:border-white/15 transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Bot className="w-3.5 h-3.5 text-zinc-950 dark:text-white" />
                  <span>Ask Doctor AI</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default PlantSuggestionsModal;
