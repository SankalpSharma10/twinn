'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { copy } from '@/copy/strings';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { TopProgressBar } from '@/components/motion/TopProgressBar';
import { ease, duration } from '@/lib/motion/tokens';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Steps
import { StepEmail }    from './steps/StepEmail';
import { StepOTP }      from './steps/StepOTP';
import { StepBasics }   from './steps/StepBasics';
import { StepPhoto }    from './steps/StepPhoto';
import { StepModes }    from './steps/StepModes';
import { StepQuizStart } from './steps/StepQuizStart';
import { StepSpotify }  from './steps/StepSpotify';

const TOTAL_STEPS = 7;

export default function JoinPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Record<string, unknown>>({});

  const next = useCallback((newData?: Record<string, unknown>) => {
    if (newData) setData((prev) => ({ ...prev, ...newData }));
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }, []);

  const back = useCallback(() => setStep((s) => Math.max(s - 1, 1)), []);

  const hasSaved = useRef(false);

  useEffect(() => {
    if (step === TOTAL_STEPS && !hasSaved.current) {
      hasSaved.current = true;
      const saveProfile = async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const email = user.email || data.email as string;
        const edu_domain = email?.split('@')[1] || 'jiit.ac.in';
        const display_name = `${data.firstName || ''} ${data.lastName || ''}`.trim();
        const photo_blurhash = 'L5H2EC=PM+yV0g-mq.wG9c01JPRj'; // Dummy blurhash for now

        // --- ML VECTOR GENERATION ---
        const vibeString = `Student in ${data.major}, Class of ${data.year}. Music taste: ${data.artist_hindi}, ${data.artist_english}, ${data.artist_punjabi}.`;
        
        const worker = new Worker(new URL('../../../lib/ml/worker.ts', import.meta.url), { type: 'module' });
        
        worker.postMessage({ text: vibeString });
        
        worker.addEventListener('message', async (event) => {
          if (event.data.status === 'complete') {
            const vibe_vector = event.data.output; // The 384 array!

            // 1. Upsert Profile
            const { error: profileError } = await supabase
              .from('profiles')
              .upsert({
                id: user.id,
                email,
                edu_domain,
                display_name,
                pronouns: data.pronouns as string,
                year: data.year as string,
                major: data.major as string,
                artist_hindi: data.artist_hindi as string,
                artist_english: data.artist_english as string,
                artist_punjabi: data.artist_punjabi as string,
                vibe_vector: vibe_vector, // Save the ML vector
                photo_blurhash,
                verified: true,
              }, { onConflict: 'id' });
            
            if (profileError) console.error('Error saving profile:', profileError);

            // 2. Upsert Modes
            const modes = (data.modes as string[]) || [];
            for (const mode of modes) {
              const { error: modeError } = await supabase
                .from('user_modes')
                .upsert({
                  user_id: user.id,
                  mode_id: mode,
                  active: true,
                }, { onConflict: 'user_id,mode_id' });
              
              if (modeError) console.error(`Error saving mode ${mode}:`, modeError);
            }
          }
        });
      };

      saveProfile();
    }
  }, [step, data]);

  return (
    <main className="min-h-screen flex flex-col" style={{ background: 'var(--ink-950)' }} aria-label="Join Twinn">
      <TopProgressBar loading={loading} />

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5">
        {step > 1 ? (
          <button
            onClick={back}
            className="flex items-center gap-2 transition-colors"
            style={{ color: 'var(--bone-400)', transitionDuration: '240ms' }}
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="body-sm">back</span>
          </button>
        ) : (
          <Link href="/" className="font-display text-xl transition-colors" style={{ color: 'var(--bone-400)', transitionDuration: '240ms' }}>
            twinn
          </Link>
        )}

        {/* Progress segments */}
        <div className="flex items-center gap-1.5" role="progressbar" aria-valuenow={step} aria-valuemax={TOTAL_STEPS} aria-label={`Step ${step} of ${TOTAL_STEPS}`}>
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className="h-0.5 w-6 rounded-full overflow-hidden"
              style={{ background: 'var(--ink-600)' }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: i === step - 1 ? 'var(--ember-400)' : i < step - 1 ? 'var(--ember-600)' : 'transparent',
                  originX: 0,
                }}
                animate={{ scaleX: i < step ? 1 : 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: duration.quick, ease: ease.out }}
            >
              {step === 1 && <StepEmail onNext={next} setLoading={setLoading} />}
              {step === 2 && <StepOTP email={data.email as string} onNext={next} setLoading={setLoading} />}
              {step === 3 && <StepBasics onNext={next} />}
              {step === 4 && <StepPhoto onNext={next} setLoading={setLoading} />}
              {step === 5 && <StepModes onNext={next} />}
              {step === 6 && <StepSpotify onNext={next} setLoading={setLoading} />}
              {step === 7 && <StepQuizStart modes={data.modes as string[]} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
