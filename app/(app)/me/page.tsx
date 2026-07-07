'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { copy } from '@/copy/strings';
import { ArrowLeft, BookOpen, Laptop, Dumbbell, ChevronRight, Bell, Lock, User, LogOut } from 'lucide-react';
import { ease } from '@/lib/motion/tokens';
import { createClient } from '@/lib/supabase/client';
import { useEffect } from 'react';

type Section = 'profile' | 'modes' | 'notifications' | 'privacy' | 'account';

const modeConfig = [
  { id: 'study',     icon: BookOpen,  label: 'Study Mode',     color: '#8FB37A', tagline: copy.modes.study.tagline },
  { id: 'hackathon', icon: Laptop,    label: 'Hackathon Mode', color: '#E8B34A', tagline: copy.modes.hackathon.tagline },
  { id: 'gym',       icon: Dumbbell,  label: 'Gym Mode',       color: '#FF6A2E', tagline: copy.modes.gym.tagline },
];

export default function ProfilePage() {
  const [section, setSection] = useState<Section>('profile');
  const [activeModes, setActiveModes] = useState({ study: false, hackathon: false, gym: false });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio]   = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchProfile() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (mounted && data) {
        setName(data.display_name || '');
        setEmail(data.email || '');
        setBio(data.bio || '');
      }
      
      const { data: modeData } = await supabase
        .from('user_modes')
        .select('mode_id, active')
        .eq('user_id', user.id);
        
      if (mounted && modeData) {
        const nextModes = { study: false, hackathon: false, gym: false };
        modeData.forEach(m => {
          if (m.mode_id in nextModes) {
            nextModes[m.mode_id as keyof typeof nextModes] = m.active;
          }
        });
        setActiveModes(nextModes);
        setLoading(false);
      }
    }
    fetchProfile();
    return () => { mounted = false; };
  }, []);

  const toggleMode = async (id: string) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const newVal = !activeModes[id as keyof typeof activeModes];
    setActiveModes((prev) => ({ ...prev, [id]: newVal }));
    
    await supabase.from('user_modes').update({ active: newVal }).eq('user_id', user.id).eq('mode_id', id);
  };
  
  const handleSave = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('profiles').update({ display_name: name, bio }).eq('id', user.id);
    alert('Profile saved!');
  };

  const navItems: { id: Section; icon: typeof User; label: string }[] = [
    { id: 'profile',       icon: User,  label: 'Profile' },
    { id: 'modes',         icon: Laptop, label: 'Modes' },
    { id: 'notifications', icon: Bell,  label: 'Notifications' },
    { id: 'privacy',       icon: Lock,  label: 'Privacy' },
    { id: 'account',       icon: LogOut, label: 'Account' },
  ];

  return (
    <main className="min-h-screen bg-ink-950 flex flex-col" aria-label="Profile and settings">
      {/* Header */}
      <div className="glass sticky top-0 z-40 px-6 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Link href="/discover/study" className="text-bone-400 hover:text-bone-100 transition-colors" style={{ transitionDuration: '240ms' }} aria-label="Back to discover">
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          </Link>
          <h1 className="text-h2 font-display text-bone-100">You</h1>
          <div className="w-5" aria-hidden="true" />
        </div>
      </div>

      <div className="flex-1 max-w-lg mx-auto w-full px-6 py-6 space-y-6">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-semibold relative"
            style={{ background: 'rgba(255,106,46,0.15)', border: '2px solid rgba(255,106,46,0.3)', color: 'var(--ember-400)' }}
          >
            A
            <button
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-xs"
              style={{ background: 'var(--ember-500)', color: 'var(--ink-900)' }}
              aria-label="Edit photo"
            >
              ✎
            </button>
          </div>
          <div className="text-center">
            {loading ? (
              <div className="h-10"></div>
            ) : (
              <>
                <p className="text-h2 font-display text-bone-100">{name}</p>
                <p className="text-body-sm text-bone-500">{email}</p>
              </>
            )}
          </div>
        </div>

        {/* Section nav */}
        <nav aria-label="Settings sections">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setSection(item.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all"
                  style={{
                    background: section === item.id ? 'var(--ink-700)' : 'transparent',
                    border: `1px solid ${section === item.id ? 'var(--border-default)' : 'transparent'}`,
                    transition: 'all 240ms cubic-bezier(0.16,1,0.3,1)',
                  }}
                  aria-current={section === item.id ? 'page' : undefined}
                  aria-label={`Go to ${item.label} settings`}
                >
                  <Icon className="w-4 h-4 text-bone-400 shrink-0" aria-hidden="true" />
                  <span className="text-body text-bone-200 flex-1">{item.label}</span>
                  <ChevronRight className="w-4 h-4 text-bone-600" aria-hidden="true" />
                </button>
              );
            })}
          </div>
        </nav>

        {/* Section content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={section}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.24, ease: ease.out }}
          >
            {section === 'profile' && (
              <div className="space-y-4">
                <p className="caption text-ember-500 tracking-widest">EDIT PROFILE</p>
                <div>
                  <label htmlFor="name-input" className="text-body-sm text-bone-400 block mb-1">display name</label>
                  <input
                    id="name-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg text-bone-100 text-body focus:outline-none"
                    style={{ background: 'var(--ink-700)', border: '1px solid var(--border-default)' }}
                    aria-label="Display name"
                  />
                </div>
                <div>
                  <label htmlFor="bio-input" className="text-body-sm text-bone-400 block mb-1">bio <span className="text-bone-600">(optional)</span></label>
                  <textarea
                    id="bio-input"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder={copy.empty.profile}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg text-bone-100 placeholder:text-bone-500 text-body focus:outline-none resize-none"
                    style={{ background: 'var(--ink-700)', border: '1px solid var(--border-default)' }}
                    aria-label="Bio"
                  />
                </div>
                <button onClick={handleSave} className="btn-primary w-full" aria-label="Save profile">save changes</button>
              </div>
            )}

            {section === 'modes' && (
              <div className="space-y-4">
                <p className="caption text-ember-500 tracking-widest mb-4">YOUR MODES</p>
                {modeConfig.map((m) => {
                  const Icon = m.icon;
                  const isOn = activeModes[m.id as keyof typeof activeModes];
                  return (
                    <div
                      key={m.id}
                      className="flex items-start gap-4 p-4 rounded-xl"
                      style={{
                        background: isOn ? `${m.color}08` : 'var(--ink-700)',
                        border: `1px solid ${isOn ? m.color + '40' : 'var(--border-default)'}`,
                        transition: 'all 240ms cubic-bezier(0.16,1,0.3,1)',
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: `${m.color}20`, border: `1px solid ${m.color}40` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: m.color }} aria-hidden="true" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-body font-medium text-bone-100">{m.label}</p>
                        <p className="text-body-sm text-bone-500 truncate">{m.tagline}</p>
                      </div>
                      {/* Toggle */}
                      <button
                        role="switch"
                        aria-checked={isOn}
                        aria-label={`Toggle ${m.label} ${isOn ? 'off' : 'on'}`}
                        onClick={() => toggleMode(m.id)}
                        className="relative shrink-0 w-11 h-6 rounded-full transition-all"
                        style={{
                          background: isOn ? m.color : 'var(--ink-500)',
                          transition: 'background 240ms',
                        }}
                      >
                        <motion.span
                          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
                          animate={{ left: isOn ? '24px' : '4px' }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {(section === 'notifications' || section === 'privacy') && (
              <div className="text-center py-12">
                <p className="text-body text-bone-400">settings coming soon.</p>
              </div>
            )}

            {section === 'account' && (
              <div className="space-y-4">
                <p className="caption text-ember-500 tracking-widest">ACCOUNT</p>
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left"
                  style={{ background: 'var(--ink-700)', border: '1px solid var(--border-default)' }}
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4 text-bone-400" aria-hidden="true" />
                  <span className="text-body text-bone-300">sign out</span>
                </button>
                <button
                  className="w-full text-body-sm text-center py-3 transition-colors"
                  style={{ color: 'var(--error)', opacity: 0.7, transition: 'opacity 240ms' }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = '1')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = '0.7')}
                  aria-label="Delete your account"
                >
                  delete account
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
