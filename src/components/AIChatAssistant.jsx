import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';

export default function AIChatAssistant({ theme, portalMode, onOpenBookModal, onOpenJobModal }) {
  const [isOpen, setIsOpen] = useState(false);
  const isHr = portalMode === 'hr';

  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: isHr 
        ? 'Hello! I am Aura AI, your HR & Careers assistant. How can I help you explore open positions or apply for roles at AURA TECH today?'
        : 'Hello! I am Aura AI, your technical virtual assistant. How can I help you with AURA TECH services or project registration today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const isDark = theme === 'dark';

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const defaultPrompts = [
    "What services do you offer?",
    "How to book a project?",
    "Do you offer student discounts?",
    "What is your turnaround time?"
  ];

  const hrPrompts = [
    "What roles are open?",
    "How do I apply for a job?",
    "What are the job perks?",
    "Can freshers apply?"
  ];

  const quickPrompts = isHr ? hrPrompts : defaultPrompts;

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = { sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = getAuraResponse(query, onOpenBookModal, onOpenJobModal, isHr);
      setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 p-4 rounded-full btn-primary-action shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          aria-label="Open Aura AI Chat Assistant"
        >
          <div className="relative">
            <MessageSquare size={24} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-slate-950 animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-slate-950"></span>
          </div>
          <span className="hidden sm:inline font-black text-xs uppercase tracking-wider pr-1">
            Aura AI
          </span>
        </button>
      )}

      {/* Chat Box Panel */}
      {isOpen && (
        <div className={`w-[90vw] sm:w-[380px] h-[520px] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200 border ${
          isDark ? 'bg-slate-950 border-amber-500/30' : 'bg-white border-slate-300'
        }`}>
          
          {/* Header */}
          <div className={`p-4 border-b flex items-center justify-between ${
            isDark ? 'bg-black border-amber-500/20' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className="logo-badge bg-white p-1 rounded-lg border border-slate-200">
                <img src="/logo.png" alt="Aura Logo" className="h-6 w-auto object-contain" />
              </div>
              <div>
                <h4 className={`text-sm font-black flex items-center gap-1.5 uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Aura AI Assistant
                  <Sparkles size={13} className={isDark ? 'text-amber-400' : 'text-blue-600'} />
                </h4>
                <span className={`text-[10px] font-bold flex items-center gap-1 ${isDark ? 'text-amber-400' : 'text-blue-600'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-amber-400' : 'bg-blue-600'}`}></span> Online • Instant Answers
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className={`p-1.5 rounded-lg transition-colors ${
                isDark ? 'text-slate-400 hover:text-white hover:bg-slate-900' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className={`flex-1 p-4 overflow-y-auto space-y-3.5 custom-scrollbar text-xs ${
            isDark ? 'bg-black/60' : 'bg-slate-50/50'
          }`}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${
                    isDark ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-blue-50 border-blue-200 text-blue-600'
                  }`}>
                    <Bot size={15} />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] p-3 rounded-2xl leading-relaxed ${
                    msg.sender === 'user'
                      ? 'btn-primary-action rounded-tr-none font-bold shadow-md'
                      : isDark 
                        ? 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none' 
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>

                {msg.sender === 'user' && (
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    isDark ? 'bg-slate-800 text-amber-400' : 'bg-slate-200 text-slate-700'
                  }`}>
                    <User size={15} />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 justify-start items-center text-slate-500 text-[11px]">
                <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${
                  isDark ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-blue-50 border-blue-200 text-blue-600'
                }`}>
                  <Bot size={15} />
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <Loader2 size={13} className={`animate-spin ${isDark ? 'text-amber-400' : 'text-blue-600'}`} />
                  <span>Aura AI is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className={`px-3 py-2 border-t flex gap-2 overflow-x-auto custom-scrollbar ${
            isDark ? 'bg-black/90 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap transition-colors border ${
                  isDark 
                    ? 'bg-slate-900 hover:bg-amber-500/20 border-amber-500/20 text-slate-300 hover:text-amber-400' 
                    : 'bg-slate-100 hover:bg-blue-50 border-slate-200 text-slate-700 hover:text-blue-600'
                }`}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className={`p-3 border-t ${isDark ? 'bg-black border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Aura AI a question..."
                className={`flex-1 rounded-xl px-3 py-2 text-xs focus:outline-none transition-colors border ${
                  isDark ? 'bg-slate-900 border-slate-800 focus:border-amber-500 text-white' : 'bg-white border-slate-300 focus:border-blue-600 text-slate-900'
                }`}
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="p-2 rounded-xl btn-primary-action disabled:opacity-40 transition-colors cursor-pointer"
              >
                <Send size={15} />
              </button>
            </form>
          </div>

        </div>
      )}

    </div>
  );
}

function getAuraResponse(q, onOpenBookModal, onOpenJobModal, isHr) {
  const query = q.toLowerCase();

  if (isHr) {
    if (query.includes('role') || query.includes('job') || query.includes('position') || query.includes('vacancy') || query.includes('opening')) {
      return "AURA TECH is actively hiring for:\n• Full Stack Developer\n• UI/UX Designer\n• AI / Machine Learning Engineer\n• Mobile App Developer\n• Video Editor & Motion Designer\n• IoT & Embedded Systems Engineer\n\nClick 'Apply Now' to submit your application!";
    }
    if (query.includes('apply') || query.includes('resume') || query.includes('submit') || query.includes('form') || query.includes('how')) {
      return "To apply, simply click the 'Apply Now' button! You'll fill in your Name, Age, Role, Mobile Number, Gmail ID, Skills, optional Portfolio link, and upload your Resume. Our HR team reviews submissions within 48 hours.";
    }
    if (query.includes('perk') || query.includes('benefit') || query.includes('salary') || query.includes('stipend') || query.includes('pay') || query.includes('compensation')) {
      return "AURA TECH perks include:\n• 100% Mentorship & Pair Programming\n• Competitive stipends & industry packages\n• Flexible remote & hybrid working options\n• Work on live production & enterprise systems\n\nClick 'Apply Now' to join our team!";
    }
    if (query.includes('fresher') || query.includes('student') || query.includes('intern') || query.includes('experience')) {
      return "Yes! Freshers, students, and self-taught developers are welcome to apply. We value passion, problem-solving, and your project portfolio over traditional pedigree. Click 'Apply Now' to apply!";
    }
    if (query.includes('contact') || query.includes('email') || query.includes('phone') || query.includes('hr')) {
      return "You can reach our recruitment team:\n• HR Direct: +91 90252 55617\n• Careers Helpdesk: +91 93452 56633\n• Email: auratech008@gmail.com\n\nClick 'Apply Now' to submit your details directly.";
    }
    return "AURA TECH is looking for ambitious builders and innovators. Click 'Apply Now' to submit your candidate profile, resume, and skills!";
  }

  if (query.includes('service') || query.includes('offer') || query.includes('do')) {
    return "AURA TECH offers Website Development, Custom Software, AI Chatbots, Mobile Apps (Flutter), UI/UX Design, Logo Branding, Data Visualization, and Video Editing. You can click 'Book Service' under any section to request a project!";
  }
  if (query.includes('book') || query.includes('register') || query.includes('start')) {
    return "Booking a project is easy! Click the 'Book Project' button on the navigation bar or contact section, fill in your details (Student or Enterprise), and our team will get in touch with you within 24 hours.";
  }
  if (query.includes('student') || query.includes('college') || query.includes('discount')) {
    return "Yes! AURA TECH specializes in helping students with college projects, datathons, final year capstone projects, and AI apps. Students get dedicated project guidance and special budget-friendly pricing!";
  }
  if (query.includes('time') || query.includes('turnaround') || query.includes('duration') || query.includes('days')) {
    return "Standard websites and simple applications take 2 to 4 weeks. Complex enterprise applications or custom AI integrations range from 2 to 4 months. We guarantee 100% on-time milestone delivery!";
  }
  if (query.includes('contact') || query.includes('email') || query.includes('phone') || query.includes('call') || query.includes('reach') || query.includes('help')) {
    return "You can reach us directly:\n• AURA TECH Direct: +91 90252 55617\n• HELP DESK: +91 93452 56633\n• Email: auratech008@gmail.com\n• Instagram: @__aura_tech_\nOur response team is ready to assist you!";
  }
  return "AURA TECH is a reliable backbone of your business. We deliver high-quality, budget-friendly design and engineering solutions. Would you like to book a project consultation with our team?";
}
