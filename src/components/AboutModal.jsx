import React from 'react';
import { X, ShieldCheck, Award, Target, Rocket } from 'lucide-react';

export default function AboutModal({ theme, isOpen, onClose, onOpenBookModal }) {
  if (!isOpen) return null;
  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className={`relative w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl my-8 border overflow-hidden ${
        isDark ? 'bg-slate-950 border-amber-500/30' : 'bg-white border-slate-200'
      }`}>
        {/* Office Background Scene with low transparency */}
        <div className="absolute inset-0 pointer-events-none rounded-3xl overflow-hidden z-0">
          <img 
            src="/office-team.jpg" 
            alt="Office Environment" 
            className={`w-full h-full object-cover object-center ${
              isDark ? 'opacity-[0.12] brightness-75 contrast-125' : 'opacity-[0.08] contrast-110'
            }`}
          />
          <div className={`absolute inset-0 ${
            isDark ? 'bg-slate-950/85 backdrop-blur-md' : 'bg-white/90 backdrop-blur-md'
          }`} />
        </div>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-6 right-6 p-2 rounded-full transition-colors ${
            isDark ? 'bg-slate-900 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
          }`}
        >
          <X size={20} />
        </button>

        {/* Header Branding */}
        <div className="flex items-center gap-3 mb-6">
          <div className="logo-badge bg-white p-2 rounded-xl border border-slate-200">
            <img src="/logo.png" alt="AURA TECH" className="h-8 w-auto object-contain" />
          </div>
          <div>
            <h3 className={`text-xl font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              About <span className={isDark ? 'text-amber-400' : 'text-blue-600'}>AURA TECH</span>
            </h3>
            <span className={`text-[11px] font-extrabold uppercase tracking-widest ${isDark ? 'text-amber-400' : 'text-blue-600'}`}>
              A Reliable Backbone of Your Business
            </span>
          </div>
        </div>

        {/* Core Message */}
        <div className={`space-y-4 text-sm leading-relaxed mb-8 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <p className={`text-base font-semibold leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
            AURA TECH delivers high-quality, and budget-friendly solutions for both students and business professionals.
          </p>
          <p>
            We focus on creating user-friendly, high-performance web applications, custom AI chatbots, mobile applications, and visual branding solutions that go beyond ordinary expectations.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            isDark ? 'bg-slate-900/80 border-amber-500/20' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className={`p-2 rounded-lg shrink-0 ${isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-50 text-blue-600'}`}>
              <Rocket size={18} />
            </div>
            <div>
              <h4 className={`text-xs font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Complete Guidance</h4>
              <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Complete project guidance from idea conception to final deployment.</p>
            </div>
          </div>

          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            isDark ? 'bg-slate-900/80 border-amber-500/20' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className={`p-2 rounded-lg shrink-0 ${isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-50 text-blue-600'}`}>
              <ShieldCheck size={18} />
            </div>
            <div>
              <h4 className={`text-xs font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Enterprise Standard</h4>
              <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Scalable, secure, and performance-driven digital solutions.</p>
            </div>
          </div>

          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            isDark ? 'bg-slate-900/80 border-amber-500/20' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className={`p-2 rounded-lg shrink-0 ${isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-50 text-blue-600'}`}>
              <Target size={18} />
            </div>
            <div>
              <h4 className={`text-xs font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Student Focus</h4>
              <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Affordable pricing & 1-on-1 support for academic & datathon projects.</p>
            </div>
          </div>

          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            isDark ? 'bg-slate-900/80 border-amber-500/20' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className={`p-2 rounded-lg shrink-0 ${isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-50 text-blue-600'}`}>
              <Award size={18} />
            </div>
            <div>
              <h4 className={`text-xs font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>24/7 Reliability</h4>
              <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Continuous post-launch support and optimization.</p>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className={`flex flex-col sm:flex-row gap-3 pt-4 border-t ${isDark ? 'border-slate-900' : 'border-slate-200'}`}>
          <button
            onClick={() => {
              onClose();
              onOpenBookModal();
            }}
            className="flex-1 btn-primary-action py-3 px-6 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg text-center"
          >
            Register Your Project Now
          </button>
          <button
            onClick={onClose}
            className={`py-3 px-6 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors text-center border ${
              isDark ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
            }`}
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
}
