import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ServicesSection from './components/ServicesSection';
import ProjectsSection from './components/ProjectsSection';
import HRServiceSection from './components/HRServiceSection';
import TeamSection from './components/TeamSection';
import AdvantageSection from './components/AdvantageSection';
import FAQSection from './components/FAQSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import AboutModal from './components/AboutModal';
import RegistrationModal from './components/RegistrationModal';
import JobApplicationModal from './components/JobApplicationModal';
import AdminModal from './components/AdminModal';
import ClientDashboardModal from './components/ClientDashboardModal';
import AIChatAssistant from './components/AIChatAssistant';
import AnimatedOfficeBackground from './components/AnimatedOfficeBackground';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('aura_theme') || 'light';
  });

  const [portalMode, setPortalMode] = useState('student'); // 'student' | 'company' | 'hr'
  const navigate = useNavigate();
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isClientDashOpen, setIsClientDashOpen] = useState(false);
  const [initialService, setInitialService] = useState('');
  const [initialJobRole, setInitialJobRole] = useState('');

  useEffect(() => {
    localStorage.setItem('aura_theme', theme);
    document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleOpenBookModal = (serviceName = '') => {
    setInitialService(serviceName);
    setIsBookModalOpen(true);
  };

  const handleOpenJobModal = (roleTitle = '') => {
    setInitialJobRole(roleTitle);
    setIsJobModalOpen(true);
  };


  const handleOpenAdmin = () => {
    navigate('/admin');
  };

  return (
    <Routes>
      
      {/* Dedicated Admin Portal Extension (/admin) */}
      <Route 
        path="/admin" 
        element={
          <AdminDashboard 
            theme={theme} 
            onToggleTheme={toggleTheme} 
          />
        } 
      />

      {/* Main Public Website (/ and all sub-paths) */}
      <Route 
        path="*" 
        element={
          <div className="min-h-screen font-sans relative transition-colors duration-300">
            
            {/* Scroll-Reactive Animated Office Interface Background for the whole page */}
            <AnimatedOfficeBackground theme={theme} />
            
            {/* Navigation Bar */}
            <Navbar
              theme={theme}
              portalMode={portalMode}
              setPortalMode={setPortalMode}
              onToggleTheme={toggleTheme}
              onOpenBookModal={handleOpenBookModal}
              onOpenAboutModal={() => setIsAboutModalOpen(true)}
              onOpenAdminModal={handleOpenAdmin}
              onOpenClientDashboard={() => setIsClientDashOpen(true)}
              onOpenJobModal={handleOpenJobModal}
            />

            {/* Main Page Sections */}
            <main>
              <Hero
                theme={theme}
                portalMode={portalMode}
                setPortalMode={setPortalMode}
                onOpenBookModal={(srv) => handleOpenBookModal(srv)}
                onOpenAboutModal={() => setIsAboutModalOpen(true)}
                onOpenClientDashboard={() => setIsClientDashOpen(true)}
                onOpenJobModal={handleOpenJobModal}
              />

              {portalMode === 'hr' ? (
                <>
                  {/* HR Service Portal: Strictly HR positions, culture, and Apply Now options */}
                  <HRServiceSection
                    theme={theme}
                    onOpenJobModal={handleOpenJobModal}
                  />

                  <FAQSection
                    theme={theme}
                  />

                  <ContactSection
                    theme={theme}
                    portalMode={portalMode}
                    onOpenJobModal={handleOpenJobModal}
                    onOpenBookModal={() => handleOpenBookModal()}
                  />
                </>
              ) : (
                <>
                  {/* Student & Company Portals: Retain 100% of all existing sections and booking unchanged */}
                  <HRServiceSection
                    theme={theme}
                    onOpenJobModal={handleOpenJobModal}
                  />

                  <ServicesSection
                    theme={theme}
                    onBookService={(serviceTitle) => handleOpenBookModal(serviceTitle)}
                  />

                  <ProjectsSection
                    theme={theme}
                    onOpenBookModal={(projectTitle) => handleOpenBookModal(projectTitle)}
                  />

                  <TeamSection
                    theme={theme}
                    onOpenBookModal={() => handleOpenBookModal()}
                  />

                  <AdvantageSection
                    theme={theme}
                    onOpenBookModal={() => handleOpenBookModal()}
                  />

                  <FAQSection
                    theme={theme}
                  />

                  <ContactSection
                    theme={theme}
                    portalMode={portalMode}
                    onOpenBookModal={() => handleOpenBookModal()}
                  />
                </>
              )}
            </main>

            {/* Footer */}
            <Footer
              theme={theme}
              portalMode={portalMode}
              onOpenAboutModal={() => setIsAboutModalOpen(true)}
              onOpenBookModal={() => handleOpenBookModal()}
              onOpenAdminModal={handleOpenAdmin}
              onOpenJobModal={handleOpenJobModal}
            />

            {/* Modals & AI Floating Widget */}
            <AboutModal
              theme={theme}
              isOpen={isAboutModalOpen}
              onClose={() => setIsAboutModalOpen(false)}
              onOpenBookModal={() => handleOpenBookModal()}
            />

            <RegistrationModal
              theme={theme}
              isOpen={isBookModalOpen}
              onClose={() => setIsBookModalOpen(false)}
              initialService={initialService}
            />

            <JobApplicationModal
              theme={theme}
              isOpen={isJobModalOpen}
              onClose={() => setIsJobModalOpen(false)}
              initialRole={initialJobRole}
            />

            <AdminModal
              theme={theme}
              isOpen={isAdminModalOpen}
              onClose={() => setIsAdminModalOpen(false)}
            />

            <ClientDashboardModal
              theme={theme}
              isOpen={isClientDashOpen}
              onClose={() => setIsClientDashOpen(false)}
              onOpenBookModal={() => handleOpenBookModal()}
            />

            <AIChatAssistant
              theme={theme}
              portalMode={portalMode}
              onOpenBookModal={(service) => handleOpenBookModal(service)}
              onOpenJobModal={handleOpenJobModal}
            />

          </div>
        } 
      />

    </Routes>
  );
}
