import React from 'react';
import { Mail, Instagram, ArrowRight, MessageSquare, Send, CheckCircle2, Phone, Headphones, Briefcase } from 'lucide-react';

export default function ContactSection({ theme, portalMode, onOpenBookModal, onOpenJobModal }) {
  const isDark = theme === 'dark';
  const isHr = portalMode === 'hr';

  return (
    <section id="contact" className={`py-24 relative overflow-hidden scroll-mt-20 border-t ${
      isDark ? 'bg-black/40 border-amber-500/15' : 'bg-slate-50/70 border-slate-200'
    }`}>
      {/* Office Environment Background: Executive Consultation Lobby & Reception */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <img 
          src="/office-contact.jpg" 
          alt="Executive Reception & Client Consultation Lounge" 
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
        
        <div className={`glass-card rounded-3xl p-8 sm:p-12 border relative overflow-hidden ${
          isDark ? 'border-amber-500/20' : 'border-slate-200 shadow-xl'
        }`}>
          <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
            isDark ? 'bg-amber-500/10' : 'bg-blue-500/10'
          }`}></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column */}
            <div>
              <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest mb-6 border ${
                isDark 
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                  : 'bg-blue-50 border-blue-200 text-blue-600'
              }`}>
                <MessageSquare className="w-3.5 h-3.5" />
                {isHr ? 'HR & Careers Helpdesk' : "Let's Build Together"}
              </div>

              <h2 className={`text-3xl sm:text-5xl font-black uppercase tracking-tight mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {isHr ? (
                  <>Connect with <span className="text-gradient-main">HR Team</span></>
                ) : (
                  <>Connect with <span className="text-gradient-main">Aura</span></>
                )}
              </h2>

              <p className={`text-sm sm:text-base leading-relaxed mb-8 max-w-lg ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {isHr 
                  ? 'Have questions about open roles, recruitment timelines, or team culture? Reach out to our talent acquisition team directly.'
                  : 'Have a project in mind or need technical assistance? Our engineering & design team is ready to help you accelerate your vision.'}
              </p>

              <div className="space-y-4 mb-8">
                
                {/* AURA TECH Phone */}
                <div className={`flex items-start gap-4 p-4 rounded-xl border ${
                  isDark ? 'bg-slate-900/90 border-amber-500/20' : 'bg-white border-slate-200 shadow-sm'
                }`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-50 text-blue-600'
                  }`}>
                    <Phone size={20} />
                  </div>
                  <div>
                    <div className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>AURA TECH Direct</div>
                    <a href="tel:9025255617" className={`font-extrabold text-sm sm:text-base transition-colors ${
                      isDark ? 'text-white hover:text-amber-400' : 'text-slate-900 hover:text-blue-600'
                    }`}>
                      +91 90252 55617
                    </a>
                    <div className="text-[11px] text-slate-500 mt-0.5">Direct line for project consultations & business inquiries.</div>
                  </div>
                </div>

                {/* HELP DESK Phone */}
                <div className={`flex items-start gap-4 p-4 rounded-xl border ${
                  isDark ? 'bg-slate-900/90 border-amber-500/20' : 'bg-white border-slate-200 shadow-sm'
                }`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-50 text-blue-600'
                  }`}>
                    <Headphones size={20} />
                  </div>
                  <div>
                    <div className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>HELP DESK</div>
                    <a href="tel:9345256633" className={`font-extrabold text-sm sm:text-base transition-colors ${
                      isDark ? 'text-white hover:text-amber-400' : 'text-slate-900 hover:text-blue-600'
                    }`}>
                      +91 93452 56633
                    </a>
                    <div className="text-[11px] text-slate-500 mt-0.5">Instant student project assistance & technical support.</div>
                  </div>
                </div>

                {/* Email */}
                <div className={`flex items-start gap-4 p-4 rounded-xl border ${
                  isDark ? 'bg-slate-900/90 border-amber-500/20' : 'bg-white border-slate-200 shadow-sm'
                }`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-50 text-blue-600'
                  }`}>
                    <Mail size={20} />
                  </div>
                  <div>
                    <div className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Official Email</div>
                    <a href="mailto:auratech008@gmail.com" className={`font-extrabold text-sm sm:text-base lowercase transition-colors ${
                      isDark ? 'text-white hover:text-amber-400' : 'text-slate-900 hover:text-blue-600'
                    }`}>
                      auratech008@gmail.com
                    </a>
                    <div className="text-[11px] text-slate-500 mt-0.5">Our response team typically replies within 24 hours.</div>
                  </div>
                </div>

                {/* Instagram */}
                <div className={`flex items-start gap-4 p-4 rounded-xl border ${
                  isDark ? 'bg-slate-900/90 border-amber-500/20' : 'bg-white border-slate-200 shadow-sm'
                }`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-50 text-blue-600'
                  }`}>
                    <Instagram size={20} />
                  </div>
                  <div>
                    <div className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Instagram Channel</div>
                    <a
                      href="https://www.instagram.com/__aura_tech_?igsh=enZ0aXU4aWtsaGJw"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`font-extrabold text-sm sm:text-base transition-colors ${
                        isDark ? 'text-white hover:text-amber-400' : 'text-slate-900 hover:text-blue-600'
                      }`}
                    >
                      @__aura_tech_
                    </a>
                    <div className="text-[11px] text-slate-500 mt-0.5">Follow us for latest updates & project showcases.</div>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Column Card */}
            <div className={`p-8 rounded-2xl border flex flex-col justify-between text-center relative ${
              isDark ? 'bg-slate-950 border-amber-500/30' : 'bg-white border-slate-200 shadow-lg'
            }`}>
              <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center mx-auto mb-6 ${
                isDark ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-blue-50 border-blue-200 text-blue-600'
              }`}>
                {isHr ? <Briefcase size={28} /> : <Send size={28} />}
              </div>

              <h3 className={`text-2xl font-black uppercase tracking-tight mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {isHr ? 'Ready to Join Our Team?' : 'Ready to Get Started?'}
              </h3>

              <p className={`text-xs sm:text-sm mb-6 max-w-sm mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {isHr 
                  ? 'Submit your application, portfolio link, and technical skills directly through our recruitment portal.'
                  : 'Submit your project requirements through our quick registration form. Students get special project guidance discounts!'}
              </p>

              {isHr ? (
                <button
                  onClick={() => onOpenJobModal && onOpenJobModal()}
                  className="w-full btn-primary-action py-4 rounded-xl text-xs uppercase tracking-wider font-extrabold shadow-lg flex items-center justify-center gap-2 mb-4 cursor-pointer"
                >
                  Apply Now
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  onClick={onOpenBookModal}
                  className="w-full btn-primary-action py-4 rounded-xl text-xs uppercase tracking-wider font-extrabold shadow-lg flex items-center justify-center gap-2 mb-4 cursor-pointer"
                >
                  Register Project Now
                  <ArrowRight size={16} />
                </button>
              )}

              <div className={`flex items-center justify-center gap-4 text-[11px] font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                <span className="flex items-center gap-1">
                  <CheckCircle2 size={12} className={isDark ? 'text-amber-400' : 'text-blue-600'} /> 
                  {isHr ? '48hr Review' : 'Free Consultation'}
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 size={12} className={isDark ? 'text-amber-400' : 'text-blue-600'} /> 
                  {isHr ? 'Remote & Hybrid' : 'Fast Turnaround'}
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
