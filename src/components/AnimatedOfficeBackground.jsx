import React, { useState, useEffect, useRef } from 'react';

/**
 * AnimatedOfficeBackground
 * A high-performance, scroll-reactive animated office interface background.
 * Provides subtle parallax depth, ambient tech illumination, and architectural grid accents.
 */
export default function AnimatedOfficeBackground({ theme }) {
  const isDark = theme === 'dark';
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!tickingRef.current) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY || window.pageYOffset || 0;
          const maxScroll = Math.max(
            document.documentElement.scrollHeight - window.innerHeight,
            1
          );
          setScrollY(currentY);
          setScrollProgress(Math.min(Math.max(currentY / maxScroll, 0), 1));
          tickingRef.current = false;
        });
        tickingRef.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Parallax offsets based on scroll
  const bgTranslateY = -scrollY * 0.12; // slow parallax shift
  const gridTranslateY = -scrollY * 0.05; // foreground grid drift
  const orbTranslateY = scrollY * 0.08; // dynamic lighting movement

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Ambient HUD & Telemetry Background System */}

      {/* =========================================================================
          LAYER 2: Ambient Architectural Interface Grid (Scroll-Responsive)
          ========================================================================= */}
      <div 
        className="absolute inset-0 w-full h-full will-change-transform"
        style={{
          transform: `translate3d(0, ${gridTranslateY}px, 0)`
        }}
      >
        <div 
          className={`w-full h-full bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:40px_40px] ${
            isDark ? 'opacity-[0.04]' : 'opacity-[0.03] bg-[radial-gradient(#2563eb_1px,transparent_1px)]'
          }`}
        />
        {/* Subtle horizontal perspective scan lines */}
        <div 
          className={`absolute inset-0 bg-[linear-gradient(to_bottom,transparent_49%,rgba(212,175,55,0.03)_50%,transparent_51%)] [background-size:100%_80px] ${
            isDark ? 'opacity-40' : 'opacity-20 bg-[linear-gradient(to_bottom,transparent_49%,rgba(37,99,235,0.03)_50%,transparent_51%)]'
          }`}
        />
      </div>

      {/* =========================================================================
          LAYER 3: Dynamic Tech Lighting Flares (Parallax Shift & Pulse)
          ========================================================================= */}
      {/* Top Right Orb */}
      <div 
        className={`absolute -top-32 right-[-5%] w-[600px] h-[600px] rounded-full blur-[140px] will-change-transform transition-transform duration-300 ${
          isDark 
            ? 'bg-gradient-to-br from-amber-500/15 via-yellow-600/10 to-transparent' 
            : 'bg-gradient-to-br from-blue-500/15 via-indigo-400/10 to-transparent'
        }`}
        style={{
          transform: `translate3d(${scrollProgress * -40}px, ${orbTranslateY * 0.5}px, 0)`
        }}
      />

      {/* Mid Left Ambient Orb */}
      <div 
        className={`absolute top-1/2 -left-40 w-[550px] h-[550px] rounded-full blur-[150px] will-change-transform transition-transform duration-300 ${
          isDark 
            ? 'bg-gradient-to-tr from-amber-600/10 via-amber-400/5 to-transparent' 
            : 'bg-gradient-to-tr from-blue-600/10 via-sky-400/8 to-transparent'
        }`}
        style={{
          transform: `translate3d(${scrollProgress * 60}px, ${-orbTranslateY * 0.4}px, 0)`
        }}
      />

      {/* Lower Right Tech Flare */}
      <div 
        className={`absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] rounded-full blur-[130px] will-change-transform ${
          isDark 
            ? 'bg-amber-500/10' 
            : 'bg-indigo-500/10'
        }`}
        style={{
          transform: `translate3d(0, ${-scrollY * 0.05}px, 0)`
        }}
      />

      {/* =========================================================================
          LAYER 4: High-Tech Corporate Office Interface HUD Accents
          ========================================================================= */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10 pointer-events-none opacity-40">
        {/* Top telemetry indicators */}
        <div className="flex justify-between items-center text-[9px] font-mono tracking-widest uppercase">
          <div className="flex items-center gap-2">
            <span className={`inline-block w-1.5 h-1.5 rounded-full animate-ping ${isDark ? 'bg-amber-400' : 'bg-blue-600'}`} />
            <span className={isDark ? 'text-amber-400/60' : 'text-blue-600/60'}>
              AURA DIGITAL LABS // SYS.ONLINE
            </span>
          </div>
          <div className={`hidden md:flex items-center gap-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            <span>LAT: 13.0827° N</span>
            <span>ELEV: 24m</span>
            <span>SCROLL: {Math.round(scrollProgress * 100)}%</span>
          </div>
        </div>

        {/* Minimal Corner Crosshair Brackets */}
        <div className="flex justify-between items-end text-[9px] font-mono tracking-widest uppercase">
          <div className={`hidden lg:block ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
            [TECH INFRASTRUCTURE &bull; AI SYSTEMS]
          </div>
          <div className={`flex items-center gap-2 ${isDark ? 'text-amber-400/50' : 'text-blue-600/50'}`}>
            <span>AURA WORKSPACE INTERFACE</span>
            <span className={`inline-block w-2 h-0.5 ${isDark ? 'bg-amber-400/60' : 'bg-blue-600/60'}`} />
          </div>
        </div>
      </div>

      {/* Soft Ambient Contrast Layer */}
      <div 
        className={`absolute inset-0 ${
          isDark 
            ? 'bg-[#030305]/20' 
            : 'bg-[#f8fafc]/20'
        }`}
      />
    </div>
  );
}
