import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar, Footer } from './components/Layout';
import { SearchSection } from './components/SearchSection';
import { HowToUse } from './components/HowToUse';
import { AboutUs } from './components/AboutUs';
import { ContactUs } from './components/ContactUs';
import { VinLookup } from './components/VinLookup';
import { MaintenanceCalculator } from './components/MaintenanceCalculator';
import { ServiceMap } from './components/ServiceMap';
import { HistoryList } from './components/HistoryList';
import { PriceAppraiser } from './components/PriceAppraiser';
import { VideoSection } from './components/VideoSection';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Navigate, useLocation } from 'react-router-dom';

const HomePage = () => (
  <>
    <SearchSection />
    <VideoSection />
    <div id="how-to-use">
      <HowToUse />
    </div>
    <div id="about">
      <AboutUs />
    </div>
    <div id="contact">
      <ContactUs />
    </div>
  </>
);

function AppContent() {
  const { theme } = useTheme();
  const { isAdmin } = useAuth();
  const location = useLocation();
  
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans selection:bg-brand-500/30 selection:text-white ${
      theme === 'dark' 
        ? 'bg-[#0a0a0a] text-slate-200' 
        : 'bg-white text-slate-900'
    }`}>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/vin" element={<VinLookup />} />
          <Route path="/maintenance" element={<MaintenanceCalculator />} />
          <Route path="/map" element={<ServiceMap />} />
          <Route path="/appraiser" element={<PriceAppraiser />} />
          <Route path="/history" element={<HistoryList />} />
          <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
