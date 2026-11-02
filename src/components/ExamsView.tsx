import React, { useState } from 'react';
import {
  EXAMS_CONFIG,
  getExamQuestionByRef,
  LessonId
} from '../data/curriculumMeta';
import {
  AppDatabase,
  UserAccount,
  ActiveExamSession,
  ExamAttemptRecord,
  formatDurationHMS,
  formatCountdownMMSS
} from '../data/store';
import {
  Clock,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Play,
  FileCheck2,
  AlertTriangle,
  Grid,
  BookOpen
} from 'lucide-react';

interface ExamsViewProps {
  db: AppDatabase;
  currentUser: UserAccount;
  mode: 'hub' | 'taking' | 'review';
  reviewAttemptId: string | null;
  onStartExam: (examId: 1 | 2 | 3, forceNewSet?: boolean) => void;
  onSelectAnswer: (optionIdx: number) => void;
  onNavigateQuestion: (newIndex: number) => void;
  onSubmitExam: () => void;
  onOpenReview: (attemptId: string) => void;
  onBackToHub: () => void;
  onStudyLesson: (lid: LessonId) => void;
}

export const ExamsView: React.FC<ExamsViewProps> = ({
  db,
  currentUser,
  mode,
  reviewAttemptId,
  onStartExam,
  onSelectAnswer,
  onNavigateQuestion,
  onSubmitExam,
  onOpenReview,
  onBackToHub,
  onStudyLesson
}) => {
  const [showNavigator, setShowNavigator] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [confirmFinishModal, setConfirmFinishModal] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'wrong' | 'correct'>('all');

  const activeSession: ActiveExamSession | undefined = db.activeExams[currentUser.id];

  // 1. ACTIVE EXAM SIMULATOR VIEW
  if (mode === 'taking' && activeSession) {
    const examCfg = EXAMS_CONFIG[activeSession.examId];
    const currentIdx = activeSession.currentIndex;
    const totalCount = activeSession.refs.length;
    const currentRef = activeSession.refs[currentIdx];
    const currentQ = getExamQuestionByRef(currentRef);
    const chosenAnswer = activeSession.answers[currentIdx];
    const answeredCount = activeSession.answers.filter((a) => a != null).length;
    const remainingSeconds = Math.max(
      0,
      examCfg.durationSeconds - activeSession.elapsedSeconds
    );
    const isLastQuestion = currentIdx === totalCount - 1;

    const handleNextOrSubmit = () => {
      if (chosenAnswer == null) {
        setValidationMessage('Please select an answer choice (A, B, C, or D) before proceeding.');
        return;
      }
      setValidationMessage('');
      if (isLastQuestion) {
        setConfirmFinishModal(true);
      } else {
        onNavigateQuestion(currentIdx + 1);
      }
    };

    const handlePrev = () => {
      setValidationMessage('');
      if (currentIdx > 0) {
        onNavigateQuestion(currentIdx - 1);
      }
    };

    return (
      <div className="max-w-4xl mx-auto space-y-5 pb-12">
        {/* Top Sticky Exam Telemetry Bar */}
        <div className="rounded-xl bg-[#1d4d2b] text-white p-4 sm:p-5 shadow-md space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#d6b45f]">
                {examCfg.code} · Personalized Randomized Questionnaire
              </div>
              <h1 className="text-base sm:text-lg font-extrabold text-white mt-0.5">
                {examCfg.fullTitle}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`rounded-lg px-3.5 py-2 font-mono font-extrabold text-sm sm:text-base tabular-nums flex items-center gap-2 ${
                  remainingSeconds <= 300
                    ? 'bg-[#b3392e] text-white'
                    : 'bg-[#7a1a12] text-white'
                }`}
              >
                <Clock className="h-4 w-4 text-[#d6b45f]" />
                <span>{formatCountdownMMSS(remainingSeconds)}</span>
              </div>
              <button
                type="button"
                onClick={onBackToHub}
                className="rounded-lg bg-white/10 hover:bg-white/20 px-3 py-2 text-xs font-bold text-white transition-colors cursor-pointer"
              >
                Save &amp; Pause
              </button>
            </div>
          </div>

          {/* Progress Bar & Item Counter */}
          <div className="space-y-1.5 pt-1">
            <div className="flex flex-wrap items-center justify-between text-xs text-white/90 gap-2">
              <span className="font-bold tabular-nums">
                Question {currentIdx + 1} of {totalCount}
              </span>
              <div className="flex items-center gap-4">
                <span className="tabular-nums">
                  Answered: <strong>{answeredCount}</strong> / {totalCount}
                </span>
                <button
                  type="button"
                  onClick={() => setShowNavigator(!showNavigator)}
                  className="underline font-bold text-[#d6b45f] flex items-center gap-1 cursor-pointer"
                >
                  <Grid className="h-3.5 w-3.5" />
                  <span>{showNavigator ? 'Hide Item Grid' : 'Jump / Change Any Answer'}</span>
                </button>
              </div>
            </div>
            <div className="h-2 w-full rounded-full bg-black/30 overflow-hidden">
              <div
                className="h-full bg-[#d6b45f] transition-all duration-200"
                style={{ width: `${((currentIdx + 1) / totalCount) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Collapsible 1-60 Item Navigator Grid */}
        {showNavigator && (
          <div className="rounded-xl bg-white border border-[#d5ded7] p-4 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-bold text-[#18261c]">
                Randomized Question Navigator (1–{totalCount}) — Click any number to review or change your answer
              </span>
              <span className="text-[#5b6b60]">
                Green = Answered · Gold Ring = Current Question
              </span>
            </div>
            <div className="grid grid-cols-10 sm:grid-cols-12 md:grid-cols-15 gap-1.5">
              {activeSession.refs.map((_, idx) => {
                const isAns = activeSession.answers[idx] != null;
                const isCur = idx === currentIdx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setValidationMessage('');
                      onNavigateQuestion(idx);
                    }}
                    className={`h-8 rounded-md font-mono text-xs font-bold tabular-nums transition-colors cursor-pointer ${
                      isCur
                        ? 'bg-[#1d4d2b] text-[#d6b45f] ring-2 ring-[#d6b45f]'
                        : isAns
                        ? 'bg-[#e3f4e7] text-[#143a20] border border-[#2e8b4a]/40 hover:bg-[#d2ecd8]'
                        : 'bg-[#f4f7f4] text-[#5b6b60] border border-[#d5ded7] hover:bg-[#e5ece6]'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Active Question Card */}
        <div className="rounded-xl bg-white border border-[#d5ded7] p-5 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#eef2ee] pb-3 text-xs text-[#5b6b60]">
            <span className="font-bold text-[#1d4d2b]">
              ITEM #{currentIdx + 1} OF {totalCount}
            </span>
            <span>Topic Area: {currentQ.topicTag}</span>
          </div>

          <h2 className="text-base sm:text-xl font-bold text-[#18261c] leading-relaxed">
            {currentIdx + 1}. {currentQ.question}
          </h2>

          <div className="space-y-3">
            {currentQ.options.map((optText, oIdx) => {
              const letter = ['A', 'B', 'C', 'D'][oIdx];
              const isSelected = chosenAnswer === oIdx;
              return (
                <button
                  key={oIdx}
                  type="button"
                  onClick={() => {
                    setValidationMessage('');
                    onSelectAnswer(oIdx);
                  }}
                  className={`w-full text-left rounded-xl border-2 px-4 py-3.5 text-sm sm:text-base transition-colors flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? 'border-[#1d4d2b] bg-[#e3f4e7] text-[#143a20] font-bold shadow-xs'
                      : 'border-[#d5ded7] bg-white hover:border-[#1d4d2b]/60 text-[#18261c]'
                  }`}
                >
                  <span
                    className={`h-6 w-6 rounded-md font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-[#1d4d2b] text-white'
                        : 'bg-[#eef2ee] text-[#18261c]'
                    }`}
                  >
                    {letter}
                  </span>
                  <span className="leading-relaxed">{optText}</span>
                </button>
              );
            })}
          </div>

          {validationMessage && (
            <div className="rounded-lg bg-[#fbe6e4] border border-[#b3392e]/30 px-4 py-2.5 text-xs font-bold text-[#b3392e] flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{validationMessage}</span>
            </div>
          )}

          {/* Previous & Submit/Next Controls */}
          <div className="pt-4 border-t border-[#eef2ee] flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              disabled={currentIdx === 0}
              onClick={handlePrev}
              className="rounded-xl border-2 border-[#1d4d2b] text-[#1d4d2b] hover:bg-[#e3f4e7] disabled:opacity-40 disabled:cursor-not-allowed px-5 py-2.5 text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Previous Question</span>
            </button>

            <div className="flex items-center gap-2.5">
              {answeredCount === totalCount && !isLastQuestion && (
                <button
                  type="button"
                  onClick={() => setConfirmFinishModal(true)}
                  className="rounded-xl bg-[#7a1a12] hover:bg-[#5f130d] text-white px-4 py-2.5 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
                >
                  Finish &amp; Submit Exam ({answeredCount}/{totalCount})
                </button>
              )}

              <button
                type="button"
                onClick={handleNextOrSubmit}
                className="rounded-xl bg-[#1d4d2b] hover:bg-[#143a20] text-white px-6 py-2.5 text-xs sm:text-sm font-extrabold transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <span>
                  {isLastQuestion
                    ? 'Submit & Finish Exam'
                    : `Submit & Next (${currentIdx + 2}/${totalCount})`}
                </span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Confirm Submit Modal */}
        {confirmFinishModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={() => setConfirmFinishModal(false)}
          >
            <div
              className="w-full max-w-md rounded-xl bg-white border border-[#d5ded7] p-6 space-y-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-extrabold text-[#18261c]">
                Submit &amp; Finish {examCfg.code}?
              </h3>
              <p className="text-xs sm:text-sm text-[#5b6b60] leading-relaxed">
                You have answered <strong>{answeredCount}</strong> out of{' '}
                <strong>{totalCount}</strong> questions. Once submitted, your score and complete answer key review will be generated immediately.
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmFinishModal(false)}
                  className="rounded-lg border border-[#d5ded7] px-4 py-2 text-xs font-bold text-[#18261c] hover:bg-[#eef2ee]"
                >
                  Return to Questions
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConfirmFinishModal(false);
                    onSubmitExam();
                  }}
                  className="rounded-lg bg-[#1d4d2b] hover:bg-[#143a20] text-white px-5 py-2 text-xs font-bold cursor-pointer"
                >
                  Confirm &amp; View Score
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. EXAM SCORE & FULL ANSWER REVIEW VIEW
  if (mode === 'review' && reviewAttemptId) {
    const record = db.exams.find((x) => x.id === reviewAttemptId);
    if (!record) {
      return (
        <div className="rounded-xl bg-white border border-[#d5ded7] p-6 text-center space-y-3">
          <p className="text-sm text-[#5b6b60]">Exam attempt record not found.</p>
          <button
            type="button"
            onClick={onBackToHub}
            className="rounded-lg bg-[#1d4d2b] text-white px-4 py-2 text-xs font-bold"
          >
            Back to Exams
          </button>
        </div>
      );
    }

    const examCfg = EXAMS_CONFIG[record.examId];
    const studentUser = db.users.find((u) => u.id === record.uid);
    const pct = Math.round((record.score / record.total) * 100);
    const passed = pct >= 75;

    // Topic breakdown for diagnostic feedback
    const topicStats: Record<
      string,
      { correct: number; total: number; moduleRef: LessonId }
    > = {};

    record.refs.forEach((r, idx) => {
      const q = getExamQuestionByRef(r);
      if (!topicStats[q.topicTag]) {
        topicStats[q.topicTag] = { correct: 0, total: 0, moduleRef: q.moduleRef };
      }
      topicStats[q.topicTag].total += 1;
      if (record.answers[idx] === q.correctIndex) {
        topicStats[q.topicTag].correct += 1;
      }
    });

    const filteredItems = record.refs
      .map((r, idx) => {
        const q = getExamQuestionByRef(r);
        const userAns = record.answers[idx];
        const isCorrect = userAns === q.correctIndex;
        return { idx, q, userAns, isCorrect };
      })
      .filter((item) => {
        if (reviewFilter === 'wrong') return !item.isCorrect;
        if (reviewFilter === 'correct') return item.isCorrect;
        return true;
      });

    return (
      <div className="space-y-6 pb-12">
        {/* Top Score Summary Banner */}
        <div className="rounded-xl bg-gradient-to-r from-[#143a20] to-[#1d4d2b] text-white p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="text-xs font-bold uppercase tracking-wider text-[#d6b45f]">
              {examCfg.code} ·{' '}
              {record.attemptNumber === 1
                ? 'First Take Official Record'
                : `Retake #${record.attemptNumber - 1} (Attempt #${record.attemptNumber})`}
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              {examCfg.fullTitle}
            </h1>
            <div className="text-xs sm:text-sm text-white/85 flex flex-wrap items-center gap-2">
              <span>Examinee: <strong>{studentUser?.name || 'Student'}</strong></span>
              <span>·</span>
              <span>Time Consumed: <strong className="tabular-nums">{formatDurationHMS(record.durationSeconds)}</strong></span>
              <span>·</span>
              <span>Completed: {new Date(record.endedAt).toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-4 text-left md:text-right shrink-0 border border-white/15">
            <div className="text-xs uppercase font-bold text-[#d6b45f]">
              {passed ? '✓ Licensure Benchmark Passed' : 'Needs Additional Review (<75%)'}
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white tabular-nums mt-0.5">
              {record.score} / {record.total}{' '}
              <span className="text-xl text-[#d6b45f]">({pct}%)</span>
            </div>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBackToHub}
            className="rounded-lg border-2 border-[#1d4d2b] text-[#1d4d2b] hover:bg-[#e3f4e7] px-4 py-2 text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Exam Center</span>
          </button>

          {record.uid === currentUser.id && (
            <button
              type="button"
              onClick={() => onStartExam(record.examId, true)}
              className="rounded-lg bg-[#7a1a12] hover:bg-[#5e130d] text-white px-5 py-2.5 text-xs sm:text-sm font-extrabold flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Retake {examCfg.code} (Generate New Randomized 1–60 Set)</span>
            </button>
          )}
        </div>

        {/* Topic Breakdown & Focus Recommendations */}
        <div className="rounded-xl bg-white border border-[#d5ded7] p-5 space-y-4 shadow-xs">
          <div>
            <h2 className="text-base font-bold text-[#18261c]">
              Competency Breakdown &amp; Recommended Focus Areas
            </h2>
            <p className="text-xs text-[#5b6b60]">
              Topics below 75% accuracy are flagged for focused module review before your next retake.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(topicStats).map(([topicName, st]) => {
              const tPct = Math.round((st.correct / st.total) * 100);
              const needsFocus = tPct < 75;
              return (
                <div
                  key={topicName}
                  className="rounded-lg border border-[#d5ded7] p-3.5 flex flex-col justify-between gap-2 bg-[#f9fbf9]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-[#18261c]">{topicName}</span>
                    <span
                      className={`text-xs font-mono font-bold tabular-nums shrink-0 ${
                        needsFocus ? 'text-[#b3392e]' : 'text-[#2e8b4a]'
                      }`}
                    >
                      {st.correct}/{st.total} ({tPct}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[#e4ebe5] overflow-hidden">
                    <div
                      className={`h-full ${needsFocus ? 'bg-[#b3392e]' : 'bg-[#2e8b4a]'}`}
                      style={{ width: `${tPct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className={needsFocus ? 'text-[#b3392e] font-semibold' : 'text-[#2e8b4a] font-semibold'}>
                      {needsFocus ? '▲ Recommended Focus Topic' : '● Competency Mastered'}
                    </span>
                    <button
                      type="button"
                      onClick={() => onStudyLesson(st.moduleRef)}
                      className="font-bold text-[#1d4d2b] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <BookOpen className="h-3 w-3" />
                      <span>Review Lesson {st.moduleRef}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filter Bar for Answer Key Review */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-xl border border-[#d5ded7] p-4">
          <div className="text-sm font-bold text-[#18261c]">
            Complete Question &amp; Answer Key Review ({filteredItems.length} shown)
          </div>
          <div className="flex items-center gap-1.5 p-1 bg-[#eef2ee] rounded-lg">
            <button
              type="button"
              onClick={() => setReviewFilter('all')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                reviewFilter === 'all'
                  ? 'bg-[#1d4d2b] text-white'
                  : 'text-[#5b6b60] hover:text-[#18261c]'
              }`}
            >
              All ({record.total})
            </button>
            <button
              type="button"
              onClick={() => setReviewFilter('wrong')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                reviewFilter === 'wrong'
                  ? 'bg-[#b3392e] text-white'
                  : 'text-[#5b6b60] hover:text-[#18261c]'
              }`}
            >
              Incorrect ({record.total - record.score})
            </button>
            <button
              type="button"
              onClick={() => setReviewFilter('correct')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                reviewFilter === 'correct'
                  ? 'bg-[#2e8b4a] text-white'
                  : 'text-[#5b6b60] hover:text-[#18261c]'
              }`}
            >
              Correct ({record.score})
            </button>
          </div>
        </div>

        {/* Question-by-Question Review Cards */}
        <div className="space-y-4">
          {filteredItems.map(({ idx, q, userAns, isCorrect }) => (
            <div
              key={idx}
              className="rounded-xl bg-white border border-[#d5ded7] p-5 space-y-3 shadow-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs border-b border-[#eef2ee] pb-2">
                <span className="font-bold text-[#5b6b60]">
                  Question #{idx + 1} · {q.topicTag}
                </span>
                <span
                  className={`font-bold flex items-center gap-1 ${
                    isCorrect ? 'text-[#2e8b4a]' : 'text-[#b3392e]'
                  }`}
                >
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Correct (+1 pt)</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4" />
                      <span>{userAns == null ? 'Unanswered (0 pt)' : 'Incorrect (0 pt)'}</span>
                    </>
                  )}
                </span>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-[#18261c]">
                {idx + 1}. {q.question}
              </h3>

              <div className="space-y-2">
                {q.options.map((optText, oIdx) => {
                  const letter = ['A', 'B', 'C', 'D'][oIdx];
                  const isRightOpt = oIdx === q.correctIndex;
                  const isUserOpt = oIdx === userAns;

                  let rowStyle = 'border-[#e2e9e4] bg-[#f9fbf9] text-[#18261c]';
                  if (isRightOpt) {
                    rowStyle = 'border-[#2e8b4a] bg-[#e3f4e7] text-[#143a20] font-bold';
                  } else if (isUserOpt && !isRightOpt) {
                    rowStyle = 'border-[#b3392e] bg-[#fbe6e4] text-[#7a1a12] font-bold';
                  }

                  return (
                    <div
                      key={oIdx}
                      className={`rounded-lg border px-3.5 py-2.5 text-xs sm:text-sm flex items-center justify-between gap-3 ${rowStyle}`}
                    >
                      <div>
                        <span className="font-mono font-bold mr-2">{letter}.</span>
                        <span>{optText}</span>
                      </div>
                      <div className="text-xs font-bold shrink-0">
                        {isRightOpt && '✓ Correct Answer'}
                        {isUserOpt && !isRightOpt && '✗ Your Answer'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 3. DEFAULT EXAM CENTER HUB VIEW
  return (
    <div className="space-y-6 pb-12">
      <div className="rounded-xl bg-white border border-[#d5ded7] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-[#7a1a12]">
            Timed Licensure Examination Simulator
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#18261c]">
            Randomized 60-Item Examinations
          </h1>
          <p className="text-xs sm:text-sm text-[#5b6b60]">
            Each student receives a unique randomized 1–60 question set with a 60-minute timer, Previous &amp; Submit/Next navigation, full answer key review, and unlimited retakes with fresh question sets.
          </p>
        </div>

        {activeSession && (
          <div className="rounded-xl bg-[#fbe6e4] border border-[#b3392e]/40 p-4 flex items-center justify-between gap-4 shrink-0">
            <div>
              <div className="text-xs font-bold text-[#7a1a12]">Exam In Progress</div>
              <div className="text-sm font-extrabold text-[#18261c]">
                {EXAMS_CONFIG[activeSession.examId].code} (Item {activeSession.currentIndex + 1}/60)
              </div>
            </div>
            <button
              type="button"
              onClick={() => onStartExam(activeSession.examId, false)}
              className="rounded-lg bg-[#7a1a12] hover:bg-[#5e130d] text-white px-4 py-2 text-xs font-bold cursor-pointer"
            >
              Resume Exam →
            </button>
          </div>
        )}
      </div>

      {/* 3 Exam Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {([1, 2, 3] as const).map((exId) => {
          const ex = EXAMS_CONFIG[exId];
          const myAttempts = db.exams.filter(
            (a) => a.uid === currentUser.id && a.examId === exId
          );
          const firstTake = myAttempts.find((a) => a.attemptNumber === 1);
          const bestScore = myAttempts.length
            ? Math.max(...myAttempts.map((a) => a.score))
            : null;
          const isCurrentlyActive = activeSession?.examId === exId;

          return (
            <div
              key={exId}
              className="rounded-xl bg-white border border-[#d5ded7] p-5 sm:p-6 flex flex-col justify-between shadow-xs"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-[#5b6b60]">
                  <span className="font-extrabold text-[#1d4d2b]">{ex.code}</span>
                  <span className="font-mono tabular-nums">60 Items · 60 Minutes</span>
                </div>

                <div>
                  <h2 className="text-lg font-extrabold text-[#18261c] leading-snug">
                    {ex.fullTitle}
                  </h2>
                  <p className="text-xs text-[#5b6b60] mt-1">{ex.subtitle}</p>
                </div>

                {/* Covered Topics */}
                <div className="rounded-lg bg-[#f4f7f4] border border-[#e2e9e4] p-3.5 space-y-1.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#1d4d2b]">
                    Included Module Topics (Randomized 1–60):
                  </div>
                  <ul className="space-y-1 text-xs text-[#18261c]">
                    {ex.topics.map((t, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-[#1d4d2b] font-bold">•</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Summary Metrics */}
                <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                  <div className="rounded-lg bg-[#f9fbf9] border border-[#eef2ee] p-2">
                    <div className="text-[10px] text-[#5b6b60] font-semibold">Attempts</div>
                    <div className="text-sm font-extrabold font-mono text-[#18261c] tabular-nums">
                      {myAttempts.length}
                    </div>
                  </div>
                  <div className="rounded-lg bg-[#f9fbf9] border border-[#eef2ee] p-2">
                    <div className="text-[10px] text-[#5b6b60] font-semibold">First Take</div>
                    <div className="text-sm font-extrabold font-mono text-[#1d4d2b] tabular-nums">
                      {firstTake ? `${firstTake.score}/60` : '—'}
                    </div>
                  </div>
                  <div className="rounded-lg bg-[#f9fbf9] border border-[#eef2ee] p-2">
                    <div className="text-[10px] text-[#5b6b60] font-semibold">Best Score</div>
                    <div className="text-sm font-extrabold font-mono text-[#2e8b4a] tabular-nums">
                      {bestScore !== null ? `${bestScore}/60` : '—'}
                    </div>
                  </div>
                </div>

                {/* Past Attempts Table inside Card */}
                {myAttempts.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    <div className="text-xs font-bold text-[#18261c]">
                      Your Attempt History (First Take &amp; Retakes)
                    </div>
                    <div className="overflow-x-auto rounded-lg border border-[#d5ded7] max-h-44 overflow-y-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-[#f4f7f4] text-[#5b6b60] border-b border-[#d5ded7]">
                            <th className="py-1.5 px-2.5">Take</th>
                            <th className="py-1.5 px-2.5">Score</th>
                            <th className="py-1.5 px-2.5">Time</th>
                            <th className="py-1.5 px-2.5 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#eef2ee]">
                          {myAttempts.map((at) => (
                            <tr key={at.id} className="hover:bg-[#f9fbf9]">
                              <td className="py-1.5 px-2.5 font-semibold text-[#18261c]">
                                #{at.attemptNumber}{' '}
                                <span className="text-[10px] text-[#5b6b60]">
                                  ({at.attemptNumber === 1 ? '1st Take' : `Retake ${at.attemptNumber - 1}`})
                                </span>
                              </td>
                              <td className="py-1.5 px-2.5 font-mono font-bold text-[#1d4d2b] tabular-nums">
                                {at.score}/{at.total}
                              </td>
                              <td className="py-1.5 px-2.5 font-mono text-[#5b6b60] tabular-nums">
                                {formatDurationHMS(at.durationSeconds)}
                              </td>
                              <td className="py-1.5 px-2.5 text-right">
                                <button
                                  type="button"
                                  onClick={() => onOpenReview(at.id)}
                                  className="font-bold text-[#1d4d2b] hover:underline cursor-pointer"
                                >
                                  Review
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-5 mt-5 border-t border-[#eef2ee] flex flex-col gap-2">
                {isCurrentlyActive ? (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => onStartExam(exId, false)}
                      className="rounded-xl bg-[#1d4d2b] hover:bg-[#143a20] text-white py-2.5 px-3 text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Play className="h-3.5 w-3.5" />
                      <span>Resume Exam</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onStartExam(exId, true)}
                      className="rounded-xl border border-[#7a1a12] text-[#7a1a12] hover:bg-[#fbe6e4] py-2.5 px-3 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>New 1–60 Set</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onStartExam(exId, true)}
                    className="w-full rounded-xl bg-[#1d4d2b] hover:bg-[#143a20] text-white py-3 px-4 text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                  >
                    {myAttempts.length > 0 ? (
                      <>
                        <RotateCcw className="h-4 w-4 text-[#d6b45f]" />
                        <span>Retake {ex.code} (New Randomized 1–60 Set)</span>
                      </>
                    ) : (
                      <>
                        <FileCheck2 className="h-4 w-4 text-[#d6b45f]" />
                        <span>Start {ex.code} (60 Mins · 1–60 Randomized)</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
