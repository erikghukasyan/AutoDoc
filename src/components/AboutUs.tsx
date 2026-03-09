import React from 'react';
import { Info, Users, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const AboutUs = () => {
  const { t } = useLanguage();
  return (
    <section id="about" className="py-32 bg-slate-50/50 dark:bg-white/5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">{t('about.title')}</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">{t('about.p1')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Info,
              title: t('about.title'),
              desc: t('about.p2'),
            },
            {
              icon: Users,
              title: t('about.teamTitle'),
              desc: t('about.teamDesc'),
            },
            {
              icon: ShieldCheck,
              title: t('about.reliabilityTitle'),
              desc: t('about.reliabilityDesc'),
            }
          ].map((item, idx) => (
            <div key={idx} className="glass p-10 rounded-[2.5rem] group hover:bg-slate-200/50 dark:hover:bg-white/10 transition-all">
              <div className="w-14 h-14 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
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
