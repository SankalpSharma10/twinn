import Link from 'next/link';

const columns = [
  {
    heading: 'Product',
    links: [
      { label: 'How it works', href: '#how-it-works' },
      { label: 'Study mode',     href: '/discover/study' },
      { label: 'Hackathon mode', href: '/discover/hackathon' },
      { label: 'Gym mode',       href: '/discover/gym' },
      { label: 'Twinn mode',     href: '/discover/twinn' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'Manifesto', href: '/manifesto' },
      { label: 'Blog',      href: '#' },
      { label: 'Careers',   href: '#' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy',         href: '#' },
      { label: 'Terms',           href: '#' },
      { label: 'Campus policies', href: '#' },
    ],
  },
  {
    heading: 'Follow',
    links: [
      { label: 'Twitter / X', href: '#' },
      { label: 'Instagram',   href: '#' },
      { label: 'TikTok',      href: '#' },
    ],
  },
];

export function Footer() {
  return (
    <footer
      className="border-t border-hairline px-6 md:px-12 pt-16 pb-10"
      role="contentinfo"
      aria-label="Footer"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          {columns.map((col) => (
            <div key={col.heading}>
              <p className="caption text-ember-500 mb-5 tracking-widest">{col.heading}</p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-body-sm text-bone-500 hover:text-bone-300 transition-colors duration-quick"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-hairline pt-8">
          <div className="flex items-center gap-2">
            <span className="font-display text-lg text-bone-400">twinn</span>
            <span
              className="w-1.5 h-1.5 rounded-full bg-ember-500"
              aria-hidden="true"
              title="ember"
            />
          </div>
          <p className="text-body-sm text-bone-500 text-center">
            © {new Date().getFullYear()} Twinn. campus-only. always.
          </p>
          <p className="text-body-sm text-bone-500">
            built with{' '}
            <span className="text-ember-500" aria-label="ember">♥</span>
            {' '}for students who show up
          </p>
        </div>
      </div>
    </footer>
  );
}
