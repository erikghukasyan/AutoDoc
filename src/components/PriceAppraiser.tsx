import React, { useState } from 'react';
import { DollarSign, Search, Loader2, TrendingUp, TrendingDown, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { appraiseCarPrice, AppraisalResult } from '../services/gemini';

export const PriceAppraiser = () => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AppraisalResult | null>(null);
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    mileage: '',
    condition: 'good',
    price: '',
  });

  const handleAppraise = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const appraisal = await appraiseCarPrice(
        formData.make,
        formData.model,
        formData.year,
        formData.mileage,
        formData.condition,
        formData.price
      );
      setResult(appraisal);
    } catch (error) {
      console.error(error);
      alert('Գնահատումը ձախողվեց: Խնդրում ենք փորձել կրկին:');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deal': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'fair': return 'text-brand-500 bg-brand-500/10 border-brand-500/20';
      case 'overpriced': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'deal': return <TrendingDown className="w-8 h-8" />;
      case 'fair': return <CheckCircle2 className="w-8 h-8" />;
      case 'overpriced': return <TrendingUp className="w-8 h-8" />;
      default: return <Info className="w-8 h-8" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'deal': return t('appraiser.result.deal');
      case 'fair': return t('appraiser.result.fair');
      case 'overpriced': return t('appraiser.result.overpriced');
      default: return '';
    }
  };

  return (
    <div className="min-h-screen pt-12 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight"
          >
            {t('appraiser.title')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-600 dark:text-slate-400"
          >
            {t('appraiser.subtitle')}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-8 rounded-[2.5rem] border-slate-200 dark:border-white/10"
          >
            <form onSubmit={handleAppraise} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">
                    {t('appraiser.form.make')}
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.make}
                    onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                    placeholder="e.g. Toyota"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">
                    {t('appraiser.form.model')}
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                    placeholder="e.g. Camry"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">
                    {t('appraiser.form.year')}
                  </label>
                  <input
                    required
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                    placeholder="2022"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">
                    {t('appraiser.form.mileage')}
                  </label>
                  <input
                    required
                    type="number"
                    value={formData.mileage}
                    onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                    placeholder="50000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">
                  {t('appraiser.form.condition')}
                </label>
                <select
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-brand-500 outline-none transition-all appearance-none"
                >
                  <option value="excellent">{t('appraiser.condition.excellent')}</option>
                  <option value="good">{t('appraiser.condition.good')}</option>
                  <option value="fair">{t('appraiser.condition.fair')}</option>
                  <option value="poor">{t('appraiser.condition.poor')}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">
                  {t('appraiser.form.price')}
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    required
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white font-black text-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                    placeholder="15000"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-brand-500 text-white rounded-2xl font-black text-xl hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-brand-500/30 flex items-center justify-center active:scale-[0.98]"
              >
                {loading ? (
                  <Loader2 className="w-7 h-7 animate-spin" />
                ) : (
                  <>
                    <TrendingUp className="w-6 h-6 mr-2" />
                    {t('appraiser.submit')}
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Result */}
          <div className="lg:col-span-1">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="glass p-8 rounded-[2.5rem] border-slate-200 dark:border-white/10 h-full"
                >
                  <div className={`p-6 rounded-3xl border mb-8 flex items-center space-x-6 ${getStatusColor(result.status)}`}>
                    {getStatusIcon(result.status)}
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest opacity-70 mb-1">Կարգավիճակ</p>
                      <h3 className="text-3xl font-black tracking-tight">{getStatusLabel(result.status)}</h3>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <p className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">Շուկայական արժեք</p>
                      <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{result.estimatedValue}</p>
                    </div>

                    <div>
                      <p className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4 ml-1">Վերլուծություն</p>
                      <div className="prose dark:prose-invert">
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                          {result.analysis}
                        </p>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 dark:border-white/5">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Ճշգրտություն</span>
                        <span className="text-sm font-black text-brand-500">{Math.round(result.confidence * 100)}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${result.confidence * 100}%` }}
                          className="h-full bg-brand-500"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass p-12 rounded-[2.5rem] border-slate-200 dark:border-white/10 h-full flex flex-col items-center justify-center text-center border-dashed border-2"
                >
                  <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <DollarSign className="w-10 h-10 text-slate-300 dark:text-slate-700" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Սպասում ենք տվյալների</h3>
                  <p className="text-slate-500 font-medium">Լրացրեք ձախ կողմի ձևաթուղթը՝ մեքենայի գինը գնահատելու համար:</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
