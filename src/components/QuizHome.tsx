import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Play, 
  Sparkles, 
  Trophy, 
  Trash2, 
  Droplets, 
  ShieldAlert, 
  Trees, 
  Flame, 
  ArrowRight, 
  BookOpen, 
  Clock, 
  HelpCircle,
  Award,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { CategoryId, GameMode } from '../types';
import { CATEGORIES } from '../data/questions';

interface QuizHomeProps {
  onStartQuiz: (categoryId: CategoryId | 'all', questionCount: number) => void;
  onOpenTips: () => void;
}

export const QuizHome: React.FC<QuizHomeProps> = ({
  onStartQuiz,
  onOpenTips,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [questionCount, setQuestionCount] = useState<number>(10);

  const getCategoryIcon = (catId: CategoryId) => {
    switch (catId) {
      case 'tko':
        return <Trash2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
      case 'water':
        return <Droplets className="w-6 h-6 text-sky-600 dark:text-sky-400" />;
      case 'nature_neftegorsk':
        return <Trees className="w-6 h-6 text-teal-600 dark:text-teal-400" />;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      
      {/* Hero Welcome Banner with District Emblem & Highlights */}
      <div className="bg-gradient-to-br from-emerald-800 via-teal-900 to-stone-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-extrabold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Экологический экзамен • 60 вопросов</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black font-['Unbounded',sans-serif] tracking-tight leading-tight">
            Экологическая викторина Нефтегорского района
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-normal">
            Проверьте свои знания в сфере природопользования, раздельного сбора твердых коммунальных отходов, водоохранных зон рек Самара и Чапаевка по Водному кодексу РФ и памятников природы Самарского Заволжья.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => onStartQuiz('all', questionCount)}
              className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-xs sm:text-sm flex items-center gap-2.5 shadow-lg shadow-emerald-500/30 transition active:scale-95 font-['Unbounded',sans-serif]"
            >
              <Play className="w-4 h-4 fill-emerald-950" />
              <span>Начать эко-марафон</span>
            </button>

            <button
              onClick={onOpenTips}
              className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm backdrop-blur border border-white/20 transition flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Советы и памятки</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mode & Question Count Selector Bar */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-stone-200 dark:border-zinc-800 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              Выберите формат и количество вопросов:
            </h3>
            <p className="text-xs text-stone-500 dark:text-zinc-400 mt-0.5">
              Короткий спринт или полноценная тематическая проверка
            </p>
          </div>

          <div className="flex items-center gap-2">
            {[
              { count: 10, label: '10 вопросов (Спринт)' },
              { count: 15, label: '15 вопросов (Стандарт)' },
              { count: 20, label: '20 вопросов (Все в теме)' },
            ].map((item) => (
              <button
                key={item.count}
                onClick={() => setQuestionCount(item.count)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                  questionCount === item.count
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-zinc-300 hover:bg-stone-200 dark:hover:bg-zinc-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Selection Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-stone-900 dark:text-white font-['Unbounded',sans-serif]">
              Тематические разделы викторины
            </h2>
            <p className="text-xs text-stone-500 dark:text-zinc-400">
              По 20 уникальных вопросов с краеведческой привязкой к Нефтегорскому району
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {CATEGORIES.map((cat) => (
            <motion.div
              key={cat.id}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.15 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-stone-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="p-3 rounded-2xl bg-stone-100 dark:bg-zinc-800">
                    {getCategoryIcon(cat.id)}
                  </div>
                  <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                    {cat.questionCount} вопросов
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-stone-900 dark:text-white leading-snug">
                  {cat.title}
                </h3>
                <p className="text-xs text-stone-600 dark:text-zinc-400 mt-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-stone-100 dark:border-zinc-800 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-stone-400 dark:text-zinc-500">
                  Время: ~{Math.min(questionCount, cat.questionCount) * 0.5} мин.
                </span>
                <button
                  onClick={() => onStartQuiz(cat.id, Math.min(questionCount, cat.questionCount))}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition active:scale-95"
                >
                  <span>Начать тему</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Eco-Tips Promo Mini-Banner */}
      <div className="bg-stone-50 dark:bg-zinc-800/50 rounded-3xl p-6 border border-stone-200 dark:border-zinc-700/60 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-stone-900 dark:text-white">
              Памятка по экологической грамотности
            </h4>
            <p className="text-xs text-stone-500 dark:text-zinc-400 mt-0.5">
              Правила раздельного сбора ТКО, водоохранные зоны рек по Водному кодексу РФ и охрана природы Нефтегорского района.
            </p>
          </div>
        </div>
        <button
          onClick={onOpenTips}
          className="px-4 py-2 rounded-xl bg-white dark:bg-zinc-800 text-stone-800 dark:text-zinc-200 text-xs font-bold border border-stone-200 dark:border-zinc-700 hover:bg-stone-100 dark:hover:bg-zinc-700 transition"
        >
          Читать советы
        </button>
      </div>

    </div>
  );
};
