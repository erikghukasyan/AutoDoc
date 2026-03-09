import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Mail, AtSign, Camera, Check, Loader2, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateUser } = useAuth();
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    password: user?.password || '',
    avatar: user?.avatar || '',
  });

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    updateUser(formData);
    setLoading(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1500);
  };

  const changeAvatar = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size should be less than 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          avatar: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const generateRandomAvatar = () => {
    const newSeed = Math.random().toString(36).substring(7);
    setFormData({
      ...formData,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newSeed}`
    });
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-md bg-white dark:bg-[#1a1a1a] rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] overflow-hidden border border-slate-200 dark:border-white/10"
            >
              <div className="p-8 sm:p-10">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    {t('profile.title')}
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-3 hover:bg-slate-100 dark:hover:bg-white/5 rounded-2xl transition-all active:scale-90"
                  >
                    <X className="w-6 h-6 text-slate-500 dark:text-slate-400" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex flex-col items-center mb-8">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-brand-500/20 shadow-xl flex items-center justify-center bg-slate-100 dark:bg-white/5">
                        {formData.avatar ? (
                          <img 
                            src={formData.avatar} 
                            alt={formData.name} 
                            className="w-full h-full object-cover relative z-10"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : null}
                        <span className="absolute inset-0 flex items-center justify-center text-4xl font-black text-brand-500 uppercase select-none">
                          {formData.name.charAt(0) || '?'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={changeAvatar}
                        className="absolute bottom-0 right-0 p-2 bg-brand-500 text-white rounded-full shadow-lg hover:bg-brand-600 transition-all active:scale-90 z-20"
                        title="Upload from files"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={generateRandomAvatar}
                        className="absolute bottom-0 -left-2 p-2 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400 rounded-full shadow-lg hover:bg-slate-200 dark:hover:bg-white/20 transition-all active:scale-90 z-20"
                        title="Generate random"
                      >
                        <AtSign className="w-3 h-3" />
                      </button>
                      <input 
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">
                        {t('profile.name')}
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">
                        {t('profile.username')}
                      </label>
                      <div className="relative">
                        <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">
                        {t('profile.email')}
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">
                        {t('auth.password')}
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          placeholder={t('auth.password')}
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex space-x-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 py-4 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 rounded-2xl font-black hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                    >
                      {t('profile.cancel')}
                    </button>
                    <button
                      type="submit"
                      disabled={loading || success}
                      className={`flex-1 py-4 rounded-2xl font-black transition-all flex items-center justify-center shadow-xl ${
                        success 
                          ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                          : 'bg-brand-500 text-white shadow-brand-500/20 hover:bg-brand-600 active:scale-95'
                      }`}
                    >
                      {loading ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : success ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        t('profile.save')
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};
