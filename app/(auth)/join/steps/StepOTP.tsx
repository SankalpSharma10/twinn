'use client';
import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { copy } from '@/copy/strings';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { AlertCircle } from 'lucide-react';
import { ease } from '@/lib/motion/tokens';

interface Props {
  email: string;
  onNext: (data: Record<string, unknown>) => void;
  setLoading: (v: boolean) => void;
}

const CODE_LENGTH = 6;
const RESEND_DELAY = 30;

export function StepOTP({ email, onNext, setLoading }: Props) {
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(RESEND_DELAY);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const handleChange = (i: number, val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[i] = cleaned;
    setDigits(next);
    if (cleaned && i < CODE_LENGTH - 1) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH);
    if (pasted.length === CODE_LENGTH) {
      setDigits(pasted.split(''));
      refs.current[CODE_LENGTH - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = digits.join('');
    if (code.length < CODE_LENGTH) { setError(copy.errors.otp_invalid); return; }
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    onNext({ verified: true });
  };

  const handleResend = () => {
    setResendTimer(RESEND_DELAY);
    setDigits(Array(CODE_LENGTH).fill(''));
    refs.current[0]?.focus();
  };

  const isComplete = digits.every(Boolean);

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      <div>
        <h1 className="display-md text-bone-100 mb-3">{copy.onboarding.step2.title}</h1>
        <p className="text-body text-bone-400">
          {copy.onboarding.step2.description}
          {email && (
            <span className="text-bone-300 block mt-1 font-mono text-body-sm">{email}</span>
          )}
        </p>
      </div>

      {/* OTP boxes */}
      <div className="flex gap-3 justify-center" onPaste={handlePaste} role="group" aria-label="One-time code input">
        {digits.map((d, i) => (
          <motion.input
            key={i}
            ref={(el) => { refs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-12 h-14 text-center text-h1 font-mono text-bone-100 rounded-lg focus:outline-none"
            style={{
              background: 'var(--ink-700)',
              border: `1px solid ${error ? 'var(--error)' : d ? 'var(--ember-500)' : 'var(--border-default)'}`,
              transition: 'border-color 240ms, box-shadow 240ms',
              boxShadow: d ? 'var(--shadow-ember)' : 'none',
              fontFamily: 'JetBrains Mono, monospace',
            }}
            aria-label={`Digit ${i + 1} of ${CODE_LENGTH}`}
            animate={error ? { x: [0, -4, 4, -4, 4, 0] } : {}}
            transition={{ duration: 0.4, ease: ease.out }}
          />
        ))}
      </div>

      {error && (
        <div role="alert" className="flex items-center gap-2 text-body-sm justify-center" style={{ color: 'var(--error)' }}>
          <AlertCircle className="w-4 h-4" aria-hidden="true" />
          {error}
        </div>
      )}

      <MagneticButton
        type="submit"
        className="btn-primary w-full"
        disabled={!isComplete}
        aria-label="Verify code"
      >
        {copy.onboarding.step2.cta}
      </MagneticButton>

      <p className="text-center text-body-sm text-bone-500">
        {resendTimer > 0 ? (
          <>resend in <span className="font-mono text-bone-400" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{resendTimer}s</span></>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            className="text-ember-400 hover:text-ember-300 transition-colors"
            style={{ transitionDuration: '240ms' }}
          >
            {copy.onboarding.step2.resend}
          </button>
        )}
      </p>
    </form>
  );
}
