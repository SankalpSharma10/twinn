'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { copy } from '@/copy/strings';
import { MessageCircle, ArrowLeft, Search } from 'lucide-react';
import { ease } from '@/lib/motion/tokens';
import type { Metadata } from 'next';

const tabs = ['New', 'Active', 'Fading'] as const;
type Tab = typeof tabs[number];

// Seeded match data
const seedMatches = [
  {
    id: 'm1', name: 'Maya Patel',    major: 'Data Science',   mode: 'study',     lastMsg: 'library tomorrow at 2pm?',            time: '2m',  unread: 2, modeColor: '#8FB37A',
  },
  {
    id: 'm2', name: 'Jordan Kim',    major: 'Electrical Eng', mode: 'study',     lastMsg: 'yeah that problem set was brutal lol', time: '14m', unread: 0, modeColor: '#8FB37A',
  },
  {
    id: 'm3', name: 'Alex Chen',     major: 'CS',             mode: 'hackathon', lastMsg: 'I\'m thinking a sustainability angle', time: '1h',  unread: 1, modeColor: '#E8B34A',
  },
  {
    id: 'm4', name: 'Priya Nair',    major: 'Pre-Med',        mode: 'gym',       lastMsg: '6:45am. I\'ll be there',               time: '3h',  unread: 0, modeColor: '#FF6A2E',
  },
  {
    id: 'm5', name: 'Leo Santos',    major: 'CS + Econ',      mode: 'gym',       lastMsg: 'upper body today, legs Friday?',       time: '5h',  unread: 0, modeColor: '#FF6A2E',
  },
  {
    id: 'm6', name: 'Nina Wu',       major: 'Bioengineering', mode: 'study',     lastMsg: 'orgo is actually killing me',           time: '1d',  unread: 0, modeColor: '#8FB37A',
  },
];

const tabCounts: Record<Tab, number> = { New: 3, Active: 9, Fading: 2 };

export default function MatchesPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Active');
  const [search, setSearch] = useState('');

  const filtered = seedMatches.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-ink-950 flex flex-col" aria-label="Your matches">
      {/* Header */}
      <div className="px-6 py-5 sticky top-0 z-40 glass">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-5">
            <Link href="/discover/study" className="text-bone-400 hover:text-bone-100 transition-colors" style={{ transitionDuration: '240ms' }} aria-label="Back to discover">
              <ArrowLeft className="w-5 h-5" aria-hidden="true" />
            </Link>
            <h1 className="text-h2 font-display text-bone-100">Matches</h1>
            <div className="w-5" aria-hidden="true" />
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bone-500" aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="search matches…"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg text-bone-100 placeholder:text-bone-500 text-body-sm focus:outline-none"
              style={{
                background: 'var(--ink-700)',
                border: '1px solid var(--border-default)',
                transition: 'border-color 240ms',
              }}
              aria-label="Search your matches"
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-0" role="tablist" aria-label="Match categories">
            {tabs.map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                onClick={() => setActiveTab(tab)}
                className="relative flex items-center gap-1.5 px-4 py-2 text-body-sm font-medium transition-colors"
                style={{
                  color: activeTab === tab ? 'var(--bone-100)' : 'var(--bone-500)',
                  transitionDuration: '240ms',
                }}
              >
                {tab}
                {tabCounts[tab] > 0 && (
                  <span
                    className="text-caption font-bold px-1.5 py-0.5 rounded-full"
                    style={{
                      background: activeTab === tab ? 'var(--ember-500)' : 'var(--ink-600)',
                      color: activeTab === tab ? 'var(--ink-900)' : 'var(--bone-400)',
                    }}
                  >
                    {tabCounts[tab]}
                  </span>
                )}
                {activeTab === tab && (
                  <motion.div
                    layoutId="tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-ember-500 rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Match list */}
      <div className="flex-1 px-6 py-4">
        <div className="max-w-lg mx-auto space-y-1">
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <MessageCircle className="w-10 h-10 text-bone-600 mx-auto mb-4" aria-hidden="true" />
              <p className="text-body text-bone-400">{copy.empty.matches.all}</p>
            </div>
          ) : (
            filtered.map((match, i) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: ease.out, delay: i * 0.04 }}
              >
                <Link
                  href={`/chat/${match.id}`}
                  className="flex items-center gap-4 px-4 py-4 rounded-xl group"
                  style={{
                    transition: 'background 240ms',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--ink-700)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  aria-label={`Chat with ${match.name}`}
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold"
                      style={{
                        background: `${match.modeColor}20`,
                        border: `1px solid ${match.modeColor}40`,
                        color: match.modeColor,
                      }}
                    >
                      {match.name[0]}
                    </div>
                    {/* Mode dot */}
                    <div
                      className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2"
                      style={{
                        background: match.modeColor,
                        borderColor: 'var(--ink-950)',
                      }}
                      aria-hidden="true"
                    />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p className="text-body font-semibold text-bone-100 truncate">{match.name}</p>
                      <span className="text-caption text-bone-500 shrink-0" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                        {match.time}
                      </span>
                    </div>
                    <p className="text-body-sm text-bone-400 truncate">{match.lastMsg}</p>
                  </div>

                  {/* Unread dot */}
                  {match.unread > 0 && (
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: 'var(--ember-500)' }}
                      aria-label={`${match.unread} unread messages`}
                    >
                      <span className="text-caption text-ink-900 font-bold leading-none">{match.unread}</span>
                    </div>
                  )}
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
