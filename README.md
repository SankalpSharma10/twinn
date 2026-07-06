# VibeMatch 🔥

> **Campus-only, multi-mode matching for university students.**  
> Study buddies. Hackathon teams. Gym partners. No randoms.

---

## Quick Start (Local Dev)

```bash
# 1. Clone / navigate to the project
cd vibematch

# 2. Install dependencies (already done if you followed setup)
npm install

# 3. Set up environment variables
cp .env.local.example .env.local
# → Fill in your Supabase URL and anon key (see §Supabase Setup below)

# 4. Run the dev server
npm run dev
# → Open http://localhost:3000
```

---

## Environment Variables

Create `.env.local` from the example:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Enable the **`vector`** extension: Dashboard → Database → Extensions → search "vector"
3. Run the migration:
   ```sql
   -- Paste contents of supabase/migrations/001_schema.sql into the SQL editor
   ```
4. (Optional) Seed demo data:
   ```sql
   -- Paste contents of supabase/seed.sql into the SQL editor
   ```
5. Copy your `Project URL` and `anon key` from Settings → API into `.env.local`

---

## Project Structure

```
vibematch/
├── app/
│   ├── (marketing)/          # Landing, /manifesto
│   ├── (auth)/join/          # Onboarding flow (6 steps + quiz)
│   └── (app)/
│       ├── discover/[mode]/  # Swipe interface
│       ├── matches/          # Match list
│       ├── chat/[matchId]/   # Chat
│       └── me/               # Profile & settings
├── components/
│   ├── motion/               # MagneticCursor, MagneticButton, SplitText, Marquee, PageTransition
│   ├── sections/             # HowItWorks, Testimonials, ManifestoReveal, Footer
│   ├── swipe/                # SwipeCard, CardStack
│   ├── three/                # AuroraScene (GLSL), MatchOrb (R3F), ParticleSystem
│   └── ui/                  # GrainOverlay
├── copy/strings.ts           # ALL microcopy — zero strings in components
├── design/tokens.css         # CSS variables (ink, bone, ember)
├── lib/
│   ├── hooks/                # usePrefersReducedMotion, useAdaptiveTier
│   ├── motion/tokens.ts      # ease + duration constants
│   ├── shaders/aurora.glsl   # Custom GLSL fragment shader
│   ├── store.ts              # Zustand global store
│   └── supabase/             # client.ts, server.ts
├── supabase/
│   ├── migrations/001_schema.sql
│   └── seed.sql
└── tailwind.config.ts        # Full design system tokens
```

---

## Design System

| Token family | Values |
|---|---|
| **Ink** (backgrounds) | `--ink-950` → `--ink-500` |
| **Bone** (text) | `--bone-50` → `--bone-500` |
| **Ember** (accent) | `--ember-50` → `--ember-700` |
| **Radii** | sm 6 / md 10 / lg 16 / xl 24 / 2xl 32 / full 999 |
| **Fonts** | Fraunces (display) · Inter (body) · JetBrains Mono (code/OTP) |

Typography uses `font-variation-settings` for editorial Fraunces:
- Hero: `'opsz' 144, 'SOFT' 100, 'wght' 300` italic  
- Sections: `'opsz' 72, 'SOFT' 50, 'wght' 400`

---

## Signature Effects

| Effect | Implementation |
|---|---|
| Aurora hero background | Custom GLSL simplex-noise shader in R3F Canvas, 3-layer noise, ACES tonemapping, mouse parallax |
| Glass orb | `MeshTransmissionMaterial` (drei) + 30 ember orbiter spheres |
| Match celebration | 500-particle GPU instanced mesh, physics (gravity + air resistance), Framer Motion text reveal |
| Magnetic cursor | Spring-lagged dot + ring, shape morphs on hover/link/swipe |
| Magnetic buttons | `useMagnetic()` hook, spring translate, counter-parallax inner text |
| Swipe physics | Framer Motion drag, velocity threshold 800px/s, haptics via `navigator.vibrate` |
| Grain overlay | Fixed SVG turbulence noise, `mix-blend-mode: overlay`, animated 12s loop |

---

## Adaptive Performance Tiers

| Tier | Condition | Features disabled |
|---|---|---|
| 3 (High) | ≥6 cores, ≥4GB RAM, desktop | All effects on |
| 2 (Mid) | <6 cores OR mobile | ChromaticAberration off, 0.8x DPR |
| 1 (Low) | <4 cores OR <4GB RAM | Static aurora fallback, orb gradient only |

---

## Pages

| Route | Description |
|---|---|
| `/` | Landing — aurora hero, mode showcase, scroll storytelling |
| `/manifesto` | Easter egg — pure Fraunces typography love letter |
| `/join` | Onboarding — 6 steps (email → OTP → basics → photo → modes → quiz kickoff) |
| `/join/quiz/[mode]` | Per-mode quiz (study / hackathon / gym, 8Q each) |
| `/discover/[mode]` | Swipe interface with animated card stack |
| `/matches` | Match list with tabs and search |
| `/chat/[matchId]` | Realtime chat with typing indicator |
| `/me` | Profile & settings |

---

## Design Decisions

- **Dark mode only** — The Obsidian & Ember palette is a deliberate editorial commitment. No light mode toggle.
- **Ember as the only accent** — No blue/purple. Single hue = instant visual identity.
- **Fraunces variable** — The `opsz` axis makes the hero feel editorial at 144px vs generic at default. This is intentional.
- **Microcopy in `copy/strings.ts`** — All copy is centralized. No raw strings in components. Swap voice without touching UI code.
- **`cursor: none` on desktop** — Custom cursor replaces browser default. Falls back gracefully on touch devices.
- **Supabase Realtime + Presence** — Chat uses `postgres_changes` subscription. Typing indicators use Presence broadcast (not DB writes).

---

## Credits

- **Fonts**: Fraunces by Phaedra Charles + Flavia Zimbardi · Inter by Rasmus Andersson
- **3D**: React Three Fiber · drei · postprocessing
- **Animation**: Framer Motion · GSAP ScrollTrigger
- **Icons**: Lucide React
- **Backend**: Supabase (Postgres + Auth + Realtime)

---

*built for students who show up.*
