import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  HelpCircle, 
  Flame, 
  Clock, 
  ArrowRight, 
  ShieldAlert, 
  BookOpen, 
  Sparkles,
  Zap,
  Info,
  LogOut,
  AlertTriangle
} from 'lucide-react';
import { Question, LifelineState } from '../types';
import { EcoConsultantModal } from './EcoConsultantModal';
import confetti from 'canvas-confetti';

interface QuizCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  score: number;
  streak: number;
  lifelines: LifelineState;
  eliminatedOptions: number[];
  onSelectAnswer: (optionIndex: number, pointsEarned: number, timeSpent: number) => void;
  onNextQuestion: () => void;
  onUseFiftyFifty: () => void;
  onUseConsultant: () => void;
  onUseTimeFreeze: () => void;
  onExitQuiz: () => void;
  isAnswerSubmitted: boolean;
  selectedOption: number | null;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  score,
  streak,
  lifelines,
  eliminatedOptions,
  onSelectAnswer,
  onNextQuestion,
  onUseFiftyFifty,
  onUseConsultant,
  onUseTimeFreeze,
  onExitQuiz,
  isAnswerSubmitted,
  selectedOption,
}) => {
  const [showConsultantModal, setShowConsultantModal] = useState(false);
  const [showExitConfirmModal, setShowExitConfirmModal] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [isFrozen, setIsFrozen] = useState(false);

  // Timer countdown
  useEffect(() => {
    setSecondsLeft(30);
    setIsFrozen(false);
  }, [question.id]);

  useEffect(() => {
    if (isAnswerSubmitted || isFrozen) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto-submit unanswered
          if (!isAnswerSubmitted && selectedOption === null) {
            onSelectAnswer(-1, 0, 30);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [question.id, isAnswerSubmitted, isFrozen, selectedOption]);

  const handleOptionClick = (index: number) => {
    if (isAnswerSubmitted || eliminatedOptions.includes(index)) return;

    const isCorrect = index === question.correctIndex;
    const timeSpent = 30 - secondsLeft;
    
    // Scoring logic:
    // Base points + speed bonus (up to 40 pts) + streak bonus
    let earned = 0;
    if (isCorrect) {
      const speedBonus = Math.max(0, Math.floor(secondsLeft * 1.5));
      const streakMultiplier = streak >= 4 ? 1.5 : streak >= 2 ? 1.25 : 1;
      earned = Math.round((question.points + speedBonus) * streakMultiplier);

      // Trigger micro-confetti on high streaks or hard questions
      if (streak >= 3 || question.difficulty === 'hard') {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#10B981', '#34D399', '#38BDF8', '#F59E0B'],
        });
      }
    }

    onSelectAnswer(index, earned, timeSpent);
  };

  const handleConsultantClick = () => {
    if (!lifelines.consultantUsed) {
      onUseConsultant();
      setShowConsultantModal(true);
    }
  };

  const handleFiftyFiftyClick = () => {
    if (!lifelines.fiftyFiftyUsed) {
      onUseFiftyFifty();
    }
  };

  const handleTimeFreezeClick = () => {
    if (!lifelines.timeFreezeUsed) {
      onUseTimeFreeze();
      setIsFrozen(true);
    }
  };

  const optionLetters = ['А', 'Б', 'В', 'Г'];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {/* Top Meta Stats: Score, Progress, Combo Streak, Timer, and Exit button */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-stone-200 dark:border-zinc-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
        {/* Progress indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-['Unbounded',sans-serif] text-xs font-bold text-stone-800 dark:text-zinc-200">
            <span className="text-emerald-600 dark:text-emerald-400 text-sm">#{questionNumber}</span>
            <span className="text-stone-400">/</span>
            <span>{totalQuestions}</span>
          </div>
          {/* Progress mini bar */}
          <div className="w-20 sm:w-32 h-2 bg-stone-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 rounded-full"
              style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {/* Combo Streak */}
        {streak > 1 && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-extrabold border border-amber-300/40"
          >
            <Flame className="w-4 h-4 text-amber-500 animate-bounce" />
            <span>Серия х{streak}!</span>
          </motion.div>
        )}

        {/* Points, Timer & Exit Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Timer */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold ${
            secondsLeft <= 5 
              ? 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 animate-pulse border border-red-200' 
              : 'bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300'
          }`}>
            <Clock className="w-3.5 h-3.5" />
            <span>{secondsLeft} с</span>
          </div>

          {/* Current Score */}
          <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-xl text-xs font-black border border-emerald-200 dark:border-emerald-800/40 font-['Unbounded',sans-serif]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{score} б.</span>
          </div>

          {/* Exit Button */}
          <button
            onClick={() => setShowExitConfirmModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-800/50 transition shadow-sm active:scale-95"
            title="Прервать и выйти из викторины"
            aria-label="Выйти из викторины"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Выйти</span>
          </button>
        </div>
      </div>

      {/* Lifelines Toolbar */}
      <div className="flex items-center justify-between gap-2 p-2 bg-stone-100 dark:bg-zinc-800/60 rounded-2xl border border-stone-200/70 dark:border-zinc-700/50">
        <span className="text-[11px] font-bold text-stone-500 dark:text-zinc-400 px-2 flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          Подсказки:
        </span>
        <div className="flex items-center gap-1.5">
          {/* 50/50 */}
          <button
            onClick={handleFiftyFiftyClick}
            disabled={lifelines.fiftyFiftyUsed || isAnswerSubmitted}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              lifelines.fiftyFiftyUsed || isAnswerSubmitted
                ? 'opacity-40 cursor-not-allowed bg-stone-200 dark:bg-zinc-700 text-stone-500'
                : 'bg-white dark:bg-zinc-900 hover:bg-emerald-50 text-stone-800 dark:text-zinc-100 hover:text-emerald-600 dark:hover:text-emerald-400 shadow-sm border border-stone-200 dark:border-zinc-700'
            }`}
            title="Убрать 2 неверных варианта"
          >
            <span className="font-extrabold text-[11px]">50:50</span>
          </button>

          {/* Eco-Consultant */}
          <button
            onClick={handleConsultantClick}
            disabled={lifelines.consultantUsed || isAnswerSubmitted}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              lifelines.consultantUsed || isAnswerSubmitted
                ? 'opacity-40 cursor-not-allowed bg-stone-200 dark:bg-zinc-700 text-stone-500'
                : 'bg-white dark:bg-zinc-900 hover:bg-emerald-50 text-stone-800 dark:text-zinc-100 hover:text-emerald-600 dark:hover:text-emerald-400 shadow-sm border border-stone-200 dark:border-zinc-700'
            }`}
            title="Попросить совет у районного эколога"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Эколог района</span>
          </button>

          {/* Freeze Time */}
          <button
            onClick={handleTimeFreezeClick}
            disabled={lifelines.timeFreezeUsed || isAnswerSubmitted || isFrozen}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              lifelines.timeFreezeUsed || isAnswerSubmitted || isFrozen
                ? 'opacity-40 cursor-not-allowed bg-stone-200 dark:bg-zinc-700 text-stone-500'
                : 'bg-white dark:bg-zinc-900 hover:bg-emerald-50 text-stone-800 dark:text-zinc-100 hover:text-emerald-600 dark:hover:text-emerald-400 shadow-sm border border-stone-200 dark:border-zinc-700'
            }`}
            title="Остановить таймер"
          >
            <Clock className="w-3.5 h-3.5 text-sky-500" />
            <span className="hidden sm:inline">Заморозка</span>
          </button>
        </div>
      </div>

      {/* Main Question Card */}
      <motion.div
        key={question.id}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-zinc-800 shadow-md relative overflow-hidden"
      >
        {/* Difficulty & Points Tag */}
        <div className="flex items-center justify-between mb-4">
          <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider ${
            question.difficulty === 'easy'
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
              : question.difficulty === 'medium'
              ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300'
              : 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300'
          }`}>
            {question.difficulty === 'easy' ? 'Базовый уровень' : question.difficulty === 'medium' ? 'Продвинутый уровень' : 'Сложный вопрос'}
          </span>
          <span className="text-xs font-bold text-stone-400 dark:text-zinc-500">
            +{question.points} очков
          </span>
        </div>

        {/* Question Text */}
        <h2 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-white leading-relaxed mb-6 font-['Plus_Jakarta_Sans',sans-serif]">
          {question.question}
        </h2>

        {/* Answer Options Grid */}
        <div className="grid grid-cols-1 gap-3">
          {question.options.map((opt, idx) => {
            const isEliminated = eliminatedOptions.includes(idx);
            const isSelected = selectedOption === idx;
            const isCorrect = idx === question.correctIndex;
            
            let btnStyle = 'border-stone-200 dark:border-zinc-700/80 bg-stone-50 dark:bg-zinc-800/50 hover:bg-emerald-50/50 dark:hover:bg-zinc-700/50 hover:border-emerald-300 dark:hover:border-emerald-700';
            let badgeStyle = 'bg-stone-200 dark:bg-zinc-700 text-stone-700 dark:text-zinc-300';
            
            if (isAnswerSubmitted) {
              if (isCorrect) {
                btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20';
                badgeStyle = 'bg-emerald-600 text-white';
              } else if (isSelected && !isCorrect) {
                btnStyle = 'border-red-400 bg-red-50 dark:bg-red-950/50 text-red-900 dark:text-red-200 ring-2 ring-red-500/20';
                badgeStyle = 'bg-red-500 text-white';
              } else {
                btnStyle = 'opacity-40 border-stone-200 dark:border-zinc-800 bg-stone-50 dark:bg-zinc-900';
              }
            } else if (isEliminated) {
              btnStyle = 'opacity-20 cursor-not-allowed bg-stone-100 dark:bg-zinc-800 border-dashed line-through';
            }

            return (
              <motion.button
                key={idx}
                whileHover={!isAnswerSubmitted && !isEliminated ? { scale: 1.01 } : {}}
                whileTap={!isAnswerSubmitted && !isEliminated ? { scale: 0.99 } : {}}
                onClick={() => handleOptionClick(idx)}
                disabled={isAnswerSubmitted || isEliminated}
                className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all text-sm font-medium ${btnStyle}`}
              >
                <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${badgeStyle}`}>
                  {optionLetters[idx]}
                </span>
                <span className="flex-1 text-stone-800 dark:text-zinc-100 pt-0.5">
                  {opt}
                </span>
                {isAnswerSubmitted && isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                )}
                {isAnswerSubmitted && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Post-Answer Feedback Box */}
        <AnimatePresence>
          {isAnswerSubmitted && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-2xl bg-stone-50 dark:bg-zinc-800/80 p-5 border border-stone-200 dark:border-zinc-700 text-stone-800 dark:text-zinc-200 space-y-3"
            >
              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
                {selectedOption === question.correctIndex ? (
                  <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    Правильный ответ! +{question.points} очков
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
                    <XCircle className="w-4 h-4" />
                    Неверно (Верный ответ: {optionLetters[question.correctIndex]})
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-stone-700 dark:text-zinc-300 leading-relaxed">
                {question.explanation}
              </p>

              {question.legalReference && (
                <div className="text-[11px] font-semibold text-stone-500 dark:text-zinc-400 flex items-center gap-1.5 pt-2 border-t border-stone-200/60 dark:border-zinc-700/60">
                  <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Основание: {question.legalReference}</span>
                </div>
              )}

              {question.interestingFact && (
                <div className="text-[11px] text-sky-800 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/40 p-3 rounded-xl flex items-start gap-2 border border-sky-100 dark:border-sky-800/40">
                  <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Эко-факт района:</strong> {question.interestingFact}
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={onNextQuestion}
                  className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-700/20 flex items-center gap-2 transition active:scale-95"
                >
                  <span>{questionNumber < totalQuestions ? 'Следующий вопрос' : 'Завершить и подвести итоги'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Eco Consultant Hint Modal */}
      <EcoConsultantModal
        isOpen={showConsultantModal}
        onClose={() => setShowConsultantModal(false)}
        question={question}
      />

      {/* Exit Confirmation Modal */}
      <AnimatePresence>
        {showExitConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-stone-200 dark:border-zinc-800 space-y-5 text-center"
            >
              <div className="w-12 h-12 mx-auto rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-stone-900 dark:text-white font-['Unbounded',sans-serif]">
                  Выйти из викторины?
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-stone-600 dark:text-zinc-300 leading-relaxed">
                  Текущий прогресс ({questionNumber}/{totalQuestions} вопр., {score} б.) будет прерван, и результат не запишется в таблицу лидеров.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowExitConfirmModal(false)}
                  className="py-2.5 px-4 rounded-xl bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200 dark:hover:bg-zinc-700 text-stone-800 dark:text-zinc-200 text-xs sm:text-sm font-bold transition"
                >
                  Продолжить
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowExitConfirmModal(false);
                    onExitQuiz();
                  }}
                  className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-red-600/20 transition flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Да, выйти</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
