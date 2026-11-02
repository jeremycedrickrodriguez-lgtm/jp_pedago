import React, { useState, useEffect, useCallback } from 'react';
import {
  LOGO_B64,
  LessonId,
  EXAMS_CONFIG,
  getQuizQuestions,
  getExamQuestionByRef
} from './data/curriculumMeta';
import {
  AppDatabase,
  UserAccount,
  loadDatabase,
  saveDatabase,
  getLessonProgress,
  isLessonUnlocked,
  calculateLessonQuizScore,
  shuffleArray,
  formatDurationHMS
} from './data/store';
import { LoginModal } from './components/LoginModal';
import { HomeView } from './components/HomeView';
import { ModulesView } from './components/ModulesView';
import { ExamsView } from './components/ExamsView';
import { StatsView } from './components/StatsView';
import { GradebookView } from './components/GradebookView';
import { ProfileView, CreditsAndAboutView } from './components/ProfileAndCreditsView';
import {
  Menu,
  X,
  Clock,
  LogOut,
  LogIn,
  User,
  BookOpen,
  FileCheck2,
  BarChart3,
  FileSpreadsheet,
  Info,
  Home
} from 'lucide-react';

type NavView = 'home' | 'modules' | 'exams' | 'stats' | 'gradebook' | 'profile' | 'about';

