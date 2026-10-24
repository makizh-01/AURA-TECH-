import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, X, ArrowRight, ShieldCheck, Sparkles, Sun, Moon, 
  GraduationCap, Building2, Search, Briefcase, ChevronDown, 
  Compass, Layers, Users, Award, HelpCircle, Phone, Info, Zap, Check, ChevronRight,
  MoreVertical 
} from 'lucide-react';

export default function Navbar({ 
  theme, 
  portalMode, 
  setPortalMode, 
  onToggleTheme, 
  onOpenBookModal, 
  onOpenAboutModal, 
  onOpenAdminModal, 
  onOpenClientDashboard,
  onOpenJobModal 
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isDark = theme === 'dark';
  const isStudent = portalMode === 'student';
  const isHr = portalMode === 'hr';

  // Scroll detection for header backdrop
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside and ESC key listener to auto-close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // 1. Navigation Pages & Sections List
  const navSectionOptions = [
    {
      id: 'services',
      name: 'Services',
      desc: 'Web Development, Custom AI & Mobile Apps',
      href: '#services',
      icon: Layers,
      hideInHr: true
    },
    {
      id: 'showcase',
      name: 'Showcase',
      desc: 'Featured Client Projects & Architecture Demos',
      href: '#showcase',
      icon: Sparkles,
      hideInHr: true
    },
    {
      id: 'careers',
      name: 'Careers / HR Portal',
      desc: 'Job Openings, Culture & Talent Applications',
      href: '#hr-portal',
      icon: Briefcase,
      hideInHr: false
    },
    {
      id: 'us',
      name: 'Our Team (US)',
      desc: 'Meet The Visionary Engineers & Designers',
      href: '#us',
      icon: Users,
      hideInHr: true
    },
    {
      id: 'advantages',
      name: 'Why Choose Us',
      desc: 'The Aura Advantage & SLA Commitments',
      href: '#advantages',
      icon: Award,
      hideInHr: true
    },
    {
      id: 'faq',
      name: 'FAQ',
      desc: 'Frequently Asked Questions & Answers',
      href: '#faq',
      icon: HelpCircle,
      hideInHr: false
    },
    {
      id: 'contact',
      name: 'Contact & Helpdesk',
      desc: 'Direct Phone, Email & Support Lines',
      href: '#contact',
      icon: Phone,
      hideInHr: false
    },
    {
      id: 'about',
      name: 'About Us',
      desc: 'Our Foundation, Philosophy & Architecture',
      action: onOpenAboutModal,
      icon: Info,
      hideInHr: false
    }
  ];

  // Filter navigation options for HR mode
  const visibleNavOptions = isHr ? navSectionOptions.filter(opt => !opt.hideInHr) : navSectionOptions;

  // 2. Portal Modes Options List
  const portalModesList = [
    {
      id: 'student',
      name: 'Student Portal',
      desc: 'Capstone, datathons & discounted mentorship',
      icon: GraduationCap,
      active: isStudent,
      badge: 'Academic',
      action: () => setPortalMode('student')
    },
    {
      id: 'company',
      name: 'Company / Org Portal',
      desc: 'Enterprise web systems & AI infrastructure',
      icon: Building2,
      active: !isStudent && !isHr,
      badge: 'Enterprise',
      action: () => setPortalMode('company')
    },
    {
      id: 'hr',
      name: 'HR & Careers Portal',
      desc: 'Job application form & recruitment database',
      icon: Briefcase,
      active: isHr,
      badge: 'Hiring',
      action: () => setPortalMode('hr')
    }
  ];

  // 3. Quick System Actions List
  const actionOptionsList = [
    // Track Project (only in Student / Company mode, omitted in HR mode)
    ...(!isHr ? [{
      id: 'track',
      name: 'Track Project Status',
      desc: 'Search client tracking code & live status',
      icon: Search,
      action: onOpenClientDashboard,
      badge: 'Tracker'
    }] : []),
    // Theme Toggle Option
    {
      id: 'theme',
      name: isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme',
      desc: isDark ? 'Clean daytime high-contrast mode' : 'Sleek luxury neon dark ambiance',
      icon: isDark ? Sun : Moon,
      action: onToggleTheme,
      badge: isDark ? 'Light' : 'Dark'
    },
    // Primary Action (Apply Now in HR mode, Book Project in Student/Company mode)
    ...(isHr ? [{
      id: 'apply',
      name: 'Apply Now (HR Portal)',
      desc: 'Submit candidate details, resume & portfolio',
      icon: Briefcase,
      action: onOpenJobModal,
      badge: 'APPLY',
      isPrimary: true
    }] : [{
      id: 'book',
      name: 'Book Project Now',
      desc: 'Fast onboarding & customized price quote',
      icon: Zap,
      action: () => onOpenBookModal(),
      badge: 'BOOK',
      isPrimary: true
    }])
  ];

  const handleOptionSelect = (opt) => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    if (opt.action) {
      opt.action();
    } else if (opt.href) {
      const el = document.querySelector(opt.href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      isScrolled 
        ? isDark
          ? 'bg-slate-950/95 backdrop-blur-2xl border-b border-amber-500/20 shadow-2xl py-3'
          : 'bg-white/95 backdrop-blur-2xl border-b border-slate-200/90 shadow-lg py-3'
        : isDark
          ? 'bg-gradient-to-b from-black/90 via-black/50 to-transparent py-4'
          : 'bg-gradient-to-b from-white/95 via-white/60 to-transparent py-4'
    }`}>
      
      {/* Top subtle accent shimmer line */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${
        isDark 
          ? 'bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-80' 
          : 'bg-gradient-to-r from-transparent via-blue-600 to-transparent opacity-60'
      }`} />

      {/* Main Container */}
      <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-3">
          
          {/* LEFT: Logo & Brand Information */}
          <div className="flex items-center gap-3 shrink-0">
            <a href="#" className="flex items-center gap-2.5 sm:gap-3 group">
              <div className="logo-badge shrink-0 bg-white p-1 rounded-xl shadow-md border border-slate-200">
                <img 
                  src="/logo.png" 
                  alt="AURA TECH Logo" 
                  className="h-7 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105" 
                />
              </div>

              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className={`font-black text-lg sm:text-xl tracking-tight uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    AURA <span className={isDark ? 'text-amber-400' : 'text-blue-600'}>TECH</span>
                  </span>
                  <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full border tracking-widest ${
                    isDark 
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
                      : 'bg-blue-50 text-blue-600 border-blue-200'
                  }`}>
                    PRO
                  </span>
                </div>
                <span className={`text-[9px] sm:text-[10px] font-semibold tracking-wide hidden lg:block ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  A Reliable Backbone Of Your Business
                </span>
              </div>
            </a>
          </div>

          {/* RIGHT: Modern Header Controls with Three-Dot List Menu */}
          <div className="hidden lg:flex items-center space-x-2.5 shrink-0">
            
            {/* Quick Portal Mode Switcher Pill */}
            <button
              onClick={() => setPortalMode(isHr ? 'student' : isStudent ? 'company' : 'hr')}
              title="Click to cycle portal mode (Student / Company / HR)"
              className={`px-3 py-2 rounded-xl border text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shrink-0 whitespace-nowrap ${
                isHr
                  ? isDark 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20' 
                    : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'
                  : isStudent
                    ? isDark 
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20' 
                      : 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'
                    : isDark 
                      ? 'bg-purple-950/40 text-purple-300 border-purple-500/30 hover:bg-purple-900/40' 
                      : 'bg-slate-900 text-white border-slate-700 hover:bg-black'
              }`}
            >
              {isHr ? <Briefcase size={14} /> : isStudent ? <GraduationCap size={14} /> : <Building2 size={14} />}
              <span>{isHr ? 'HR Mode' : isStudent ? 'Student Mode' : 'Company Mode'}</span>
            </button>

            {/* Quick Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className={`p-2.5 rounded-xl border transition-all flex items-center justify-center cursor-pointer shadow-sm shrink-0 ${
                isDark 
                  ? 'bg-slate-900 border-amber-500/30 text-amber-400 hover:bg-slate-800' 
                  : 'bg-white border-slate-300 text-blue-600 hover:bg-blue-50'
              }`}
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-blue-600" />}
            </button>

            {/* THREE-DOT LIST MENU OPTION */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                title="All Options & Directory"
                className={`p-2.5 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-sm select-none group ${
                  isDropdownOpen
                    ? isDark
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-amber-500/10'
                      : 'bg-blue-50 border-blue-600 text-blue-700 shadow-blue-500/10'
                    : isDark
                      ? 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-amber-500/40 hover:text-amber-400 hover:bg-slate-800'
                      : 'bg-white border-slate-300 text-slate-700 hover:border-blue-500 hover:text-blue-600 hover:bg-slate-50'
                }`}
                aria-expanded={isDropdownOpen}
                aria-label="More Options Menu"
              >
                <MoreVertical className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                  isDark ? 'text-amber-400' : 'text-blue-600'
                }`} />
              </button>

              {/* Luxury Three-Dot Dropdown Menu List */}
              {isDropdownOpen && (
                <div className={`absolute right-0 top-full mt-3 w-80 sm:w-88 rounded-3xl border shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 ${
                  isDark 
                    ? 'bg-slate-950/95 backdrop-blur-2xl border-amber-500/30 text-white shadow-black/90' 
                    : 'bg-white/95 backdrop-blur-2xl border-slate-200 text-slate-900 shadow-slate-300/60'
                }`}>
                  
                  {/* Dropdown Header */}
                  <div className={`px-4 py-3 border-b flex items-center justify-between ${
                    isDark ? 'bg-black/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      <MoreVertical size={16} className={isDark ? 'text-amber-400' : 'text-blue-600'} />
                      <span className="text-xs font-black uppercase tracking-wider">
                        All Options Directory
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isDark ? 'bg-slate-800 text-amber-400' : 'bg-slate-100 text-blue-600'
                    }`}>
                      {visibleNavOptions.length + portalModesList.length + actionOptionsList.length} Options
                    </span>
                  </div>

                  {/* Dropdown Scrollable List */}
                  <div className="p-2.5 max-h-[75vh] overflow-y-auto custom-scrollbar space-y-3">
                    
                    {/* Category 1: Sections & Navigation */}
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 py-1">
                        Sections & Navigation
                      </div>
                      <div className="space-y-1">
                        {visibleNavOptions.map((opt) => {
                          const Icon = opt.icon;
                          return opt.href ? (
                            <a
                              key={opt.id}
                              href={opt.href}
                              onClick={() => setIsDropdownOpen(false)}
                              className={`flex items-center gap-3 px-2.5 py-2 rounded-xl transition-all group ${
                                isDark 
                                  ? 'hover:bg-slate-900 text-slate-200 hover:text-white' 
                                  : 'hover:bg-blue-50/70 text-slate-800 hover:text-blue-600'
                              }`}
                            >
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                                isDark ? 'bg-slate-900 border-slate-800 text-amber-400' : 'bg-white border-slate-200 text-blue-600'
                              }`}>
                                <Icon size={14} />
                              </div>
                              <div className="flex-1 min-w-0 text-left">
                                <div className="text-xs font-bold uppercase tracking-wide truncate group-hover:translate-x-0.5 transition-transform">
                                  {opt.name}
                                </div>
                                <div className={`text-[10px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                  {opt.desc}
                                </div>
                              </div>
                              <ChevronRight size={13} className="text-slate-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
                            </a>
                          ) : (
                            <button
                              key={opt.id}
                              onClick={() => handleOptionSelect(opt)}
                              className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl transition-all group cursor-pointer text-left ${
                                isDark 
                                  ? 'hover:bg-slate-900 text-slate-200 hover:text-white' 
                                  : 'hover:bg-blue-50/70 text-slate-800 hover:text-blue-600'
                              }`}
                            >
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                                isDark ? 'bg-slate-900 border-slate-800 text-amber-400' : 'bg-white border-slate-200 text-blue-600'
                              }`}>
                                <Icon size={14} />
                              </div>
                              <div className="flex-1 min-w-0 text-left">
                                <div className="text-xs font-bold uppercase tracking-wide truncate group-hover:translate-x-0.5 transition-transform">
                                  {opt.name}
                                </div>
                                <div className={`text-[10px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                  {opt.desc}
                                </div>
                              </div>
                              <ChevronRight size={13} className="text-slate-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className={`border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`} />

                    {/* Category 2: Portals & Modes */}
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 py-1">
                        Portals & Modes
                      </div>
                      <div className="space-y-1">
                        {portalModesList.map((portal) => {
                          const Icon = portal.icon;
                          return (
                            <button
                              key={portal.id}
                              onClick={() => handleOptionSelect(portal)}
                              className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl transition-all cursor-pointer text-left ${
                                portal.active
                                  ? isDark ? 'bg-amber-500/15 text-amber-300 font-bold' : 'bg-blue-50 text-blue-700 font-bold'
                                  : isDark ? 'hover:bg-slate-900 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
                              }`}
                            >
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                                portal.active
                                  ? isDark ? 'bg-amber-500 text-black border-amber-400' : 'bg-blue-600 text-white border-blue-500'
                                  : isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600'
                              }`}>
                                <Icon size={14} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold uppercase tracking-wide truncate">
                                    {portal.name}
                                  </span>
                                  {portal.active && (
                                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-amber-400 text-black flex items-center gap-0.5">
                                      <Check size={10} /> Active
                                    </span>
                                  )}
                                </div>
                                <div className={`text-[10px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                  {portal.desc}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className={`border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`} />

                    {/* Category 3: Actions & Tools */}
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 py-1">
                        Actions & Tools
                      </div>
                      <div className="space-y-1">
                        {actionOptionsList.map((act) => {
                          const Icon = act.icon;
                          return (
                            <button
                              key={act.id}
                              onClick={() => handleOptionSelect(act)}
                              className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl transition-all cursor-pointer text-left ${
                                act.isPrimary
                                  ? 'btn-primary-action'
                                  : isDark
                                    ? 'hover:bg-slate-900 text-slate-200 hover:text-white'
                                    : 'hover:bg-slate-100 text-slate-800 hover:text-blue-600'
                              }`}
                            >
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                                act.isPrimary
                                  ? 'bg-black/20 text-current border-transparent'
                                  : isDark ? 'bg-slate-900 border-slate-800 text-amber-400' : 'bg-white border-slate-200 text-blue-600'
                              }`}>
                                <Icon size={14} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-black uppercase tracking-wide truncate">
                                    {act.name}
                                  </span>
                                  <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                                    act.isPrimary
                                      ? 'bg-black/20 text-current'
                                      : isDark ? 'bg-slate-800 text-amber-400' : 'bg-slate-200 text-blue-600'
                                  }`}>
                                    {act.badge}
                                  </span>
                                </div>
                                <div className={`text-[10px] truncate ${
                                  act.isPrimary ? 'opacity-80' : isDark ? 'text-slate-400' : 'text-slate-500'
                                }`}>
                                  {act.desc}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                  </div>

                  {/* Dropdown Footer */}
                  <div className={`p-2.5 border-t flex items-center justify-between text-[10px] ${
                    isDark ? 'bg-black/80 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}>
                    <span className="flex items-center gap-1 font-medium">
                      <Phone size={11} className={isDark ? 'text-amber-400' : 'text-blue-600'} /> +91 90252 55617
                    </span>
                    <a 
                      href="mailto:auratech008@gmail.com" 
                      className={`font-semibold hover:underline ${isDark ? 'text-amber-400' : 'text-blue-600'}`}
                    >
                      auratech008@gmail.com
                    </a>
                  </div>

                </div>
              )}
            </div>

            {/* High-Impact Primary Action Button */}
            {isHr ? (
              <button
                onClick={onOpenJobModal}
                className="btn-primary-action px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider active:scale-[0.98] transition-all flex items-center gap-2 group cursor-pointer shadow-xl font-black shrink-0 whitespace-nowrap"
              >
                <Briefcase className="w-4 h-4 shrink-0" />
                <span>Apply Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
              </button>
            ) : (
              <button
                onClick={() => onOpenBookModal()}
                className="btn-primary-action px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider active:scale-[0.98] transition-all flex items-center gap-2 group cursor-pointer shadow-xl font-black shrink-0 whitespace-nowrap"
              >
                <span>Book Project</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
              </button>
            )}

          </div>

          {/* MOBILE / TABLET CONTROLS */}
          <div className="lg:hidden flex items-center gap-2 shrink-0">
            
            {/* Quick Portal Badge */}
            <button
              onClick={() => setPortalMode(isHr ? 'student' : isStudent ? 'company' : 'hr')}
              title="Switch Mode"
              className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-black uppercase flex items-center gap-1.5 ${
                isHr
                  ? isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                  : isStudent
                    ? isDark ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-blue-50 text-blue-600 border-blue-200'
                    : isDark ? 'bg-purple-950/40 text-purple-300 border-purple-500/30' : 'bg-slate-900 text-white border-slate-700'
              }`}
            >
              {isHr ? <Briefcase size={13} /> : isStudent ? <GraduationCap size={13} /> : <Building2 size={13} />}
              <span>{isHr ? 'HR' : isStudent ? 'Student' : 'Company'}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className={`p-2 rounded-lg border ${
                isDark ? 'bg-slate-900 border-amber-500/30 text-amber-400' : 'bg-white border-slate-300 text-blue-600'
              }`}
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Mobile Action Button */}
            {isHr ? (
              <button
                onClick={() => onOpenJobModal()}
                className="btn-primary-action px-3 py-1.5 text-xs font-black rounded-lg uppercase tracking-wider whitespace-nowrap shadow-md"
              >
                Apply Now
              </button>
            ) : (
              <button
                onClick={() => onOpenBookModal()}
                className="btn-primary-action px-3 py-1.5 text-xs font-black rounded-lg uppercase tracking-wider whitespace-nowrap shadow-md"
              >
                Book
              </button>
            )}
            
            {/* Mobile Three-Dot / Menu Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-lg border focus:outline-none ${
                isDark ? 'text-amber-400 bg-slate-900 border-amber-500/30' : 'text-slate-800 bg-white border-slate-300'
              }`}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={18} /> : <MoreVertical size={18} />}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE DRAWER: Comprehensive Three-Dot List View */}
      {isMobileMenuOpen && (
        <div className={`lg:hidden fixed inset-0 top-[65px] z-40 p-5 flex flex-col justify-between border-b overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-200 ${
          isDark ? 'bg-black/95 border-amber-500/20' : 'bg-white/95 border-slate-200'
        }`}>
          
          <div className="space-y-6 pt-2 pb-6">
            
            {/* Header */}
            <div className={`p-3 rounded-2xl border flex items-center justify-between ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}>
              <div className="flex items-center gap-2">
                <MoreVertical size={16} className={isDark ? 'text-amber-400' : 'text-blue-600'} />
                <span className="text-xs font-black uppercase tracking-wider">All Options Directory</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isDark ? 'bg-black text-amber-400' : 'bg-white text-blue-600'
              }`}>
                {visibleNavOptions.length + portalModesList.length + actionOptionsList.length} Options
              </span>
            </div>

            {/* Portal Switcher */}
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">
                Portals & Modes
              </div>
              <div className="grid grid-cols-3 gap-2">
                {portalModesList.map((p) => {
                  const Icon = p.icon;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        handleOptionSelect(p);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 text-center transition-all ${
                        p.active
                          ? isDark ? 'bg-amber-500 text-black border-amber-400 font-black' : 'bg-blue-600 text-white border-blue-500 font-black'
                          : isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <Icon size={16} />
                      <span className="text-[10px] uppercase font-bold tracking-tight">{p.name.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sections & Pages List */}
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">
                Sections & Pages
              </div>
              <div className="space-y-1.5">
                {visibleNavOptions.map((opt) => {
                  const Icon = opt.icon;
                  return opt.href ? (
                    <a
                      key={opt.id}
                      href={opt.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`p-3 rounded-xl border flex items-center justify-between text-left ${
                        isDark ? 'bg-slate-900/60 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={16} className={isDark ? 'text-amber-400' : 'text-blue-600'} />
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wider">{opt.name}</div>
                          <div className="text-[10px] text-slate-400">{opt.desc}</div>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-slate-500" />
                    </a>
                  ) : (
                    <button
                      key={opt.id}
                      onClick={() => {
                        handleOptionSelect(opt);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full p-3 rounded-xl border flex items-center justify-between text-left ${
                        isDark ? 'bg-slate-900/60 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={16} className={isDark ? 'text-amber-400' : 'text-blue-600'} />
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wider">{opt.name}</div>
                          <div className="text-[10px] text-slate-400">{opt.desc}</div>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-slate-500" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Tools List */}
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">
                Actions & Quick Links
              </div>
              <div className="space-y-2">
                {actionOptionsList.map((act) => {
                  const Icon = act.icon;
                  return (
                    <button
                      key={act.id}
                      onClick={() => {
                        handleOptionSelect(act);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full p-3 rounded-xl border flex items-center justify-between text-left font-bold ${
                        act.isPrimary
                          ? 'btn-primary-action'
                          : isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon size={16} />
                        <span className="text-xs uppercase tracking-wide">{act.name}</span>
                      </div>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                        act.isPrimary ? 'bg-black/20 text-current' : isDark ? 'bg-slate-800 text-amber-400' : 'bg-white text-blue-600'
                      }`}>
                        {act.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          <div className="pt-4 border-t border-slate-800 text-center">
            <p className={`text-[10px] uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              © 2026 AURA TECH COLLECTIVE
            </p>
          </div>

        </div>
      )}
    </header>
  );
}
