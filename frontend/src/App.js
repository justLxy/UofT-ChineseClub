import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { AuthProvider } from './contexts/AuthContext';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import SocialSidebar from './components/SocialSidebar';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Join = lazy(() => import('./pages/Join'));
const Team = lazy(() => import('./pages/Team'));
const Events = lazy(() => import('./pages/Events'));
const EventsAdmin = lazy(() => import('./pages/EventsAdmin'));
const StaffProfile = lazy(() => import('./pages/StaffProfile'));
const StaffAdmin = lazy(() => import('./pages/StaffAdmin'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading component
const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
  </div>
);

function App() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const appRef = useRef(null);
  const [theme, setTheme] = useState('light');

  // Handle language change
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.documentElement.lang = lng;
    localStorage.setItem('preferredLanguage', lng);
    
    // Animation for language change
    const flashElement = document.querySelector('.language-change-flash');
    if (flashElement) {
      gsap.fromTo(
        flashElement,
        { opacity: 0.8, scale: 1 },
        { opacity: 0, scale: 1.5, duration: 0.6, ease: 'power2.out' }
      );
    }
  };

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  useEffect(() => {
    // Apply theme to document element
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Sync language with ?lang= parameter in URL on every navigation
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const langParam = urlParams.get('lang');
    if (langParam && ['en', 'zh'].includes(langParam) && langParam !== i18n.language) {
      i18n.changeLanguage(langParam);
      document.documentElement.lang = langParam;
      localStorage.setItem('preferredLanguage', langParam);
    }
  }, [location.search, i18n]);

  // Ensure html lang attribute stays in sync with i18n language
  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  // Toggle theme between light and dark
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    // Animation for theme change
    const flashElement = document.querySelector('.theme-change-flash');
    if (flashElement) {
      gsap.fromTo(
        flashElement,
        { opacity: 0.5, scale: 1 },
        { opacity: 0, scale: 1.5, duration: 0.6, ease: 'power2.out' }
      );
    }
  };

  return (
    <AuthProvider>
      <div className="app" ref={appRef}>
        <Header changeLanguage={changeLanguage} theme={theme} toggleTheme={toggleTheme} />
        <div className="language-change-flash"></div>
        <div className="theme-change-flash"></div>
        <SocialSidebar />
        
        <main>
          <AnimatePresence mode="wait">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/join" element={<Join />} />
                <Route path="/team" element={<Team />} />
                <Route path="/team/:member" element={<Team />} />
                <Route path="/events" element={<Events />} />
                <Route path="/admin/events" element={<EventsAdmin />} />
                <Route path="/admin/staff" element={<StaffAdmin />} />
                <Route path="/staff/profile" element={<StaffProfile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </AnimatePresence>
        </main>
        
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App; 