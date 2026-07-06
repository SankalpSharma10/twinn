import type { Metadata } from 'next';
import { Inter, Fraunces, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { GrainOverlay } from '@/components/ui/GrainOverlay';
import { MagneticCursor } from '@/components/motion/MagneticCursor';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', axes: ['SOFT', 'opsz'] });
const jbMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jb-mono' });

export const metadata: Metadata = {
  title: {
    default: 'Twinn — Find your people. Not your feed.',
    template: '%s | Twinn'
  },
  description: 'JIIT-only matching for study sessions, hackathons, gym days, and finding your person. No randoms.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} ${jbMono.variable} antialiased`} suppressHydrationWarning>
      <body className="bg-ink-950 text-bone-100 overflow-x-hidden">
        <GrainOverlay />
        <MagneticCursor />
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
