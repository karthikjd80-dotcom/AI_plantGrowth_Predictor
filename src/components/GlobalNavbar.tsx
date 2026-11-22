import React, { useState, useCallback, useMemo, memo } from 'react';
import { Menu, X, Plus, ArrowLeft, Clock } from 'lucide-react';
import GooeyNav from './GooeyNav';
import StaggeredMenu from './StaggeredMenu';

export type AppNavTab =
  | 'Home'
  | 'My Plants'
  | 'Growth Prediction'
  | 'Disease Detection'
  | 'Dashboard'
  | 'Transactions';

interface GlobalNavbarProps {
  activeTab: AppNavTab;
  onTabChange: (tab: AppNavTab) => void;
  canGoBack?: boolean;
  onBack?: () => void;
  onOpenCamera?: () => void;
  onTryDemo?: () => void;
  onOpenChat?: () => void;
}

const NAV_TABS: { name: AppNavTab; label: string }[] = [
  { name: 'Home', label: 'Home' },
  { name: 'Growth Prediction', label: 'Growth Prediction' },
  { name: 'Disease Detection', label: 'Disease Detection' },
];

const GOOEY_COLORS = ['#09090b', '#27272a', '#52525b', '#a1a1aa'];
const MENU_COLORS = ['#09090b', '#27272a'];

export const GlobalNavbar = memo(function GlobalNavbar({
  activeTab,
  onTabChange,
  canGoBack = false,
  onBack,
  onOpenCamera,
  onTryDemo,
  onOpenChat,
}: GlobalNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMenuOpen = useCallback(() => setIsMobileMenuOpen(true), []);
  const handleMenuClose = useCallback(() => setIsMobileMenuOpen(false), []);

  const currentActiveIndex = Math.max(
    0,
    NAV_TABS.findIndex((t) => t.name === activeTab)
  );

  const gooeyItems = useMemo(
    () =>
      NAV_TABS.map((tab) => ({
        label: tab.label,
        onClick: () => onTabChange(tab.name),
      })),
    [onTabChange]
  );

  const handleGooeyChange = useCallback(
    (index: number) => {
      if (NAV_TABS[index]) {
        onTabChange(NAV_TABS[index].name);
      }
    },
    [onTabChange]
  );

  const drawerItems = useMemo(
    () => [
      ...NAV_TABS.map((tab) => ({
        label: tab.label,
        ariaLabel: `Navigate to ${tab.label}`,
        onClick: () => {
          onTabChange(tab.name);
          setIsMobileMenuOpen(false);
        },
      })),
      ...(onOpenChat
        ? [
            {
              label: 'FloraAI Assistant',
              ariaLabel: 'Open FloraAI Plant Assistant',
              onClick: () => {
                onOpenChat();
                setIsMobileMenuOpen(false);
              },
            },
          ]
        : []),
    ],
    [onTabChange, onOpenChat]
  );

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#fafafa]/85 backdrop-blur-md border-b border-zinc-200/80 transition-colors pointer-events-auto">
        <div className="max-w-[1440px] mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* 1. Left: Clean Top Menu + Circular Back Icon Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              data-mobile-menu-toggle="true"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="rgb-pink-glow relative z-50 rounded-full border border-zinc-200 cursor-pointer shrink-0 focus:outline-none"
              title={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              aria-label={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={isMobileMenuOpen}
            >
              <span className="rgb-pink-glow-surface inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-white text-zinc-900 text-xs font-semibold">
                {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                <span>{isMobileMenuOpen ? 'Close' : 'Menu'}</span>
              </span>
            </button>

            {onBack && (
              <button
                type="button"
                data-top-back-btn="true"
                onClick={onBack}
                className="rgb-pink-glow rounded-full border border-zinc-200 cursor-pointer shrink-0 focus:outline-none"
                title="Go Back"
                aria-label="Go Back"
              >
                <span
                  className={`rgb-pink-glow-surface inline-flex items-center justify-center w-9 h-9 rounded-full bg-white transition-colors ${
                    canGoBack ? 'text-zinc-950' : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4 stroke-[2]" />
                </span>
              </button>
            )}
          </div>

          {/* 2. Center: Monochrome Navigation Pill */}
          <div className="hidden md:flex items-center justify-center shrink-0">
            <GooeyNav
              items={gooeyItems}
              activeIndex={currentActiveIndex >= 0 ? currentActiveIndex : 0}
              onChange={handleGooeyChange}
              theme="light"
              color="#09090b"
              activeTextColor="#ffffff"
              colors={GOOEY_COLORS}
              size="sm"
              frame={true}
            />
          </div>

          {/* 3. Right: My Plants History Clock Button + Primary Action */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              data-top-history-btn="true"
              data-rgb-lit={activeTab === 'My Plants' ? 'true' : undefined}
              onClick={() => onTabChange('My Plants')}
              className={`${
                activeTab === 'My Plants'
                  ? 'rgb-pink-glow-dark'
                  : 'rgb-pink-glow border border-zinc-200'
              } rounded-full cursor-pointer shrink-0 focus:outline-none`}
              title="My Plants History"
              aria-label="My Plants History"
              aria-current={activeTab === 'My Plants' ? 'page' : undefined}
            >
              <span
                className={`rgb-pink-glow-surface inline-flex items-center justify-center w-9 h-9 rounded-full transition-colors ${
                  activeTab === 'My Plants'
                    ? 'bg-zinc-950 text-white'
                    : 'bg-white text-zinc-900 hover:text-zinc-950'
                }`}
              >
                <Clock className="w-4 h-4 stroke-[2]" />
              </span>
            </button>

            {(onOpenCamera || onTryDemo) && (
              <button
                type="button"
                onClick={() => (onOpenCamera ? onOpenCamera() : onTryDemo?.())}
                className="rgb-pink-glow-dark rounded-full cursor-pointer whitespace-nowrap shrink-0 focus:outline-none"
              >
                <span className="rgb-pink-glow-surface inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full bg-zinc-950 text-white text-xs font-semibold">
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span className="hidden sm:inline">Add Plant</span>
                  <span className="sm:hidden">Scan</span>
                </span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Monochrome Slide-Out Navigation Drawer */}
      <StaggeredMenu
        isOpen={isMobileMenuOpen}
        onMenuOpen={handleMenuOpen}
        onMenuClose={handleMenuClose}
        hideHeaderToggle={true}
        position="left"
        colors={MENU_COLORS}
        accentColor="#09090b"
        displaySocials={false}
        displayItemNumbering={true}
        items={drawerItems}
      />
    </>
  );
});

export default GlobalNavbar;
