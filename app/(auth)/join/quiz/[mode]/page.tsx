'use client';
import { useState, useCallback, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ease, duration } from '@/lib/motion/tokens';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { ArrowLeft, Check } from 'lucide-react';

type Mode = 'study' | 'hackathon' | 'gym' | 'twinn';

interface Question {
  id: string;
  text: string;
  type: 'chips' | 'text';
  options?: string[];
}

const quizData: Record<Mode, Question[]> = {
  study: [
    { id: 'time',   type: 'chips', text: 'when do you study best?',             options: ['early morning', 'afternoon', 'late night', 'whenever'] },
    { id: 'place',  type: 'chips', text: 'where do you usually work?',          options: ['coffee shop', 'library', 'dorm room', 'anywhere'] },
    { id: 'vibe',   type: 'chips', text: 'study soundtrack?',                   options: ['silence', 'lo-fi', 'chatty background', 'music loud'] },
    { id: 'style',  type: 'chips', text: 'how do you prep for exams?',          options: ['steady grinder', 'last-minute crammer', 'somewhere between'] },
    { id: 'size',   type: 'chips', text: 'ideal study group size?',             options: ['just me', 'duo', 'small group (3–4)', 'the more the merrier'] },
    { id: 'track',  type: 'chips', text: "what's your track?",                  options: ['cs / stem', 'humanities', 'pre-med', 'business', 'arts', 'other'] },
    { id: 'weak',   type: 'chips', text: 'where do you need the most help?',   options: ['math / stats', 'writing', 'lab stuff', 'memorization', 'coding', 'theory'] },
    { id: 'class',  type: 'text',  text: "what's the class kicking your ass this semester?" },
  ],
  hackathon: [
    { id: 'role',     type: 'chips', text: 'your primary role?',                  options: ['design', 'frontend', 'backend', 'ml / ai', 'pm', 'hardware'] },
    { id: 'stack',    type: 'chips', text: 'your go-to stack?',                   options: ['react / next', 'python', 'node', 'swift / kotlin', 'pytorch', 'other'] },
    { id: 'goal',     type: 'chips', text: 'what are you optimizing for?',        options: ['win the prize', 'learn something new', 'ship something real', 'make friends'] },
    { id: 'sleep',    type: 'chips', text: 'sleep during hacks?',                 options: ['power through 48h', 'minimal sleep', 'steal a few hours', 'full 8h no matter what'] },
    { id: 'hacks',    type: 'chips', text: 'how many hacks have you done?',       options: ['this is my first', '1–3', '4–10', '10+'] },
    { id: 'archetype',type: 'chips', text: 'dream teammate energy?',              options: ['the closer', 'the visionary', 'the specialist', 'the chaos'] },
    { id: 'collab',   type: 'chips', text: 'how do you work best with others?',   options: ['async independently', 'real-time tight loop', 'pair programming', 'divide and conquer'] },
    { id: 'pitch',    type: 'text',  text: 'pitch your dream hack in one line.' },
  ],
  gym: [
    { id: 'style',    type: 'chips', text: 'training style?',                     options: ['lifting', 'running / cardio', 'calisthenics', 'group classes', 'sport', 'mixed'] },
    { id: 'time',     type: 'chips', text: 'when do you train?',                  options: ['5–7am', '7–9am', 'midday', 'after class', 'late evening'] },
    { id: 'spot',     type: 'chips', text: 'spot or solo?',                       options: ['I need a spotter', 'I prefer solo', 'depends on the lift', 'either is fine'] },
    { id: 'split',    type: 'chips', text: 'current split?',                      options: ['PPL', 'upper / lower', 'full body', 'bro split', 'no split / freestyle'] },
    { id: 'location', type: 'chips', text: 'which gym at JIIT?',                  options: ['main rec center', 'smaller fitness room', 'off-campus', 'outside / parks'] },
    { id: 'level',    type: 'chips', text: 'honestly — intimidated by the gym?',  options: ['not at all', 'a little', 'yeah, sometimes', 'working on it'] },
    { id: 'pr',       type: 'text',  text: 'what PR are you chasing right now?' },
    { id: 'why',      type: 'text',  text: 'what are you actually training for?' },
  ],
  twinn: [
    { id: 'tuesday',  type: 'chips', text: 'random tuesday evening — what are you doing?', options: ['Netflix', 'gaming', 'gymming', 'out with friends', 'reading', 'scrolling until 2am'] },
    { id: 'plans',    type: 'chips', text: 'how do you feel about spontaneous plans?',     options: ['love it, let\'s go', 'need a day\'s notice', 'depends on my mood', 'hard no'] },
    { id: 'hangout',  type: 'chips', text: 'ideal hangout with a new friend?',             options: ['coffee or chai', 'long walk', 'cooking something', 'co-working silently', 'canteen gossip', 'gaming session'] },
    { id: 'energy',   type: 'chips', text: 'you recharge by...',                           options: ['being around people', 'being completely alone', 'both, depends on the week'] },
    { id: 'comms',    type: 'chips', text: 'how do you actually communicate?',             options: ['voice notes all day', 'long heartfelt texts', 'short and fast', 'memes only', 'whatever they prefer'] },
    { id: 'archetype',type: 'chips', text: 'what kind of friend are you?',                 options: ['the planner', 'the therapist', 'the hype person', 'the chaos agent', 'the quiet reliable one'] },
    { id: 'music',    type: 'chips', text: 'your current listening vibe?',                 options: ['indie / alt', 'hip-hop / trap', 'pop', 'bollywood / desi', 'classical / jazz', 'everything honestly'] },
    { id: 'oneliner', type: 'text',  text: 'one thing people always get wrong about you.' },
  ],
};

