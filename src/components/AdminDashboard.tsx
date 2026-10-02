import React, { useState } from 'react';
import {
  LayoutDashboard,
  CheckCircle,
  Clock,
  AlertTriangle,
  UserCheck,
  Send,
  Building,
  Server,
  Wifi,
  Zap,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { CampusTicket, CampusNotification, TicketStatus } from '../types';

interface AdminDashboardProps {
  tickets: CampusTicket[];
  onUpdateTicketStatus: (
    ticketId: string,
    newStatus: TicketStatus,
    resolutionNote?: string,
    technicianName?: string
  ) => void;
  onBroadcastNotification: (notification: CampusNotification) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  tickets,
  onUpdateTicketStatus,
  onBroadcastNotification,
}) => {
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [activeTicketId, setActiveTicketId] = useState<string | null>(tickets[0]?.id || null);
  const [resolutionInput, setResolutionInput] = useState('');
  const [technicianInput, setTechnicianInput] = useState('');
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);

  // Broadcast state
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeCategory, setNoticeCategory] = useState<'Academic' | 'Exam' | 'Admin' | 'CodeCraft' | 'Urgent'>('Admin');
  const [noticeDept, setNoticeDept] = useState('Campus Administration');

  const departments = [
    'All',
    'IT & Computer Labs',
    'Estate & Maintenance',
    'Electrical & Air Conditioning',
    'Facilities & Sanitation',
    'Library Administration',
  ];

  const filteredTickets = tickets.filter((t) =>
    selectedDept === 'All' ? true : t.department === selectedDept
  );

  const activeTicket = tickets.find((t) => t.id === activeTicketId);

  // Calculate Metrics
  const total = tickets.length;
  const resolved = tickets.filter((t) => t.status === 'Resolved').length;
  const inProgress = tickets.filter((t) => t.status === 'In Progress' || t.status === 'Assigned').length;
  const pending = tickets.filter((t) => t.status === 'Pending').length;
  const resolvedPercent = total > 0 ? Math.round((resolved / total) * 100) : 100;

  const handleStatusChange = (status: TicketStatus) => {
    if (!activeTicket) return;
    onUpdateTicketStatus(
      activeTicket.id,
      status,
      resolutionInput.trim() || undefined,
      technicianInput.trim() || undefined
    );
    setResolutionInput('');
  };

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeContent.trim()) return;

    const newNotice: CampusNotification = {
      id: `notif-admin-${Date.now()}`,
      title: noticeTitle,
      content: noticeContent,
      category: noticeCategory,
      timestamp: 'Just now',
      pinned: noticeCategory === 'Urgent',
      unread: true,
      department: noticeDept,
    };

    onBroadcastNotification(newNotice);
    setNoticeTitle('');
    setNoticeContent('');
    setShowBroadcastModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-6 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold text-indigo-200 mb-2">
              <LayoutDashboard className="w-3.5 h-3.5 text-cyan-300" />
              <span>ADMIN & DEPARTMENT SMART CONSOLE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">Campus Operations & Closed-Loop Control</h1>
            <p className="text-sm text-indigo-100 max-w-xl">
              Monitor campus service telemetry, dispatch technician work-orders, update issue resolution states, and broadcast instant notices.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowBroadcastModal(true)}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Broadcast Notice</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-semibold text-slate-400">Total Logged Tickets</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{total}</div>
          <div className="text-[11px] text-blue-600 dark:text-blue-400 mt-1 font-medium">
            Across 5 Campus Divisions
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-semibold text-slate-400">Active Work Orders</div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            {inProgress + pending}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {pending} Pending • {inProgress} Dispatched
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-semibold text-slate-400">Resolution SLA Rate</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {resolvedPercent}%
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
            Avg Turnaround: ~1.8 Hours
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-semibold text-slate-400">Campus IoT Grid Uptime</div>
          <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400 mt-1">99.8%</div>
          <div className="text-[11px] text-cyan-600 dark:text-cyan-400 mt-1">Solar + Wi-Fi 7 + Smart Edge</div>
        </div>
      </div>

      {/* Department Filter Strip */}
      <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none mb-6 pb-1">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">
          Department:
        </span>
        {departments.map((dept) => (
          <button
            key={dept}
            onClick={() => setSelectedDept(dept)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedDept === dept
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* Main Admin Console: Ticket Queue & Detail/Resolution Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Ticket Queue (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col h-[560px]">
          <div className="flex items-center justify-between mb-3 px-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Service Tickets ({filteredTickets.length})
            </h3>
            <span className="text-xs text-slate-400">Click to triage</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredTickets.map((t) => {
              const isSelected = t.id === activeTicketId;
              return (
                <div
                  key={t.id}
                  onClick={() => {
                    setActiveTicketId(t.id);
                    setTechnicianInput(t.assignedTechnician || '');
                  }}
                  className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-700 shadow-sm'
                      : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                      {t.id}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        t.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : t.status === 'In Progress'
                          ? 'bg-cyan-100 text-cyan-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>

                  <div className="font-semibold text-slate-900 dark:text-white truncate mb-1">
                    {t.title}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{t.location}</span>
                    <span>{t.priority} Priority</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ticket Action & Closed-Loop Dispatch (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
          {activeTicket ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      {activeTicket.id}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-xs font-semibold">
                      {activeTicket.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                    {activeTicket.title}
                  </h3>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                  {activeTicket.status}
                </span>
              </div>

              <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800 p-3.5 rounded-2xl">
                {activeTicket.description}
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <span className="text-slate-400">Reported By:</span>{' '}
                  <strong className="text-slate-800 dark:text-slate-200">{activeTicket.reportedBy}</strong> ({activeTicket.studentRollNo})
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <span className="text-slate-400">Location:</span>{' '}
                  <strong className="text-slate-800 dark:text-slate-200">{activeTicket.location}</strong>
                </div>
              </div>

              {/* Technician Assignment */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Assign Technician / Staff
                </label>
                <input
                  type="text"
                  value={technicianInput}
                  onChange={(e) => setTechnicianInput(e.target.value)}
                  placeholder="e.g. Rajesh Verma (AV Specialist), Arvind Kapoor (NOC)"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                />
              </div>

              {/* Closed-Loop Resolution Notes input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Closed-Loop Status Note (Sent in Real-Time to Student)
                </label>
                <textarea
                  value={resolutionInput}
                  onChange={(e) => setResolutionInput(e.target.value)}
                  rows={2}
                  placeholder="Enter status update or resolution details for the student..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                />
              </div>

              {/* Action Buttons to update ticket status */}
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleStatusChange('Assigned')}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/60 dark:text-indigo-300"
                >
                  Mark as Assigned
                </button>
                <button
                  onClick={() => handleStatusChange('In Progress')}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-cyan-600 text-white hover:bg-cyan-700"
                >
                  Set In Progress
                </button>
                <button
                  onClick={() => handleStatusChange('Resolved')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                >
                  Resolve & Close Ticket
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400 text-sm">
              Select a ticket from the left queue to view details and dispatch technician action.
            </div>
          )}
        </div>
      </div>

      {/* Broadcast Announcement Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-5 text-white">
              <h3 className="text-base font-bold">Broadcast Campus Announcement</h3>
              <p className="text-xs text-blue-100">
                Pushes instant alert to all student mobile and web apps.
              </p>
            </div>

            <form onSubmit={handleBroadcastSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Notice Title
                </label>
                <input
                  type="text"
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  placeholder="e.g. Wi-Fi Maintenance Schedule or Class Relocation"
                  required
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Category
                  </label>
                  <select
                    value={noticeCategory}
                    onChange={(e) => setNoticeCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                  >
                    <option value="Admin">Administration</option>
                    <option value="Academic">Academic</option>
                    <option value="Exam">Exam Cell</option>
                    <option value="CodeCraft">CodeCraft Club</option>
                    <option value="Urgent">Urgent Alert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={noticeDept}
                    onChange={(e) => setNoticeDept(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Announcement Details
                </label>
                <textarea
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
                  rows={3}
                  required
                  placeholder="Provide the complete message for the campus community..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20"
                >
                  Send Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
