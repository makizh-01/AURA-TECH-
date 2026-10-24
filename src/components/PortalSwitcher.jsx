import React from 'react';
import { GraduationCap, Building2, Briefcase } from 'lucide-react';

export default function PortalSwitcher({ portalMode, setPortalMode, theme }) {
  const isDark = theme === 'dark';

  return (
    <div className="flex items-center justify-center my-6">
      <div className={`p-1.5 rounded-2xl border flex items-center gap-1.5 sm:gap-2 max-w-2xl w-full shadow-lg ${
        isDark ? 'bg-slate-950 border-amber-500/30' : 'bg-white border-slate-200 shadow-slate-200/50'
      }`}>
        
        {/* Student Portal Button */}
        <button
          onClick={() => setPortalMode('student')}
          className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-[11px] sm:text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer ${
            portalMode === 'student'
              ? isDark 
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20 font-extrabold' 
                : 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-extrabold'
              : isDark 
                ? 'text-slate-400 hover:text-white' 
                : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <GraduationCap size={16} />
          <span className="whitespace-nowrap">Student</span>
        </button>

        {/* Company / Organisation Portal Button */}
        <button
          onClick={() => setPortalMode('company')}
          className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-[11px] sm:text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer ${
            portalMode === 'company'
              ? isDark 
                ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-black shadow-lg shadow-amber-500/30 font-extrabold' 
                : 'bg-gradient-to-r from-slate-900 via-blue-900 to-blue-700 text-white shadow-lg font-extrabold'
              : isDark 
                ? 'text-slate-400 hover:text-white' 
                : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 size={16} />
          <span className="whitespace-nowrap">Company / Org</span>
        </button>

        {/* HR & Careers Portal Button */}
        <button
          onClick={() => setPortalMode('hr')}
          className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-[11px] sm:text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer ${
            portalMode === 'hr'
              ? isDark 
                ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-black shadow-lg shadow-emerald-500/30 font-extrabold' 
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg font-extrabold'
              : isDark 
                ? 'text-slate-400 hover:text-white' 
                : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Briefcase size={16} />
          <span className="whitespace-nowrap">HR & Careers</span>
        </button>

      </div>
    </div>
  );
}
