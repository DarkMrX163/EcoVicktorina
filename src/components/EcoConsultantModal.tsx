import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lightbulb, BookOpen, Shield, X, Sparkles } from 'lucide-react';
import { Question } from '../types';

interface EcoConsultantModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: Question;
}

export const EcoConsultantModal: React.FC<EcoConsultantModalProps> = ({
  isOpen,
  onClose,
  question,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            onClick={onClose}
          />

          {/* Modal Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-900 border border-emerald-200/80 dark:border-emerald-800/60 shadow-2xl p-6 sm:p-7 overflow-hidden text-stone-900 dark:text-white"
          >
            {/* Top decorative gradient badge */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-500" />

            {/* Header with Consultant Character */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-stone-100 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
                    <Lightbulb className="w-6 h-6 animate-pulse" />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white dark:border-zinc-900 flex items-center justify-center text-[9px] text-white">
                    ✓
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    Подсказка эколога района
                  </div>
                  <h3 className="text-base font-extrabold text-stone-900 dark:text-white">
                    Инспектор природы Нефтегорска
                  </h3>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-zinc-800 text-stone-400 hover:text-stone-700 dark:hover:text-zinc-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Consultant Message Bubble */}
            <div className="mt-5 space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="relative rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 p-4 border border-emerald-100 dark:border-emerald-800/40 text-stone-800 dark:text-emerald-100"
              >
                <div className="text-xs font-semibold uppercase text-emerald-800 dark:text-emerald-300 mb-1 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5" />
                  Экспертная наводка:
                </div>
                <p className="text-sm font-medium leading-relaxed">
                  «{question.ecoTipHint}»
                </p>
              </motion.div>

              {question.legalReference && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-2xl bg-stone-50 dark:bg-zinc-800/60 p-3.5 border border-stone-200 dark:border-zinc-700/60 flex items-start gap-2.5"
                >
                  <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[11px] font-bold text-stone-500 dark:text-zinc-400">
                      Нормативно-правовая база:
                    </div>
                    <div className="text-xs font-semibold text-stone-800 dark:text-zinc-200 mt-0.5">
                      {question.legalReference}
                    </div>
                  </div>
                </motion.div>
              )}

              {question.interestingFact && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="rounded-2xl bg-sky-50/80 dark:bg-sky-950/30 p-3.5 border border-sky-100 dark:border-sky-800/40 flex items-start gap-2.5"
                >
                  <BookOpen className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[11px] font-bold text-sky-700 dark:text-sky-300">
                      Краеведческий факт Нефтегорского района:
                    </div>
                    <div className="text-xs text-sky-900 dark:text-sky-200 mt-0.5 leading-relaxed">
                      {question.interestingFact}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Action button */}
            <div className="mt-6">
              <button
                onClick={onClose}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-700/20 transition-all active:scale-[0.99]"
              >
                Вернуться к вопросу и сделать выбор
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
