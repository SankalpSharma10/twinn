'use client';
import { useState, useCallback } from 'react';
import { copy } from '@/copy/strings';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { Upload, Camera } from 'lucide-react';

interface Props {
  onNext: (data: Record<string, unknown>) => void;
  setLoading: (v: boolean) => void;
}

export function StepPhoto({ onNext, setLoading }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError]     = useState('');

  const handleFile = useCallback((file: File) => {
    if (file.size > 5 * 1024 * 1024) { setError(copy.errors.upload_too_large); return; }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError(copy.errors.upload_wrong_type); return;
    }
    setError('');
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!preview) { setError(copy.errors.photo_required); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    onNext({ photo: preview });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      <div>
        <h1 className="display-md text-bone-100 mb-3">{copy.onboarding.step4.title}</h1>
        <p className="text-body text-bone-400">{copy.onboarding.step4.description}</p>
      </div>

      {/* Drop zone */}
      <label
        htmlFor="photo-upload"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="block cursor-pointer"
        aria-label="Upload your photo"
      >
        <div
          className="relative aspect-square max-w-xs mx-auto rounded-2xl overflow-hidden flex flex-col items-center justify-center"
          style={{
            background: preview ? 'transparent' : 'var(--ink-700)',
            border: `2px dashed ${preview ? 'var(--ember-500)' : 'var(--border-default)'}`,
            transition: 'border-color 240ms',
          }}
        >
          {preview ? (
            <>
              <img src={preview} alt="Your photo preview" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-ink-950/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity" style={{ transitionDuration: '240ms' }}>
                <span className="text-bone-100 text-body-sm font-medium">change photo</span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4 p-12 text-center">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--ink-600)', border: '1px solid var(--border-default)' }}
              >
                <Upload className="w-6 h-6 text-bone-400" aria-hidden="true" />
              </div>
              <div>
                <p className="text-body text-bone-300 font-medium">drop your photo here</p>
                <p className="text-body-sm text-bone-500 mt-1">or click to browse</p>
              </div>
              <p className="text-caption text-bone-500 uppercase tracking-widest">JPG · PNG · WEBP · MAX 5MB</p>
            </div>
          )}
        </div>
        <input
          id="photo-upload"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={handleInputChange}
        />
      </label>

      {error && <p role="alert" className="text-body-sm text-center" style={{ color: 'var(--error)' }}>{error}</p>}

      <MagneticButton
        type="submit"
        className="btn-primary w-full"
        disabled={!preview}
        aria-label="Use this photo and continue"
      >
        {copy.onboarding.step4.cta}
      </MagneticButton>
    </form>
  );
}
