import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Send, Sparkles, User, Mail, Phone, FileText, Tag, Clock, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PROJECT_TYPES } from '../data/auraData';
import { saveBookingToDatabase } from '../lib/supabaseClient';
import { sendEmailNotification, sendWhatsAppNotification } from '../lib/notificationService';

export default function RegistrationModal({ theme, isOpen, onClose, initialService = '' }) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    userType: 'Student',
    projectTitle: '',
    projectType: PROJECT_TYPES[0],
    expectedTime: '1 - 2 Weeks',
    description: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const isDark = theme === 'dark';

  useEffect(() => {
    if (initialService) {
      setFormData(prev => ({
        ...prev,
        projectTitle: initialService,
        projectType: PROJECT_TYPES.includes(initialService) ? initialService : PROJECT_TYPES[0]
      }));
    }
  }, [initialService, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newSubmission = {
      id: Date.now(),
      client_name: formData.fullName,
      client_email: formData.email,
      client_phone: formData.phone,
      client_type: formData.userType,
      project_title: formData.projectTitle,
      project_type: formData.projectType,
      expected_time: formData.expectedTime,
      description: formData.description,
      created_at: new Date().toISOString()
    };

    // Save to SQL Database (if connected) or Local Storage
    await saveBookingToDatabase(newSubmission);

    const existing = JSON.parse(localStorage.getItem('aura_submissions') || '[]');
    localStorage.setItem('aura_submissions', JSON.stringify([newSubmission, ...existing]));

    setLoading(false);
    setSubmitted(true);

    // Trigger Confetti Celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.log('Confetti error:', err);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      userType: 'Student',
      projectTitle: '',
      projectType: PROJECT_TYPES[0],
      expectedTime: '1 - 2 Weeks',
      description: ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className={`relative w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl my-8 border overflow-hidden ${
        isDark ? 'bg-slate-950 border-amber-500/30' : 'bg-white border-slate-200'
      }`}>
        {/* Office Background Scene with low transparency */}
        <div className="absolute inset-0 pointer-events-none rounded-3xl overflow-hidden z-0">
          <img 
            src="/office-projects.jpg" 
            alt="Office Environment" 
            className={`w-full h-full object-cover object-center ${
              isDark ? 'opacity-[0.10] brightness-75 contrast-125' : 'opacity-[0.06] contrast-110'
            }`}
          />
          <div className={`absolute inset-0 ${
            isDark ? 'bg-slate-950/85 backdrop-blur-md' : 'bg-white/90 backdrop-blur-md'
          }`} />
        </div>
        
        {/* Close Button */}
        <button
          onClick={handleReset}
          className={`absolute top-6 right-6 p-2 rounded-full transition-colors ${
            isDark ? 'bg-slate-900 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
          }`}
        >
          <X size={20} />
        </button>

        {!submitted ? (
          <div>
            {/* Header */}
            <div className="mb-6">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest mb-2 border ${
                isDark ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-blue-50 border-blue-200 text-blue-600'
              }`}>
                <Sparkles size={13} />
                Instant Booking
              </div>
              <h3 className={`text-2xl sm:text-3xl font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Register <span className="text-gradient-main">Project</span>
              </h3>
              <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Provide your details to get started with AURA TECH engineers.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* User Type Toggle */}
              <div>
                <label className={`block text-xs font-extrabold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  I am a...
                </label>
                <div className={`grid grid-cols-2 gap-3 p-1 rounded-xl border ${
                  isDark ? 'bg-black border-slate-800' : 'bg-slate-100 border-slate-200'
                }`}>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, userType: 'Student' })}
                    className={`py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                      formData.userType === 'Student'
                        ? 'btn-primary-action shadow-md'
                        : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, userType: 'Expert / Business' })}
                    className={`py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                      formData.userType !== 'Student'
                        ? 'btn-primary-action shadow-md'
                        : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Expert / Business
                  </button>
                </div>
              </div>

              {/* Full Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Full Name *
                  </label>
                  <div className="relative">
                    <User size={16} className={`absolute left-3 top-3 ${isDark ? 'text-amber-500/60' : 'text-blue-500'}`} />
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="John Doe"
                      className={`w-full rounded-xl py-2.5 pl-9 pr-3 text-xs focus:outline-none transition-colors border ${
                        isDark ? 'bg-black border-slate-800 focus:border-amber-500 text-white' : 'bg-slate-50 border-slate-300 focus:border-blue-600 text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Contact No *
                  </label>
                  <div className="relative">
                    <Phone size={16} className={`absolute left-3 top-3 ${isDark ? 'text-amber-500/60' : 'text-blue-500'}`} />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className={`w-full rounded-xl py-2.5 pl-9 pr-3 text-xs focus:outline-none transition-colors border ${
                        isDark ? 'bg-black border-slate-800 focus:border-amber-500 text-white' : 'bg-slate-50 border-slate-300 focus:border-blue-600 text-slate-900'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Email Address *
                </label>
                <div className="relative">
                  <Mail size={16} className={`absolute left-3 top-3 ${isDark ? 'text-amber-500/60' : 'text-blue-500'}`} />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={formData.userType === 'Student' ? "student@college.edu" : "name@company.com"}
                    className={`w-full rounded-xl py-2.5 pl-9 pr-3 text-xs focus:outline-none transition-colors border ${
                      isDark ? 'bg-black border-slate-800 focus:border-amber-500 text-white' : 'bg-slate-50 border-slate-300 focus:border-blue-600 text-slate-900'
                    }`}
                  />
                </div>
                {formData.userType === 'Student' && (
                  <p className={`text-[10px] mt-1 font-medium ${isDark ? 'text-amber-400' : 'text-blue-600'}`}>
                    Enter your college Email ID for Student Verification & Discounts.
                  </p>
                )}
              </div>

              {/* Project Title & Project Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Project Title *
                  </label>
                  <div className="relative">
                    <FileText size={16} className={`absolute left-3 top-3 ${isDark ? 'text-amber-500/60' : 'text-blue-500'}`} />
                    <input
                      type="text"
                      required
                      value={formData.projectTitle}
                      onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                      placeholder="e.g. AI Chatbot App"
                      className={`w-full rounded-xl py-2.5 pl-9 pr-3 text-xs focus:outline-none transition-colors border ${
                        isDark ? 'bg-black border-slate-800 focus:border-amber-500 text-white' : 'bg-slate-50 border-slate-300 focus:border-blue-600 text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Project Type *
                  </label>
                  <div className="relative">
                    <Tag size={16} className={`absolute left-3 top-3 ${isDark ? 'text-amber-500/60' : 'text-blue-500'}`} />
                    <select
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className={`w-full rounded-xl py-2.5 pl-9 pr-3 text-xs focus:outline-none transition-colors appearance-none border ${
                        isDark ? 'bg-black border-slate-800 focus:border-amber-500 text-white' : 'bg-slate-50 border-slate-300 focus:border-blue-600 text-slate-900'
                      }`}
                    >
                      {PROJECT_TYPES.map((pt) => (
                        <option key={pt} value={pt} className={isDark ? "bg-slate-900 text-white" : "bg-white text-slate-900"}>
                          {pt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Expected Time / Target Deadline */}
              <div>
                <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Expected Time for Project *
                </label>
                <div className="relative">
                  <Clock size={16} className={`absolute left-3 top-3 ${isDark ? 'text-amber-500/60' : 'text-blue-500'}`} />
                  <select
                    value={formData.expectedTime}
                    onChange={(e) => setFormData({ ...formData, expectedTime: e.target.value })}
                    className={`w-full rounded-xl py-2.5 pl-9 pr-3 text-xs focus:outline-none transition-colors appearance-none border ${
                      isDark ? 'bg-black border-slate-800 focus:border-amber-500 text-white' : 'bg-slate-50 border-slate-300 focus:border-blue-600 text-slate-900'
                    }`}
                  >
                    <option value="Within 1 Week (Urgent)" className={isDark ? "bg-slate-900 text-white" : "bg-white text-slate-900"}>⚡ Within 1 Week (Urgent Priority)</option>
                    <option value="1 - 2 Weeks" className={isDark ? "bg-slate-900 text-white" : "bg-white text-slate-900"}>🚀 1 - 2 Weeks</option>
                    <option value="2 - 4 Weeks (Standard)" className={isDark ? "bg-slate-900 text-white" : "bg-white text-slate-900"}>📅 2 - 4 Weeks (Standard Delivery)</option>
                    <option value="1 - 2 Months (Enterprise)" className={isDark ? "bg-slate-900 text-white" : "bg-white text-slate-900"}>🏢 1 - 2 Months (Enterprise System)</option>
                    <option value="Flexible Timeline" className={isDark ? "bg-slate-900 text-white" : "bg-white text-slate-900"}>⏳ Flexible / No Rush</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Project Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your project goals, deadline, and key requirements..."
                  className={`w-full rounded-xl p-3 text-xs focus:outline-none transition-colors border ${
                    isDark ? 'bg-black border-slate-800 focus:border-amber-500 text-white' : 'bg-slate-50 border-slate-300 focus:border-blue-600 text-slate-900'
                  }`}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary-action py-3.5 rounded-xl text-xs uppercase tracking-wider font-extrabold shadow-lg flex items-center justify-center gap-2 mt-4 cursor-pointer"
              >
                {loading ? (
                  <span>Recording Submission...</span>
                ) : (
                  <>
                    <span>Submit Project Booking</span>
                    <Send size={14} />
                  </>
                )}
              </button>

            </form>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce border ${
              isDark ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : 'bg-blue-50 text-blue-600 border-blue-200'
            }`}>
              <CheckCircle2 size={36} />
            </div>

            <h3 className={`text-2xl font-black uppercase tracking-tight mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Submitted Successfully
            </h3>

            <p className={`text-xs sm:text-sm max-w-md mx-auto mb-6 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Your project booking is recorded! Send an instant Email confirmation from <span className="font-bold text-amber-400">auratech008@gmail.com</span> or send a WhatsApp alert to your mobile number.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto mb-6">
              <button
                type="button"
                onClick={() => sendEmailNotification({
                  client_name: formData.fullName,
                  client_email: formData.email,
                  client_phone: formData.phone,
                  client_type: formData.userType,
                  project_title: formData.projectTitle,
                  project_type: formData.projectType,
                  expected_time: formData.expectedTime,
                  description: formData.description,
                  status: 'Pending Review'
                })}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-blue-600/15 hover:bg-blue-600/25 text-blue-500 border border-blue-500/30 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Mail size={14} /> Send Email Notice
              </button>

              <button
                type="button"
                onClick={() => sendWhatsAppNotification({
                  client_name: formData.fullName,
                  client_email: formData.email,
                  client_phone: formData.phone,
                  client_type: formData.userType,
                  project_title: formData.projectTitle,
                  project_type: formData.projectType,
                  expected_time: formData.expectedTime,
                  description: formData.description,
                  status: 'Pending Review'
                })}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-green-500/15 hover:bg-green-500/25 text-green-400 border border-green-500/30 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageSquare size={14} /> Send WhatsApp Alert
              </button>
            </div>

            <button
              onClick={handleReset}
              className="btn-primary-action py-3 px-8 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg cursor-pointer"
            >
              Close Window
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
