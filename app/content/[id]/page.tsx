'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ContentItem } from '@/lib/types';
import { getContentByIdAction, incrementViewsAction } from '@/app/actions/content';
import {
  Clock,
  Sparkles,
  ExternalLink,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Copy,
  MessageSquare,
  Send,
  Loader2,
  Bot,
  User
} from 'lucide-react';
import { toast } from 'sonner';

export default function ContentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [item, setItem] = useState<ContentItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedTakeawayIndex, setCopiedTakeawayIndex] = useState<number | null>(null);

  // Q&A state
  const [chatMessages, setChatMessages] = useState<{ id: string; role: 'user' | 'assistant'; text: string }[]>([]);
  const [question, setQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);

  useEffect(() => {
    async function loadItem() {
      if (!id) return;
      try {
        const found = await getContentByIdAction(id);
        setItem(found);
        if (found) {
          incrementViewsAction(found.id).catch(() => {});
        }
      } catch (err) {
        console.error('Error fetching content detail:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadItem();
  }, [id]);

  const handleCopyTakeaway = (takeaway: string, idx: number) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(takeaway);
      setCopiedTakeawayIndex(idx);
      toast.success('Takeaway copied to clipboard!');
      setTimeout(() => setCopiedTakeawayIndex(null), 2000);
    }
  };

  const handleSendQuestion = async () => {
    if (!question.trim() || !item || isAsking) return;

    const userMsg = { id: `u_${Date.now()}`, role: 'user' as const, text: question.trim() };
    setChatMessages((prev) => [...prev, userMsg]);
    const currentQ = question.trim();
    setQuestion('');
    setIsAsking(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentId: item.id,
          question: currentQ,
          history: chatMessages.map((m) => ({ role: m.role, content: m.text }))
        })
      });

      const data = await res.json();
      if (res.ok && data.answer) {
        const botMsg = { id: `b_${Date.now()}`, role: 'assistant' as const, text: data.answer };
        setChatMessages((prev) => [...prev, botMsg]);
      } else {
        toast.error('Failed to answer question.');
      }
    } catch {
      toast.error('Error asking AI assistant.');
    } finally {
      setIsAsking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col justify-between">
        <Header />
        <main className="flex-1 flex items-center justify-center p-12 text-zinc-500">
          <Loader2 className="w-6 h-6 animate-spin mr-2 text-indigo-600" />
          <span>Loading content details...</span>
        </main>
        <Footer />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col justify-between">
        <Header />
        <main className="flex-1 max-w-4xl mx-auto w-full p-8 text-center space-y-4 my-12">
          <h2 className="text-xl font-bold">Content Item Not Found</h2>
          <p className="text-xs text-zinc-500">The requested article or video could not be found in the index.</p>
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Discovery Engine</span>
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Discovery Engine</span>
        </button>

        {/* Content Banner Header */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-bold uppercase tracking-wider text-[10px]">
              {item.category}
            </span>
            <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold border border-zinc-200 dark:border-zinc-700/60">
              {item.contentType}
            </span>
            <span className="text-zinc-400 dark:text-zinc-600">&bull;</span>
            <span className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400 font-mono">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              {item.readTime}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 leading-tight">
            {item.title}
          </h1>

          <div className="flex items-center justify-between gap-4 flex-wrap text-xs text-zinc-500 dark:text-zinc-400 border-t border-zinc-200 dark:border-zinc-800 pt-4 font-mono">
            <div>
              Source: <span className="font-semibold text-zinc-700 dark:text-zinc-200">{item.source}</span>
              {item.author && ` by ${item.author}`}
            </div>

            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 shadow-md shadow-blue-600/20 transition-colors cursor-pointer"
            >
              <span>Visit Original Source</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Key Takeaways */}
        <div className="bg-blue-50/50 dark:bg-blue-500/5 border border-blue-200 dark:border-blue-500/20 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Actionable Key Takeaways
          </h3>

          <ul className="space-y-2.5">
            {item.keyTakeaways.map((takeaway, idx) => (
              <li key={idx} className="flex items-start justify-between gap-3 bg-white dark:bg-zinc-950/80 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-800 dark:text-zinc-200 font-medium">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{takeaway}</span>
                </div>
                <button
                  onClick={() => handleCopyTakeaway(takeaway, idx)}
                  className="p-1 text-zinc-400 dark:text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shrink-0 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Executive Summary */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-4">
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            AI Executive Summary
          </h3>
          <div className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line space-y-3 bg-zinc-50 dark:bg-zinc-950/60 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
            {item.summary}
          </div>
        </div>

        {/* Ask AI Chat Section */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-4">
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Ask AI Assistant About This Article
          </h3>

          <div className="space-y-3 max-h-[300px] overflow-y-auto">
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
                      ? 'bg-blue-600 text-white font-medium'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/60'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendQuestion();
            }}
            className="flex items-center gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-800"
          >
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your question..."
              className="flex-1 bg-zinc-50 dark:bg-zinc-800 text-xs px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium placeholder-zinc-400 dark:placeholder-zinc-500"
            />
            <button
              type="submit"
              disabled={isAsking || !question.trim()}
              className="p-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 transition-colors cursor-pointer shadow-md shadow-blue-600/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
