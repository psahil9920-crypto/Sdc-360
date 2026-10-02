import React, { useState } from 'react';
import {
  AlertCircle,
  Plus,
  Clock,
  CheckCircle2,
  Wrench,
  ThumbsUp,
  Sparkles,
  ArrowRight,
  Filter,
  Search,
  Building,
  UserCheck,
  Check,
  Send,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CampusTicket, IssueCategory, StudentProfile, CampusLocation } from '../types';

interface ReportAndTrackProps {
  tickets: CampusTicket[];
  locations: CampusLocation[];
  studentProfile: StudentProfile;
  onAddTicket: (ticket: CampusTicket) => void;
  onUpvoteTicket: (ticketId: string) => void;
  prefilledTitle?: string;
  prefilledLocation?: string;
}

export const ReportAndTrack: React.FC<ReportAndTrackProps> = ({
  tickets,
  locations,
  studentProfile,
  onAddTicket,
  onUpvoteTicket,
  prefilledTitle = '',
  prefilledLocation = '',
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'my' | 'pending' | 'in_progress' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showNewModal, setShowNewModal] = useState(false);

  // Form State
  const [title, setTitle] = useState(prefilledTitle);
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState(prefilledLocation || locations[0]?.name || 'Alan Turing Memorial Lecture Hall');
  const [category, setCategory] = useState<IssueCategory>('Equipment & Hardware');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [isTriaging, setIsTriaging] = useState(false);
  const [aiTriageResult, setAiTriageResult] = useState<{
    department: string;
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    estimatedResolutionHours: number;
    immediateAction: string;
    technicianRole: string;
  } | null>(null);

  const categories: IssueCategory[] = [
    'Equipment & Hardware',
    'Classroom Maintenance',
    'Wi-Fi & Network',
    'Electrical & AC',
    'Cleanliness & Sanitation',
    'Library Services',
  ];

  const handleAiSmartTriage = async () => {
    if (!title.trim()) return;
    setIsTriaging(true);

    try {
      const res = await fetch('/api/ai/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          location: locationName,
          category,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.triage) {
          setAiTriageResult(data.triage);
          setPriority(data.triage.priority);
        }
      }
    } catch (err) {
      console.error('Triage error:', err);
    } finally {
      setIsTriaging(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const matchedLocation = locations.find((l) => l.name === locationName);
    const block = matchedLocation ? matchedLocation.block : 'Block B';

    const newTicket: CampusTicket = {
      id: `TICK-2030-${Math.floor(100 + Math.random() * 900)}`,
      title,
      description,
      category,
      location: locationName,
      block,
      priority,
      status: 'Pending',
      reportedBy: studentProfile.name,
      studentRollNo: studentProfile.rollNo,
      reportedAt: 'Just now',
      updatedAt: 'Just now',
      department: aiTriageResult?.department || 'IT & Computer Labs',
      technicianRole: aiTriageResult?.technicianRole,
      resolutionNotes: aiTriageResult?.immediateAction || 'Ticket queued for smart routing and automated department dispatch.',
      estimatedResolutionHours: aiTriageResult?.estimatedResolutionHours || 4,
      upvotes: 1,
      userUpvoted: true,
    };

    onAddTicket(newTicket);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
    });

    // Reset & close
    setTitle('');
    setDescription('');
    setAiTriageResult(null);
    setShowNewModal(false);
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;

    if (filterTab === 'my') {
      return matchesSearch && matchesCategory && (t.studentRollNo === studentProfile.rollNo || t.reportedBy === studentProfile.name);
    }
    if (filterTab === 'pending') {
      return matchesSearch && matchesCategory && t.status === 'Pending';
    }
    if (filterTab === 'in_progress') {
      return matchesSearch && matchesCategory && (t.status === 'In Progress' || t.status === 'Assigned');
    }
    if (filterTab === 'resolved') {
      return matchesSearch && matchesCategory && t.status === 'Resolved';
    }
    return matchesSearch && matchesCategory;
  });

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'Critical':
        return 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-rose-200';
      case 'High':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200';
      case 'Medium':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200';
    }
  };

  const getStatusBadge = (s: string) => {
    switch (s) {
      case 'Resolved':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300';
      case 'In Progress':
        return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 border-cyan-300';
      case 'Assigned':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-300';
      default:
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-600 rounded-3xl p-6 text-white shadow-xl mb-6 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold text-cyan-200 mb-2">
              <Wrench className="w-3.5 h-3.5 text-amber-300" />
              <span>REPORT & TRACK • CLOSED-LOOP RESOLUTION</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">Campus Issue Dispatch & Tracking</h1>
            <p className="text-sm text-blue-100 max-w-xl">
              Report equipment faults, classroom maintenance, or Wi-Fi drops. Our AI routes directly to responsible departments with real-time status updates back to you.
            </p>
          </div>

          <button
            onClick={() => setShowNewModal(true)}
            className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-white text-blue-800 hover:bg-blue-50 font-bold text-sm shadow-lg transition-transform hover:scale-105"
          >
            <Plus className="w-5 h-5 text-blue-600" />
            <span>Report New Issue</span>
          </button>
        </div>
      </div>

      {/* Closed Loop Visual Indicator Strip */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 mb-6">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Closed-Loop Campus Communication Flow:
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-medium border border-blue-200 dark:border-blue-900">
            1. Student Reports
          </div>
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-medium border border-indigo-200 dark:border-indigo-900">
            2. Smart AI Routing
          </div>
          <div className="p-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 font-medium border border-cyan-200 dark:border-cyan-900">
            3. Department Dispatched
          </div>
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-medium border border-amber-200 dark:border-amber-900">
            4. Tech Takes Action
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-medium border border-emerald-200 dark:border-emerald-900">
            5. Student Gets Status!
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 mb-6 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tickets by ID, room, department, or keywords..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
            />
          </div>

          <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                filterTab === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              All Tickets ({tickets.length})
            </button>
            <button
              onClick={() => setFilterTab('my')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                filterTab === 'my'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              My Reported
            </button>
            <button
              onClick={() => setFilterTab('in_progress')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                filterTab === 'in_progress'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setFilterTab('resolved')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                filterTab === 'resolved'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Resolved
            </button>
          </div>
        </div>

        {/* Category filter pills */}
        <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-400 shrink-0 font-medium">Category:</span>
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-xs transition-colors shrink-0 ${
              categoryFilter === 'all'
                ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 font-semibold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs transition-colors shrink-0 ${
                categoryFilter === cat
                  ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Ticket Cards Grid */}
      <div className="space-y-4">
        {filteredTickets.map((ticket) => {
          // Closed loop stages
          const stages = [
            { label: 'Reported', completed: true },
            { label: 'AI Routed', completed: ticket.status !== 'Pending' || !!ticket.department },
            { label: 'Assigned / In Progress', completed: ticket.status === 'In Progress' || ticket.status === 'Resolved' },
            { label: 'Resolved & Closed', completed: ticket.status === 'Resolved' },
          ];

          return (
            <div
              key={ticket.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 dark:border-slate-800 transition-all hover:shadow-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono font-bold">
                    {ticket.id}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(ticket.status)}`}>
                    {ticket.status}
                  </span>
                  <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${getPriorityBadge(ticket.priority)}`}>
                    {ticket.priority} Priority
                  </span>
                </div>

                <div className="text-xs text-slate-400">
                  Reported {ticket.reportedAt} • {ticket.reportedBy} ({ticket.studentRollNo})
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
                {ticket.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                {ticket.description}
              </p>

              {/* Location & Department Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs mb-4">
                <div>
                  <span className="text-slate-400">Location: </span>
                  <strong className="text-slate-800 dark:text-slate-200">{ticket.location}</strong> ({ticket.block})
                </div>
                <div>
                  <span className="text-slate-400">Responsible Dept: </span>
                  <strong className="text-blue-600 dark:text-blue-400">{ticket.department}</strong>
                </div>
                {ticket.assignedTechnician && (
                  <div>
                    <span className="text-slate-400">Assigned To: </span>
                    <strong className="text-slate-800 dark:text-slate-200">{ticket.assignedTechnician}</strong>
                  </div>
                )}
              </div>

              {/* Resolution Notes / Closed-Loop Feedback */}
              {ticket.resolutionNotes && (
                <div className="p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs mb-4">
                  <div className="font-semibold text-blue-900 dark:text-blue-300 flex items-center mb-0.5">
                    <UserCheck className="w-3.5 h-3.5 mr-1" />
                    <span>Closed-Loop Update from Department:</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">{ticket.resolutionNotes}</p>
                </div>
              )}

              {/* 4-Stage Progress Tracker Bar */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="grid grid-cols-4 gap-1 text-center text-[10px] sm:text-xs">
                  {stages.map((stage, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold mb-1 transition-colors ${
                          stage.completed
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                        }`}
                      >
                        {stage.completed ? <Check className="w-3.5 h-3.5" /> : i + 1}
                      </div>
                      <span className={`truncate w-full ${stage.completed ? 'font-semibold text-emerald-700 dark:text-emerald-400' : 'text-slate-400'}`}>
                        {stage.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upvote & Action Bar */}
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <button
                  onClick={() => onUpvoteTicket(ticket.id)}
                  className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-medium transition-colors ${
                    ticket.userUpvoted
                      ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                  title="Upvote if this issue impacts you too"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Me Too ({ticket.upvotes})</span>
                </button>

                <span className="text-slate-400 text-[11px]">
                  Estimated SLA: ~{ticket.estimatedResolutionHours || 4} hours
                </span>
              </div>
            </div>
          );
        })}

        {filteredTickets.length === 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 text-center border border-slate-200 dark:border-slate-800 text-slate-500">
            <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">No issues found</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              Either all campus systems in this filter are operating normally or no matching reports exist.
            </p>
          </div>
        )}
      </div>

      {/* New Report Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-600 px-6 py-5 text-white">
              <h3 className="text-lg font-bold">Report Campus Maintenance or Issue</h3>
              <p className="text-xs text-blue-100">
                SD Campus 360 AI Smart Triage automatically notifies the right department.
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Issue Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Projector HDMI flickers in Turing Lecture Hall"
                  required
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as IssueCategory)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Campus Location
                  </label>
                  <select
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                  >
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.name}>
                        {loc.name} ({loc.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Detailed Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Describe the problem, when it occurred, and any error message or symptoms..."
                  required
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white"
                />
              </div>

              {/* AI Smart Triage Button */}
              <div className="p-3 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-indigo-900 dark:text-indigo-300">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>AI Smart Triage & Auto-Routing</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAiSmartTriage}
                    disabled={!title.trim() || isTriaging}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-xs"
                  >
                    {isTriaging ? 'Analyzing...' : 'Run Smart Triage'}
                  </button>
                </div>

                {aiTriageResult ? (
                  <div className="space-y-1 text-xs text-indigo-950 dark:text-indigo-200">
                    <div>
                      <strong>Target Department:</strong> {aiTriageResult.department}
                    </div>
                    <div>
                      <strong>Suggested Priority:</strong> {aiTriageResult.priority} (SLA: ~{aiTriageResult.estimatedResolutionHours}h)
                    </div>
                    <div>
                      <strong>Technician Role:</strong> {aiTriageResult.technicianRole}
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 italic">
                      "{aiTriageResult.immediateAction}"
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Click "Run Smart Triage" to allow Gemini to categorize your issue and route it instantly.
                  </p>
                )}
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Ticket</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
