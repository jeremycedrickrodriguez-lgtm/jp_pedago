import React, { useState } from 'react';
import { LOGO_B64, LESSON_ORDER } from '../data/curriculumMeta';
import {
  AppDatabase,
  UserAccount,
  isLessonCompleted,
  formatDurationHMS
} from '../data/store';
import {
  User,
  Clock,
  GraduationCap,
  Award,
  MessageSquare,
  Star,
  MapPin,
  Calendar,
  Check,
  RotateCcw,
  LogOut
} from 'lucide-react';

interface ProfileViewProps {
  db: AppDatabase;
  currentUser: UserAccount;
  onUpdateProfile: (updates: { name: string; program: string; yearLevel: string }) => void;
  onResetAllQuizzes: () => void;
  onLogout: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  db,
  currentUser,
  onUpdateProfile,
  onResetAllQuizzes,
  onLogout
}) => {
  const [name, setName] = useState(currentUser.name);
  const [program, setProgram] = useState(currentUser.program);
  const [yearLevel, setYearLevel] = useState(currentUser.yearLevel);
  const [savedMsg, setSavedMsg] = useState(false);
  const [confirmResetAll, setConfirmResetAll] = useState(false);

  const myExams = db.exams.filter((e) => e.uid === currentUser.id);
  const totalExamSeconds = myExams.reduce((acc, e) => acc + e.durationSeconds, 0);
  const completedLessons = LESSON_ORDER.filter((lid) =>
    isLessonCompleted(db, currentUser.id, lid)
  ).length;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ name: name.trim() || currentUser.name, program, yearLevel });
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Profile Banner */}
      <div className="rounded-xl bg-[#1d4d2b] text-white p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-[#d6b45f] text-[#18261c] flex items-center justify-center text-2xl font-extrabold shrink-0">
            {currentUser.name
              .split(' ')
              .map((w) => w[0])
              .slice(0, 2)
              .join('')}
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#d6b45f]">
              {currentUser.role === 'teacher'
                ? 'Faculty / Practicum Administrator'
                : 'Pre-Service Teacher Profile'}
            </div>
            <h1 className="text-2xl font-extrabold text-white">{currentUser.name}</h1>
            <p className="text-xs sm:text-sm text-white/85">
              ID: <span className="font-mono font-bold">{currentUser.sid}</span> · {currentUser.program}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="rounded-lg bg-[#7a1a12] hover:bg-[#5f130d] text-white px-4 py-2.5 text-xs font-bold flex items-center gap-2 self-start sm:self-center cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out of Account</span>
        </button>
      </div>

      {/* Time & Progress Telemetry */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl bg-white border border-[#d5ded7] p-5 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-[#5b6b60]">
            <span>Overall Time Consumed</span>
            <Clock className="h-4 w-4 text-[#1d4d2b]" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#1d4d2b] tabular-nums">
            {formatDurationHMS(currentUser.totalSeconds)}
          </div>
          <p className="text-xs text-[#5b6b60]">Tracked automatically while studying</p>
        </div>

        <div className="rounded-xl bg-white border border-[#d5ded7] p-5 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-[#5b6b60]">
            <span>Time Consumed in Exams</span>
            <Clock className="h-4 w-4 text-[#7a1a12]" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#7a1a12] tabular-nums">
            {formatDurationHMS(totalExamSeconds)}
          </div>
          <p className="text-xs text-[#5b6b60]">
            Across {myExams.length} completed exam attempt{myExams.length === 1 ? '' : 's'}
          </p>
        </div>

        <div className="rounded-xl bg-white border border-[#d5ded7] p-5 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-[#5b6b60]">
            <span>Module Completion</span>
            <GraduationCap className="h-4 w-4 text-[#2e8b4a]" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#18261c] tabular-nums">
            {completedLessons} / {LESSON_ORDER.length}
          </div>
          <p className="text-xs text-[#5b6b60]">
            {Math.round((completedLessons / LESSON_ORDER.length) * 100)}% of curriculum unlocked
          </p>
        </div>
      </div>

      {/* Edit Profile Details */}
      <div className="rounded-xl bg-white border border-[#d5ded7] p-6 space-y-4 shadow-xs">
        <h2 className="text-base sm:text-lg font-extrabold text-[#18261c]">
          Account &amp; Academic Profile Settings
        </h2>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#18261c] mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-[#d5ded7] px-3.5 py-2 text-sm text-[#18261c] focus:border-[#1d4d2b] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#18261c] mb-1">
                Institutional ID (Read-Only)
              </label>
              <input
                type="text"
                disabled
                value={currentUser.sid}
                className="w-full rounded-lg border border-[#d5ded7] bg-[#f4f7f4] px-3.5 py-2 text-sm font-mono text-[#5b6b60]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#18261c] mb-1">
                Program / Department
              </label>
              <input
                type="text"
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                className="w-full rounded-lg border border-[#d5ded7] px-3.5 py-2 text-sm text-[#18261c] focus:border-[#1d4d2b] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#18261c] mb-1">
                Year Level / Designation
              </label>
              <input
                type="text"
                value={yearLevel}
                onChange={(e) => setYearLevel(e.target.value)}
                className="w-full rounded-lg border border-[#d5ded7] px-3.5 py-2 text-sm text-[#18261c] focus:border-[#1d4d2b] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="submit"
              className="rounded-lg bg-[#1d4d2b] hover:bg-[#143a20] text-white px-5 py-2.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="h-4 w-4" />
              <span>Save Profile Changes</span>
            </button>

            {savedMsg && (
              <span className="text-xs font-bold text-[#2e8b4a]">
                ✓ Profile updated successfully!
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Quiz Reset Control */}
      {currentUser.role === 'student' && (
        <div className="rounded-xl bg-white border border-[#d5ded7] p-6 space-y-3 shadow-xs">
          <h3 className="text-base font-extrabold text-[#18261c]">
            Reset All Module Knowledge Checks
          </h3>
          <p className="text-xs sm:text-sm text-[#5b6b60]">
            Want to practice all module Knowledge Checks (1.1–2.6) from scratch? Resetting clears your current quiz selections while preserving your past exam attempt records for your teacher.
          </p>
          {!confirmResetAll ? (
            <button
              type="button"
              onClick={() => setConfirmResetAll(true)}
              className="rounded-lg border border-[#7a1a12] text-[#7a1a12] hover:bg-[#fbe6e4] px-4 py-2 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset All Module Quizzes</span>
            </button>
          ) : (
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <span className="text-xs font-bold text-[#b3392e]">
                Confirm resetting all module quizzes?
              </span>
              <button
                type="button"
                onClick={() => {
                  onResetAllQuizzes();
                  setConfirmResetAll(false);
                }}
                className="rounded-lg bg-[#7a1a12] text-white px-3.5 py-1.5 text-xs font-bold cursor-pointer"
              >
                Yes, Reset Quizzes
              </button>
              <button
                type="button"
                onClick={() => setConfirmResetAll(false)}
                className="rounded-lg border border-[#d5ded7] px-3.5 py-1.5 text-xs font-bold text-[#18261c]"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface CreditsAndAboutViewProps {
  db: AppDatabase;
  currentUser: UserAccount | null;
  onAddFeedback: (data: { category: string; rating: number; comment: string }) => void;
}

export const CreditsAndAboutView: React.FC<CreditsAndAboutViewProps> = ({
  db,
  currentUser,
  onAddFeedback
}) => {
  const [category, setCategory] = useState('Module 1: Teaching Methods (CLT, GTM, Direct, TBLT)');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    onAddFeedback({ category, rating, comment: comment.trim() });
    setComment('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Institutional Profile Banner (matching video 0:31-0:33) */}
      <div className="rounded-xl bg-gradient-to-r from-[#143a20] to-[#1d4d2b] text-white p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="text-xs font-bold uppercase tracking-wider text-[#d6b45f]">
            Institutional Profile &amp; Credits
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Teodoro M. Luansing College of Rosario
          </h1>
          <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
            Empowering future educators, administrators, and nation-builders through research-based pedagogical mastery, academic excellence, and ethical leadership.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs font-semibold text-[#d6b45f]">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              <span>Rosario, Batangas, Philippines</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>Est. 2004</span>
            </span>
          </div>
        </div>

        <img
          src={LOGO_B64}
          alt="Teodoro M. Luansing College of Rosario Official Seal"
          referrerPolicy="no-referrer"
          className="h-28 w-28 sm:h-32 sm:w-32 rounded-2xl border-2 border-[#d6b45f] shadow-xl object-cover shrink-0"
        />
      </div>

      {/* Vision & Mission 2-Column Split (matching video 0:32) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="rounded-xl bg-white border border-[#d5ded7] p-6 space-y-2 shadow-xs">
          <div className="text-xs font-extrabold uppercase tracking-wider text-[#1d4d2b]">
            Institutional Vision
          </div>
          <h2 className="text-lg font-extrabold text-[#18261c]">
            A Center of Educational Excellence
          </h2>
          <p className="text-xs sm:text-sm text-[#5b6b60] leading-relaxed">
            To be a premier institution of higher learning in Southern Tagalog recognized for producing globally competitive, ethically grounded, and instructionally proficient educators who lead transformative learning communities.
          </p>
        </div>

        <div className="rounded-xl bg-white border border-[#d5ded7] p-6 space-y-2 shadow-xs">
          <div className="text-xs font-extrabold uppercase tracking-wider text-[#7a1a12]">
            College Mission
          </div>
          <h2 className="text-lg font-extrabold text-[#18261c]">
            Transformative Teacher Formation
          </h2>
          <p className="text-xs sm:text-sm text-[#5b6b60] leading-relaxed">
            To provide accessible, research-oriented teacher education programs that integrate content mastery, communicative methodology, classroom management, and reflective practicum field experiences that uphold human dignity.
          </p>
        </div>
      </div>

      {/* The PedagoReady Architecture & Credits (matching video 0:32) */}
      <div className="rounded-xl bg-white border border-[#d5ded7] p-6 space-y-5 shadow-xs">
        <div>
          <div className="text-xs font-extrabold uppercase tracking-wider text-[#7a1a12]">
            The PedagoReady Platform
          </div>
          <h2 className="text-xl font-extrabold text-[#18261c] mt-0.5">
            Why the PedagoReady Architecture for Pre-Service Teachers?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="space-y-1.5">
            <h3 className="text-sm font-extrabold text-[#1d4d2b]">
              1. Enforced Mastery Gating
            </h3>
            <p className="text-xs text-[#5b6b60] leading-relaxed">
              Students progress sequentially through Module 1 (Teaching Methods 1.1–1.5) and Module 2 (Practice-Teaching Preparedness 2.1–2.6 / 7.1–7.5) by completing each lesson’s Knowledge Check with instant explanatory feedback and quiz reset capability.
            </p>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-sm font-extrabold text-[#1d4d2b]">
              2. Pedagogy Touch Labs
            </h3>
            <p className="text-xs text-[#5b6b60] leading-relaxed">
              Interactive classroom simulations challenge future teachers to resolve realistic instructional dilemmas across CLT, GTM, Direct Method, TBLT, Classroom Management, and Professional Ethics before entering actual classrooms.
            </p>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-sm font-extrabold text-[#1d4d2b]">
              3. High-Fidelity 60-Item Licensure Simulator
            </h3>
            <p className="text-xs text-[#5b6b60] leading-relaxed">
              Three timed 60-minute examinations draw unique 1–60 randomized questionnaires per student from the 240-item institutional bank, supporting Previous/Next review, post-exam answer keys, and full teacher time &amp; retake tracking.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-[#eef2ee] grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg bg-[#f9fbf9] border border-[#e2e9e4] p-4">
            <h4 className="text-sm font-extrabold text-[#18261c]">
              Bachelor of Secondary Education (BSEd)
            </h4>
            <p className="text-xs text-[#5b6b60] mt-1">
              Specialized methodological preparation for high school educators with focus on communicative competence, task-based instruction, and subject-specific PCK.
            </p>
          </div>
          <div className="rounded-lg bg-[#f9fbf9] border border-[#e2e9e4] p-4">
            <h4 className="text-sm font-extrabold text-[#18261c]">
              Bachelor of Elementary Education (BEEd)
            </h4>
            <p className="text-xs text-[#5b6b60] mt-1">
              Holistic pedagogical preparation for foundational learners emphasizing direct association, proactive classroom routines, and empathetic learner support.
            </p>
          </div>
        </div>
      </div>

      {/* Student & Faculty Feedback Portal (matching video 0:30) */}
      <div className="rounded-xl bg-white border border-[#d5ded7] p-6 space-y-5 shadow-xs">
        <div>
          <div className="text-xs font-extrabold uppercase tracking-wider text-[#1d4d2b]">
            Quality Assurance &amp; Course Evaluation
          </div>
          <h2 className="text-xl font-extrabold text-[#18261c] mt-0.5">
            Student &amp; Faculty Feedback Portal
          </h2>
          <p className="text-xs text-[#5b6b60]">
            Share your reflections on the learning modules, Pedagogy Touch Labs, and 60-item exam simulator.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[360px_minmax(0,1fr)] gap-6 items-start">
          {/* Submit Feedback Form */}
          <form
            onSubmit={handleFeedbackSubmit}
            className="rounded-xl border border-[#d5ded7] bg-[#f9fbf9] p-4 space-y-3.5"
          >
            <h3 className="text-sm font-extrabold text-[#18261c]">Submit Your Review</h3>

            <div>
              <label className="block text-xs font-semibold text-[#5b6b60] mb-1">
                Feedback Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-[#d5ded7] bg-white px-3 py-2 text-xs text-[#18261c] focus:border-[#1d4d2b] focus:outline-none"
              >
                <option value="Module 1: Teaching Methods (CLT, GTM, Direct, TBLT)">
                  Module 1: Teaching Methods
                </option>
                <option value="Module 2: Practice-Teaching Preparedness (7.1–7.5)">
                  Module 2: Practice-Teaching Preparedness
                </option>
                <option value="60-Item Timed Exam Simulator">
                  60-Item Timed Exam Simulator
                </option>
                <option value="Platform Usability & Mobile Readiness">
                  Platform Usability &amp; Mobile Readiness
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5b6b60] mb-1">
                Overall Rating ({rating} / 5 Stars)
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setRating(num)}
                    className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                      num <= rating ? 'text-[#d6b45f]' : 'text-[#d5ded7]'
                    }`}
                  >
                    <Star className="h-5 w-5 fill-current" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5b6b60] mb-1">
                Your Feedback &amp; Observation
              </label>
              <textarea
                rows={3}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share how PedagoReady helped your practice-teaching preparation..."
                className="w-full rounded-lg border border-[#d5ded7] bg-white p-2.5 text-xs text-[#18261c] focus:border-[#1d4d2b] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-[#1d4d2b] hover:bg-[#143a20] text-white py-2.5 px-4 text-xs font-bold transition-colors cursor-pointer"
            >
              Submit Feedback Entry
            </button>

            {submitted && (
              <div className="text-xs font-bold text-[#2e8b4a] text-center">
                ✓ Thank you! Your feedback has been posted.
              </div>
            )}
          </form>

          {/* Community & Cohort Discussions Feed */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-extrabold text-[#18261c]">
              <MessageSquare className="h-4 w-4 text-[#1d4d2b]" />
              <span>Community &amp; Cohort Discussions ({db.feedbacks.length})</span>
            </div>

            <div className="space-y-3">
              {db.feedbacks
                .slice()
                .reverse()
                .map((fb) => (
                  <div
                    key={fb.id}
                    className="rounded-xl border border-[#d5ded7] bg-white p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <span className="text-sm font-bold text-[#18261c]">
                          {fb.authorName}
                        </span>
                        <span className="text-xs text-[#5b6b60] ml-2">
                          · {fb.category} · {new Date(fb.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-[#b87d00]">
                        {'★'.repeat(fb.rating)}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-[#18261c]/90 leading-relaxed">
                      {fb.comment}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Credits Card */}
      <div className="rounded-xl bg-[#f4f7f4] border border-[#d5ded7] p-5 text-center space-y-1.5">
        <div className="text-xs font-bold uppercase tracking-wider text-[#1d4d2b]">
          Academic &amp; System Credits
        </div>
        <p className="text-xs sm:text-sm font-semibold text-[#18261c]">
          PedagoReady — Pre-Service Teacher Readiness &amp; Licensure Simulation Platform
        </p>
        <p className="text-xs text-[#5b6b60]">
          Developed for Teodoro M. Luansing College of Rosario · College of Teacher Education · Module 1 (Teaching Methods: CLT, GTM, Direct Method, TBLT) &amp; Module 2 (Practice-Teaching Preparedness: 7.1–7.5 / 2.1–2.5).
        </p>
      </div>
    </div>
  );
};
