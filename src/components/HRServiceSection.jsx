import React, { useState } from 'react';
import { 
  Briefcase, Sparkles, ArrowRight, CheckCircle2, 
  Code, Cpu, Layers, Palette, Shield, Rocket, 
  MapPin, Clock, Users, FileSpreadsheet, ExternalLink, Download
} from 'lucide-react';
import { POPULAR_ROLES, ONEDRIVE_SHEET_URL } from '../lib/hrService';

const OPEN_POSITIONS = [
  {
    title: 'Full Stack Developer',
    dept: 'Core Engineering',
    type: 'Full-time / Paid Internship',
    location: 'Hybrid / Remote',
    experience: 'Fresher - 2 Years',
    skills: ['React', 'Node.js', 'PostgreSQL', 'TailwindCSS'],
    description: 'Build fast, responsive web systems and scalable backend microservices for high-impact client projects.'
  },
  {
    title: 'UI/UX Designer',
    dept: 'Product Design',
    type: 'Full-time / Project-based',
    location: 'Remote',
    experience: '0 - 2 Years',
    skills: ['Figma', 'Prototyping', 'Design Systems', 'Micro-interactions'],
    description: 'Craft visually stunning user interfaces and intuitive interaction flows that captivate enterprise clients.'
  },
  {
    title: 'AI / Machine Learning Engineer',
    dept: 'AI & Research Labs',
    type: 'Full-time / Hybrid',
    location: 'Chennai / Hybrid',
    experience: '1 - 3 Years',
    skills: ['Python', 'PyTorch', 'LangChain', 'FastAPI', 'LLM Fine-tuning'],
    description: 'Architect cutting-edge generative AI agents, smart copilots, and intelligent workflow automations.'
  },
  {
    title: 'Mobile App Developer',
    dept: 'Mobile Solutions',
    type: 'Full-time',
    location: 'Hybrid',
    experience: 'Fresher - 2 Years',
    skills: ['Flutter', 'React Native', 'Firebase', 'State Management'],
    description: 'Develop high-performance, cross-platform Android and iOS applications with fluid 60fps animations.'
  },
  {
    title: 'Video Editor & Motion Designer',
    dept: 'Creative Media',
    type: 'Contract / Full-time',
    location: 'Remote',
    experience: '0 - 2 Years',
    skills: ['Premiere Pro', 'After Effects', 'AI Video Generation', 'Color Grading'],
    description: 'Transform raw footage and product demos into cinematic video reels and viral marketing narratives.'
  },
  {
    title: 'IoT & Embedded Systems Engineer',
    dept: 'Hardware Engineering',
    type: 'Project-based / Full-time',
    location: 'Onsite / Lab',
    experience: '0 - 3 Years',
    skills: ['ESP32', 'Arduino', 'C/C++', 'MQTT', 'Circuit Design'],
    description: 'Engineer smart sensor grids, industrial telemetry dashboards, and intelligent microcontroller hardware.'
  }
];

const PERKS = [
  {
    icon: Rocket,
    title: 'High-Impact Work',
    desc: 'Work on production systems used by real enterprises, academic datathons, and startups.'
  },
  {
    icon: Users,
    title: 'Mentorship & Growth',
    desc: 'Direct pair programming with senior engineers, founders, and domain experts.'
  },
  {
    icon: Clock,
    title: 'Flexible Schedule',
    desc: 'Result-oriented workflows with remote-friendly culture and flexible study-work balance.'
  },
  {
    icon: Sparkles,
    title: 'Competitive Compensation',
    desc: 'Top-tier stipends for students and competitive industry packages for experienced creators.'
  }
];

export default function HRServiceSection({ theme, onOpenJobModal }) {
  const isDark = theme === 'dark';
  const [selectedDept, setSelectedDept] = useState('All');

  const filteredRoles = selectedDept === 'All' 
    ? OPEN_POSITIONS 
    : OPEN_POSITIONS.filter(r => r.dept.toLowerCase().includes(selectedDept.toLowerCase()));

  return (
    <section id="hr-portal" className={`py-20 relative overflow-hidden transition-colors duration-300 ${
      isDark ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4 border bg-amber-500/10 text-amber-400 border-amber-500/30">
            <Briefcase size={14} />
            <span>AURA TECH HR & CAREERS SERVICE PORTAL</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight mb-4 leading-tight">
            Build The Future of Tech. <br />
            <span className="text-gradient-main">Join The AURA Team.</span>
          </h2>

          <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            We are constantly looking for ambitious developers, designers, and AI creators. 
            Submit your application today—every submission is reviewed directly by our leadership team 
            and cataloged in our live recruitment database.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <button
              onClick={() => onOpenJobModal()}
              className="btn-primary-action px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl cursor-pointer"
            >
              <span>Apply Now</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Culture / Perks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {PERKS.map((perk, idx) => {
            const Icon = perk.icon;
            return (
              <div
                key={idx}
                className={`p-6 rounded-3xl border transition-all hover:scale-102 ${
                  isDark 
                    ? 'bg-slate-950/80 border-slate-800 hover:border-amber-500/40 shadow-xl' 
                    : 'bg-white border-slate-200 shadow-md hover:shadow-lg'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mb-4">
                  <Icon size={22} />
                </div>
                <h4 className="font-black text-sm uppercase tracking-wide mb-2">{perk.title}</h4>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{perk.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Open Positions Section Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tight">Active Job Openings</h3>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Select a position to view requirements and launch your job application
            </p>
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl border border-slate-800 bg-slate-900/60 text-xs">
            {['All', 'Engineering', 'Design', 'AI', 'Media'].map(dept => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1.5 rounded-lg font-bold text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                  selectedDept === dept
                    ? 'bg-amber-500 text-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredRoles.map((role, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-3xl border flex flex-col justify-between transition-all hover:border-amber-500/50 ${
                isDark 
                  ? 'bg-slate-950 border-slate-800/80 shadow-xl' 
                  : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${
                    isDark 
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' 
                      : 'bg-blue-50 text-blue-600 border-blue-200'
                  }`}>
                    {role.dept}
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold">{role.location}</span>
                </div>

                <h4 className="text-lg font-black uppercase tracking-tight mb-2">{role.title}</h4>
                <p className={`text-xs mb-4 line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {role.description}
                </p>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {role.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                        isDark 
                          ? 'bg-slate-900 border-slate-800 text-slate-300' 
                          : 'bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-800/40 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">{role.experience}</span>
                <button
                  onClick={() => onOpenJobModal(role.title)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                >
                  <span>Apply Now</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Role / General Application Banner */}
        <div className={`p-8 rounded-3xl border text-center max-w-4xl mx-auto ${
          isDark 
            ? 'bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-amber-500/30 shadow-2xl' 
            : 'bg-gradient-to-r from-blue-50 via-white to-indigo-50 border-blue-200 shadow-lg'
        }`}>
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
            <Sparkles size={26} />
          </div>
          <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight mb-2">
            Don't See Your Exact Role? <span className="text-gradient-main">Apply Anyway!</span>
          </h3>
          <p className={`text-xs sm:text-sm max-w-2xl mx-auto mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            We create new positions for exceptional minds. Submit your resume, portfolio link, and core skills. 
            Our recruitment leads will reach out within 48 hours for suitable upcoming opportunities.
          </p>

          <button
            onClick={() => onOpenJobModal('Other')}
            className="btn-primary-action px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer shadow-xl"
          >
            <span>Apply Now</span>
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </section>
  );
}
