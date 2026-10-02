import React from 'react';
import {
  Compass,
  MessageSquare,
  MapPin,
  AlertCircle,
  Bell,
  LayoutDashboard,
  FolderOpen,
  Sparkles,
  ShieldCheck,
  UserCheck,
  Edit3,
  Wifi,
} from 'lucide-react';
import { StudentProfile } from '../types';

export type ActiveTab =
  | 'assistant'
  | 'map'
  | 'report'
  | 'notifications'
  | 'dashboard'
  | 'help-hub'
  | 'vision';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isAdminMode: boolean;
  setIsAdminMode: (isAdmin: boolean) => void;
  studentProfile: StudentProfile;
  onEditProfile: () => void;
  unreadCount: number;
  activeTicketCount: number;
  isDriveConnected: boolean;
  onOpenDriveAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isAdminMode,
  setIsAdminMode,
  studentProfile,
  onEditProfile,
  unreadCount,
  activeTicketCount,
  isDriveConnected,
  onOpenDriveAuth,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      {/* Top Banner: SD College 2030 & CodeCraft Club */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white px-4 py-1.5 text-xs flex flex-wrap items-center justify-between border-b border-indigo-900/40">
        <div className="flex items-center space-x-3">
          <span className="font-bold tracking-wider text-blue-400">BUILD SD COLLEGE 2030</span>
          <span className="text-slate-400 hidden sm:inline">•</span>
          <span className="text-slate-300 font-medium hidden sm:inline">One Smart Campus. One Connected Experience.</span>
          <span className="text-slate-400 hidden md:inline">•</span>
          <span className="text-cyan-300 italic hidden md:inline">Imagine • Innovate • Transform</span>
        </div>

        <div className="flex items-center space-x-3 ml-auto">
          {/* SD CodeCraft Club pill */}
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>SD CODECRAFT CLUB</span>
            <span className="text-indigo-400 hidden lg:inline">| CODE • CREATE • COMPETE • INNOVATE</span>
          </div>

          {/* Real-time telemetry */}
          <div className="hidden lg:flex items-center space-x-1.5 text-slate-300 text-[11px]">
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <span>Campus Net: 99.8% Online</span>
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('assistant')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-600 dark:from-blue-400 dark:via-indigo-300 dark:to-cyan-300 bg-clip-text text-transparent">
                  SD CAMPUS 360
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                  2030
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Sanatan Dharma Smart Campus System
              </p>
            </div>
          </div>

          {/* Student Info Card & Mode Switcher */}
          <div className="flex items-center space-x-3">
            {/* Google Drive Status indicator */}
            <button
              onClick={onOpenDriveAuth}
              className={`hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                isDriveConnected
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
              }`}
              title="Google Drive Sync for BCA Course Notes & Documents"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>{isDriveConnected ? 'Drive Connected' : 'Google Drive'}</span>
            </button>

            {/* Student ID Card Quick Preview */}
            <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                {studentProfile.name.charAt(0)}
              </div>
              <div className="leading-tight text-left">
                <div className="font-semibold text-slate-900 dark:text-white flex items-center space-x-1">
                  <span>{studentProfile.name}</span>
                  <button
                    onClick={onEditProfile}
                    className="text-slate-400 hover:text-blue-600 transition-colors"
                    title="Edit Student Info"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  {studentProfile.rollNo} • {studentProfile.programme}
                </div>
              </div>
            </div>

            {/* Role Switcher: Student vs Admin Mode */}
            <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setIsAdminMode(false)}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  !isAdminMode
                    ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Student</span>
              </button>
              <button
                onClick={() => {
                  setIsAdminMode(true);
                  setActiveTab('dashboard');
                }}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isAdminMode
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin / Staff</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Bar Tabs */}
        <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('assistant')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'assistant'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>AI Campus Assistant</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'map'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Smart Campus Map</span>
          </button>

          <button
            onClick={() => setActiveTab('report')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all relative ${
              activeTab === 'report'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            <span>Report & Track</span>
            {activeTicketCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                {activeTicketCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all relative ${
              activeTab === 'notifications'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Smart Notifications</span>
            {unreadCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'dashboard'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Admin Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('help-hub')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'help-hub'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            <span>Student Help Hub & Drive</span>
          </button>

          <button
            onClick={() => setActiveTab('vision')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'vision'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>2030 Vision & Feasibility</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
