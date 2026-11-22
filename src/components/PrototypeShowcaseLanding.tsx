import React, { useState } from 'react';
import { 
  Leaf, 
  Search, 
  Camera, 
  UploadCloud, 
  Heart, 
  ArrowRight, 
  Sun, 
  Droplets, 
  Home, 
  Activity, 
  ChevronRight, 
  ChevronLeft,
  Bot, 
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { SwipeToStart } from './SwipeToStart';

import echeveriaImg from '../assets/images/echeveria_topview_1791059332874.jpg';
import zebraImg from '../assets/images/zebra_succulent_1791059345245.jpg';
import aloeImg from '../assets/images/aloe_succulent_1791059360382.jpg';

interface PrototypeShowcaseLandingProps {
  onStartApp: () => void;
  onOpenCamera: () => void;
  onOpenUpload: () => void;
  onOpenChat: () => void;
}

interface SpecimenData {
  id: string;
  name: string;
  category: string;
  price: string;
  description: string;
  image: string;
  light: string;
  watering: string;
  whereToGrow: string;
  maintenance: string;
  growthPrediction: string;
}

const SPECIMENS: SpecimenData[] = [
  {
    id: 'echeveria',
    name: 'Echeveria Atoll',
    category: 'SMALL SUCCULENTS',
    price: '$19.50',
    description: 'A high-precision rosette succulent specimen calibrated for FloraAI growth simulation. Features fleshy, water-storing leaves arranged in geometric spirals, monitored via 14-day computer vision.',
    image: echeveriaImg,
    light: 'Bright Indirect Sunlight',
    watering: 'Once every 10–14 days',
    whereToGrow: 'Bright Indoors / Desk',
    maintenance: 'Low maintenance · AI Monitored',
    growthPrediction: '+2.4 in / 14 days'
  },
  {
    id: 'zebra',
    name: 'Zebra Plant',
    category: 'HAWORTHIA SPECIMEN',
    price: '$9.00',
    description: 'Architectural zebra succulent characterized by striking white horizontal ridges on deep green pointed leaves. Highly resilient with slow, steady vertical crown progression.',
    image: zebraImg,
    light: 'Partial Sun / Filtered',
    watering: 'Once every 2 weeks',
    whereToGrow: 'Office Desk & Terrariums',
    maintenance: 'Minimal care · Very Hardy',
    growthPrediction: '+1.1 in / 14 days'
  },
  {
    id: 'aloe',
    name: 'Crocodile Aloe',
    category: 'ALOE HYBRID',
    price: '$10.00',
    description: 'Textured reptile-leaf succulent with micro-spines and compact rosette architecture. Excellent candidate for microclimate moisture analysis and root health assessment.',
    image: aloeImg,
    light: 'Direct to Bright Indirect',
    watering: 'Once every 12–15 days',
    whereToGrow: 'Sunny Windowsill / Balcony',
    maintenance: 'Drought tolerant · Easy',
    growthPrediction: '+1.8 in / 14 days'
  },
  {
    id: 'subsessilis',
    name: 'Subsessilis Blue',
    category: 'POWDER SUCCULENTS',
    price: '$8.50',
    description: 'Silvery powder-coated blue rosette succulent with delicate pink leaf tips under active sunlight. Extremely sensitive to overwatering; monitored via automated soil advice.',
    image: echeveriaImg,
    light: 'Direct Morning Sun',
    watering: 'Once every 14 days',
    whereToGrow: 'Window Planters',
    maintenance: 'Low maintenance · Sun Lover',
    growthPrediction: '+1.6 in / 14 days'
  }
];

export function PrototypeShowcaseLanding({
  onStartApp,
  onOpenCamera,
  onOpenUpload,
  onOpenChat,
}: PrototypeShowcaseLandingProps) {
  const [activeSpecimenIndex, setActiveSpecimenIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'succulents' | 'houseplants' | 'floraai' | 'predictor'>('succulents');
  const [predictionDays, setPredictionDays] = useState(14);
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({ echeveria: true });

  const currentSpecimen = SPECIMENS[activeSpecimenIndex];

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleNextSpecimen = () => {
    setActiveSpecimenIndex((prev) => (prev + 1) % SPECIMENS.length);
  };

  const handlePrevSpecimen = () => {
    setActiveSpecimenIndex((prev) => (prev - 1 + SPECIMENS.length) % SPECIMENS.length);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#e7eee3] text-slate-800 flex items-center justify-center p-3 sm:p-6 md:p-10 font-sans overflow-x-hidden selection:bg-emerald-200">
      
      {/* Ambient background botanical foliage blurs */}
      <div className="fixed -top-24 -left-24 w-96 h-96 bg-emerald-700/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed -bottom-24 -right-24 w-96 h-96 bg-[#446234]/20 rounded-full blur-[110px] pointer-events-none" />
      <div className="fixed top-1/3 -right-20 w-80 h-80 bg-teal-600/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Main Showcase Prototype Card (Inspired by reference UI) */}
      <div className="relative z-10 w-full max-w-5xl bg-white rounded-[28px] sm:rounded-[36px] md:rounded-[44px] shadow-[0_25px_60px_-15px_rgba(40,65,30,0.22)] border border-[#d6e2cf] overflow-hidden flex flex-col transition-all">
        
        {/* Navigation Bar inside the Card */}
        <header className="px-6 sm:px-10 py-5 flex items-center justify-between border-b border-slate-100/80 bg-white/95 backdrop-blur-md">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={onStartApp}>
            <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 shadow-xs">
              <Leaf className="w-5 h-5 text-emerald-700 -rotate-12" />
            </div>
            <div>
              <span className="font-['Playfair_Display'] font-bold text-lg text-slate-900 tracking-tight block">FloraAI</span>
              <span className="text-[10px] font-semibold text-emerald-700 tracking-wider -mt-1 block uppercase">Prototype Model</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
            <button 
              onClick={() => setActiveTab('succulents')}
              className={`relative py-1 transition-colors ${activeTab === 'succulents' ? 'text-slate-900 font-bold' : 'hover:text-slate-900'}`}
            >
              Succulents
              {activeTab === 'succulents' && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-slate-900 rounded-full" />
              )}
            </button>
            <button 
              onClick={() => {
                setActiveTab('houseplants');
                onStartApp();
              }}
              className="hover:text-slate-900 transition-colors"
            >
              House Plants
            </button>
            <button 
              onClick={() => {
                setActiveTab('floraai');
                onOpenChat();
              }}
              className="flex items-center space-x-1.5 hover:text-emerald-700 transition-colors"
            >
              <Bot className="w-4 h-4 text-emerald-600" />
              <span>FloraAI Studio</span>
            </button>
            <button 
              onClick={() => {
                setActiveTab('predictor');
                onStartApp();
              }}
              className="hover:text-slate-900 transition-colors"
            >
              14-Day Growth
            </button>
          </nav>

          {/* Top Right Actions */}
          <div className="flex items-center space-x-2.5">
            <button 
              onClick={onStartApp}
              className="p-2.5 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
              title="Search Plants"
              aria-label="Search Plants"
            >
              <Search className="w-4 h-4" />
            </button>
            <button 
              onClick={onOpenCamera}
              className="p-2.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-colors border border-emerald-200"
              title="Open Live Camera Scanner"
              aria-label="Camera"
            >
              <Camera className="w-4 h-4" />
            </button>
            <button 
              onClick={onStartApp}
              className="hidden sm:flex items-center space-x-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-full transition-all shadow-xs"
            >
              <span>Launch App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Split Grid Content: Left Editorial Showcase | Right Forest Green Overhang Viewfinder */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          
          {/* LEFT COLUMN: Editorial Plant Overview & Interactive Controls */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:pr-6 flex flex-col justify-between z-20">
            <div>
              {/* Category Kicker */}
              <div className="text-[11px] font-bold tracking-widest text-slate-400 uppercase mb-2">
                {currentSpecimen.category}
              </div>

              {/* Plant Name Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-['Playfair_Display'] font-black text-slate-900 tracking-tight mb-2">
                {currentSpecimen.name}
              </h1>

              {/* Price & Accuracy metric */}
              <div className="flex items-baseline space-x-3 mb-4">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {currentSpecimen.price}
                </span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  {currentSpecimen.growthPrediction} • 99.4% Accuracy
                </span>
              </div>

              {/* Description Paragraph */}
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-lg mb-6">
                {currentSpecimen.description}
              </p>

              {/* Prediction Day Stepper & Actions */}
              <div className="flex flex-wrap items-center gap-3.5 mb-6">
                {/* Stepper */}
                <div className="inline-flex items-center bg-slate-100/90 rounded-xl p-1 border border-slate-200 text-xs font-semibold text-slate-800">
                  <button 
                    onClick={() => setPredictionDays(d => Math.max(3, d - 1))}
                    className="w-8 h-8 rounded-lg hover:bg-white text-slate-700 flex items-center justify-center transition-colors font-bold"
                    title="Decrease Forecast Days"
                  >
                    -
                  </button>
                  <span className="px-3 min-w-[70px] text-center font-bold text-slate-900">
                    {predictionDays} Days
                  </span>
                  <button 
                    onClick={() => setPredictionDays(d => Math.min(30, d + 1))}
                    className="w-8 h-8 rounded-lg hover:bg-white text-slate-700 flex items-center justify-center transition-colors font-bold"
                    title="Increase Forecast Days"
                  >
                    +
                  </button>
                </div>

                {/* Primary Button */}
                <button
                  onClick={onStartApp}
                  className="px-7 py-3 bg-slate-950 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md active:scale-95 flex items-center space-x-2"
                >
                  <span>Predict Growth</span>
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </button>

                {/* Camera Quick Button */}
                <button
                  onClick={onOpenCamera}
                  className="px-4 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold rounded-xl transition-all border border-emerald-200 active:scale-95 flex items-center space-x-1.5"
                >
                  <Camera className="w-4 h-4 text-emerald-700" />
                  <span>Scan Plant</span>
                </button>
              </div>

              {/* SWIPE TO GET STARTED RAIL (Requested Feature!) */}
              <div className="mb-8 max-w-md">
                <div className="text-[11px] font-bold text-emerald-800 tracking-wide uppercase mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" style={{ animationDuration: '4s' }} />
                  <span>Swipe to unlock interactive AI studio:</span>
                </div>
                <SwipeToStart
                  onComplete={onStartApp}
                  text="Swipe to Get Started"
                  className="shadow-md"
                />
              </div>
            </div>

            {/* "You might also like:" Botanical Thumbnails Row */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-900 tracking-wide">
                  You might also like:
                </h3>
                <div className="flex items-center space-x-1.5">
                  <button 
                    onClick={handlePrevSpecimen}
                    className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
                    title="Previous plant"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={handleNextSpecimen}
                    className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
                    title="Next plant"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Thumbnails list */}
              <div className="grid grid-cols-3 sm:grid-cols-3 gap-2.5">
                {SPECIMENS.filter((_, idx) => idx !== activeSpecimenIndex).slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      const foundIdx = SPECIMENS.findIndex(s => s.id === item.id);
                      if (foundIdx !== -1) setActiveSpecimenIndex(foundIdx);
                    }}
                    className="group relative p-2 rounded-2xl bg-[#d5e2cf]/50 hover:bg-[#c9dabf] border border-[#bcd2b0] transition-all cursor-pointer flex flex-col justify-between"
                  >
                    {/* Like button */}
                    <button
                      onClick={(e) => toggleLike(item.id, e)}
                      className="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <Heart className={`w-3.5 h-3.5 ${likedIds[item.id] ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>

                    {/* Plant Thumbnail */}
                    <div className="w-full h-16 sm:h-20 rounded-xl overflow-hidden mb-2 flex items-center justify-center">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 rounded-lg" 
                      />
                    </div>

                    <div>
                      <div className="text-[11px] font-bold text-slate-800 truncate">
                        {item.name}
                      </div>
                      <div className="text-[10px] font-extrabold text-emerald-800">
                        {item.price}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Forest Green Background + Circular Potted Succulent Overhang */}
          <div className="lg:col-span-5 bg-[#456333] relative flex flex-col justify-between p-6 sm:p-10 text-white overflow-visible">
            
            {/* Minimal right edge pagination dots */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col space-y-2 z-30">
              {SPECIMENS.map((specimen, idx) => (
                <button
                  key={specimen.id}
                  onClick={() => setActiveSpecimenIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === activeSpecimenIndex 
                      ? 'bg-white scale-125 ring-2 ring-white/40' 
                      : 'bg-white/40 hover:bg-white/80'
                  }`}
                  aria-label={`Select specimen ${idx + 1}`}
                />
              ))}
            </div>

            {/* Overhanging Large Circular Potted Succulent Plant */}
            <div className="relative flex items-center justify-center py-6 sm:py-8 lg:py-12 my-auto">
              <div 
                onClick={onStartApp}
                className="relative lg:-left-24 w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-full overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.55)] border-4 sm:border-[6px] border-slate-900 group cursor-pointer transition-transform duration-500 hover:scale-105"
              >
                <img 
                  src={currentSpecimen.image} 
                  alt={currentSpecimen.name} 
                  className="w-full h-full object-cover group-hover:rotate-6 transition-transform duration-700" 
                />
                
                {/* Subtle glass interactive badge on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
                  <span className="p-3 bg-white/20 backdrop-blur-md rounded-full mb-2">
                    <Sparkles className="w-6 h-6 text-white" />
                  </span>
                  <span className="text-xs font-bold text-white tracking-wide">
                    Click to Inspect Growth Curve
                  </span>
                </div>
              </div>
            </div>

            {/* Botanical Vital Parameter Tiles Grid (2x2) */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/15 z-20">
              {/* Light */}
              <div className="flex items-start space-x-2.5">
                <div className="p-2 rounded-xl bg-white/10 text-white/90 shrink-0">
                  <Sun className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-white/60 font-semibold uppercase tracking-wider">Light</div>
                  <div className="text-xs font-medium text-white/90 leading-snug">{currentSpecimen.light}</div>
                </div>
              </div>

              {/* Watering */}
              <div className="flex items-start space-x-2.5">
                <div className="p-2 rounded-xl bg-white/10 text-white/90 shrink-0">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-white/60 font-semibold uppercase tracking-wider">Watering</div>
                  <div className="text-xs font-medium text-white/90 leading-snug">{currentSpecimen.watering}</div>
                </div>
              </div>

              {/* Where to grow */}
              <div className="flex items-start space-x-2.5">
                <div className="p-2 rounded-xl bg-white/10 text-white/90 shrink-0">
                  <Home className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-white/60 font-semibold uppercase tracking-wider">Where to grow</div>
                  <div className="text-xs font-medium text-white/90 leading-snug">{currentSpecimen.whereToGrow}</div>
                </div>
              </div>

              {/* Maintenance */}
              <div className="flex items-start space-x-2.5">
                <div className="p-2 rounded-xl bg-white/10 text-white/90 shrink-0">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-white/60 font-semibold uppercase tracking-wider">Maintenance</div>
                  <div className="text-xs font-medium text-white/90 leading-snug">{currentSpecimen.maintenance}</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Bar inside the card */}
        <footer className="px-6 sm:px-10 py-3.5 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500 font-medium">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>AI Botanical Vision System Active · Specimen ID: {currentSpecimen.id}</span>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={onOpenChat} className="hover:text-emerald-700 transition-colors font-semibold">
              Talk to FloraAI
            </button>
            <span>•</span>
            <button onClick={onOpenUpload} className="hover:text-emerald-700 transition-colors font-semibold">
              Upload Custom Plant
            </button>
          </div>
        </footer>

      </div>
    </div>
  );
}
