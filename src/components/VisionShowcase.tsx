import React from 'react';
import {
  Sparkles,
  AlertTriangle,
  Lightbulb,
  Cpu,
  Layers,
  CheckCircle,
  TrendingUp,
  Award,
  ArrowRight,
  Shield,
  Zap,
  Globe,
  Radio,
  BookOpen,
} from 'lucide-react';
import { StudentProfile } from '../types';

interface VisionShowcaseProps {
  studentProfile: StudentProfile;
  onEditProfile: () => void;
}

export const VisionShowcase: React.FC<VisionShowcaseProps> = ({
  studentProfile,
  onEditProfile,
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
      {/* Hero Grand Vision */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-950 p-8 sm:p-12 text-white border border-indigo-900/60 shadow-2xl">
        <div className="absolute right-0 top-0 -translate-y-1/3 translate-x-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>BUILD SD COLLEGE 2030</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            SD CAMPUS 360
          </h1>

          <p className="text-lg sm:text-xl font-medium text-cyan-200">
            One Smart Campus. One Connected Experience.
          </p>

          <p className="text-xs sm:text-sm text-slate-300 italic tracking-widest uppercase">
            Imagine • Innovate • Transform
          </p>

          <div className="pt-4 flex justify-center">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 max-w-xl text-left text-xs text-slate-200 leading-relaxed italic">
              "By 2030, SD College should not only be a place where technology is taught — it should be a place where technology improves everyday campus life."
            </div>
          </div>
        </div>
      </div>

      {/* 01 | The Problem vs 02 | Our Idea */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Problem Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/40 shadow-sm space-y-4">
          <div className="flex items-center space-x-3 text-rose-600 dark:text-rose-400">
            <span className="px-2.5 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950 font-bold text-xs">
              01 | THE PROBLEM
            </span>
            <AlertTriangle className="w-5 h-5" />
          </div>

          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Today's Fragmented Campus Experience
          </h3>

          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 list-disc ml-5">
            <li>Information scattered across isolated groups, noticeboards, and messaging channels</li>
            <li>Difficulty finding classrooms, laboratories, and specialized campus facilities</li>
            <li>Students missing critical academic notices, fees, or exam deadlines</li>
            <li>Slow and unorganized reporting of lab equipment and classroom maintenance</li>
            <li>Difficulty getting immediate answers to frequent college questions</li>
            <li>Limited real-time communication between students and administration</li>
          </ul>

          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-300 text-xs font-semibold">
            THE QUESTION: What if the entire campus could respond intelligently to student needs?
          </div>
        </div>

        {/* Idea Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/40 shadow-sm space-y-4">
          <div className="flex items-center space-x-3 text-blue-600 dark:text-blue-400">
            <span className="px-2.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 font-bold text-xs">
              02 | OUR IDEA
            </span>
            <Lightbulb className="w-5 h-5 text-amber-500" />
          </div>

          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            SD CAMPUS 360: The Unified Digital Layer
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            A unified AI-powered Smart Campus Platform that establishes a live digital bridge interconnecting:
          </p>

          <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/60 dark:to-indigo-950/60 text-blue-900 dark:text-blue-200 text-xs font-bold text-center border border-blue-200 dark:border-blue-900">
            STUDENTS + TEACHERS + CLASSROOMS + LABS + ADMINISTRATION
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Students access services via a mobile/web interface, while departments operate a smart triage dashboard with automated routing and closed-loop communication.
          </p>
        </div>
      </div>

      {/* 03 | How It Works & Closed-Loop Engine */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center space-x-3 text-indigo-600">
          <span className="px-2.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 font-bold text-xs">
            03 | HOW IT WORKS
          </span>
          <Cpu className="w-5 h-5" />
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Closed-Loop Campus Communication System
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="font-bold text-slate-900 dark:text-white mb-1">STUDENT</div>
            <p className="text-slate-500">Opens SD Campus 360 on web or mobile</p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900">
            <div className="font-bold text-blue-700 dark:text-blue-300 mb-1">AI ASSISTANT</div>
            <p className="text-blue-900 dark:text-blue-200">Ask • Report • Find • Track • Learn</p>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900">
            <div className="font-bold text-indigo-700 dark:text-indigo-300 mb-1">SMART ROUTING</div>
            <p className="text-indigo-900 dark:text-indigo-200">Automated triage to responsible department</p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900">
            <div className="font-bold text-amber-700 dark:text-amber-300 mb-1">STAFF ACTION</div>
            <p className="text-amber-900 dark:text-amber-200">Technician dispatched & work updated</p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900">
            <div className="font-bold text-emerald-700 dark:text-emerald-300 mb-1">STATUS DELIVERED</div>
            <p className="text-emerald-900 dark:text-emerald-200">Student receives real-time verification!</p>
          </div>
        </div>
      </div>

      {/* 06 | Impact on SD College 2030 */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center space-x-3 text-cyan-600">
          <span className="px-2.5 py-0.5 rounded-md bg-cyan-100 dark:bg-cyan-950 font-bold text-xs">
            06 | IMPACT ON SD COLLEGE 2030
          </span>
          <TrendingUp className="w-5 h-5" />
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Transforming Every Dimension of Campus Life
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <div className="font-bold text-blue-600 dark:text-blue-400">👨🎓 Better Student Experience</div>
            <p className="text-slate-600 dark:text-slate-300">Instant access to schedules, notes, and transparent issue resolution.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <div className="font-bold text-indigo-600 dark:text-indigo-400">👩🏫 Better Teaching & Learning</div>
            <p className="text-slate-600 dark:text-slate-300">Faculty focus on pedagogy; classroom AV repairs happen within hours.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <div className="font-bold text-purple-600 dark:text-purple-400">🏢 Organized Administration</div>
            <p className="text-slate-600 dark:text-slate-300">Digital telemetry eliminates paper forms, loss of complaints, and delays.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <div className="font-bold text-emerald-600 dark:text-emerald-400">🌱 Smarter & Greener Campus</div>
            <p className="text-slate-600 dark:text-slate-300">Reduces unnecessary paperwork, physical office visits, and energy waste.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <div className="font-bold text-amber-600 dark:text-amber-400">💬 Unified Communication</div>
            <p className="text-slate-600 dark:text-slate-300">Official, verified notices reach all students simultaneously.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <div className="font-bold text-rose-600 dark:text-rose-400">🤝 Active Student Community</div>
            <p className="text-slate-600 dark:text-slate-300">Fosters a participatory culture where students improve their college together.</p>
          </div>
        </div>
      </div>

      {/* 08 | Future Scope & Student / CodeCraft Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Future Scope */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-purple-600">
            <span className="px-2.5 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 font-bold text-xs">
              08 | FUTURE SCOPE
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            SD SMART CAMPUS 2030 Roadmap
          </h3>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc ml-5">
            <li>📍 <strong>Indoor BLE Navigation</strong>: Sub-meter real-time floor pathfinding</li>
            <li>🤖 <strong>Autonomous Agent Assistant</strong>: Self-scheduling lab slots and library books</li>
            <li>♻️ <strong>Smart Energy & Waste Sensors</strong>: Real-time solar micro-grid telemetry</li>
            <li>🔐 <strong>Decentralized Student ID</strong>: Zero-knowledge verification for exams & gate access</li>
            <li>🌐 <strong>Connected Smart Classrooms</strong>: Automated lecture transcription & instant Drive uploads</li>
          </ul>
        </div>

        {/* Student Details & CodeCraft Club Emblem */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-xl space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-md bg-white/20 text-cyan-200 text-xs font-bold">
              STUDENT DETAILS & CREDITS
            </span>
            <button
              onClick={onEditProfile}
              className="text-xs text-indigo-300 hover:text-white underline"
            >
              Edit Details
            </button>
          </div>

          <div className="space-y-1 text-xs font-mono">
            <div><span className="text-slate-400">Name:</span> <strong>{studentProfile.name}</strong></div>
            <div><span className="text-slate-400">Roll No.:</span> <strong>{studentProfile.rollNo}</strong></div>
            <div><span className="text-slate-400">Programme:</span> <strong>{studentProfile.programme}</strong></div>
            <div><span className="text-slate-400">Semester:</span> <strong>{studentProfile.semester}</strong> ({studentProfile.section})</div>
          </div>

          <div className="pt-4 border-t border-white/15">
            <div className="text-[11px] text-indigo-300 font-bold tracking-wider">
              SD CODECRAFT CLUB
            </div>
            <div className="text-xs font-extrabold text-cyan-300 tracking-widest mt-0.5">
              CODE • CREATE • COMPETE • INNOVATE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
