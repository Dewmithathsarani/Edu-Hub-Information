'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { BottomNav } from '@/components/layout/BottomNav';
import { NotificationBell } from '@/components/layout/NotificationBell';
import { Bell, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageTransition } from '@/components/ui/page-transition';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/stores/auth-store';
import { StreamSelectionModal } from '@/components/modals/StreamSelectionModal';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      {user && user.role === 'student' && !user.stream && <StreamSelectionModal />}
      <Sidebar />
      <div className="md:pl-64 flex flex-col flex-1">
        <header className="md:hidden flex items-center justify-between px-4 h-16 glass-panel border-b border-[var(--color-border-subtle)]/50 sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[var(--color-primary-light)]" />
            <span className="font-bold text-xl tracking-tight text-[var(--color-text-primary)]">Edu Hub</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <NotificationBell />
          </div>
        </header>
        <main className="flex-1 pb-20 md:pb-0">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            <PageTransition>
              {children}
            </PageTransition>
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
