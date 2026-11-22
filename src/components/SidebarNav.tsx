import React from 'react';
import {
  Leaf,
  Home,
  Sprout,
  TrendingUp,
  ShieldAlert,
  BookOpen,
  ArrowRight,
  Bot,
} from 'lucide-react';
import sidebarFoliageBg from '../assets/images/sidebar_foliage_bg_1794577803731.jpg';
import type { AppNavTab } from './GlobalNavbar';

interface SidebarNavProps {
  activeTab: AppNavTab;
  onTabChange: (tab: AppNavTab) => void;
  onOpenChat: () => void;
  onOpenSuggestions?: () => void;
}

const SIDEBAR_ITEMS: { tab: AppNavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { tab: 'Home', label: 'Home', icon: Home },
  { tab: 'My Plants', label: 'My Plants', icon: Sprout },
  { tab: 'Growth Prediction', label: 'Growth Prediction', icon: TrendingUp },
  { tab: 'Disease Detection', label: 'Disease Detection', icon: ShieldAlert },
];

export function SidebarNav({
  activeTab,
  onTabChange,
  onOpenChat,
  onOpenSuggestions,
}: SidebarNavProps) {
  return (
    <aside
      className="hidden lg:flex flex-col justify-between w-[240px] xl:w-[252px] shrink-0 sticky top-0 h-screen overflow-hidden select-none border-r border-emerald-950/30 z-30"
      style={{
        background: 'linear-gradient(180deg, #0b2410 0%, #103216 55%, #0c2611 100%)',
      }}
      aria-label="Primary Botanical Sidebar"
    >
      {/* Sunlit botanical foliage background layer fading cleanly into deep forest top */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img
          src={sidebarFoliageBg}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-bottom opacity-45 mix-blend-lighten"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(10, 32, 14, 0.96) 0%, rgba(12, 38, 17, 0.86) 48%, rgba(10, 30, 14, 0.55) 100%)',
          }}
        />
      </div>

      {/* Top Brand + Navigation */}
      <div className="relative z-10 px-4 pt-6 space-y-7">
        {/* Brand Lockup */}
        <button
          type="button"
          onClick={() => onTabChange('Home')}
          className="flex items-center gap-2.5 px-2 w-full text-left cursor-pointer group focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-lime-400 via-emerald-500 to-green-600 flex items-center justify-center text-[#071c0a] shadow-[0_6px_18px_rgba(74,222,128,0.35)] shrink-0 group-hover:scale-105 transition-transform">
            <Leaf className="w-5 h-5 fill-current" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[17px] font-extrabold tracking-tight text-white leading-tight truncate">
              PlantGrowth <span className="text-lime-300">AI</span>
            </span>
          </div>
        </button>

        {/* Nav Links */}
        <nav className="space-y-1.5" aria-label="Dashboard Navigation">
          {SIDEBAR_ITEMS.map(({ tab, label, icon: Icon }) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => onTabChange(tab)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13.5px] font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-lime-400/28 via-emerald-500/22 to-emerald-400/10 text-white border border-lime-300/35 shadow-[0_8px_22px_-6px_rgba(132,204,22,0.4)] backdrop-blur-md'
                    : 'text-emerald-100/75 hover:text-white hover:bg-white/8 border border-transparent'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-lime-300' : 'text-emerald-200/75'
                  }`}
                />
                <span className="truncate">{label}</span>
              </button>
            );
          })}

          {onOpenSuggestions && (
            <>
              <div className="my-3 border-t border-white/10" />
              <button
                type="button"
                onClick={onOpenSuggestions}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13.5px] font-semibold text-emerald-100/75 hover:text-white hover:bg-white/8 border border-transparent transition-all duration-200 cursor-pointer whitespace-nowrap"
              >
                <BookOpen className="w-4 h-4 shrink-0 text-emerald-200/75" />
                <span className="truncate">Plant Library</span>
              </button>
            </>
          )}
        </nav>
      </div>

      {/* Bottom Glowing AI Assistant Glass Card */}
      <div className="relative z-10 p-4">
        <div
          className="rounded-2xl p-4 text-center border border-lime-300/25 shadow-[0_18px_36px_-10px_rgba(0,0,0,0.55)] backdrop-blur-xl relative overflow-hidden"
          style={{
            background:
              'linear-gradient(155deg, rgba(22, 68, 28, 0.72) 0%, rgba(11, 36, 15, 0.85) 100%)',
          }}
        >
          <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-lime-300/50 to-transparent pointer-events-none" />

          <div className="w-11 h-11 mx-auto mb-2.5 rounded-xl bg-gradient-to-br from-lime-400/30 to-emerald-500/25 border border-lime-300/45 flex items-center justify-center text-lime-200 shadow-[0_0_22px_rgba(132,204,22,0.35)]">
            <Bot className="w-5 h-5" />
          </div>

          <h4 className="text-sm font-bold text-white leading-snug">
            AI Assistant
          </h4>
          <p className="text-[11px] text-emerald-100/75 mt-0.5 mb-3">
            for Plant Care
          </p>

          <button
            type="button"
            onClick={onOpenChat}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-lime-100 to-emerald-50 hover:from-white hover:to-lime-100 text-[#0f3613] text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 whitespace-nowrap"
          >
            <span>Ask FloraAI</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default SidebarNav;
