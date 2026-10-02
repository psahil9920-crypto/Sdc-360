import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  MapPin,
  AlertCircle,
  FolderOpen,
  RefreshCw,
  Mic,
  Copy,
  Check,
  Building,
  Zap,
} from 'lucide-react';
import { StudentProfile } from '../types';
import { ActiveTab } from './Navbar';

interface AiAssistantProps {
  studentProfile: StudentProfile;
  onNavigateTab: (tab: ActiveTab) => void;
  onSelectMapLocation?: (locationName: string) => void;
  onPrefillReport?: (title: string, location: string) => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  actionType?: 'map' | 'report' | 'drive';
  actionTarget?: string;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({
  studentProfile,
  onNavigateTab,
  onSelectMapLocation,
  onPrefillReport,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello **${studentProfile.name}**! 👋 Welcome to **SD CAMPUS 360** (BUILD SD COLLEGE 2030).

I am your 24/7 AI Campus Assistant. As an intelligent digital layer connecting students, teachers, labs, and administration, I can assist you to:

• **Ask**: College schedules, BCA curriculum, exams, faculty contacts
• **Report**: Equipment faults, lab issues, maintenance requests
• **Find**: Interactive campus navigation for classrooms, labs & facilities
• **Track**: Live status of your campus service tickets
• **Learn**: Study resources, Google Drive course notes & CodeCraft tutorials

How may I assist you today?`,
      timestamp: 'Just now',
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const quickPrompts = [
    { label: 'Where is Ramanujan Lab 2?', query: 'Where is Ramanujan Computer Lab 2 on the campus map and what are its timings?' },
    { label: 'Report broken projector in Turing Hall', query: 'I want to report a broken projector in Alan Turing Memorial Lecture Hall.' },
    { label: 'Central Library hours & rules', query: 'What are the Dr. Kalam Central Library operating hours and e-resource access guidelines?' },
    { label: 'BCA 6th Sem Exam & Timetable', query: 'When are the BCA 6th Semester practical examinations and where can I find the timetable?' },
    { label: 'SD CodeCraft Club Activities', query: 'Tell me about SD CodeCraft Club, its upcoming hackathons, and how BCA students can participate.' },
    { label: 'Connect to Campus Wi-Fi 7', query: 'How do I connect to the SD-Campus-Secure high-speed Wi-Fi?' },
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input.trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const history = messages.slice(-5).map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history,
          student: studentProfile,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await res.json();
      const replyText = data.reply || 'I am processing your campus request.';

      // Determine smart context actions
      let actionType: 'map' | 'report' | 'drive' | undefined;
      let actionTarget: string | undefined;

      const lower = (query + ' ' + replyText).toLowerCase();
      if (lower.includes('lab') || lower.includes('turing') || lower.includes('map') || lower.includes('room') || lower.includes('block')) {
        actionType = 'map';
        if (lower.includes('ramanujan') || lower.includes('lab 2')) actionTarget = 'Ramanujan Computer Lab 2';
        else if (lower.includes('turing')) actionTarget = 'Alan Turing Memorial Lecture Hall';
        else if (lower.includes('library')) actionTarget = 'Dr. Kalam Central Library';
      } else if (lower.includes('report') || lower.includes('broken') || lower.includes('fault') || lower.includes('ticket')) {
        actionType = 'report';
        actionTarget = query;
      } else if (lower.includes('drive') || lower.includes('syllabus') || lower.includes('notes') || lower.includes('document')) {
        actionType = 'drive';
      }

      const aiReply: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionType,
        actionTarget,
      };

      setMessages((prev) => [...prev, aiReply]);
    } catch (error) {
      console.error('Chat error:', error);
      const fallbackReply: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        role: 'assistant',
        content: `I'm having trouble connecting to the cloud assistant right now. However, you can explore the **Smart Campus Map** for room directions, or use **Report & Track** to log campus issues directly!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionType: 'map',
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleMicSim = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setInput('Where is the nearest computer lab with available seats?');
    }, 1200);
  };

  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      // Bold rendering
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-bold text-slate-900 dark:text-white">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (line.startsWith('• ') || line.startsWith('- ')) {
        return (
          <li key={idx} className="ml-4 list-disc text-sm text-slate-700 dark:text-slate-300 my-0.5">
            {formattedParts}
          </li>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="text-sm font-bold text-blue-700 dark:text-blue-300 mt-2 mb-1">
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-1.5" />;
      }
      return (
        <p key={idx} className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {formattedParts}
        </p>
      );
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-cyan-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI CAMPUS ASSISTANT • SD COLLEGE 2030</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Ask • Report • Find • Track • Learn
            </h1>
            <p className="text-sm text-blue-100 max-w-2xl">
              An intelligent natural language layer connecting students with classrooms, labs, departments, and real-time administrative responses.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3.5 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs">
              <div className="text-[10px] text-blue-200 uppercase font-semibold">User Context</div>
              <div className="font-bold text-white">{studentProfile.name}</div>
              <div className="text-[11px] text-cyan-200">{studentProfile.rollNo} • {studentProfile.programme}</div>
            </div>
            <button
              onClick={() => {
                setMessages([messages[0]]);
              }}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Reset Conversation"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-[600px]">
        {/* Chat History Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              } animate-fadeIn`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white font-bold text-sm'
                    : 'bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white'
                }`}
              >
                {msg.role === 'user' ? (
                  <User className="w-5 h-5" />
                ) : (
                  <Bot className="w-5 h-5" />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 sm:p-5 relative group transition-all ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-sm shadow-md'
                    : 'bg-slate-50 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 rounded-tl-sm border border-slate-200/80 dark:border-slate-700/80 shadow-sm'
                }`}
              >
                {/* Header row in bubble */}
                <div className="flex items-center justify-between gap-3 mb-1 text-[11px] opacity-75">
                  <span className="font-semibold">
                    {msg.role === 'user' ? studentProfile.name : 'SD Campus 360 AI'}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>

                {/* Content */}
                <div className="space-y-1">
                  {msg.role === 'user' ? (
                    <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                  ) : (
                    renderFormattedContent(msg.content)
                  )}
                </div>

                {/* Direct Action Pills attached to AI Responses */}
                {msg.actionType && (
                  <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-wrap gap-2">
                    {msg.actionType === 'map' && (
                      <button
                        onClick={() => {
                          onNavigateTab('map');
                          if (msg.actionTarget && onSelectMapLocation) {
                            onSelectMapLocation(msg.actionTarget);
                          }
                        }}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-semibold hover:bg-blue-200 transition-colors"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Locate on Smart Map</span>
                      </button>
                    )}

                    {msg.actionType === 'report' && (
                      <button
                        onClick={() => {
                          onNavigateTab('report');
                          if (onPrefillReport) {
                            onPrefillReport(msg.actionTarget || 'Equipment fault', 'Alan Turing Memorial Lecture Hall');
                          }
                        }}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-semibold hover:bg-rose-200 transition-colors"
                      >
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>File Campus Service Ticket</span>
                      </button>
                    )}

                    {msg.actionType === 'drive' && (
                      <button
                        onClick={() => onNavigateTab('help-hub')}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-200 transition-colors"
                      >
                        <FolderOpen className="w-3.5 h-3.5" />
                        <span>Open Course Hub & Google Drive</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Copy button */}
                <button
                  onClick={() => handleCopy(msg.id, msg.content)}
                  className="absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 p-1 rounded-lg bg-white/40 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-white/70 transition-all text-xs"
                  title="Copy message"
                >
                  {copiedId === msg.id ? (
                    <Check className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-start gap-3 animate-pulse">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-3xl rounded-tl-sm p-4 text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-cyan-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span>Analyzing campus repository & routing...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Carousel */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60">
          <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none py-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center">
              <Zap className="w-3 h-3 text-amber-500 mr-0.5" /> Quick:
            </span>
            {quickPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(p.query)}
                className="px-3 py-1.5 text-xs font-medium rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 shrink-0 transition-all shadow-2xs"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
        >
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about labs, classrooms, reporting issues, BCA schedules, or Drive notes..."
              className="w-full pl-4 pr-24 py-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
              disabled={isLoading}
            />

            <div className="absolute right-2 flex items-center space-x-1">
              <button
                type="button"
                onClick={handleMicSim}
                className={`p-2 rounded-xl text-slate-500 hover:text-blue-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${
                  isListening ? 'text-rose-500 animate-pulse bg-rose-50' : ''
                }`}
                title="Voice Query Simulation"
              >
                <Mic className="w-4 h-4" />
              </button>

              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white shadow-md shadow-blue-500/20 transition-all"
                title="Send query"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
