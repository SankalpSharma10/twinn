// Twinn — Complete Microcopy Inventory
// All copy lives here. Never hardcode strings in components.

export const copy = {
  // ─── Empty States ───────────────────────────────────────────────────────────
  empty: {
    discover: {
      study:     "you've seen everyone in study mode. impressive. check back tomorrow — new folks join every day. or switch modes?",
      hackathon: "you've seen everyone in hackathon mode. maybe start your own team?",
      gym:       "you've seen everyone in gym mode. touch grass. we'll ping you when new people show up.",
      twinn:     "you've seen everyone in twinn mode. you might actually be first. that's a flex.",
      default:   "nobody here yet. you might actually be first. that's a flex.",
    },
    matches: {
      new:    "no new matches yet. that's okay — the good ones take a beat.",
      active: "no active convos. first move is always the hardest one.",
      fading: "nothing fading out. you're locked in.",
      all:    "your matches will live here. start swiping.",
    },
    chat:          "no messages yet. break the ice — we seeded some starters below.",
    search:        "no results. try a different name or check your spelling.",
    notifications: "you're all caught up. for now.",
    profile:       "add a bio so people know what you're about.",
  },

  // ─── Errors ─────────────────────────────────────────────────────────────────
  errors: {
    domain_not_found:   "that doesn't look like a JIIT email — drop it in the waitlist and we'll ping you.",
    domain_invalid:     "that doesn't look like a JIIT email. we're JIIT-only, for real.",
    otp_invalid:        "that code's not right. double-check your student inbox (yes, the one you never open).",
    otp_expired:        "that code expired. happens to the best of us — hit resend.",
    otp_max_attempts:   "too many tries. wait a few minutes and request a new code.",
    upload_too_large:   "that photo is too large. try one under 5MB.",
    upload_wrong_type:  "we only take JPG, PNG, or WEBP. not that random file.",
    network:            "connection dropped. check your wifi and try again.",
    generic:            "something went sideways. try again in a sec.",
    session_expired:    "you got logged out. happens. sign back in.",
    profile_incomplete: "finish setting up your profile first.",
    mode_required:      "pick at least one mode. study, hackathon, gym, or twinn — your call.",
    photo_required:     "add a photo. not your dog. (unless you're the dog.)",
    name_required:      "we need a name. doesn't have to be your full legal one.",
    match_failed:       "couldn't process that match. try again.",
    swipe_failed:       "swipe didn't register. try again.",
    quiz_incomplete:    "answer all the questions — they're how we find your people.",
    chat_send_failed:   "message didn't go through. check your connection.",
    chat_load_failed:   "couldn't load messages. pull to refresh.",
    unmatch_failed:     "couldn't unmatch right now. try again in a sec.",
    report_sent:        "report received. we take this seriously.",
    block_success:      "blocked. they won't see you anymore.",
    settings_save_fail: "couldn't save that. try again.",
    photo_crop_fail:    "photo crop failed. try a different image.",
    spotify_connect:    "couldn't connect Spotify. try again.",
  },

  // ─── Loading States ──────────────────────────────────────────────────────────
  loading: {
    default:      "one sec…",
    auth:         "checking your JIIT email…",
    otp_send:     "sending the code…",
    otp_verify:   "verifying…",
    spotify:      "connecting to Spotify…",
    discover:     {
      study:     "finding your study people…",
      hackathon: "assembling your crew…",
      gym:       "finding your gym buddy…",
      twinn:     "finding your twinn…",
      default:   "finding your people…",
    },
    profile_save: "saving your profile…",
    photo_upload: "uploading your photo…",
    quiz_save:    "saving your vibe check…",
    matches:      "loading your matches…",
    chat:         "loading the chat…",
    hero_scene:   "warming up the aurora…",
    match_check:  "checking for a match…",
    settings:     "loading your settings…",
  },

  // ─── Toast Confirmations ─────────────────────────────────────────────────────
  toasts: {
    profile_saved:      "profile updated. looking good.",
    mode_enabled:       (mode: string) => `${mode} mode on. you're now visible.`,
    mode_disabled:      (mode: string) => `${mode} mode off. you've disappeared from that feed.`,
    photo_uploaded:     "photo saved. nice one.",
    otp_resent:         "new code sent. check your inbox.",
    unmatched:          "unmatched. they won't know it was you.",
    reported:           "report sent. we'll look into it.",
    blocked:            "blocked. you're invisible to them now.",
    settings_saved:     "saved.",
    notification_on:    "notifications on.",
    notification_off:   "notifications off.",
    link_copied:        "link copied.",
    account_deleted:    "account deleted. take care of yourself.",
    spotify_connected:  "Spotify connected. your music taste is now part of your vibe.",
    spotify_skipped:    "no worries — you can always connect later in settings.",
  },

  // ─── Match Celebration Lines (random pool of 8) ───────────────────────────
  matchLines: [
    "you two are a hazard 🔥",
    "call it fate. or the algorithm. same thing.",
    "okay the vibe check passed. now go show up.",
    "jiit just got a little smaller.",
    "this one's on you. don't ghost them.",
    "we did our part. the rest is yours.",
    "coincidence? we don't think so.",
    "two people who show up. imagine that.",
  ],

  // ─── Icebreakers (per mode) ──────────────────────────────────────────────────
  icebreakers: {
    study:     [
      "end sems in 3 weeks. wanna grind together?",
      "library or canteen?",
      "what subject is kicking your ass this sem?",
      "study session this weekend?",
    ],
    hackathon: [
      "team of 2 for the next hackathon?",
      "what's your go-to stack?",
      "sleep during hacks or power through?",
      "got a hack idea or winging it?",
    ],
    gym:       [
      "legs tomorrow 7am?",
      "what are you training for right now?",
      "JIIT gym or outside?",
      "spot or solo?",
    ],
    twinn:     [
      "random tuesday evening — what are you doing?",
      "coffee or a walk?",
      "what's the last thing that genuinely made you laugh?",
      "do you initiate plans or wait to be asked?",
    ],
  },

  // ─── Nav & UI Labels ─────────────────────────────────────────────────────────
  nav: {
    howItWorks: 'How it works',
    modes:      'Modes',
    manifesto:  'Manifesto',
    cta:        'Get early access',
  },

  // ─── Mode Labels ─────────────────────────────────────────────────────────────
  modes: {
    study:     { label: 'Study',     tag: 'STUDY MODE',     tagline: 'study buddies who actually open the textbook' },
    hackathon: { label: 'Hackathon', tag: 'HACKATHON MODE', tagline: 'cofounders for 48 hours. maybe longer.' },
    gym:       { label: 'Gym',       tag: 'GYM MODE',       tagline: "someone to make you go on the days you wouldn't." },
    twinn:     { label: 'Twinn',     tag: 'TWINN MODE',     tagline: 'find the person who just gets it. no reason needed.' },
  },

  // ─── Onboarding ──────────────────────────────────────────────────────────────
  onboarding: {
    step1: {
      title:       "what's your JIIT email?",
      description: "we'll only ever use it to check you're a real JIIT student.",
      placeholder: "you@jiit.ac.in",
      cta:         "send me the code",
    },
    step2: {
      title:       "we sent a code.",
      description: "check your student inbox (yes, the one you never open).",
      resend:      "resend code",
      cta:         "verify",
    },
    step3: {
      title:       "tell us who you are.",
      description: "the basics. no essay required.",
      cta:         "looks good",
    },
    step4: {
      title:       "add a photo.",
      description: "pick one where we can see your face. not your dog. (unless you're the dog.)",
      cta:         "use this one",
    },
    step5: {
      title:       "what are you here for?",
      description: "pick your modes. you can always change this later.",
      cta:         "let's go",
    },
    step6: {
      title:       "last step — the vibe check.",
      description: "a few questions so we can find the right people for you. no wrong answers.",
      cta:         "start the quiz",
    },
    stepSpotify: {
      title:       "connect your Spotify.",
      description: "we use your top artists and genres to find people you'll actually vibe with. totally optional.",
      cta:         "connect Spotify",
      skip:        "skip for now",
      connected:   "Spotify connected",
      connectedSub:"your music taste is part of your match score now.",
    },
  },

  // ─── Hero copy ───────────────────────────────────────────────────────────────
  hero: {
    eyebrow:  '— BUILT FOR THE ONES WHO SHOW UP',
    h1:       ['Find your people.', 'Not your feed.'],
    lede:     "okay hear us out — it's like Tinder for finals week, hackathon crunch, 6am leg days, and just finding your person at JIIT. no randoms.",
    ctaPrimary:   'Get early access →',
    ctaSecondary: 'Watch the film',
  },

  // ─── Manifesto ───────────────────────────────────────────────────────────────
  manifesto: [
    "we don't do bios.",
    "we don't do vibes.",
    "we don't do randos.",
    "we do people who show up.",
    "— twinn",
  ],

  // ─── Spotify ─────────────────────────────────────────────────────────────────
  spotify: {
    matchLabel:  (pct: number) => `${pct}% music match`,
    sharedArtist: (artist: string) => `you both have ${artist} on repeat`,
    topGenres:   "top genres",
    notConnected: "connect Spotify to see music compatibility",
  },
};
