'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, BookOpen, CheckSquare, Users, Video, Award, Settings, Bell, Shield, Library, TrendingUp, Timer, Trophy } from 'lucide-react';
import toast from 'react-hot-toast';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { motion } from 'framer-motion';

import { useAuthStore } from '@/stores/auth-store';

import { NotificationBell } from './NotificationBell';

const studentNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Study Timer', href: '/timer', icon: Timer },
  { name: 'Analytics', href: '/analytics', icon: TrendingUp },
  { name: 'Resources', href: '/resources', icon: Library },
  { name: 'Quizzes', href: '/quizzes', icon: BookOpen },
  { name: 'Challenges', href: '/challenges', icon: Trophy },
  { name: 'Groups', href: '/groups', icon: Users },
  { name: 'Meetings', href: '/meetings', icon: Video },
  { name: 'Leaderboard', href: '/leaderboard', icon: Award },
];

const adminNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Admin Panel', href: '/admin', icon: Shield },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();
  const navigation = user?.role === 'admin' ? adminNavigation : studentNavigation;

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-10">
      <div className="flex-1 flex flex-col min-h-0 bg-[var(--color-bg-secondary)]/80 backdrop-blur-xl border-r border-[var(--color-border-subtle)] shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between px-6 h-20 border-b border-[var(--color-border-subtle)]/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-primary-base)] to-[var(--color-primary-dark)] flex items-center justify-center shadow-glow-primary">
              <span className="text-white font-bold font-display text-lg">E</span>
            </div>
            <span className="text-xl font-bold font-display text-[var(--color-text-primary)]">Edu Hub</span>
          </div>
          <div className="ml-auto flex items-center -mr-2">
            <NotificationBell align="left" />
          </div>
        </div>
        <div className="flex-1 flex flex-col pt-4 pb-4 overflow-y-auto">
          <nav className="flex-1 px-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-3 mt-1 text-sm font-medium rounded-xl transition-all duration-300 relative ${
                    isActive
                      ? 'text-[var(--color-text-primary)] shadow-sm'
                      : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)] hover:translate-x-1'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary-light)] to-transparent rounded-xl border-l-2 border-[var(--color-primary-base)]"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <item.icon
                    className={`flex-shrink-0 -ml-1 mr-3 h-5 w-5 transition-colors relative z-10 ${
                      isActive ? 'text-[var(--color-primary-base)]' : 'text-[var(--color-text-tertiary)] group-hover:text-[var(--color-primary-base)]'
                    }`}
                    aria-hidden="true"
                  />
                  <span className="truncate relative z-10 font-semibold">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t border-[var(--color-border-subtle)] p-4 bg-gradient-to-b from-transparent to-[var(--color-bg-tertiary)]/50">
          <div className="flex items-center w-full group">
            <Link href="/settings" className="flex items-center flex-1 min-w-0 p-2 -m-2 rounded-xl hover:bg-[var(--color-bg-secondary)] hover:shadow-sm transition-all border border-transparent hover:border-[var(--color-border-subtle)]">
              <div className="relative">
                <img
                  width={40}
                  height={40}
                  className="inline-block h-10 w-10 rounded-full bg-[var(--color-bg-tertiary)] ring-2 ring-[var(--color-bg-primary)] shadow-sm group-hover:ring-[var(--color-primary-light)] transition-all object-cover"
                  src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'Student'}`}
                  alt="Profile"
                  suppressHydrationWarning
                />
                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-[#121826]" />
              </div>
              <div className="ml-3 truncate">
                <p className="text-sm font-bold text-[var(--color-text-primary)]" suppressHydrationWarning>{user?.name || 'Student'}</p>
                <p className="text-xs font-medium text-[var(--color-text-tertiary)] group-hover:text-[var(--color-primary-base)] transition-colors" suppressHydrationWarning>{user?.email || 'View profile'}</p>
              </div>
            </Link>
            <div className="ml-auto flex items-center gap-1 pl-2">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
