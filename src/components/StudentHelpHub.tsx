import React, { useState, useEffect } from 'react';
import {
  FolderOpen,
  Download,
  ExternalLink,
  Plus,
  Trash2,
  FileText,
  BookOpen,
  Phone,
  Shield,
  HelpCircle,
  Wifi,
  Sparkles,
  LogOut,
  Check,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { User } from 'firebase/auth';
import {
  googleSignIn,
  logout,
  getAccessToken,
  initAuth,
} from '../services/auth';
import {
  OFFICIAL_CAMPUS_DOCS,
  fetchUserDriveFiles,
  createDriveTextNote,
  deleteDriveFile,
} from '../services/drive';
import { DriveCampusFile, StudentProfile } from '../types';

interface StudentHelpHubProps {
  studentProfile: StudentProfile;
  isDriveConnected: boolean;
  setIsDriveConnected: (connected: boolean) => void;
}

export const StudentHelpHub: React.FC<StudentHelpHubProps> = ({
  studentProfile,
  isDriveConnected,
  setIsDriveConnected,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'drive' | 'repository' | 'info' | 'emergency'>('drive');
  const [user, setUser] = useState<User | null>(null);
  const [driveFiles, setDriveFiles] = useState<DriveCampusFile[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [showNewNoteModal, setShowNewNoteModal] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Initialize Auth
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        setIsDriveConnected(true);
        loadFiles();
      },
      () => {
        setUser(null);
        setIsDriveConnected(false);
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const loadFiles = async () => {
    setIsLoadingFiles(true);
    try {
      const files = await fetchUserDriveFiles();
      setDriveFiles(files);
    } catch (err) {
      console.error('Error loading files:', err);
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setIsDriveConnected(true);
        await loadFiles();
      }
    } catch (err) {
      console.error('Sign-in failed:', err);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    setUser(null);
    setIsDriveConnected(false);
    setDriveFiles([]);
  };

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim()) return;

    setIsSavingNote(true);
    try {
      const created = await createDriveTextNote(noteTitle, noteContent);
      if (created) {
        setDriveFiles((prev) => [created, ...prev]);
        setNoteTitle('');
        setNoteContent('');
        setShowNewNoteModal(false);
      }
    } catch (err: any) {
      alert(`Could not create note in Google Drive: ${err?.message || err}`);
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      await deleteDriveFile(fileId);
      setDriveFiles((prev) => prev.filter((f) => f.id !== fileId));
      setDeleteConfirmId(null);
    } catch (err: any) {
      alert(`Could not delete file from Google Drive: ${err?.message || err}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-6 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold text-cyan-200 mb-2">
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              <span>STUDENT HELP HUB & GOOGLE DRIVE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">Academic Resources & Cloud Repository</h1>
            <p className="text-sm text-blue-100 max-w-xl">
              Connect your Google Drive with permission to access, upload, and organize campus lecture notes, syllabus modules, past exam papers, and student records.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {isDriveConnected && user ? (
              <div className="flex items-center space-x-3 bg-white/15 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
                <div className="w-8 h-8 rounded-full bg-white text-blue-700 flex items-center justify-center font-bold text-xs">
                  {user.displayName?.charAt(0) || 'U'}
                </div>
                <div className="text-left text-xs">
                  <div className="font-bold text-white">{user.displayName}</div>
                  <div className="text-[11px] text-cyan-200">{user.email}</div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
                  title="Disconnect Google Drive"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3 mb-6 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveSubTab('drive')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'drive'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FolderOpen className="w-4 h-4" />
          <span>My Google Drive Files</span>
        </button>

        <button
          onClick={() => setActiveSubTab('repository')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'repository'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Official BCA Repository ({OFFICIAL_CAMPUS_DOCS.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('info')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'info'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Campus Info & FAQ</span>
        </button>

        <button
          onClick={() => setActiveSubTab('emergency')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'emergency'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Emergency SOS & Helpdesk</span>
        </button>
      </div>

      {/* 1. Google Drive Tab */}
      {activeSubTab === 'drive' && (
        <div className="space-y-6">
          {!isDriveConnected ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4">
                <FolderOpen className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Connect Your Google Drive
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
                Connect your Google account with permission to browse your academic materials, upload study notes, and link course files directly with SD CAMPUS 360.
              </p>

              {/* Official Google Sign-in Button with styling per Google guidelines */}
              <div className="inline-block">
                <button
                  onClick={handleSignIn}
                  disabled={isSigningIn}
                  className="flex items-center justify-center space-x-3 px-6 py-3 rounded-full border border-slate-300 dark:border-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm shadow-sm transition-all hover:shadow-md cursor-pointer"
                >
                  <svg className="w-5 h-5" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                  <span>{isSigningIn ? 'Connecting...' : 'Sign in with Google'}</span>
                </button>
              </div>

              <div className="mt-4 text-[11px] text-slate-400">
                SD Campus 360 uses Google Drive to store and sync your study notes with your explicit permission.
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Drive Action Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Google Drive Workspace: {user?.email}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Showing your Google Drive academic files and personal study notes.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={loadFiles}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold transition-colors"
                    title="Refresh Files"
                  >
                    Refresh
                  </button>
                  <button
                    onClick={() => setShowNewNoteModal(true)}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Study Note</span>
                  </button>
                </div>
              </div>

              {/* File List */}
              {isLoadingFiles ? (
                <div className="p-8 text-center text-slate-500">
                  <div className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-2" />
                  <p className="text-xs">Loading files from Google Drive...</p>
                </div>
              ) : driveFiles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {driveFiles.map((file) => (
                    <div
                      key={file.id}
                      className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:shadow-md transition-shadow relative"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600">
                            <FileText className="w-5 h-5" />
                          </div>
                          <button
                            onClick={() => setDeleteConfirmId(file.id)}
                            className="text-slate-400 hover:text-rose-500 p-1 rounded-md transition-colors"
                            title="Delete file"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 mb-1">
                          {file.name}
                        </h4>
                        <div className="text-[11px] text-slate-400">
                          {file.size || 'Drive Doc'} • {file.modifiedTime ? new Date(file.modifiedTime).toLocaleDateString() : 'Recent'}
                        </div>
                      </div>

                      <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-[10px] text-emerald-600 font-semibold">Google Drive</span>
                        {file.webViewLink && (
                          <a
                            href={file.webViewLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 text-xs text-blue-600 font-semibold hover:underline"
                          >
                            <span>Open in Drive</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                  <FolderOpen className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <p className="text-xs">No files found in Google Drive yet. Click "Create Study Note" to add one!</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 2. Official BCA Campus Repository */}
      {activeSubTab === 'repository' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Official SD College BCA Curriculum & Learning Repository
            </h3>
            <p className="text-xs text-slate-500">
              Approved syllabus modules, practical lab manuals, and previous examination question banks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {OFFICIAL_CAMPUS_DOCS.map((doc) => (
              <div
                key={doc.id}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3 shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                      {doc.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                      {doc.name}
                    </h4>
                    <div className="text-[11px] text-slate-400 mt-1">
                      {doc.semester} • {doc.size}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => alert(`Downloading ${doc.name} from SD College Repository...`)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 dark:bg-slate-800 dark:text-slate-300 transition-colors shrink-0"
                  title="Download Resource"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Campus Info & FAQ */}
      {activeSubTab === 'info' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center">
              <Wifi className="w-4 h-4 text-blue-600 mr-2" /> Campus Wi-Fi 7 Access
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Connect to SSID <strong>"SD-Campus-Secure"</strong> using your student credentials:
            </p>
            <ul className="text-xs text-slate-600 dark:text-slate-300 list-disc ml-5 space-y-1">
              <li>Identity / Username: Your College Roll No. (e.g. 2030-BCA-042)</li>
              <li>Password: Default date of birth (DDMMYYYY) or your updated portal password</li>
              <li>EAP Method: PEAP / MSCHAPv2</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center">
              <BookOpen className="w-4 h-4 text-emerald-600 mr-2" /> Central Library Pass & RFID
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Use your SD Smart Card at any of the RFID self-service turnstiles in Block C:
            </p>
            <ul className="text-xs text-slate-600 dark:text-slate-300 list-disc ml-5 space-y-1">
              <li>Borrowing limit: 6 books concurrently for up to 21 days</li>
              <li>Renewal: Automatic digital renewal available through Student Help Hub</li>
              <li>Study pods: Book online 2 hours in advance via the AI Campus Assistant</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center">
              <Clock className="w-4 h-4 text-purple-600 mr-2" /> Academic Timetable & Attendance
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Regular lectures commence at 9:00 AM. 75% minimum physical/smart-sensor attendance is mandatory for university examination eligibility.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center">
              <Sparkles className="w-4 h-4 text-amber-500 mr-2" /> SD CodeCraft Club Membership
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Meetings are held every Wednesday at 4:30 PM in the CodeCraft Innovation Cell (Block B-G08). Open to all BCA and computer science disciplines.
            </p>
          </div>
        </div>
      )}

      {/* 4. Emergency SOS & Helpline */}
      {activeSubTab === 'emergency' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center space-x-3 text-rose-600">
            <Shield className="w-8 h-8" />
            <div>
              <h3 className="text-lg font-bold">24/7 Campus Emergency & Helpline Directory</h3>
              <p className="text-xs text-slate-500">
                Direct contacts for on-campus medical, security, and student grievance cells.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs">
              <div className="font-bold text-rose-800 dark:text-rose-300 text-sm">Campus Medical & First Aid</div>
              <div className="text-slate-600 dark:text-slate-400 mt-1">Block E Ground Floor (Room E-G06)</div>
              <div className="font-mono font-bold text-rose-700 dark:text-rose-400 mt-2 text-base">
                Ext: 112 / +91 98765-43210
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
              <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">Campus Security Gate 1 & 2</div>
              <div className="text-slate-500 mt-1">Main Entrance Control Room</div>
              <div className="font-mono font-bold text-blue-600 mt-2 text-base">
                Ext: 100 / +91 98765-43211
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
              <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">Dean of Student Welfare</div>
              <div className="text-slate-500 mt-1">Prof. Meenakshi Saini (Block E)</div>
              <div className="font-mono font-bold text-blue-600 mt-2 text-base">
                Ext: 105 / dsw@sdcollege.edu
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
              <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">Women's Grievance Cell</div>
              <div className="text-slate-500 mt-1">Confidential 24/7 Helpline</div>
              <div className="font-mono font-bold text-purple-600 mt-2 text-base">
                Ext: 109 / +91 98765-43215
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
              <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">IT Helpdesk & Wi-Fi NOC</div>
              <div className="text-slate-500 mt-1">Block A-105 (Ramanujan Complex)</div>
              <div className="font-mono font-bold text-blue-600 mt-2 text-base">
                Ext: 410 / noc@sdcollege.edu
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create New Note in Google Drive Modal */}
      {showNewNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-5 text-white">
              <h3 className="text-base font-bold">Create Study Note in Google Drive</h3>
              <p className="text-xs text-blue-100">
                This document will be saved directly to your Google Drive account.
              </p>
            </div>

            <form onSubmit={handleCreateNote} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Note Title
                </label>
                <input
                  type="text"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="e.g. BCA 6th Sem - Cloud Computing Lecture 4 Notes"
                  required
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Note Content / Summary
                </label>
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  rows={4}
                  required
                  placeholder="Type or paste your study notes, formulas, or key concepts..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewNoteModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingNote}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20"
                >
                  {isSavingNote ? 'Saving to Drive...' : 'Save to Google Drive'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog (MANDATORY per Workspace skill!) */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-sm w-full border border-slate-200 dark:border-slate-800 p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Delete file from Google Drive?
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              This action will permanently remove this file from your Google Drive. This operation cannot be undone.
            </p>
            <div className="flex items-center justify-center space-x-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteFile(deleteConfirmId)}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
