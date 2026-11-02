import React from 'react';
import {
  LESSON_ORDER,
  LESSONS_META,
  MODULES_CONFIG,
  EXAMS_CONFIG,
  LessonId,
  getQuizQuestions,
  getExamQuestionByRef
} from '../data/curriculumMeta';
import {
  AppDatabase,
  UserAccount,
  getLessonProgress,
  isLessonCompleted,
  calculateLessonQuizScore,
  formatDurationHMS
} from '../data/store';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Award,
  ArrowRight,
  Compass,
  BookOpen,
  RotateCcw,
  TrendingUp
} from 'lucide-react';

interface StatsViewProps {
  db: AppDatabase;
  currentUser: UserAccount;
  onStudyLesson: (lid: LessonId) => void;
  onOpenExamReview: (attemptId: string) => void;
  onGoToExams: (examId?: 1 | 2 | 3) => void;
}

export const StatsView: React.FC<StatsViewProps> = ({
  db,
  currentUser,
  onStudyLesson,
  onOpenExamReview,
  onGoToExams
}) => {
  const myExams = db.exams.filter((e) => e.uid === currentUser.id);
  const totalExamSeconds = myExams.reduce((acc, e) => acc + e.durationSeconds, 0);

  // Module 1 & Module 2 completion %
  const mod1Done = MODULES_CONFIG[0].lessonIds.filter((id) =>
    isLessonCompleted(db, currentUser.id, id)
  ).length;
  const mod1Pct = Math.round((mod1Done / MODULES_CONFIG[0].lessonIds.length) * 100);

  const mod2Done = MODULES_CONFIG[1].lessonIds.filter((id) =>
    isLessonCompleted(db, currentUser.id, id)
  ).length;
  const mod2Pct = Math.round((mod2Done / MODULES_CONFIG[1].lessonIds.length) * 100);

  const totalDone = mod1Done + mod2Done;
  const overallMasteryPct = Math.round((totalDone / LESSON_ORDER.length) * 100);

  // Diagnostic computation per lesson (combining lesson Knowledge Check + Exam questions on that topic)
  const diagnostics = LESSON_ORDER.map((lid) => {
    const meta = LESSONS_META[lid];
    const prog = getLessonProgress(db, currentUser.id, lid);
    const qTotal = getQuizQuestions(lid).length;
    const quizScoreObj = prog.done ? calculateLessonQuizScore(prog, lid) : null;

    // Also check exam accuracy for this lesson topic across user's exam attempts
    let examTopicCorrect = 0;
    let examTopicTotal = 0;
    myExams.forEach((attempt) => {
      attempt.refs.forEach((ref, idx) => {
        const q = getExamQuestionByRef(ref);
        if (q.moduleRef === lid) {
          examTopicTotal += 1;
          if (attempt.answers[idx] === q.correctIndex) {
            examTopicCorrect += 1;
          }
        }
      });
    });

    const quizPct = quizScoreObj
      ? Math.round((quizScoreObj.score / quizScoreObj.total) * 100)
      : null;
    const examPct =
      examTopicTotal > 0 ? Math.round((examTopicCorrect / examTopicTotal) * 100) : null;

    let status: 'mastered' | 'review' | 'pending' = 'pending';
    let recommendation = '';

    if (!prog.done) {
      status = 'pending';
      recommendation = `Complete Lesson ${meta.codeLabel} reading & answer the ${qTotal}-item Knowledge Check to unlock diagnostic scoring.`;
    } else if ((quizPct !== null && quizPct < 80) || (examPct !== null && examPct < 75)) {
      status = 'review';
      recommendation = `Focus Recommended: Review ${meta.title} key principles and retake the Knowledge Check or Exam to raise accuracy above 80%.`;
    } else {
      status = 'mastered';
      recommendation = `Excellent grasp of ${meta.title} (${meta.codeLabel}). Ready for licensure-level scenario application.`;
    }

    return {
      lid,
      meta,
      done: prog.done,
      quizScore: quizScoreObj?.score ?? 0,
      quizTotal: qTotal,
      quizPct,
      examPct,
      examTopicCorrect,
      examTopicTotal,
      status,
      recommendation
    };
  });

  const masteredCount = diagnostics.filter((d) => d.status === 'mastered').length;
  const reviewCount = diagnostics.filter((d) => d.status === 'review').length;
  const pendingCount = diagnostics.filter((d) => d.status === 'pending').length;

  // Priority Focus Recommendations list
  const priorityFocusItems = diagnostics.filter(
    (d) => d.status === 'review' || d.status === 'pending'
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome & Telemetry Banner (matching video 0:24) */}
      <div className="rounded-xl bg-gradient-to-r from-[#143a20] to-[#1d4d2b] text-white p-6 shadow-md space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-[#d6b45f]">
              Pre-Service Teacher Readiness Telemetry
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome, {currentUser.name}
            </h1>
            <p className="text-xs sm:text-sm text-white/85">
              {currentUser.program} · ID: <span className="font-mono">{currentUser.sid}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="rounded-xl bg-black/25 border border-white/15 px-4 py-3 text-right">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#d6b45f]">
                Total Time Logged
              </div>
              <div className="text-xl sm:text-2xl font-extrabold font-mono text-white tabular-nums mt-0.5">
                {formatDurationHMS(currentUser.totalSeconds)}
              </div>
              <div className="text-[11px] text-white/75">Active platform study time</div>
            </div>

            <div className="rounded-xl bg-black/25 border border-white/15 px-4 py-3 text-right">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#d6b45f]">
                Exam Time Used
              </div>
              <div className="text-xl sm:text-2xl font-extrabold font-mono text-white tabular-nums mt-0.5">
                {formatDurationHMS(totalExamSeconds)}
              </div>
              <div className="text-[11px] text-white/75">
                Across {myExams.length} exam attempt{myExams.length === 1 ? '' : 's'}
              </div>
            </div>
          </div>
        </div>

        {/* 3 Progress Bars inside Banner (matching video 0:24) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-white/15">
          <div className="rounded-lg bg-white/10 p-3 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span>Overall PedagoReady Score</span>
              <span className="text-[#d6b45f] font-mono tabular-nums">{overallMasteryPct}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-black/30 overflow-hidden">
              <div
                className="h-full bg-[#2e8b4a]"
                style={{ width: `${overallMasteryPct}%` }}
              />
            </div>
          </div>

          <div className="rounded-lg bg-white/10 p-3 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span>Module 1: Teaching Methods</span>
              <span className="text-[#d6b45f] font-mono tabular-nums">{mod1Pct}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-black/30 overflow-hidden">
              <div className="h-full bg-[#2e8b4a]" style={{ width: `${mod1Pct}%` }} />
            </div>
          </div>

          <div className="rounded-lg bg-white/10 p-3 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span>Module 2: Practice-Teaching</span>
              <span className="text-[#d6b45f] font-mono tabular-nums">{mod2Pct}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-black/30 overflow-hidden">
              <div className="h-full bg-[#d6b45f]" style={{ width: `${mod2Pct}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Priority Study Focus Callout Box */}
      <div className="rounded-xl border border-[#e6c875] bg-[#fefaf0] p-5 space-y-3 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[#946200]">
            <TrendingUp className="h-5 w-5 text-[#b87d00]" />
            <span>Personalized Study Recommendation — Where You Must Focus Next</span>
          </div>
          <span className="text-xs font-semibold text-[#946200] tabular-nums">
            {masteredCount} Mastered · {reviewCount} Needs Review · {pendingCount} Pending
          </span>
        </div>

        {priorityFocusItems.length > 0 ? (
          <div className="space-y-2">
            <p className="text-xs sm:text-sm text-[#3d2c05]">
              Based on your Knowledge Check scores and timed exam accuracy, we recommend focusing on the following priority topics:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
              {priorityFocusItems.slice(0, 4).map((item) => (
                <div
                  key={item.lid}
                  className="rounded-lg bg-white border border-[#e6c875] p-3 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-extrabold text-[#18261c] truncate">
                      {item.meta.codeLabel}
                      {item.meta.altCodeLabel ? ` (${item.meta.altCodeLabel})` : ''}{' '}
                      {item.meta.title}
                    </div>
                    <div className="text-[11px] text-[#5b6b60] truncate">
                      {item.status === 'review'
                        ? `Needs Review (Quiz: ${item.quizScore}/${item.quizTotal}${
                            item.examPct !== null ? ` · Exam: ${item.examPct}%` : ''
                          })`
                        : 'Next unlocked/pending topic in sequence'}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onStudyLesson(item.lid)}
                    className="rounded-lg bg-[#1d4d2b] hover:bg-[#143a20] text-white px-3 py-1.5 text-xs font-bold shrink-0 cursor-pointer"
                  >
                    Focus Now →
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-xs sm:text-sm text-[#143a20] font-semibold">
            Congratulations! You have mastered all 11 lessons across Module 1 and Module 2. Challenge yourself with a fresh randomized 60-item retake on Exam 3!
          </p>
        )}
      </div>

      {/* Pedagogical Focus & Diagnostic Recommendations Grid (matching video 0:22-0:25) */}
      <div className="rounded-xl bg-white border border-[#d5ded7] p-5 sm:p-6 space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#eef2ee] pb-4">
          <div className="flex items-start gap-2.5">
            <Compass className="h-5 w-5 text-[#1d4d2b] shrink-0 mt-0.5" />
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-[#18261c]">
                Pedagogical Focus &amp; Diagnostic Recommendations
              </h2>
              <p className="text-xs text-[#5b6b60]">
                Automated analysis of your quiz mastery, exam accuracy, and recommended study priorities
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold text-[#5b6b60] tabular-nums">
            <span className="text-[#2e8b4a]">✓ {masteredCount} Mastered</span>
            <span>·</span>
            <span className="text-[#b87d00]">! {reviewCount} Needs Review</span>
            <span>·</span>
            <span>• {pendingCount} Pending</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {diagnostics.map((d) => {
            const topColor =
              d.status === 'mastered'
                ? 'border-t-4 border-t-[#2e8b4a]'
                : d.status === 'review'
                ? 'border-t-4 border-t-[#d6b45f]'
                : 'border-t-4 border-t-[#b8c4bb]';

            return (
              <div
                key={d.lid}
                className={`rounded-xl border border-[#d5ded7] bg-[#fcfdfc] p-4 flex flex-col justify-between gap-3 ${topColor}`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-bold text-[#5b6b60]">
                      MODULE {d.meta.moduleNum} · {d.meta.codeLabel}
                      {d.meta.altCodeLabel ? ` (${d.meta.altCodeLabel})` : ''}
                    </span>
                    <span
                      className={`font-mono font-bold tabular-nums ${
                        d.status === 'mastered'
                          ? 'text-[#2e8b4a]'
                          : d.status === 'review'
                          ? 'text-[#b87d00]'
                          : 'text-[#5b6b60]'
                      }`}
                    >
                      {d.done
                        ? `${d.quizScore}/${d.quizTotal} (${d.quizPct}%)`
                        : 'Not Started'}
                    </span>
                  </div>

                  <h3 className="text-sm font-extrabold text-[#18261c]">
                    {d.status === 'mastered'
                      ? `Mastered: ${d.meta.title}`
                      : d.status === 'review'
                      ? `Focus Area: ${d.meta.title}`
                      : `Pending: ${d.meta.title}`}
                  </h3>

                  <p className="text-xs text-[#5b6b60] leading-relaxed">
                    {d.recommendation}
                  </p>

                  {d.examTopicTotal > 0 && (
                    <div className="text-[11px] font-mono text-[#1d4d2b] bg-[#eef2ee] rounded px-2 py-1">
                      Exam Topic Accuracy: {d.examTopicCorrect}/{d.examTopicTotal} ({d.examPct}%)
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-[#eef2ee]">
                  <button
                    type="button"
                    onClick={() => onStudyLesson(d.lid)}
                    className="text-xs font-extrabold text-[#1d4d2b] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Study Module Topic</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Exam Records & Retake History Table (matching video 0:23) */}
      <div className="rounded-xl bg-white border border-[#d5ded7] p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-[#18261c]">
              Exam Records &amp; Retake History
            </h2>
            <p className="text-xs text-[#5b6b60]">
              Complete record of your First Take and all subsequent Retakes across Exam 1, Exam 2, and Exam 3
            </p>
          </div>
          <button
            type="button"
            onClick={() => onGoToExams()}
            className="rounded-lg bg-[#1d4d2b] hover:bg-[#143a20] text-white px-4 py-2 text-xs font-bold cursor-pointer"
          >
            Take / Retake an Exam →
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg border border-[#d5ded7]">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#f4f7f4] text-[#5b6b60] border-b border-[#d5ded7]">
                <th className="py-2.5 px-3.5 font-bold">Examination Title</th>
                <th className="py-2.5 px-3.5 font-bold">Attempt Type</th>
                <th className="py-2.5 px-3.5 font-bold">Score / 60</th>
                <th className="py-2.5 px-3.5 font-bold">Time Consumed</th>
                <th className="py-2.5 px-3.5 font-bold">Date</th>
                <th className="py-2.5 px-3.5 font-bold text-right">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eef2ee]">
              {myExams.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 px-4 text-center text-xs text-[#5b6b60]">
                    No timed exams completed yet. Start Exam 1, Exam 2, or Exam 3 to record your benchmark score.
                  </td>
                </tr>
              ) : (
                myExams
                  .slice()
                  .reverse()
                  .map((ex) => {
                    const cfg = EXAMS_CONFIG[ex.examId];
                    const pct = Math.round((ex.score / ex.total) * 100);
                    return (
                      <tr key={ex.id} className="hover:bg-[#f9fbf9]">
                        <td className="py-3 px-3.5 font-bold text-[#18261c]">
                          {cfg.shortTitle}
                        </td>
                        <td className="py-3 px-3.5 font-semibold text-[#1d4d2b]">
                          {ex.attemptNumber === 1
                            ? 'First Take (#1)'
                            : `Retake #${ex.attemptNumber - 1} (Attempt #${ex.attemptNumber})`}
                        </td>
                        <td className="py-3 px-3.5 font-mono font-bold text-[#18261c] tabular-nums">
                          {ex.score} / {ex.total} ({pct}%)
                        </td>
                        <td className="py-3 px-3.5 font-mono text-[#5b6b60] tabular-nums">
                          {formatDurationHMS(ex.durationSeconds)}
                        </td>
                        <td className="py-3 px-3.5 text-xs text-[#5b6b60] tabular-nums">
                          {new Date(ex.endedAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => onOpenExamReview(ex.id)}
                            className="font-bold text-[#1d4d2b] hover:underline cursor-pointer"
                          >
                            Review Answers →
                          </button>
                        </td>
                      </tr>
                    );
                  })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Earned Competency Badges & Credentials (matching video 0:23) */}
      <div className="rounded-xl bg-white border border-[#d5ded7] p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-[#d6b45f]" />
          <h2 className="text-base sm:text-lg font-extrabold text-[#18261c]">
            Earned Competency Badges &amp; Credentials
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className={`rounded-xl border p-4 flex items-center gap-3.5 ${
              isLessonCompleted(db, currentUser.id, '1.1')
                ? 'border-[#2e8b4a]/40 bg-[#f2fbf4]'
                : 'border-[#d5ded7] bg-[#f8faf8] opacity-60'
            }`}
          >
            <div className="h-10 w-10 rounded-lg bg-[#1d4d2b] text-[#d6b45f] flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#18261c]">CLT Practitioner Badge</div>
              <div className="text-xs text-[#5b6b60]">
                {isLessonCompleted(db, currentUser.id, '1.1')
                  ? 'Unlocked · Communicative Language Teaching'
                  : 'Complete Lesson 1.1 Knowledge Check'}
              </div>
            </div>
          </div>

          <div
            className={`rounded-xl border p-4 flex items-center gap-3.5 ${
              mod1Pct === 100
                ? 'border-[#2e8b4a]/40 bg-[#f2fbf4]'
                : 'border-[#d5ded7] bg-[#f8faf8] opacity-60'
            }`}
          >
            <div className="h-10 w-10 rounded-lg bg-[#1d4d2b] text-[#d6b45f] flex items-center justify-center shrink-0">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#18261c]">
                Teaching Methods Specialist
              </div>
              <div className="text-xs text-[#5b6b60]">
                {mod1Pct === 100
                  ? 'Unlocked · Completed Module 1 (1.1–1.5)'
                  : `In Progress (${mod1Pct}% of Module 1)`}
              </div>
            </div>
          </div>

          <div
            className={`rounded-xl border p-4 flex items-center gap-3.5 ${
              myExams.some((e) => e.score >= 45)
                ? 'border-[#2e8b4a]/40 bg-[#f2fbf4]'
                : 'border-[#d5ded7] bg-[#f8faf8] opacity-60'
            }`}
          >
            <div className="h-10 w-10 rounded-lg bg-[#7a1a12] text-[#d6b45f] flex items-center justify-center shrink-0">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#18261c]">
                Licensure Benchmark Ready
              </div>
              <div className="text-xs text-[#5b6b60]">
                {myExams.some((e) => e.score >= 45)
                  ? 'Unlocked · Scored 75%+ on 60-Item Exam'
                  : 'Score at least 45/60 (75%) on any Timed Exam'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
