import React from 'react';
import { Car, Menu, X, LogIn, UserPlus, LogOut, User as UserIcon, History, Globe, ChevronDown, Sun, Moon, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { AuthModal } from './AuthModal';
import { ProfileModal } from './ProfileModal';

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLangOpen, setIsLangOpen] = React.useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = React.useState(false);
  const location = useLocation();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
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

  const openAuth = () => {
    setIsAuthModalOpen(true);
    setIsOpen(false);
  };

  return (
    <nav className="bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-20 relative">
          <Link to="/" className="flex items-center group z-10">
            <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{t('nav.logo')}</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-4 absolute left-1/2 -translate-x-1/2">
            <Link to="/" className={`${isActive('/') ? 'text-brand-500 dark:text-brand-400' : 'text-slate-600 dark:text-slate-400'} hover:text-brand-600 dark:hover:text-white text-sm font-medium transition-colors whitespace-nowrap`}>{t('nav.search')}</Link>
            <Link to="/vin" className={`${isActive('/vin') ? 'text-brand-500 dark:text-brand-400' : 'text-slate-600 dark:text-slate-400'} hover:text-brand-600 dark:hover:text-white text-sm font-medium transition-colors whitespace-nowrap`}>{t('nav.vin')}</Link>
            <Link to="/maintenance" className={`${isActive('/maintenance') ? 'text-brand-500 dark:text-brand-400' : 'text-slate-600 dark:text-slate-400'} hover:text-brand-600 dark:hover:text-white text-sm font-medium transition-colors whitespace-nowrap`}>{t('nav.maintenance')}</Link>
            <Link to="/map" className={`${isActive('/map') ? 'text-brand-500 dark:text-brand-400' : 'text-slate-600 dark:text-slate-400'} hover:text-brand-600 dark:hover:text-white text-sm font-medium transition-colors whitespace-nowrap`}>{t('nav.map')}</Link>
            <Link to="/appraiser" className={`${isActive('/appraiser') ? 'text-brand-500 dark:text-brand-400' : 'text-slate-600 dark:text-slate-400'} hover:text-brand-600 dark:hover:text-white text-sm font-medium transition-colors whitespace-nowrap`}>{t('nav.appraiser')}</Link>
            <HashLink smooth to="/#how-to-use" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-white text-sm font-medium transition-colors whitespace-nowrap">{t('nav.howToUse')}</HashLink>
            <HashLink smooth to="/#about" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-white text-sm font-medium transition-colors whitespace-nowrap">{t('nav.about')}</HashLink>
            <HashLink smooth to="/#contact" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-white text-sm font-medium transition-colors whitespace-nowrap">{t('nav.contact')}</HashLink>
          </div>

          <div className="hidden md:flex items-center space-x-4 ml-auto z-10">
            {isAuthenticated && (
              <Link to="/history" className={`${isActive('/history') ? 'text-brand-500 dark:text-brand-400' : 'text-slate-600 dark:text-slate-400'} hover:text-brand-600 dark:hover:text-white text-sm font-medium transition-colors flex items-center whitespace-nowrap`}>
                <History className="w-4 h-4 mr-1" />
                {t('nav.history')}
              </Link>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-white transition-colors rounded-lg bg-slate-100 dark:bg-white/5 shrink-0"
              title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Language Switcher */}
            <div className="relative ml-2 pl-2 border-l border-slate-200 dark:border-white/10 shrink-0">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center space-x-1 text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-white text-sm font-medium transition-colors py-1"
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="text-xs">{currentLang.flag}</span>
                <ChevronDown className={`w-2.5 h-2.5 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
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

            {isAdmin && (
              <Link 
                to="/admin" 
                className="relative group px-4 py-2 flex items-center space-x-2 overflow-hidden rounded-lg transition-all active:scale-95 shrink-0 ml-2"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-brand-600 to-indigo-600 group-hover:from-brand-500 group-hover:to-indigo-500 transition-all"></div>
                <ShieldCheck className="w-3.5 h-3.5 text-white relative z-10" />
                <span className="text-[10px] font-black text-white relative z-10 tracking-tight uppercase whitespace-nowrap">
                  {t('admin.dashboard')}
                </span>
              </Link>
            )}

            {isAuthenticated && (
              <button
                onClick={logout}
                className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-lg bg-slate-100 dark:bg-white/5 shrink-0 ml-2"
                title={t('nav.logout')}
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}

            {!isAuthenticated && (
              <div className="flex items-center space-x-2 ml-2">
                <button
                  onClick={() => openAuth()}
                  className="px-4 py-2 bg-brand-500 text-white text-xs font-bold rounded-lg hover:bg-brand-600 transition-all active:scale-95 whitespace-nowrap"
                >
                  {t('nav.login')}
                </button>
                <Link
                  to="/admin"
                  className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-all active:scale-95 whitespace-nowrap"
                >
                  {t('nav.adminLogin')}
                </Link>
              </div>
            )}
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
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl">{t('nav.search')}</Link>
            <Link to="/vin" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl">{t('nav.vin')}</Link>
            <Link to="/maintenance" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl">{t('nav.maintenance')}</Link>
            <Link to="/map" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl">{t('nav.map')}</Link>
            <Link to="/appraiser" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl">{t('nav.appraiser')}</Link>
            
            {isAdmin && (
              <Link 
                to="/admin" 
                onClick={() => setIsOpen(false)} 
                className="mx-4 my-2 p-4 bg-gradient-to-r from-brand-600 to-indigo-600 rounded-2xl flex items-center justify-center space-x-3 shadow-lg shadow-brand-500/20 active:scale-95 transition-all"
              >
                <ShieldCheck className="w-5 h-5 text-white" />
                <span className="text-sm font-black text-white uppercase tracking-wider">
                  {t('admin.dashboard')}
                </span>
              </Link>
            )}
            
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
                    onClick={() => openAuth()}
                    className="w-full flex items-center px-4 py-3 bg-brand-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-brand-500/20"
                  >
                    <LogIn className="w-5 h-5 mr-3" />
                    {t('nav.login')}
                  </button>
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="w-full flex items-center px-4 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold transition-all shadow-lg shadow-slate-900/20 dark:shadow-white/10"
                  >
                    <ShieldCheck className="w-5 h-5 mr-3" />
                    {t('nav.adminLogin')}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
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
            <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{t('nav.logo')}</span>
          </div>
          <div className="text-slate-500 text-sm font-medium">
            © {new Date().getFullYear()} {t('nav.logo')}: {t('footer.rights')}
          </div>
        </div>
      </div>
    </footer>
  );
};
