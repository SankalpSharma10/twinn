'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { copy } from '@/copy/strings';
import { ArrowLeft, Send } from 'lucide-react';
import { ease, duration } from '@/lib/motion/tokens';

interface Message {
  id: string;
  body: string;
  isOwn: boolean;
  time: string;
}

const matchMeta = {
  m1: { name: 'Maya Patel',  mode: 'study',     color: '#8FB37A', icebreakers: copy.icebreakers.study },
  m2: { name: 'Jordan Kim',  mode: 'study',     color: '#8FB37A', icebreakers: copy.icebreakers.study },
  m3: { name: 'Alex Chen',   mode: 'hackathon', color: '#E8B34A', icebreakers: copy.icebreakers.hackathon },
  m4: { name: 'Priya Nair',  mode: 'gym',       color: '#FF6A2E', icebreakers: copy.icebreakers.gym },
  m5: { name: 'Leo Santos',  mode: 'gym',       color: '#FF6A2E', icebreakers: copy.icebreakers.gym },
  m6: { name: 'Nina Wu',     mode: 'study',     color: '#8FB37A', icebreakers: copy.icebreakers.study },
} as const;

const seedMessages: Message[] = [
  { id: '1', body: 'hey! matched in study mode 👀', isOwn: false, time: '3h' },
  { id: '2', body: 'haha yeah, orgo is destroying me rn', isOwn: true, time: '3h' },
  { id: '3', body: 'same honestly. library tomorrow at 2pm?', isOwn: false, time: '2m' },
];

interface PageProps {
  params: Promise<{ matchId: string }>;
}

export default function ChatPage({ params }: PageProps) {
  const [matchId] = useState('m1');
  const meta = matchMeta[matchId as keyof typeof matchMeta] ?? matchMeta.m1;

  const [messages, setMessages] = useState<Message[]>(seedMessages);
  const [input, setInput]       = useState('');
  const [typing, setTyping]     = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate typing indicator on first message
  useEffect(() => {
    const t = setTimeout(() => { setTyping(true); setTimeout(() => setTyping(false), 2500); }, 4000);
    return () => clearTimeout(t);
  }, []);

  const sendMessage = useCallback(() => {
    if (!input.trim()) return;
    const msg: Message = {
      id: Date.now().toString(),
      body: input.trim(),
      isOwn: true,
      time: 'just now',
    };
    setMessages((prev) => [...prev, msg]);
    setInput('');
    // Simulate reply
    setTimeout(() => {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), body: 'haha yeah that works for me 👍', isOwn: false, time: 'just now' },
        ]);
      }, 2000);
    }, 800);
  }, [input]);

  const sendIcebreaker = (text: string) => {
    setInput(text);
  };

  const hasMessages = messages.length > 0;

  return (
    <main className="h-screen bg-ink-950 flex flex-col" aria-label={`Chat with ${meta.name}`}>
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-4 glass sticky top-0 z-40">
        <Link href="/matches" aria-label="Back to matches" className="text-bone-400 hover:text-bone-100 transition-colors" style={{ transitionDuration: '240ms' }}>
          <ArrowLeft className="w-5 h-5" aria-hidden="true" />
        </Link>

        <div
          className="w-10 h-10 rounded-full flex items-center justify-center font-semibold shrink-0"
          style={{ background: `${meta.color}20`, border: `1px solid ${meta.color}40`, color: meta.color }}
          aria-hidden="true"
        >
          {meta.name[0]}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-body font-semibold text-bone-100 truncate">{meta.name}</p>
          <p className="text-body-sm capitalize" style={{ color: meta.color }}>
            {meta.mode} mode
          </p>
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
        role="log"
        aria-label="Chat messages"
        aria-live="polite"
      >
        {messages.map((msg, i) => (
          <motion.div
            key={msg.id}
            className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: ease.out }}
          >
            <div
              className="max-w-xs px-4 py-2.5 rounded-2xl text-body"
              style={{
                background: msg.isOwn ? 'rgba(255,106,46,0.15)' : 'var(--ink-700)',
                border: `1px solid ${msg.isOwn ? 'rgba(255,106,46,0.25)' : 'var(--border-hairline)'}`,
                color: msg.isOwn ? 'var(--bone-100)' : 'var(--bone-100)',
              }}
            >
              {msg.body}
            </div>
          </motion.div>
        ))}

        {/* Typing indicator */}
        <AnimatePresence>
          {typing && (
            <motion.div
              className="flex justify-start"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              aria-label={`${meta.name} is typing`}
              role="status"
            >
              <div
                className="px-4 py-3 rounded-2xl flex items-center gap-1.5"
                style={{ background: 'var(--ink-700)', border: '1px solid var(--border-hairline)' }}
              >
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-bone-400"
                    style={{
                      animation: `pulse-dot 1.4s ease-in-out infinite`,
                      animationDelay: `${i * 0.16}s`,
                    }}
                    aria-hidden="true"
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Icebreakers */}
      {!hasMessages && (
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto" aria-label="Suggested openers">
          {meta.icebreakers.map((text) => (
            <button
              key={text}
              onClick={() => sendIcebreaker(text)}
              className="shrink-0 text-body-sm px-3 py-1.5 rounded-full transition-all"
              style={{
                background: 'var(--ink-700)',
                border: '1px solid var(--border-default)',
                color: 'var(--bone-300)',
                transition: 'all 240ms cubic-bezier(0.16,1,0.3,1)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = meta.color;
                (e.currentTarget as HTMLElement).style.color = meta.color;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)';
                (e.currentTarget as HTMLElement).style.color = 'var(--bone-300)';
              }}
            >
              {text}
            </button>
          ))}
        </div>
      )}

      {messages.length > 0 && (
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
          {meta.icebreakers.slice(0, 2).map((text) => (
            <button
              key={text}
              onClick={() => sendIcebreaker(text)}
              className="shrink-0 text-body-sm px-3 py-1.5 rounded-full"
              style={{
                background: 'transparent',
                border: `1px solid ${meta.color}40`,
                color: meta.color,
                opacity: 0.7,
                transition: 'opacity 240ms',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = '1')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = '0.7')}
            >
              {text}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div
        className="px-4 py-4 flex items-center gap-3"
        style={{ borderTop: '1px solid var(--border-hairline)' }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
          placeholder="say something…"
          className="flex-1 px-4 py-3 rounded-full text-bone-100 placeholder:text-bone-500 text-body focus:outline-none"
          style={{
            background: 'var(--ink-700)',
            border: '1px solid var(--border-default)',
            transition: 'border-color 240ms',
          }}
          aria-label="Type a message"
        />
        <motion.button
          onClick={sendMessage}
          disabled={!input.trim()}
          className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-all"
          style={{
            background: input.trim() ? 'var(--ember-500)' : 'var(--ink-700)',
            border: '1px solid var(--border-default)',
            boxShadow: input.trim() ? 'var(--shadow-ember)' : 'none',
            transition: 'all 240ms cubic-bezier(0.16,1,0.3,1)',
          }}
          whileHover={input.trim() ? { scale: 1.08 } : {}}
          whileTap={input.trim() ? { scale: 0.92 } : {}}
          aria-label="Send message"
        >
          <Send className="w-4 h-4" style={{ color: input.trim() ? 'var(--ink-900)' : 'var(--bone-500)' }} aria-hidden="true" />
        </motion.button>
      </div>
    </main>
  );
}
