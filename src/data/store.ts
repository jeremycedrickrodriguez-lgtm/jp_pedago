import {
  LessonId,
  LESSON_ORDER,
  EXAMS_CONFIG,
  getQuizQuestions,
  getExamQuestionByRef
} from './curriculumMeta';

export interface UserAccount {
  id: string;
  role: 'student' | 'teacher';
  name: string;
  sid: string;
  pw: string;
  program: string;
  yearLevel: string;
  email: string;
  totalSeconds: number;
  createdAt: number;
}

export interface QuizAttemptHistory {
  score: number;
  total: number;
  completedAt: number;
}

export interface LessonQuizProgress {
  answers: (number | null)[];
  done: boolean;
  history: QuizAttemptHistory[];
  scenarioSelected?: number | null;
  reflectionText?: string;
}

export interface ExamAttemptRecord {
  id: string;
  uid: string;
  examId: 1 | 2 | 3;
  attemptNumber: number; // 1 = First Take, >1 = Retake #
  refs: string[]; // 60 randomized question refs for this student's attempt
  answers: (number | null)[];
  score: number;
  total: number;
  startedAt: number;
  endedAt: number;
  durationSeconds: number;
  timedOut: boolean;
}

export interface ActiveExamSession {
  examId: 1 | 2 | 3;
  refs: string[];
  answers: (number | null)[];
  currentIndex: number;
  startedAt: number;
  elapsedSeconds: number;
}

export interface FeedbackEntry {
  id: string;
  uid: string;
  authorName: string;
  authorRole: 'student' | 'teacher';
  category: string;
  rating: number;
  comment: string;
  createdAt: number;
}

export interface AppDatabase {
  users: UserAccount[];
  quizzes: Record<string, Partial<Record<LessonId, LessonQuizProgress>>>;
  exams: ExamAttemptRecord[];
  activeExams: Record<string, ActiveExamSession>;
  feedbacks: FeedbackEntry[];
  currentUserId: string | null;
}

const STORAGE_KEY = 'pedagoready_tmlcr_v2_db';

