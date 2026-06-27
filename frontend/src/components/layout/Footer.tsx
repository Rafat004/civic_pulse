import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full py-lg px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-center bg-surface-dim dark:bg-inverse-surface border-t border-outline-variant mt-auto flex-shrink-0">
      <div className="mb-4 md:mb-0 text-center md:text-left flex flex-col md:flex-row items-center gap-md">
        <div className="flex items-center gap-2 mb-2 md:mb-0">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>policy</span>
          <span className="font-headline-md text-headline-md font-bold text-primary">CivicPulse</span>
        </div>
        <p className="font-body-md text-body-md text-on-surface dark:text-inverse-on-surface text-center md:text-left">
          © 2024 CivicPulse. Digital Infrastructure for Public Good.
        </p>
      </div>
      <div className="flex flex-wrap justify-center items-center gap-sm md:gap-md">
        <Link href="#" className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary dark:hover:text-primary-fixed transition-colors">Privacy Policy</Link>
        <Link href="#" className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary dark:hover:text-primary-fixed transition-colors">Terms of Service</Link>
        <Link href="#" className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary dark:hover:text-primary-fixed transition-colors">API Documentation</Link>
        <Link href="#" className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary dark:hover:text-primary-fixed transition-colors">Contact Support</Link>
      </div>
    </footer>
  );
}
