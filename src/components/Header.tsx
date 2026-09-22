import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Award, BookOpen, Trophy, Shield, RefreshCw, LogOut, AlertTriangle } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export type NavTab = 'quiz' | 'leaderboard' | 'tips' | 'achievements';

interface HeaderProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onResetQuiz?: () => void;
  isQuizActive?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onResetQuiz,
  isQuizActive,
}) => {
  const { theme, toggleTheme } = useTheme();
  const isOnline = useOnlineStatus();
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const handleExitClick = () => {
    setShowExitConfirm(true);
  };

  const confirmExit = () => {
    setShowExitConfirm(false);
    if (onResetQuiz) {
      onResetQuiz();
    }
    onSelectTab('quiz');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md transition-colors duration-200">
      {/* Top Municipal Bar */}
      <div className="bg-emerald-800 dark:bg-emerald-950 text-white text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-medium">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
          <span>Администрация муниципального района Нефтегорский • Самарская область</span>
        </div>
        <div className="flex items-center gap-3 text-emerald-100">
          {!isOnline ? (
            <span className="flex items-center gap-1.5 bg-amber-500/30 text-amber-200 px-2 py-0.5 rounded text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              Офлайн-режим активен
            </span>
          ) : (
            <span className="hidden sm:flex items-center gap-1 text-[11px] text-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Экологический портал района
            </span>
          )}
          <span className="text-[11px] opacity-80">Горячая линия: 112 / 8(84670)2-16-50</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Brand Logo & District Emblem */}
          <div 
            onClick={() => {
              if (isQuizActive && onResetQuiz) {
                if (window.confirm('Прервать текущую викторину и вернуться в главное меню?')) {
                  onResetQuiz();
                  onSelectTab('quiz');
                }
              } else {
                onSelectTab('quiz');
              }
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-10 h-12 sm:w-11 sm:h-14 flex items-center justify-center filter drop-shadow-md group-hover:scale-105 transition-transform">
              <img 
                src="/icon.svg" 
                alt="Герб Нефтегорского района" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-stone-900 dark:text-white font-['Unbounded',sans-serif]">
                  ЭкоНефтегорск
                </span>
                <span className="hidden md:inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                  Викторина 2026
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-zinc-400 hidden sm:block">
                Экологическое просвещение и природопользование
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 bg-stone-100 dark:bg-zinc-800/80 p-1.5 rounded-xl border border-stone-200/80 dark:border-zinc-700/60">
            <button
              onClick={() => onSelectTab('quiz')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'quiz'
                  ? 'bg-white dark:bg-zinc-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
                  : 'text-stone-600 dark:text-zinc-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Викторина</span>
            </button>

            <button
              onClick={() => onSelectTab('leaderboard')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'leaderboard'
                  ? 'bg-white dark:bg-zinc-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
                  : 'text-stone-600 dark:text-zinc-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Рейтинг</span>
            </button>

            <button
              onClick={() => onSelectTab('tips')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'tips'
                  ? 'bg-white dark:bg-zinc-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
                  : 'text-stone-600 dark:text-zinc-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Эко-советы</span>
            </button>

            <button
              onClick={() => onSelectTab('achievements')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'achievements'
                  ? 'bg-white dark:bg-zinc-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
                  : 'text-stone-600 dark:text-zinc-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Награды</span>
            </button>
          </nav>

          {/* Right Action Tools: PWA Install + Theme Toggle + Exit Game (if active) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isQuizActive && (
              <button
                onClick={handleExitClick}
                className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-800/50 transition shadow-sm"
                title="Прервать викторину и выйти в главное меню"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Выйти из игры</span>
                <span className="sm:hidden">Выход</span>
              </button>
            )}

            <PWAInstallButton />

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 rounded-xl border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-stone-700 dark:text-zinc-200 hover:bg-stone-50 dark:hover:bg-zinc-700 transition shadow-sm"
              title={theme === 'dark' ? 'Включить светлую тему' : 'Включить темную тему'}
              aria-label="Переключить тему оформления"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-stone-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-stone-100 dark:border-zinc-800 overflow-x-auto gap-1 scrollbar-none">
          <button
            onClick={() => onSelectTab('quiz')}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-medium shrink-0 ${
              currentTab === 'quiz'
                ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 font-bold'
                : 'text-stone-500 dark:text-zinc-400'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Викторина</span>
          </button>
          <button
            onClick={() => onSelectTab('leaderboard')}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-medium shrink-0 ${
              currentTab === 'leaderboard'
                ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 font-bold'
                : 'text-stone-500 dark:text-zinc-400'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Рейтинг</span>
          </button>
          <button
            onClick={() => onSelectTab('tips')}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-medium shrink-0 ${
              currentTab === 'tips'
                ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 font-bold'
                : 'text-stone-500 dark:text-zinc-400'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Советы</span>
          </button>
          <button
            onClick={() => onSelectTab('achievements')}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-medium shrink-0 ${
              currentTab === 'achievements'
                ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 font-bold'
                : 'text-stone-500 dark:text-zinc-400'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Награды</span>
          </button>
        </div>
      </div>

      {/* Exit Confirmation Dialog */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-2xl border border-stone-200 dark:border-zinc-800 space-y-4 text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-stone-900 dark:text-white font-['Unbounded',sans-serif]">
                Прервать викторину?
              </h3>
              <p className="mt-2 text-xs text-stone-600 dark:text-zinc-300">
                Вы действительно хотите выйти в главное меню? Текущий раунд не сохранится.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="py-2.5 px-4 rounded-xl bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200 dark:hover:bg-zinc-700 text-stone-800 dark:text-zinc-200 text-xs font-bold transition"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={confirmExit}
                className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/20 transition flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>Да, выйти</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