export function shuffleArray<T>(arr: readonly T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function createInitialSampleDatabase(): AppDatabase {
  const now = Date.now();
  const exam1Pool = EXAMS_CONFIG[1].getPool().map((q) => q.ref);
  const exam2Pool = EXAMS_CONFIG[2].getPool().map((q) => q.ref);

  // Sample randomized 60-item exam for Maria Clarisse Santos (First Take + Retake)
  const mariaEx1Refs1 = shuffleArray(exam1Pool).slice(0, 60);
  const mariaEx1Ans1 = mariaEx1Refs1.map((r, idx) => {
    const q = getExamQuestionByRef(r);
    // 48/60 correct (80%)
    return idx % 5 === 0 ? (q.correctIndex + 1) % 4 : q.correctIndex;
  });

  const mariaEx1Refs2 = shuffleArray(exam1Pool).slice(0, 60);
  const mariaEx1Ans2 = mariaEx1Refs2.map((r, idx) => {
    const q = getExamQuestionByRef(r);
    // 54/60 correct (90%)
    return idx % 10 === 0 ? (q.correctIndex + 1) % 4 : q.correctIndex;
  });

  // Sample randomized 60-item exam for Juan Miguel Dela Cruz
  const juanEx1Refs1 = shuffleArray(exam1Pool).slice(0, 60);
  const juanEx1Ans1 = juanEx1Refs1.map((r, idx) => {
    const q = getExamQuestionByRef(r);
    // 43/60 correct (72%)
    return idx % 3 === 0 && idx < 51 ? (q.correctIndex + 1) % 4 : q.correctIndex;
  });

  const juanEx2Refs1 = shuffleArray(exam2Pool).slice(0, 60);
  const juanEx2Ans1 = juanEx2Refs1.map((r, idx) => {
    const q = getExamQuestionByRef(r);
    // 50/60 correct (83%)
    return idx % 6 === 0 ? (q.correctIndex + 1) % 4 : q.correctIndex;
  });

  return {
    users: [
      {
        id: 'u_teacher_1',
        role: 'teacher',
        name: 'Prof. Teodoro M. Luansing',
        sid: 'teacher',
        pw: 'admin123',
        program: 'College of Teacher Education · Faculty & Practicum Supervisor',
        yearLevel: 'Faculty / Admin',
        email: 'faculty@tmlcr.edu.ph',
        totalSeconds: 14200,
        createdAt: now - 86400000 * 30
      },
      {
        id: 'u_student_1',
        role: 'student',
        name: 'Maria Clarisse Santos',
        sid: '2026-00142',
        pw: 'student123',
        program: 'Bachelor of Secondary Education · Major in English',
        yearLevel: '4th Year Pre-Service Teacher',
        email: 'maria.santos@tmlcr.edu.ph',
        totalSeconds: 7069, // ~1h 57m 49s as seen in video
        createdAt: now - 86400000 * 14
      },
      {
        id: 'u_student_2',
        role: 'student',
        name: 'Juan Miguel Dela Cruz',
        sid: '2026-00189',
        pw: 'student123',
        program: 'Bachelor of Elementary Education · Generalist',
        yearLevel: '4th Year Pre-Service Teacher',
        email: 'juan.delacruz@tmlcr.edu.ph',
        totalSeconds: 9420,
        createdAt: now - 86400000 * 12
      },
      {
        id: 'u_student_3',
        role: 'student',
        name: 'Angela Mae Villanueva',
        sid: '2026-00205',
        pw: 'student123',
        program: 'Bachelor of Secondary Education · Major in English',
        yearLevel: '3rd Year Pre-Service Teacher',
        email: 'angela.villanueva@tmlcr.edu.ph',
        totalSeconds: 3850,
        createdAt: now - 86400000 * 7
      }
    ],
    quizzes: {
      u_student_1: {
        '1.1': {
          answers: [1, 2, 0, 3, 1],
          done: true,
          history: [{ score: 5, total: 5, completedAt: now - 86400000 * 3 }],
          scenarioSelected: 1,
          reflectionText:
            'Student A: "Excuse me, where is the Speech Lab?"\nStudent B: "Walk past the library and turn right on the second corridor."'
        },
        '1.2': {
          answers: [1, 2, 0, 3, 1],
          done: true,
          history: [
            { score: 4, total: 5, completedAt: now - 86400000 * 2 - 3600000 },
            { score: 5, total: 5, completedAt: now - 86400000 * 2 }
          ],
          scenarioSelected: 1
        },
        '1.3': {
          answers: [1, 2, 0, 3, 1],
          done: true,
          history: [{ score: 5, total: 5, completedAt: now - 86400000 * 1 }],
          scenarioSelected: 1
        },
        '1.4': {
          answers: [2, 1, 0, 1, 1], // 4/5
          done: true,
          history: [{ score: 4, total: 5, completedAt: now - 43200000 }],
          scenarioSelected: 1
        }
      },
      u_student_2: {
        '1.1': {
          answers: [1, 2, 0, 3, 1],
          done: true,
          history: [{ score: 5, total: 5, completedAt: now - 86400000 * 5 }]
        },
        '1.2': {
          answers: [1, 2, 0, 3, 0],
          done: true,
          history: [{ score: 4, total: 5, completedAt: now - 86400000 * 4 }]
        },
        '1.3': {
          answers: [1, 2, 0, 3, 1],
          done: true,
          history: [{ score: 5, total: 5, completedAt: now - 86400000 * 4 }]
        },
        '1.4': {
          answers: [2, 1, 0, 3, 1],
          done: true,
          history: [{ score: 5, total: 5, completedAt: now - 86400000 * 3 }]
        },
        '1.5': {
          answers: [1, 3, 0, 2, 1, 1, 0, 2, 1, 2],
          done: true,
          history: [{ score: 10, total: 10, completedAt: now - 86400000 * 3 }]
        },
        '2.1': {
          answers: [1, 2, 0, 3, 1],
          done: true,
          history: [{ score: 5, total: 5, completedAt: now - 86400000 * 2 }]
        },
        '2.2': {
          answers: [1, 2, 0, 3, 1],
          done: true,
          history: [{ score: 5, total: 5, completedAt: now - 86400000 * 1 }]
        }
      },
      u_student_3: {
        '1.1': {
          answers: [1, 2, 0, 1, 1],
          done: true,
          history: [{ score: 4, total: 5, completedAt: now - 86400000 * 2 }]
        },
        '1.2': {
          answers: [1, 0, 0, 3, 2],
          done: true,
          history: [{ score: 3, total: 5, completedAt: now - 86400000 * 1 }]
        }
      }
    },
    exams: [
      {
        id: 'ex_attempt_101',
        uid: 'u_student_1',
        examId: 1,
        attemptNumber: 1,
        refs: mariaEx1Refs1,
        answers: mariaEx1Ans1,
        score: 48,
        total: 60,
        startedAt: now - 86400000 * 2 - 2115000,
        endedAt: now - 86400000 * 2,
        durationSeconds: 2115, // 35m 15s
        timedOut: false
      },
      {
        id: 'ex_attempt_102',
        uid: 'u_student_1',
        examId: 1,
        attemptNumber: 2,
        refs: mariaEx1Refs2,
        answers: mariaEx1Ans2,
        score: 54,
        total: 60,
        startedAt: now - 86400000 * 1 - 1890000,
        endedAt: now - 86400000 * 1,
        durationSeconds: 1890, // 31m 30s
        timedOut: false
      },
      {
        id: 'ex_attempt_201',
        uid: 'u_student_2',
        examId: 1,
        attemptNumber: 1,
        refs: juanEx1Refs1,
        answers: juanEx1Ans1,
        score: 43,
        total: 60,
        startedAt: now - 86400000 * 3 - 2640000,
        endedAt: now - 86400000 * 3,
        durationSeconds: 2640, // 44m 00s
        timedOut: false
      },
      {
        id: 'ex_attempt_202',
        uid: 'u_student_2',
        examId: 2,
        attemptNumber: 1,
        refs: juanEx2Refs1,
        answers: juanEx2Ans1,
        score: 50,
        total: 60,
        startedAt: now - 86400000 * 1 - 2410000,
        endedAt: now - 86400000 * 1,
        durationSeconds: 2410, // 40m 10s
        timedOut: false
      }
    ],
    activeExams: {},
    feedbacks: [
      {
        id: 'fb_1',
        uid: 'u_student_1',
        authorName: 'Maria Clarisse Santos',
        authorRole: 'student',
        category: 'Module 1: Teaching Methods',
        rating: 5,
        comment:
          'The CLT and TBLT scenario simulations gave me clear, practical ideas for my upcoming demonstration teaching at TMLCR.',
        createdAt: now - 86400000 * 2
      },
      {
        id: 'fb_2',
        uid: 'u_student_2',
        authorName: 'Juan Miguel Dela Cruz',
        authorRole: 'student',
        category: '60-Item Timed Exam Simulator',
        rating: 5,
        comment:
          'Having a unique 60-item randomized set each retake with Previous/Next navigation and full answer explanations really helps me prepare for the licensure benchmark.',
        createdAt: now - 86400000 * 1
      }
    ],
    currentUserId: null
  };
}

export function loadDatabase(): AppDatabase {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AppDatabase;
      if (parsed && Array.isArray(parsed.users) && Array.isArray(parsed.exams)) {
        return parsed;
      }
    }
  } catch {
    // ignore storage errors
  }
  const initial = createInitialSampleDatabase();
  saveDatabase(initial);
  return initial;
}

