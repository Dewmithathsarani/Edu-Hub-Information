'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, CheckSquare, Clock, Flame, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useDashboardStats } from '@/hooks/queries/useAnalytics';
import { useTasks, useUpdateTask } from '@/hooks/queries/useTasks';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuthStore } from '@/stores/auth-store';
import { motion, Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: tasks, isLoading: tasksLoading } = useTasks();
  const { user } = useAuthStore();
  
  const updateTask = useUpdateTask();

  const handleToggle = async (id: string, currentStatus: string) => {
    try {
      await updateTask.mutateAsync({
        id,
        status: currentStatus === 'completed' ? 'pending' : 'completed'
      });
    } catch (err) {
      console.error(err);
    }
  };

  const dueToday = tasks?.filter(t => new Date(t.dueDate).toDateString() === new Date().toDateString() && t.status !== 'completed') || [];
  const upcomingTasks = tasks?.filter(t => t.status !== 'completed').slice(0, 3) || [];

  const getRank = (score: number) => {
    if (score >= 90) return { name: 'Gold Master', color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/30' };
    if (score >= 75) return { name: 'Silver Achiever', color: 'text-gray-300', bg: 'bg-gray-300/10 border-gray-300/30' };
    if (score >= 50) return { name: 'Bronze Scholar', color: 'text-amber-600', bg: 'bg-amber-600/10 border-amber-600/30' };
    return { name: 'Novice Learner', color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/30' };
  };

  const rank = getRank(stats?.averageScore || 0);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="relative overflow-hidden rounded-3xl premium-card bg-mesh-gradient border-0 p-8 shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold font-display text-[var(--color-text-primary)] tracking-tight">
                Welcome back, <span className="text-gradient-primary" suppressHydrationWarning>{user?.name || 'Student'}</span>! 👋
              </h1>
              {!statsLoading && (
                <div className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${rank.bg} ${rank.color}`}>
                  {rank.name}
                </div>
              )}
            </div>
            <p className="text-[var(--color-text-secondary)] text-lg">Here is what's happening with your studies today. Let's make it count.</p>
          </div>
          <Badge variant="success" className="px-4 py-2 text-sm shadow-glow-accent bg-white/50 dark:bg-black/20 backdrop-blur-md border-[var(--color-status-warning)]/30">
            <Flame className="w-5 h-5 mr-1.5 text-orange-500" />
            <span className="font-bold text-[var(--color-text-primary)]">14 Day Streak!</span>
          </Badge>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-[var(--color-primary-base)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-32 -mb-4 w-24 h-24 bg-purple-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>
      </div>

      <motion.div 
        variants={containerVariants} 
        initial="hidden" 
        animate="show" 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div variants={itemVariants} className="h-full">
          <StatCard title="Tasks Due Today" value={statsLoading ? '...' : dueToday.length} icon={<CheckSquare className="w-5 h-5 text-[var(--color-primary-light)]" />} trend="Stay focused!" trendUp={true} />
        </motion.div>
        <motion.div variants={itemVariants} className="h-full">
          <StatCard title="Average Score" value={statsLoading ? '...' : `${stats?.averageScore || 0}%`} icon={<Clock className="w-5 h-5 text-[var(--color-accent-light)]" />} trend="Top 20% in class" trendUp={true} />
        </motion.div>
        <motion.div variants={itemVariants} className="h-full">
          <StatCard title="Quizzes Completed" value={statsLoading ? '...' : stats?.quizzesTaken || 0} icon={<BookOpen className="w-5 h-5 text-emerald-400" />} trend="Great progress" trendUp={true} />
        </motion.div>
        <motion.div variants={itemVariants} className="h-full">
          <StatCard title="Strongest Subject" value={statsLoading ? '...' : stats?.strongestSubject?.name || 'N/A'} icon={<Flame className="w-5 h-5 text-orange-400" />} trend={`Score: ${stats?.strongestSubject?.score || 0}%`} trendUp={true} />
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/50">
          <CardHeader>
            <CardTitle>Subject Performance</CardTitle>
          </CardHeader>
          <CardContent className="h-64 w-full border-t border-[var(--color-border-subtle)]/50 pt-4">
            {statsLoading ? (
              <div className="w-full h-full flex items-center justify-center text-[var(--color-text-tertiary)]">Loading chart...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart data={stats?.subjectPerformance || []}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="subject" tick={{ fill: 'var(--color-text-tertiary)' }} />
                  <YAxis tick={{ fill: 'var(--color-text-tertiary)' }} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border-medium)' }}
                    itemStyle={{ color: 'var(--color-text-primary)' }}
                    cursor={{ fill: 'var(--color-bg-tertiary)', opacity: 0.4 }}
                  />
                  <Bar dataKey="score" fill="var(--color-primary-base)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/50">
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {tasksLoading ? (
              <div className="text-center text-[var(--color-text-tertiary)] py-4">Loading tasks...</div>
            ) : upcomingTasks.length === 0 ? (
              <div className="text-center text-[var(--color-text-tertiary)] py-4">No upcoming tasks!</div>
            ) : (
              <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-4">
                {upcomingTasks.map((task: any, index: number) => (
                  <motion.div key={task._id || task.id || index} variants={itemVariants}>
                    <TaskItem 
                      task={task} 
                      onToggle={() => handleToggle(task._id || task.id, task.status)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, trendUp }: any) {
  return (
    <Card className="premium-card h-full border-0 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-0"></div>
      <CardContent className="p-6 relative z-10">
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <p className="text-sm font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider">{title}</p>
            <p className="text-4xl font-bold font-display text-[var(--color-text-primary)] tracking-tight">{value}</p>
          </div>
          <div className="p-3 bg-[var(--color-bg-tertiary)] rounded-2xl shadow-sm group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 relative">
            <div className="absolute inset-0 bg-[var(--color-primary-light)] blur-md opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity"></div>
            <div className="relative z-10">{icon}</div>
          </div>
        </div>
        <div className="mt-5 flex items-center gap-2">
          <div className={`px-2 py-1 rounded-md text-xs font-bold ${trendUp ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400' : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]'}`}>
            {trendUp ? '↑' : '→'} {trend}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TaskItem({ task, onToggle }: { task: any, onToggle: () => void }) {
  const completed = task.status === 'completed';
  const priorityColors: Record<string, string> = {
    urgent: 'bg-red-500/10 text-red-500 border-red-500/20',
    high: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    medium: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    low: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  };

  return (
    <div 
      className={`flex items-center gap-4 p-3 rounded-xl hover:bg-[var(--color-bg-tertiary)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group ${completed ? 'opacity-50 hover:scale-100' : ''}`}
      onClick={onToggle}
    >
      <div className={`w-5 h-5 rounded border-2 transition-colors flex items-center justify-center shrink-0
        ${completed ? 'bg-[var(--color-primary-base)] border-[var(--color-primary-base)] text-white' : 'border-[var(--color-border-medium)] group-hover:border-[var(--color-primary-base)]'}
      `}>
        {completed && <Check className="w-3 h-3" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium text-[var(--color-text-primary)] truncate transition-all ${completed ? 'line-through text-[var(--color-text-tertiary)]' : ''}`}>
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-[var(--color-text-tertiary)]">{task.subject}</span>
        </div>
      </div>
      <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${priorityColors[task.priority]}`}>
        {task.priority}
      </div>
    </div>
  );
}