export function App() {
  const [db, setDb] = useState<AppDatabase>(() => loadDatabase());
  const [activeView, setActiveView] = useState<NavView>('home');
  const [activeLessonId, setActiveLessonId] = useState<LessonId>('1.1');
  const [examMode, setExamMode] = useState<'hub' | 'taking' | 'review'>('hub');
  const [reviewAttemptId, setReviewAttemptId] = useState<string | null>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pendingDestination, setPendingDestination] = useState<{
    view: NavView;
    lessonId?: LessonId;
    examId?: 1 | 2 | 3;
  } | null>(null);

  const currentUser: UserAccount | null =
    db.users.find((u) => u.id === db.currentUserId) || null;

  // Persist DB helper
  const updateDb = useCallback((updater: (prev: AppDatabase) => AppDatabase) => {
    setDb((prev) => {
      const next = updater(prev);
      saveDatabase(next);
      return next;
    });
  }, []);

  // Finalize an active exam (either manual submit or 60-minute timeout)
  const finalizeActiveExam = useCallback(
    (uid: string, timedOut: boolean) => {
      let createdAttemptId: string | null = null;

      updateDb((prev) => {
        const active = prev.activeExams[uid];
        if (!active) return prev;

        const now = Date.now();
        const cfg = EXAMS_CONFIG[active.examId];
        const durationSec = Math.min(
          cfg.durationSeconds,
          Math.max(1, active.elapsedSeconds)
        );

        let score = 0;
        active.refs.forEach((r, idx) => {
          const q = getExamQuestionByRef(r);
          if (active.answers[idx] === q.correctIndex) {
            score += 1;
          }
        });

        const existingAttemptsCount = prev.exams.filter(
          (e) => e.uid === uid && e.examId === active.examId
        ).length;

        createdAttemptId = `ex_${now}_${Math.random().toString(36).slice(2, 6)}`;

        const newRecord = {
          id: createdAttemptId,
          uid,
          examId: active.examId,
          attemptNumber: existingAttemptsCount + 1,
          refs: active.refs,
          answers: active.answers,
          score,
          total: active.refs.length,
          startedAt: active.startedAt,
          endedAt: now,
          durationSeconds: durationSec,
          timedOut
        };

        const remainingActive = { ...prev.activeExams };
        delete remainingActive[uid];

        return {
          ...prev,
          exams: [...prev.exams, newRecord],
          activeExams: remainingActive
        };
      });

      if (createdAttemptId) {
        setReviewAttemptId(createdAttemptId);
        setExamMode('review');
        setActiveView('exams');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [updateDb]
  );

  // 1-second interval for tracking overall student study time AND active exam countdown
  useEffect(() => {
    const timer = setInterval(() => {
      if (document.hidden) return;

      setDb((prev) => {
        const uid = prev.currentUserId;
        if (!uid) return prev;

        const userIdx = prev.users.findIndex((u) => u.id === uid);
        if (userIdx === -1) return prev;

        const updatedUsers = [...prev.users];
        updatedUsers[userIdx] = {
          ...updatedUsers[userIdx],
          totalSeconds: (updatedUsers[userIdx].totalSeconds || 0) + 1
        };

        let updatedActiveExams = prev.activeExams;
        const activeEx = prev.activeExams[uid];
        let shouldAutoSubmit = false;

        if (activeView === 'exams' && examMode === 'taking' && activeEx) {
          const cfg = EXAMS_CONFIG[activeEx.examId];
          const nextElapsed = (activeEx.elapsedSeconds || 0) + 1;
          if (nextElapsed >= cfg.durationSeconds) {
            shouldAutoSubmit = true;
          } else {
            updatedActiveExams = {
              ...prev.activeExams,
              [uid]: {
                ...activeEx,
                elapsedSeconds: nextElapsed
              }
            };
          }
        }

        const nextDb = {
          ...prev,
          users: updatedUsers,
          activeExams: updatedActiveExams
        };
        saveDatabase(nextDb);

        if (shouldAutoSubmit) {
          setTimeout(() => finalizeActiveExam(uid, true), 0);
        }

        return nextDb;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeView, examMode, finalizeActiveExam]);

  // Require login before entering protected views
  const navigateProtected = (
    view: NavView,
    options?: { lessonId?: LessonId; examId?: 1 | 2 | 3 }
  ) => {
    setMobileMenuOpen(false);
    if (view === 'home' || view === 'about') {
      setActiveView(view);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!currentUser) {
      setPendingDestination({ view, ...options });
      setLoginModalOpen(true);
      return;
    }

    if (options?.lessonId) {
      if (isLessonUnlocked(db, currentUser, options.lessonId)) {
        setActiveLessonId(options.lessonId);
      }
    }

    if (view === 'exams') {
      if (options?.examId) {
        handleStartExamForUser(currentUser, options.examId, false);
        return;
      } else {
        setExamMode('hub');
      }
    }

    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Start or resume an exam with a unique randomized 1-60 set per student
  const handleStartExamForUser = (
    user: UserAccount,
    examId: 1 | 2 | 3,
    forceNewSet = false
  ) => {
    const existingActive = db.activeExams[user.id];

    if (!forceNewSet && existingActive && existingActive.examId === examId) {
      setExamMode('taking');
      setActiveView('exams');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const poolRefs = EXAMS_CONFIG[examId].getPool().map((q) => q.ref);
    const randomized60 = shuffleArray(poolRefs).slice(0, 60);

    updateDb((prev) => ({
      ...prev,
      activeExams: {
        ...prev.activeExams,
        [user.id]: {
          examId,
          refs: randomized60,
          answers: Array(60).fill(null),
          currentIndex: 0,
          startedAt: Date.now(),
          elapsedSeconds: 0
        }
      }
    }));

    setExamMode('taking');
    setActiveView('exams');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectUserLogin = (user: UserAccount) => {
    updateDb((prev) => ({
      ...prev,
      currentUserId: user.id
    }));
    setLoginModalOpen(false);

    if (pendingDestination) {
      const dest = pendingDestination;
      setPendingDestination(null);
      if (dest.lessonId) setActiveLessonId(dest.lessonId);
      if (dest.view === 'exams' && dest.examId) {
        handleStartExamForUser(user, dest.examId, false);
        return;
      }
      setActiveView(dest.view);
    } else {
      setActiveView(user.role === 'teacher' ? 'gradebook' : 'modules');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegisterStudent = (data: {
    name: string;
    sid: string;
    pw: string;
    program: string;
    yearLevel: string;
  }) => {
    const exists = db.users.some(
      (u) => u.sid.toLowerCase() === data.sid.toLowerCase()
    );
    if (exists) {
      return { ok: false, error: 'That Student ID is already registered.' };
    }

    const newUser: UserAccount = {
      id: `u_student_${Date.now()}`,
      role: 'student',
      name: data.name,
      sid: data.sid,
      pw: data.pw,
      program: data.program,
      yearLevel: data.yearLevel,
      email: `${data.sid.toLowerCase()}@tmlcr.edu.ph`,
      totalSeconds: 0,
      createdAt: Date.now()
    };

    updateDb((prev) => ({
      ...prev,
      users: [...prev.users, newUser],
      currentUserId: newUser.id
    }));

    setLoginModalOpen(false);
    setActiveView('modules');
    setActiveLessonId('1.1');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return { ok: true };
  };

  const handleLogout = () => {
    updateDb((prev) => ({
      ...prev,
      currentUserId: null
    }));
    setActiveView('home');
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Answer a question in a Lesson Knowledge Check
  const handleAnswerQuiz = (lid: LessonId, qIndex: number, optionIndex: number) => {
    if (!currentUser) return;
    const qs = getQuizQuestions(lid);

    updateDb((prev) => {
      const currentProg = getLessonProgress(prev, currentUser.id, lid);
      const nextAnswers = [...currentProg.answers];
      nextAnswers[qIndex] = optionIndex;

      const allAnswered = qs.every((_, idx) => nextAnswers[idx] != null);
      let nextHistory = currentProg.history;

      if (allAnswered && !currentProg.done) {
        const tempProg = { ...currentProg, answers: nextAnswers };
        const sc = calculateLessonQuizScore(tempProg, lid);
        nextHistory = [
          ...currentProg.history,
          { score: sc.score, total: sc.total, completedAt: Date.now() }
        ];
      }

      return {
        ...prev,
        quizzes: {
          ...prev.quizzes,
          [currentUser.id]: {
            ...(prev.quizzes[currentUser.id] || {}),
            [lid]: {
              ...currentProg,
              answers: nextAnswers,
              done: allAnswered || currentProg.done,
              history: nextHistory
            }
          }
        }
      };
    });
  };

  // Reset a Lesson Knowledge Check so student can retake it
  const handleResetQuiz = (lid: LessonId) => {
    if (!currentUser) return;
    updateDb((prev) => {
      const currentProg = getLessonProgress(prev, currentUser.id, lid);
      return {
        ...prev,
        quizzes: {
          ...prev.quizzes,
          [currentUser.id]: {
            ...(prev.quizzes[currentUser.id] || {}),
            [lid]: {
              ...currentProg,
              answers: []
            }
          }
        }
      };
    });
  };

  // Select Scenario Lab Option
  const handleSelectScenarioOption = (lid: LessonId, optionIndex: number) => {
    if (!currentUser) return;
    updateDb((prev) => {
      const currentProg = getLessonProgress(prev, currentUser.id, lid);
      return {
        ...prev,
        quizzes: {
          ...prev.quizzes,
          [currentUser.id]: {
            ...(prev.quizzes[currentUser.id] || {}),
            [lid]: {
              ...currentProg,
              scenarioSelected: optionIndex
            }
          }
        }
      };
    });
  };

  // Save Reflection
  const handleSaveReflection = (lid: LessonId, text: string) => {
    if (!currentUser) return;
    updateDb((prev) => {
      const currentProg = getLessonProgress(prev, currentUser.id, lid);
      return {
        ...prev,
        quizzes: {
          ...prev.quizzes,
          [currentUser.id]: {
            ...(prev.quizzes[currentUser.id] || {}),
            [lid]: {
              ...currentProg,
              reflectionText: text
            }
          }
        }
      };
    });
  };

  const navItems: { id: NavView; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="h-4 w-4" /> },
    { id: 'modules', label: 'Modules', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'exams', label: 'Exams', icon: <FileCheck2 className="h-4 w-4" /> },
    { id: 'stats', label: 'Stats', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'gradebook', label: 'Gradebook', icon: <FileSpreadsheet className="h-4 w-4" /> },
    { id: 'profile', label: 'Profile', icon: <User className="h-4 w-4" /> },
    { id: 'about', label: 'Credits', icon: <Info className="h-4 w-4" /> }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#eef2ee] text-[#18261c]">
      {/* Top Institutional Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#1d4d2b] text-white border-b border-[#143a20] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Brand Wordmark */}
          <button
            type="button"
            onClick={() => navigateProtected('home')}
            className="flex items-center gap-2.5 text-left shrink-0 cursor-pointer group"
          >
            <img
              src={LOGO_B64}
              alt="TMLCR Seal"
              referrerPolicy="no-referrer"
              className="h-10 w-10 rounded-lg object-cover border border-[#d6b45f]/60"
            />
            <span className="text-lg sm:text-xl font-extrabold tracking-tight text-[#d6b45f] whitespace-nowrap group-hover:text-white transition-colors">
              PEDAGOREADY
            </span>
          </button>

          {/* Zone 2: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigateProtected(item.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#143a20] text-[#d6b45f] underline underline-offset-4'
                      : 'text-white/90 hover:bg-[#143a20]/60 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Active User / Login Action + Mobile Menu Button */}
          <div className="flex items-center gap-2.5 shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1.5 rounded-lg bg-[#143a20] border border-white/10 px-2.5 py-1.5 text-xs">
                  <Clock className="h-3.5 w-3.5 text-[#d6b45f]" />
                  <span className="font-mono font-bold text-[#d6b45f] tabular-nums">
                    {formatDurationHMS(currentUser.totalSeconds)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => navigateProtected('profile')}
                  className="hidden md:flex items-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 px-3 py-1.5 text-xs font-bold text-white transition-colors cursor-pointer max-w-[180px]"
                >
                  <span className="truncate">{currentUser.name}</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg bg-[#7a1a12] hover:bg-[#5e130d] text-white px-3 py-1.5 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setLoginModalOpen(true)}
                className="rounded-lg bg-[#d6b45f] hover:bg-[#c5a14a] text-[#18261c] px-4 py-2 text-xs font-extrabold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Login / Sign Up</span>
              </button>
            )}

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden rounded-lg bg-[#143a20] p-2 text-white hover:text-[#d6b45f]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#143a20] border-t border-white/10 px-4 py-3 space-y-2">
            {currentUser && (
              <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2 text-xs">
                <div>
                  <div className="font-bold text-white">{currentUser.name}</div>
                  <div className="text-[#d6b45f]">
                    {currentUser.role === 'teacher' ? 'Faculty / Admin' : `Student ID: ${currentUser.sid}`}
                  </div>
                </div>
                <div className="font-mono font-bold text-[#d6b45f] tabular-nums">
                  {formatDurationHMS(currentUser.totalSeconds)}
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigateProtected(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-left ${
                    activeView === item.id
                      ? 'bg-[#1d4d2b] text-[#d6b45f]'
                      : 'text-white/90 hover:bg-white/10'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeView === 'home' && (
          <HomeView
            db={db}
            currentUser={currentUser}
            onGetStarted={() => {
              if (currentUser) {
                navigateProtected(currentUser.role === 'teacher' ? 'gradebook' : 'modules');
              } else {
                setLoginModalOpen(true);
              }
            }}
            onOpenLesson={(lid) => navigateProtected('modules', { lessonId: lid })}
            onOpenExams={(examId) => navigateProtected('exams', { examId })}
            onNavigate={(v) => navigateProtected(v)}
          />
        )}

        {activeView === 'modules' && currentUser && (
          <ModulesView
            db={db}
            currentUser={currentUser}
            activeLessonId={activeLessonId}
            onSelectLesson={(lid) => {
              if (isLessonUnlocked(db, currentUser, lid)) {
                setActiveLessonId(lid);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            onAnswerQuiz={handleAnswerQuiz}
            onResetQuiz={handleResetQuiz}
            onSelectScenarioOption={handleSelectScenarioOption}
            onSaveReflection={handleSaveReflection}
            onGoToExam={(exId) => {
              setExamMode('hub');
              setActiveView('exams');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeView === 'exams' && currentUser && (
          <ExamsView
            db={db}
            currentUser={currentUser}
            mode={examMode}
            reviewAttemptId={reviewAttemptId}
            onStartExam={(exId, forceNew) =>
              handleStartExamForUser(currentUser, exId, forceNew)
            }
            onSelectAnswer={(optIdx) => {
              updateDb((prev) => {
                const cur = prev.activeExams[currentUser.id];
                if (!cur) return prev;
                const nextAns = [...cur.answers];
                nextAns[cur.currentIndex] = optIdx;
                return {
                  ...prev,
                  activeExams: {
                    ...prev.activeExams,
                    [currentUser.id]: {
                      ...cur,
                      answers: nextAns
                    }
                  }
                };
              });
            }}
            onNavigateQuestion={(newIdx) => {
              updateDb((prev) => {
                const cur = prev.activeExams[currentUser.id];
                if (!cur) return prev;
                return {
                  ...prev,
                  activeExams: {
                    ...prev.activeExams,
                    [currentUser.id]: {
                      ...cur,
                      currentIndex: newIdx
                    }
                  }
                };
              });
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSubmitExam={() => finalizeActiveExam(currentUser.id, false)}
            onOpenReview={(attId) => {
              setReviewAttemptId(attId);
              setExamMode('review');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBackToHub={() => {
              setExamMode('hub');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onStudyLesson={(lid) => {
              setActiveLessonId(lid);
              setActiveView('modules');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeView === 'stats' && currentUser && (
          <StatsView
            db={db}
            currentUser={currentUser}
            onStudyLesson={(lid) => {
              if (isLessonUnlocked(db, currentUser, lid)) {
                setActiveLessonId(lid);
              }
              setActiveView('modules');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenExamReview={(attId) => {
              setReviewAttemptId(attId);
              setExamMode('review');
              setActiveView('exams');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onGoToExams={() => {
              setExamMode('hub');
              setActiveView('exams');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeView === 'gradebook' && currentUser && (
          <GradebookView
            db={db}
            currentUser={currentUser}
            onOpenExamReview={(attId) => {
              setReviewAttemptId(attId);
              setExamMode('review');
              setActiveView('exams');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectLesson={(lid) => {
              if (isLessonUnlocked(db, currentUser, lid)) {
                setActiveLessonId(lid);
              }
              setActiveView('modules');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeView === 'profile' && currentUser && (
          <ProfileView
            db={db}
            currentUser={currentUser}
            onUpdateProfile={(updates) => {
              updateDb((prev) => ({
                ...prev,
                users: prev.users.map((u) =>
                  u.id === currentUser.id ? { ...u, ...updates } : u
                )
              }));
            }}
            onResetAllQuizzes={() => {
              updateDb((prev) => ({
                ...prev,
                quizzes: {
                  ...prev.quizzes,
                  [currentUser.id]: {}
                }
              }));
              setActiveLessonId('1.1');
            }}
            onLogout={handleLogout}
          />
        )}

        {activeView === 'about' && (
          <CreditsAndAboutView
            db={db}
            currentUser={currentUser}
            onAddFeedback={({ category, rating, comment }) => {
              updateDb((prev) => ({
                ...prev,
                feedbacks: [
                  ...prev.feedbacks,
                  {
                    id: `fb_${Date.now()}`,
                    uid: currentUser?.id || 'guest',
                    authorName: currentUser?.name || 'TMLCR Pre-Service Student',
                    authorRole: currentUser?.role || 'student',
                    category,
                    rating,
                    comment,
                    createdAt: Date.now()
                  }
                ]
              }));
            }}
          />
        )}
      </main>

      {/* Clean Institutional Footer */}
      <footer className="bg-white border-t border-[#d5ded7] py-5 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5b6b60]">
          <div>
            <strong className="text-[#1d4d2b]">PEDAGOREADY</strong> · Teodoro M. Luansing College of Rosario · College of Teacher Education
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigateProtected('about')}
              className="hover:text-[#1d4d2b] font-semibold cursor-pointer"
            >
              About &amp; Credits
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => navigateProtected('modules')}
              className="hover:text-[#1d4d2b] font-semibold cursor-pointer"
            >
              Course Modules
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => navigateProtected('exams')}
              className="hover:text-[#1d4d2b] font-semibold cursor-pointer"
            >
              60-Item Exams
            </button>
          </div>
        </div>
      </footer>

      {/* Login / Access Portal Modal */}
      {loginModalOpen && (
        <LoginModal
          users={db.users}
          onClose={() => {
            setLoginModalOpen(false);
            setPendingDestination(null);
          }}
          onSelectUser={handleSelectUserLogin}
          onRegisterStudent={handleRegisterStudent}
        />
      )}
    </div>
  );
}

export default App;
