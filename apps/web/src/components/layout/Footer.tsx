import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[var(--color-bg-secondary)] border-t border-[var(--color-border-subtle)] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-primary-base)] to-[var(--color-primary-dark)] flex items-center justify-center shadow-glow-primary">
                <span className="text-white font-bold font-display text-lg">E</span>
              </div>
              <span className="text-xl font-bold font-display text-[var(--color-text-primary)]">Edu Hub</span>
            </Link>
            <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
              The #1 Study Platform for Sri Lankan A/L Students. AI-powered learning, interactive quizzes, and premium study resources.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-[var(--color-text-primary)] mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-[var(--color-text-secondary)]">
              <li><Link href="/#features" className="hover:text-[var(--color-primary-base)] transition-colors">Features</Link></li>
              <li><Link href="/#pricing" className="hover:text-[var(--color-primary-base)] transition-colors">Pricing</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-[var(--color-text-primary)] mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-[var(--color-text-secondary)]">
              <li><Link href="/about" className="hover:text-[var(--color-primary-base)] transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-[var(--color-primary-base)] transition-colors">Careers</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-[var(--color-primary-base)] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-[var(--color-primary-base)] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[var(--color-text-primary)] mb-4">Connect</h4>
            <ul className="space-y-3 text-sm text-[var(--color-text-secondary)]">
              <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-primary-base)] transition-colors">Twitter</a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-primary-base)] transition-colors">LinkedIn</a></li>
              <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-primary-base)] transition-colors">Facebook</a></li>
              <li><a href="mailto:support@eduhub.lk" className="hover:text-[var(--color-primary-base)] transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-[var(--color-border-subtle)] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[var(--color-text-tertiary)]">
            &copy; {new Date().getFullYear()} Edu Hub. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-[var(--color-text-tertiary)]">
            <span>Made with ❤️ in Sri Lanka</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
