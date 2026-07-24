'use client';

import React, { useState } from 'react';
import { ContentItem } from '@/lib/types';
import {
  X,
  Sparkles,
  ExternalLink,
  Bookmark,
  Clock,
  Check,
  Copy,
  MessageSquare,
  Send,
  Loader2,
  Bot,
  User,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { toast } from 'sonner';

interface ContentReaderDialogProps {
  item: ContentItem | null;
  onClose: () => void;
  onBookmark: (item: ContentItem) => void;
  isSaved?: boolean;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

function makeUniqueId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}`;
}

export function ContentReaderDialog({ item, onClose, onBookmark, isSaved = false }: ContentReaderDialogProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'chat'>('summary');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [copiedTakeawayIndex, setCopiedTakeawayIndex] = useState<number | null>(null);

  if (!item) return null;

  const handleCopyTakeaway = (takeaway: string, idx: number) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(takeaway);
      setCopiedTakeawayIndex(idx);
      toast.success('Takeaway copied to clipboard!');
      setTimeout(() => setCopiedTakeawayIndex(null), 2000);
    }
  };

  const handleSendQuestion = async (qText?: string) => {
    const question = qText || inputQuestion.trim();
    if (!question || isAsking) return;

    const userMsg: ChatMessage = { id: makeUniqueId('u'), role: 'user', text: question };
    setChatMessages((prev) => [...prev, userMsg]);
    if (!qText) setInputQuestion('');
    setIsAsking(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentId: item.id,
          question,
          history: chatMessages.map((m) => ({ role: m.role, content: m.text }))
        })
      });

      const data = await res.json();
      if (res.ok && data.answer) {
        const botMsg: ChatMessage = { id: makeUniqueId('b'), role: 'assistant', text: data.answer };
        setChatMessages((prev) => [...prev, botMsg]);
      } else {
        toast.error('Failed to receive AI answer.');
      }
    } catch {
      toast.error('Error sending question.');
    } finally {
      setIsAsking(false);
    }
  };

  const SUGGESTED_QUESTIONS = [
    'Explain the key takeaways in simple layman terms',
    'What are the core practical applications discussed?',
    'Give me a real-world code example based on this content',
    'What are potential tradeoffs or limitations mentioned?'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-start justify-between gap-4 bg-zinc-950/80">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold uppercase tracking-wider text-[10px]">
                {item.category}
              </span>
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-medium border border-zinc-700/60">
                {item.contentType}
              </span>
              <span className="text-zinc-600">&bull;</span>
              <span className="flex items-center gap-1 text-zinc-400 font-mono">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                {item.readTime}
              </span>
            </div>

            <h2 className="text-xl font-bold text-zinc-100 leading-snug">
              {item.title}
            </h2>

            <p className="text-xs text-zinc-400 font-mono">
              Source: <span className="font-semibold text-zinc-300">{item.source}</span>
              {item.author ? ` by ${item.author}` : ''}
            </p>
          </div>

          {/* Close & Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onBookmark(item)}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
              }`}
              title="Save to collection"
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
            </button>

            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl text-zinc-400 hover:text-blue-400 hover:bg-zinc-800 transition-colors"
              title="Open original website"
            >
              <ExternalLink className="w-5 h-5" />
            </a>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-zinc-800 px-6 bg-zinc-900">
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'summary'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>AI Executive Summary & Key Takeaways</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'chat'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-100'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Ask AI About This Article</span>
            {chatMessages.length > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] bg-blue-600 text-white rounded-full font-bold">
                {chatMessages.length}
              </span>
            )}
          </button>
        </div>

        {/* Dialog Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'summary' ? (
            <>
              {/* Key Takeaways Section */}
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-blue-400 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    Key Actionable Takeaways
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    AI Extracted
                  </span>
                </div>

                <ul className="space-y-2.5">
                  {item.keyTakeaways.map((takeaway, idx) => (
                    <li key={idx} className="flex items-start justify-between gap-3 bg-zinc-950/80 p-3 rounded-xl border border-zinc-800 text-xs text-zinc-200 font-medium">
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{takeaway}</span>
                      </div>
                      <button
                        onClick={() => handleCopyTakeaway(takeaway, idx)}
                        className="p-1 text-zinc-500 hover:text-blue-400 transition-colors shrink-0 cursor-pointer"
                        title="Copy takeaway text"
                      >
                        {copiedTakeawayIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Full Executive Summary */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-zinc-100">
                  AI Executive Summary
                </h3>
                <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line space-y-3 bg-zinc-950/60 p-4 rounded-2xl border border-zinc-800">
                  {item.summary}
                </div>
              </div>

              {/* Tags & Metadata */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-zinc-800 text-xs">
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((tag, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-300 font-mono border border-zinc-700/60">
                      #{tag}
                    </span>
                  ))}
                </div>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 shadow-md shadow-blue-600/20 transition-colors cursor-pointer"
                >
                  <span>Visit Full Original Source</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </>
          ) : (
            /* Q&A Chat Tab */
            <div className="flex flex-col h-full space-y-4">
              {/* Suggested Questions */}
              {chatMessages.length === 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-zinc-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    Quick Prompt Suggestions:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {SUGGESTED_QUESTIONS.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendQuestion(q)}
                        className="text-left p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 border border-zinc-700/60 transition-colors cursor-pointer"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Message List */}
              <div className="space-y-3 min-h-[220px] max-h-[360px] overflow-y-auto pr-1">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 text-xs ${
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`p-3.5 rounded-2xl max-w-[85%] whitespace-pre-wrap leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white font-medium rounded-tr-xs'
                          : 'bg-zinc-800 text-zinc-200 border border-zinc-700/60 rounded-tl-xs'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {msg.role === 'user' && (
                      <div className="w-7 h-7 rounded-lg bg-zinc-800 text-zinc-200 flex items-center justify-center shrink-0 border border-zinc-700">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}

                {isAsking && (
                  <div className="flex items-center gap-2 text-xs text-blue-400 p-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Gemini is analyzing content context...</span>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendQuestion();
                }}
                className="flex items-center gap-2 pt-2 border-t border-zinc-800"
              >
                <input
                  type="text"
                  value={inputQuestion}
                  onChange={(e) => setInputQuestion(e.target.value)}
                  placeholder="Ask a question about this article..."
                  className="flex-1 bg-zinc-800 text-xs px-3.5 py-2.5 rounded-xl border border-zinc-700 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium placeholder-zinc-500"
                />
                <button
                  type="submit"
                  disabled={isAsking || !inputQuestion.trim()}
                  className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
