import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: 'var(--ink-950)',
          900: 'var(--ink-900)',
          800: 'var(--ink-800)',
          700: 'var(--ink-700)',
          600: 'var(--ink-600)',
          500: 'var(--ink-500)',
        },
        bone: {
          50:  'var(--bone-50)',
          100: 'var(--bone-100)',
          200: 'var(--bone-200)',
          300: 'var(--bone-300)',
          400: 'var(--bone-400)',
          500: 'var(--bone-500)',
        },
        ember: {
          50:  'var(--ember-50)',
          200: 'var(--ember-200)',
          400: 'var(--ember-400)',
          500: 'var(--ember-500)',
          600: 'var(--ember-600)',
          700: 'var(--ember-700)',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body:    ['Inter', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'display-xl': ['88px', { lineHeight: '84px', letterSpacing: '-0.045em' }],
        'display-lg': ['64px', { lineHeight: '62px', letterSpacing: '-0.04em' }],
        'display-md': ['44px', { lineHeight: '46px', letterSpacing: '-0.035em' }],
        'h1':         ['32px', { lineHeight: '36px', letterSpacing: '-0.03em' }],
        'h2':         ['24px', { lineHeight: '30px', letterSpacing: '-0.025em' }],
        'h3':         ['18px', { lineHeight: '26px', letterSpacing: '-0.02em' }],
        'body-lg':    ['18px', { lineHeight: '30px', letterSpacing: '-0.01em' }],
        'body':       ['15px', { lineHeight: '24px', letterSpacing: '-0.005em' }],
        'body-sm':    ['13px', { lineHeight: '20px', letterSpacing: '0' }],
        'caption':    ['11px', { lineHeight: '16px', letterSpacing: '0.16em' }],
        'mono':       ['13px', { lineHeight: '20px', letterSpacing: '0' }],
      },
      borderRadius: {
        'sm':   'var(--r-sm)',
        'md':   'var(--r-md)',
        'lg':   'var(--r-lg)',
        'xl':   'var(--r-xl)',
        '2xl':  'var(--r-2xl)',
        'full': 'var(--r-full)',
      },
      boxShadow: {
        'card':   'var(--shadow-card)',
        'ember':  'var(--shadow-ember)',
        'lifted': 'var(--shadow-lifted)',
      },
      animation: {
        'grain':     'grain 12s steps(10) infinite',
        'scroll-y':  'scroll-y 2s ease-in-out infinite',
        'shimmer':   'shimmer 2s linear infinite',
        'pulse-dot': 'pulse-dot 1.4s ease-in-out infinite',
        'progress':  'progress 1.5s ease-in-out infinite',
      },
      keyframes: {
        grain: {
          '0%, 100%': { transform: 'translate(0,0)' },
          '10%': { transform: 'translate(-2%,-2%)' },
          '20%': { transform: 'translate(2%,2%)' },
          '30%': { transform: 'translate(-1%,1%)' },
          '40%': { transform: 'translate(1%,-1%)' },
          '50%': { transform: 'translate(-2%,2%)' },
          '60%': { transform: 'translate(2%,-2%)' },
          '70%': { transform: 'translate(-1%,-1%)' },
          '80%': { transform: 'translate(1%,1%)' },
          '90%': { transform: 'translate(-2%,0%)' },
        },
        'scroll-y': {
          '0%, 100%': { opacity: '0', transform: 'translateY(0)' },
          '50%': { opacity: '1', transform: 'translateY(24px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-dot': {
          '0%, 80%, 100%': { transform: 'scale(0)', opacity: '0' },
          '40%': { transform: 'scale(1)', opacity: '1' },
        },
        progress: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(400%)' },
        },
      },
      transitionDuration: {
        'instant': '150ms',
        'quick':   '240ms',
        'base':    '400ms',
        'slow':    '700ms',
      },
    },
  },
  plugins: [],
};

export default config;
