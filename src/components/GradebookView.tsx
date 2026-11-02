import React, { useState } from 'react';
import {
  LESSON_ORDER,
  LESSONS_META,
  EXAMS_CONFIG,
  getQuizQuestions,
  LessonId
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
  Users,
  Clock,
  FileSpreadsheet,
  ArrowLeft,
  Eye,
  GraduationCap,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface GradebookViewProps {
  db: AppDatabase;
  currentUser: UserAccount;
  onOpenExamReview: (attemptId: string) => void;
  onSelectLesson: (lid: LessonId) => void;
}

export const GradebookView: React.FC<GradebookViewProps> = ({
  db,
  currentUser,
  onOpenExamReview,
  onSelectLesson
}) => {
  // Allow teachers to view full cohort OR inspect individual student; also allow students to toggle Faculty Preview as shown in the video ("Switch to Faculty / Teacher View")
  const [viewMode, setViewMode] = useState<'student' | 'teacher'>(
    currentUser.role === 'teacher' ? 'teacher' : 'student'
  );
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [examFilter, setExamFilter] = useState<'all' | 1 | 2 | 3>('all');

  const students = db.users.filter((u) => u.role === 'student');

  // Helper to render a single student's Academic Performance Ledger (used both for Student's own Gradebook and Teacher's Student Dossier)
  const renderStudentLedger = (student: UserAccount, isTeacherInspecting: boolean) => {
    const studentExams = db.exams.filter((e) => e.uid === student.id);
    const totalExamTime = studentExams.reduce((acc, e) => acc + e.durationSeconds, 0);
    const completedLessons = LESSON_ORDER.filter((lid) =>
      isLessonCompleted(db, student.id, lid)
    ).length;

    return (
      <div className="space-y-6">
        {isTeacherInspecting && (
          <button
            type="button"
            onClick={() => setSelectedStudentId(null)}
            className="rounded-lg border-2 border-[#1d4d2b] text-[#1d4d2b] hover:bg-[#e3f4e7] px-4 py-2 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to All Students Cohort Roster</span>
          </button>
        )}

        {/* Header Card */}
        <div className="rounded-xl bg-white border border-[#d5ded7] p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#eef2ee] pb-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#1d4d2b]">
                Official Academic Record Book
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#18261c] mt-0.5">
                Academic Performance Ledger — {student.name}
              </h1>
              <p className="text-xs text-[#5b6b60] mt-0.5">
                ID: <span className="font-mono font-semibold">{student.sid}</span> · {student.program} · {student.yearLevel}
              </p>
            </div>

            {!isTeacherInspecting && (
              <button
                type="button"
                onClick={() =>
                  setViewMode(viewMode === 'student' ? 'teacher' : 'student')
                }
                className="rounded-lg border border-[#1d4d2b] bg-[#f4f7f4] hover:bg-[#e3f4e7] text-[#1d4d2b] px-3.5 py-2 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Switch to Faculty / Teacher Cohort View</span>
              </button>
            )}
          </div>

          {/* Time & Completion Summary Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl bg-[#f4f7f4] border border-[#d5ded7] p-4">
              <div className="text-xs font-semibold text-[#5b6b60]">
                Overall Time Consumed on Platform
              </div>
              <div className="text-xl font-extrabold font-mono text-[#1d4d2b] tabular-nums mt-1">
                {formatDurationHMS(student.totalSeconds)}
              </div>
            </div>

            <div className="rounded-xl bg-[#f4f7f4] border border-[#d5ded7] p-4">
              <div className="text-xs font-semibold text-[#5b6b60]">
                Total Time Consumed in Exams
              </div>
              <div className="text-xl font-extrabold font-mono text-[#7a1a12] tabular-nums mt-1">
                {formatDurationHMS(totalExamTime)}
              </div>
            </div>

            <div className="rounded-xl bg-[#f4f7f4] border border-[#d5ded7] p-4">
              <div className="text-xs font-semibold text-[#5b6b60]">
                Modules &amp; Quizzes Completed
              </div>
              <div className="text-xl font-extrabold font-mono text-[#18261c] tabular-nums mt-1">
                {completedLessons} / {LESSON_ORDER.length} Lessons
              </div>
            </div>
          </div>

          {/* Formative Knowledge Checks Grid (matching video 0:26-0:27) */}
          <div className="space-y-3 pt-2">
            <div className="text-xs font-extrabold uppercase tracking-wider text-[#5b6b60]">
              Formative Knowledge Checks (5-Item &amp; 10-Item Module Quizzes)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {LESSON_ORDER.map((lid) => {
                const meta = LESSONS_META[lid];
                const prog = getLessonProgress(db, student.id, lid);
                const qLen = getQuizQuestions(lid).length;
                const scObj = prog.done ? calculateLessonQuizScore(prog, lid) : null;
                const latestHistory = prog.history[prog.history.length - 1];

                return (
                  <div
                    key={lid}
                    onClick={() => onSelectLesson(lid)}
                    className="rounded-lg border border-[#d5ded7] bg-[#fcfdfc] hover:border-[#1d4d2b] p-3.5 cursor-pointer transition-colors space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#18261c]">
                        Topic {meta.codeLabel}
                        {meta.altCodeLabel ? ` (${meta.altCodeLabel})` : ''}
                      </span>
                      <span
                        className={`text-xs font-mono font-bold tabular-nums ${
                          prog.done ? 'text-[#2e8b4a]' : 'text-[#5b6b60]'
                        }`}
                      >
                        {scObj
                          ? `${scObj.score}/${scObj.total} (${Math.round(
                              (scObj.score / scObj.total) * 100
                            )}%)`
                          : `0/${qLen}`}
                      </span>
                    </div>
                    <div className="text-xs text-[#5b6b60] truncate">{meta.title}</div>
                    <div className="text-[11px] text-[#5b6b60] flex items-center justify-between pt-1">
                      <span>
                        {latestHistory
                          ? `Completed ${new Date(latestHistory.completedAt).toLocaleDateString()}`
                          : 'Pending'}
                      </span>
                      <span>Attempts: {prog.history.length}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summative 60-Item Licensure Examinations (First Take & All Retakes) */}
          <div className="space-y-3 pt-4 border-t border-[#eef2ee]">
            <div className="text-xs font-extrabold uppercase tracking-wider text-[#5b6b60]">
              60-Item Licensure Examinations (First Take &amp; Retake Ledger)
            </div>

            <div className="overflow-x-auto rounded-lg border border-[#d5ded7]">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[#1d4d2b] text-white">
                    <th className="py-2.5 px-3.5 font-semibold">Examination</th>
                    <th className="py-2.5 px-3.5 font-semibold">Attempt Record</th>
                    <th className="py-2.5 px-3.5 font-semibold">Score / 60</th>
                    <th className="py-2.5 px-3.5 font-semibold">Percentage</th>
                    <th className="py-2.5 px-3.5 font-semibold">Time Consumed</th>
                    <th className="py-2.5 px-3.5 font-semibold">Status</th>
                    <th className="py-2.5 px-3.5 font-semibold">Timestamp</th>
                    <th className="py-2.5 px-3.5 font-semibold text-right">Paper Review</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eef2ee]">
                  {studentExams.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-6 px-4 text-center text-xs text-[#5b6b60]">
                        No exam attempts recorded for {student.name} yet.
                      </td>
                    </tr>
                  ) : (
                    studentExams.map((ex) => {
                      const cfg = EXAMS_CONFIG[ex.examId];
                      const pct = Math.round((ex.score / ex.total) * 100);
                      const passed = pct >= 75;
                      return (
                        <tr key={ex.id} className="hover:bg-[#f8faf8]">
                          <td className="py-2.5 px-3.5 font-bold text-[#18261c]">
                            {cfg.shortTitle}
                          </td>
                          <td className="py-2.5 px-3.5 font-bold">
                            {ex.attemptNumber === 1 ? (
                              <span className="text-[#1d4d2b]">FIRST TAKE (#1)</span>
                            ) : (
                              <span className="text-[#7a1a12]">
                                RETAKE #{ex.attemptNumber - 1} (Attempt #{ex.attemptNumber})
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3.5 font-mono font-bold text-[#18261c] tabular-nums">
                            {ex.score} / {ex.total}
                          </td>
                          <td className="py-2.5 px-3.5 font-mono font-bold tabular-nums">
                            {pct}%
                          </td>
                          <td className="py-2.5 px-3.5 font-mono text-[#5b6b60] tabular-nums">
                            {formatDurationHMS(ex.durationSeconds)}
                          </td>
                          <td className="py-2.5 px-3.5 font-bold">
                            <span className={passed ? 'text-[#2e8b4a]' : 'text-[#b3392e]'}>
                              {passed ? '✓ PASSED' : 'NEEDS REVIEW'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3.5 text-xs text-[#5b6b60] tabular-nums">
                            {new Date(ex.endedAt).toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3.5 text-right">
                            <button
                              type="button"
                              onClick={() => onOpenExamReview(ex.id)}
                              className="font-bold text-[#1d4d2b] hover:underline cursor-pointer"
                            >
                              Inspect Paper →
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
        </div>
      </div>
    );
  };

  // If in Student mode, show current user's ledger
  if (viewMode === 'student' && currentUser.role === 'student') {
    return renderStudentLedger(currentUser, false);
  }

  // If Teacher selected a specific student to inspect
  if (selectedStudentId) {
    const targetStudent = db.users.find((u) => u.id === selectedStudentId);
    if (targetStudent) {
      return renderStudentLedger(targetStudent, true);
    }
  }

  // TEACHER / ADMIN COHORT ANALYTICS & FULL TIME/SCORE TRACKING VIEW
  const totalCohortPlatformSeconds = students.reduce((acc, s) => acc + s.totalSeconds, 0);
  const totalCohortExamSeconds = db.exams.reduce((acc, e) => acc + e.durationSeconds, 0);
  const avgExamScore =
    db.exams.length > 0
      ? Math.round(
          (db.exams.reduce((acc, e) => acc + (e.score / e.total) * 100, 0) /
            db.exams.length) *
            10
        ) / 10
      : 0;

  const filteredAllExams = db.exams.filter((e) =>
    examFilter === 'all' ? true : e.examId === examFilter
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Top Faculty Analytics Header */}
      <div className="rounded-xl bg-[#1d4d2b] text-white p-6 shadow-md space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#d6b45f]">
              Faculty &amp; Cooperating Teacher Console
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
              Student Time Telemetry &amp; Examination Records
            </h1>
            <p className="text-xs sm:text-sm text-white/85 mt-0.5">
              Track every student’s overall platform study time, exam time consumed, module progress, First Take scores, and all Retake scores.
            </p>
          </div>

          {currentUser.role === 'student' && (
            <button
              type="button"
              onClick={() => setViewMode('student')}
              className="rounded-lg bg-[#d6b45f] text-[#18261c] px-4 py-2 text-xs font-extrabold cursor-pointer"
            >
              ← Return to My Student Ledger
            </button>
          )}
        </div>

        {/* 4 Summary KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <div className="rounded-xl bg-black/25 border border-white/15 p-3.5">
            <div className="text-[11px] font-semibold text-[#d6b45f]">Enrolled Students</div>
            <div className="text-2xl font-extrabold font-mono text-white tabular-nums mt-0.5">
              {students.length}
            </div>
            <div className="text-[11px] text-white/75">Active Pre-Service Cohort</div>
          </div>

          <div className="rounded-xl bg-black/25 border border-white/15 p-3.5">
            <div className="text-[11px] font-semibold text-[#d6b45f]">
              Cohort Overall Study Time
            </div>
            <div className="text-2xl font-extrabold font-mono text-white tabular-nums mt-0.5">
              {formatDurationHMS(totalCohortPlatformSeconds)}
            </div>
            <div className="text-[11px] text-white/75">Combined platform time</div>
          </div>

          <div className="rounded-xl bg-black/25 border border-white/15 p-3.5">
            <div className="text-[11px] font-semibold text-[#d6b45f]">
              Cohort Exam Time Consumed
            </div>
            <div className="text-2xl font-extrabold font-mono text-white tabular-nums mt-0.5">
              {formatDurationHMS(totalCohortExamSeconds)}
            </div>
            <div className="text-[11px] text-white/75">
              Across {db.exams.length} total exam takes
            </div>
          </div>

          <div className="rounded-xl bg-black/25 border border-white/15 p-3.5">
            <div className="text-[11px] font-semibold text-[#d6b45f]">
              Average Exam Score
            </div>
            <div className="text-2xl font-extrabold font-mono text-white tabular-nums mt-0.5">
              {avgExamScore}%
            </div>
            <div className="text-[11px] text-white/75">75% Licensure Benchmark</div>
          </div>
        </div>
      </div>

      {/* Table 1: Student Roster with Overall Time, Exam Time, First Take & Retake Summary */}
      <div className="rounded-xl bg-white border border-[#d5ded7] p-5 sm:p-6 space-y-4 shadow-xs">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-[#18261c]">
            Student Roster — Overall Time, Exam Time &amp; Score Summary
          </h2>
          <p className="text-xs text-[#5b6b60]">
            Click "Inspect Student Record" on any student to view their individual quiz scores and complete First Take &amp; Retake history.
          </p>
        </div>

        <div className="overflow-x-auto rounded-lg border border-[#d5ded7]">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#1d4d2b] text-white">
                <th className="py-3 px-3.5 font-semibold">Student Name</th>
                <th className="py-3 px-3.5 font-semibold">Student ID</th>
                <th className="py-3 px-3.5 font-semibold">Overall Time Consumed</th>
                <th className="py-3 px-3.5 font-semibold">Time Consumed in Exams</th>
                <th className="py-3 px-3.5 font-semibold">Modules Done</th>
                <th className="py-3 px-3.5 font-semibold">First Take Scores</th>
                <th className="py-3 px-3.5 font-semibold">Retake Scores</th>
                <th className="py-3 px-3.5 font-semibold text-right">Dossier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eef2ee]">
              {students.map((st) => {
                const stExams = db.exams.filter((e) => e.uid === st.id);
                const stExamSeconds = stExams.reduce((acc, e) => acc + e.durationSeconds, 0);
                const doneMods = LESSON_ORDER.filter((lid) =>
                  isLessonCompleted(db, st.id, lid)
                ).length;

                const firstTakes = stExams.filter((e) => e.attemptNumber === 1);
                const retakes = stExams.filter((e) => e.attemptNumber > 1);

                return (
                  <tr key={st.id} className="hover:bg-[#f8faf8]">
                    <td className="py-3 px-3.5">
                      <div className="font-bold text-[#18261c]">{st.name}</div>
                      <div className="text-[11px] text-[#5b6b60]">{st.program}</div>
                    </td>
                    <td className="py-3 px-3.5 font-mono font-semibold text-[#18261c] tabular-nums">
                      {st.sid}
                    </td>
                    <td className="py-3 px-3.5 font-mono font-bold text-[#1d4d2b] tabular-nums">
                      {formatDurationHMS(st.totalSeconds)}
                    </td>
                    <td className="py-3 px-3.5 font-mono font-bold text-[#7a1a12] tabular-nums">
                      {formatDurationHMS(stExamSeconds)}
                    </td>
                    <td className="py-3 px-3.5 font-mono tabular-nums">
                      {doneMods}/{LESSON_ORDER.length}
                    </td>
                    <td className="py-3 px-3.5 font-mono text-xs tabular-nums">
                      {firstTakes.length === 0
                        ? 'None'
                        : firstTakes
                            .map((f) => `Ex${f.examId}: ${f.score}/${f.total}`)
                            .join(' · ')}
                    </td>
                    <td className="py-3 px-3.5 font-mono text-xs tabular-nums">
                      {retakes.length === 0
                        ? 'No retakes'
                        : retakes
                            .map(
                              (r) =>
                                `Ex${r.examId} (R#${r.attemptNumber - 1}): ${r.score}/${r.total}`
                            )
                            .join(' · ')}
                    </td>
                    <td className="py-3 px-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedStudentId(st.id)}
                        className="rounded-lg bg-[#1d4d2b] hover:bg-[#143a20] text-white px-3 py-1.5 text-xs font-bold cursor-pointer"
                      >
                        Inspect Record →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table 2: Complete Master Log of All First Takes & All Retakes Across Every Student */}
      <div className="rounded-xl bg-white border border-[#d5ded7] p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-[#18261c]">
              Complete Examination Log (All First Takes &amp; All Retakes)
            </h2>
            <p className="text-xs text-[#5b6b60]">
              Chronological audit trail of every student’s first attempt and every subsequent retake
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-[#eef2ee] rounded-lg">
            {(['all', 1, 2, 3] as const).map((f) => (
              <button
                key={String(f)}
                type="button"
                onClick={() => setExamFilter(f)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                  examFilter === f
                    ? 'bg-[#1d4d2b] text-white'
                    : 'text-[#5b6b60] hover:text-[#18261c]'
                }`}
              >
                {f === 'all' ? 'All Exams' : `Exam ${f}`}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-[#d5ded7]">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#f4f7f4] text-[#5b6b60] border-b border-[#d5ded7]">
                <th className="py-2.5 px-3.5 font-bold">Student</th>
                <th className="py-2.5 px-3.5 font-bold">Exam Title</th>
                <th className="py-2.5 px-3.5 font-bold">Attempt Type</th>
                <th className="py-2.5 px-3.5 font-bold">Score</th>
                <th className="py-2.5 px-3.5 font-bold">Exam Time Consumed</th>
                <th className="py-2.5 px-3.5 font-bold">Date &amp; Time</th>
                <th className="py-2.5 px-3.5 font-bold text-right">Questionnaire</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eef2ee]">
              {filteredAllExams
                .slice()
                .reverse()
                .map((ex) => {
                  const st = db.users.find((u) => u.id === ex.uid);
                  const cfg = EXAMS_CONFIG[ex.examId];
                  const pct = Math.round((ex.score / ex.total) * 100);
                  return (
                    <tr key={ex.id} className="hover:bg-[#f9fbf9]">
                      <td className="py-2.5 px-3.5 font-bold text-[#18261c]">
                        {st?.name || 'Student'}{' '}
                        <span className="font-mono text-xs text-[#5b6b60]">
                          ({st?.sid})
                        </span>
                      </td>
                      <td className="py-2.5 px-3.5 font-semibold text-[#18261c]">
                        {cfg.shortTitle}
                      </td>
                      <td className="py-2.5 px-3.5 font-bold">
                        {ex.attemptNumber === 1 ? (
                          <span className="text-[#1d4d2b]">First Take (#1)</span>
                        ) : (
                          <span className="text-[#7a1a12]">
                            Retake #{ex.attemptNumber - 1} (Attempt #{ex.attemptNumber})
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3.5 font-mono font-bold text-[#18261c] tabular-nums">
                        {ex.score}/{ex.total} ({pct}%)
                      </td>
                      <td className="py-2.5 px-3.5 font-mono text-[#7a1a12] font-semibold tabular-nums">
                        {formatDurationHMS(ex.durationSeconds)}
                      </td>
                      <td className="py-2.5 px-3.5 text-xs text-[#5b6b60] tabular-nums">
                        {new Date(ex.endedAt).toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => onOpenExamReview(ex.id)}
                          className="font-bold text-[#1d4d2b] hover:underline cursor-pointer"
                        >
                          View Paper →
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
