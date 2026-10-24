import React, { useState } from 'react';
import { PROJECTS_DATA } from '../data/auraData';
import { Sparkles, Building2, Layers, CheckCircle2, ArrowRight, Zap } from 'lucide-react';

export default function ProjectsSection({ theme, onOpenBookModal }) {
  const [activeTab, setActiveTab] = useState('All');
  const isDark = theme === 'dark';

  const filteredProjects = activeTab === 'All'
    ? PROJECTS_DATA
    : PROJECTS_DATA.filter(p => p.type === activeTab);

  return (
    <section id="showcase" className={`py-24 relative overflow-hidden scroll-mt-20 border-t ${
      isDark ? 'bg-black/40 border-amber-500/15' : 'bg-white/70 border-slate-200'
    }`}>
      {/* Office Environment Background: Boardroom & Project Showroom */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <img 
          src="/office-projects.jpg" 
          alt="Digital Project Presentation Boardroom" 
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
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className={`inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest mb-3 ${
              isDark ? 'text-amber-400' : 'text-blue-600'
            }`}>
              <Sparkles className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-blue-600'}`} />
              Delivered Projects & Client Registry
            </div>
            <h2 className={`text-3xl sm:text-5xl font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              OUR <span className="text-gradient-main">SHOWCASE</span>
            </h2>
            <p className={`text-sm sm:text-base mt-2 max-w-xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Official list of engineering systems, AI chatbots, IoT dashboards, and brand identities delivered to organisations & institutions.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className={`flex items-center p-1.5 rounded-2xl border self-start md:self-auto ${
            isDark ? 'bg-slate-900/90 border-amber-500/20' : 'bg-slate-100 border-slate-200'
          }`}>
            {['All', 'Development', 'Design'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === tab 
                    ? 'btn-primary-action shadow-lg' 
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab === 'All' ? 'All Projects' : tab === 'Development' ? 'Development' : 'Design'}
              </button>
            ))}
          </div>
        </div>

        {/* Showcase Projects List */}
        <div className={`rounded-3xl border overflow-hidden shadow-2xl ${
          isDark ? 'bg-slate-950/90 border-amber-500/20' : 'bg-white border-slate-200'
        }`}>
          
          {/* List View Container */}
          <div className="divide-y divide-slate-800/60">
            
            {/* Table Header Row (Hidden on mobile) */}
            <div className={`hidden md:grid grid-cols-12 gap-4 p-5 font-black uppercase tracking-wider text-[11px] border-b ${
              isDark ? 'bg-black text-amber-400 border-amber-500/20' : 'bg-slate-100 text-blue-600 border-slate-200'
            }`}>
              <div className="col-span-3">Project Name & Category</div>
              <div className="col-span-4">Company / Organisation Provided To</div>
              <div className="col-span-3">Status & Scope</div>
              <div className="col-span-2 text-right">Action</div>
            </div>

            {/* Project List Items */}
            {filteredProjects.map((project) => (
              <div 
                key={project.id}
                className={`p-6 md:p-5 transition-all duration-200 ${
                  isDark ? 'hover:bg-slate-900/60' : 'hover:bg-slate-50'
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  
                  {/* Column 1: Project Name & Type */}
                  <div className="col-span-1 md:col-span-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                        project.type === 'Development'
                          ? isDark ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                      }`}>
                        {project.type}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        isDark ? 'bg-slate-900 text-slate-400' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {project.badge}
                      </span>
                    </div>

                    <h3 className={`text-base font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {project.name}
                    </h3>
                  </div>

                  {/* Column 2: Company / Organisation Provided To */}
                  <div className="col-span-1 md:col-span-4">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 md:hidden mb-0.5">
                      Provided To:
                    </div>
                    <div className={`flex items-center gap-2 font-black text-sm ${
                      isDark ? 'text-amber-400' : 'text-blue-600'
                    }`}>
                      <Building2 size={16} className="shrink-0" />
                      <span>{project.client}</span>
                    </div>

                    <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {project.description}
                    </p>
                  </div>

                  {/* Column 3: Status & Key Features */}
                  <div className="col-span-1 md:col-span-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-green-400" />
                      <span className={`text-xs font-extrabold uppercase tracking-wider ${
                        isDark ? 'text-slate-200' : 'text-slate-800'
                      }`}>
                        Verified Delivery
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Full source code, production build & maintenance support handed over.
                    </div>
                  </div>

                  {/* Column 4: Action Button (No external links) */}
                  <div className="col-span-1 md:col-span-2 text-left md:text-right pt-2 md:pt-0">
                    <button
                      onClick={() => onOpenBookModal(project.name)}
                      className="w-full md:w-auto btn-primary-action px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Zap size={14} />
                      <span>Book Similar</span>
                    </button>
                  </div>

                </div>
              </div>
            ))}

          </div>

        </div>

        {/* Footer Note */}
        <div className={`mt-8 text-center text-xs font-medium ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
          Looking for a custom solution? Select <span className={isDark ? 'text-amber-400 font-bold' : 'text-blue-600 font-bold'}>"Book Similar"</span> on any showcase project to request a tailored build.
        </div>

      </div>
    </section>
  );
}
