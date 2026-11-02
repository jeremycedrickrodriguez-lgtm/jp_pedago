import React, { useState } from 'react';
import {
  LessonId,
  LESSON_ORDER,
  LESSONS_META,
  MODULES_CONFIG,
  getCleanedLessonBlocks,
  getQuizQuestions
} from '../data/curriculumMeta';
import {
  AppDatabase,
  UserAccount,
  getLessonProgress,
  isLessonCompleted,
  isLessonUnlocked,
  calculateLessonQuizScore
} from '../data/store';
import {
  BookOpen,
  CheckCircle2,
  Lock,
  Lightbulb,
  RotateCcw,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ListChecks,
  Menu,
  X,
  FileText,
  Sparkles,
  Check,
  AlertCircle
} from 'lucide-react';

interface ModulesViewProps {
  db: AppDatabase;
  currentUser: UserAccount;
  activeLessonId: LessonId;
  onSelectLesson: (lid: LessonId) => void;
  onAnswerQuiz: (lid: LessonId, qIndex: number, optionIndex: number) => void;
  onResetQuiz: (lid: LessonId) => void;
  onSelectScenarioOption: (lid: LessonId, optionIndex: number) => void;
  onSaveReflection: (lid: LessonId, text: string) => void;
  onGoToExam: (examId: 1 | 2 | 3) => void;
}

