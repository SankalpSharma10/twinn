'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { quizzes } from '@/copy/quizzes';
import { createClient } from '@/lib/supabase/client';
import { TopProgressBar } from '@/components/motion/TopProgressBar';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { ArrowLeft } from 'lucide-react';

export default function QuizPage({ params }: { params: { mode: string } }) {
  const router = useRouter();
  const mode = params.mode;
  const questions = quizzes[mode] || [];
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // If invalid mode, redirect
  useEffect(() => {
    if (!questions.length) {
      router.push('/join?step=7');
    }
  }, [mode, questions, router]);

  const handleSelect = (optionValue: string) => {
    const q = questions[currentIdx];
    setAnswers(prev => ({ ...prev, [q.id]: optionValue }));
    
    // Auto advance after 400ms
    setTimeout(() => {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(c => c + 1);
      } else {
        handleFinish({ ...answers, [q.id]: optionValue });
      }
    }, 400);
  };

  const handleFinish = async (finalAnswers: Record<string, string>) => {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Construct the text payload for the ML model
    // e.g. "study_location: library_silent, study_style: panic_cram..."
    const answerStrings = Object.entries(finalAnswers).map(([k, v]) => `${k}: ${v}`);
    const quizText = `${mode} mode preferences: ${answerStrings.join(', ')}`;

    // Call the Web Worker to generate the vector
    const worker = new Worker(new URL('../../../../../lib/ml/worker.ts', import.meta.url), { type: 'module' });
    
    worker.postMessage({ text: quizText });
    
    worker.addEventListener('message', async (event) => {
      if (event.data.status === 'complete') {
        const quiz_vector = event.data.output;

        // Save to Supabase user_modes
        const { error } = await supabase
          .from('user_modes')
          .update({
            quiz_answers: finalAnswers,
            quiz_vector: quiz_vector
          })
          .eq('user_id', user.id)
          .eq('mode_id', mode);
          
        if (error) {
          console.error('Error saving quiz:', error);
        }

        setLoading(false);
        // Redirect to discover or back to step 7
        router.push('/join?step=7');
      }
    });
  };

  if (!questions.length) return null;
  const q = questions[currentIdx];

  return (
    <main className="min-h-screen flex flex-col p-6" style={{ background: 'var(--ink-950)' }}>
      <TopProgressBar loading={loading} />
      
      <div className="flex-1 w-full max-w-lg mx-auto flex flex-col justify-center">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => currentIdx > 0 ? setCurrentIdx(c => c - 1) : router.push('/join?step=7')}
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'var(--ink-800)' }}
          >
            <ArrowLeft className="w-5 h-5 text-bone-100" />
          </button>
          <div className="flex-1">
            <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'var(--ink-800)' }}>
              <motion.div 
                className="h-full rounded-full"
                style={{ background: 'var(--ember-500)' }}
                initial={{ width: 0 }}
                animate={{ width: `${((currentIdx) / questions.length) * 100}%` }}
              />
            </div>
            <p className="text-caption text-bone-500 mt-2 uppercase tracking-widest text-center">
              Question {currentIdx + 1} of {questions.length}
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="space-y-6"
          >
            <h2 className="display-sm text-bone-100 text-center mb-8">
              {q.question}
            </h2>

            <div className="space-y-3">
              {q.options.map((opt) => {
                const isSelected = answers[q.id] === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className="w-full p-4 rounded-xl text-left body transition-all"
                    style={{
                      background: isSelected ? 'var(--ember-500)' : 'var(--ink-800)',
                      color: isSelected ? '#000' : 'var(--bone-100)',
                      border: `1px solid ${isSelected ? 'var(--ember-500)' : 'var(--border-default)'}`
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
