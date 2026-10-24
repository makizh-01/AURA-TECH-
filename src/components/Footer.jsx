import React from 'react';
import { Database, ArrowUp, Mail } from 'lucide-react';

export default function Footer({ theme, portalMode, onOpenAboutModal, onOpenBookModal, onOpenAdminModal, onOpenJobModal }) {
  const isDark = theme === 'dark';
  const isHr = portalMode === 'hr';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={`py-12 border-t transition-colors ${
      isDark ? 'bg-black/90 backdrop-blur-md border-amber-500/15 text-slate-400' : 'bg-slate-900/90 backdrop-blur-md border-slate-800 text-slate-400'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-12 border-b border-slate-800/80">
          
          {/* Logo & Tagline */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-3">
            <div className="logo-badge bg-white p-2 rounded-xl shadow-md border border-slate-200 cursor-pointer" onClick={scrollToTop}>
              <img src="/logo.png" alt="AURA TECH Logo" className="h-10 w-auto object-contain" />
            </div>
            <div>
              <div className="text-lg font-black text-white uppercase tracking-tight">
                AURA <span className={isDark ? 'text-amber-400' : 'text-blue-500'}>TECH</span>
              </div>
              <p className="text-xs text-slate-400 tracking-wider uppercase font-medium mt-0.5">
                A Reliable Backbone of Your Business
              </p>
              <div className="mt-2.5 flex items-center gap-2">
                <a 
                  href="mailto:auratech008@gmail.com" 
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-extrabold lowercase tracking-normal transition-all shadow-sm ${
                    isDark 
                      ? 'bg-slate-900 border-amber-500/30 text-amber-400 hover:bg-slate-800' 
                      : 'bg-slate-800 border-slate-700 text-blue-400 hover:bg-slate-700'
                  }`}
                  title="Official Company Email"
                >
                  <Mail size={14} className="shrink-0" />
                  <span>auratech008@gmail.com</span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-6 text-xs font-extrabold uppercase tracking-widest text-slate-300">
            {isHr ? (
              <>
                <button onClick={onOpenAboutModal} className={`transition-colors cursor-pointer ${isDark ? 'hover:text-amber-400' : 'hover:text-blue-400'}`}>About Us</button>
                <a href="#hr-portal" className={`transition-colors text-emerald-400 hover:text-emerald-300`}>Open Positions</a>
                <a href="#faq" className={`transition-colors ${isDark ? 'hover:text-amber-400' : 'hover:text-blue-400'}`}>FAQ</a>
                <a href="#contact" className={`transition-colors ${isDark ? 'hover:text-amber-400' : 'hover:text-blue-400'}`}>Contact</a>
                {onOpenJobModal && (
                  <button onClick={() => onOpenJobModal()} className={`transition-colors cursor-pointer font-black ${isDark ? 'text-amber-400 hover:text-amber-300' : 'text-blue-400 hover:text-blue-300'}`}>
                    Apply Now
                  </button>
                )}
              </>
            ) : (
              <>
                <button onClick={onOpenAboutModal} className={`transition-colors cursor-pointer ${isDark ? 'hover:text-amber-400' : 'hover:text-blue-400'}`}>About Us</button>
                <a href="#services" className={`transition-colors ${isDark ? 'hover:text-amber-400' : 'hover:text-blue-400'}`}>Services</a>
                <a href="#showcase" className={`transition-colors ${isDark ? 'hover:text-amber-400' : 'hover:text-blue-400'}`}>Showcase</a>
                <a href="#hr-portal" className={`transition-colors text-emerald-400 hover:text-emerald-300 flex items-center gap-1`}>Careers / HR</a>
                <a href="#advantages" className={`transition-colors ${isDark ? 'hover:text-amber-400' : 'hover:text-blue-400'}`}>Why Us</a>
                <a href="#faq" className={`transition-colors ${isDark ? 'hover:text-amber-400' : 'hover:text-blue-400'}`}>FAQ</a>
                {onOpenJobModal && (
                  <button onClick={() => onOpenJobModal()} className={`transition-colors cursor-pointer ${isDark ? 'text-amber-400 hover:text-amber-300' : 'text-blue-400 hover:text-blue-300'}`}>
                    Apply For Job
                  </button>
                )}
                <button onClick={onOpenBookModal} className={`transition-colors cursor-pointer ${isDark ? 'text-amber-400 hover:text-amber-300' : 'text-blue-400 hover:text-blue-300'}`}>Book Project</button>
              </>
            )}
          </div>

          {/* Top Button & Admin Sheet Trigger */}
          <div className="flex items-center gap-3">
            {!isHr && (
              <button
                onClick={onOpenAdminModal}
                title="Admin Submissions MasterSheet"
                className={`p-2.5 rounded-xl border transition-colors text-xs font-bold flex items-center gap-1.5 ${
                  isDark ? 'bg-slate-900 text-slate-400 hover:text-amber-400 border-amber-500/20' : 'bg-slate-800 text-slate-300 hover:text-blue-400 border-slate-700'
                }`}
              >
                <Database size={14} />
                <span className="hidden sm:inline">Sync Sheet</span>
              </button>
            )}

            <button
              onClick={scrollToTop}
              className={`p-2.5 rounded-xl border transition-all font-bold ${
                isDark ? 'bg-slate-900 hover:bg-amber-500 hover:text-black text-slate-400 border-amber-500/20' : 'bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white border-slate-700'
              }`}
              aria-label="Scroll to top"
            >
              <ArrowUp size={16} />
            </button>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-8 text-center">
          <p className="text-[10px] tracking-[0.25em] font-black uppercase text-slate-500">
            © 2026 AURA TECH COLLECTIVE. ALL RIGHTS RESERVED.
          </p>
        </div>

      </div>
    </footer>
  );
}
