import React, { useState } from 'react';
import { LOGO_B64 } from '../data/curriculumMeta';
import { UserAccount } from '../data/store';
import { X, ShieldCheck, GraduationCap, UserCheck, ArrowRight, UserPlus } from 'lucide-react';

interface LoginModalProps {
  users: UserAccount[];
  onClose: () => void;
  onSelectUser: (user: UserAccount) => void;
  onRegisterStudent: (data: {
    name: string;
    sid: string;
    pw: string;
    program: string;
    yearLevel: string;
  }) => { ok: boolean; error?: string };
}

export const LoginModal: React.FC<LoginModalProps> = ({
  users,
  onClose,
  onSelectUser,
  onRegisterStudent
}) => {
  const [roleTab, setRoleTab] = useState<'student' | 'teacher'>('student');
  const [isRegistering, setIsRegistering] = useState(false);
  const [sid, setSid] = useState('');
  const [pw, setPw] = useState('');
  const [name, setName] = useState('');
  const [program, setProgram] = useState('Bachelor of Secondary Education · Major in English');
  const [yearLevel, setYearLevel] = useState('4th Year Pre-Service Teacher');
  const [error, setError] = useState('');

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegistering && roleTab === 'student') {
      if (!name.trim() || !sid.trim() || !pw.trim()) {
        setError('Please complete all required registration fields.');
        return;
      }
      const res = onRegisterStudent({
        name: name.trim(),
        sid: sid.trim(),
        pw,
        program,
        yearLevel
      });
      if (!res.ok && res.error) {
        setError(res.error);
      }
      return;
    }

    const found = users.find(
      (u) =>
        u.role === roleTab &&
        (u.sid.toLowerCase() === sid.trim().toLowerCase() ||
          u.name.toLowerCase() === sid.trim().toLowerCase()) &&
        u.pw === pw
    );

    if (!found) {
      setError(
        roleTab === 'teacher'
          ? 'Invalid Faculty ID or password. Try ID: teacher / Password: admin123'
          : 'Invalid Student ID or password. Select a demo profile above or register a new account.'
      );
      return;
    }

    onSelectUser(found);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-xl bg-white border border-[#d5ded7] shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Institutional Header */}
        <div className="bg-[#1d4d2b] px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={LOGO_B64}
              alt="Teodoro M. Luansing College of Rosario Logo"
              referrerPolicy="no-referrer"
              className="h-11 w-11 rounded-lg object-cover border border-[#d6b45f]/50 shrink-0"
            />
            <div>
              <h2 className="text-base font-bold tracking-tight text-white">
                PEDAGOREADY Access Portal
              </h2>
              <p className="text-xs text-[#d6b45f] font-medium">
                Teodoro M. Luansing College of Rosario · College of Teacher Education
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-5 max-h-[82vh] overflow-y-auto">
          {/* Quick-Select Demo Profiles (matching video) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#5b6b60]">
                Quick-Select Account Profile
              </span>
              <span className="text-[11px] text-[#5b6b60]">Instant 1-Click Login</span>
            </div>
            <div className="space-y-2">
              {users.map((u) => {
                const isTeacher = u.role === 'teacher';
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => onSelectUser(u)}
                    className="w-full text-left rounded-lg border border-[#d5ded7] bg-[#f8faf8] hover:bg-[#e3f4e7] hover:border-[#1d4d2b] px-3.5 py-2.5 transition-colors flex items-center justify-between gap-3 group"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-sm text-[#18261c] group-hover:text-[#1d4d2b] truncate">
                        {u.name}
                      </div>
                      <div className="text-xs text-[#5b6b60] truncate">
                        {isTeacher ? 'Faculty / Practicum Admin' : `${u.program} · ID: ${u.sid}`}
                      </div>
                    </div>
                    <span
                      className={`text-xs font-semibold shrink-0 whitespace-nowrap ${
                        isTeacher ? 'text-[#7a1a12]' : 'text-[#1d4d2b]'
                      }`}
                    >
                      {isTeacher ? 'Teacher / Admin →' : 'Student →'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#d5ded7] w-full" />
            <span className="bg-white px-3 text-[11px] font-medium text-[#5b6b60] whitespace-nowrap">
              Or Sign In / Register with ID
            </span>
            <div className="border-t border-[#d5ded7] w-full" />
          </div>

          {/* Role Selector Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#eef2ee] rounded-lg">
            <button
              type="button"
              onClick={() => {
                setRoleTab('student');
                setError('');
              }}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-xs font-bold transition-colors whitespace-nowrap ${
                roleTab === 'student'
                  ? 'bg-[#1d4d2b] text-white shadow-xs'
                  : 'text-[#18261c] hover:bg-white/60'
              }`}
            >
              <GraduationCap className="h-4 w-4 shrink-0" />
              <span>Pre-Service Student</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setRoleTab('teacher');
                setIsRegistering(false);
                setError('');
              }}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-xs font-bold transition-colors whitespace-nowrap ${
                roleTab === 'teacher'
                  ? 'bg-[#7a1a12] text-white shadow-xs'
                  : 'text-[#18261c] hover:bg-white/60'
              }`}
            >
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>Faculty / Teacher</span>
            </button>
          </div>

          {/* Manual Form */}
          <form onSubmit={handleManualSubmit} className="space-y-3">
            {isRegistering && roleTab === 'student' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-[#18261c] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Princess Mae Mendoza"
                    className="w-full rounded-lg border border-[#d5ded7] px-3 py-2 text-sm text-[#18261c] focus:border-[#1d4d2b] focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-[#18261c] mb-1">
                      Degree Program
                    </label>
                    <select
                      value={program}
                      onChange={(e) => setProgram(e.target.value)}
                      className="w-full rounded-lg border border-[#d5ded7] px-2.5 py-2 text-xs text-[#18261c] bg-white focus:border-[#1d4d2b] focus:outline-none"
                    >
                      <option value="Bachelor of Secondary Education · Major in English">
                        BSEd · Major in English
                      </option>
                      <option value="Bachelor of Elementary Education · Generalist">
                        BEEd · Generalist
                      </option>
                      <option value="Bachelor of Secondary Education · Major in Filipino">
                        BSEd · Major in Filipino
                      </option>
                      <option value="Bachelor of Secondary Education · Major in Mathematics">
                        BSEd · Major in Mathematics
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#18261c] mb-1">
                      Year Level
                    </label>
                    <select
                      value={yearLevel}
                      onChange={(e) => setYearLevel(e.target.value)}
                      className="w-full rounded-lg border border-[#d5ded7] px-2.5 py-2 text-xs text-[#18261c] bg-white focus:border-[#1d4d2b] focus:outline-none"
                    >
                      <option value="4th Year Pre-Service Teacher">4th Year Intern</option>
                      <option value="3rd Year Pre-Service Teacher">3rd Year Student</option>
                      <option value="2nd Year Pre-Service Teacher">2nd Year Student</option>
                      <option value="1st Year Pre-Service Teacher">1st Year Student</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-semibold text-[#18261c] mb-1">
                  {roleTab === 'teacher' ? 'Faculty / Admin ID' : 'Student ID Number'}
                </label>
                <input
                  type="text"
                  required
                  value={sid}
                  onChange={(e) => setSid(e.target.value)}
                  placeholder={roleTab === 'teacher' ? 'teacher' : 'e.g., 2026-00142'}
                  className="w-full rounded-lg border border-[#d5ded7] px-3 py-2 text-sm text-[#18261c] focus:border-[#1d4d2b] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#18261c] mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  placeholder={roleTab === 'teacher' ? 'admin123' : 'student123'}
                  className="w-full rounded-lg border border-[#d5ded7] px-3 py-2 text-sm text-[#18261c] focus:border-[#1d4d2b] focus:outline-none"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-[#fbe6e4] border border-[#b3392e]/30 px-3 py-2 text-xs font-medium text-[#b3392e]">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-[#1d4d2b] hover:bg-[#143a20] text-white font-bold py-2.5 px-4 text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {isRegistering && roleTab === 'student' ? (
                <>
                  <UserPlus className="h-4 w-4" />
                  <span>Register & Enter Course Modules</span>
                </>
              ) : (
                <>
                  <UserCheck className="h-4 w-4" />
                  <span>
                    {roleTab === 'teacher'
                      ? 'Enter Faculty Analytics Dashboard'
                      : 'Enter Course Modules & LMS'}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {roleTab === 'student' ? (
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setError('');
                }}
                className="text-xs font-bold text-[#1d4d2b] hover:underline"
              >
                {isRegistering
                  ? 'Already have a Student ID? Sign in here'
                  : 'New Pre-Service Teacher? Create a Student Account'}
              </button>
            </div>
          ) : (
            <p className="text-center text-xs text-[#5b6b60]">
              Default Faculty Login: ID <span className="font-mono font-semibold">teacher</span> ·
              Password <span className="font-mono font-semibold">admin123</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
