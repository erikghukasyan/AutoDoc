import React from 'react';
import { Play, Sparkles, Globe, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

export const VideoSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-brand-500/5 blur-[100px] rounded-full -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full glass text-brand-500 dark:text-brand-400 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4 mr-2" />
                Բացահայտեք ԱվտոԱկադեմիան
              </div>
              <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6">
                Կառավարեք Ձեր մեքենան <span className="text-brand-500">ԱԲ բանականությամբ</span>
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
                ԱվտոԱկադեմիան ավելին է, քան պարզապես որոնման գործիք: Այն համապարփակ կրթական հարթակ է, որը նախատեսված է մեքենայատերերին մասնագիտական մակարդակի ավտոմոբիլային գիտելիքներով զինելու համար:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl glass glass-hover transition-all">
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-500 mb-4">
                  <Globe className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold mb-2">Մայրենի լեզվի աջակցություն</h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Առաջին հարթակը, որն առաջարկում է խորը տեխնիկական ախտորոշում և խորհրդատվություն հայերենով:
                </p>
              </div>
              <div className="p-6 rounded-2xl glass glass-hover transition-all">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold mb-2">Ստուգված լուծումներ</h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Մեր ԱԲ-ն համադրում է հազարավոր տեխնիկական ձեռնարկներ՝ հուսալի լուծումներ տրամադրելու համար:
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Video Frame Decoration */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-brand-500/30 to-blue-500/30 blur-3xl rounded-[2.5rem] -z-10 opacity-50"></div>
            
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white dark:border-white/5 aspect-video bg-slate-900 group">
              <video 
                className="w-full h-full object-cover"
                controls
                playsInline
                autoPlay
                muted
                loop
              >
                <source src="/video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-6 -right-6 glass p-4 rounded-2xl shadow-xl hidden md:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                  <Play className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Դիտվում է</p>
                  <p className="text-sm font-semibold">ԱվտոԱկադեմիայի ներկայացում</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
