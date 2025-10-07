'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MessageSquare, X, Send, Loader2, Shield, Sparkles, Bot, User } from 'lucide-react';

type Role = 'user' | 'assistant';
type Msg = { role: Role; content: string };

const BASE_API = process.env.NEXT_PUBLIC_API_URL || 'https://learnscapeedu.com';

// Enhanced markdown formatter that handles numbered lists better
function formatMessage(text: string) {
  if (!text) return text;
  
  let formatted = text;
  
  // First, normalize line breaks
  formatted = formatted.replace(/\r\n/g, '\n');
  
  // Handle numbered lists at start of lines with proper spacing
  // Pattern: "1. Text" or "2. Text" etc at the start of a line
  formatted = formatted.replace(/^(\d+)\.\s+(.+?)(?=\n|$)/gm, (match, num, content) => {
    return `<div class="numbered-item mt-3 mb-2"><span class="inline-block text-green-400 font-semibold text-xs mr-1.5">${num}.</span><span class="inline">${content}</span></div>`;
  });
  
  // Handle ### headers (should be rare now with numbered lists handled)
  formatted = formatted.replace(/###\s*(.+?)(\n|$)/g, '<div class="font-semibold text-[11px] sm:text-xs text-green-300 mt-3 mb-1.5 leading-tight">$1</div>');
  
  // Handle ** bold text **
  formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong class="font-medium text-slate-50">$1</strong>');
  
  // Handle bullet points with dash
  formatted = formatted.replace(/^[\s]*-[\s]+(.+)$/gm, '<div class="flex gap-1.5 sm:gap-2 my-1 leading-snug"><span class="text-green-400 flex-shrink-0 text-xs">•</span><span class="flex-1">$1</span></div>');
  
  // Convert remaining double line breaks to spacing
  formatted = formatted.replace(/\n\n+/g, '<div class="h-2"></div>');
  
  // Convert single line breaks to <br/>
  formatted = formatted.replace(/\n/g, '<br class="leading-relaxed"/>');
  
  // Wrap in div if needed
  if (!formatted.startsWith('<div')) {
    formatted = `<div class="leading-relaxed">${formatted}</div>`;
  }
  
  return formatted;
}



export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: 'assistant',
      content:
        "Hi! I am LearnScape's counselor. Ask about colleges, fees, streams, locations, or scholarships. Keep messages brief for faster replies.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const boxRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, loading]);

  async function send() {
    if (!input.trim() || loading) return;

    const user = input.trim().slice(0, 600);
    setInput('');
    setErrorText(null);

    const nextHistory: Msg[] = [...msgs, { role: 'user', content: user }];
    setMsgs(nextHistory);
    setLoading(true);
    setIsTyping(true);

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    try {
      const res = await fetch(`${BASE_API}/ai/chat`, {
        method: 'POST',
        signal: abortRef.current.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: user,
          history: nextHistory.slice(-6),
        }),
      });

      if (!res.ok || !res.body) {
        const text = await res.text().catch(() => '');
        throw new Error(text || 'Chat error');
      }

      setMsgs(prev => [...prev, { role: 'assistant', content: '' }]);
      const idx = nextHistory.length;

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let partial = '';
      const HARD_CHAR_CAP = 2800;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        for (const lineRaw of chunk.split('\n')) {
          if (!lineRaw.startsWith('data:')) continue;
          const data = lineRaw.startsWith('data: ') ? lineRaw.slice(6) : lineRaw.slice(5);
          if (data === '[DONE]' || data.length === 0) continue;

          const next = (partial + data).slice(0, HARD_CHAR_CAP);
          const delta = next.slice(partial.length);
          if (!delta) continue;

          partial = next;

          setMsgs(prev => {
            const copy = [...prev];
            copy[idx] = { role: 'assistant', content: partial };
            return copy;
          });

          if (partial.length >= HARD_CHAR_CAP) {
            try { abortRef.current?.abort(); } catch {}
            break;
          }
        }
        if (partial.length >= HARD_CHAR_CAP) break;
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error(message);
      setErrorText('Service is busy or budget limit reached. Please try again.');
      setMsgs(prev => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I could not complete that. Please try again.' },
      ]);
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  }

  return (
    <>
    <style>{`
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: translateY(0) } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
  @keyframes bounceDot { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-5px) } }
  @keyframes shimmer { 0% { background-position: -1000px 0 } 100% { background-position: 1000px 0 } }
  @keyframes pulse-glow { 0%, 100% { opacity: 0.2 } 50% { opacity: 0.3 } }
  @keyframes wave-blend { 
    0% { transform: translateX(-50%) translateY(0) scale(1); opacity: 0.5; }
    50% { transform: translateX(-40%) translateY(-30px) scale(1.15); opacity: 0.65; }
    100% { transform: translateX(-50%) translateY(0) scale(1); opacity: 0.5; }
  }
  @keyframes rotate-blend { 
    0% { transform: rotate(0deg); opacity: 0.4; }
    50% { opacity: 0.6; }
    100% { transform: rotate(360deg); opacity: 0.4; }
  }
  @keyframes float-green {
    0% { transform: translate(-50%, 0) scale(1); opacity: 0.45; }
    50% { transform: translate(-45%, -15px) scale(1.1); opacity: 0.6; }
    100% { transform: translate(-50%, 0) scale(1); opacity: 0.45; }
  }
  @keyframes shade-orb {
    0% { margin-top: 0; }
    100% { margin-top: calc(100% - 24px); }
  }
  .message-enter { animation: fadeIn .25s ease-out }
  .panel-enter { animation: slideUp .45s cubic-bezier(.16,1,.3,1) }
  .typing-dot { width: 6px; height: 6px; border-radius: 9999px; background: #9ca3af; animation: bounceDot 1.2s infinite }
  .typing-dot:nth-child(2) { animation-delay: .15s }
  .typing-dot:nth-child(3) { animation-delay: .30s }
  .shimmer-bg { background: linear-gradient(90deg, transparent, rgba(255,255,255,.08), transparent); background-size: 1000px 100%; animation: shimmer 2.4s infinite }
  .hide-scrollbar::-webkit-scrollbar { display: none; }
  .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  
  /* Better text formatting */
  .msg-content { 
    line-height: 1.6; 
    font-size: 11px;
  }
  @media (min-width: 640px) {
    .msg-content { font-size: 12px; }
  }
  .msg-content div { line-height: 1.6; }
  .msg-content span { line-height: 1.6; }
  .msg-content br { display: block; content: ""; margin: 0.2rem 0; line-height: 1.6; }
  .msg-content strong { font-weight: 600; color: #f1f5f9; }
  
  /* Numbered item styling with proper spacing */
  .msg-content .numbered-item {
    display: block;
    line-height: 1.5;
    margin-top: 0.75rem;
    margin-bottom: 0.5rem;
  }
  .msg-content .numbered-item:first-child {
    margin-top: 0;
  }
`}</style>


      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-5 right-5 z-50 rounded-full px-4 py-2.5 text-white shadow-2xl flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-blue-500/25"
        style={{ background: 'linear-gradient(135deg, rgb(30,41,59) 0%, rgb(51,65,85) 100%)' }}
        aria-label="Open LearnScape chat"
      >
        <MessageSquare className="w-4 h-4 text-blue-400 animate-pulse" />
        <span className="sm:hidden text-xs font-semibold">AI</span>
        <span className="hidden sm:inline text-xs font-semibold">Ask LearnScape AI</span>
        <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-blue-400 rounded-full animate-pulse" />
      </button>

      {open && (
        <div className="panel-enter fixed bottom-16 sm:bottom-20 right-3 sm:right-5 z-50 w-[95vw] sm:w-[85vw] max-w-sm rounded-2xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" 
              style={{ animation: 'pulse-glow 4s ease-in-out infinite' }}
            />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" 
              style={{ animation: 'pulse-glow 4s ease-in-out infinite 1s' }}
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"
              style={{ animation: 'pulse-glow 4s ease-in-out infinite 2s' }}
            />
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='white' stroke-width='0.5' opacity='0.05'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`
              }}
            />
          </div>

          <div
            className="px-3 sm:px-4 py-2.5 sm:py-3 text-white flex items-center justify-between relative overflow-hidden border-b border-slate-800/50"
            style={{ background: 'linear-gradient(135deg, rgba(30,41,59,0.95) 0%, rgba(51,65,85,0.95) 100%)', backdropFilter: 'blur(12px)' }}
          >
            <div className="absolute inset-0 shimmer-bg opacity-10" />
            <div className="flex items-center gap-2 sm:gap-2.5 relative z-10">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-500/20 flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
              </div>
              <div>
                <span className="font-bold text-xs sm:text-sm block">LearnScape AI</span>
                <span className="text-[9px] sm:text-[10px] text-slate-300 flex items-center gap-1">
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-400 rounded-full animate-pulse" />
                  Online & Ready
                </span>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="opacity-80 hover:opacity-100 transition-all hover:rotate-90 duration-300 relative z-10"
            >
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            </button>
          </div>

          <div
            className="h-[60vh] sm:h-72 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-3.5 relative hide-scrollbar"
            style={{ background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(8px)' }}
            ref={boxRef}
          >
            <div className="absolute bottom-0 left-1/2 w-[250%] h-40 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(34,197,94,0.35), rgba(16,185,129,0.25), rgba(6,182,212,0.15), transparent)',
                filter: 'blur(35px)',
                animation: 'wave-blend 5s ease-in-out infinite',
                mixBlendMode: 'screen'
              }}
            />
            <div className="absolute bottom-8 right-8 w-32 h-32 pointer-events-none"
              style={{
                background: 'conic-gradient(from 0deg, transparent, rgba(34,197,94,0.45), rgba(16,185,129,0.35), transparent)',
                filter: 'blur(25px)',
                animation: 'rotate-blend 7s linear infinite',
                mixBlendMode: 'screen'
              }}
            />
            <div className="absolute top-1/3 left-1/2 w-28 h-28 pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(34,197,94,0.4), rgba(16,185,129,0.25), transparent)',
                filter: 'blur(30px)',
                animation: 'float-green 6s ease-in-out infinite',
                mixBlendMode: 'screen'
              }}
            />

            {msgs.map((m, i) => (
              <div key={i} className={`message-enter flex gap-1.5 sm:gap-2 items-start ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'} relative z-10`}>
                {m.role === 'assistant' ? (
                  <div className="relative flex flex-col items-center min-w-[36px] sm:min-w-[44px] md:min-w-[54px] select-none mr-0.5 sm:mr-1 md:mr-2">
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 w-1.5 sm:w-2 md:w-2.5 h-full rounded-full"
                      style={{
                        background: 'linear-gradient(180deg, #22c55e 5%, #10b981 60%, #06b6d4 80%, #0f172a 100%)',
                        boxShadow: '0 0 25px 0 rgba(34,197,94,0.4), 0 6px 32px 0 rgba(16,185,129,0.25)',
                      }}>
                      <div
                        className="w-full h-5 sm:h-6 rounded-full"
                        style={{
                          background: 'radial-gradient(circle at 50% 0, #22c55e 0%, transparent 80%)',
                          animation: 'shade-orb 3s infinite linear'
                        }}
                      />
                    </div>
                    <div className="relative z-10 mt-0.5 sm:mt-1 md:mt-2 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg mb-0.5">
                      <Bot className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <span className="relative z-10 text-[9px] sm:text-[10px] md:text-xs text-green-300 font-bold px-0.5 sm:px-1 py-0.5 rounded-full bg-slate-800/60 border border-green-500/40 mt-0">
                      AI
                    </span>
                  </div>
                ) : (
                  <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0 mb-0.5">
                    <User className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                  </div>
                )}

                <div
                  className={`max-w-[74%] px-3 sm:px-3.5 py-2.5 sm:py-3 rounded-2xl shadow-sm border msg-content
                    ${m.role === 'user'
                      ? 'bg-gradient-to-br from-green-600 to-emerald-700 text-white rounded-tr-sm ml-auto border-green-500/30'
                      : 'bg-slate-800/80 text-gray-100 border-slate-700/50 rounded-tl-sm ml-0 backdrop-blur-sm'
                  }`}
                  dangerouslySetInnerHTML={{ __html: formatMessage(m.content) }}
                />
              </div>
            ))}

            {loading && isTyping && (
              <div className="message-enter flex gap-1.5 sm:gap-2 relative z-10">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-green-400 to-emerald-500">
                  <Bot className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                </div>
                <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-2xl rounded-tl-sm shadow-sm">
                  <div className="flex gap-1.5 items-center">
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                  </div>
                </div>
              </div>
            )}

            {errorText && (
              <div className="message-enter text-[10px] sm:text-xs text-red-300 bg-red-950/50 backdrop-blur-sm border border-red-800/50 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg relative z-10">
                {errorText}
              </div>
            )}
          </div>

          <div className="p-2.5 sm:p-3 border-t border-slate-800/50" style={{ background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(12px)' }}>
            <div className="flex items-end gap-1.5 sm:gap-2">
              <div className="flex-1">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  placeholder="Type your question here..."
                  className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-[13px] bg-slate-900/80 backdrop-blur-sm border border-slate-700/60 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50"
                  maxLength={600}
                />
              </div>
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-white text-xs sm:text-sm font-semibold flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
                style={{
                  background:
                    loading || !input.trim()
                      ? 'linear-gradient(135deg, #475569 0%, #334155 100%)'
                      : 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
                  boxShadow: loading || !input.trim() ? 'none' : '0 4px 16px rgba(34,197,94,0.5)',
                }}
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" /> : <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              </button>
            </div>
            <div className="mt-2 sm:mt-2.5 flex items-center justify-between text-[9px] sm:text-[10px] text-slate-400">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-400" />
                <span>Secure & private</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5">
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-400" />
                <span className={input.length > 500 ? 'text-green-400 font-semibold' : ''}>{input.length}/600</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
