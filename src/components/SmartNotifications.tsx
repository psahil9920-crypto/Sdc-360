import React, { useState } from 'react';
import {
  Bell,
  Search,
  CheckCheck,
  Pin,
  Calendar,
  AlertTriangle,
  Award,
  BookOpen,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { CampusNotification, NotificationCategory } from '../types';

interface SmartNotificationsProps {
  notifications: CampusNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onOpenCodeCraft?: () => void;
}

export const SmartNotifications: React.FC<SmartNotificationsProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onOpenCodeCraft,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { label: string; value: string }[] = [
    { label: 'All Notices', value: 'all' },
    { label: '🚀 CodeCraft Club', value: 'CodeCraft' },
    { label: '📝 Exams & Schedules', value: 'Exam' },
    { label: '🎓 Academic', value: 'Academic' },
    { label: '🏢 Administration', value: 'Admin' },
    { label: '⚠️ Urgent Alerts', value: 'Urgent' },
  ];

  const filteredNotices = notifications.filter((notif) => {
    const matchesCategory = selectedCategory === 'all' || notif.category === selectedCategory;
    const matchesSearch =
      notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (cat: NotificationCategory) => {
    switch (cat) {
      case 'CodeCraft':
        return <Award className="w-4 h-4 text-indigo-500" />;
      case 'Exam':
        return <Calendar className="w-4 h-4 text-purple-500" />;
      case 'Academic':
        return <BookOpen className="w-4 h-4 text-blue-500" />;
      case 'Urgent':
        return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  const getCategoryBadgeClass = (cat: NotificationCategory) => {
    switch (cat) {
      case 'CodeCraft':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300';
      case 'Exam':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300';
      case 'Academic':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
      case 'Urgent':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-600 rounded-3xl p-6 text-white shadow-xl mb-6 relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold text-cyan-200 mb-2">
              <Bell className="w-3.5 h-3.5 text-amber-300" />
              <span>SMART NOTIFICATIONS HUB</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">Campus Announcements & Alerts</h1>
            <p className="text-sm text-blue-100 max-w-xl">
              Academic notices, practical examination timetables, CodeCraft Club initiatives, and administrative updates in one consolidated feed.
            </p>
          </div>

          <button
            onClick={onMarkAllAsRead}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All Read</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 mb-6 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search announcements, exams, guidelines, or departments..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
          />
        </div>

        {/* Filter categories */}
        <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none pt-1">
          {categories.map((c) => (
            <button
              key={c.value}
              onClick={() => setSelectedCategory(c.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === c.value
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-3">
        {filteredNotices.map((notif) => (
          <div
            key={notif.id}
            onClick={() => onMarkAsRead(notif.id)}
            className={`p-5 rounded-3xl border transition-all cursor-pointer ${
              notif.unread
                ? 'bg-blue-50/50 dark:bg-slate-800/80 border-blue-200 dark:border-blue-900/60 shadow-sm'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center space-x-2">
                <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                  {getCategoryIcon(notif.category)}
                </span>
                <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${getCategoryBadgeClass(notif.category)}`}>
                  {notif.category}
                </span>
                {notif.pinned && (
                  <span className="inline-flex items-center space-x-1 text-[11px] text-amber-600 dark:text-amber-400 font-bold">
                    <Pin className="w-3 h-3 fill-current" />
                    <span>PINNED</span>
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <span>{notif.timestamp}</span>
                {notif.unread && (
                  <span className="w-2 h-2 rounded-full bg-blue-600" title="Unread Notice" />
                )}
              </div>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              {notif.title}
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              {notif.content}
            </p>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span>Department: <strong className="text-slate-700 dark:text-slate-200">{notif.department}</strong></span>

              {notif.category === 'CodeCraft' && onOpenCodeCraft && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenCodeCraft();
                  }}
                  className="inline-flex items-center space-x-1 text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                >
                  <span>Explore CodeCraft 2030</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        ))}

        {filteredNotices.length === 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 text-center text-slate-400 border border-slate-200 dark:border-slate-800">
            No notices match this category or search filter.
          </div>
        )}
      </div>
    </div>
  );
};
