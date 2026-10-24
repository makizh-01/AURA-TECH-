import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import { supabase } from './supabaseClient';

const STORAGE_KEY = 'aura_hr_applications';
const WEBHOOK_KEY = 'aura_hr_onedrive_webhook';
export const ONEDRIVE_SHEET_URL = 'https://1drv.ms/x/c/883cf752057c4d61/IQCMBmHNLbrrTYRTnVmNZplxARNPqoQA2UqiEzKuoa_7Zi4?e=WoOLyT';

export const POPULAR_ROLES = [
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'UI/UX Designer',
  'AI / Machine Learning Engineer',
  'Mobile App Developer (Flutter/React Native)',
  'Video Editor & Motion Designer',
  'IoT & Embedded Systems Engineer',
  'Cloud & DevOps Engineer',
  'Cybersecurity Analyst',
  'Data Analyst / Scientist',
  'Project Manager / Scrum Master'
];

export const APPLICATION_STATUSES = [
  { value: 'pending', label: 'Pending Review', color: 'amber' },
  { value: 'under_review', label: 'Under Review', color: 'blue' },
  { value: 'shortlisted', label: 'Shortlisted', color: 'purple' },
  { value: 'interview_scheduled', label: 'Interview Scheduled', color: 'indigo' },
  { value: 'hired', label: 'Hired / Offer Sent', color: 'green' },
  { value: 'rejected', label: 'Not Selected', color: 'red' }
];

const INITIAL_APPLICATIONS = [
  {
    id: 'APP-102901',
    fullName: 'Alex Morgan',
    age: 24,
    role: 'Full Stack Developer',
    portfolioLink: 'https://github.com/alexmorgan-dev',
    phone: '+91 98765 43210',
    email: 'alex.morgan.dev@gmail.com',
    skills: 'React, Node.js, TypeScript, PostgreSQL, TailwindCSS, Docker',
    resumeFileName: 'Alex_Morgan_Resume.pdf',
    resumeFileData: '',
    resumeFileSize: '1.2 MB',
    status: 'shortlisted',
    adminNotes: 'Strong GitHub portfolio with 3 full-stack React + Node projects. Schedule technical round.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'APP-102902',
    fullName: 'Priya Sharma',
    age: 22,
    role: 'UI/UX Designer',
    portfolioLink: 'https://behance.net/priyadesigns',
    phone: '+91 91234 56789',
    email: 'priya.sharma.design@gmail.com',
    skills: 'Figma, Adobe XD, Wireframing, Micro-interactions, Design Systems',
    resumeFileName: 'Priya_Sharma_Design_CV.pdf',
    resumeFileData: '',
    resumeFileSize: '2.4 MB',
    status: 'under_review',
    adminNotes: 'Impressive mobile UI case studies on Behance. Reviewing design system samples.',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'APP-102903',
    fullName: 'Karthik Raja',
    age: 26,
    role: 'AI / Machine Learning Engineer',
    portfolioLink: 'https://github.com/karthik-ai-labs',
    phone: '+91 94455 66778',
    email: 'karthik.raja.ai@gmail.com',
    skills: 'Python, PyTorch, LangChain, OpenAI APIs, FastAPIs, Vector DBs',
    resumeFileName: 'Karthik_Raja_AI_CV.pdf',
    resumeFileData: '',
    resumeFileSize: '950 KB',
    status: 'interview_scheduled',
    adminNotes: 'Technical screening passed with flying colors. Next round scheduled for Tuesday 11:00 AM IST.',
    createdAt: new Date().toISOString()
  }
];

/**
 * Fetch all HR applications from localStorage (and Supabase if connected)
 */
export async function getHRApplications() {
  let apps = [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      apps = JSON.parse(stored);
    } catch {
      apps = [];
    }
  }

  // Seed default items if empty
  if (!apps || apps.length === 0) {
    apps = INITIAL_APPLICATIONS;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
  }

  // If Supabase is available, try fetching remote records and merge
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('hr_job_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        // Map Supabase columns to local camelCase structure
        const remoteApps = data.map(item => ({
          id: item.id,
          fullName: item.full_name,
          age: item.age,
          role: item.role_applied,
          portfolioLink: item.portfolio_url || '',
          phone: item.phone,
          email: item.email,
          skills: item.skills,
          resumeFileName: item.resume_file_name || '',
          resumeFileData: item.resume_file_data || '',
          resumeFileSize: item.resume_file_size || '',
          status: item.status || 'pending',
          adminNotes: item.admin_notes || '',
          createdAt: item.created_at
        }));

        // Merge remote items with local
        const mergedMap = new Map();
        [...remoteApps, ...apps].forEach(app => {
          if (!mergedMap.has(app.id)) {
            mergedMap.set(app.id, app);
          }
        });
        apps = Array.from(mergedMap.values());
        localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
      }
    } catch (err) {
      console.warn('Supabase HR fetch warning:', err);
    }
  }

  return apps;
}