export function saveDatabase(db: AppDatabase): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    // ignore storage errors
  }
}

export function getLessonProgress(
  db: AppDatabase,
  uid: string,
  lid: LessonId
): LessonQuizProgress {
  const userQuizzes = db.quizzes[uid] || {};
  const existing = userQuizzes[lid];
  if (existing) return existing;
  return {
    answers: [],
    done: false,
    history: []
  };
}

export function isLessonCompleted(db: AppDatabase, uid: string, lid: LessonId): boolean {
  return !!(db.quizzes[uid] && db.quizzes[uid][lid]?.done);
}

// Strict sequential gating: Lesson i is unlocked if i === 0 or Lesson (i-1) quiz is completed
// Teachers have all lessons unlocked for inspection
export function isLessonUnlocked(
  db: AppDatabase,
  user: UserAccount | null,
  lid: LessonId
): boolean {
  if (!user) return false;
  if (user.role === 'teacher') return true;
  const idx = LESSON_ORDER.indexOf(lid);
  if (idx <= 0) return true;
  const prevLid = LESSON_ORDER[idx - 1];
  return isLessonCompleted(db, user.id, prevLid);
}

export function calculateLessonQuizScore(
  progress: LessonQuizProgress,
  lid: LessonId
): { score: number; total: number } {
  const qs = getQuizQuestions(lid);
  let score = 0;
  qs.forEach((q, idx) => {
    if (progress.answers[idx] === q.a) {
      score += 1;
    }
  });
  return { score, total: qs.length };
}

export function formatDurationHMS(seconds: number): string {
  const s = Math.max(0, Math.round(seconds || 0));
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  return `${hrs}h ${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
}

export function formatCountdownMMSS(seconds: number): string {
  const s = Math.max(0, Math.round(seconds || 0));
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
