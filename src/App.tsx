import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Header, NavTab } from './components/Header';
import { OfflineIndicator } from './components/OfflineIndicator';
import { QuizHome } from './components/QuizHome';
import { QuizCard } from './components/QuizCard';
import { QuizResults } from './components/QuizResults';
import { Leaderboard } from './components/Leaderboard';
import { EcoTipsGuide } from './components/EcoTipsGuide';
import { AchievementsView } from './components/AchievementsView';
import { ParticipantModal } from './components/ParticipantModal';
import { 
  CategoryId, 
  GameMode, 
  Question, 
  QuizSessionState, 
  LifelineState 
} from './types';
import { QUESTIONS, CATEGORIES } from './data/questions';
import { unlockAchievement, getUserProfile, saveUserProfile } from './utils/storage';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('quiz');
  
  // Quiz State
  const [session, setSession] = useState<QuizSessionState | null>(null);
  const [isQuizActive, setIsQuizActive] = useState<boolean>(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);

  // Participant Registration Modal State
  const [pendingQuizStart, setPendingQuizStart] = useState<{ categoryId: CategoryId | 'all'; questionCount: number } | null>(null);
  const [isParticipantModalOpen, setIsParticipantModalOpen] = useState<boolean>(false);

  // Lifelines and current question interaction state
  const [lifelines, setLifelines] = useState<LifelineState>({
    fiftyFiftyUsed: false,
    consultantUsed: false,
    timeFreezeUsed: false,
  });
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Intercept start quiz to ask for First Name & Patronymic
  const handleStartQuiz = (categoryId: CategoryId | 'all' = 'all', questionCount: number = 10) => {
    setPendingQuizStart({ categoryId, questionCount });
    setIsParticipantModalOpen(true);
  };

  // Actually launch the quiz once participant confirms name & patronymic
  const executeStartQuiz = (categoryId: CategoryId | 'all' = 'all', questionCount: number = 10) => {
    let pool: Question[] = [];
    if (categoryId === 'all') {
      // Pick balanced from each category
      const shuffled = [...QUESTIONS].sort(() => 0.5 - Math.random());
      pool = shuffled.slice(0, questionCount);
    } else {
      const filtered = QUESTIONS.filter((q) => q.categoryId === categoryId);
      const shuffled = [...filtered].sort(() => 0.5 - Math.random());
      pool = shuffled.slice(0, Math.min(questionCount, filtered.length));
    }

    const newSession: QuizSessionState = {
      questions: pool,
      currentIndex: 0,
      score: 0,
      streak: 0,
      maxStreak: 0,
      correctAnswersCount: 0,
      totalTimeSpent: 0,
      selectedCategory: categoryId,
      mode: categoryId === 'all' ? 'marathon' : 'category',
      answersHistory: [],
    };

    setSession(newSession);
    setIsQuizActive(true);
    setIsQuizCompleted(false);
    setLifelines({
      fiftyFiftyUsed: false,
      consultantUsed: false,
      timeFreezeUsed: false,
    });
    setEliminatedOptions([]);
    setIsAnswerSubmitted(false);
    setSelectedOption(null);
    setCurrentTab('quiz');
  };

  // Reset / Cancel Quiz
  const handleResetQuiz = () => {
    setIsQuizActive(false);
    setIsQuizCompleted(false);
    setSession(null);
  };

  // Handle Lifelines
  const handleUseFiftyFifty = () => {
    if (!session || lifelines.fiftyFiftyUsed) return;
    const currentQ = session.questions[session.currentIndex];
    
    // Find incorrect options
    const incorrectIndices = currentQ.options
      .map((_, idx) => idx)
      .filter((idx) => idx !== currentQ.correctIndex);
    
    // Shuffle and pick 2 to eliminate
    const shuffledIncorrect = [...incorrectIndices].sort(() => 0.5 - Math.random());
    const toEliminate = shuffledIncorrect.slice(0, 2);

    setEliminatedOptions(toEliminate);
    setLifelines((prev) => ({ ...prev, fiftyFiftyUsed: true }));
  };

  const handleUseConsultant = () => {
    setLifelines((prev) => ({ ...prev, consultantUsed: true }));
  };

  const handleUseTimeFreeze = () => {
    setLifelines((prev) => ({ ...prev, timeFreezeUsed: true }));
  };

  // Handle option select
  const handleSelectAnswer = (optionIndex: number, pointsEarned: number, timeSpent: number) => {
    if (!session || isAnswerSubmitted) return;

    const currentQ = session.questions[session.currentIndex];
    const isCorrect = optionIndex === currentQ.correctIndex;

    setSelectedOption(optionIndex);
    setIsAnswerSubmitted(true);

    const newStreak = isCorrect ? session.streak + 1 : 0;
    const newMaxStreak = Math.max(session.maxStreak, newStreak);
    const newScore = session.score + pointsEarned;
    const newCorrectCount = isCorrect ? session.correctAnswersCount + 1 : session.correctAnswersCount;

    // Check achievement triggers
    if (isCorrect) {
      unlockAchievement('first-step');
      if (newStreak >= 5) {
        unlockAchievement('streak-5');
      }
      if (currentQ.id.includes('barinovka') || currentQ.id.includes('vetlyanka')) {
        unlockAchievement('barinovka-champion');
      }
      if (currentQ.categoryId === 'water' && (currentQ.legalReference?.includes('Водный кодекс') || currentQ.question.includes('водоохран'))) {
        unlockAchievement('water-code-expert');
      }
    }

    setSession((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        score: newScore,
        streak: newStreak,
        maxStreak: newMaxStreak,
        correctAnswersCount: newCorrectCount,
        totalTimeSpent: (prev.totalTimeSpent || 0) + timeSpent,
        answersHistory: [
          ...prev.answersHistory,
          {
            questionId: currentQ.id,
            selectedOption: optionIndex,
            isCorrect,
            timeSpent,
            pointsEarned,
          },
        ],
      };
    });
  };

  // Move to next question or complete
  const handleNextQuestion = () => {
    if (!session) return;

    const nextIndex = session.currentIndex + 1;
    if (nextIndex >= session.questions.length) {
      // Quiz Finished!
      // Check final score achievements
      if (session.score >= 2800) {
        unlockAchievement('top-inspector');
      }
      if (session.selectedCategory === 'tko' && session.score >= 1500) {
        unlockAchievement('tko-master');
      }
      if (session.selectedCategory === 'water' && session.correctAnswersCount === session.questions.length) {
        unlockAchievement('water-guard');
      }
      if (session.selectedCategory === 'nature_neftegorsk' && session.correctAnswersCount >= session.questions.length * 0.8) {
        unlockAchievement('neftegorsk-patriot');
      }

      setIsQuizCompleted(true);
      setIsQuizActive(false);
    } else {
      setSession((prev) => (prev ? { ...prev, currentIndex: nextIndex } : null));
      setEliminatedOptions([]);
      setIsAnswerSubmitted(false);
      setSelectedOption(null);
    }
  };

  const getCategoryTitle = (catId?: CategoryId | 'all') => {
    if (!catId || catId === 'all') return 'Комплексный экзамен';
    const found = CATEGORIES.find((c) => c.id === catId);
    return found ? found.title : catId;
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-stone-50 dark:bg-zinc-950 text-stone-900 dark:text-zinc-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] transition-colors duration-200">
        
        {/* Header & Municipal Navigation */}
        <Header
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          onResetQuiz={handleResetQuiz}
          isQuizActive={isQuizActive}
        />

        {/* Main View Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          
          {/* TAB 1: QUIZ / HOME / ACTIVE / RESULTS */}
          {currentTab === 'quiz' && (
            <>
              {/* If Quiz is in progress */}
              {isQuizActive && session && (
                <QuizCard
                  question={session.questions[session.currentIndex]}
                  questionNumber={session.currentIndex + 1}
                  totalQuestions={session.questions.length}
                  score={session.score}
                  streak={session.streak}
                  lifelines={lifelines}
                  eliminatedOptions={eliminatedOptions}
                  onSelectAnswer={handleSelectAnswer}
                  onNextQuestion={handleNextQuestion}
                  onUseFiftyFifty={handleUseFiftyFifty}
                  onUseConsultant={handleUseConsultant}
                  onUseTimeFreeze={handleUseTimeFreeze}
                  onExitQuiz={handleResetQuiz}
                  isAnswerSubmitted={isAnswerSubmitted}
                  selectedOption={selectedOption}
                />
              )}

              {/* If Quiz just completed */}
              {isQuizCompleted && session && (
                <QuizResults
                  session={session}
                  onRestartQuiz={() => {
                    setIsQuizCompleted(false);
                    setSession(null);
                  }}
                  onGoToLeaderboard={() => {
                    setIsQuizCompleted(false);
                    setSession(null);
                    setCurrentTab('leaderboard');
                  }}
                  onExitToMenu={handleResetQuiz}
                  categoryTitle={getCategoryTitle(session.selectedCategory)}
                />
              )}

              {/* If in Quiz Lobby / Home */}
              {!isQuizActive && !isQuizCompleted && (
                <QuizHome
                  onStartQuiz={handleStartQuiz}
                  onOpenTips={() => setCurrentTab('tips')}
                />
              )}
            </>
          )}

          {/* TAB 2: LEADERBOARD */}
          {currentTab === 'leaderboard' && (
            <Leaderboard onStartQuiz={(catId) => handleStartQuiz(catId || 'all', 10)} />
          )}

          {/* TAB 3: ECO TIPS */}
          {currentTab === 'tips' && <EcoTipsGuide />}

          {/* TAB 4: ACHIEVEMENTS */}
          {currentTab === 'achievements' && (
            <AchievementsView onStartQuiz={() => handleStartQuiz('all', 10)} />
          )}

        </main>

        {/* Participant Name & Settlement Modal */}
        <ParticipantModal
          isOpen={isParticipantModalOpen}
          onClose={() => {
            setIsParticipantModalOpen(false);
            setPendingQuizStart(null);
          }}
          onConfirm={(name, settlement) => {
            setIsParticipantModalOpen(false);
            const cat = pendingQuizStart?.categoryId || 'all';
            const count = pendingQuizStart?.questionCount || 10;
            executeStartQuiz(cat, count);
            setPendingQuizStart(null);
          }}
          categoryTitle={getCategoryTitle(pendingQuizStart?.categoryId)}
        />

        {/* Offline Status Persistent Banner */}
        <OfflineIndicator />

        {/* Municipal Footer */}
        <footer className="mt-auto border-t border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-8 px-4 text-xs text-stone-500 dark:text-zinc-400">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-10 flex items-center justify-center filter drop-shadow-sm shrink-0">
                <img src="/icon.svg" alt="Герб Нефтегорского района" className="w-full h-full object-contain" />
              </div>
              <div>
                <p className="font-bold text-stone-800 dark:text-zinc-200">
                  Администрация муниципального района Нефтегорский Самарской области
                </p>
                <p className="text-[11px] text-stone-500 dark:text-zinc-400">
                  Отдел экологии, природных ресурсов и жилищно-коммунального хозяйства
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[11px]">
              <span>Официальный портал: <a href="https://neftadm.samregion.ru/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline">neftadm.samregion.ru</a></span>
              <span>•</span>
              <span>Экстренные службы: <strong>112</strong></span>
              <span>•</span>
              <span>© {new Date().getFullYear()} Все права защищены</span>
            </div>
          </div>
        </footer>

      </div>
    </ThemeProvider>
  );
}
