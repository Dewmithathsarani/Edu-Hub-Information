'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, Check, Trash2 } from 'lucide-react';
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from '@/hooks/queries/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';

export function NotificationBell({ align = 'right' }: { align?: 'left' | 'right' }) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: notifications } = useNotifications();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications?.filter((n: any) => !n.isRead).length || 0;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const alignmentClass = align === 'left' ? 'left-0 origin-top-left' : 'right-0 origin-top-right';

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors p-1" 
        aria-label="Notifications"
      >
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[var(--color-status-error)] ring-2 ring-[var(--color-bg-secondary)]"></span>
        )}
        <Bell className="h-5 w-5" aria-hidden="true" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute mt-2 w-80 bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-xl shadow-xl overflow-hidden z-50 ${alignmentClass}`}
          >
            <div className="p-4 border-b border-[var(--color-border-subtle)] flex justify-between items-center bg-[var(--color-bg-tertiary)]/50">
              <h3 className="font-semibold text-[var(--color-text-primary)]">Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={() => markAllAsRead.mutate()}
                  className="text-xs text-[var(--color-primary-base)] hover:text-[var(--color-primary-light)] transition-colors font-medium"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {!notifications || notifications.length === 0 ? (
                <div className="p-8 text-center text-[var(--color-text-tertiary)]">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                  <p className="text-sm">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-[var(--color-border-subtle)]/50">
                  {notifications.map((notification: any) => (
                    <div 
                      key={notification._id} 
                      className={`p-4 hover:bg-[var(--color-bg-tertiary)] transition-colors cursor-pointer ${!notification.isRead ? 'bg-[var(--color-primary-base)]/5' : ''}`}
                      onClick={() => {
                        if (!notification.isRead) {
                          markAsRead.mutate(notification._id);
                        }
                      }}
                    >
                      <div className="flex gap-3">
                        <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!notification.isRead ? 'bg-[var(--color-primary-base)]' : 'bg-transparent'}`} />
                        <div>
                          <p className="text-sm text-[var(--color-text-primary)]">{notification.message}</p>
                          <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
