import React, { useState } from 'react';
import { 
  X, Search, CheckCircle2, Clock, AlertCircle, 
  GraduationCap, Building2, User, Phone, Mail, FileText, ArrowRight, ShieldCheck, MessageSquare
} from 'lucide-react';
import { sendEmailNotification, sendWhatsAppNotification } from '../lib/notificationService';

export default function ClientDashboardModal({ theme, isOpen, onClose, onOpenBookModal }) {
  const [searchKey, setSearchKey] = useState('');
  const [foundBookings, setFoundBookings] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const isDark = theme === 'dark';

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchKey.trim()) return;

    const allSubmissions = JSON.parse(localStorage.getItem('aura_submissions') || '[]');
    const results = allSubmissions.filter(item => 
      (item.client_email || '').toLowerCase() === searchKey.trim().toLowerCase() ||
      (item.client_phone || '').includes(searchKey.trim())
    );

    setFoundBookings(results);
    setHasSearched(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className={`w-full max-w-2xl p-6 sm:p-8 rounded-3xl border shadow-2xl relative max-h-[90vh] overflow-y-auto overflow-x-hidden ${
        isDark ? 'bg-slate-950 border-amber-500/30' : 'bg-white border-slate-200'
      }`}>
        {/* Office Background Scene with low transparency */}
        <div className="absolute inset-0 pointer-events-none rounded-3xl overflow-hidden z-0">
          <img 
            src="/office-advantage.jpg" 
            alt="Office Environment" 
            className={`w-full h-full object-cover object-center ${
              isDark ? 'opacity-[0.10] brightness-75 contrast-125' : 'opacity-[0.06] contrast-110'
            }`}
          />
          <div className={`absolute inset-0 ${
            isDark ? 'bg-slate-950/85 backdrop-blur-md' : 'bg-white/90 backdrop-blur-md'
          }`} />
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`text-xl sm:text-2xl font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Client <span className={isDark ? 'text-amber-400' : 'text-blue-600'}>Front Dashboard</span>
              </h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                isDark ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                Live Tracker
              </span>
            </div>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Check real-time status of your Student or Company / Organisation project booking.
            </p>
          </div>

          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="space-y-4 mb-6">
          <label className={`block text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Enter Your Registered Email or Phone Number
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={16} className={`absolute left-3.5 top-3.5 ${isDark ? 'text-amber-400' : 'text-blue-600'}`} />
              <input
                type="text"
                required
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                placeholder="e.g. client@gmail.com or 9025255617"
                className={`w-full rounded-xl py-3 pl-10 pr-4 text-xs focus:outline-none transition-colors border ${
                  isDark ? 'bg-black border-slate-800 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600'
                }`}
              />
            </div>
            <button
              type="submit"
              className="btn-primary-action px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              Track Project
            </button>
          </div>
        </form>

        {/* Search Results */}
        {hasSearched && (
          <div className="space-y-4">
            {foundBookings && foundBookings.length > 0 ? (
              foundBookings.map((item) => (
                <div 
                  key={item.id} 
                  className={`p-5 rounded-2xl border space-y-3 ${
                    isDark ? 'bg-slate-900/80 border-amber-500/20' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`font-black text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.project_title}</div>
                      <div className="text-[11px] text-slate-500">Category: {item.project_type}</div>
                    </div>

                    <span className={`px-3 py-1 rounded-lg text-[11px] font-extrabold uppercase tracking-wider border ${getStatusBadgeStyle(item.status || 'pending', isDark)}`}>
                      {(item.status || 'pending').replace('_', ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-800/40">
                    <div>
                      <span className="text-slate-500 uppercase text-[10px] font-bold block">Account Category:</span>
                      <span className={`font-bold inline-flex items-center gap-1 ${
                        item.client_type === 'Student' ? 'text-amber-400' : 'text-purple-400'
                      }`}>
                        {item.client_type === 'Student' ? <GraduationCap size={14} /> : <Building2 size={14} />}
                        {item.client_type}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 uppercase text-[10px] font-bold block">Booking Date:</span>
                      <span className="text-slate-300 font-medium">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 uppercase text-[10px] font-bold block">Expected Time:</span>
                      <span className={`font-extrabold ${isDark ? 'text-amber-400' : 'text-blue-600'}`}>
                        {item.expected_time || '1 - 2 Weeks'}
                      </span>
                    </div>
                  </div>

                  {item.description && (
                    <div className="text-xs text-slate-400 pt-2 border-t border-slate-800/40">
                      <span className="text-slate-500 font-bold block text-[10px] uppercase">Notes / Specs:</span>
                      {item.description}
                    </div>
                  )}

                  {/* Project Progress Steps Visualizer */}
                  <div className="pt-3">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Project Execution Pipeline</div>
                    <div className="grid grid-cols-4 gap-1 text-[10px] font-bold text-center">
                      <div className={`p-2 rounded-lg border ${
                        item.status === 'pending' || item.status === 'under_review' || item.status === 'approved' || item.status === 'in_progress' || item.status === 'completed'
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : 'bg-slate-900 text-slate-600 border-slate-800'
                      }`}>1. Received</div>
                      <div className={`p-2 rounded-lg border ${
                        item.status === 'approved' || item.status === 'in_progress' || item.status === 'completed'
                          ? 'bg-blue-500/20 text-blue-400 border-blue-500/40' : 'bg-slate-900 text-slate-600 border-slate-800'
                      }`}>2. Approved</div>
                      <div className={`p-2 rounded-lg border ${
                        item.status === 'in_progress' || item.status === 'completed'
                          ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40' : 'bg-slate-900 text-slate-600 border-slate-800'
                      }`}>3. Building</div>
                      <div className={`p-2 rounded-lg border ${
                        item.status === 'completed'
                          ? 'bg-green-500/20 text-green-400 border-green-500/40' : 'bg-slate-900 text-slate-600 border-slate-800'
                      }`}>4. Delivered</div>
                    </div>
                  </div>

                  {/* Direct Email & WhatsApp Quick Alert Actions */}
                  <div className="pt-3 border-t border-slate-800/40 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Instant Client Notification:</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => sendEmailNotification(item)}
                        className="px-3 py-1.5 rounded-lg bg-blue-600/15 hover:bg-blue-600/25 text-blue-400 border border-blue-500/30 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                      >
                        <Mail size={12} /> Email Notice
                      </button>
                      <button
                        onClick={() => sendWhatsAppNotification(item)}
                        className="px-3 py-1.5 rounded-lg bg-green-500/15 hover:bg-green-500/25 text-green-400 border border-green-500/30 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                      >
                        <MessageSquare size={12} /> WhatsApp Alert
                      </button>
                    </div>
                  </div>

                </div>
              ))
            ) : (
              <div className="p-8 text-center border rounded-2xl border-slate-800 text-slate-400 text-xs">
                No active project bookings found for <span className="font-bold text-white">"{searchKey}"</span>.
                <div className="mt-4">
                  <button 
                    onClick={() => { onClose(); onOpenBookModal(); }}
                    className="btn-primary-action px-5 py-2.5 rounded-xl font-bold uppercase text-[11px]"
                  >
                    Book a New Project Now
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

function getStatusBadgeStyle(status, isDark) {
  switch (status) {
    case 'pending':
      return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
    case 'under_review':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
    case 'approved':
      return 'bg-purple-500/20 text-purple-400 border-purple-500/40';
    case 'in_progress':
      return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40';
    case 'completed':
      return 'bg-green-500/20 text-green-400 border-green-500/40';
    case 'cancelled':
      return 'bg-red-500/20 text-red-400 border-red-500/40';
    default:
      return 'bg-slate-800 text-slate-300 border-slate-700';
  }
}
