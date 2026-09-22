import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, 
  Medal, 
  Search, 
  Filter, 
  MapPin, 
  Award, 
  Calendar, 
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { LeaderboardEntry, CategoryId } from '../types';
import { getLeaderboard } from '../utils/storage';
import { DISTRICT_SETTLEMENTS, PLAYER_RANKS } from '../data/districtInfo';
import { CATEGORIES } from '../data/questions';

interface LeaderboardProps {
  onStartQuiz: (categoryId?: CategoryId) => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ onStartQuiz }) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>(() => getLeaderboard());
  const [selectedSettlement, setSelectedSettlement] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered leaderboard
  const filteredEntries = entries.filter((entry) => {
    const matchesSettlement = selectedSettlement === 'all' || entry.settlement === selectedSettlement;
    const matchesCategory = selectedCategory === 'all' || entry.category === selectedCategory;
    const matchesSearch = entry.playerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSettlement && matchesCategory && matchesSearch;
  });

  const getCategoryTitle = (catId: string) => {
    if (catId === 'all') return 'Комплексный марафон';
    const found = CATEGORIES.find((c) => c.id === catId);
    return found ? found.shortTitle : catId;
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-400/30">
            <Trophy className="w-3.5 h-3.5" />
            Районный рейтинг экологов
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold font-['Unbounded',sans-serif] tracking-tight">
            Таблица лидеров Нефтегорского района
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-2 leading-relaxed">
            Рейтинг знатоков природопользования, раздельного сбора ТКО и охраны водных ресурсов среди жителей всех поселений нашего района.
          </p>
        </div>

        {/* Top-3 Podium Preview if available */}
        <div className="absolute right-4 bottom-4 opacity-15 pointer-events-none hidden lg:block">
          <Trophy className="w-48 h-48 text-emerald-300" />
        </div>
      </div>

      {/* Ranks Legend Box */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-stone-200 dark:border-zinc-800 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400 mb-3 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Система рангов и званий района:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {PLAYER_RANKS.map((r, idx) => (
            <div
              key={r.id}
              className="p-3 rounded-2xl bg-stone-50 dark:bg-zinc-800/60 border border-stone-200/60 dark:border-zinc-700/60 text-xs"
            >
              <div className="flex items-center gap-1.5 font-bold text-stone-900 dark:text-white">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">
                  {idx + 1}
                </span>
                <span className="truncate">{r.title}</span>
              </div>
              <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold mt-1">
                от {r.minScore} баллов
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters & Search Controls */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-stone-200 dark:border-zinc-800 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Поиск по имени участника..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 text-xs text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Settlement Filter */}
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <select
              value={selectedSettlement}
              onChange={(e) => setSelectedSettlement(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 text-xs text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
            >
              <option value="all">Все населенные пункты района</option>
              {DISTRICT_SETTLEMENTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 text-xs text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
            >
              <option value="all">Все категории викторины</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.shortTitle}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Leaderboard Table List */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-stone-200 dark:border-zinc-800 shadow-md overflow-hidden">
        {filteredEntries.length === 0 ? (
          <div className="p-12 text-center">
            <Trophy className="w-12 h-12 text-stone-300 dark:text-zinc-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-800 dark:text-zinc-200">
              Пока нет записей по выбранным фильтрам
            </h3>
            <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
              Станьте первым, кто внесет свой результат для этого населенного пункта или категории!
            </p>
            <button
              onClick={() => onStartQuiz()}
              className="mt-4 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition"
            >
              Пройти викторину
            </button>
          </div>
        ) : (
          <div className="divide-y divide-stone-100 dark:divide-zinc-800">
            {filteredEntries.map((entry, index) => {
              const isTop1 = index === 0;
              const isTop2 = index === 1;
              const isTop3 = index === 2;

              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={`p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 transition hover:bg-stone-50/80 dark:hover:bg-zinc-800/50 ${
                    isTop1 ? 'bg-amber-500/5 dark:bg-amber-500/10' : ''
                  }`}
                >
                  {/* Position Badge & User Info */}
                  <div className="flex items-center gap-3.5 min-w-[200px]">
                    <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-xl font-['Unbounded',sans-serif] font-black text-xs">
                      {isTop1 ? (
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950 flex items-center justify-center shadow-md shadow-amber-500/30">
                          🥇 1
                        </div>
                      ) : isTop2 ? (
                        <div className="w-8 h-8 rounded-xl bg-stone-300 text-stone-800 flex items-center justify-center shadow-sm">
                          🥈 2
                        </div>
                      ) : isTop3 ? (
                        <div className="w-8 h-8 rounded-xl bg-amber-700 text-amber-100 flex items-center justify-center shadow-sm">
                          🥉 3
                        </div>
                      ) : (
                        <span className="text-stone-400 dark:text-zinc-500 font-bold">
                          #{index + 1}
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-stone-900 dark:text-white">
                          {entry.playerName}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-zinc-300 flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5 text-emerald-600" />
                          {entry.settlement}
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium mt-0.5">
                        {entry.rankTitle}
                      </p>
                    </div>
                  </div>

                  {/* Category and Date info */}
                  <div className="hidden md:block text-left text-xs text-stone-500 dark:text-zinc-400">
                    <div>{getCategoryTitle(entry.category)}</div>
                    <div className="text-[10px] text-stone-400 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      {entry.date}
                    </div>
                  </div>

                  {/* Score & Accuracy */}
                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <div className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400 font-['Unbounded',sans-serif]">
                        {entry.score} <span className="text-[10px] font-normal text-stone-400">баллов</span>
                      </div>
                      <div className="text-[11px] font-bold text-stone-500 dark:text-zinc-400">
                        Точность: {entry.correctPercentage}%
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Call to Action */}
      <div className="bg-stone-50 dark:bg-zinc-800/50 rounded-3xl p-6 border border-stone-200 dark:border-zinc-700/60 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-stone-900 dark:text-white">
            Хотите подняться в топ рейтинга района?
          </h4>
          <p className="text-xs text-stone-500 dark:text-zinc-400 mt-0.5">
            Пройдите любую из 4 тем или экзаменационный марафон и внесите рекорд!
          </p>
        </div>
        <button
          onClick={() => onStartQuiz()}
          className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition active:scale-95"
        >
          Начать новую викторину
        </button>
      </div>
    </div>
  );
};
