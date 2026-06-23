'use client';

import { Trophy, Medal, Flame } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { useLeaderboard } from '@/hooks/queries/useLeaderboard';
import { motion, Variants } from 'framer-motion';

const podiumVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
};

const listContainerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.3 }
  }
};

const listItemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 }
};

export default function LeaderboardPage() {
  const { data: leaderboard, isLoading } = useLeaderboard();

  return (
    <div className="animate-fade-in max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-4 bg-orange-500/10 rounded-full mb-2">
          <Trophy className="w-12 h-12 text-orange-500" />
        </div>
        <h1 className="text-4xl font-bold font-display text-[var(--color-text-primary)]">Global Leaderboard</h1>
        <p className="text-[var(--color-text-secondary)]">Compete with other students and climb the ranks by completing tasks and quizzes.</p>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-[var(--color-text-tertiary)]">Loading leaderboard...</div>
      ) : !leaderboard || leaderboard.length === 0 ? (
        <div className="text-center py-20 text-[var(--color-text-tertiary)]">No students on the leaderboard yet!</div>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-6 mb-12 mt-8 items-end">
            {/* Rank 2 */}
            {leaderboard[1] && (
              <motion.div variants={podiumVariants} initial="hidden" animate="show" transition={{ delay: 0.1 }} className="order-2 md:order-1 h-full">
                <Card className="h-full premium-card relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-b from-slate-400/20 to-transparent dark:from-slate-400/10 opacity-50"></div>
                  <div className="absolute top-0 w-full h-1.5 bg-gradient-to-r from-slate-300 to-slate-400 shadow-[0_0_10px_rgba(148,163,184,0.5)]"></div>
                  <CardContent className="p-6 flex flex-col items-center text-center pt-8 relative z-10">
                    <div className="absolute top-4 left-4 p-2 bg-slate-100 dark:bg-slate-800 rounded-xl shadow-sm">
                      <Medal className="w-6 h-6 text-slate-400 drop-shadow-md" />
                    </div>
                    <div className="relative mb-4 group-hover:scale-105 transition-transform duration-300">
                      <Image width={80} height={80} src={leaderboard[1].user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${leaderboard[1].user?.name}`} className="w-20 h-20 rounded-full border-4 border-slate-300 bg-slate-100 shadow-md" alt="Rank 2" />
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                        #2
                      </div>
                    </div>
                    <h3 className="font-bold text-[var(--color-text-primary)] text-lg">{leaderboard[1].user?.name || 'Unknown'}</h3>
                    <p className="text-[var(--color-text-secondary)] font-bold mt-1 flex items-center bg-slate-100 dark:bg-slate-800/50 px-3 py-1 rounded-full text-sm">
                      <Flame className="w-4 h-4 mr-1.5 text-slate-400" /> {leaderboard[1].xp.toLocaleString()} XP
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Rank 1 */}
            {leaderboard[0] && (
              <motion.div variants={podiumVariants} initial="hidden" animate="show" transition={{ delay: 0 }} className="order-1 md:order-2 h-full z-20">
                <Card className="h-full animated-gradient-border bg-[var(--color-bg-secondary)] relative overflow-hidden transform md:-translate-y-6 shadow-glow-accent group hover:-translate-y-8 transition-all duration-300">
                  <div className="absolute inset-0 bg-[var(--color-primary-light)] opacity-20"></div>
                  <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 shadow-[0_0_15px_rgba(250,204,21,0.6)]"></div>
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-400/20 blur-3xl rounded-full"></div>
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[var(--color-primary-base)]/20 blur-3xl rounded-full"></div>
                  
                  <CardContent className="p-8 flex flex-col items-center text-center relative z-10">
                    <div className="absolute top-4 left-4 p-2.5 bg-yellow-400/10 rounded-xl">
                      <Trophy className="w-8 h-8 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                    </div>
                    <div className="relative mb-5 group-hover:scale-110 transition-transform duration-300">
                      <div className="absolute inset-0 bg-yellow-400 blur-md rounded-full opacity-30 animate-pulse"></div>
                      <Image width={96} height={96} src={leaderboard[0].user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${leaderboard[0].user?.name}`} className="relative w-24 h-24 rounded-full border-4 border-yellow-400 bg-yellow-50 shadow-xl" alt="Rank 1" />
                      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs font-black px-4 py-1 rounded-full shadow-[0_4px_10px_rgba(245,158,11,0.4)]">
                        #1
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold font-display text-[var(--color-text-primary)] mt-2">{leaderboard[0].user?.name || 'Unknown'}</h3>
                    <p className="text-[var(--color-text-primary)] font-black mt-3 flex items-center text-lg bg-[var(--color-bg-primary)] px-4 py-1.5 rounded-full shadow-sm border border-[var(--color-border-subtle)]">
                      <Flame className="w-5 h-5 mr-1.5 text-orange-500" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">{leaderboard[0].xp.toLocaleString()} XP</span>
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Rank 3 */}
            {leaderboard[2] && (
              <motion.div variants={podiumVariants} initial="hidden" animate="show" transition={{ delay: 0.2 }} className="order-3 h-full">
                <Card className="h-full premium-card relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-b from-amber-600/10 to-transparent opacity-50"></div>
                  <div className="absolute top-0 w-full h-1.5 bg-gradient-to-r from-amber-500 to-amber-700 shadow-[0_0_10px_rgba(217,119,6,0.5)]"></div>
                  <CardContent className="p-6 flex flex-col items-center text-center pt-8 relative z-10">
                    <div className="absolute top-4 left-4 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-xl shadow-sm">
                      <Medal className="w-6 h-6 text-amber-600 drop-shadow-md" />
                    </div>
                    <div className="relative mb-4 group-hover:scale-105 transition-transform duration-300">
                      <Image width={80} height={80} src={leaderboard[2].user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${leaderboard[2].user?.name}`} className="w-20 h-20 rounded-full border-4 border-amber-600 bg-amber-50 shadow-md" alt="Rank 3" />
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                        #3
                      </div>
                    </div>
                    <h3 className="font-bold text-[var(--color-text-primary)] text-lg">{leaderboard[2].user?.name || 'Unknown'}</h3>
                    <p className="text-[var(--color-text-secondary)] font-bold mt-1 flex items-center bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full text-sm">
                      <Flame className="w-4 h-4 mr-1.5 text-amber-600" /> {leaderboard[2].xp.toLocaleString()} XP
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {leaderboard.length > 3 && (
            <motion.div variants={listContainerVariants} initial="hidden" animate="show" className="bg-[var(--color-bg-secondary)]/30 rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
              {leaderboard.slice(3).map((userEntry) => (
                <motion.div key={userEntry.rank} variants={listItemVariants} className="flex items-center justify-between p-4 border-b border-[var(--color-border-subtle)] last:border-0 hover:bg-[var(--color-bg-tertiary)] transition-colors hover:pl-6 duration-300">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-bg-tertiary)] font-bold text-[var(--color-text-tertiary)] text-sm">
                      {userEntry.rank}
                    </div>
                    <Image width={40} height={40} src={userEntry.user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${userEntry.user?.name}`} className="w-10 h-10 rounded-full bg-slate-100 ring-2 ring-[var(--color-border-subtle)]" alt={userEntry.user?.name || 'Unknown'} />
                    <span className="font-medium text-[var(--color-text-primary)]">{userEntry.user?.name || 'Unknown'}</span>
                  </div>
                  <div className="font-bold text-[var(--color-text-primary)] flex items-center px-3 py-1 bg-[var(--color-bg-primary)] rounded-full border border-[var(--color-border-subtle)] shadow-sm">
                    {userEntry.xp.toLocaleString()} <span className="text-[var(--color-text-tertiary)] ml-1 font-medium text-sm">XP</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