interface PageProps {
  params: Promise<{ mode: string }>;
}

export default function QuizPage({ params }: PageProps) {
  const resolved = use(params);
  const mode = (resolved.mode as Mode) in quizData ? (resolved.mode as Mode) : 'study';
  const questions = quizData[mode];
  const router = useRouter();

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers]  = useState<Record<string, string | string[]>>({});
  const [textVal, setTextVal]  = useState('');

  const q = questions[current];
  const progress = (current + 1) / questions.length;

  const handleChip = useCallback((opt: string) => {
    setAnswers((prev) => {
      const existing = (prev[q.id] as string[] | undefined) ?? [];
      const next = existing.includes(opt)
        ? existing.filter((o) => o !== opt)
        : [...existing, opt];
      return { ...prev, [q.id]: next };
    });
    setTimeout(() => {
      setCurrent((c) => {
        if (c < questions.length - 1) return c + 1;
        router.push(`/discover/${mode}`);
        return c;
      });
    }, 220);
  }, [q, questions.length, mode, router]);

  const handleText = useCallback(() => {
    if (!textVal.trim()) return;
    setAnswers((prev) => ({ ...prev, [q.id]: textVal }));
    setTextVal('');
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      router.push(`/discover/${mode}`);
    }
  }, [textVal, q, current, questions.length, mode, router]);

  const isSelected = (opt: string) => {
    const val = answers[q.id];
    return Array.isArray(val) ? val.includes(opt) : val === opt;
  };

  return (
    <main className="min-h-screen bg-ink-950 flex flex-col" aria-label={`${mode} mode quiz`}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5">
        <button
          onClick={() => current > 0 ? setCurrent((c) => c - 1) : router.back()}
          className="flex items-center gap-2 text-bone-400 hover:text-bone-100 transition-colors"
          style={{ transitionDuration: '240ms' }}
          aria-label="Go back"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span className="text-body-sm">back</span>
        </button>

        {/* Progress bar */}
        <div
          className="flex-1 mx-8 h-0.5 rounded-full overflow-hidden"
          style={{ background: 'var(--ink-600)' }}
          role="progressbar"
          aria-valuenow={current + 1}
          aria-valuemax={questions.length}
          aria-label={`Question ${current + 1} of ${questions.length}`}
        >
          <motion.div
            className="h-full rounded-full bg-ember-500"
            animate={{ scaleX: progress }}
            style={{ originX: 0 }}
            transition={{ duration: 0.4, ease: ease.out }}
          />
        </div>

        <span
          className="text-body-sm text-bone-500 shrink-0"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          {current + 1}/{questions.length}
        </span>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: duration.quick, ease: ease.out }}
              className="space-y-8"
            >
              <h1 className="display-md text-bone-100" id={`question-${q.id}`}>
                {q.text}
              </h1>

              {q.type === 'chips' && q.options && (
                <div
                  className="flex flex-wrap gap-3"
                  role="group"
                  aria-labelledby={`question-${q.id}`}
                >
                  {q.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleChip(opt)}
                      aria-pressed={isSelected(opt)}
                      className="chip"
                      style={
                        isSelected(opt)
                          ? {
                              borderColor: 'var(--ember-500)',
                              color: 'var(--ember-400)',
                              background: 'rgba(255,106,46,0.12)',
                            }
                          : {}
                      }
                    >
                      {isSelected(opt) && (
                        <Check className="w-3 h-3" aria-hidden="true" />
                      )}
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {q.type === 'text' && (
                <div className="space-y-4">
                  <textarea
                    value={textVal}
                    onChange={(e) => setTextVal(e.target.value)}
                    placeholder="type your answer…"
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg text-bone-100 placeholder:text-bone-500 text-body focus:outline-none resize-none"
                    style={{
                      background: 'var(--ink-700)',
                      border: '1px solid var(--border-default)',
                      transition: 'border-color 240ms',
                    }}
                    aria-labelledby={`question-${q.id}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleText();
                      }
                    }}
                    autoFocus
                  />
                  <MagneticButton
                    onClick={handleText}
                    disabled={!textVal.trim()}
                    className="btn-primary w-full"
                    aria-label="Submit answer"
                  >
                    {current < questions.length - 1 ? 'next →' : 'finish quiz →'}
                  </MagneticButton>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
