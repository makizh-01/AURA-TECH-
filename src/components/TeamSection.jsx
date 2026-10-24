import React from 'react';
import { TEAM_MEMBERS } from '../data/auraData';
import { Users, Sparkles, ShieldCheck, Linkedin, Mail, Award } from 'lucide-react';

export default function TeamSection({ theme, onOpenBookModal }) {
  const isDark = theme === 'dark';

  return (
    <section id="us" className={`py-24 relative overflow-hidden scroll-mt-20 border-t transition-colors duration-300 ${
      isDark ? 'bg-black/40 border-amber-500/15' : 'bg-slate-50/70 border-slate-200'
    }`}>
      {/* Office Environment Background: Creative Visionaries Collaboration Lounge */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <img 
          src="/office-team.jpg" 
          alt="Visionaries Collaboration Lounge" 
          className={`w-full h-full object-cover object-center transform scale-105 transition-all duration-700 ${
            isDark 
              ? 'opacity-[0.16] brightness-75 contrast-125' 
              : 'opacity-[0.11] brightness-95 contrast-110'
          }`}
        />
        <div className={`absolute inset-0 ${
          isDark 
            ? 'bg-gradient-to-b from-[#030305] via-[#030305]/75 to-[#030305]' 
            : 'bg-gradient-to-b from-[#f8fafc] via-[#f8fafc]/80 to-[#f8fafc]'
        }`} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest mb-4 border ${
            isDark 
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
              : 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm'
          }`}>
            <Users className="w-3.5 h-3.5" />
            Meet The Visionaries Behind Aura Tech
          </div>

          <h2 className={`text-3xl sm:text-5xl font-black uppercase tracking-tight mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            OUR <span className="text-gradient-main">TEAM (US)</span>
          </h2>

          <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            A collective of passion-driven engineers, full stack developers, AI artists, IoT innovators, and creative designers powering digital transformation.
          </p>
        </div>

        {/* 7 Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {TEAM_MEMBERS.map((member) => (
            <div 
              key={member.id}
              className={`glass-card rounded-3xl p-6 border transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between group ${
                isDark 
                  ? 'border-amber-500/20 hover:border-amber-400/50 hover:shadow-2xl hover:shadow-amber-500/10' 
                  : 'border-slate-200 hover:border-blue-400 hover:shadow-xl'
              }`}
            >
              <div>
                {/* Photo Avatar */}
                <div className="relative mb-5 overflow-hidden rounded-2xl aspect-square border border-slate-700/40">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                  
                  {/* Badge */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-black/80 backdrop-blur-md text-white border border-white/20`}>
                      {member.badge}
                    </span>
                  </div>
                </div>

                {/* Member Info */}
                <h3 className={`text-lg font-black tracking-tight uppercase mb-1 ${isDark ? 'text-white group-hover:text-amber-400' : 'text-slate-900 group-hover:text-blue-600'} transition-colors`}>
                  {member.name}
                </h3>

                <div className={`text-xs font-black uppercase tracking-wider mb-3 ${isDark ? 'text-amber-400' : 'text-blue-600'}`}>
                  {member.role}
                </div>

                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {member.tagline}
                </p>
              </div>

              {/* Bottom Action */}
              <div className="mt-6 pt-4 border-t border-slate-800/40 flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                  AURA TECH CREW
                </span>
                <button 
                  onClick={onOpenBookModal}
                  className={`text-xs font-extrabold uppercase hover:underline cursor-pointer ${
                    isDark ? 'text-amber-400' : 'text-blue-600'
                  }`}
                >
                  Collaborate ➔
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
