import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';

export function TopNav() {
  return (
    <nav className="fixed top-0 w-full z-50 glass-panel border-b border-[var(--color-border-subtle)]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-primary-base)] to-[var(--color-primary-dark)] flex items-center justify-center">
                <span className="text-white font-bold font-display text-lg">E</span>
              </div>
              <span className="text-xl font-bold font-display text-[var(--color-text-primary)]">Edu Hub</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/#features" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">Features</Link>
            <Link href="/#pricing" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">Pricing</Link>
            <Link href="/about" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">About</Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link 
              href="/login" 
              className={buttonVariants({ variant: "ghost", className: "hidden sm:inline-flex" })}
            >
              Log in
            </Link>
            <Link 
              href="/register" 
              className={buttonVariants({ variant: "primary" })}
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