/**
 * Save a new Job Application to Database, LocalStorage, and optional OneDrive Webhook
 */
export async function submitJobApplication(candidateData) {
  const applicationId = 'APP-' + Math.floor(100000 + Math.random() * 900000);
  const now = new Date().toISOString();

  const newApp = {
    id: applicationId,
    fullName: candidateData.fullName.trim(),
    age: Number(candidateData.age),
    role: candidateData.role.trim(),
    portfolioLink: (candidateData.portfolioLink || '').trim(),
    phone: candidateData.phone.trim(),
    email: candidateData.email.trim(),
    skills: candidateData.skills.trim(),
    resumeFileName: candidateData.resumeFileName || '',
    resumeFileData: candidateData.resumeFileData || '',
    resumeFileSize: candidateData.resumeFileSize || '',
    status: 'pending',
    adminNotes: '',
    createdAt: now
  };

  // 1. Save to Local Storage immediately
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const updated = [newApp, ...existing];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  // 2. Save to Supabase SQL Database if active
  if (supabase) {
    try {
      const dbRow = {
        id: newApp.id,
        full_name: newApp.fullName,
        age: newApp.age,
        role_applied: newApp.role,
        portfolio_url: newApp.portfolioLink,
        phone: newApp.phone,
        email: newApp.email,
        skills: newApp.skills,
        resume_file_name: newApp.resumeFileName,
        resume_file_data: newApp.resumeFileData ? newApp.resumeFileData.slice(0, 100000) : null,
        resume_file_size: newApp.resumeFileSize,
        status: newApp.status,
        admin_notes: newApp.adminNotes,
        created_at: newApp.createdAt
      };

      const { error } = await supabase.from('hr_job_applications').insert([dbRow]);
      if (error) console.warn('Supabase HR insert warning:', error.message);
    } catch (dbErr) {
      console.warn('Supabase HR insert exception:', dbErr);
    }
  }

  // 3. Optional Webhook / OneDrive sync
  trySyncToOneDriveWebhook(newApp);

  return newApp;
}

/**
 * Update candidate status and notes
 */
