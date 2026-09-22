import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff, CheckCircle2 } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-50 flex items-center justify-between gap-3 rounded-2xl bg-zinc-900/95 text-white p-3.5 shadow-2xl border border-zinc-700/80 backdrop-blur-md animate-in slide-in-from-bottom-3 duration-300">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
          <WifiOff className="w-4 h-4" />
        </div>
        <div>
          <p className="text-xs font-bold text-white">Вы находитесь в офлайн-режиме</p>
          <p className="text-[11px] text-zinc-300">
            Все 80+ вопросов, советы и памятники природы Нефтегорского района полностью доступны без интернета!
          </p>
        </div>
      </div>
      <div className="shrink-0 flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>Кэш активен</span>
      </div>
    </div>
  );
};
