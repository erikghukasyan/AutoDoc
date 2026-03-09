import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const ContactUs = () => {
  const { t } = useLanguage();
  return (
    <section id="contact" className="py-32 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">{t('contact.title')}</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">{t('contact.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          <div className="lg:col-span-2 space-y-8">
            {[
              { icon: Mail, title: t('contact.email'), value: 'support@autoacademy.am' },
              { icon: Phone, title: t('contact.phone'), value: '+374 10 000000' },
              { icon: MapPin, title: t('contact.address'), value: t('contact.location') }
            ].map((item, idx) => (
              <div key={idx} className="glass p-6 rounded-2xl flex items-start space-x-4 group">
                <div className="w-12 h-12 bg-slate-100 dark:bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-brand-500/20 transition-colors">
                  <item.icon className="w-6 h-6 text-brand-500 dark:text-brand-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">{item.title}</h3>
                  <p className="text-lg font-medium text-slate-900 dark:text-white">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-3">
            <form className="glass p-10 rounded-[2.5rem] space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500 dark:text-slate-400 ml-1">{t('contact.name')}</label>
                  <input type="text" className="w-full px-5 py-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500/50 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500 dark:text-slate-400 ml-1">{t('contact.email')}</label>
                  <input type="email" className="w-full px-5 py-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500/50 transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-500 dark:text-slate-400 ml-1">{t('contact.message')}</label>
                <textarea rows={4} className="w-full px-5 py-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500/50 transition-all resize-none"></textarea>
              </div>
              <button type="submit" className="w-full py-5 bg-brand-500 text-white rounded-xl font-bold text-lg hover:bg-brand-600 transition-all shadow-lg shadow-brand-500/20 flex items-center justify-center group">
                <Send className="w-5 h-5 mr-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                {t('contact.send')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
