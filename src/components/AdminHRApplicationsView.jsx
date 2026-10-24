import React, { useState } from 'react';
import { 
  Briefcase, Download, Search, Filter, Plus, Trash2, Edit3, 
  CheckCircle2, Clock, AlertCircle, Sparkles, RefreshCw, Eye,
  Mail, MessageSquare, ExternalLink, FileSpreadsheet, FileText,
  Paperclip, Globe, Settings, Cloud, Share2, Check, User
} from 'lucide-react';
import { 
  POPULAR_ROLES, 
  APPLICATION_STATUSES, 
  ONEDRIVE_SHEET_URL,
  formatStatusLabel, 
  exportToHRServiceExcel, 
  generateCandidatePDF, 
  openCandidateResume,
  getOneDriveWebhookUrl,
  setOneDriveWebhookUrl,
  submitJobApplication
} from '../lib/hrService';

export default function AdminHRApplicationsView({ 
  theme, 
  applications = [], 
  onRefresh, 
  onUpdateStatus, 
  onDelete 
}) {
  const isDark = theme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'excel'

  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [editNotes, setEditNotes] = useState('');
  const [editStatus, setEditStatus] = useState('pending');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [webhookUrl, setWebhookUrlState] = useState(getOneDriveWebhookUrl());
  const [webhookSaved, setWebhookSaved] = useState(false);

  // New offline candidate state
  const [newCandidate, setNewCandidate] = useState({
    fullName: '',
    age: '',
    role: POPULAR_ROLES[0],
    customRole: '',
    portfolioLink: '',
    phone: '',
    email: '',
    skills: '',
    resumeFileName: ''
  });

  // Calculate Metrics
  const totalApps = applications.length;
  const pendingApps = applications.filter(a => a.status === 'pending').length;
  const underReviewApps = applications.filter(a => a.status === 'under_review').length;
  const shortlistedApps = applications.filter(a => a.status === 'shortlisted').length;
  const interviewApps = applications.filter(a => a.status === 'interview_scheduled').length;
  const hiredApps = applications.filter(a => a.status === 'hired').length;

  // Filtered List
  const filteredApps = applications.filter(app => {
    const matchesSearch = 
      (app.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.phone || '').includes(searchQuery) ||
      (app.role || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.skills || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.id || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    const matchesRole = roleFilter === 'All' || app.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleOpenCandidateModal = (candidate) => {
    setSelectedCandidate(candidate);
    setEditNotes(candidate.adminNotes || '');
    setEditStatus(candidate.status || 'pending');
  };

  const handleSaveAssessment = async () => {
    if (!selectedCandidate) return;
    await onUpdateStatus(selectedCandidate.id, editStatus, editNotes);
    setSelectedCandidate(null);
  };

  const handleSaveWebhook = (e) => {
    e.preventDefault();
    setOneDriveWebhookUrl(webhookUrl.trim());
    setWebhookSaved(true);
    setTimeout(() => setWebhookSaved(false), 3000);
  };

  const handleAddManualCandidate = async (e) => {
    e.preventDefault();
    const finalRole = newCandidate.role === 'Other' && newCandidate.customRole.trim() 
      ? newCandidate.customRole.trim() 
      : newCandidate.role;

    await submitJobApplication({
      ...newCandidate,
      role: finalRole,
      resumeFileName: newCandidate.resumeFileName || 'Offline_Paper_CV.pdf'
    });

    setIsAddModalOpen(false);
    setNewCandidate({
      fullName: '',
      age: '',
      role: POPULAR_ROLES[0],
      customRole: '',
      portfolioLink: '',
      phone: '',
      email: '',
      skills: '',
      resumeFileName: ''
    });
    if (onRefresh) onRefresh();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* HR KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className={`p-4.5 rounded-2xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Total Applicants</div>
          <div className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{totalApps}</div>
          <div className="text-[10px] text-slate-500 mt-1">HR Database</div>
        </div>

        <div className={`p-4.5 rounded-2xl border ${isDark ? 'bg-slate-950 border-amber-500/20' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-1">Pending Review</div>
          <div className="text-2xl font-black text-amber-400">{pendingApps}</div>
          <div className="text-[10px] text-slate-500 mt-1">Awaiting Initial Check</div>
        </div>

        <div className={`p-4.5 rounded-2xl border ${isDark ? 'bg-slate-950 border-blue-500/20' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="text-[10px] font-bold uppercase tracking-wider text-blue-400 mb-1">Under Review</div>
          <div className="text-2xl font-black text-blue-400">{underReviewApps}</div>
          <div className="text-[10px] text-slate-500 mt-1">In Technical Screening</div>
        </div>

        <div className={`p-4.5 rounded-2xl border ${isDark ? 'bg-slate-950 border-purple-500/20' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="text-[10px] font-bold uppercase tracking-wider text-purple-400 mb-1">Shortlisted</div>
          <div className="text-2xl font-black text-purple-400">{shortlistedApps}</div>
          <div className="text-[10px] text-slate-500 mt-1">Top Talent Profiles</div>
        </div>

        <div className={`p-4.5 rounded-2xl border ${isDark ? 'bg-slate-950 border-indigo-500/20' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 mb-1">Interviews</div>
          <div className="text-2xl font-black text-indigo-400">{interviewApps}</div>
          <div className="text-[10px] text-slate-500 mt-1">Scheduled Rounds</div>
        </div>

        <div className={`p-4.5 rounded-2xl border ${isDark ? 'bg-slate-950 border-emerald-500/20' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1">Hired / Selected</div>
          <div className="text-2xl font-black text-emerald-400">{hiredApps}</div>
          <div className="text-[10px] text-slate-500 mt-1">Offers Extended</div>
        </div>
      </div>

      {/* Action Toolbar & Search */}
      <div className={`p-5 sm:p-6 rounded-3xl border space-y-4 shadow-xl ${
        isDark ? 'bg-slate-950 border-amber-500/20' : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative w-full lg:w-96">
            <Search size={16} className={`absolute left-3.5 top-3.5 ${isDark ? 'text-amber-500/60' : 'text-slate-400'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate name, role, email, skills..."
              className={`w-full rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none transition-colors border ${
                isDark ? 'bg-black border-slate-800 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600'
              }`}
            />
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 justify-end">
            
            {/* Add Offline Candidate */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border transition-all cursor-pointer ${
                isDark ? 'bg-slate-900 border-amber-500/30 text-amber-400 hover:bg-slate-800' : 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
              }`}
            >
              <Plus size={15} /> Add Candidate
            </button>

            {/* Open OneDrive Excel Sheet */}
            <a
              href={ONEDRIVE_SHEET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2.5 rounded-xl bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-400 border border-emerald-500/30 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm"
              title="Open Live OneDrive Master Excel Sheet"
            >
              <FileSpreadsheet size={15} />
              <span>Open OneDrive Sheet</span>
              <ExternalLink size={12} />
            </a>

            {/* Export to AURA TECH HR SERVICE.xlsx */}
            <button
              onClick={() => exportToHRServiceExcel(applications)}
              className="btn-primary-action px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-lg cursor-pointer"
              title="Download exact updated AURA TECH HR SERVICE.xlsx"
            >
              <Download size={15} />
              <span>Download Excel (.xlsx)</span>
            </button>

            {/* Cloud Sync Settings */}
            <button
              onClick={() => setIsSyncModalOpen(true)}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                isDark ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white' : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
              }`}
              title="OneDrive Cloud Sync Settings"
            >
              <Cloud size={16} />
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-800/40 text-xs font-bold">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-500 uppercase tracking-wider text-[10px]">Filter Status:</span>
            {['All', ...APPLICATION_STATUSES.map(s => s.value)].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg uppercase text-[10px] tracking-wider transition-colors cursor-pointer ${
                  statusFilter === st 
                    ? isDark ? 'bg-amber-500 text-black font-black' : 'bg-blue-600 text-white font-black' 
                    : isDark ? 'bg-slate-900 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                {st === 'All' ? 'All Statuses' : formatStatusLabel(st)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-slate-500 uppercase tracking-wider text-[10px]">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-100 border-slate-300 text-slate-800'
              }`}
            >
              <option value="All">All Roles</option>
              {POPULAR_ROLES.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* In-Portal Excel MasterSheet Hub */}
      <div className={`p-5 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl ${
        isDark ? 'bg-gradient-to-r from-emerald-950/30 via-slate-950 to-emerald-950/20 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'
      }`}>
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shadow-md shrink-0">
            <FileSpreadsheet size={26} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-black text-sm uppercase tracking-tight text-emerald-400">
                AURA TECH HR SERVICE.xlsx
              </h3>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                In Admin Portal
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live Excel MasterSheet containing all user job applications. Download .xlsx or open in OneDrive.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          {/* View Mode Toggle */}
          <div className="p-1 rounded-xl border border-slate-800 bg-slate-900 flex items-center gap-1">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'table' ? 'bg-amber-500 text-black font-black shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Profiles & PDF View
            </button>
            <button
              onClick={() => setViewMode('excel')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'excel' ? 'bg-emerald-500 text-black font-black shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileSpreadsheet size={13} />
              <span>Excel Grid View</span>
            </button>
          </div>

          {/* Download AURA TECH HR SERVICE.xlsx */}
          <button
            onClick={() => exportToHRServiceExcel(applications)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            title="Download exact updated AURA TECH HR SERVICE.xlsx file"
          >
            <Download size={14} /> Download .xlsx
          </button>

          {/* Open OneDrive Excel Online */}
          <a
            href={ONEDRIVE_SHEET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-bold text-xs uppercase flex items-center gap-1.5 transition-all shadow-sm"
            title="Open in OneDrive Excel Online"
          >
            <ExternalLink size={14} /> Open in OneDrive
          </a>
        </div>
      </div>

      {viewMode === 'table' ? (
        /* Main Candidates Data Table & PDF Dossiers */
        <div className={`rounded-3xl border overflow-hidden shadow-2xl ${
          isDark ? 'bg-slate-950 border-amber-500/20' : 'bg-white border-slate-200'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className={`border-b ${isDark ? 'bg-slate-900/60 border-slate-800/80 text-slate-400' : 'bg-slate-100/70 border-slate-200 text-slate-600'}`}>
                  <th className="p-4 font-black uppercase tracking-wider text-[10px]">Candidate & Age</th>
                  <th className="p-4 font-black uppercase tracking-wider text-[10px]">Applied Role</th>
                  <th className="p-4 font-black uppercase tracking-wider text-[10px]">Contact Info</th>
                  <th className="p-4 font-black uppercase tracking-wider text-[10px]">Skills & Portfolio</th>
                  <th className="p-4 font-black uppercase tracking-wider text-[10px]">Resume</th>
                  <th className="p-4 font-black uppercase tracking-wider text-[10px]">Status</th>
                  <th className="p-4 font-black uppercase tracking-wider text-[10px] text-right">PDF & Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-slate-500">
                      <Briefcase size={36} className="mx-auto mb-2 opacity-40 text-amber-500" />
                      <p className="font-bold text-sm">No job applications match your filters.</p>
                      <p className="text-xs mt-1">Try resetting search keywords or status filters.</p>
                    </td>
                  </tr>
                ) : (
                  filteredApps.map(candidate => (
                    <tr 
                      key={candidate.id} 
                      className={`transition-colors ${
                        isDark ? 'hover:bg-slate-900/40' : 'hover:bg-slate-50'
                      }`}
                    >
                      {/* Candidate Name & Age */}
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                            isDark ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-blue-50 text-blue-600 border border-blue-200'
                          }`}>
                            {candidate.fullName ? candidate.fullName.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <div className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              {candidate.fullName}
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                              <span className="font-semibold">{candidate.age} yrs old</span>
                              <span>•</span>
                              <span className="font-mono text-amber-500/90">{candidate.id}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Applied Role */}
                      <td className="p-4">
                        <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide border ${
                          isDark 
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' 
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          {candidate.role}
                        </span>
                        <div className="text-[10px] text-slate-500 mt-1">
                          {candidate.createdAt ? new Date(candidate.createdAt).toLocaleDateString() : 'Recent'}
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="p-4 space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300">
                          <Mail size={12} className="text-amber-500 shrink-0" />
                          <span className="truncate max-w-[150px]">{candidate.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                          <span className="text-emerald-400 text-[10px]">📞</span>
                          <span>{candidate.phone}</span>
                        </div>
                      </td>

                      {/* Skills & Portfolio */}
                      <td className="p-4 max-w-xs">
                        <div className="text-xs text-slate-300 truncate" title={candidate.skills}>
                          {candidate.skills || 'No skills specified'}
                        </div>
                        {candidate.portfolioLink ? (
                          <a 
                            href={candidate.portfolioLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] text-blue-400 hover:underline mt-1 font-semibold"
                          >
                            <Globe size={11} /> Portfolio Link <ExternalLink size={9} />
                          </a>
                        ) : (
                          <span className="text-[10px] text-slate-600 block mt-1">No Portfolio link</span>
                        )}
                      </td>

                      {/* Resume Document */}
                      <td className="p-4">
                        {candidate.resumeFileData || candidate.resumeFileName ? (
                          <button
                            onClick={() => openCandidateResume(candidate)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                            title="View / Download Candidate Resume"
                          >
                            <Paperclip size={12} />
                            <span className="truncate max-w-[100px]">{candidate.resumeFileName || 'Resume.pdf'}</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-500 italic">No resume</span>
                        )}
                      </td>

                      {/* Status Dropdown */}
                      <td className="p-4">
                        <select
                          value={candidate.status}
                          onChange={(e) => onUpdateStatus(candidate.id, e.target.value)}
                          className={`text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-lg border cursor-pointer ${getStatusBadgeStyle(candidate.status, isDark)}`}
                        >
                          {APPLICATION_STATUSES.map(s => (
                            <option key={s.value} value={s.value} className="bg-slate-900 text-white font-bold">
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* PDF Dossier & Action Buttons */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {/* Download / View PDF Button (Requested by User) */}
                          <button
                            onClick={() => generateCandidatePDF(candidate)}
                            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-[11px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                            title="View & Download PDF Dossier for this candidate"
                          >
                            <FileText size={13} />
                            <span>PDF</span>
                          </button>

                          {/* View Full Candidate Dossier Modal */}
                          <button
                            onClick={() => handleOpenCandidateModal(candidate)}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              isDark ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                            }`}
                            title="Open Full Candidate Assessment"
                          >
                            <Eye size={14} />
                          </button>

                          {/* Delete Candidate */}
                          <button
                            onClick={() => onDelete(candidate.id)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 transition-colors cursor-pointer"
                            title="Delete Candidate Record"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* In-Portal Live Excel Spreadsheet Grid View */
        <div className={`rounded-3xl border overflow-hidden shadow-2xl ${
          isDark ? 'bg-slate-950 border-emerald-500/30' : 'bg-white border-slate-200'
        }`}>
          {/* Excel Title Bar & Formula Bar */}
          <div className="bg-emerald-900/40 border-b border-emerald-500/30 px-4 py-3 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                X
              </div>
              <span className="font-mono font-bold text-xs text-emerald-300">
                AURA TECH HR SERVICE.xlsx - [Sheet 1: Job Applications]
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              Total Records: <strong className="text-emerald-400">{filteredApps.length}</strong> | 12 Columns
            </div>
          </div>

          <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center gap-2 text-xs font-mono">
            <span className="text-emerald-400 font-bold">fx</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300">=DATABASE_TABLE(hr_job_applications, A1:L{filteredApps.length + 1})</span>
          </div>

          {/* Excel Grid Table */}
          <div className="overflow-x-auto max-h-[600px]">
            <table className="w-full text-left border-collapse text-[11px] font-mono">
              <thead>
                <tr className="bg-slate-900 text-slate-400 border-b border-slate-800 select-none">
                  <th className="p-2 border-r border-slate-800 text-center w-12 text-[10px] bg-slate-950">#</th>
                  <th className="p-2.5 border-r border-slate-800 font-bold text-slate-300">A [Application ID]</th>
                  <th className="p-2.5 border-r border-slate-800 font-bold text-slate-300">B [Date & Time]</th>
                  <th className="p-2.5 border-r border-slate-800 font-bold text-slate-300">C [Candidate Name]</th>
                  <th className="p-2.5 border-r border-slate-800 font-bold text-slate-300">D [Age]</th>
                  <th className="p-2.5 border-r border-slate-800 font-bold text-slate-300">E [Applied Role]</th>
                  <th className="p-2.5 border-r border-slate-800 font-bold text-slate-300">F [Mobile]</th>
                  <th className="p-2.5 border-r border-slate-800 font-bold text-slate-300">G [Gmail ID]</th>
                  <th className="p-2.5 border-r border-slate-800 font-bold text-slate-300">H [Key Skills]</th>
                  <th className="p-2.5 border-r border-slate-800 font-bold text-slate-300">I [Portfolio]</th>
                  <th className="p-2.5 border-r border-slate-800 font-bold text-slate-300">J [Resume File]</th>
                  <th className="p-2.5 border-r border-slate-800 font-bold text-slate-300">K [Status]</th>
                  <th className="p-2.5 font-bold text-slate-300">L [HR Remarks & Notes]</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                {filteredApps.map((row, idx) => (
                  <tr 
                    key={row.id} 
                    className="hover:bg-emerald-950/20 transition-colors border-b border-slate-800/40 cursor-pointer"
                    onClick={() => handleOpenCandidateModal(row)}
                    title="Click row to open candidate profile & PDF"
                  >
                    <td className="p-2 border-r border-slate-800 text-center text-slate-600 bg-slate-950 font-bold">
                      {idx + 1}
                    </td>
                    <td className="p-2.5 border-r border-slate-800 font-bold text-amber-400 whitespace-nowrap">
                      {row.id}
                    </td>
                    <td className="p-2.5 border-r border-slate-800 text-slate-400 whitespace-nowrap">
                      {row.createdAt ? new Date(row.createdAt).toLocaleString('en-IN') : 'N/A'}
                    </td>
                    <td className="p-2.5 border-r border-slate-800 font-bold text-white whitespace-nowrap">
                      {row.fullName}
                    </td>
                    <td className="p-2.5 border-r border-slate-800 text-center text-slate-300">
                      {row.age}
                    </td>
                    <td className="p-2.5 border-r border-slate-800 text-blue-300 whitespace-nowrap font-medium">
                      {row.role}
                    </td>
                    <td className="p-2.5 border-r border-slate-800 text-slate-300 whitespace-nowrap">
                      {row.phone}
                    </td>
                    <td className="p-2.5 border-r border-slate-800 text-slate-300 whitespace-nowrap">
                      {row.email}
                    </td>
                    <td className="p-2.5 border-r border-slate-800 text-slate-400 max-w-xs truncate" title={row.skills}>
                      {row.skills}
                    </td>
                    <td className="p-2.5 border-r border-slate-800 text-blue-400 max-w-[150px] truncate" title={row.portfolioLink}>
                      {row.portfolioLink || 'None'}
                    </td>
                    <td className="p-2.5 border-r border-slate-800 text-emerald-400 whitespace-nowrap">
                      {row.resumeFileName || 'On File'}
                    </td>
                    <td className="p-2.5 border-r border-slate-800 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${getStatusBadgeStyle(row.status, isDark)}`}>
                        {formatStatusLabel(row.status)}
                      </span>
                    </td>
                    <td className="p-2.5 text-slate-400 max-w-xs truncate" title={row.adminNotes}>
                      {row.adminNotes || 'Pending interview remarks'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Sheet: Job Applications | Ready</span>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-emerald-400">✓ In-Portal Excel Live View</span>
              <button
                onClick={() => exportToHRServiceExcel(applications)}
                className="text-amber-400 hover:underline font-bold cursor-pointer"
              >
                Download Updated File (.xlsx)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Dossier & Assessment Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className={`w-full max-w-2xl p-6 sm:p-8 rounded-3xl border shadow-2xl my-6 ${
            isDark ? 'bg-slate-950 border-amber-500/30 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-black">
                  {selectedCandidate.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight">
                    {selectedCandidate.fullName}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Application Ref: <strong className="text-amber-500">{selectedCandidate.id}</strong> • Applied on {new Date(selectedCandidate.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCandidate(null)}
                className="text-slate-400 hover:text-white p-2"
              >
                ✕
              </button>
            </div>

            {/* Candidate Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4 p-4 rounded-2xl border text-xs bg-slate-900/50 border-slate-800">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Age:</span>
                <span className="font-bold text-white">{selectedCandidate.age} Years</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Target Role:</span>
                <span className="font-bold text-amber-400">{selectedCandidate.role}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Current Status:</span>
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase border ${getStatusBadgeStyle(selectedCandidate.status, isDark)}`}>
                  {formatStatusLabel(selectedCandidate.status)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Mobile Number:</span>
                <span className="font-bold font-mono">{selectedCandidate.phone}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Gmail ID:</span>
                <span className="font-bold font-mono truncate block">{selectedCandidate.email}</span>
              </div>
            </div>

            {/* Skills & Portfolio */}
            <div className="space-y-3 mb-4 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Key Technical Skills:</span>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-medium">
                  {selectedCandidate.skills || 'No skills specified.'}
                </div>
              </div>

              {selectedCandidate.portfolioLink && (
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Portfolio / Work Showcase:</span>
                  <a
                    href={selectedCandidate.portfolioLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-blue-400 hover:underline flex items-center justify-between"
                  >
                    <span className="truncate">{selectedCandidate.portfolioLink}</span>
                    <ExternalLink size={14} className="shrink-0" />
                  </a>
                </div>
              )}

              {/* Resume Document */}
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Resume File:</span>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Paperclip size={16} />
                    <span className="font-bold">{selectedCandidate.resumeFileName || 'Resume Document on File'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => openCandidateResume(selectedCandidate)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px] font-black uppercase cursor-pointer"
                  >
                    View / Download Resume
                  </button>
                </div>
              </div>
            </div>

            {/* Assessment Remarks & Status Modification */}
            <div className="space-y-3 pt-3 border-t border-slate-800 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Update Status:</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold"
                  >
                    {APPLICATION_STATUSES.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end gap-2">
                  <button
                    type="button"
                    onClick={() => generateCandidatePDF(selectedCandidate)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 text-black font-black text-xs uppercase flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <FileText size={15} /> Download PDF Dossier
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                  HR Interview Notes & Remarks:
                </label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Record interview notes, technical screening feedback, salary expectations..."
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedCandidate.email}?subject=AURA TECH Job Application - ${selectedCandidate.role}&body=Hi ${selectedCandidate.fullName},%0D%0A%0D%0AThank you for applying for the ${selectedCandidate.role} role at AURA TECH.`}
                  className="px-3 py-2 rounded-xl bg-blue-600/15 hover:bg-blue-600/25 text-blue-400 border border-blue-500/30 text-xs font-bold uppercase flex items-center gap-1.5 cursor-pointer"
                >
                  <Mail size={14} /> Send Email
                </a>
                <a
                  href={`https://wa.me/${selectedCandidate.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(selectedCandidate.fullName)},%20this%20is%20AURA%20TECH%20HR%20team%20regarding%20your%20application%20for%20${encodeURIComponent(selectedCandidate.role)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl bg-green-500/15 hover:bg-green-500/25 text-green-400 border border-green-500/30 text-xs font-bold uppercase flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare size={14} /> WhatsApp
                </a>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCandidate(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs font-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveAssessment}
                  className="btn-primary-action px-6 py-2.5 rounded-xl font-black text-xs uppercase cursor-pointer shadow-lg"
                >
                  Save Assessment
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Cloud & OneDrive Sync Settings Modal */}
      {isSyncModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className={`w-full max-w-lg p-6 sm:p-8 rounded-3xl border shadow-2xl ${
            isDark ? 'bg-slate-950 border-amber-500/30 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Cloud size={20} className="text-emerald-400" />
                <h3 className="text-lg font-black uppercase tracking-tight">
                  OneDrive Excel Sync Configuration
                </h3>
              </div>
              <button onClick={() => setIsSyncModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Linked Sheet Details */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400 uppercase text-[11px] flex items-center gap-1.5">
                    <FileSpreadsheet size={15} /> Target Master Sheet
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                    Connected
                  </span>
                </div>
                <p className="font-bold text-white">AURA TECH HR SERVICE.xlsx</p>
                <a
                  href={ONEDRIVE_SHEET_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:underline break-all"
                >
                  <span>Open OneDrive File Link</span>
                  <ExternalLink size={11} />
                </a>
              </div>

              {/* Webhook Configuration for Automatic Append */}
              <form onSubmit={handleSaveWebhook} className="space-y-3 pt-2">
                <div>
                  <label className="block font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Live Webhook URL (Power Automate / Zapier / Make / Cloud Function):
                  </label>
                  <input
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrlState(e.target.value)}
                    placeholder="https://prod-xx.westus.logic.azure.com/workflows/..."
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    When configured, every new applicant submission sends a JSON payload to this endpoint to append rows in real-time into your OneDrive sheet.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1 text-[11px] text-slate-400">
                  <div className="font-bold text-slate-300">Quick Setup Instructions:</div>
                  <p>1. In Microsoft Power Automate, create a flow triggered by "When an HTTP request is received".</p>
                  <p>2. Add an action: "Excel Online (Business) - Add a row into a table".</p>
                  <p>3. Select your OneDrive file <strong>AURA TECH HR SERVICE.xlsx</strong>.</p>
                  <p>4. Paste your HTTP POST trigger URL above and save.</p>
                </div>

                {webhookSaved && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                    <Check size={14} /> Webhook URL saved successfully!
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsSyncModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="btn-primary-action px-6 py-2 rounded-xl font-bold uppercase"
                  >
                    Save Webhook
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      )}

      {/* Add Offline Candidate Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className={`w-full max-w-md p-6 sm:p-8 rounded-3xl border shadow-2xl ${
            isDark ? 'bg-slate-950 border-amber-500/30 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h3 className="text-xl font-black uppercase tracking-tight">
                Add Offline <span className="text-amber-400">Candidate</span>
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddManualCandidate} className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block font-bold text-slate-400 uppercase mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newCandidate.fullName}
                    onChange={(e) => setNewCandidate({ ...newCandidate, fullName: e.target.value })}
                    placeholder="Candidate Name"
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 uppercase mb-1">Age *</label>
                  <input
                    type="number"
                    required
                    min="18"
                    max="65"
                    value={newCandidate.age}
                    onChange={(e) => setNewCandidate({ ...newCandidate, age: e.target.value })}
                    placeholder="24"
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-400 uppercase mb-1">Interested Role *</label>
                <select
                  value={newCandidate.role}
                  onChange={(e) => setNewCandidate({ ...newCandidate, role: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                >
                  {POPULAR_ROLES.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                  <option value="Other">Other / Custom</option>
                </select>
                {newCandidate.role === 'Other' && (
                  <input
                    type="text"
                    required
                    value={newCandidate.customRole}
                    onChange={(e) => setNewCandidate({ ...newCandidate, customRole: e.target.value })}
                    placeholder="Specify custom role..."
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white mt-2"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-400 uppercase mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={newCandidate.phone}
                    onChange={(e) => setNewCandidate({ ...newCandidate, phone: e.target.value })}
                    placeholder="+91 90252 55617"
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 uppercase mb-1">Gmail ID *</label>
                  <input
                    type="email"
                    required
                    value={newCandidate.email}
                    onChange={(e) => setNewCandidate({ ...newCandidate, email: e.target.value })}
                    placeholder="name@gmail.com"
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-400 uppercase mb-1">Portfolio Link (Optional)</label>
                <input
                  type="url"
                  value={newCandidate.portfolioLink}
                  onChange={(e) => setNewCandidate({ ...newCandidate, portfolioLink: e.target.value })}
                  placeholder="https://github.com/..."
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-400 uppercase mb-1">Key Skills *</label>
                <input
                  type="text"
                  required
                  value={newCandidate.skills}
                  onChange={(e) => setNewCandidate({ ...newCandidate, skills: e.target.value })}
                  placeholder="React, Node.js, Python, Figma"
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-400 uppercase mb-1">Resume File Name</label>
                <input
                  type="text"
                  value={newCandidate.resumeFileName}
                  onChange={(e) => setNewCandidate({ ...newCandidate, resumeFileName: e.target.value })}
                  placeholder="e.g. John_Doe_Resume.pdf"
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full btn-primary-action py-3 rounded-xl font-bold uppercase mt-2 cursor-pointer shadow-lg"
              >
                Save Candidate to HR Database
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
    case 'shortlisted':
      return 'bg-purple-500/20 text-purple-400 border-purple-500/40';
    case 'interview_scheduled':
      return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40';
    case 'hired':
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    case 'rejected':
      return 'bg-red-500/20 text-red-400 border-red-500/40';
    default:
      return 'bg-slate-800 text-slate-300 border-slate-700';
  }
}
