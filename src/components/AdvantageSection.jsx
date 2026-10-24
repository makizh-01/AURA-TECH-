import React from 'react';
import { ShieldCheck, Clock, Users, ArrowRight } from 'lucide-react';

export default function AdvantageSection({ theme, onOpenBookModal }) {
  const isDark = theme === 'dark';

  const advantages = [
    {
      step: '01',
      title: 'Registration Process',
      desc: 'A streamlined, transparent booking and onboarding system that gets your project moving instantly without bureaucracy.',
      icon: ShieldCheck
    },
    {
      step: '02',
      title: 'On-Time Delivery',
      desc: 'Our milestone tracking guarantees your project launches strictly on schedule with zero compromise on quality.',
      icon: Clock
    },
    {
      step: '03',
      title: 'Our Team Work',
      desc: 'Cross-functional teams merge creative UI/UX design with robust cloud & AI engineering for total end-to-end delivery.',
      icon: Users
    }
  ];

  return (
    <section id="advantages" className={`py-24 relative overflow-hidden scroll-mt-20 border-t ${
      isDark ? 'bg-black/40 border-amber-500/15' : 'bg-slate-50/70 border-slate-200'
    }`}>
      {/* Office Environment Background: Architectural Bridge & Milestone Execution */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <img 
          src="/office-advantage.jpg" 
          alt="Architectural Corporate Strategy Bridge" 
          className={`w-full h-full object-cover object-center transform scale-105 transition-all duration-700 ${
            isDark 
              ? 'opacity-[0.15] brightness-75 contrast-125' 
              : 'opacity-[0.10] brightness-95 contrast-110'
          }`}
        />
        <div className={`absolute inset-0 ${
          isDark 
            ? 'bg-gradient-to-b from-[#030305] via-[#030305]/75 to-[#030305]' 
            : 'bg-gradient-to-b from-[#f8fafc] via-[#f8fafc]/80 to-[#f8fafc]'
        }`} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className={`inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest mb-3 ${
            isDark ? 'text-amber-400' : 'text-blue-600'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isDark ? 'bg-amber-400' : 'bg-blue-600'}`}></span>
            Why Choose Us
          </div>
          <h2 className={`text-3xl sm:text-5xl font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            The <span className="text-gradient-main">Aura Advantage</span>
          </h2>
          <p className={`text-sm sm:text-base mt-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Our commitment to excellence is reflected in every stage of our operation, from student final-year projects to enterprise solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {advantages.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="glass-card p-8 rounded-2xl relative overflow-hidden group"
              >
                <div className={`text-5xl font-black transition-colors absolute top-4 right-6 pointer-events-none ${
                  isDark ? 'text-amber-500/15 group-hover:text-amber-400/30' : 'text-blue-500/15 group-hover:text-blue-600/30'
                }`}>
                  {item.step}
                </div>

                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${
                  isDark 
                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' 
                    : 'bg-blue-50 border-blue-200 text-blue-600'
                }`}>
                  <Icon size={24} />
                </div>

                <h3 className={`text-xl font-extrabold mb-3 transition-colors ${
                  isDark ? 'text-white group-hover:text-amber-400' : 'text-slate-900 group-hover:text-blue-600'
                }`}>
                  {item.title}
                </h3>

                <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <button
            onClick={onOpenBookModal}
            className="inline-flex items-center gap-2 btn-primary-action px-8 py-4 rounded-xl text-xs uppercase tracking-wider font-extrabold shadow-lg cursor-pointer"
          >
            Start Your Project With Us
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </section>
  );
}
