import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, MapPin, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { DISTRICT_SETTLEMENTS } from '../data/districtInfo';
import { getUserProfile, saveUserProfile } from '../utils/storage';

interface ParticipantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string, settlement: string) => void;
  categoryTitle?: string;
}

export const ParticipantModal: React.FC<ParticipantModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  categoryTitle = 'Экологическая викторина',
}) => {
  const [name, setName] = useState('');
  const [settlement, setSettlement] = useState('г. Нефтегорск');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      const saved = getUserProfile();
      setName(saved.name || '');
      setSettlement(saved.settlement || 'г. Нефтегорск');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Пожалуйста, введите ваше Имя и Отчество');
      return;
    }

    if (trimmedName.split(' ').length < 1) {
      setError('Введите ваше Имя и Отчество');
      return;
    }

    saveUserProfile({ name: trimmedName, settlement });
    onConfirm(trimmedName, settlement);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white dark:bg-zinc-900 rounded-3xl max-w-md w-full p-6 sm:p-8 border border-stone-200 dark:border-zinc-800 shadow-2xl relative overflow-hidden"
        >
          {/* Background decorative accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-zinc-200 bg-stone-100 dark:bg-zinc-800 transition"
            aria-label="Закрыть"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-12 flex items-center justify-center shrink-0">
              <img src="/icon.svg" alt="Герб Нефтегорского района" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase text-emerald-700 dark:text-emerald-400 tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Регистрация участника</span>
              </div>
              <h2 className="text-lg font-extrabold text-stone-900 dark:text-white font-['Unbounded',sans-serif]">
                Данные участника
              </h2>
            </div>
          </div>

          <p className="text-xs text-stone-600 dark:text-zinc-400 mb-6 leading-relaxed">
            Пожалуйста, укажите ваши <strong>Имя и Отчество</strong>. Они будут указаны в итоговом Реестре результатов и в персональном Сертификате участника!
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Input: First Name and Patronymic */}
            <div>
              <label className="block text-xs font-bold text-stone-800 dark:text-zinc-200 mb-1.5 flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Имя и Отчество <span className="text-rose-500">*</span></span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="например, Александр Сергеевич"
                className="w-full px-4 py-3 rounded-2xl bg-stone-50 dark:bg-zinc-800 border border-stone-300 dark:border-zinc-700 text-stone-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 transition placeholder:text-stone-400 dark:placeholder:text-zinc-500"
                autoFocus
              />
              {error && (
                <p className="text-xs font-semibold text-rose-500 mt-1.5 flex items-center gap-1">
                  <span>⚠️ {error}</span>
                </p>
              )}
            </div>

            {/* Select: Settlement */}
            <div>
              <label className="block text-xs font-bold text-stone-800 dark:text-zinc-200 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Населённый пункт Нефтегорского района</span>
              </label>
              <select
                value={settlement}
                onChange={(e) => setSettlement(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-stone-50 dark:bg-zinc-800 border border-stone-300 dark:border-zinc-700 text-stone-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              >
                {DISTRICT_SETTLEMENTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Category Info Badge */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 text-xs text-emerald-900 dark:text-emerald-300 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Раздел: <strong>{categoryTitle}</strong>
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-3 rounded-2xl bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200 dark:hover:bg-zinc-700 text-stone-700 dark:text-zinc-300 font-bold text-xs transition"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="w-2/3 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 transition active:scale-95 flex items-center justify-center gap-2 font-['Unbounded',sans-serif]"
              >
                <span>Начать тест</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
