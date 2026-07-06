'use client';
import { useState } from 'react';
import { copy } from '@/copy/strings';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Props {
  onNext: (data: { email: string }) => void;
  setLoading: (v: boolean) => void;
}

function isEduEmail(email: string) {
  // Allow JIIT specific domains
  return /@(mail\.)?(jiit\.ac\.in|jaypeeu\.ac\.in)$/i.test(email);
}

export function StepEmail({ onNext, setLoading }: Props) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!isEduEmail(email)) {
      setError(copy.errors.domain_invalid);
      return;
    }
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    });

    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    onNext({ email });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      <div>
        <h1 className="display-md text-bone-100 mb-3">{copy.onboarding.step1.title}</h1>
        <p className="text-body text-bone-400">{copy.onboarding.step1.description}</p>
      </div>

      <div className="space-y-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={copy.onboarding.step1.placeholder}
          className="w-full px-4 py-4 rounded-lg text-bone-100 placeholder:text-bone-500 text-body focus:outline-none"
          style={{
            background: 'var(--ink-700)',
            border: `1px solid ${error ? 'var(--error)' : 'var(--border-default)'}`,
            transition: 'border-color 240ms',
          }}
          autoComplete="email"
          autoFocus
          aria-label="Campus email address"
          aria-describedby={error ? 'email-error' : undefined}
          required
        />
        {error && (
          <div id="email-error" role="alert" className="flex items-start gap-2 text-body-sm" style={{ color: 'var(--error)' }}>
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}
      </div>

      <MagneticButton type="submit" className="btn-primary w-full" aria-label="Send verification code">
        {copy.onboarding.step1.cta}
      </MagneticButton>
    </form>
  );
}
