import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, 
  Award, 
  RotateCcw, 
  Share2, 
  CheckCircle2, 
  XCircle, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  Send, 
  Sparkles,
  MapPin,
  ExternalLink,
  Flame,
  Check,
  Copy,
  LogOut
} from 'lucide-react';
import { QuizSessionState, Question, PlayerRank } from '../types';
import { DISTRICT_SETTLEMENTS, PLAYER_RANKS } from '../data/districtInfo';
import { getRankForScore, saveLeaderboardEntry, getUserProfile, saveUserProfile } from '../utils/storage';
import { CertificateModal } from './CertificateModal';
import confetti from 'canvas-confetti';

interface QuizResultsProps {
  session: QuizSessionState;
  onRestartQuiz: () => void;
  onGoToLeaderboard: () => void;
  onExitToMenu?: () => void;
  categoryTitle: string;
}

export const QuizResults: React.FC<QuizResultsProps> = ({
  session,
  onRestartQuiz,
  onGoToLeaderboard,
  onExitToMenu,
  categoryTitle,
}) => {
  const [profile, setProfile] = useState(() => getUserProfile());
  const [isSaved, setIsSaved] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [showAnswersReview, setShowAnswersReview] = useState(false);
  const [copied, setCopied] = useState(false);

  const totalQuestions = session.questions.length;
  const correctCount = session.correctAnswersCount;
  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const rank: PlayerRank = getRankForScore(session.score);

  useEffect(() => {
    // Launch celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#059669', '#10B981', '#38BDF8', '#F59E0B', '#8B5CF6'],
    });
  }, []);

  const handleSaveScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.name.trim()) return;

    saveUserProfile(profile);
    saveLeaderboardEntry({
      playerName: profile.name.trim(),
      settlement: profile.settlement,
      score: session.score,
      correctPercentage: percentage,
      category: session.selectedCategory,
      mode: session.mode,
      rankTitle: rank.title,
    });
    setIsSaved(true);
  };

  const shareText = `🌲 Я набрал ${session.score} баллов и получил звание «${rank.title}» в Экологической викторине Администрации Нефтегорского района! Проверь свои знания о природе и ТКО: ${window.location.href}`;

  const handleShareVK = () => {
    const url = `https://vk.com/share.php?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent('Эко-Викторина Нефтегорского Района')}&comment=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleShareTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleShareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner & Rank Card */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-zinc-800 shadow-lg text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-500" />
        
        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-xl shadow-emerald-700/20 mb-4">
          <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-amber-300" />
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white font-['Unbounded',sans-serif]">
          Викторина завершена!
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-zinc-400 mt-1">
          Направление: <strong>{categoryTitle}</strong>
        </p>

        {/* Assigned Rank Badge */}
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 font-bold text-xs sm:text-sm">
          <Award className="w-4 h-4 text-emerald-600" />
          <span>Присвоенный ранг: <strong>{rank.title}</strong></span>
        </div>
        <p className="text-xs text-stone-600 dark:text-zinc-400 mt-2 max-w-md mx-auto">
          {rank.description}
        </p>

        {/* Big Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-stone-100 dark:border-zinc-800 text-left font-['Plus_Jakarta_Sans',sans-serif]">
          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-zinc-800/60 border border-stone-200/60 dark:border-zinc-700/60">
            <div className="text-[11px] font-bold text-stone-500 dark:text-zinc-400 uppercase">Всего баллов</div>
            <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5 font-['Unbounded',sans-serif]">
              {session.score}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-zinc-800/60 border border-stone-200/60 dark:border-zinc-700/60">
            <div className="text-[11px] font-bold text-stone-500 dark:text-zinc-400 uppercase">Верных ответов</div>
            <div className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white mt-0.5 font-['Unbounded',sans-serif]">
              {correctCount} <span className="text-xs font-normal text-stone-400">/ {totalQuestions}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-zinc-800/60 border border-stone-200/60 dark:border-zinc-700/60">
            <div className="text-[11px] font-bold text-stone-500 dark:text-zinc-400 uppercase">Точность</div>
            <div className="text-xl sm:text-2xl font-black text-sky-600 dark:text-sky-400 mt-0.5 font-['Unbounded',sans-serif]">
              {percentage}%
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-zinc-800/60 border border-stone-200/60 dark:border-zinc-700/60">
            <div className="text-[11px] font-bold text-stone-500 dark:text-zinc-400 uppercase flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Макс. серия</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 mt-0.5 font-['Unbounded',sans-serif]">
              {session.maxStreak}
            </div>
          </div>
        </div>

        {/* Certificate Button */}
        <div className="mt-6">
          <button
            onClick={() => setShowCertificate(true)}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-700/20 inline-flex items-center justify-center gap-2 transition"
          >
            <Award className="w-4 h-4 text-amber-300" />
            <span>Получить именной сертификат Администрации района</span>
          </button>
        </div>
      </motion.div>

      {/* Save Score into Municipal Leaderboard */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-stone-200 dark:border-zinc-800 shadow-md">
        <h3 className="text-sm font-extrabold text-stone-900 dark:text-white mb-2 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-emerald-600" />
          Внести свой результат в Рейтинг района
        </h3>
        <p className="text-xs text-stone-500 dark:text-zinc-400 mb-4">
          Укажите ваше имя и населенный пункт Нефтегорского района, чтобы соревноваться с земляками.
        </p>

        {isSaved ? (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-between border border-emerald-200 dark:border-emerald-800/50">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Результат успешно сохранен в районной таблице лидеров!
            </span>
            <button
              onClick={onGoToLeaderboard}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs hover:bg-emerald-700 transition"
            >
              Смотреть рейтинг
            </button>
          </div>
        ) : (
          <form onSubmit={handleSaveScore} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-stone-600 dark:text-zinc-300 mb-1">
                Ваши Имя и Отчество:
              </label>
              <input
                type="text"
                required
                placeholder="например, Александр Сергеевич"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-stone-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-600 dark:text-zinc-300 mb-1">
                Населенный пункт района:
              </label>
              <select
                value={profile.settlement}
                onChange={(e) => setProfile({ ...profile, settlement: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-stone-900 dark:text-white"
              >
                {DISTRICT_SETTLEMENTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Сохранить в рейтинг</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Social Media Sharing */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-stone-200 dark:border-zinc-800 shadow-md">
        <h3 className="text-sm font-extrabold text-stone-900 dark:text-white mb-2 flex items-center gap-2">
          <Share2 className="w-4 h-4 text-sky-600" />
          Поделиться своими результатами
        </h3>
        <p className="text-xs text-stone-500 dark:text-zinc-400 mb-4">
          Расскажите друзьям и землякам о своем экологическом достижении!
        </p>
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={handleShareVK}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0077FF] hover:bg-[#0066DD] text-white text-xs font-bold transition"
          >
            <span>ВКонтакте</span>
          </button>
          <button
            onClick={handleShareTelegram}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#24A1DE] hover:bg-[#1D8AC0] text-white text-xs font-bold transition"
          >
            <span>Telegram</span>
          </button>
          <button
            onClick={handleShareWhatsApp}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs font-bold transition"
          >
            <span>WhatsApp</span>
          </button>
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200 dark:hover:bg-zinc-700 text-stone-700 dark:text-zinc-200 text-xs font-bold border border-stone-200 dark:border-zinc-700 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Скопировано!' : 'Скопировать текст'}</span>
          </button>
        </div>
      </div>

      {/* Answers History & Explanations Review */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-stone-200 dark:border-zinc-800 shadow-md">
        <button
          onClick={() => setShowAnswersReview(!showAnswersReview)}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-extrabold text-stone-900 dark:text-white">
              Подробный разбор ответов и законов ({session.answersHistory.length} вопр.)
            </span>
          </div>
          {showAnswersReview ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
        </button>

        {showAnswersReview && (
          <div className="mt-4 space-y-4 pt-4 border-t border-stone-100 dark:border-zinc-800">
            {session.answersHistory.map((item, index) => {
              const q = session.questions.find((quest) => quest.id === item.questionId);
              if (!q) return null;
              const isCorrect = item.isCorrect;

              return (
                <div 
                  key={index}
                  className={`p-4 rounded-2xl border text-xs ${
                    isCorrect
                      ? 'border-emerald-200 dark:border-emerald-800/40 bg-emerald-50/40 dark:bg-emerald-950/20'
                      : 'border-red-200 dark:border-red-800/40 bg-red-50/40 dark:bg-red-950/20'
                  }`}
                >
                  <div className="flex items-start gap-2 mb-2">
                    {isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    )}
                    <div className="font-bold text-stone-900 dark:text-white">
                      Вопрос {index + 1}: {q.question}
                    </div>
                  </div>

                  <div className="space-y-1 ml-6 text-stone-700 dark:text-zinc-300">
                    <p>
                      <strong>Ваш ответ:</strong> {item.selectedOption >= 0 ? q.options[item.selectedOption] : 'Время истекло'}
                    </p>
                    {!isCorrect && (
                      <p className="text-emerald-700 dark:text-emerald-400 font-semibold">
                        <strong>Правильный ответ:</strong> {q.options[q.correctIndex]}
                      </p>
                    )}
                    <p className="text-stone-600 dark:text-zinc-400 pt-1 text-[11px] leading-relaxed">
                      💡 {q.explanation}
                    </p>
                    {q.legalReference && (
                      <p className="text-[10px] text-stone-500 dark:text-zinc-500 font-mono">
                        ⚖️ {q.legalReference}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 pt-2">
        <button
          onClick={onRestartQuiz}
          className="flex-1 min-w-[200px] py-3 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Пройти другую викторину</span>
        </button>
        <button
          onClick={onGoToLeaderboard}
          className="py-3 px-5 rounded-2xl bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200 dark:hover:bg-zinc-700 text-stone-800 dark:text-zinc-100 text-xs sm:text-sm font-bold border border-stone-200 dark:border-zinc-700 transition"
        >
          Таблица лидеров
        </button>
        {onExitToMenu && (
          <button
            onClick={onExitToMenu}
            className="py-3 px-5 rounded-2xl bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 text-xs sm:text-sm font-bold border border-red-200 dark:border-red-800/50 transition flex items-center justify-center gap-1.5 active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            <span>Выйти в главное меню</span>
          </button>
        )}
      </div>

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={showCertificate}
        onClose={() => setShowCertificate(false)}
        playerName={profile.name || 'Участник викторины'}
        settlement={profile.settlement}
        score={session.score}
        correctPercentage={percentage}
        rank={rank}
        categoryTitle={categoryTitle}
      />
    </div>
  );
};