export async function updateApplicationStatus(id, newStatus, notes = null) {
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const updated = existing.map(app => {
    if (app.id === id) {
      return {
        ...app,
        status: newStatus,
        adminNotes: notes !== null ? notes : app.adminNotes,
        updatedAt: new Date().toISOString()
      };
    }
    return app;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  if (supabase) {
    try {
      const updates = { status: newStatus };
      if (notes !== null) updates.admin_notes = notes;
      await supabase.from('hr_job_applications').update(updates).eq('id', id);
    } catch (err) {
      console.warn('Supabase status update error:', err);
    }
  }

  return updated;
}

/**
 * Delete an application
 */
export async function deleteApplication(id) {
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const updated = existing.filter(app => app.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  if (supabase) {
    try {
      await supabase.from('hr_job_applications').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase delete error:', err);
    }
  }

  return updated;
}

/**
 * Export all applications directly into AURA TECH HR SERVICE.xlsx
 */
export function exportToHRServiceExcel(applications) {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Job Applications
  const headers = [
    'Application ID',
    'Application Date',
    'Candidate Full Name',
    'Age',
    'Interested / Applied Role',
    'Mobile Number',
    'Gmail ID',
    'Key Skills',
    'Portfolio Link',
    'Resume File Name',
    'Application Status',
    'HR Notes & Interview Remarks'
  ];

  const rows = applications.map(app => [
    app.id || '',
    app.createdAt ? new Date(app.createdAt).toLocaleString('en-IN') : '',
    app.fullName || '',
    app.age || '',
    app.role || '',
    app.phone || '',
    app.email || '',
    app.skills || '',
    app.portfolioLink || '',
    app.resumeFileName || '',
    formatStatusLabel(app.status),
    app.adminNotes || ''
  ]);

  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  ws['!cols'] = [
    { wch: 18 },
    { wch: 22 },
    { wch: 22 },
    { wch: 8 },
    { wch: 26 },
    { wch: 18 },
    { wch: 28 },
    { wch: 45 },
    { wch: 32 },
    { wch: 30 },
    { wch: 22 },
    { wch: 45 }
  ];
  XLSX.utils.book_append_sheet(wb, ws, 'Job Applications');

  // Sheet 2: Metrics & Summary
  const statusCounts = {};
  APPLICATION_STATUSES.forEach(s => { statusCounts[s.label] = 0; });
  applications.forEach(app => {
    const label = formatStatusLabel(app.status);
    statusCounts[label] = (statusCounts[label] || 0) + 1;
  });

  const summaryData = [
    ['Metric', 'Count'],
    ['Total Applications Received', applications.length],
    ...Object.entries(statusCounts)
  ];
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  wsSummary['!cols'] = [{ wch: 32 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(wb, wsSummary, 'HR Analytics & Summary');

  // Download workbook
  XLSX.writeFile(wb, 'AURA TECH HR SERVICE.xlsx');
}

/**
 * Generate and download an executive PDF dossier for a candidate
 */
export function generateCandidatePDF(candidate) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Header Banner (Navy/Indigo Corporate Theme)
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Brand Name & Tagline
  doc.setTextColor(245, 158, 11); // Amber-500
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('AURA TECH', 18, 18);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('HR & TALENT RECRUITMENT SERVICES', 18, 25);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.setFontSize(8);
  doc.text('A Reliable Backbone Of Your Business  |  auratech.careers@gmail.com', 18, 32);

  // Document Badge on Right
  doc.setFillColor(30, 41, 59); // slate-800
  doc.roundedRect(pageWidth - 75, 12, 60, 20, 2, 2, 'F');
  doc.setTextColor(245, 158, 11);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('CANDIDATE DOSSIER', pageWidth - 70, 19);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`ID: ${candidate.id || 'N/A'}`, pageWidth - 70, 26);

  // Sub-header Bar (Status & Timestamp)
  doc.setFillColor(241, 245, 249);
  doc.rect(0, 42, pageWidth, 12, 'F');
  doc.setTextColor(71, 85, 105);
  doc.setFontSize(8.5);
  const dateStr = candidate.createdAt ? new Date(candidate.createdAt).toLocaleString('en-IN') : 'N/A';
  doc.text(`Application Filed: ${dateStr}`, 18, 49.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`Current Status: ${formatStatusLabel(candidate.status)}`, pageWidth - 80, 49.5);

  let curY = 64;

  // SECTION 1: Personal & Position Overview
  drawSectionHeader(doc, '1. CANDIDATE PROFILE & POSITION', curY);
  curY += 10;

  drawField(doc, 'Full Name', candidate.fullName || 'N/A', 18, curY, 80);
  drawField(doc, 'Age', `${candidate.age || 'N/A'} years`, 110, curY, 80);
  curY += 12;

  drawField(doc, 'Target Role Applied', candidate.role || 'N/A', 18, curY, 80, true);
  drawField(doc, 'Application Status', formatStatusLabel(candidate.status), 110, curY, 80);
  curY += 16;

  // SECTION 2: Contact & Online Presence
  drawSectionHeader(doc, '2. CONTACT & PORTFOLIO DETAILS', curY);
  curY += 10;

  drawField(doc, 'Mobile Number', candidate.phone || 'N/A', 18, curY, 80);
  drawField(doc, 'Gmail ID / Email', candidate.email || 'N/A', 110, curY, 80);
  curY += 12;

  drawField(doc, 'Portfolio / GitHub Link', candidate.portfolioLink || 'Not Provided', 18, curY, 172);
  curY += 16;

  // SECTION 3: Technical Skills & Competencies
  drawSectionHeader(doc, '3. KEY SKILLS & TECHNICAL STACK', curY);
  curY += 10;

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('Demonstrated Skills:', 18, curY);
  curY += 6;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(18, curY - 3, pageWidth - 36, 18, 2, 2, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9.5);
  const skillsText = candidate.skills || 'No specific skills listed.';
  const splitSkills = doc.splitTextToSize(skillsText, pageWidth - 46);
  doc.text(splitSkills, 23, curY + 4);
  curY += 24;

  // SECTION 4: Resume Document Verification
  drawSectionHeader(doc, '4. RESUME & VERIFICATION RECORD', curY);
  curY += 10;

  drawField(doc, 'Resume Filename', candidate.resumeFileName || 'Resume Attached / Stored', 18, curY, 80);
  drawField(doc, 'Document Status', candidate.resumeFileData || candidate.resumeFileName ? 'Verified & On File' : 'Pending Upload', 110, curY, 80);
  curY += 16;

  // SECTION 5: HR Assessment & Interview Remarks
  drawSectionHeader(doc, '5. HR ASSESSMENT & INTERVIEW NOTES', curY);
  curY += 10;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(18, curY - 3, pageWidth - 36, 32, 2, 2, 'FD');

  const notesText = candidate.adminNotes || 'No HR interview remarks recorded yet. Candidate pending initial screening.';
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  const splitNotes = doc.splitTextToSize(notesText, pageWidth - 46);
  doc.text(splitNotes, 23, curY + 4);
  curY += 40;

  // Signature Block
  doc.setDrawColor(203, 213, 225);
  doc.line(18, curY + 12, 70, curY + 12);
  doc.line(pageWidth - 70, curY + 12, pageWidth - 18, curY + 12);

  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('HR Reviewer Signature', 18, curY + 17);
  doc.text('AURA TECH Talent Operations', pageWidth - 70, curY + 17);

  // Footer
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('CONFIDENTIAL  |  Generated from AURA TECH HR Portal Database  |  Connected with AURA TECH HR SERVICE.xlsx', 18, 287);

  // Save / Trigger Download
  const filename = `${(candidate.fullName || 'Candidate').replace(/\s+/g, '_')}_AURA_TECH_Dossier.pdf`;
  doc.save(filename);
}

/**
 * Helper to draw section header in PDF
 */
function drawSectionHeader(doc, title, y) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(30, 41, 59); // slate-800
  doc.text(title, 18, y);
  doc.setDrawColor(245, 158, 11); // Amber
  doc.setLineWidth(0.6);
  doc.line(18, y + 2, 85, y + 2);
}

/**
 * Helper to draw a label-value pair in PDF
 */
function drawField(doc, label, value, x, y, width, isAccent = false) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(label.toUpperCase(), x, y);

  doc.setFont('helvetica', isAccent ? 'bold' : 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(isAccent ? 180 : 15, isAccent ? 83 : 23, isAccent ? 9 : 42);
  const splitVal = doc.splitTextToSize(String(value), width);
  doc.text(splitVal, x, y + 5);
}

/**
 * Format Status String to human readable
 */
export function formatStatusLabel(status) {
  const found = APPLICATION_STATUSES.find(s => s.value === status);
  return found ? found.label : 'Pending Review';
}

/**
 * View or download uploaded resume
 */
export function openCandidateResume(candidate) {
  if (candidate.resumeFileData && candidate.resumeFileData.startsWith('data:')) {
    const win = window.open();
    if (win) {
      win.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Resume - ${candidate.fullName}</title>
            <style>body { margin: 0; background: #1e293b; display: flex; flex-direction: column; height: 100vh; font-family: sans-serif; color: white; }</style>
          </head>
          <body>
            <div style="padding: 12px 20px; background: #0f172a; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155;">
              <div><strong>${candidate.fullName}</strong> - Resume (${candidate.resumeFileName || 'Document'})</div>
              <a href="${candidate.resumeFileData}" download="${candidate.resumeFileName || 'Resume.pdf'}" style="background: #f59e0b; color: black; padding: 6px 14px; border-radius: 6px; font-weight: bold; text-decoration: none;">Download File</a>
            </div>
            <iframe src="${candidate.resumeFileData}" style="width: 100%; height: 100%; border: none;"></iframe>
          </body>
        </html>
      `);
      return;
    }
  }

  // Fallback: If no base64 stored, inform user or generate simulated resume card
  alert(`Resume file: ${candidate.resumeFileName || 'Uploaded on file'}\nCandidate: ${candidate.fullName}\nEmail: ${candidate.email}\nPhone: ${candidate.phone}\n\nNote: Candidate PDF Dossier is also available via "Download PDF".`);
}

/**
 * Webhook synchronization to forward responses to OneDrive / Power Automate / Zapier
 */
export function setOneDriveWebhookUrl(url) {
  localStorage.setItem(WEBHOOK_KEY, url);
}

export function getOneDriveWebhookUrl() {
  return localStorage.getItem(WEBHOOK_KEY) || '';
}

async function trySyncToOneDriveWebhook(candidate) {
  const webhookUrl = getOneDriveWebhookUrl();
  if (!webhookUrl) return;

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source: 'AURA TECH HR Portal',
        excelSheetTarget: 'AURA TECH HR SERVICE.xlsx',
        oneDriveUrl: ONEDRIVE_SHEET_URL,
        applicationId: candidate.id,
        appliedDate: candidate.createdAt,
        candidateName: candidate.fullName,
        age: candidate.age,
        role: candidate.role,
        mobile: candidate.phone,
        email: candidate.email,
        skills: candidate.skills,
        portfolio: candidate.portfolioLink,
        resumeFileName: candidate.resumeFileName,
        status: formatStatusLabel(candidate.status)
      })
    });
    console.log('Successfully posted candidate data to OneDrive Webhook');
  } catch (err) {
    console.warn('Webhook sync error:', err);
  }
}
