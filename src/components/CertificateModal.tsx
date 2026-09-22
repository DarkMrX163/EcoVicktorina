import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { X, Download, Printer, Award, CheckCircle2, ShieldCheck, Share2 } from 'lucide-react';
import { PlayerRank } from '../types';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerName: string;
  settlement: string;
  score: number;
  correctPercentage: number;
  rank: PlayerRank;
  categoryTitle: string;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  playerName,
  settlement,
  score,
  correctPercentage,
  rank,
  categoryTitle,
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const certificateNumber = `ЭКО-НФТ-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8">
        
        {/* Actions bar above certificate */}
        <div className="flex items-center justify-between pb-3 text-white">
          <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-emerald-400">
            <Award className="w-4 h-4" />
            Официальный электронный сертификат
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-xs font-semibold text-white backdrop-blur transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Печать</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Card (Styled to look like an official luxury municipal diploma) */}
        <div
          ref={certificateRef}
          className="relative bg-[#FCFBF7] text-stone-900 rounded-3xl p-8 sm:p-12 border-8 border-double border-emerald-900/40 shadow-2xl overflow-hidden font-serif"
        >
          {/* Subtle Guilloche / Watermark Pattern */}
          <div className="absolute inset-4 rounded-2xl border border-emerald-800/20 pointer-events-none" />
          <div className="absolute inset-6 rounded-xl border border-dashed border-emerald-800/20 pointer-events-none" />

          {/* Decorative Corner Ornaments */}
          <div className="absolute top-7 left-7 w-6 h-6 border-t-2 border-l-2 border-emerald-700 pointer-events-none" />
          <div className="absolute top-7 right-7 w-6 h-6 border-t-2 border-r-2 border-emerald-700 pointer-events-none" />
          <div className="absolute bottom-7 left-7 w-6 h-6 border-b-2 border-l-2 border-emerald-700 pointer-events-none" />
          <div className="absolute bottom-7 right-7 w-6 h-6 border-b-2 border-r-2 border-emerald-700 pointer-events-none" />

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-2">
              <div className="w-16 h-18 p-1 flex items-center justify-center filter drop-shadow-md">
                <img src="/icon.svg" alt="Герб Нефтегорского района" className="w-full h-full object-contain" />
              </div>
            </div>
            <p className="text-[11px] sm:text-xs font-sans font-bold uppercase tracking-widest text-emerald-900">
              Администрация муниципального района Нефтегорский
            </p>
            <p className="text-[10px] font-sans text-stone-500 uppercase tracking-wider">
              Самарская область • Отдел экологии и природопользования
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 uppercase tracking-widest pt-2 font-['Unbounded',sans-serif]">
              СЕРТИФИКАТ
            </h1>
            <p className="text-xs italic text-stone-600">
              об успешном прохождении районной экологической викторины
            </p>
          </div>

          {/* Certificate Body */}
          <div className="mt-8 text-center space-y-4">
            <p className="text-xs font-sans text-stone-600">
              Настоящий сертификат подтверждает, что
            </p>
            <div className="text-xl sm:text-2xl font-bold text-emerald-950 font-sans border-b-2 border-stone-300 pb-1 inline-block min-w-[280px]">
              {playerName || 'Участник районной викторины'}
            </div>
            <p className="text-xs font-sans text-stone-600">
              представляющий <strong>{settlement}</strong>,
            </p>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-sans max-w-lg mx-auto">
              продемонстрировал(а) отличные знания в области охраны окружающей среды, раздельного сбора ТКО, водопользования и природных богатств Нефтегорского района по направлению <em>«{categoryTitle}»</em>.
            </p>

            {/* Score & Rank Highlight Box */}
            <div className="my-6 grid grid-cols-3 gap-3 p-4 bg-emerald-900/5 rounded-2xl border border-emerald-900/15 font-sans">
              <div className="text-center">
                <div className="text-[10px] uppercase font-bold text-stone-500">Набрано баллов</div>
                <div className="text-lg font-black text-emerald-900 font-['Unbounded',sans-serif]">{score}</div>
              </div>
              <div className="text-center border-x border-emerald-900/15">
                <div className="text-[10px] uppercase font-bold text-stone-500">Верных ответов</div>
                <div className="text-lg font-black text-emerald-900 font-['Unbounded',sans-serif]">{correctPercentage}%</div>
              </div>
              <div className="text-center">
                <div className="text-[10px] uppercase font-bold text-stone-500">Присвоенный ранг</div>
                <div className="text-xs font-bold text-emerald-800 leading-tight mt-1">{rank.title}</div>
              </div>
            </div>
          </div>

          {/* Signatures & Stamp */}
          <div className="mt-8 pt-6 border-t border-stone-300/80 flex flex-wrap items-end justify-between gap-4 font-sans text-xs">
            <div>
              <div className="text-[10px] text-stone-500">Дата выдачи:</div>
              <div className="font-semibold text-stone-800">{currentDate}</div>
              <div className="text-[10px] text-stone-400 font-mono mt-0.5">{certificateNumber}</div>
            </div>

            {/* Official Stamp Simulation */}
            <div className="relative w-24 h-24 rounded-full border-2 border-emerald-900/60 text-emerald-900/80 flex flex-col items-center justify-center p-2 text-center text-[7px] font-bold uppercase rotate-[-12deg] select-none">
              <div className="absolute inset-1 rounded-full border border-dashed border-emerald-900/40 pointer-events-none" />
              <span>Администрация</span>
              <span className="text-[9px] font-black my-0.5">м.р. Нефтегорский</span>
              <span>Самарская обл.</span>
              <span>★ Для документов ★</span>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-stone-500">Экологический контроль:</div>
              <div className="font-bold text-stone-800">Отдел экологии и ЖКХ</div>
              <div className="text-[10px] text-emerald-800 italic">Электронная подпись подтверждена ✓</div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-4 text-center">
          <p className="text-xs text-stone-300">
            Вы можете распечатать данный сертификат для портфолио или сохранить в PDF через меню печати.
          </p>
        </div>
      </div>
    </div>
  );
};
