import React, { useState } from 'react';
import { Search, Loader2, ExternalLink, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { searchCarProblem, SearchResult } from '../services/gemini';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const SearchSection = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { addToHistory, isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await searchCarProblem(query);
      setResult(data);
      if (isAuthenticated) {
        addToHistory(query, 'search');
      }
    } catch (err) {
      setError(t('error.generic') || 'Տեղի է ունեցել սխալ: Խնդրում ենք փորձել փոքր-ինչ ուշ:');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center px-3 py-1 rounded-full glass text-brand-400 text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI Powered Assistant
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-8 leading-[1.1]"
          >
            {t('search.title')}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            {t('search.subtitle')}
          </motion.p>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onSubmit={handleSearch}
          className="relative max-w-3xl mx-auto mb-20"
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
            <div className="relative flex items-center">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('search.placeholder')}
                className="w-full px-8 py-6 text-lg rounded-2xl bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-brand-500/50 transition-all pr-20 shadow-xl dark:shadow-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-3 p-4 bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-all disabled:opacity-50 flex items-center justify-center shadow-lg shadow-brand-500/20"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </motion.form>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl mx-auto p-4 glass border-red-500/20 rounded-2xl flex items-center text-red-500 dark:text-red-400 mb-12"
            >
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              <div className="glass rounded-[2.5rem] p-8 md:p-12">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-10 h-10 bg-brand-500/20 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-brand-500 dark:text-brand-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Վերլուծություն և Լուծումներ</h3>
                </div>
                <div className="prose dark:prose-invert">
                  <ReactMarkdown>{result.text}</ReactMarkdown>
                </div>
              </div>

              {result.links.length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center px-4">
                    <ExternalLink className="w-5 h-5 mr-3 text-brand-500 dark:text-brand-400" />
                    Օգտակար հղումներ
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
    </section>
  );
};
