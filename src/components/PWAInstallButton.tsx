import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed, hide
  if (isInstalled) {
    return null;
  }

  // Desktop / Android flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 text-xs font-semibold shadow-sm transition-all hover:shadow-md"
        title="Установить приложение на устройство для быстрой работы без интернета"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Установить</span>
      </button>
    );
  }

  // iOS Safari Flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-xl border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-stone-700 dark:text-zinc-200 px-3 py-2 text-xs font-semibold hover:bg-stone-50 dark:hover:bg-zinc-700 transition"
          title="Инструкция по установке на iPhone / iPad"
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden sm:inline">На экран</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-2xl border border-stone-200 dark:border-zinc-800 text-stone-900 dark:text-white">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-zinc-800">
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-emerald-600" />
                  Установка на iPhone / iPad
                </h3>
                <button 
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-zinc-800 text-stone-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <ol className="mt-4 space-y-3 text-xs text-stone-600 dark:text-zinc-300 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-[10px]">1</span>
                  <span>Нажмите кнопку <strong>«Поделиться»</strong> (иконка квадрата со стрелкой вверх) в нижней панели Safari.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-[10px]">2</span>
                  <span>Прокрутите список вниз и выберите <strong>«На экран "Домой"»</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-[10px]">3</span>
                  <span>Нажмите <strong>«Добавить»</strong>. Викторина будет доступна офлайн как нативное приложение!</span>
                </li>
              </ol>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-emerald-600 text-white py-2.5 text-xs font-bold hover:bg-emerald-700 transition"
              >
                Понятно
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
