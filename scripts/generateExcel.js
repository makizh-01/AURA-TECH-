import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

// Generate AURA TECH HR SERVICE.xlsx
function generateInitialExcel() {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Job Applications
  const headers = [
    "Application ID",
    "Application Date",
    "Candidate Full Name",
    "Age",
    "Interested / Applied Role",
    "Mobile Number",
    "Gmail ID",
    "Key Skills",
    "Portfolio Link",
    "Resume File Name",
    "Application Status",
    "HR Notes & Interview Remarks"
  ];

  const sampleRows = [
    [
      "APP-2026-001",
      "2026-10-23 10:30 AM",
      "Alex Morgan",
      24,
      "Full Stack Developer",
      "+91 98765 43210",
      "alex.morgan.dev@gmail.com",
      "React, Node.js, TypeScript, PostgreSQL, TailwindCSS",
      "https://github.com/alexmorgan-dev",
      "Alex_Morgan_Resume.pdf",
      "Shortlisted",
      "Strong portfolio with 3 full-stack React + Node projects. Schedule technical round."
    ],
    [
      "APP-2026-002",
      "2026-10-23 02:15 PM",
      "Priya Sharma",
      22,
      "UI/UX Designer",
      "+91 91234 56789",
      "priya.sharma.design@gmail.com",
      "Figma, Adobe XD, Prototyping, Design Systems, Mobile UI",
      "https://behance.net/priyadesigns",
      "Priya_Sharma_Portfolio_Resume.pdf",
      "Under Review",
      "Impressive mobile UI case studies in Behance. Reviewing design system samples."
    ],
    [
      "APP-2026-003",
      "2026-10-23 04:45 PM",
      "Karthik Raja",
      26,
      "AI / ML Engineer",
      "+91 94455 66778",
      "karthik.raja.ai@gmail.com",
      "Python, PyTorch, LangChain, OpenAI APIs, FastAPIs, Docker",
      "https://github.com/karthik-ai-labs",
      "Karthik_Raja_AI_CV.pdf",
      "Interview Scheduled",
      "Technical round scheduled for Tuesday 11:00 AM IST."
    ]
  ];

  const wsData = [headers, ...sampleRows];
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Set Column Widths
  ws['!cols'] = [
    { wch: 18 }, // Application ID
    { wch: 20 }, // Application Date
    { wch: 22 }, // Full Name
    { wch: 8 },  // Age
    { wch: 26 }, // Role
    { wch: 18 }, // Mobile
    { wch: 28 }, // Gmail ID
    { wch: 45 }, // Skills
    { wch: 32 }, // Portfolio Link
    { wch: 30 }, // Resume
    { wch: 20 }, // Status
    { wch: 45 }  // HR Notes
  ];

  XLSX.utils.book_append_sheet(wb, ws, "Job Applications");

  // Sheet 2: HR Open Roles Reference
  const rolesData = [
    ["Role Title", "Department", "Required Experience", "Open Positions", "Target Skills"],
    ["Full Stack Developer", "Engineering", "1-3 Years / Fresher", "3", "React, Node.js, SQL, REST APIs"],
    ["Frontend Developer", "Engineering", "0-2 Years", "2", "React, Next.js, Tailwind CSS, JavaScript"],
    ["Backend Developer", "Engineering", "1-3 Years", "2", "Node.js, Python, PostgreSQL, Supabase"],
    ["UI/UX Designer", "Design", "0-2 Years", "2", "Figma, Design Systems, Wireframing"],
    ["AI / ML Engineer", "AI & Innovations", "1-4 Years", "2", "Python, LLMs, PyTorch, LangChain"],
    ["Mobile App Developer", "Engineering", "1-3 Years", "2", "Flutter, React Native, Firebase"],
    ["Video & Motion Editor", "Creative Media", "0-2 Years", "1", "Premiere Pro, After Effects, AI Video Tools"],
    ["IoT Systems Engineer", "Hardware & Embedded", "0-3 Years", "1", "ESP32, Arduino, MQTT, Embedded C"]
  ];
  const wsRoles = XLSX.utils.aoa_to_sheet(rolesData);
  wsRoles['!cols'] = [
    { wch: 25 },
    { wch: 20 },
    { wch: 22 },
    { wch: 16 },
    { wch: 45 }
  ];
  XLSX.utils.book_append_sheet(wb, wsRoles, "Open Roles Reference");

  // Save to project root and public folder
  const rootPath = path.resolve('./AURA TECH HR SERVICE.xlsx');
  const publicPath = path.resolve('./public/AURA TECH HR SERVICE.xlsx');

  XLSX.writeFile(wb, rootPath);
  XLSX.writeFile(wb, publicPath);

  console.log(`Generated: ${rootPath}`);
  console.log(`Generated: ${publicPath}`);
}

generateInitialExcel();