export const ModulesView: React.FC<ModulesViewProps> = ({
  db,
  currentUser,
  activeLessonId,
  onSelectLesson,
  onAnswerQuiz,
  onResetQuiz,
  onSelectScenarioOption,
  onSaveReflection,
  onGoToExam
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({
    1: true,
    2: true
  });
  const [showFullReading, setShowFullReading] = useState(true);
  const [reflectionDraft, setReflectionDraft] = useState<Record<string, string>>({});
  const [savedToast, setSavedToast] = useState(false);

  const lessonMeta = LESSONS_META[activeLessonId];
  const currentModule = MODULES_CONFIG.find((m) => m.id === lessonMeta.moduleNum)!;
  const lessonBlocks = getCleanedLessonBlocks(activeLessonId);
  const quizQuestions = getQuizQuestions(activeLessonId);
  const progress = getLessonProgress(db, currentUser.id, activeLessonId);

  const allQuizAnswered = quizQuestions.every((_, i) => progress.answers[i] != null);
  const { score: quizScore, total: quizTotal } = calculateLessonQuizScore(
    progress,
    activeLessonId
  );

  const currentOrderIdx = LESSON_ORDER.indexOf(activeLessonId);
  const nextLessonId = LESSON_ORDER[currentOrderIdx + 1] as LessonId | undefined;
  const prevLessonId = LESSON_ORDER[currentOrderIdx - 1] as LessonId | undefined;

  const moduleCompletedCount = currentModule.lessonIds.filter((id) =>
    isLessonCompleted(db, currentUser.id, id)
  ).length;
  const modulePct = Math.round((moduleCompletedCount / currentModule.lessonIds.length) * 100);

  const totalCompletedCount = LESSON_ORDER.filter((id) =>
    isLessonCompleted(db, currentUser.id, id)
  ).length;

  const currentReflectionValue =
    reflectionDraft[activeLessonId] !== undefined
      ? reflectionDraft[activeLessonId]
      : progress.reflectionText || '';

  const handleSaveReflectionClick = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveReflection(activeLessonId, currentReflectionValue);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const renderSidebarContent = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-[#d5ded7] pb-3">
        <div className="flex items-center gap-2 text-xs font-extrabold tracking-wider uppercase text-[#18261c]">
          <BookOpen className="h-4 w-4 text-[#1d4d2b]" />
          <span>Course Outline</span>
        </div>
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(false)}
          className="lg:hidden rounded-lg p-1 text-[#5b6b60] hover:bg-[#eef2ee]"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Gating Lock Status row matching screenshot */}
      <div className="flex items-center justify-between rounded-lg bg-[#f4f7f4] border border-[#d5ded7] px-3 py-2 text-xs">
        <span className="font-medium text-[#5b6b60]">PedagoReady Gating Lock:</span>
        <span className="font-bold text-[#1d4d2b]">
          {currentUser.role === 'teacher' ? 'FACULTY UNLOCKED' : 'STRICT ENFORCED'}
        </span>
      </div>

      {/* Modules Accordion */}
      {MODULES_CONFIG.map((mod) => {
        const modDoneCount = mod.lessonIds.filter((id) =>
          isLessonCompleted(db, currentUser.id, id)
        ).length;
        const modProgressPct = Math.round((modDoneCount / mod.lessonIds.length) * 100);
        const isOpen = expandedModules[mod.id] ?? true;

        return (
          <div
            key={mod.id}
            className="rounded-xl border border-[#d5ded7] bg-white overflow-hidden"
          >
            <button
              type="button"
              onClick={() =>
                setExpandedModules((prev) => ({ ...prev, [mod.id]: !isOpen }))
              }
              className="w-full text-left px-3.5 py-3 bg-[#f9fbf9] hover:bg-[#f1f5f2] transition-colors border-b border-[#eef2ee]"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-extrabold uppercase tracking-tight text-[#18261c]">
                  {mod.code}: {mod.title}
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[11px] font-mono font-bold text-[#1d4d2b] tabular-nums">
                    {modProgressPct}%
                  </span>
                  {isOpen ? (
                    <ChevronUp className="h-3.5 w-3.5 text-[#5b6b60]" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 text-[#5b6b60]" />
                  )}
                </div>
              </div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-[#e4ebe5] overflow-hidden">
                <div
                  className="h-full bg-[#2e8b4a] transition-all duration-300"
                  style={{ width: `${modProgressPct}%` }}
                />
              </div>
            </button>

            {isOpen && (
              <div className="p-2 space-y-1">
                {mod.lessonIds.map((lid) => {
                  const meta = LESSONS_META[lid];
                  const unlocked = isLessonUnlocked(db, currentUser, lid);
                  const done = isLessonCompleted(db, currentUser.id, lid);
                  const isActive = activeLessonId === lid;
                  const lProg = getLessonProgress(db, currentUser.id, lid);
                  const qCount = getQuizQuestions(lid).length;
                  const sc = done ? calculateLessonQuizScore(lProg, lid).score : 0;

                  return (
                    <button
                      key={lid}
                      type="button"
                      disabled={!unlocked}
                      onClick={() => {
                        onSelectLesson(lid);
                        setMobileSidebarOpen(false);
                      }}
                      className={`w-full text-left flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs transition-colors ${
                        isActive
                          ? 'bg-[#1d4d2b] text-white font-bold shadow-xs'
                          : unlocked
                          ? 'text-[#18261c] hover:bg-[#e3f4e7] font-medium'
                          : 'text-[#9db3a3] cursor-not-allowed opacity-70'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {done ? (
                          <CheckCircle2
                            className={`h-4 w-4 shrink-0 ${
                              isActive ? 'text-[#d6b45f]' : 'text-[#2e8b4a]'
                            }`}
                          />
                        ) : unlocked ? (
                          <BookOpen
                            className={`h-4 w-4 shrink-0 ${
                              isActive ? 'text-white' : 'text-[#1d4d2b]'
                            }`}
                          />
                        ) : (
                          <Lock className="h-3.5 w-3.5 shrink-0 text-[#9db3a3]" />
                        )}
                        <span className="truncate">
                          {meta.codeLabel}
                          {meta.altCodeLabel ? ` (${meta.altCodeLabel})` : ''} {meta.title}
                        </span>
                      </div>
                      <span
                        className={`text-[11px] font-mono tabular-nums shrink-0 ${
                          isActive
                            ? 'text-[#d6b45f]'
                            : done
                            ? 'text-[#2e8b4a] font-bold'
                            : 'text-[#5b6b60]'
                        }`}
                      >
                        {done ? `${sc}/${qCount}` : `0/${qCount}`}
                      </span>
                    </button>
                  );
                })}

                {/* Chapter Exam Button inside Module Card (matching video screenshot) */}
                <button
                  type="button"
                  onClick={() => {
                    onGoToExam(mod.examId);
                    setMobileSidebarOpen(false);
                  }}
                  className="w-full mt-2 flex items-center justify-between px-3 py-2 rounded-lg border border-[#d6b45f] bg-[#fdf9ee] hover:bg-[#f9efd4] text-[#7a1a12] text-xs font-bold transition-colors cursor-pointer"
                >
                  <span>Chapter {mod.id} Exam</span>
                  <span className="font-mono text-[11px] tabular-nums">60 ITEMS</span>
                </button>
              </div>
            )}
          </div>
        );
      })}

      {/* Course Completion / Exam 3 Card */}
      <div className="rounded-xl border border-[#d5ded7] bg-white p-3.5 space-y-2.5">
        <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#5b6b60]">
          Course Completion Benchmark
        </div>
        <button
          type="button"
          onClick={() => {
            onGoToExam(3);
            setMobileSidebarOpen(false);
          }}
          className="w-full text-left flex items-center justify-between px-3 py-2.5 rounded-lg bg-[#1d4d2b] hover:bg-[#143a20] text-white text-xs font-bold transition-colors cursor-pointer"
        >
          <span>Exam 3: All Modules</span>
          <span className="font-mono text-[11px] text-[#d6b45f] tabular-nums">60 ITEMS</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="pb-12">
      {/* Mobile / Tablet Course Outline Drawer Toggle */}
      <div className="lg:hidden mb-4">
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(true)}
          className="w-full flex items-center justify-between rounded-xl bg-[#1d4d2b] text-white px-4 py-3 text-sm font-bold shadow-xs"
        >
          <span className="flex items-center gap-2">
            <Menu className="h-4 w-4 text-[#d6b45f]" />
            <span>
              Course Outline · {lessonMeta.codeLabel} {lessonMeta.title}
            </span>
          </span>
          <span className="text-xs font-mono text-[#d6b45f] tabular-nums">
            {totalCompletedCount}/{LESSON_ORDER.length} Done
          </span>
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 lg:hidden flex"
          onClick={() => setMobileSidebarOpen(false)}
        >
          <div
            className="w-80 max-w-[85vw] bg-white h-full overflow-y-auto p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {renderSidebarContent()}
          </div>
        </div>
      )}

      {/* Main 2-Column Layout matching video screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-[310px_minmax(0,1fr)] gap-6 items-start">
        {/* Sticky Desktop Sidebar */}
        <aside className="hidden lg:block sticky top-20 rounded-xl bg-white border border-[#d5ded7] p-4 shadow-xs max-h-[calc(100vh-6rem)] overflow-y-auto">
          {renderSidebarContent()}
        </aside>

        {/* Lesson Content Area */}
        <div className="space-y-6 min-w-0">
          {/* Top Breadcrumb & Module Progress Bar */}
          <div className="rounded-xl bg-white border border-[#d5ded7] p-5 sm:p-7 shadow-xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#eef2ee] pb-3 text-xs">
              <div className="font-bold tracking-wide text-[#5b6b60]">
                {currentModule.code} &gt; LESSON {lessonMeta.codeLabel}
                {lessonMeta.altCodeLabel ? ` (FORMERLY ${lessonMeta.altCodeLabel})` : ''}
              </div>
              <div className="font-semibold text-[#1d4d2b] tabular-nums">
                Progress: {modulePct}% ({currentModule.code})
              </div>
            </div>

            {/* Primary Lesson Title & Subtitle */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#18261c] tracking-tight">
                {lessonMeta.codeLabel}
                {lessonMeta.altCodeLabel ? ` / ${lessonMeta.altCodeLabel}` : ''}{' '}
                {lessonMeta.title}
              </h1>
              <p className="text-sm sm:text-base text-[#5b6b60] leading-relaxed">
                {lessonMeta.subtitle}
              </p>
            </div>

            {/* Research-Supported Discussion Section (matching Screenshot_2026-11-02_120930) */}
            <div className="pt-2 space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-[#18261c]">
                {lessonMeta.researchDiscussionTitle}
              </h2>
              <p className="text-sm text-[#18261c]/90 leading-relaxed">
                {lessonMeta.researchDiscussionBody}
              </p>

              {/* Amber Research Insight Callout */}
              <div className="rounded-xl border border-[#e6c875] bg-[#fefaf0] p-4 sm:p-5 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#946200]">
                  <Lightbulb className="h-4 w-4 text-[#b87d00]" />
                  <span>Research Insight</span>
                </div>
                <p className="text-xs sm:text-sm text-[#3d2c05] leading-relaxed font-medium">
                  {lessonMeta.researchInsight}
                </p>
              </div>
            </div>

            {/* Classroom Example & Authentic Application */}
            <div className="rounded-xl border border-[#d5ded7] bg-[#f9fbf9] p-4 sm:p-5 space-y-2">
              <h3 className="text-sm font-bold text-[#1d4d2b]">
                Classroom Example &amp; Authentic Application
              </h3>
              <p className="text-xs sm:text-sm text-[#18261c] leading-relaxed">
                {lessonMeta.authenticApplication}
              </p>
            </div>

            {/* Essential Teaching Principles 2x2 Grid */}
            <div className="space-y-3">
              <div className="text-xs font-extrabold uppercase tracking-wider text-[#1d4d2b]">
                Essential Teaching Principles to Remember
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {lessonMeta.essentialPrinciples.map((prin, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-[#d5ded7] bg-white p-3.5 flex items-start gap-2.5 text-xs sm:text-sm text-[#18261c]"
                  >
                    <CheckCircle2 className="h-4 w-4 text-[#2e8b4a] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{prin}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Structured Important Terms Table */}
            <div className="space-y-2.5 pt-2">
              <h3 className="text-sm font-bold text-[#18261c]">
                Key Pedagogical Terms &amp; Definitions
              </h3>
              <div className="overflow-x-auto rounded-lg border border-[#d5ded7]">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[#1d4d2b] text-white">
                      <th className="py-2.5 px-3.5 font-semibold w-1/3">Term</th>
                      <th className="py-2.5 px-3.5 font-semibold">Meaning &amp; Classroom Relevance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eef2ee]">
                    {lessonMeta.keyTerms.map((item, idx) => (
                      <tr key={idx} className="hover:bg-[#f8faf8]">
                        <td className="py-2.5 px-3.5 font-bold text-[#1d4d2b] align-top">
                          {item.term}
                        </td>
                        <td className="py-2.5 px-3.5 text-[#18261c] align-top">
                          {item.meaning}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Common Teaching Mistakes & Recommended Solutions Table */}
            {lessonMeta.mistakesTable && (
              <div className="space-y-2.5 pt-2">
                <h3 className="text-sm font-bold text-[#18261c]">
                  Common Teaching Mistakes &amp; Recommended Solutions
                </h3>
                <div className="overflow-x-auto rounded-lg border border-[#d5ded7]">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-[#7a1a12] text-white">
                        <th className="py-2.5 px-3.5 font-semibold w-1/2">Common Teaching Mistake</th>
                        <th className="py-2.5 px-3.5 font-semibold">Recommended Pedagogical Solution</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eef2ee]">
                      {lessonMeta.mistakesTable.map((row, idx) => (
                        <tr key={idx} className="hover:bg-[#f8faf8]">
                          <td className="py-2.5 px-3.5 text-[#7a1a12] font-medium align-top">
                            {row.mistake}
                          </td>
                          <td className="py-2.5 px-3.5 text-[#1d4d2b] font-medium align-top">
                            {row.solution}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Complete Instructional Text from the Uploaded Module PDF */}
          <div className="rounded-xl bg-white border border-[#d5ded7] overflow-hidden shadow-xs">
            <button
              type="button"
              onClick={() => setShowFullReading(!showFullReading)}
              className="w-full px-5 py-4 bg-[#f4f7f4] hover:bg-[#e9f0ea] transition-colors flex items-center justify-between text-left border-b border-[#d5ded7]"
            >
              <div className="flex items-center gap-2.5">
                <FileText className="h-5 w-5 text-[#1d4d2b]" />
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-[#18261c]">
                    Complete Module Reading Material (Lesson {lessonMeta.codeLabel} Full Text)
                  </h2>
                  <p className="text-xs text-[#5b6b60]">
                    Includes all objectives, classroom procedures, real-life scenarios, demonstrations, and key takeaways from the module
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#1d4d2b] flex items-center gap-1 shrink-0">
                {showFullReading ? 'Collapse' : 'Expand'}
                {showFullReading ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </span>
            </button>

            {showFullReading && (
              <div className="p-5 sm:p-7 space-y-3 text-sm leading-relaxed text-[#18261c]">
                {lessonBlocks.map((b, idx) => {
                  if (b.type === 'h') {
                    return (
                      <h3
                        key={idx}
                        className="text-base sm:text-lg font-bold text-[#1d4d2b] border-b border-[#d6b45f]/60 pb-1.5 pt-4 first:pt-0"
                      >
                        {b.text}
                      </h3>
                    );
                  }
                  if (b.type === 's') {
                    return (
                      <h4 key={idx} className="text-sm font-bold text-[#7a1a12] pt-2">
                        {b.text}
                      </h4>
                    );
                  }
                  if (b.type === 'l') {
                    return (
                      <div key={idx} className="flex items-start gap-2.5 pl-2">
                        <span className="text-[#1d4d2b] font-bold">•</span>
                        <span>{b.text}</span>
                      </div>
                    );
                  }
                  if (b.type === 't') {
                    return (
                      <pre
                        key={idx}
                        className="overflow-x-auto rounded-lg bg-[#f4f7f4] border border-[#d5ded7] p-3.5 text-xs font-mono leading-relaxed text-[#18261c]"
                      >
                        {b.text}
                      </pre>
                    );
                  }
                  return (
                    <p key={idx} className="text-sm text-[#18261c]/90 leading-relaxed">
                      {b.text}
                    </p>
                  );
                })}
              </div>
            )}
          </div>

          {/* PEDAGOGY TOUCH LAB — INTERACTIVE SCENARIO (matching video 0:15-0:19) */}
          <div className="rounded-xl border border-[#d5ded7] bg-white overflow-hidden shadow-xs">
            <div className="bg-[#143a20] px-5 py-3 text-white flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#d6b45f]">
                <Sparkles className="h-4 w-4" />
                <span>Pedagogy Touch Lab #{lessonMeta.codeLabel} — Interactive Scenario</span>
              </div>
              <span className="text-[11px] font-semibold text-white/80">
                Simulated Classroom Decision-Making
              </span>
            </div>

            <div className="p-5 sm:p-6 space-y-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#5b6b60]">
                  Interactive Pedagogical Decision Matrix
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#18261c] mt-0.5">
                  {lessonMeta.scenarioLab.title}
                </h3>
              </div>

              <div className="rounded-xl border border-[#e6c875] bg-[#fefaf0] p-4 text-xs sm:text-sm text-[#3d2c05] font-medium leading-relaxed">
                {lessonMeta.scenarioLab.prompt}
              </div>

              <div className="space-y-2.5">
                {lessonMeta.scenarioLab.options.map((opt, oIdx) => {
                  const isChosen = progress.scenarioSelected === oIdx;
                  return (
                    <div key={oIdx} className="space-y-1.5">
                      <button
                        type="button"
                        onClick={() => onSelectScenarioOption(activeLessonId, oIdx)}
                        className={`w-full text-left rounded-lg border px-4 py-3 text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                          isChosen
                            ? opt.isOptimal
                              ? 'border-[#2e8b4a] bg-[#e3f4e7] text-[#143a20] font-bold'
                              : 'border-[#b3392e] bg-[#fbe6e4] text-[#7a1a12] font-bold'
                            : 'border-[#d5ded7] bg-white hover:border-[#1d4d2b] text-[#18261c]'
                        }`}
                      >
                        {opt.label}
                      </button>
                      {isChosen && (
                        <div
                          className={`rounded-lg px-3.5 py-2.5 text-xs leading-relaxed ${
                            opt.isOptimal
                              ? 'bg-[#e3f4e7]/70 text-[#143a20]'
                              : 'bg-[#fbe6e4]/70 text-[#7a1a12]'
                          }`}
                        >
                          <strong>{opt.isOptimal ? '✓ Pedagogical Analysis: ' : '✗ Analysis: '}</strong>
                          {opt.feedback}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Learning Activity / Reflection Builder (matching video 0:16) */}
          <div className="rounded-xl border border-[#d5ded7] bg-white p-5 sm:p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#5b6b60]">
                  Formative Reflection &amp; Application
                </div>
                <h3 className="text-base font-bold text-[#18261c]">
                  Learning Activity: Realistic Classroom Application Builder
                </h3>
              </div>
              <span className="text-xs text-[#5b6b60]">Self-Paced Task</span>
            </div>

            <p className="text-xs sm:text-sm text-[#5b6b60] leading-relaxed">
              {lessonMeta.reflectionPrompt}
            </p>

            <form onSubmit={handleSaveReflectionClick} className="space-y-3">
              <textarea
                rows={3}
                value={currentReflectionValue}
                onChange={(e) =>
                  setReflectionDraft((prev) => ({
                    ...prev,
                    [activeLessonId]: e.target.value
                  }))
                }
                placeholder="Type your authentic classroom response, lesson dialogue, or reflection here..."
                className="w-full rounded-lg border border-[#d5ded7] p-3 text-xs sm:text-sm text-[#18261c] focus:border-[#1d4d2b] focus:outline-none"
              />
              <div className="flex items-center justify-between gap-3">
                <button
                  type="submit"
                  className="rounded-lg bg-[#1d4d2b] hover:bg-[#143a20] text-white px-4 py-2 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>Submit Activity Response</span>
                </button>
                {savedToast && (
                  <span className="text-xs font-semibold text-[#2e8b4a]">
                    ✓ Activity response saved to your portfolio!
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* KNOWLEDGE CHECK (1–5 / 1–10) WITH SCORE & RESET QUIZ (matching video 0:16-0:18) */}
          <div className="rounded-xl border border-[#d5ded7] bg-white p-5 sm:p-7 shadow-xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eef2ee] pb-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#1d4d2b]">
                  {quizQuestions.length}-Item Mastery Gate
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-[#18261c]">
                  Knowledge Check {lessonMeta.codeLabel}: {lessonMeta.title}
                </h2>
                <p className="text-xs text-[#5b6b60] mt-0.5">
                  Answer all {quizQuestions.length} questions (1–{quizQuestions.length}) to unlock the next module topic. You can reset and retake this quiz anytime.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[11px] font-semibold text-[#5b6b60]">Current Score</div>
                  <div className="text-lg font-extrabold font-mono text-[#1d4d2b] tabular-nums">
                    {quizScore} / {quizTotal}
                  </div>
                </div>
                {progress.answers.some((a) => a != null) && (
                  <button
                    type="button"
                    onClick={() => onResetQuiz(activeLessonId)}
                    className="rounded-lg border border-[#7a1a12] text-[#7a1a12] hover:bg-[#fbe6e4] px-3 py-2 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Reset Quiz</span>
                  </button>
                )}
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-6">
              {quizQuestions.map((q, qIdx) => {
                const selectedOpt = progress.answers[qIdx];
                const isAnswered = selectedOpt != null;
                const isCorrect = selectedOpt === q.a;

                return (
                  <div
                    key={qIdx}
                    className="rounded-xl border border-[#e2e9e4] bg-[#f9fbf9] p-4 sm:p-5 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm sm:text-base font-bold text-[#18261c]">
                        <span className="text-[#1d4d2b] mr-1.5">Q{qIdx + 1}.</span>
                        {q.q}
                      </h3>
                      {isAnswered && (
                        <span
                          className={`text-xs font-bold shrink-0 ${
                            isCorrect ? 'text-[#2e8b4a]' : 'text-[#b3392e]'
                          }`}
                        >
                          {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      {q.o.map((optText, oIdx) => {
                        const letter = ['A', 'B', 'C', 'D'][oIdx];
                        let btnStyle =
                          'border-[#d5ded7] bg-white hover:border-[#1d4d2b] text-[#18261c]';

                        if (isAnswered) {
                          if (oIdx === q.a) {
                            btnStyle =
                              'border-[#2e8b4a] bg-[#e3f4e7] text-[#143a20] font-bold';
                          } else if (oIdx === selectedOpt) {
                            btnStyle =
                              'border-[#b3392e] bg-[#fbe6e4] text-[#7a1a12] font-bold';
                          } else {
                            btnStyle = 'border-[#e2e9e4] bg-white/60 text-[#5b6b60] opacity-75';
                          }
                        }

                        return (
                          <button
                            key={oIdx}
                            type="button"
                            disabled={isAnswered}
                            onClick={() => onAnswerQuiz(activeLessonId, qIdx, oIdx)}
                            className={`w-full text-left rounded-lg border px-4 py-2.5 text-xs sm:text-sm transition-colors flex items-start gap-2.5 ${btnStyle} ${
                              isAnswered ? 'cursor-default' : 'cursor-pointer'
                            }`}
                          >
                            <span className="font-mono font-bold shrink-0">{letter}.</span>
                            <span>{optText}</span>
                          </button>
                        );
                      })}
                    </div>

                    {isAnswered && (
                      <div
                        className={`rounded-lg px-4 py-2.5 text-xs leading-relaxed ${
                          isCorrect
                            ? 'bg-[#e3f4e7] text-[#143a20]'
                            : 'bg-[#fbe6e4] text-[#7a1a12]'
                        }`}
                      >
                        <strong>
                          {isCorrect
                            ? 'Correct Answer! '
                            : `Correct Answer: ${['A', 'B', 'C', 'D'][q.a]}. `}
                        </strong>
                        {q.e}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Completion Banner / Gating Notice */}
            {allQuizAnswered ? (
              <div className="rounded-xl bg-gradient-to-r from-[#143a20] to-[#1d4d2b] text-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#d6b45f]">
                    Knowledge Check Completed
                  </div>
                  <h3 className="text-xl font-extrabold text-white mt-0.5 tabular-nums">
                    Score: {quizScore} / {quizTotal} ({Math.round((quizScore / quizTotal) * 100)}%)
                  </h3>
                  <p className="text-xs text-white/85 mt-0.5">
                    {nextLessonId
                      ? `Lesson ${nextLessonId} (${LESSONS_META[nextLessonId].title}) is now unlocked!`
                      : 'All lessons completed! You are ready for the 60-item timed examinations.'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => onResetQuiz(activeLessonId)}
                    className="rounded-lg bg-[#7a1a12] hover:bg-[#61130d] text-white px-4 py-2.5 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Reset Quiz</span>
                  </button>

                  {nextLessonId ? (
                    <button
                      type="button"
                      onClick={() => onSelectLesson(nextLessonId)}
                      className="rounded-lg bg-[#d6b45f] hover:bg-[#c5a14a] text-[#18261c] px-5 py-2.5 text-xs font-extrabold transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Next Lesson: {nextLessonId}</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onGoToExam(currentModule.examId)}
                      className="rounded-lg bg-[#d6b45f] hover:bg-[#c5a14a] text-[#18261c] px-5 py-2.5 text-xs font-extrabold transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Proceed to Timed Exams</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-[#d5ded7] bg-[#f4f7f4] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#18261c]">
                  <AlertCircle className="h-5 w-5 text-[#7a1a12] shrink-0" />
                  <span>
                    <strong>Sequential Gating Active:</strong> Please answer all{' '}
                    {quizQuestions.length} questions above (
                    {progress.answers.filter((a) => a != null).length}/{quizQuestions.length}{' '}
                    answered) to unlock the next module lesson.
                  </span>
                </div>
                {prevLessonId && (
                  <button
                    type="button"
                    onClick={() => onSelectLesson(prevLessonId)}
                    className="text-xs font-bold text-[#1d4d2b] hover:underline shrink-0"
                  >
                    ← Back to {prevLessonId}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
