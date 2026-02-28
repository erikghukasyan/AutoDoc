import React, { useState } from 'react';
import { Search, Loader2, ExternalLink, ShieldCheck, History, Settings, AlertTriangle, ArrowRight } from 'lucide-react';
import { checkVin, VinResult } from '../services/gemini';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const VinLookup = () => {
  const [vin, setVin] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VinResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { addToHistory, isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vin.trim() || vin.length < 11) {
      setError(t('error.vinInvalid') || 'Խնդրում ենք մուտքագրել վավեր VIN կոդ (առնվազն 11 նիշ):');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await checkVin(vin);
      setResult(data);
      if (isAuthenticated) {
        addToHistory(vin, 'vin');
      }
    } catch (err) {
      setError(t('error.vinGeneric') || 'Տեղի է ունեցել սխալ VIN կոդը ստուգելիս: Փորձեք կրկին:');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-brand-500/10 rounded-2xl mb-6"
          >
            <ShieldCheck className="w-8 h-8 text-brand-400" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4"
          >
            {t('vin.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed"
          >
            {t('vin.subtitle')}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass p-8 rounded-[2.5rem] mb-12"
        >
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={vin}
                onChange={(e) => setVin(e.target.value.toUpperCase())}
                placeholder={t('vin.placeholder')}
                className="w-full px-6 py-4 text-lg rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500/50 transition-all uppercase font-mono tracking-wider placeholder:text-slate-400 dark:placeholder:text-slate-600"
                maxLength={17}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-all disabled:opacity-50 flex items-center justify-center font-bold text-lg shadow-lg shadow-brand-500/20"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  {t('vin.button')}
                </>
              )}
            </button>
          </form>
          {error && (
            <p className="mt-4 text-red-500 dark:text-red-400 flex items-center text-sm ml-2">
              <AlertTriangle className="w-4 h-4 mr-2" />
              {error}
            </p>
          )}
        </motion.div>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[
                  { icon: Settings, label: 'Տեխնիկական', value: 'Տվյալներ', color: 'brand' },
                  { icon: History, label: 'Պատմություն', value: 'Հասանելիություն', color: 'green' },
                  { icon: AlertTriangle, label: 'Recall-ներ', value: 'Ստուգում', color: 'orange' }
                ].map((item, idx) => (
                  <div key={idx} className="glass p-6 rounded-2xl flex items-center space-x-4">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-white/5 rounded-xl flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-brand-500 dark:text-brand-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{item.label}</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="glass rounded-[2.5rem] p-8 md:p-12">
                <div className="prose dark:prose-invert">
                  <ReactMarkdown>{result.text}</ReactMarkdown>
                </div>
              </div>

              {result.links.length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center px-4">
                    <ExternalLink className="w-5 h-5 mr-3 text-brand-500 dark:text-brand-400" />
                    Աղբյուրներ և Մանրամասներ
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.links.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass glass-hover p-6 rounded-2xl flex items-center group"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-900 dark:text-white font-medium truncate group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors">
                            {link.title}
                          </p>
                          <p className="text-sm text-slate-500 truncate mt-1">{link.uri}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center ml-4 group-hover:bg-brand-500/20 transition-colors">
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-500 dark:group-hover:text-brand-400" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
