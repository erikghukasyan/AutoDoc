import React from 'react';
import { History as HistoryIcon, Trash2, ExternalLink, Search, Car, Calculator } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export const HistoryList = () => {
  const { history, clearHistory, isAuthenticated } = useAuth();
  const { t, language } = useLanguage();

  if (!isAuthenticated) {
    return (
      <div className="text-center py-20">
        <HistoryIcon className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('history.notAvailable')}</h2>
        <p className="text-slate-600 dark:text-slate-400">{t('history.loginRequired')}</p>
      </div>
    );
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'search': return <Search className="w-4 h-4" />;
      case 'vin': return <Car className="w-4 h-4" />;
      case 'maintenance': return <Calculator className="w-4 h-4" />;
      default: return <HistoryIcon className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'search': return t('history.type.search');
      case 'vin': return t('history.type.vin');
      case 'maintenance': return t('history.type.maintenance');
      default: return t('history.type.other');
    }
  };

  const getLocale = (lang: string) => {
    switch (lang) {
      case 'hy': return 'hy-AM';
      case 'ru': return 'ru-RU';
      case 'es': return 'es-ES';
      default: return 'en-US';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-24 transition-colors duration-300">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">{t('history.title')}</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">{t('history.subtitle')}</p>
        </div>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center px-4 py-2 text-red-500 dark:text-red-400 hover:text-red-400 dark:hover:text-red-300 hover:bg-red-500/10 rounded-xl font-medium transition-all"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {t('history.clear')}
          </button>
        )}
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {history.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 glass rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-white/5"
            >
              <HistoryIcon className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-6" />
              <p className="text-slate-500 text-lg">{t('history.empty')}</p>
            </motion.div>
          ) : (
            history.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass p-8 rounded-[2rem] hover:bg-slate-100 dark:hover:bg-white/10 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center space-x-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    item.type === 'search' ? 'bg-brand-500/20 text-brand-600 dark:text-brand-400' :
                    item.type === 'vin' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' :
                    'bg-purple-500/20 text-purple-600 dark:text-purple-400'
                  }`}>
                    {getTypeIcon(item.type)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-3">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${
                        item.type === 'search' ? 'text-brand-600 dark:text-brand-400' :
                        item.type === 'vin' ? 'text-emerald-600 dark:text-emerald-400' :
                        'text-purple-600 dark:text-purple-400'
                      }`}>
                        {getTypeLabel(item.type)}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <span className="text-xs font-medium text-slate-500">
                        {new Date(item.timestamp).toLocaleString(getLocale(language))}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{item.query}</h3>
                  </div>
                </div>
                <Link
                  to={item.type === 'vin' ? '/vin' : item.type === 'maintenance' ? '/maintenance' : '/'}
                  className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 hover:bg-brand-500/20 transition-all opacity-0 group-hover:opacity-100"
                >
                  <ExternalLink className="w-5 h-5" />
                </Link>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
