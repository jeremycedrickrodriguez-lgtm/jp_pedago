import React from 'react';
import {
  HERO_B64,
  MODULES_CONFIG,
  LESSONS_META,
  LESSON_ORDER,
  LessonId,
  EXAMS_CONFIG
} from '../data/curriculumMeta';
import {
  AppDatabase,
  UserAccount,
  isLessonCompleted,
  isLessonUnlocked,
  calculateLessonQuizScore,
  getLessonProgress
} from '../data/store';
import {
  BookOpen,
  CheckCircle2,
  Lock,
  ArrowRight,
  Clock,
  GraduationCap,
  BarChart3,
  Award,
  FileCheck2
} from 'lucide-react';

interface HomeViewProps {
  db: AppDatabase;
  currentUser: UserAccount | null;
  onGetStarted: () => void;
  onOpenLesson: (lid: LessonId) => void;
  onOpenExams: (examId?: 1 | 2 | 3) => void;
  onNavigate: (view: 'modules' | 'exams' | 'stats' | 'gradebook' | 'about') => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  db,
  currentUser,
  onGetStarted,
  onOpenLesson,
  onOpenExams,
  onNavigate
}) => {
  const completedCount = currentUser
    ? LESSON_ORDER.filter((lid) => isLessonCompleted(db, currentUser.id, lid)).length
    : 0;
  const masteryPct = Math.round((completedCount / LESSON_ORDER.length) * 100);

  return (
    <div className="space-y-8 pb-10">
      {/* Hero Banner matching video recording */}
      <section className="relative -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden bg-[#1d4d2b] shadow-md">
        <div className="relative h-[380px] sm:h-[460px] lg:h-[540px] w-full">
          <img
            src={HERO_B64}
            alt="Teodoro M. Luansing College of Rosario Campus Building"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover object-center"
          />
          {/* Subtle top/bottom gradient for legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/15" />

          {/* Signature Maroon & Forest Green Wave Overlay from Video */}
          <svg
            viewBox="0 0 100 50"
            preserveAspectRatio="none"
            className="absolute inset-x-0 bottom-0 h-[55%] w-full pointer-events-none"
          >
            <path d="M0 8C18 32 52 50 100 38V50H0Z" fill="#7a1a12" />
            <path d="M0 18C18 38 52 52 100 44V50H0Z" fill="#1d4d2b" />
          </svg>

          {/* Get Started Button (left) */}
          <div className="absolute left-5 sm:left-12 lg:left-16 bottom-8 sm:bottom-14 z-10">
            <button
              type="button"
              onClick={onGetStarted}
              className="rounded-full bg-[#f1f4f2] hover:bg-white text-[#1d4d2b] border-2 border-[#b8c4bb] px-8 sm:px-12 py-3.5 sm:py-4 text-lg sm:text-2xl font-extrabold shadow-xl hover:scale-[1.02] active:scale-[0.99] transition-transform cursor-pointer flex items-center gap-3"
            >
              <span>{currentUser ? 'Continue Learning' : 'Get Started'}</span>
              <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-[#1d4d2b]" />
            </button>
          </div>

          {/* College Name (bottom right) */}
          <div className="absolute right-4 sm:right-10 lg:right-14 bottom-3 sm:bottom-6 z-10 text-right max-w-[60%]">
            <h1 className="text-sm sm:text-xl lg:text-2xl font-bold text-[#d6b45f] drop-shadow-xs">
              Teodoro M. Luansing College of Rosario
            </h1>
          </div>
        </div>
      </section>

      {/* Active Progress Bar (shown when logged in, matching video 0:10) */}
      {currentUser && (
        <section className="rounded-xl bg-white border border-[#d5ded7] p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-[#1d4d2b]">
                Active Learner Profile: {currentUser.name} ({currentUser.role === 'teacher' ? 'Faculty / Admin' : `ID: ${currentUser.sid}`})
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#18261c] mt-0.5">
                Overall Curriculum Mastery: {masteryPct}%
              </h2>
              <p className="text-xs text-[#5b6b60]">
                {completedCount} of {LESSON_ORDER.length} instructional lessons & knowledge checks completed
              </p>
            </div>
            <div className="w-full sm:w-72">
              <div className="flex items-center justify-between text-xs font-semibold text-[#5b6b60] mb-1.5">
                <span>Curriculum Progress</span>
                <span className="tabular-nums font-bold text-[#1d4d2b]">{masteryPct}%</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-[#eef2ee] overflow-hidden">
                <div
                  className="h-full bg-[#1d4d2b] transition-all duration-300"
                  style={{ width: `${masteryPct}%` }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Pre-Service Teacher Readiness Curriculum Section (matching video 0:10-0:11) */}
      <section className="space-y-5">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-[#7a1a12]">
            Instructional Outline
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#18261c]">
            Pre-Service Teacher Readiness Curriculum
          </h2>
          <p className="text-sm text-[#5b6b60]">
            Structured modules with sequential knowledge checks (1–5), interactive pedagogy scenario labs, and randomized 60-item timed licensure examinations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
          {/* Module 1 & Module 2 Cards */}
          {MODULES_CONFIG.map((mod) => {
            const doneInMod = currentUser
              ? mod.lessonIds.filter((id) => isLessonCompleted(db, currentUser.id, id)).length
              : 0;
            const firstLesson = mod.lessonIds[0];

            return (
              <div
                key={mod.id}
                className="rounded-xl bg-white border border-[#d5ded7] p-5 flex flex-col justify-between shadow-xs hover:border-[#1d4d2b]/50 transition-colors"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-[#5b6b60]">
                    <span className="font-bold text-[#1d4d2b]">{mod.code}</span>
                    <span>
                      {mod.lessonIds.length} Topics · 1 Exam
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[#18261c]">{mod.title}</h3>
                    <p className="text-xs text-[#5b6b60] mt-1 leading-relaxed">
                      {mod.overview}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-1 border-t border-[#eef2ee]">
                    {mod.lessonIds.map((lid) => {
                      const meta = LESSONS_META[lid];
                      const done = currentUser ? isLessonCompleted(db, currentUser.id, lid) : false;
                      const unlocked = currentUser ? isLessonUnlocked(db, currentUser, lid) : lid === '1.1';
                      const prog = currentUser ? getLessonProgress(db, currentUser.id, lid) : null;
                      const scoreObj =
                        prog && prog.done ? calculateLessonQuizScore(prog, lid) : null;

                      return (
                        <button
                          key={lid}
                          type="button"
                          onClick={() => onOpenLesson(lid)}
                          className="w-full text-left flex items-center justify-between gap-2 py-1.5 px-2.5 rounded-lg hover:bg-[#f4f7f4] transition-colors text-xs"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {done ? (
                              <CheckCircle2 className="h-4 w-4 text-[#2e8b4a] shrink-0" />
                            ) : unlocked ? (
                              <BookOpen className="h-4 w-4 text-[#1d4d2b] shrink-0" />
                            ) : (
                              <Lock className="h-3.5 w-3.5 text-[#9db3a3] shrink-0" />
                            )}
                            <span
                              className={`truncate ${
                                done
                                  ? 'font-semibold text-[#18261c]'
                                  : unlocked
                                  ? 'font-medium text-[#18261c]'
                                  : 'text-[#5b6b60]'
                              }`}
                            >
                              {meta.codeLabel}
                              {meta.altCodeLabel ? ` (${meta.altCodeLabel})` : ''} {meta.title}
                            </span>
                          </div>
                          <span className="text-[11px] font-mono tabular-nums text-[#5b6b60] shrink-0">
                            {scoreObj
                              ? `${scoreObj.score}/${scoreObj.total}`
                              : `0/${lid === '1.5' || lid === '2.6' ? 10 : 5}`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#eef2ee] flex items-center justify-between">
                  <span className="text-xs text-[#5b6b60] tabular-nums">
                    {currentUser
                      ? `${doneInMod}/${mod.lessonIds.length} lessons completed`
                      : 'Sequential Quiz Gating'}
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenLesson(firstLesson)}
                    className="text-xs font-bold text-[#1d4d2b] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Open {mod.code}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Column 3: Comprehensive Licensure Benchmark (Exams 1, 2, 3) */}
          <div className="rounded-xl bg-white border border-[#d5ded7] p-5 flex flex-col justify-between shadow-xs hover:border-[#7a1a12]/50 transition-colors">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#5b6b60]">
                <span className="font-bold text-[#7a1a12]">ASSESSMENT SUITE</span>
                <span>60 Items · 60 Mins</span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#18261c]">
                  Comprehensive Licensure Benchmark
                </h3>
                <p className="text-xs text-[#5b6b60] mt-1 leading-relaxed">
                  Timed 60-minute examinations drawing a unique randomized 1–60 question set per student attempt, with Previous/Next review and full answer keys.
                </p>
              </div>

              <div className="space-y-2.5 pt-1 border-t border-[#eef2ee]">
                {([1, 2, 3] as const).map((exNum) => {
                  const ex = EXAMS_CONFIG[exNum];
                  const userAttempts = currentUser
                    ? db.exams.filter((a) => a.uid === currentUser.id && a.examId === exNum)
                    : [];
                  const best = userAttempts.length
                    ? Math.max(...userAttempts.map((a) => a.score))
                    : null;

                  return (
                    <div
                      key={exNum}
                      onClick={() => onOpenExams(exNum)}
                      className="rounded-lg border border-[#e2e9e4] bg-[#f9fbf9] hover:bg-[#f1f6f2] p-3 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#1d4d2b]">{ex.code}</span>
                        <span className="text-[11px] font-mono tabular-nums text-[#5b6b60]">
                          {best !== null ? `Best: ${best}/60` : '60 Items · 60m'}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-[#18261c] mt-0.5 line-clamp-2">
                        {ex.fullTitle}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[#eef2ee] flex items-center justify-between">
              <span className="text-xs text-[#5b6b60]">New randomized set every retake</span>
              <button
                type="button"
                onClick={() => onOpenExams()}
                className="text-xs font-bold text-[#7a1a12] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Open Exam Center</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Dual Feature Banner (matching video 0:11) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="rounded-xl bg-[#1d4d2b] text-white p-6 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#d6b45f]">
            <GraduationCap className="h-4 w-4" />
            <span>For Pre-Service Teachers</span>
          </div>
          <h3 className="text-xl font-bold text-white">Empowering Student Autonomy</h3>
          <ul className="space-y-2 text-xs sm:text-sm text-white/90">
            <li>
              <strong className="text-[#d6b45f]">Sequential Mastery Gating:</strong> Complete each lesson’s Knowledge Check (1–5) to unlock the next module topic, with instant explanations and unlimited quiz resets.
            </li>
            <li>
              <strong className="text-[#d6b45f]">Randomized 60-Item Timed Exams:</strong> 60-minute simulated licensure exams with Previous/Next navigation, post-exam answer review, and fresh question sets on every retake.
            </li>
            <li>
              <strong className="text-[#d6b45f]">Diagnostic Focus Recommendations:</strong> Personalized Stats dashboard pinpointing which teaching methods or competencies require focused review.
            </li>
          </ul>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onNavigate('stats')}
              className="rounded-lg bg-white/15 hover:bg-white/25 text-white px-4 py-2 text-xs font-bold transition-colors cursor-pointer"
            >
              View Diagnostic Stats & Recommendations →
            </button>
          </div>
        </div>

        <div className="rounded-xl bg-[#18261c] text-white p-6 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#d6b45f]">
            <BarChart3 className="h-4 w-4" />
            <span>For Faculty & Cooperating Teachers</span>
          </div>
          <h3 className="text-xl font-bold text-white">Rigorous Teacher Analytics</h3>
          <ul className="space-y-2 text-xs sm:text-sm text-white/90">
            <li>
              <strong className="text-[#d6b45f]">Dual Time Telemetry:</strong> Track every student’s overall time spent on the platform alongside exact time consumed inside each examination.
            </li>
            <li>
              <strong className="text-[#d6b45f]">First-Take & Retake Audit Trail:</strong> Complete academic ledger preserving the student’s First Take score and every subsequent Retake score.
            </li>
            <li>
              <strong className="text-[#d6b45f]">Item-Level Paper Inspection:</strong> Faculty can inspect any student’s randomized 60-question exam script and topic-level competency breakdown.
            </li>
          </ul>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onNavigate('gradebook')}
              className="rounded-lg bg-[#d6b45f] hover:bg-[#c5a14a] text-[#18261c] px-4 py-2 text-xs font-bold transition-colors cursor-pointer"
            >
              Open Gradebook & Teacher Records →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
