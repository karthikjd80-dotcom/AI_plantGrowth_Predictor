import React, { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import './FlowingMenu.css';

export interface FlowingMenuItem {
  link?: string;
  text: string;
  image: string;
  onClick?: (e: React.MouseEvent) => void;
}

export interface FlowingMenuProps {
  items?: FlowingMenuItem[];
  speed?: number;
  textColor?: string;
  bgColor?: string;
  marqueeBgColor?: string;
  marqueeTextColor?: string;
  borderColor?: string;
  className?: string;
}

interface MenuItemProps extends FlowingMenuItem {
  speed: number;
  textColor: string;
  marqueeBgColor: string;
  marqueeTextColor: string;
  borderColor: string;
  index: number;
  isTouchDevice: boolean;
}

function MenuItem({
  link = '#',
  text,
  image,
  onClick,
  speed,
  textColor,
  marqueeBgColor,
  marqueeTextColor,
  borderColor,
  index,
  isTouchDevice
}: MenuItemProps) {
  const itemRef = useRef<HTMLDivElement | null>(null);
  const marqueeRef = useRef<HTMLDivElement | null>(null);
  const marqueeInnerRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const [repetitions, setRepetitions] = useState(6);

  const animationDefaults = { duration: 0.5, ease: 'expo.out', force3D: true };

  const distMetric = (x: number, y: number, x2: number, y2: number) => {
    const xDiff = x - x2;
    const yDiff = y - y2;
    return xDiff * xDiff + yDiff * yDiff;
  };

  const findClosestEdge = (mouseX: number, mouseY: number, width: number, height: number) => {
    const topEdgeDist = distMetric(mouseX, mouseY, width / 2, 0);
    const bottomEdgeDist = distMetric(mouseX, mouseY, width / 2, height);
    return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom';
  };

  // Dynamically compute repetitions to guarantee zero gaps across any screen width
  useEffect(() => {
    const calculateRepetitions = () => {
      if (!marqueeInnerRef.current) return;
      const marqueeContent = marqueeInnerRef.current.querySelector<HTMLElement>('.marquee__part');
      if (!marqueeContent) return;

      const contentWidth = marqueeContent.offsetWidth || 280;
      const viewportWidth = window.innerWidth || 390;

      if (contentWidth > 0) {
        const needed = Math.ceil(viewportWidth / contentWidth) + 3;
        setRepetitions(Math.max(6, needed));
      }
    };

    calculateRepetitions();
    window.addEventListener('resize', calculateRepetitions);
    return () => window.removeEventListener('resize', calculateRepetitions);
  }, [text, image]);

  // Infinite horizontal looping marquee animation with alternating directions
  useEffect(() => {
    let retryFrame: number;
    const isReverse = index % 2 === 1;

    let retries = 0;
    const setupMarquee = () => {
      if (!marqueeInnerRef.current) return;

      const marqueeContent = marqueeInnerRef.current.querySelector<HTMLElement>('.marquee__part');
      if (!marqueeContent) return;

      const contentWidth = marqueeContent.offsetWidth || 0;
      if (contentWidth <= 0) {
        if (retries++ < 60) {
          retryFrame = requestAnimationFrame(setupMarquee);
        }
        return;
      }

      if (animationRef.current) {
        animationRef.current.kill();
      }

      // Alternating row directions: even rows stream left, odd rows stream right
      if (isReverse) {
        gsap.set(marqueeInnerRef.current, { x: -contentWidth });
        animationRef.current = gsap.to(marqueeInnerRef.current, {
          x: 0,
          duration: speed,
          ease: 'none',
          repeat: -1,
          force3D: true
        });
      } else {
        gsap.set(marqueeInnerRef.current, { x: 0 });
        animationRef.current = gsap.to(marqueeInnerRef.current, {
          x: -contentWidth,
          duration: speed,
          ease: 'none',
          repeat: -1,
          force3D: true
        });
      }
    };

    const timer = setTimeout(setupMarquee, 50);

    return () => {
      clearTimeout(timer);
      if (retryFrame) cancelAnimationFrame(retryFrame);
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [text, image, repetitions, speed, index]);

  // Set initial position: on touch/mobile, marquee is ALWAYS visible (y: 0%)!
  useEffect(() => {
    if (!marqueeRef.current || !marqueeInnerRef.current) return;
    if (isTouchDevice) {
      gsap.set([marqueeRef.current, marqueeInnerRef.current], { y: '0%' });
    }
  }, [isTouchDevice]);

  // Desktop hover transitions
  const handleMouseEnter = (ev: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice || !itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    const edge = findClosestEdge(x, y, rect.width, rect.height);

    gsap
      .timeline({ defaults: animationDefaults })
      .set(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .set(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0)
      .to([marqueeRef.current, marqueeInnerRef.current], { y: '0%' }, 0);
  };

  const handleMouseLeave = (ev: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice || !itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    const edge = findClosestEdge(x, y, rect.width, rect.height);

    gsap
      .timeline({ defaults: animationDefaults })
      .to(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .to(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      if (link === '#' || !link) {
        e.preventDefault();
      }
      onClick(e);
    } else if (link === '#') {
      e.preventDefault();
    }
  };

  return (
    <div
      className={`menu__item ${isTouchDevice ? 'menu__item--touch' : ''}`}
      ref={itemRef}
      style={{ borderColor }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e as unknown as React.MouseEvent);
        }
      }}
    >
      {/* Desktop static text fallback (hidden on touch/mobile in favor of streaming marquee) */}
      <a
        className="menu__item-link"
        href={link}
        onClick={handleClick}
        style={{ color: textColor }}
      >
        {text}
      </a>

      {/* Infinite Streaming Marquee Banner with Text & Plant Pill Images */}
      <div 
        className="marquee" 
        ref={marqueeRef} 
        style={{ background: marqueeBgColor }}
      >
        <div className="marquee__inner-wrap">
          <div className="marquee__inner" ref={marqueeInnerRef} aria-hidden="true">
            {[...Array(repetitions)].map((_, idx) => (
              <div className="marquee__part" key={idx} style={{ color: marqueeTextColor }}>
                <span>{text}</span>
                <div 
                  className="marquee__img" 
                  style={{ backgroundImage: `url(${image})` }} 
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export const FlowingMenu: React.FC<FlowingMenuProps> = ({
  items = [],
  speed = 14,
  textColor = '#ffffff',
  bgColor = 'linear-gradient(115deg, #051F10 0%, #0A3D20 30%, #0E6034 60%, #168D4C 82%, #22C55E 100%)',
  marqueeBgColor = 'linear-gradient(115deg, #072615 0%, #0D4E2A 40%, #15803D 75%, #22C55E 100%)',
  marqueeTextColor = '#ffffff',
  borderColor = 'rgba(255, 255, 255, 0.22)',
  className = ''
}) => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const detectTouch = () => {
      const hasTouch = 
        typeof window !== 'undefined' && (
          (typeof window.matchMedia === 'function' && window.matchMedia('(hover: none), (pointer: coarse), (max-width: 1024px)')?.matches) ||
          'ontouchstart' in window ||
          (typeof navigator !== 'undefined' && (navigator.maxTouchPoints || 0) > 0)
        );
      setIsTouchDevice(Boolean(hasTouch));
    };

    detectTouch();
    window.addEventListener('resize', detectTouch);
    return () => window.removeEventListener('resize', detectTouch);
  }, []);

  return (
    <div className={`menu-wrap ${className}`} style={{ background: bgColor }}>
      <nav className="menu">
        {items.map((item, idx) => (
          <MenuItem
            key={idx}
            index={idx}
            {...item}
            speed={speed}
            textColor={textColor}
            marqueeBgColor={marqueeBgColor}
            marqueeTextColor={marqueeTextColor}
            borderColor={borderColor}
            isTouchDevice={isTouchDevice}
          />
        ))}
      </nav>
    </div>
  );
};

export default FlowingMenu;
