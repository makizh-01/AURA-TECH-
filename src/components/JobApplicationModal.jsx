import React, { useState, useEffect } from 'react';
import { 
  X, CheckCircle2, Send, Sparkles, User, Mail, Phone, 
  FileText, Briefcase, Calendar, Globe, UploadCloud, 
  AlertCircle, ShieldCheck, ArrowRight, Paperclip, Download
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  POPULAR_ROLES, 
  submitJobApplication, 
  generateCandidatePDF 
} from '../lib/hrService';

const SUGGESTED_SKILLS = [
  'React', 'Node.js', 'Python', 'TailwindCSS', 'Figma',
  'Next.js', 'PostgreSQL', 'TypeScript', 'Flutter', 'PyTorch',
  'UI/UX Design', 'Video Editing', 'REST APIs', 'Docker', 'IoT / ESP32'
];

export default function JobApplicationModal({ 
  theme, 
  isOpen, 
  onClose, 
  initialRole = '' 
}) {
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    role: POPULAR_ROLES[0],
    customRole: '',
    portfolioLink: '',
    phone: '',
    email: '',
    skills: '',
    resumeFileName: '',
    resumeFileData: '',
    resumeFileSize: ''
  });

  const [selectedSkillChips, setSelectedSkillChips] = useState([]);
  const [fileError, setFileError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submittedCandidate, setSubmittedCandidate] = useState(null);

  useEffect(() => {
    if (initialRole) {
      if (POPULAR_ROLES.includes(initialRole)) {
        setFormData(prev => ({ ...prev, role: initialRole, customRole: '' }));
      } else {
        setFormData(prev => ({ ...prev, role: 'Other', customRole: initialRole }));
      }
    }
  }, [initialRole, isOpen]);

  if (!isOpen) return null;

  // Handle resume file upload and convert to base64
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setFileError('File size exceeds 10MB limit. Please upload a smaller file.');
      return;
    }

    // Check type (PDF or Word)
    const allowedExtensions = /(\.pdf|\.doc|\.docx)$/i;
    if (!allowedExtensions.exec(file.name)) {
      setFileError('Please upload a PDF (.pdf) or Word document (.doc, .docx).');
      return;
    }

    setFileError('');
    const sizeStr = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({
        ...prev,
        resumeFileName: file.name,
        resumeFileData: reader.result,
        resumeFileSize: sizeStr
      }));
    };
    reader.onerror = () => {
      setFileError('Failed to read file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleToggleSkill = (skill) => {
    let updatedChips;
    if (selectedSkillChips.includes(skill)) {
      updatedChips = selectedSkillChips.filter(s => s !== skill);
    } else {
      updatedChips = [...selectedSkillChips, skill];
    }
    setSelectedSkillChips(updatedChips);

    // Merge chip skills with manual typed skills
    const manualSkills = formData.skills
      .split(',')
      .map(s => s.trim())
      .filter(s => s && !SUGGESTED_SKILLS.includes(s));
    
    const combined = [...updatedChips, ...manualSkills].join(', ');
    setFormData(prev => ({ ...prev, skills: combined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const targetRole = formData.role === 'Other' && formData.customRole.trim() 
      ? formData.customRole.trim() 
      : formData.role;

    try {
      const candidatePayload = {
        fullName: formData.fullName,
        age: formData.age,
        role: targetRole,
        portfolioLink: formData.portfolioLink,
        phone: formData.phone,
        email: formData.email,
        skills: formData.skills,
        resumeFileName: formData.resumeFileName,
        resumeFileData: formData.resumeFileData,
        resumeFileSize: formData.resumeFileSize
      };

      const savedApp = await submitJobApplication(candidatePayload);

      setSubmittedCandidate(savedApp);
      setLoading(false);

      // Trigger Confetti Celebration
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.log('Confetti error:', err);
      }
    } catch (err) {
      console.error('Job application submission error:', err);
      setLoading(false);
      alert('An error occurred while saving your application. Please try again.');
    }
  };

  const handleReset = () => {
    setSubmittedCandidate(null);
    setFormData({
      fullName: '',
      age: '',
      role: POPULAR_ROLES[0],
      customRole: '',
      portfolioLink: '',
      phone: '',
      email: '',
      skills: '',
      resumeFileName: '',
      resumeFileData: '',
      resumeFileSize: ''
    });
    setSelectedSkillChips([]);
    setFileError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className={`relative w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl my-6 border overflow-hidden transition-all ${
        isDark ? 'bg-slate-950 border-amber-500/30 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Subtle decorative background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-500/10 via-blue-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleReset}
          className={`absolute top-5 right-5 p-2 rounded-full transition-colors z-20 cursor-pointer ${
            isDark ? 'text-slate-400 hover:text-white hover:bg-slate-900' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
          }`}
          aria-label="Close Modal"
        >
          <X size={20} />
        </button>

        {submittedCandidate ? (
          /* Submission Success Screen */
          <div className="text-center py-6 sm:py-8 space-y-6 relative z-10">
            <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-3xl flex items-center justify-center mx-auto shadow-xl">
              <CheckCircle2 size={40} className="animate-bounce" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                Application Received & Registered
              </span>
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
                Welcome to AURA TECH Talent Pool!
              </h3>
              <p className={`text-xs sm:text-sm max-w-md mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Thank you <strong className={isDark ? 'text-amber-400' : 'text-blue-600'}>{submittedCandidate.fullName}</strong>! Your application for{' '}
                <strong>{submittedCandidate.role}</strong> has been logged into our recruitment database and synchronized with our master HR system.
              </p>
            </div>

            {/* Application ID Card */}
            <div className={`p-4 rounded-2xl border text-left max-w-md mx-auto space-y-2 ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold uppercase">Application Reference:</span>
                <span className="font-mono font-black text-amber-500">{submittedCandidate.id}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold uppercase">Target Position:</span>
                <span className="font-bold">{submittedCandidate.role}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold uppercase">Mobile & Gmail:</span>
                <span className="truncate ml-2">{submittedCandidate.phone} | {submittedCandidate.email}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold uppercase">Resume Attached:</span>
                <span className="text-emerald-500 font-bold">{submittedCandidate.resumeFileName || 'On File'}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => generateCandidatePDF(submittedCandidate)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                <Download size={16} /> Download Application PDF
              </button>

              <button
                type="button"
                onClick={handleReset}
                className={`w-full sm:w-auto px-6 py-3 rounded-xl border text-xs font-black uppercase tracking-wider cursor-pointer ${
                  isDark ? 'border-slate-800 hover:bg-slate-900 text-slate-300' : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                }`}
              >
                Done / Close
              </button>
            </div>
          </div>
        ) : (
          /* Job Application Form */
          <div className="relative z-10">
            
            {/* Header */}
            <div className="mb-6 pb-4 border-b border-slate-800/40">
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                  isDark ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-blue-50 text-blue-600 border-blue-200'
                }`}>
                  AURA TECH HR SERVICES
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Careers & Talent Portal</span>
              </div>
              <h2 className={`text-2xl sm:text-3xl font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Apply For Your <span className={isDark ? 'text-amber-400' : 'text-blue-600'}>Desired Role</span>
              </h2>
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Join our engineering, design, or AI teams. Fill in your details and upload your resume below to be considered for active openings.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Row 1: Name & Age */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <User size={13} className="text-amber-500" />
                    <span>Full Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Alex Morgan"
                    className={`w-full p-3 rounded-xl border text-xs font-medium transition-all ${
                      isDark 
                        ? 'bg-slate-900 border-slate-800 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500' 
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Calendar size={13} className="text-amber-500" />
                    <span>Age *</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="18"
                    max="65"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="e.g. 23"
                    className={`w-full p-3 rounded-xl border text-xs font-medium transition-all ${
                      isDark 
                        ? 'bg-slate-900 border-slate-800 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500' 
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'
                    }`}
                  />
                </div>
              </div>

              {/* Row 2: Desired Role */}
              <div>
                <label className="block font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Briefcase size={13} className="text-amber-500" />
                  <span>Interested Role *</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className={`w-full p-3 rounded-xl border text-xs font-medium transition-all ${
                      isDark 
                        ? 'bg-slate-900 border-slate-800 text-white focus:border-amber-500' 
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600'
                    }`}
                  >
                    {POPULAR_ROLES.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                    <option value="Other">Other (Specify Custom Role)</option>
                  </select>

                  {formData.role === 'Other' && (
                    <input
                      type="text"
                      required
                      value={formData.customRole}
                      onChange={(e) => setFormData({ ...formData, customRole: e.target.value })}
                      placeholder="Specify your custom role..."
                      className={`w-full p-3 rounded-xl border text-xs font-medium transition-all ${
                        isDark 
                          ? 'bg-slate-900 border-slate-800 text-white focus:border-amber-500' 
                          : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600'
                      }`}
                    />
                  )}
                </div>
              </div>

              {/* Row 3: Mobile & Gmail ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Phone size={13} className="text-amber-500" />
                    <span>Mobile Number *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 90252 55617"
                    className={`w-full p-3 rounded-xl border text-xs font-medium transition-all ${
                      isDark 
                        ? 'bg-slate-900 border-slate-800 text-white focus:border-amber-500' 
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Mail size={13} className="text-amber-500" />
                    <span>Gmail ID / Email *</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="candidate@gmail.com"
                    className={`w-full p-3 rounded-xl border text-xs font-medium transition-all ${
                      isDark 
                        ? 'bg-slate-900 border-slate-800 text-white focus:border-amber-500' 
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600'
                    }`}
                  />
                </div>
              </div>

              {/* Row 4: Portfolio Link (Optional) */}
              <div>
                <label className="block font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Globe size={13} className="text-amber-500" />
                    <span>Portfolio Link (Optional)</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-normal">GitHub / Behance / Personal Web</span>
                </label>
                <input
                  type="url"
                  value={formData.portfolioLink}
                  onChange={(e) => setFormData({ ...formData, portfolioLink: e.target.value })}
                  placeholder="https://github.com/your-username or https://behance.net/portfolio"
                  className={`w-full p-3 rounded-xl border text-xs font-medium transition-all ${
                    isDark 
                      ? 'bg-slate-900 border-slate-800 text-white focus:border-amber-500' 
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600'
                  }`}
                />
              </div>

              {/* Row 5: Skills */}
              <div>
                <label className="block font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sparkles size={13} className="text-amber-500" />
                    <span>Technical Skills *</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-normal">Select or type below</span>
                </label>

                {/* Quick Add Skill Chips */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {SUGGESTED_SKILLS.map(skill => {
                    const isSelected = selectedSkillChips.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleToggleSkill(skill)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500 text-black shadow-sm font-extrabold'
                            : isDark
                              ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '} {skill}
                      </button>
                    );
                  })}
                </div>

                <input
                  type="text"
                  required
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="e.g. React, Node.js, Python, Tailwind, Figma, SQL"
                  className={`w-full p-3 rounded-xl border text-xs font-medium transition-all ${
                    isDark 
                      ? 'bg-slate-900 border-slate-800 text-white focus:border-amber-500' 
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600'
                  }`}
                />
              </div>

              {/* Row 6: Resume Upload */}
              <div>
                <label className="block font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <UploadCloud size={13} className="text-amber-500" />
                    <span>Upload Resume (PDF / DOC) *</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-normal">Max 10MB</span>
                </label>

                <div className={`border-2 border-dashed rounded-2xl p-4 text-center transition-all ${
                  formData.resumeFileName
                    ? isDark ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-emerald-500/40 bg-emerald-50'
                    : isDark ? 'border-slate-800 hover:border-amber-500/40 bg-slate-900/50' : 'border-slate-300 hover:border-blue-500 bg-slate-50'
                }`}>
                  <input
                    type="file"
                    id="resume-upload"
                    accept=".pdf,.doc,.docx"
                    required={!formData.resumeFileName}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer block">
                    {formData.resumeFileName ? (
                      <div className="flex items-center justify-center gap-2 text-emerald-400">
                        <Paperclip size={16} />
                        <span className="font-bold text-xs truncate max-w-xs">{formData.resumeFileName}</span>
                        <span className="text-[10px] text-slate-400">({formData.resumeFileSize})</span>
                        <span className="text-[10px] underline ml-2 text-amber-400">Change</span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <UploadCloud size={24} className="mx-auto text-amber-500" />
                        <p className="font-bold text-xs">
                          Click to browse or drag & drop your resume
                        </p>
                        <p className="text-[10px] text-slate-500">
                          Supports PDF, DOC, DOCX up to 10MB
                        </p>
                      </div>
                    )}
                  </label>
                </div>

                {fileError && (
                  <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {fileError}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl cursor-pointer ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  } ${
                    isDark 
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black hover:from-amber-300 hover:to-amber-400 shadow-amber-500/20' 
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/20'
                  }`}
                >
                  {loading ? (
                    <span>Registering Application...</span>
                  ) : (
                    <>
                      <Send size={15} />
                      <span>Submit Application to AURA TECH HR</span>
                    </>
                  )}
                </button>

                <p className="text-[10px] text-center text-slate-500 mt-2.5">
                  ✓ Your submission is stored in our database, synced with <strong className="text-slate-400">AURA TECH HR SERVICE.xlsx</strong>, and immediately viewable by recruiters.
                </p>
              </div>

            </form>

          </div>
        )}

      </div>
    </div>
  );
}
