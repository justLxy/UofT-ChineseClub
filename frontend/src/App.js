import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import SocialSidebar from './components/SocialSidebar';
import AccountStatusBanner from './components/AccountStatusBanner';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Join = lazy(() => import('./pages/Join'));
const Team = lazy(() => import('./pages/Team'));
const Events = lazy(() => import('./pages/Events'));
const EventsAdmin = lazy(() => import('./pages/EventsAdmin'));
const QinSocietyEvent = lazy(() => import('./pages/events/QinSociety'));
const NewYearConcertEvent = lazy(() => import('./pages/events/NewYearConcert'));
const HaihaiEvent = lazy(() => import('./pages/events/Haihai'));
const StaffProfile = lazy(() => import('./pages/StaffProfile'));
const StaffAdmin = lazy(() => import('./pages/StaffAdmin'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading component
const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
  </div>
);

// Main app content component that uses auth context
const AppContent = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const { user } = useAuth();
  const appRef = useRef(null);
  const [theme, setTheme] = useState('light');
  const [showAccountBanner, setShowAccountBanner] = useState(true);

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

  // Apply saved theme on mount and set document language
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      setTheme(savedTheme);
    }
    
    // Set document language to match i18n current language (already initialized in i18n.js)
    document.documentElement.lang = i18n.language;
    
    // Apply theme variables on mount
    document.documentElement.setAttribute('data-theme', savedTheme || 'light');
  }, [i18n]);

  // Update theme variables when theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

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

  const handleDismissBanner = () => {
    setShowAccountBanner(false);
  };

  return (
    <div className="app" ref={appRef}>
      <Header changeLanguage={changeLanguage} theme={theme} toggleTheme={toggleTheme} />
      <div className="language-change-flash"></div>
      <div className="theme-change-flash"></div>
      
      {/* Account status banner for unactivated users */}
      {showAccountBanner && <AccountStatusBanner user={user} onDismiss={handleDismissBanner} />}
      
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
              <Route path="/events/qin-society" element={<QinSocietyEvent />} />
              <Route path="/events/new-year-concert" element={<NewYearConcertEvent />} />
              <Route path="/events/hihi" element={<HaihaiEvent />} />
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
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App; 