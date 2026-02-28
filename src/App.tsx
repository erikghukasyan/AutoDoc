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
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

const HomePage = () => (
  <>
    <SearchSection />
    <HowToUse />
    <AboutUs />
    <ContactUs />
  </>
);

function AppContent() {
  const { theme } = useTheme();
  
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
          <Route path="/history" element={<HistoryList />} />
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
