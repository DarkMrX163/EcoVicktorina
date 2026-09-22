import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Award, CheckCircle2, Lock, Sparkles, Trophy, Trash2, Droplets, ShieldAlert, Zap, Trees, Compass, Crown } from 'lucide-react';
import { Achievement } from '../types';
import { getAchievements } from '../utils/storage';

interface AchievementsViewProps {
  onStartQuiz: () => void;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({ onStartQuiz }) => {
  const [achievements, setAchievements] = useState<Achievement[]>(() => getAchievements());

  useEffect(() => {
    setAchievements(getAchievements());
  }, []);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  const renderIcon = (iconName: string, isUnlocked: boolean) => {
    const className = `w-6 h-6 ${isUnlocked ? 'text-amber-500' : 'text-stone-400 dark:text-zinc-600'}`;
    switch (iconName) {
      case 'Trash2': return <Trash2 className={className} />;
      case 'Droplets': return <Droplets className={className} />;
      case 'ShieldAlert': return <ShieldAlert className={className} />;
      case 'Zap': return <Zap className={className} />;
      case 'Trees': return <Trees className={className} />;
      case 'Compass': return <Compass className={className} />;
      case 'Crown': return <Crown className={className} />;
      default: return <Sparkles className={className} />;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-400/30">
            <Award className="w-3.5 h-3.5" />
            Экологические награды и знаки отличия
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold font-['Unbounded',sans-serif] tracking-tight">
            Достижения эко-инспектора
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-2 leading-relaxed">
            Открыто {unlockedCount} из {achievements.length} почетных знаков за успехи в викторинах Нефтегорского района.
          </p>
        </div>
      </div>

      {/* Achievements Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {achievements.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 }}
            className={`p-5 rounded-3xl border transition flex flex-col justify-between ${
              item.unlocked
                ? 'bg-white dark:bg-zinc-900 border-amber-300/80 dark:border-amber-600/40 shadow-md ring-1 ring-amber-400/20'
                : 'bg-stone-50/60 dark:bg-zinc-900/40 border-stone-200/80 dark:border-zinc-800/80 opacity-75'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 rounded-2xl ${item.unlocked ? 'bg-amber-100 dark:bg-amber-950/50' : 'bg-stone-200/60 dark:bg-zinc-800'}`}>
                  {renderIcon(item.icon, item.unlocked)}
                </div>
                {item.unlocked ? (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800/50">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Получено
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-stone-400 dark:text-zinc-500 bg-stone-200/60 dark:bg-zinc-800 px-2 py-0.5 rounded-lg">
                    <Lock className="w-3 h-3" />
                    Закрыто
                  </span>
                )}
              </div>

              <h3 className="text-sm font-bold text-stone-900 dark:text-white leading-snug">
                {item.title}
              </h3>
              <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 dark:border-zinc-800 flex justify-between items-center text-[10px] uppercase font-bold text-stone-400">
              <span>Категория: {item.badgeCategory}</span>
              {item.unlocked && <span className="text-amber-500">★ Рекорд</span>}
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA Button */}
      <div className="bg-stone-50 dark:bg-zinc-800/50 rounded-3xl p-6 border border-stone-200 dark:border-zinc-700/60 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-stone-900 dark:text-white">
            Хотите открыть все награды?
          </h4>
          <p className="text-xs text-stone-500 dark:text-zinc-400 mt-0.5">
            Пройдите все 4 тематические викторины без ошибок!
          </p>
        </div>
        <button
          onClick={onStartQuiz}
          className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition active:scale-95"
        >
          Начать викторину
        </button>
      </div>
    </div>
  );
};
