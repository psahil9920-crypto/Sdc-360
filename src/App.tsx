import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { AiAssistant } from './components/AiAssistant';
import { SmartCampusMap } from './components/SmartCampusMap';
import { ReportAndTrack } from './components/ReportAndTrack';
import { SmartNotifications } from './components/SmartNotifications';
import { AdminDashboard } from './components/AdminDashboard';
import { StudentHelpHub } from './components/StudentHelpHub';
import { VisionShowcase } from './components/VisionShowcase';
import { StudentProfileModal } from './components/StudentProfileModal';

import {
  CAMPUS_LOCATIONS,
  INITIAL_TICKETS,
  INITIAL_NOTIFICATIONS,
  INITIAL_STUDENT_PROFILE,
} from './data/mockData';
import {
  CampusTicket,
  CampusNotification,
  StudentProfile,
  TicketStatus,
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('assistant');
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);

  // Student Profile
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('sd_student_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_STUDENT_PROFILE;
      }
    }
    return INITIAL_STUDENT_PROFILE;
  });

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Tickets
  const [tickets, setTickets] = useState<CampusTicket[]>(() => {
    const saved = localStorage.getItem('sd_campus_tickets');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_TICKETS;
      }
    }
    return INITIAL_TICKETS;
  });

  // Notifications
  const [notifications, setNotifications] = useState<CampusNotification[]>(() => {
    const saved = localStorage.getItem('sd_campus_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_NOTIFICATIONS;
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Cross-component prefill states
  const [selectedMapLocation, setSelectedMapLocation] = useState<string>('');
  const [prefilledReportTitle, setPrefilledReportTitle] = useState<string>('');
  const [prefilledReportLocation, setPrefilledReportLocation] = useState<string>('');

  // Google Drive state
  const [isDriveConnected, setIsDriveConnected] = useState<boolean>(false);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('sd_student_profile', JSON.stringify(studentProfile));
  }, [studentProfile]);

  useEffect(() => {
    localStorage.setItem('sd_campus_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('sd_campus_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Ticket actions
  const handleAddTicket = (newTicket: CampusTicket) => {
    setTickets((prev) => [newTicket, ...prev]);

    // Also push an automated notification confirming student's ticket submission
    const confirmNotif: CampusNotification = {
      id: `notif-auto-${Date.now()}`,
      title: `🛠️ Ticket Created: ${newTicket.title}`,
      content: `Your issue in ${newTicket.location} has been registered and auto-routed to ${newTicket.department}. Ticket ID: ${newTicket.id}`,
      category: 'Admin',
      timestamp: 'Just now',
      pinned: false,
      unread: true,
      department: newTicket.department,
    };
    setNotifications((prev) => [confirmNotif, ...prev]);
  };

  const handleUpvoteTicket = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const wasUpvoted = t.userUpvoted;
          return {
            ...t,
            upvotes: wasUpvoted ? t.upvotes - 1 : t.upvotes + 1,
            userUpvoted: !wasUpvoted,
          };
        }
        return t;
      })
    );
  };

  const handleUpdateTicketStatus = (
    ticketId: string,
    newStatus: TicketStatus,
    resolutionNote?: string,
    technicianName?: string
  ) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const updatedNotes = resolutionNote || t.resolutionNotes;
          const updatedTech = technicianName || t.assignedTechnician;
          return {
            ...t,
            status: newStatus,
            resolutionNotes: updatedNotes,
            assignedTechnician: updatedTech,
            updatedAt: 'Just now',
          };
        }
        return t;
      })
    );

    // Create a closed-loop notification for the student!
    const target = tickets.find((t) => t.id === ticketId);
    if (target) {
      const closedLoopNotif: CampusNotification = {
        id: `notif-closed-loop-${Date.now()}`,
        title: `⚡ Closed-Loop Update: Ticket ${target.id} is now ${newStatus}`,
        content: resolutionNote || `Department ${target.department} updated the status of "${target.title}" to ${newStatus}.`,
        category: 'Admin',
        timestamp: 'Just now',
        pinned: newStatus === 'Resolved',
        unread: true,
        department: target.department,
      };
      setNotifications((prev) => [closedLoopNotif, ...prev]);
    }
  };

  // Notification actions
  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleBroadcastNotification = (notif: CampusNotification) => {
    setNotifications((prev) => [notif, ...prev]);
  };

  // Navigation helpers
  const handleNavigateToReportFromMap = (locationName: string) => {
    setPrefilledReportLocation(locationName);
    setPrefilledReportTitle(`Issue reported in ${locationName}`);
    setActiveTab('report');
  };

  const handleSelectMapLocationFromChat = (locationName: string) => {
    setSelectedMapLocation(locationName);
    setActiveTab('map');
  };

  const handlePrefillReportFromChat = (title: string, location: string) => {
    setPrefilledReportTitle(title);
    setPrefilledReportLocation(location);
    setActiveTab('report');
  };

  const unreadCount = notifications.filter((n) => n.unread).length;
  const activeTicketCount = tickets.filter(
    (t) => t.status !== 'Resolved'
  ).length;

  return (
    <div className="min-h-screen bg-slate-100/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors selection:bg-blue-600 selection:text-white">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdminMode={isAdminMode}
        setIsAdminMode={setIsAdminMode}
        studentProfile={studentProfile}
        onEditProfile={() => setIsProfileModalOpen(true)}
        unreadCount={unreadCount}
        activeTicketCount={activeTicketCount}
        isDriveConnected={isDriveConnected}
        onOpenDriveAuth={() => setActiveTab('help-hub')}
      />

      {/* Main Tab Content */}
      <main className="flex-1 pb-16">
        {activeTab === 'assistant' && (
          <AiAssistant
            studentProfile={studentProfile}
            onNavigateTab={setActiveTab}
            onSelectMapLocation={handleSelectMapLocationFromChat}
            onPrefillReport={handlePrefillReportFromChat}
          />
        )}

        {activeTab === 'map' && (
          <SmartCampusMap
            locations={CAMPUS_LOCATIONS}
            selectedLocationName={selectedMapLocation}
            onNavigateToReport={handleNavigateToReportFromMap}
          />
        )}

        {activeTab === 'report' && (
          <ReportAndTrack
            tickets={tickets}
            locations={CAMPUS_LOCATIONS}
            studentProfile={studentProfile}
            onAddTicket={handleAddTicket}
            onUpvoteTicket={handleUpvoteTicket}
            prefilledTitle={prefilledReportTitle}
            prefilledLocation={prefilledReportLocation}
          />
        )}

        {activeTab === 'notifications' && (
          <SmartNotifications
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onOpenCodeCraft={() => setActiveTab('vision')}
          />
        )}

        {activeTab === 'dashboard' && (
          <AdminDashboard
            tickets={tickets}
            onUpdateTicketStatus={handleUpdateTicketStatus}
            onBroadcastNotification={handleBroadcastNotification}
          />
        )}

        {activeTab === 'help-hub' && (
          <StudentHelpHub
            studentProfile={studentProfile}
            isDriveConnected={isDriveConnected}
            setIsDriveConnected={setIsDriveConnected}
          />
        )}

        {activeTab === 'vision' && (
          <VisionShowcase
            studentProfile={studentProfile}
            onEditProfile={() => setIsProfileModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-700 dark:text-slate-200">SD CAMPUS 360</span>
            <span>•</span>
            <span>BUILD SD COLLEGE 2030</span>
            <span>•</span>
            <span className="text-cyan-600 dark:text-cyan-400 font-semibold">Imagine • Innovate • Transform</span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="font-medium text-slate-600 dark:text-slate-300">
              SD CODECRAFT CLUB: CODE • CREATE • COMPETE • INNOVATE
            </span>
          </div>
        </div>
      </footer>

      {/* Student Profile Edit Modal */}
      <StudentProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={studentProfile}
        onSave={(updated) => setStudentProfile(updated)}
      />
    </div>
  );
}
