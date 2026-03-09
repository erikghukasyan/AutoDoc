import React from 'react';
import { Search, BookOpen, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const HowToUse = () => {
  const { t } = useLanguage();
  return (
    <section id="how-to-use" className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">{t('how.title')}</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">{t('how.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: '1',
              icon: Search,
              title: t('how.step1.title'),
              desc: t('how.step1.desc'),
              color: 'brand'
            },
            {
              step: '2',
              icon: BookOpen,
              title: t('how.step2.title'),
              desc: t('how.step2.desc'),
              color: 'blue'
            },
            {
              step: '3',
              icon: ExternalLink,
              title: t('how.step3.title'),
              desc: t('how.step3.desc'),
              color: 'indigo'
            }
          ].map((item, idx) => (
            <div key={idx} className="glass p-10 rounded-[2.5rem] relative group hover:-translate-y-2 transition-all duration-300">
              <div className="absolute top-6 right-6 text-5xl font-black text-slate-900/5 dark:text-white/5 group-hover:text-brand-500/10 transition-colors">
                {item.step}
              </div>
              <div className={`w-14 h-14 bg-brand-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                <item.icon className="w-7 h-7 text-brand-500 dark:text-brand-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{item.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
