import { SplitText } from '@/components/motion/SplitText';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { Marquee } from '@/components/motion/Marquee';
import { copy } from '@/copy/strings';
import Link from 'next/link';
import { BookOpen, Laptop, Dumbbell, ChevronDown, ArrowRight, Sparkles } from 'lucide-react';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { ManifestoReveal } from '@/components/sections/ManifestoReveal';
import { Footer } from '@/components/sections/Footer';
import { HeroCanvas } from '@/components/three/HeroCanvas';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Twinn — Find your people. Not your feed.',
  description:
    'JIIT-only matching for study sessions, hackathons, gym days, and finding your person. No randoms.',
};

const campuses = [
  'JIIT Noida - Sector 62', 'JIIT Noida - Sector 128'
];

const modeData = [
  {
    id: 'study',
    icon: BookOpen,
    tag: copy.modes.study.tag,
    tagline: copy.modes.study.tagline,
    body: "Matched by class schedule, study style, and the subject you're struggling with most.",
    color: '#8FB37A',
  },
  {
    id: 'hackathon',
    icon: Laptop,
    tag: copy.modes.hackathon.tag,
    tagline: copy.modes.hackathon.tagline,
    body: "Matched by role, stack, and whether you're building to win or to learn. Both are valid.",
    color: '#E8B34A',
  },
  {
    id: 'gym',
    icon: Dumbbell,
    tag: copy.modes.gym.tag,
    tagline: copy.modes.gym.tagline,
    body: "Matched by training style, schedule, and the workout currently humbling you.",
    color: '#FF6A2E',
  },
  {
    id: 'twinn',
    icon: Sparkles,
    tag: copy.modes.twinn.tag,
    tagline: copy.modes.twinn.tagline,
    body: "Matched on personality, music taste, communication style, and the little things that make you, you.",
    color: '#A78BFA',
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen" style={{ background: 'var(--ink-950)' }}>

      {/* --- Nav ------------------------------------------------------------ */}
      <nav className="glass fixed top-0 left-0 right-0 z-50 px-6 md:px-12" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16">

          <Link href="/" className="font-display text-xl font-medium flex items-center gap-2" style={{ color: 'var(--bone-100)' }} aria-label="Twinn home">
            twinn
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="#how-it-works" className="nav-link">How it works</Link>
            <Link href="#modes"        className="nav-link">Modes</Link>
            <Link href="/manifesto"    className="nav-link">Manifesto</Link>
          </div>

          <Link href="/join" id="nav-cta">
            <MagneticButton className="btn-primary" style={{ padding: '10px 20px', fontSize: '14px' } as React.CSSProperties}>
              {copy.nav.cta}
            </MagneticButton>
          </Link>
        </div>
      </nav>

      {/* --- Hero ----------------------------------------------------------- */}
      <section className="relative h-screen flex items-center overflow-hidden" aria-label="Hero">
        <HeroCanvas />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full pt-16">
          <div className="max-w-2xl">
            <p className="caption mb-6" style={{ color: 'var(--ember-500)', letterSpacing: '0.16em' }}>
              {copy.hero.eyebrow}
            </p>

            <h1 className="display-xl mb-6" style={{ color: 'var(--bone-50)' }}>
              <SplitText text={copy.hero.h1[0]} stagger={0.05} />
              <br />
              <SplitText text={copy.hero.h1[1]} stagger={0.05} delay={0.18} />
            </h1>

            <p className="body-lg mb-10 max-w-md" style={{ color: 'var(--bone-300)' }}>
              {copy.hero.lede}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link href="/join" id="hero-cta-primary">
                <MagneticButton className="btn-primary">{copy.hero.ctaPrimary}</MagneticButton>
              </Link>
              <Link href="/manifesto" className="btn-ghost" id="hero-cta-secondary">
                {copy.hero.ctaSecondary}
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" aria-hidden="true">
          <div className="w-px h-8 animate-scroll-y" style={{ background: 'var(--bone-500)' }} />
          <ChevronDown className="w-4 h-4" style={{ color: 'var(--bone-500)' }} />
        </div>
      </section>

      {/* --- Social proof --------------------------------------------------- */}
      <section className="overflow-hidden py-4" style={{ borderTop: '1px solid var(--border-hairline)', borderBottom: '1px solid var(--border-hairline)' }} aria-label="Campuses on waitlist">
        <Marquee speed={30}>
          {campuses.map((campus) => (
            <div key={campus} className="flex items-center gap-4 shrink-0" style={{ color: 'var(--bone-500)' }}>
              <span className="body-sm whitespace-nowrap">{campus}</span>
              <span className="w-1 h-1 rounded-full" style={{ background: 'rgba(255,106,46,0.4)' }} aria-hidden="true" />
            </div>
          ))}
        </Marquee>
      </section>

      {/* --- Mode showcase -------------------------------------------------- */}
      <section id="modes" className="py-32 px-6 md:px-12" aria-label="Modes">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="caption mb-4" style={{ color: 'var(--ember-500)', letterSpacing: '0.16em' }}>FOUR MODES. ONE REASON.</p>
            <h2 className="display-lg" style={{ color: 'var(--bone-100)' }}>built for how you actually live.</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {modeData.map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.id} className="mode-card card p-8">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                    style={{ background: `${m.color}18`, border: `1px solid ${m.color}30` }}>
                    <Icon className="w-6 h-6" style={{ color: m.color }} aria-hidden="true" />
                  </div>
                  <p className="caption mb-3" style={{ color: m.color, letterSpacing: '0.16em' }}>{m.tag}</p>
                  <h3 className="display-md mb-4" style={{ color: 'var(--bone-100)' }}>{m.tagline}</h3>
                  <p className="body" style={{ color: 'var(--bone-400)' }}>{m.body}</p>
                  <div className="mode-card-cta mt-6 flex items-center gap-2 body-sm font-medium"
                    style={{ color: m.color }} aria-hidden="true">
                    Explore {m.id} mode <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <HowItWorks />
      <TestimonialsSection />
      <ManifestoReveal />

      {/* --- Final CTA ------------------------------------------------------ */}
      <section className="py-32 px-6 md:px-12 text-center" aria-label="Join waitlist">
        <div className="max-w-xl mx-auto">
          <p className="caption mb-4" style={{ color: 'var(--ember-500)', letterSpacing: '0.16em' }}>READY?</p>
          <h2 className="display-lg mb-6" style={{ color: 'var(--bone-100)' }}>drop your .edu.</h2>
          <p className="body-lg mb-10" style={{ color: 'var(--bone-400)' }}>we'll ping you when your campus goes live.</p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="you@jiit.ac.in"
              className="waitlist-input flex-1 px-4 py-3 rounded-lg body"
              id="waitlist-email"
              aria-label="Campus email for early access"
            />
            <Link href="/join" id="waitlist-cta">
              <MagneticButton className="btn-primary whitespace-nowrap">Join waitlist</MagneticButton>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
