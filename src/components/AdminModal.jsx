import React, { useState, useEffect } from 'react';
import { X, Download, Database, Trash2 } from 'lucide-react';

export default function AdminModal({ theme, isOpen, onClose }) {
  const [submissions, setSubmissions] = useState([]);
  const isDark = theme === 'dark';

  useEffect(() => {
    if (isOpen) {
      loadSubmissions();
    }
  }, [isOpen]);

  const loadSubmissions = () => {
    const data = JSON.parse(localStorage.getItem('aura_submissions') || '[]');
    setSubmissions(data);
  };

  if (!isOpen) return null;

  const downloadCSV = () => {
    if (submissions.length === 0) {
      alert("No project submissions recorded yet.");
      return;
    }

    const headers = ["Client Name", "Client Email", "Client Phone", "User Type", "Project Title", "Project Type", "Description", "Created At"];
    const rows = submissions.map(s => [
      `"${s.client_name || ''}"`,
      `"${s.client_email || ''}"`,
      `"${s.client_phone || ''}"`,
      `"${s.client_type || ''}"`,
      `"${s.project_title || ''}"`,
      `"${s.project_type || ''}"`,
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

  const clearSubmissions = () => {
    if (confirm("Are you sure you want to clear all local submissions?")) {
      localStorage.removeItem('aura_submissions');
      setSubmissions([]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className={`relative w-full max-w-4xl rounded-3xl p-6 sm:p-8 shadow-2xl my-8 border ${
        isDark ? 'bg-slate-950 border-amber-500/30' : 'bg-white border-slate-200'
      }`}>
        
        <button
          onClick={onClose}
          className={`absolute top-6 right-6 p-2 rounded-full transition-colors ${
            isDark ? 'bg-slate-900 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
          }`}
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className={`p-3 rounded-xl border ${
            isDark ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-blue-50 text-blue-600 border-blue-200'
          }`}>
            <Database size={24} />
          </div>
          <div>
            <h3 className={`text-xl font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              MasterSheet Submissions <span className={isDark ? 'text-amber-400' : 'text-blue-600'}>Sync</span>
            </h3>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Admin panel for recorded project booking inquiries.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Total Records: <span className={`font-extrabold ${isDark ? 'text-amber-400' : 'text-blue-600'}`}>{submissions.length}</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={downloadCSV}
              className="btn-primary-action px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-extrabold shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={14} />
              Export MasterSheet CSV
            </button>
            {submissions.length > 0 && (
              <button
                onClick={clearSubmissions}
                className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 text-xs font-bold cursor-pointer"
                title="Clear Records"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Submissions Table */}
        <div className={`rounded-2xl border overflow-x-auto max-h-96 ${
          isDark ? 'bg-black border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          {submissions.length > 0 ? (
            <table className={`w-full text-left text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <thead className={`uppercase tracking-wider font-extrabold text-[10px] sticky top-0 border-b ${
                isDark ? 'bg-slate-900 text-slate-400 border-amber-500/20' : 'bg-slate-200 text-slate-700 border-slate-300'
              }`}>
                <tr>
                  <th className="p-3">Client</th>
                  <th className="p-3">Email & Phone</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Project Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-800/60' : 'divide-slate-200'}`}>
                {submissions.map((item) => (
                  <tr key={item.id} className={isDark ? 'hover:bg-slate-900/50' : 'hover:bg-white'}>
                    <td className={`p-3 font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.client_name}</td>
                    <td className="p-3">
                      <div>{item.client_email}</div>
                      <div className="text-[10px] text-slate-500">{item.client_phone}</div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.client_type === 'Student' 
                          ? isDark ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-100 text-blue-700' 
                          : 'bg-purple-500/20 text-purple-600'
                      }`}>
                        {item.client_type}
                      </span>
                    </td>
                    <td className="p-3 font-semibold">{item.project_title}</td>
                    <td className="p-3">{item.project_type}</td>
                    <td className="p-3 text-[10px] text-slate-500">{new Date(item.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-slate-500 text-xs">
              No project bookings recorded yet. New submissions will appear here automatically.
            </div>
          )}
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className={`py-2.5 px-6 rounded-xl font-bold text-xs uppercase border ${
              isDark ? 'bg-slate-900 hover:bg-slate-800 text-white border-slate-800' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
            }`}
          >
            Close Panel
          </button>
        </div>

      </div>
    </div>
  );
}
