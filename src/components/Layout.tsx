import React from 'react';
import { Car, Menu, X, LogIn, UserPlus, LogOut, User as UserIcon, History, Globe, ChevronDown, Sun, Moon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { AuthModal } from './AuthModal';

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLangOpen, setIsLangOpen] = React.useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const [authMode, setAuthMode] = React.useState<'login' | 'signup'>('login');
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path: string) => location.pathname === path;

  const languages = [
    { code: 'hy', label: 'Հայերեն', flag: '🇦🇲' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  ];

  const currentLang = languages.find(l => l.code === language) || languages[0];

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
    setIsOpen(false);
  };

  return (
    <nav className="bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <Link to="/" className="flex items-center group">
            <div className="w-10 h-10 bg-brand-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Car className="h-6 w-6 text-brand-400" />
            </div>
            <span className="ml-3 text-xl font-bold text-slate-900 dark:text-white tracking-tight">{t('nav.logo')}</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8 ml-auto">
            <Link to="/" className={`${isActive('/') ? 'text-brand-500 dark:text-brand-400' : 'text-slate-600 dark:text-slate-400'} hover:text-brand-600 dark:hover:text-white font-medium transition-colors`}>{t('nav.home')}</Link>
            <Link to="/vin" className={`${isActive('/vin') ? 'text-brand-500 dark:text-brand-400' : 'text-slate-600 dark:text-slate-400'} hover:text-brand-600 dark:hover:text-white font-medium transition-colors`}>{t('nav.vin')}</Link>
            <Link to="/maintenance" className={`${isActive('/maintenance') ? 'text-brand-500 dark:text-brand-400' : 'text-slate-600 dark:text-slate-400'} hover:text-brand-600 dark:hover:text-white font-medium transition-colors`}>{t('nav.maintenance')}</Link>
            <Link to="/map" className={`${isActive('/map') ? 'text-brand-500 dark:text-brand-400' : 'text-slate-600 dark:text-slate-400'} hover:text-brand-600 dark:hover:text-white font-medium transition-colors`}>{t('nav.map')}</Link>
            {isAuthenticated && (
              <Link to="/history" className={`${isActive('/history') ? 'text-brand-500 dark:text-brand-400' : 'text-slate-600 dark:text-slate-400'} hover:text-brand-600 dark:hover:text-white font-medium transition-colors flex items-center`}>
                <History className="w-4 h-4 mr-1.5" />
                {t('nav.history')}
              </Link>
            )}
            <HashLink smooth to="/#how-to-use" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-white font-medium transition-colors">{t('nav.howToUse')}</HashLink>
            <HashLink smooth to="/#about" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-white font-medium transition-colors">{t('nav.about')}</HashLink>
            <HashLink smooth to="/#contact" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-white font-medium transition-colors">{t('nav.contact')}</HashLink>
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-white transition-colors rounded-xl bg-slate-100 dark:bg-white/5"
              title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {/* Language Switcher */}
            <div className="relative ml-4 pl-4 border-l border-slate-200 dark:border-white/10">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-white font-medium transition-colors py-2"
              >
                <Globe className="w-4 h-4" />
                <span>{currentLang.flag}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLangOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsLangOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-40 glass rounded-2xl overflow-hidden shadow-2xl z-50 border-slate-200 dark:border-white/10">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code as any);
                          setIsLangOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-sm transition-colors ${
                          language === lang.code 
                            ? 'bg-brand-500/20 text-brand-600 dark:text-brand-400 font-bold' 
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-400"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 dark:text-slate-400">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-[#0a0a0a] border-t border-slate-200 dark:border-white/5">
          <div className="px-4 pt-4 pb-6 space-y-2">
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl">{t('nav.home')}</Link>
            <Link to="/vin" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl">{t('nav.vin')}</Link>
            <Link to="/maintenance" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl">{t('nav.maintenance')}</Link>
            <Link to="/map" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl">{t('nav.map')}</Link>
            <HashLink smooth to="/#how-to-use" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl">{t('nav.howToUse')}</HashLink>
            <HashLink smooth to="/#about" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl">{t('nav.about')}</HashLink>
            <HashLink smooth to="/#contact" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl">{t('nav.contact')}</HashLink>
            {isAuthenticated && (
              <Link to="/history" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl flex items-center">
                <History className="w-4 h-4 mr-2" />
                {t('nav.history')}
              </Link>
            )}

            <div className="pt-4 mt-4 border-t border-slate-200 dark:border-white/5">
              <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">{t('nav.language')}</p>
              <div className="grid grid-cols-2 gap-2 px-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code as any);
                      setIsOpen(false);
                    }}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                      language === lang.code 
                        ? 'bg-brand-500/20 text-brand-600 dark:text-brand-400 border border-brand-500/30' 
                        : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-transparent'
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span className="text-sm font-bold">{lang.label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="pt-6 mt-6 border-t border-slate-200 dark:border-white/5 space-y-3">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center px-4 py-3 space-x-4 bg-slate-100 dark:bg-white/5 rounded-2xl">
                    <div className="w-10 h-10 bg-brand-500/20 rounded-full flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">{user?.name}</span>
                  </div>
                  <button
                    onClick={() => { logout(); setIsOpen(false); }}
                    className="w-full flex items-center px-4 py-3 text-red-500 dark:text-red-400 hover:bg-red-500/10 rounded-xl font-semibold transition-colors"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => openAuth('login')}
                    className="w-full flex items-center px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl font-semibold transition-colors"
                  >
                    <LogIn className="w-5 h-5 mr-3" />
                    {t('nav.login')}
                  </button>
                  <button
                    onClick={() => openAuth('signup')}
                    className="w-full flex items-center px-4 py-3 bg-brand-500 text-white font-bold rounded-xl shadow-lg shadow-brand-500/20 transition-all active:scale-95"
                  >
                    <UserPlus className="w-5 h-5 mr-3" />
                    {t('nav.signup')}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />

      {/* Fixed Auth Buttons at Bottom Right */}
      <div className="hidden md:flex fixed bottom-2 right-8 z-[60] items-center space-x-4">
        {isAuthenticated ? (
          <div className="flex items-center space-x-4 glass p-3 rounded-[2rem] shadow-2xl border-slate-200 dark:border-white/20">
            <div className="flex items-center space-x-4 px-6 py-3 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10">
              <div className="w-6 h-6 bg-brand-500/20 rounded-full flex items-center justify-center">
                <UserIcon className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-white">{user?.name}</span>
            </div>
            <button
              onClick={logout}
              className="p-3.5 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10"
              title={t('nav.logout')}
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-4 glass p-3 rounded-[2rem] shadow-2xl border-slate-200 dark:border-white/20">
            <button
              onClick={() => openAuth('login')}
              className="flex items-center text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-white font-bold transition-colors px-6 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5"
            >
              <LogIn className="w-5 h-5 mr-2" />
              {t('nav.login')}
            </button>
            <button
              onClick={() => openAuth('signup')}
              className="flex items-center px-8 py-3.5 bg-brand-500 text-white rounded-2xl font-black hover:bg-brand-600 transition-all shadow-xl shadow-brand-500/30 active:scale-95"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              {t('nav.signup')}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-slate-50 dark:bg-[#050505] text-slate-600 dark:text-slate-400 py-16 border-t border-slate-200 dark:border-white/5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-8 md:mb-0 group">
            <div className="w-10 h-10 bg-brand-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Car className="h-6 w-6 text-brand-400" />
            </div>
            <span className="ml-3 text-xl font-bold text-slate-900 dark:text-white tracking-tight">{t('nav.logo')}</span>
          </div>
          <div className="text-slate-500 text-sm font-medium">
            © {new Date().getFullYear()} {t('nav.logo')}: {t('footer.rights')}
          </div>
        </div>
      </div>
    </footer>
  );
};
