'use client';
import { useState } from 'react';
import { copy } from '@/copy/strings';
import { MagneticButton } from '@/components/motion/MagneticButton';

interface Props {
  onNext: (data: Record<string, unknown>) => void;
}

const pronounOptions = ['she/her', 'he/him', 'they/them', 'ask me'];
const yearOptions    = ["'25", "'26", "'27", "'28", 'grad'];
const majors         = [
  'Computer Science', 'Data Science', 'Electrical Engineering', 'Mechanical Engineering',
  'Biology', 'Chemistry', 'Physics', 'Mathematics', 'Economics', 'Statistics',
  'Pre-Med', 'Psychology', 'Political Science', 'Philosophy', 'English',
  'Architecture', 'Design', 'Business', 'Linguistics', 'Sociology', 'Other',
];

export function StepBasics({ onNext }: Props) {
  const [name, setName]         = useState('');
  const [pronouns, setPronouns] = useState('');
  const [year, setYear]         = useState('');
  const [major, setMajor]       = useState('');
  const [error, setError]       = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError(copy.errors.name_required); return; }
    onNext({ name, pronouns, year, major });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      <div>
        <h1 className="display-md text-bone-100 mb-3">{copy.onboarding.step3.title}</h1>
        <p className="text-body text-bone-400">{copy.onboarding.step3.description}</p>
      </div>

      <div className="space-y-4">
        {/* Name */}
        <input
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); setError(''); }}
          placeholder="your name"
          className="w-full px-4 py-4 rounded-lg text-bone-100 placeholder:text-bone-500 text-body focus:outline-none"
          style={{
            background: 'var(--ink-700)',
            border: `1px solid ${error ? 'var(--error)' : 'var(--border-default)'}`,
            transition: 'border-color 240ms',
          }}
          autoFocus
          aria-label="Your name"
          required
        />
        {error && <p role="alert" className="text-body-sm" style={{ color: 'var(--error)' }}>{error}</p>}

        {/* Pronouns */}
        <div>
          <p className="text-body-sm text-bone-400 mb-2">pronouns</p>
          <div className="flex flex-wrap gap-2">
            {pronounOptions.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPronouns(p === pronouns ? '' : p)}
                className={`chip ${pronouns === p ? 'active' : ''}`}
                aria-pressed={pronouns === p}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Year */}
        <div>
          <p className="text-body-sm text-bone-400 mb-2">class year</p>
          <div className="flex flex-wrap gap-2">
            {yearOptions.map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => setYear(y === year ? '' : y)}
                className={`chip ${year === y ? 'active' : ''}`}
                aria-pressed={year === y}
              >
                {y}
              </button>
            ))}
          </div>
        </div>

        {/* Major */}
        <div>
          <p className="text-body-sm text-bone-400 mb-2">major</p>
          <select
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            className="w-full px-4 py-3 rounded-lg text-bone-100 text-body focus:outline-none appearance-none"
            style={{
              background: 'var(--ink-700)',
              border: '1px solid var(--border-default)',
              transition: 'border-color 240ms',
            }}
            aria-label="Your major"
          >
            <option value="" disabled>select your major</option>
            {majors.map((m) => (
              <option key={m} value={m} style={{ background: 'var(--ink-800)' }}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      <MagneticButton type="submit" className="btn-primary w-full" aria-label="Continue to photo step">
        {copy.onboarding.step3.cta}
      </MagneticButton>
    </form>
  );
}
