import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manifesto — Twinn',
  description: 'A love letter to students who actually show up.',
};

export default function ManifestoPage() {
  return (
    <main
      className="min-h-screen bg-ink-950 flex flex-col items-center justify-center px-6 py-32"
      aria-label="Manifesto"
    >
      <div className="max-w-2xl w-full">
        {/* Eyebrow */}
        <p
          className="caption text-ember-500 mb-16 tracking-widest text-center"
          aria-hidden="true"
        >
          — TWINN MANIFESTO
        </p>

        {/* Long-form love letter */}
        <article className="space-y-10">
          <p
            className="display-lg text-bone-100"
            style={{
              fontFamily: 'Fraunces, serif',
              fontVariationSettings: "'opsz' 72, 'SOFT' 100, 'wght' 300",
              fontStyle: 'italic',
            }}
          >
            we don't do bios.
          </p>
          <p
            className="display-lg text-bone-100"
            style={{
              fontFamily: 'Fraunces, serif',
              fontVariationSettings: "'opsz' 72, 'SOFT' 100, 'wght' 300",
              fontStyle: 'italic',
            }}
          >
            we don't do vibes.
          </p>
          <p
            className="display-lg text-bone-100"
            style={{
              fontFamily: 'Fraunces, serif',
              fontVariationSettings: "'opsz' 72, 'SOFT' 100, 'wght' 300",
              fontStyle: 'italic',
            }}
          >
            we don't do randos.
          </p>

          <div
            className="w-16 h-px my-12"
            style={{ background: 'var(--border-strong)' }}
            aria-hidden="true"
          />

          <p className="body-lg text-bone-300 leading-relaxed">
            here's what we know about you: you're the one who sets three alarms for 6am leg day
            and actually goes. the one who's still in the library at 2am not because you have to
            be, but because that's just how you do things. the one who commits to a hackathon and
            means it.
          </p>

          <p className="body-lg text-bone-300 leading-relaxed">
            and here's what we also know: campus is full of people exactly like you. you just
            haven't found them yet. not because they don't exist — but because the tools we have
            for finding people are built for attention, not connection.
          </p>

          <p className="body-lg text-bone-300 leading-relaxed">
            instagram shows you who's curated. twitter shows you who's opinionated. dating apps
            show you who's available. none of them show you who's <em className="text-bone-100">reliable.</em>
          </p>

          <p className="body-lg text-bone-300 leading-relaxed">
            that's the gap we're filling. twinn isn't a social network. it's not a dating app.
            it's a reliability filter. a shared accountability partner. a way of saying: i'm going
            to show up — do you want to show up too?
          </p>

          <p className="body-lg text-bone-300 leading-relaxed">
            campus-only isn't a limitation. it's the point. we trust you because you go to the
            same institution, live in the same zip code, breathe the same pre-finals air. that
            shared context is worth something.
          </p>

          <div
            className="w-16 h-px my-12"
            style={{ background: 'var(--border-strong)' }}
            aria-hidden="true"
          />

          <p
            className="display-md text-ember-500"
            style={{
              fontFamily: 'Fraunces, serif',
              fontVariationSettings: "'opsz' 72, 'SOFT' 100, 'wght' 400",
              fontStyle: 'italic',
            }}
          >
            we do people who show up.
          </p>

          <p
            className="display-md text-bone-500"
            style={{
              fontFamily: 'Fraunces, serif',
              fontVariationSettings: "'opsz' 72, 'SOFT' 50, 'wght' 300",
            }}
          >
            — twinn
          </p>
        </article>

        {/* Back link */}
        <div className="mt-24 text-center">
          <a
            href="/"
            className="text-body-sm text-bone-500 hover:text-bone-300"
            style={{ transition: 'color 240ms' }}
          >
            ← back to the app
          </a>
        </div>
      </div>
    </main>
  );
}
