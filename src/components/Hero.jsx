import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Zap, Code, Award, CheckCircle2, GraduationCap, Building2, Search, Briefcase, FileSpreadsheet } from 'lucide-react';
import PortalSwitcher from './PortalSwitcher';

export default function Hero({ 
  theme, 
  portalMode, 
  setPortalMode, 
  onOpenBookModal, 
  onOpenAboutModal, 
  onOpenClientDashboard,
  onOpenJobModal 
}) {
  const isDark = theme === 'dark';
  const isStudent = portalMode === 'student';
  const isHr = portalMode === 'hr';

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-28 pb-20 overflow-hidden hero-radial-gold">
      
      {/* Office Environment Background: Innovation Atrium & Workspace */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <img 
          src="/office-hero.jpg" 
          alt="Aura Tech Innovation Hub" 
          className={`w-full h-full object-cover object-center transform scale-105 transition-all duration-700 ${
            isDark 
              ? 'opacity-30 sm:opacity-35 brightness-90 contrast-110' 
              : 'opacity-25 sm:opacity-30 brightness-95 contrast-105'
          }`}
        />
        <div className={`absolute inset-0 ${
          isDark 
            ? 'bg-gradient-to-b from-[#030305]/60 via-transparent to-[#030305]/85' 
            : 'bg-gradient-to-b from-[#f8fafc]/60 via-transparent to-[#f8fafc]/85'
        }`} />
      </div>

      {/* Glow Effects */}
      <div className="hero-glow-gold z-[1]"></div>
      <div className={`absolute top-1/3 right-10 w-96 h-96 rounded-full blur-[120px] pointer-events-none z-[1] ${
        isDark ? 'bg-amber-500/10' : 'bg-blue-500/15'
      }`}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Interactive Front Portal Switcher */}
        <PortalSwitcher portalMode={portalMode} setPortalMode={setPortalMode} theme={theme} />

        {/* Dynamic Tagline Badge */}
        <div className={`inline-flex items-center gap-2 px-4.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest mb-6 animate-pulse-glow border ${
          isDark 
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
            : 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm'
        }`}>
          {isHr ? (
            <>
              <Briefcase className="w-4 h-4 text-emerald-400" />
              <span>💼 AURA TECH HR & RECRUITMENT PORTAL</span>
            </>
          ) : isStudent ? (
            <>
              <GraduationCap className="w-4 h-4" />
              <span>🎓 Student Capstone & Datathon Portal</span>
            </>
          ) : (
            <>
              <Building2 className="w-4 h-4" />
              <span>🏢 Enterprise Digital Systems & AI Infrastructure</span>
            </>
          )}
        </div>

        {/* Main Headline */}
        <h1 className={`text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight uppercase leading-[1.1] mb-6 ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          {isHr ? (
            <>
              WORK WITH US.<br />
              <span className="text-gradient-main">SHAPE TOMORROW.</span>
            </>
          ) : isStudent ? (
            <>
              ACADEMIC PROJECTS.<br />
              <span className="text-gradient-main">BUILT TO IMPRESS.</span>
            </>
          ) : (
            <>
              DESIGN. BUILD.<br />
              <span className="text-gradient-main">ACCELERATE.</span>
            </>
          )}
        </h1>

        {/* Dynamic Subtitle */}
        <p className={`text-base sm:text-xl max-w-3xl mx-auto mb-6 leading-relaxed font-normal ${
          isDark ? 'text-slate-300' : 'text-slate-700'
        }`}>
          {isHr ? (
            <>
              <strong className={isDark ? 'text-white font-bold' : 'text-slate-900 font-bold'}>AURA TECH HR Talent Hub</strong> invites talented engineers, UI/UX designers, AI researchers, and digital innovators. Apply for your desired role with your resume, portfolio link, and technical skills.
            </>
          ) : isStudent ? (
            <>
              <strong className={isDark ? 'text-white font-bold' : 'text-slate-900 font-bold'}>AURA TECH Student Hub</strong> provides budget-friendly final-year projects, datathon engines, college chatbots, microcontrollers (ESP32/IoT), and 1-on-1 engineering mentorship.
            </>
          ) : (
            <>
              <strong className={isDark ? 'text-white font-bold' : 'text-slate-900 font-bold'}>AURA TECH Corporate Solutions</strong> delivers enterprise-grade software development, AI automation, custom mobile apps, and high-uptime cloud infrastructure tailored for businesses & organisations.
            </>
          )}
        </p>

        {/* Logo Tagline Ribbon */}
        <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider mb-10 shadow-lg border ${
          isDark 
            ? 'bg-slate-900/90 border-amber-500/30 text-slate-200 shadow-black/50' 
            : 'bg-white border-slate-200 text-slate-900 shadow-slate-200/50'
        }`}>
          <ShieldCheck className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-blue-600'}`} />
          <span>A Reliable Backbone Of Your Business</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          {isHr ? (
            <button
              onClick={() => onOpenJobModal()}
              className="w-full sm:w-auto btn-primary-action px-10 py-4 rounded-xl text-xs uppercase tracking-wider font-extrabold flex items-center justify-center gap-2 shadow-xl cursor-pointer"
            >
              <Briefcase className="w-4 h-4" />
              Apply Now
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <>
              <button
                onClick={() => onOpenBookModal(isStudent ? 'College / Student Project' : 'Enterprise Service')}
                className="w-full sm:w-auto btn-primary-action px-8 py-4 rounded-xl text-xs uppercase tracking-wider font-extrabold flex items-center justify-center gap-2 shadow-xl cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                {isStudent ? 'Book Student Project' : 'Request Enterprise Quote'}
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenClientDashboard}
                className={`w-full sm:w-auto px-8 py-4 rounded-xl font-extrabold text-xs uppercase tracking-wider border shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isDark 
                    ? 'bg-slate-900 hover:bg-slate-800 text-white border-amber-500/40 hover:border-amber-400' 
                    : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-300 hover:border-blue-600'
                }`}
              >
                <Search className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-blue-600'}`} />
                Track Project Status
              </button>

              <button
                onClick={onOpenAboutModal}
                className={`w-full sm:w-auto px-6 py-4 font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                  isDark ? 'text-slate-400 hover:text-amber-400' : 'text-slate-600 hover:text-blue-600'
                }`}
              >
                About Us
              </button>
            </>
          )}
        </div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {(isHr ? [
            { label: 'Active Openings', val: '12+ Positions', icon: Briefcase },
            { label: 'Response Time', val: '48hr Fast Review', icon: CheckCircle2 },
            { label: 'Work Mode', val: 'Remote / Hybrid', icon: Award },
            { label: 'Team Culture', val: '100% Mentorship', icon: ShieldCheck },
          ] : isStudent ? [
            { label: 'Academic Compliance', val: '100% Verified', icon: GraduationCap },
            { label: 'Student Pricing', val: 'Special Discounts', icon: CheckCircle2 },
            { label: 'Projects Delivered', val: '150+ Student Apps', icon: Award },
            { label: 'Mentorship', val: '1-on-1 Tech Guidance', icon: ShieldCheck },
          ] : [
            { label: 'Enterprise Uptime', val: '99.9% Reliable', icon: Building2 },
            { label: 'SLA Guarantee', val: '100% On-Time', icon: CheckCircle2 },
            { label: 'Solutions Built', val: '50+ Deployed', icon: Award },
            { label: 'Architect Support', val: 'Dedicated Lead', icon: ShieldCheck },
          ]).map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="glass-card p-4 rounded-xl text-left">
                <Icon className={`w-5 h-5 mb-2 ${isDark ? 'text-amber-400' : 'text-blue-600'}`} />
                <div className={`font-bold text-base sm:text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>{stat.val}</div>
                <div className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{stat.label}</div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
