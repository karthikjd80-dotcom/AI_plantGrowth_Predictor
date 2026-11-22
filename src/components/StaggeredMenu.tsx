'use client';

import React, { useCallback, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import type { User as FbUser } from '../lib/firebase';
import './StaggeredMenu.css';

export interface StaggeredMenuItem {
  label: string;
  ariaLabel?: string;
  link?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export interface StaggeredMenuSocialItem {
  label: string;
  link: string;
  onClick?: (e: React.MouseEvent) => void;
}

export interface StaggeredMenuProps {
  position?: 'left' | 'right';
  colors?: string[];
  items?: StaggeredMenuItem[];
  socialItems?: StaggeredMenuSocialItem[];
  displaySocials?: boolean;
  displayItemNumbering?: boolean;
  className?: string;
  logoUrl?: string;
  menuButtonColor?: string;
  openMenuButtonColor?: string;
  accentColor?: string;
  changeMenuColorOnOpen?: boolean;
  isFixed?: boolean;
  closeOnClickAway?: boolean;
  isOpen?: boolean;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
  hideHeaderToggle?: boolean;
  user?: FbUser | null;
  onOpenAuth?: () => void;
  onSignOut?: () => void;
}

export interface StaggeredMenuHandle {
  toggle: () => void;
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

export const StaggeredMenu = forwardRef<StaggeredMenuHandle, StaggeredMenuProps>(({
  position = 'right',
  colors = ['#09090b', '#18181b', '#27272a', '#f4f4f5'],
  items = [],
  socialItems = [
    { label: 'Plant Care Guide', link: '#care' },
    { label: 'Leaf Doctor AI', link: '#scanner' },
  ],
  displaySocials = true,
  displayItemNumbering = true,
  className,
  accentColor = '#09090b',
  isFixed = true,
  isOpen: controlledIsOpen,
  onMenuOpen,
  onMenuClose,
  user,
}, ref) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledIsOpen !== undefined ? controlledIsOpen : internalOpen;

  const openMenu = useCallback(() => {
    setInternalOpen(true);
    onMenuOpen?.();
  }, [onMenuOpen]);

  const closeMenu = useCallback(() => {
    setInternalOpen(false);
    onMenuClose?.();
  }, [onMenuClose]);

  const toggleMenu = useCallback(() => {
    if (open) {
      closeMenu();
    } else {
      openMenu();
    }
  }, [open, openMenu, closeMenu]);

  useImperativeHandle(
    ref,
    () => ({
      toggle: toggleMenu,
      open: openMenu,
      close: closeMenu,
      isOpen: open,
    }),
    [toggleMenu, openMenu, closeMenu, open]
  );

  // Close on Escape key & lock background scroll when open
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, closeMenu]);

  const underlayColors = (() => {
    const raw = colors && colors.length ? colors.slice(0, 4) : ['#09090b', '#18181b', '#27272a'];
    return raw.slice(0, 2);
  })();

  const drawerNode = (
    <div
      className={(className ? className + ' ' : '') + 'staggered-menu-wrapper' + (isFixed ? ' fixed-wrapper' : '')}
      style={accentColor ? ({ ['--sm-accent']: accentColor } as React.CSSProperties) : undefined}
      data-position={position}
      data-open={open ? 'true' : undefined}
      aria-hidden={!open}
    >
      {/* Semi-transparent dark scrim backdrop for instant tap-to-close */}
      <div
        className="sm-backdrop"
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Botanical staggered underlay accents */}
      <div className="sm-prelayers" aria-hidden="true">
        {underlayColors.map((c, i) => (
          <div
            key={i}
            className="sm-prelayer"
            style={{
              background: c,
              transitionDelay: open ? `${i * 45}ms` : `${(underlayColors.length - i) * 30}ms`,
            }}
          />
        ))}
      </div>

      {/* Main Navigation Drawer Panel */}
      <aside
        id="staggered-menu-panel"
        className="staggered-menu-panel overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
      >
        <button
          onClick={closeMenu}
          className="sm-panel-close-btn cursor-pointer active:scale-95"
          aria-label="Close menu"
          type="button"
        >
          <X className="w-5 h-5 text-zinc-900" />
        </button>

        <div className="sm-panel-inner">
          {/* Minimal Menu Header */}
          <div className="sm-panel-brand">
            <span className="font-bold text-zinc-950 text-base tracking-tight">
              Navigation
            </span>
          </div>

          {/* Navigation Items List */}
          <ul className="sm-panel-list" role="list" data-numbering={displayItemNumbering || undefined}>
            {items && items.length > 0 ? (
              items.map((it, idx) => (
                <li
                  className="sm-panel-itemWrap"
                  key={it.label + idx}
                  style={{ transitionDelay: open ? `${70 + idx * 30}ms` : '0ms' }}
                >
                  <button
                    type="button"
                    className="sm-panel-item w-full text-left"
                    aria-label={it.ariaLabel || it.label}
                    data-index={idx + 1}
                    onClick={(e) => {
                      if (it.onClick) {
                        it.onClick(e);
                      }
                      closeMenu();
                    }}
                  >
                    <span className="sm-panel-itemLabel">{it.label}</span>
                  </button>
                </li>
              ))
            ) : (
              <li className="sm-panel-itemWrap" aria-hidden="true">
                <span className="sm-panel-item">
                  <span className="sm-panel-itemLabel">No items</span>
                </span>
              </li>
            )}
          </ul>

          {/* User Account Badge */}
          {user && (
            <div className="p-3 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-between text-xs my-1">
              <span className="font-semibold text-zinc-900 truncate">
                {user.displayName || user.email?.split('@')[0] || 'User'}
              </span>
              <span className="text-[11px] font-medium text-zinc-500 shrink-0">
                Synced
              </span>
            </div>
          )}

          {/* Quick Module Links */}
          {displaySocials && socialItems && socialItems.length > 0 && (
            <div className="sm-socials" aria-label="Quick module links">
              <h3 className="sm-socials-title">Explore Modules</h3>
              <ul className="sm-socials-list" role="list">
                {socialItems.map((s, i) => (
                  <li key={s.label + i} className="sm-socials-item">
                    <button
                      type="button"
                      onClick={(e) => {
                        if (s.onClick) {
                          s.onClick(e);
                        }
                        closeMenu();
                      }}
                      className="sm-socials-link cursor-pointer"
                    >
                      {s.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </aside>
    </div>
  );

  if (typeof document !== 'undefined') {
    return createPortal(drawerNode, document.body);
  }
  return drawerNode;
});

StaggeredMenu.displayName = 'StaggeredMenu';

export default StaggeredMenu;
