import React, { useState } from 'react';
import { 
  Leaf, 
  Search, 
  ShoppingBag, 
  ArrowRight, 
  Heart, 
  Truck, 
  Sparkles, 
  Camera, 
  Bot, 
  Check, 
  X,
  Compass
} from 'lucide-react';
import { SwipeToStart } from './SwipeToStart';

import heroTrioImg from '../assets/images/leafora_hero_trio_1791059766466.jpg';
import lowMaintImg from '../assets/images/low_maint_plant_1791059781716.jpg';
import stylishPotImg from '../assets/images/stylish_pot_1791059795309.jpg';
import cornerFoliageImg from '../assets/images/corner_foliage_1791059807849.jpg';

interface LeaforaLandingProps {
  onStartApp: () => void;
  onOpenCamera: () => void;
  onOpenUpload: () => void;
  onOpenChat: () => void;
}

export function LeaforaLanding({
  onStartApp,
  onOpenCamera,
  onOpenUpload,
  onOpenChat,
}: LeaforaLandingProps) {
  const [activeNav, setActiveNav] = useState<'Home' | 'Shop' | 'About' | 'Care Guide' | 'Contact'>('Home');
  const [showSwipeDrawer, setShowSwipeDrawer] = useState(false);

  return (
    <div className="relative min-h-screen w-full bg-[#f2f4ec] text-slate-800 flex items-center justify-center p-2 sm:p-5 md:p-8 font-sans overflow-x-hidden selection:bg-emerald-200">
      
      {/* Organic background ambient leaf shapes */}
      <div className="fixed -top-28 -left-28 w-[420px] h-[420px] bg-[#dbe8d5] rounded-full blur-[90px] pointer-events-none" />
      <div className="fixed -bottom-24 -right-24 w-[460px] h-[460px] bg-[#d3e5cb] rounded-full blur-[100px] pointer-events-none" />

      {/* Main Leafora Viewport Container (Identical to reference mockup) */}
      <div className="relative z-10 w-full max-w-[1280px] bg-[#faf9f4] rounded-[28px] sm:rounded-[40px] md:rounded-[50px] shadow-[0_25px_70px_-15px_rgba(40,55,30,0.18)] border border-[#e4e7d8] overflow-hidden flex flex-col transition-all">
        
        {/* Top Navigation Bar */}
        <header className="px-6 sm:px-10 lg:px-12 py-5 sm:py-6 flex items-center justify-between border-b border-black/[0.04] bg-[#faf9f4]/95 backdrop-blur-md">
          
          {/* Logo & Tagline */}
          <div className="flex items-center space-x-3 cursor-pointer select-none" onClick={onStartApp}>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1e3422] flex items-center justify-center text-white shadow-xs">
              <Leaf className="w-5 h-5 text-emerald-300 fill-emerald-300 -rotate-12" />
            </div>
            <div>
              <span className="font-['Playfair_Display'] font-extrabold text-2xl sm:text-[28px] text-[#1e3422] tracking-tight block leading-none">
                Leafora
              </span>
              <span className="text-[7.5px] sm:text-[8.5px] font-bold text-[#456149] tracking-[0.25em] block uppercase mt-0.5">
                PLANTS FOR A BRIGHTER YOU
              </span>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-xs sm:text-sm font-semibold text-slate-600">
            {(['Home', 'Shop', 'About', 'Care Guide', 'Contact'] as const).map((item) => (
              <button
                key={item}
                onClick={() => {
                  setActiveNav(item);
                  if (item === 'Shop' || item === 'Care Guide') {
                    onStartApp();
                  }
                }}
                className={`relative py-1 transition-colors ${
                  activeNav === item 
                    ? 'text-[#1e3422] font-bold' 
                    : 'hover:text-[#1e3422]'
                }`}
              >
                <span>{item}</span>
                {activeNav === item && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#1e3422] rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Right Action Icons & Shop Now Button */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            {/* Search */}
            <button 
              onClick={onStartApp}
              className="p-2 sm:p-2.5 rounded-full hover:bg-black/5 text-[#1e3422] transition-colors"
              title="Search Plants"
              aria-label="Search"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Live Camera Scanner */}
            <button 
              onClick={onOpenCamera}
              className="p-2 sm:p-2.5 rounded-full hover:bg-[#1e3422]/10 text-[#1e3422] transition-colors"
              title="Open Live Camera Scanner"
              aria-label="Camera Scanner"
            >
              <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Shopping Bag with Badge */}
            <button 
              onClick={onStartApp}
              className="relative p-2 sm:p-2.5 rounded-full hover:bg-black/5 text-[#1e3422] transition-colors"
              title="Cart / Plant Bag"
              aria-label="Bag"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#1e3422] text-white text-[9px] font-bold flex items-center justify-center">
                2
              </span>
            </button>

            {/* Shop Now / Launch Button */}
            <button 
              onClick={onStartApp}
              className="hidden sm:flex items-center space-x-2 px-5 py-2.5 bg-[#1e3422] hover:bg-[#2b4830] text-white text-xs sm:text-sm font-semibold rounded-full transition-all shadow-sm active:scale-95 ml-1"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Hero Section Grid: Left Copy | Center Plant Pedestals | Right Feature Cards */}
        <div className="px-6 sm:px-10 lg:px-12 py-8 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
          
          {/* LEFT COLUMN: Main Typography & Call To Action */}
          <div className="lg:col-span-4 flex flex-col justify-center z-20">
            {/* Eyebrow Kicker */}
            <div className="text-[11px] sm:text-xs font-bold tracking-[0.2em] text-[#556e54] uppercase mb-4 sm:mb-5">
              INDOOR PLANTS • HOME DECOR • BETTER LIVING
            </div>

            {/* Massive Serif Headline */}
            <h1 className="font-['Playfair_Display'] font-bold text-4xl sm:text-5xl md:text-6xl lg:text-[66px] leading-[1.08] text-[#1b3320] tracking-tight mb-5">
              Greener<br />
              Spaces<br />
              Happier You
            </h1>

            {/* Subtitle Paragraph */}
            <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed max-w-sm mb-7">
              Bring nature home with our handpicked indoor plants, beautiful pots and easy care essentials — because a little green goes a long way.
            </p>

            {/* CTA Buttons & Interactive Swipe Option */}
            <div className="flex flex-col space-y-3 max-w-sm">
              <div className="flex items-center space-x-3">
                <button
                  onClick={onStartApp}
                  className="px-7 py-3.5 bg-[#1e3422] hover:bg-[#2c4731] text-white text-xs sm:text-sm font-bold rounded-full transition-all shadow-md active:scale-95 flex items-center space-x-2 group"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={onOpenCamera}
                  className="p-3.5 bg-[#dbe8d5] hover:bg-[#d0dfca] text-[#1e3422] rounded-full transition-all border border-[#c1d6b8] shadow-xs active:scale-95"
                  title="Scan Plant with Camera"
                >
                  <Camera className="w-4 h-4" />
                </button>

                <button
                  onClick={onOpenChat}
                  className="p-3.5 bg-white hover:bg-slate-100 text-[#1e3422] rounded-full transition-all border border-slate-200 shadow-xs active:scale-95"
                  title="Ask FloraAI"
                >
                  <Bot className="w-4 h-4" />
                </button>
              </div>

              {/* Swipe to Get Started Toggle / Rail */}
              <div className="pt-2">
                <SwipeToStart
                  onComplete={onStartApp}
                  text="Swipe to Get Started"
                  className="bg-[#1e3422]/90 border border-black/10 shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* CENTER COLUMN: Hero Plant Trio on Pedestals with Sage Arch Backdrop */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[380px] sm:min-h-[440px]">
            
            {/* Soft Sage Background Arch */}
            <div className="absolute inset-x-8 top-4 bottom-2 bg-[#cad9c5] rounded-t-full rounded-b-3xl -z-10 opacity-70" />

            {/* Handwritten script annotation in top right */}
            <div className="absolute top-2 right-4 sm:right-6 text-right z-20 pointer-events-none select-none">
              <div className="font-['Playfair_Display'] italic text-sm sm:text-base text-[#2c4430] leading-tight font-semibold">
                Good<br />
                Vibes<br />
                Grow Here ♡
              </div>
              <svg className="w-6 h-6 ml-auto mt-0.5 text-[#2c4430]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>

            {/* Hero Plant Trio Image (Monstera, Pothos, Snake Plant on Pedestals) */}
            <div 
              onClick={onStartApp}
              className="relative w-full max-w-[430px] rounded-3xl overflow-hidden cursor-pointer group transition-transform duration-500 hover:scale-[1.02]"
            >
              <img 
                src={heroTrioImg} 
                alt="Indoor Houseplants on pedestals: Monstera, Pothos, and Snake plant" 
                className="w-full h-auto object-cover rounded-2xl drop-shadow-xl"
              />
              
              {/* Subtle hover overlay */}
              <div className="absolute inset-0 bg-[#1e3422]/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-end p-4">
                <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[11px] font-bold text-[#1e3422] shadow-sm flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Click to predict growth curve</span>
                </span>
              </div>
            </div>

            {/* Floating leaf accents */}
            <div className="absolute -top-4 left-10 w-6 h-6 text-emerald-600/70 rotate-45 pointer-events-none">
              <Leaf className="w-full h-full fill-emerald-600/20" />
            </div>
            <div className="absolute bottom-6 right-6 w-5 h-5 text-emerald-700/60 -rotate-12 pointer-events-none">
              <Leaf className="w-full h-full fill-emerald-700/20" />
            </div>
          </div>

          {/* RIGHT COLUMN: Two Stacked Feature Cards */}
          <div className="lg:col-span-3 flex flex-col space-y-4 sm:space-y-5 justify-center z-20">
            
            {/* Top Card: Low Maintenance Plants (Sage Green Card) */}
            <div 
              onClick={onStartApp}
              className="p-5 sm:p-6 rounded-[24px] sm:rounded-[28px] bg-[#d7e5d2] hover:bg-[#cee0c8] transition-all cursor-pointer flex items-center justify-between group shadow-xs border border-[#c6d7bf]"
            >
              <div className="flex-1 pr-3">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                  Low<br />Maintenance<br />Plants
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-600 mt-1">
                  Perfect for<br />busy lives.
                </p>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#415e3c] text-white flex items-center justify-center mt-3 group-hover:scale-110 transition-transform shadow-xs">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Plant thumbnail */}
              <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-2xl overflow-hidden shrink-0 bg-white/40 p-1">
                <img 
                  src={lowMaintImg} 
                  alt="Low Maintenance Plant" 
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>

            {/* Bottom Card: Stylish Plant Pots (Lavender Card) */}
            <div 
              onClick={onStartApp}
              className="p-5 sm:p-6 rounded-[24px] sm:rounded-[28px] bg-[#e7dfed] hover:bg-[#dfd4e6] transition-all cursor-pointer flex items-center justify-between group shadow-xs border border-[#d6cbdc]"
            >
              <div className="flex-1 pr-3">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                  Stylish<br />Plant Pots
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-600 mt-1">
                  Modern designs<br />for every space.
                </p>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#6a567c] text-white flex items-center justify-center mt-3 group-hover:scale-110 transition-transform shadow-xs">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Ceramic Pot thumbnail */}
              <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-2xl overflow-hidden shrink-0 bg-white/40 p-1">
                <img 
                  src={stylishPotImg} 
                  alt="Stylish ceramic pot" 
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Feature Badges Bar & Foliage Corner Accent */}
        <footer className="px-6 sm:px-10 lg:px-12 py-5 sm:py-6 border-t border-black/[0.04] bg-[#faf9f4] relative flex flex-wrap items-center justify-between gap-4">
          
          {/* 4 Feature Items */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 flex-1 max-w-3xl">
            {/* Fresh & Healthy */}
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-[#e8efe5] text-[#2c4731] flex items-center justify-center shrink-0">
                <Leaf className="w-4 h-4 fill-[#2c4731]/20" />
              </div>
              <span className="text-xs font-semibold text-slate-800 leading-tight">
                Fresh &amp;<br />Healthy Plants
              </span>
            </div>

            {/* Easy Care Guide */}
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-[#e8efe5] text-[#2c4731] flex items-center justify-center shrink-0">
                <Heart className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-800 leading-tight">
                Easy Care<br />Guide
              </span>
            </div>

            {/* Fast & Safe Delivery */}
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-[#e8efe5] text-[#2c4731] flex items-center justify-center shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-800 leading-tight">
                Fast &amp; Safe<br />Delivery
              </span>
            </div>

            {/* Sustainable Choices */}
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-[#e8efe5] text-[#2c4731] flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-800 leading-tight">
                Sustainable<br />Choices
              </span>
            </div>
          </div>

          {/* Bottom Right Corner Accent: Organic bubble with "Plants make life better ♡" + Foliage */}
          <div className="relative flex items-center justify-end ml-auto">
            {/* Organic sage green leaf tab badge */}
            <div className="bg-[#d4e4ce] text-[#243f29] px-5 py-3 rounded-full sm:rounded-l-full sm:rounded-r-2xl text-xs sm:text-sm font-['Playfair_Display'] italic font-bold shadow-xs select-none flex items-center space-x-1 z-10">
              <span>Plants make life better ♡</span>
            </div>

            {/* Real leaf foliage peeking out */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 -mr-4 -mb-2 overflow-hidden pointer-events-none opacity-90 hidden sm:block">
              <img 
                src={cornerFoliageImg} 
                alt="Corner botanical leaf" 
                className="w-full h-full object-contain -rotate-12 scale-125" 
              />
            </div>
          </div>

        </footer>

      </div>
    </div>
  );
}
