import React, { useState } from 'react';
import { Calculator, Loader2, Calendar, Gauge, Car, CheckCircle2, AlertCircle } from 'lucide-react';
import { calculateMaintenance, MaintenanceResult } from '../services/gemini';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const MaintenanceCalculator = () => {
  const [formData, setFormData] = useState({
    model: '',
    year: '',
    mileage: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MaintenanceResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { addToHistory, isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.model || !formData.year || !formData.mileage) {
      setError(t('error.fillAll') || 'Խնդրում ենք լրացնել բոլոր դաշտերը:');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await calculateMaintenance(formData.model, formData.year, formData.mileage);
      setResult(data);
      if (isAuthenticated) {
        addToHistory(`${formData.model} (${formData.year}) - ${formData.mileage} կմ`, 'maintenance');
      }
    } catch (err) {
      setError(t('error.maintGeneric') || 'Տեղի է ունեցել սխալ հաշվարկի ժամանակ: Փորձեք կրկին:');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-brand-500/10 rounded-2xl mb-6"
          >
            <Calculator className="w-8 h-8 text-brand-400" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4"
          >
            {t('maint.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed"
          >
            {t('maint.subtitle')}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass p-8 md:p-12 rounded-[2.5rem] mb-12"
        >
          <form onSubmit={handleSearch} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-500 dark:text-slate-400 ml-1 flex items-center">
                  <Car className="w-4 h-4 mr-2" /> {t('maint.model')}
                </label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="Toyota Camry"
                  className="w-full px-5 py-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-500 dark:text-slate-400 ml-1 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" /> {t('maint.year')}
                </label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  placeholder="2020"
                  className="w-full px-5 py-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-500 dark:text-slate-400 ml-1 flex items-center">
                  <Gauge className="w-4 h-4 mr-2" /> {t('maint.mileage')}
                </label>
                <input
                  type="number"
                  value={formData.mileage}
                  onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                  placeholder="50000"
                  className="w-full px-5 py-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500/50 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-brand-500 text-white rounded-xl font-bold text-lg hover:bg-brand-600 transition-all shadow-lg shadow-brand-500/20 flex items-center justify-center disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : t('maint.button')}
            </button>
          </form>
          {error && (
            <p className="mt-4 text-red-500 dark:text-red-400 flex items-center text-sm ml-2">
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </p>
          )}
        </motion.div>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: 'Յուղի փոխում', value: result.oilChange, color: 'brand' },
                  { title: 'Արգելակներ', value: result.brakePads, color: 'blue' },
                  { title: 'Մեծ սպասարկում', value: result.majorService, color: 'indigo' }
                ].map((item, idx) => (
                  <div key={idx} className="glass p-8 rounded-[2rem] relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <CheckCircle2 className="w-12 h-12 text-brand-500 dark:text-brand-400" />
                    </div>
                    <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4">{item.title}</h3>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="glass rounded-[2.5rem] p-8 md:p-12">
                <div className="prose dark:prose-invert">
                  <ReactMarkdown
                    components={{
                      img: ({ src, ...props }) => src ? <img src={src} {...props} referrerPolicy="no-referrer" /> : null
                    }}
                  >
                    {result.text}
                  </ReactMarkdown>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
