import React, { useState, useEffect } from 'react';
import { MapPin, Loader2, Navigation, ExternalLink, AlertCircle, Info } from 'lucide-react';
import { findNearbyServices, MapResult } from '../services/gemini';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

export const ServiceMap = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MapResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const { t } = useLanguage();

  const getNearbyServices = async (lat: number, lng: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await findNearbyServices(lat, lng);
      setResult(data);
    } catch (err) {
      setError(t('map.error.generic'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLocate = () => {
    if (!navigator.geolocation) {
      setError(t('map.error.browser'));
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setLocation(coords);
        getNearbyServices(coords.lat, coords.lng);
      },
      (err) => {
        setLoading(false);
        setError(t('map.error.locate'));
        console.error(err);
      }
    );
  };

  return (
    <div className="min-h-screen pt-32 pb-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-brand-500/10 rounded-2xl mb-6"
          >
            <MapPin className="w-8 h-8 text-brand-500 dark:text-brand-400" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4"
          >
            {t('map.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed"
          >
            {t('map.subtitle')}
          </motion.p>
        </div>

        {!location && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass p-12 rounded-[2.5rem] text-center"
          >
            <Navigation className="w-16 h-16 text-brand-500 dark:text-brand-400 mx-auto mb-6 opacity-20" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{t('map.locatePrompt')}</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
              {t('map.locateDesc')}
            </p>
            <button
              onClick={handleLocate}
              className="px-8 py-4 bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-all font-bold text-lg shadow-lg shadow-brand-500/20 flex items-center mx-auto"
            >
              <Navigation className="w-5 h-5 mr-2" />
              {t('map.locate')}
            </button>
          </motion.div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-brand-500 dark:text-brand-400 animate-spin mb-4" />
            <p className="text-slate-600 dark:text-slate-400 font-medium">{t('map.searching')}</p>
          </div>
        )}

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl flex items-center text-red-700 dark:text-red-400 mb-8"
            >
              <AlertCircle className="w-5 h-5 mr-3" />
              {error}
            </motion.div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2 space-y-6">
                <div className="glass p-8 rounded-[2.5rem]">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                    <Info className="w-6 h-6 text-brand-500 dark:text-brand-400 mr-3" />
                    {t('map.info')}
                  </h3>
                  <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed">
                    <ReactMarkdown
                      components={{
                        img: ({ src, ...props }) => src ? <img src={src} {...props} referrerPolicy="no-referrer" /> : null
                      }}
                    >
                      {result.text}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center px-2">
                  <MapPin className="w-5 h-5 text-brand-500 dark:text-brand-400 mr-2" />
                  {t('map.places')}
                </h3>
                <div className="space-y-4">
                  {result.places.map((place, idx) => (
                    <a
                      key={idx}
                      href={place.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-5 glass glass-hover rounded-2xl group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors mb-1">
                            {place.title}
                          </h4>
                          <p className="text-xs text-slate-500 truncate mb-3">{place.uri}</p>
                          <div className="inline-flex items-center text-xs font-bold text-brand-500 dark:text-brand-400 bg-brand-500/10 px-2 py-1 rounded">
                            {t('map.openMap')}
                          </div>
                        </div>
                        <ExternalLink className="w-5 h-5 text-slate-300 group-hover:text-brand-500 dark:group-hover:text-brand-400 ml-3 transition-colors" />
                      </div>
                    </a>
                  ))}
                  {result.places.length === 0 && (
                    <div className="text-center py-10 glass rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/5">
                      <p className="text-slate-500">{t('map.noPlaces')}</p>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={handleLocate}
                  className="w-full py-4 bg-transparent text-brand-500 dark:text-brand-400 border-2 border-brand-500 dark:border-brand-400 rounded-xl hover:bg-brand-500/10 transition-all font-bold flex items-center justify-center"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  {t('map.refresh')}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
