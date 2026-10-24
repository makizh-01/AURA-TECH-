import React, { useState, useEffect } from 'react';
import { 
  Database, Download, Search, Filter, Plus, Trash2, Edit3, 
  CheckCircle2, Clock, AlertCircle, ArrowLeft, LogOut, Lock, 
  UserCheck, Shield, Sparkles, Sun, Moon, RefreshCw, BarChart2, Eye,
  Mail, MessageSquare, Briefcase
} from 'lucide-react';
import { PROJECT_TYPES } from '../data/auraData';
import { sendEmailNotification, sendWhatsAppNotification } from '../lib/notificationService';
import AnimatedOfficeBackground from '../components/AnimatedOfficeBackground';
import AdminHRApplicationsView from '../components/AdminHRApplicationsView';
import { getHRApplications, updateApplicationStatus, deleteApplication } from '../lib/hrService';

export default function AdminDashboard({ theme, onToggleTheme }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('aura_admin_auth') === 'true';
  });
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [adminTab, setAdminTab] = useState('bookings'); // 'bookings' | 'hr'
  const [submissions, setSubmissions] = useState([]);
  const [hrApplications, setHrApplications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [userTypeFilter, setUserTypeFilter] = useState('All');
  
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newBooking, setNewBooking] = useState({
    fullName: '',
    email: '',
    phone: '',
    userType: 'Student',
    projectTitle: '',
    projectType: PROJECT_TYPES[0],
    description: '',
    status: 'pending'
  });

  const isDark = theme === 'dark';

  useEffect(() => {
    loadSubmissions();
    loadHRApps();
  }, []);

  const loadSubmissions = () => {
    const data = JSON.parse(localStorage.getItem('aura_submissions') || '[]');
    setSubmissions(data);
  };

  const loadHRApps = async () => {
    const data = await getHRApplications();
    setHrApplications(data);
  };

  const handleUpdateHRStatus = async (id, status, notes) => {
    const updated = await updateApplicationStatus(id, status, notes);
    setHrApplications(updated);
  };

  const handleDeleteHRApplication = async (id) => {
    if (confirm('Are you sure you want to delete this job application?')) {
      const updated = await deleteApplication(id);
      setHrApplications(updated);
    }
  };


  const handleLogin = (e) => {
    e.preventDefault();
    const cleanId = loginEmail.trim().toLowerCase();
    const cleanPass = loginPassword.trim();

    // Temporary Admin credentials check: ID = admin, Password = 123
    if (
      (cleanId === 'admin' || cleanId === 'admin@auratech.com') && 
      (cleanPass === '123' || cleanPass === 'aura2026' || cleanPass === 'admin123')
    ) {
      sessionStorage.setItem('aura_admin_auth', 'true');
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid ID or Password. (Temporary Admin Login: admin / 123)');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('aura_admin_auth');
    setIsAuthenticated(false);
  };

  const updateStatus = (id, newStatus) => {
    const updated = submissions.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    );
    setSubmissions(updated);
    localStorage.setItem('aura_submissions', JSON.stringify(updated));
  };

  const updateAdminNotes = (id, notes) => {
    const updated = submissions.map(item => 
      item.id === id ? { ...item, admin_notes: notes } : item
    );
    setSubmissions(updated);
    localStorage.setItem('aura_submissions', JSON.stringify(updated));
  };

  const deleteSubmission = (id) => {
    if (confirm('Are you sure you want to delete this booking entry?')) {
      const updated = submissions.filter(item => item.id !== id);
      setSubmissions(updated);
      localStorage.setItem('aura_submissions', JSON.stringify(updated));
      if (selectedBooking?.id === id) setSelectedBooking(null);
    }
  };

  const handleAddManualBooking = (e) => {
    e.preventDefault();
    const entry = {
      id: Date.now(),
      client_name: newBooking.fullName,
      client_email: newBooking.email,
      client_phone: newBooking.phone,
      client_type: newBooking.userType,
      project_title: newBooking.projectTitle,
      project_type: newBooking.projectType,
      description: newBooking.description,
      status: newBooking.status,
      created_at: new Date().toISOString()
    };

    const updated = [entry, ...submissions];
    setSubmissions(updated);
    localStorage.setItem('aura_submissions', JSON.stringify(updated));
    setIsAddModalOpen(false);
    setNewBooking({
      fullName: '',
      email: '',
      phone: '',
      userType: 'Student',
      projectTitle: '',
      projectType: PROJECT_TYPES[0],
      description: '',
      status: 'pending'
    });
  };

  const downloadCSV = () => {
    if (submissions.length === 0) {
      alert("No project submissions recorded yet.");
      return;
    }

    const headers = ["Client Name", "Client Email", "Client Phone", "User Type", "Project Title", "Project Type", "Status", "Description", "Created At"];
    const rows = submissions.map(s => [
      `"${s.client_name || ''}"`,
      `"${s.client_email || ''}"`,
      `"${s.client_phone || ''}"`,
      `"${s.client_type || ''}"`,
      `"${s.project_title || ''}"`,
      `"${s.project_type || ''}"`,
      `"${s.status || 'pending'}"`,
      `"${(s.description || '').replace(/"/g, '""')}"`,
      `"${s.created_at || ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "AURA_TECH_MasterSheet_Sync.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtering
  const filteredSubmissions = submissions.filter(item => {
    const matchesSearch = 
      (item.client_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.client_email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.client_phone || '').includes(searchQuery) ||
      (item.project_title || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || (item.status || 'pending') === statusFilter;
    const matchesType = userTypeFilter === 'All' || item.client_type === userTypeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Analytics Metrics
  const totalCount = submissions.length;
  const pendingCount = submissions.filter(s => (!s.status || s.status === 'pending')).length;
  const inProgressCount = submissions.filter(s => s.status === 'in_progress').length;
  const completedCount = submissions.filter(s => s.status === 'completed').length;
  const studentCount = submissions.filter(s => s.client_type === 'Student').length;

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'
      }`}>
        {/* Office Environment Background: Data Command & Operations Suite */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <img 
            src="/office-admin.jpg" 
            alt="Data Operations Command Suite" 
            className={`w-full h-full object-cover object-center ${
              isDark ? 'opacity-[0.18] brightness-75 contrast-125' : 'opacity-[0.12] contrast-110'
            }`}
          />
          <div className={`absolute inset-0 ${
            isDark ? 'bg-black/80 backdrop-blur-md' : 'bg-white/80 backdrop-blur-md'
          }`} />
        </div>

        {/* Animated Office Interface Background */}
        <AnimatedOfficeBackground theme={theme} />

        <div className={`w-full max-w-md p-8 rounded-3xl border shadow-2xl relative z-10 ${
          isDark ? 'bg-slate-950/90 border-amber-500/30 backdrop-blur-xl' : 'bg-white/95 border-slate-200 backdrop-blur-xl'
        }`}>
          <div className="text-center mb-8">
            <div className="logo-badge bg-white p-2.5 rounded-2xl border border-slate-200 mx-auto mb-4">
              <img src="/logo.png" alt="AURA TECH Logo" className="h-10 w-auto object-contain" />
            </div>
            <h2 className={`text-2xl font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Admin <span className={isDark ? 'text-amber-400' : 'text-blue-600'}>Portal</span>
            </h2>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Enter admin credentials to access service bookings dashboard.
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-bold text-center">
              {loginError}
            </div>
          )}

          <div className={`p-3 rounded-xl border text-xs mb-4 text-center font-bold ${
            isDark ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-blue-50 border-blue-200 text-blue-700'
          }`}>
            🔐 Temporary Admin Access:<br />
            ID: <span className="underline font-mono font-black">admin</span> &nbsp;|&nbsp; Password: <span className="underline font-mono font-black">123</span>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Admin ID / Username
              </label>
              <input
                type="text"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin"
                className={`w-full rounded-xl py-3 px-4 text-xs focus:outline-none transition-colors border ${
                  isDark ? 'bg-slate-900 border-slate-800 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Password
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="123"
                className={`w-full rounded-xl py-3 px-4 text-xs focus:outline-none transition-colors border ${
                  isDark ? 'bg-slate-900 border-slate-800 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600'
                }`}
              />
            </div>

            <button
              type="submit"
              className="w-full btn-primary-action py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-6"
            >
              <Lock size={15} />
              Unlock Admin Portal
            </button>
          </form>

          <div className="mt-8 pt-4 border-t border-slate-800 text-center">
            <a href="/" className={`text-xs font-bold inline-flex items-center gap-1 hover:underline ${
              isDark ? 'text-amber-400' : 'text-blue-600'
            }`}>
              <ArrowLeft size={14} /> Back to Public Website
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 sm:p-8 relative overflow-hidden transition-colors duration-300 ${
      isDark ? 'bg-black text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Office Environment Background: Data Command & Operations Suite */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <img 
          src="/office-admin.jpg" 
          alt="Data Operations Command Suite" 
          className={`w-full h-full object-cover object-center ${
            isDark ? 'opacity-[0.14] brightness-75 contrast-125' : 'opacity-[0.09] contrast-110'
          }`}
        />
        <div className={`absolute inset-0 ${
          isDark ? 'bg-[#030305]/85 backdrop-blur-sm' : 'bg-[#f8fafc]/85 backdrop-blur-sm'
        }`} />
      </div>

      {/* Scroll-Reactive Animated Office Interface Background */}
      <AnimatedOfficeBackground theme={theme} />

      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        
        {/* Top Admin Header */}
        <header className={`p-6 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl ${
          isDark ? 'bg-slate-950 border-amber-500/30' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-4">
            <div className="logo-badge bg-white p-2.5 rounded-2xl border border-slate-200 shadow-md">
              <img src="/logo.png" alt="AURA TECH Logo" className="h-10 w-auto object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className={`text-xl sm:text-2xl font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  AURA TECH <span className={isDark ? 'text-amber-400' : 'text-blue-600'}>ADMIN PORTAL</span>
                </h1>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                  isDark ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                  Live MasterSheet
                </span>
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Central Management Dashboard for Service & Project Bookings (/admin)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <a
              href="/"
              className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                isDark ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
              }`}
            >
              <ArrowLeft size={14} /> Main Site
            </a>

            <button
              onClick={onToggleTheme}
              className={`p-2.5 rounded-xl border transition-all text-xs font-bold flex items-center gap-1.5 ${
                isDark ? 'bg-slate-900 border-amber-500/30 text-amber-400' : 'bg-white border-slate-300 text-blue-600 shadow-sm'
              }`}
              title="Toggle Theme"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </header>

        {/* Navigation Tabs (Bookings vs HR Applications) */}
        <div className={`flex flex-wrap items-center gap-2 p-1.5 rounded-2xl border shadow-lg ${
          isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <button
            onClick={() => setAdminTab('bookings')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              adminTab === 'bookings'
                ? isDark ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'bg-blue-600 text-white shadow-lg'
                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database size={15} />
            <span>Service Bookings</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              adminTab === 'bookings' ? 'bg-black/20 text-black font-black' : isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'
            }`}>
              {submissions.length}
            </span>
          </button>

          <button
            onClick={() => setAdminTab('hr')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              adminTab === 'hr'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black shadow-lg shadow-emerald-500/20 font-black'
                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase size={15} />
            <span>HR Service & Job Applications</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              adminTab === 'hr' ? 'bg-black/20 text-black font-black' : 'bg-emerald-500/20 text-emerald-400 font-bold'
            }`}>
              {hrApplications.length}
            </span>
          </button>
        </div>

        {adminTab === 'bookings' ? (
          <>
            {/* Analytics Overview Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Total Inquiries</div>
            <div className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{totalCount}</div>
            <div className="text-[10px] text-slate-500 mt-1">Recorded Submissions</div>
          </div>

          <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-950 border-amber-500/20' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">Pending Review</div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400">{pendingCount}</div>
            <div className="text-[10px] text-slate-500 mt-1">Requires Action</div>
          </div>

          <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">In Progress</div>
            <div className="text-2xl sm:text-3xl font-black text-indigo-400">{inProgressCount}</div>
            <div className="text-[10px] text-slate-500 mt-1">Active Projects</div>
          </div>

          <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="text-xs font-bold uppercase tracking-wider text-green-400 mb-1">Completed</div>
            <div className="text-2xl sm:text-3xl font-black text-green-400">{completedCount}</div>
            <div className="text-[10px] text-slate-500 mt-1">Delivered Projects</div>
          </div>

          <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">Student Ratio</div>
            <div className="text-2xl sm:text-3xl font-black text-blue-400">
              {totalCount > 0 ? Math.round((studentCount / totalCount) * 100) : 0}%
            </div>
            <div className="text-[10px] text-slate-500 mt-1">{studentCount} Students</div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className={`p-6 rounded-3xl border space-y-4 shadow-xl ${
          isDark ? 'bg-slate-950 border-amber-500/20' : 'bg-white border-slate-200'
        }`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search size={16} className={`absolute left-3.5 top-3.5 ${isDark ? 'text-amber-500/60' : 'text-slate-400'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Name, Email, Phone or Project..."
                className={`w-full rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none transition-colors border ${
                  isDark ? 'bg-black border-slate-800 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600'
                }`}
              />
            </div>

            {/* Actions: Add Booking & CSV Export */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className={`px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 border transition-all cursor-pointer ${
                  isDark ? 'bg-slate-900 border-amber-500/30 text-amber-400 hover:bg-slate-800' : 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
                }`}
              >
                <Plus size={15} /> Add Offline Booking
              </button>

              <button
                onClick={downloadCSV}
                className="btn-primary-action px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-lg cursor-pointer"
              >
                <Download size={15} /> Export MasterSheet CSV
              </button>
            </div>

          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800/60 text-xs font-bold">
            <span className="text-slate-500 uppercase tracking-wider text-[10px]">Filter Status:</span>
            {['All', 'pending', 'under_review', 'approved', 'in_progress', 'completed', 'cancelled'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg uppercase text-[10px] tracking-wider transition-colors ${
                  statusFilter === st 
                    ? isDark ? 'bg-amber-500 text-black font-extrabold' : 'bg-blue-600 text-white font-extrabold' 
                    : isDark ? 'bg-slate-900 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}

            <span className="text-slate-500 uppercase tracking-wider text-[10px] ml-4">User Type:</span>
            {['All', 'Student', 'Expert / Business'].map(ut => (
              <button
                key={ut}
                onClick={() => setUserTypeFilter(ut)}
                className={`px-3 py-1 rounded-lg uppercase text-[10px] tracking-wider transition-colors ${
                  userTypeFilter === ut 
                    ? isDark ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-blue-100 text-blue-700 border border-blue-300' 
                    : isDark ? 'bg-slate-900 text-slate-400' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {ut}
              </button>
            ))}
          </div>
        </div>

        {/* Main Submissions Data Table */}
        <div className={`rounded-3xl border overflow-hidden shadow-2xl ${
          isDark ? 'bg-slate-950 border-amber-500/20' : 'bg-white border-slate-200'
        }`}>
          <div className="overflow-x-auto">
            <table className={`w-full text-left text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <thead className={`uppercase tracking-wider font-black text-[10px] border-b ${
                isDark ? 'bg-black text-slate-400 border-amber-500/20' : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}>
                <tr>
                  <th className="p-4">Client Name</th>
                  <th className="p-4">Contact Info</th>
                  <th className="p-4">User Type</th>
                  <th className="p-4">Project Title & Type</th>
                  <th className="p-4">Status Workflow</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-800/60' : 'divide-slate-200'}`}>
                {filteredSubmissions.length > 0 ? (
                  filteredSubmissions.map((item) => {
                    const status = item.status || 'pending';
                    return (
                      <tr key={item.id} className={`transition-colors ${isDark ? 'hover:bg-slate-900/50' : 'hover:bg-slate-50'}`}>
                        
                        {/* Client Name */}
                        <td className="p-4">
                          <div className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.client_name}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">ID: #{item.id.toString().slice(-6)}</div>
                        </td>

                        {/* Contact Info */}
                        <td className="p-4">
                          <a href={`mailto:${item.client_email}`} className={`font-semibold hover:underline block ${isDark ? 'text-amber-400' : 'text-blue-600'}`}>
                            {item.client_email}
                          </a>
                          <a href={`tel:${item.client_phone}`} className="text-[11px] text-slate-400 block hover:underline">
                            {item.client_phone}
                          </a>
                        </td>

                        {/* User Type */}
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase ${
                            item.client_type === 'Student' 
                              ? isDark ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-blue-50 text-blue-700 border border-blue-200' 
                              : 'bg-purple-500/20 text-purple-600 border border-purple-500/30'
                          }`}>
                            {item.client_type}
                          </span>
                        </td>

                        {/* Project Title & Category */}
                        <td className="p-4">
                          <div className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{item.project_title}</div>
                          <div className="text-[10px] text-slate-500">{item.project_type}</div>
                        </td>

                        {/* Status Dropdown */}
                        <td className="p-4">
                          <select
                            value={status}
                            onChange={(e) => updateStatus(item.id, e.target.value)}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider focus:outline-none cursor-pointer border ${getStatusBadgeStyle(status, isDark)}`}
                          >
                            <option value="pending" className="bg-slate-900 text-yellow-400">Pending</option>
                            <option value="under_review" className="bg-slate-900 text-blue-400">Under Review</option>
                            <option value="approved" className="bg-slate-900 text-purple-400">Approved</option>
                            <option value="in_progress" className="bg-slate-900 text-indigo-400">In Progress</option>
                            <option value="completed" className="bg-slate-900 text-green-400">Completed</option>
                            <option value="cancelled" className="bg-slate-900 text-red-400">Cancelled</option>
                          </select>
                        </td>

                        {/* Date */}
                        <td className="p-4 text-[11px] text-slate-500">
                          {new Date(item.created_at).toLocaleDateString()}
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right space-x-1.5">
                          <button
                            onClick={() => sendEmailNotification(item)}
                            className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-colors"
                            title="Send Email Status Notice (auratech008@gmail.com)"
                          >
                            <Mail size={14} />
                          </button>
                          <button
                            onClick={() => sendWhatsAppNotification(item)}
                            className="p-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 transition-colors"
                            title="Send WhatsApp Alert (AURA TECH)"
                          >
                            <MessageSquare size={14} />
                          </button>
                          <button
                            onClick={() => setSelectedBooking(item)}
                            className={`p-2 rounded-lg border transition-colors ${
                              isDark ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-amber-400' : 'bg-slate-100 border-slate-300 text-slate-700 hover:text-blue-600'
                            }`}
                            title="View Full Booking Details"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => deleteSubmission(item.id)}
                            className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-colors"
                            title="Delete Booking"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>

                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-slate-500 text-xs">
                      No matching booking entries found in MasterSheet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </>
    ) : (
      <AdminHRApplicationsView
        theme={theme}
        applications={hrApplications}
        onRefresh={loadHRApps}
        onUpdateStatus={handleUpdateHRStatus}
        onDelete={handleDeleteHRApplication}
      />
    )}

  </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className={`w-full max-w-lg p-6 sm:p-8 rounded-3xl border shadow-2xl ${
            isDark ? 'bg-slate-950 border-amber-500/30' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <h3 className={`text-xl font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Booking <span className={isDark ? 'text-amber-400' : 'text-blue-600'}>Details</span>
              </h3>
              <button onClick={() => setSelectedBooking(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-slate-500 uppercase tracking-wider font-bold block">Client Name:</span>
                <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedBooking.client_name}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-500 uppercase tracking-wider font-bold block">Email:</span>
                  <span className={isDark ? 'text-amber-400' : 'text-blue-600'}>{selectedBooking.client_email}</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase tracking-wider font-bold block">Phone:</span>
                  <span className={isDark ? 'text-white' : 'text-slate-900'}>{selectedBooking.client_phone}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-500 uppercase tracking-wider font-bold block">User Type:</span>
                  <span className="font-bold text-slate-300">{selectedBooking.client_type}</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase tracking-wider font-bold block">Category:</span>
                  <span className="font-bold text-slate-300">{selectedBooking.project_type}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 uppercase tracking-wider font-bold block">Project Description:</span>
                <div className={`p-3 rounded-xl border mt-1 leading-relaxed ${
                  isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}>
                  {selectedBooking.description || 'No additional description provided.'}
                </div>
              </div>

              <div>
                <span className="text-slate-500 uppercase tracking-wider font-bold block mb-1">Admin Notes:</span>
                <textarea
                  rows={3}
                  defaultValue={selectedBooking.admin_notes || ''}
                  onBlur={(e) => updateAdminNotes(selectedBooking.id, e.target.value)}
                  placeholder="Add internal project notes or client call summary..."
                  className={`w-full p-3 rounded-xl border text-xs focus:outline-none ${
                    isDark ? 'bg-black border-slate-800 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600'
                  }`}
                />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => sendEmailNotification(selectedBooking)}
                  className="px-3 py-2 rounded-xl bg-blue-600/15 hover:bg-blue-600/25 text-blue-400 border border-blue-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  <Mail size={14} /> Send Email
                </button>
                <button
                  type="button"
                  onClick={() => sendWhatsAppNotification(selectedBooking)}
                  className="px-3 py-2 rounded-xl bg-green-500/15 hover:bg-green-500/25 text-green-400 border border-green-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare size={14} /> Send WhatsApp
                </button>
              </div>

              <button onClick={() => setSelectedBooking(null)} className="btn-primary-action px-6 py-2.5 rounded-xl font-bold text-xs uppercase cursor-pointer">
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Add Booking Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className={`w-full max-w-md p-6 sm:p-8 rounded-3xl border shadow-2xl ${
            isDark ? 'bg-slate-950 border-amber-500/30' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <h3 className={`text-xl font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Add Manual <span className={isDark ? 'text-amber-400' : 'text-blue-600'}>Booking</span>
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddManualBooking} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-400 uppercase tracking-wider mb-1">Client Full Name *</label>
                <input
                  type="text"
                  required
                  value={newBooking.fullName}
                  onChange={(e) => setNewBooking({ ...newBooking, fullName: e.target.value })}
                  placeholder="Client Name"
                  className={`w-full p-2.5 rounded-xl border ${
                    isDark ? 'bg-black border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 uppercase tracking-wider mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={newBooking.email}
                    onChange={(e) => setNewBooking({ ...newBooking, email: e.target.value })}
                    placeholder="client@gmail.com"
                    className={`w-full p-2.5 rounded-xl border ${
                      isDark ? 'bg-black border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 uppercase tracking-wider mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={newBooking.phone}
                    onChange={(e) => setNewBooking({ ...newBooking, phone: e.target.value })}
                    placeholder="+91 90252 55617"
                    className={`w-full p-2.5 rounded-xl border ${
                      isDark ? 'bg-black border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-400 uppercase tracking-wider mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  value={newBooking.projectTitle}
                  onChange={(e) => setNewBooking({ ...newBooking, projectTitle: e.target.value })}
                  placeholder="e.g. IoT Smart Home Dashboard"
                  className={`w-full p-2.5 rounded-xl border ${
                    isDark ? 'bg-black border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 uppercase tracking-wider mb-1">User Type</label>
                  <select
                    value={newBooking.userType}
                    onChange={(e) => setNewBooking({ ...newBooking, userType: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border ${
                      isDark ? 'bg-black border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="Student">Student</option>
                    <option value="Expert / Business">Expert / Business</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-400 uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={newBooking.projectType}
                    onChange={(e) => setNewBooking({ ...newBooking, projectType: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border ${
                      isDark ? 'bg-black border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    {PROJECT_TYPES.map(pt => (
                      <option key={pt} value={pt}>{pt}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-400 uppercase tracking-wider mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newBooking.description}
                  onChange={(e) => setNewBooking({ ...newBooking, description: e.target.value })}
                  placeholder="Notes from call or offline inquiry..."
                  className={`w-full p-2.5 rounded-xl border ${
                    isDark ? 'bg-black border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <button type="submit" className="w-full btn-primary-action py-3 rounded-xl font-extrabold text-xs uppercase mt-2">
                Save Booking to MasterSheet
              </button>
            </form>
          </div>
        </div>
      )}

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
