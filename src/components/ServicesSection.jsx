import React, { useState } from 'react';
import { SERVICES_DATA } from '../data/auraData';
import { 
  Palette, Globe, Layout, Database, Smartphone, 
  Layers, Code, Sparkles, Video, BarChart, MessageSquare, Zap, Cpu, ArrowRight 
} from 'lucide-react';

const iconMap = {
  Palette,
  Globe,
  Layout,
  Database,
  Smartphone,
  Layers,
  Code,
  Sparkles,
  Video,
  BarChart,
  MessageSquare,
  Zap,
  Cpu
};

export default function ServicesSection({ theme, onBookService }) {
  const [activeTab, setActiveTab] = useState('All');
  const isDark = theme === 'dark';

  const filteredServices = activeTab === 'All' 
    ? SERVICES_DATA 
    : SERVICES_DATA.filter(s => s.category === activeTab);

  return (
    <section id="services" className={`py-24 relative overflow-hidden scroll-mt-20 border-t ${
      isDark ? 'bg-black/40 border-amber-500/15' : 'bg-slate-50/70 border-slate-200'
    }`}>
      {/* Office Environment Background: Engineering & Development Lab */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <img 
          src="/office-services.jpg" 
          alt="Software Development Lab" 
          className={`w-full h-full object-cover object-center transform scale-105 transition-all duration-700 ${
            isDark 
              ? 'opacity-[0.14] brightness-75 contrast-125' 
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
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className={`inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest mb-3 ${
              isDark ? 'text-amber-400' : 'text-blue-600'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isDark ? 'bg-amber-400' : 'bg-blue-600'}`}></span>
              High-End Execution
            </div>
            <h2 className={`text-3xl sm:text-5xl font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Our <span className="text-gradient-main">Expertise</span>
            </h2>
            <p className={`text-sm sm:text-base mt-2 max-w-xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              High-end development and design services tailored for modern enterprises and academic success.
            </p>
          </div>

          {/* Tabs */}
          <div className={`flex items-center p-1 rounded-xl border self-start md:self-auto ${
            isDark ? 'bg-slate-900/90 border-amber-500/20' : 'bg-white border-slate-300 shadow-sm'
          }`}>
            {['All', 'Design', 'Development'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                  activeTab === tab 
                    ? 'btn-primary-action shadow-lg' 
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab === 'All' ? 'All Services' : tab === 'Design' ? 'Design Studio' : 'Development Suite'}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const IconComponent = iconMap[service.icon] || Code;
            return (
              <div
                key={service.id}
                className="glass-card p-6 rounded-2xl flex flex-col justify-between group relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl transition-all ${
                  isDark ? 'bg-amber-500/5 group-hover:bg-amber-500/15' : 'bg-blue-500/10 group-hover:bg-blue-500/20'
                }`}></div>
                
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${
                      isDark 
                        ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 group-hover:bg-gradient-to-r group-hover:from-amber-400 group-hover:to-amber-600 group-hover:text-black' 
                        : 'bg-blue-50 border-blue-200 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
                    }`}>
                      <IconComponent size={22} />
                    </div>
                    <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                      isDark ? 'bg-slate-900 text-amber-300 border-amber-500/20' : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      {service.category}
                    </span>
                  </div>

                  <h3 className={`text-xl font-extrabold mb-2 transition-colors ${
                    isDark ? 'text-white group-hover:text-amber-400' : 'text-slate-900 group-hover:text-blue-600'
                  }`}>
                    {service.title}
                  </h3>

                  <p className={`text-xs sm:text-sm leading-relaxed mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {service.description}
                  </p>
                </div>

                <button
                  onClick={() => onBookService(service.title)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider border transition-all flex items-center justify-center gap-2 group/btn ${
                    isDark 
                      ? 'bg-slate-900 hover:bg-gradient-to-r hover:from-amber-400 hover:to-amber-600 text-slate-300 hover:text-black border-slate-800 hover:border-amber-400' 
                      : 'bg-white hover:bg-blue-600 text-slate-800 hover:text-white border-slate-300 hover:border-blue-600 shadow-sm'
                  }`}
                >
                  Book Service
                  <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
