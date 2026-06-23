'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, TrendingUp, AlertCircle, BookOpen } from 'lucide-react';
import { useDashboardStats } from '@/hooks/queries/useAnalytics';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function AnalyticsPage() {
  const { data: analytics, isLoading } = useDashboardStats();

  if (isLoading) return <div className="p-8 text-center animate-pulse">Loading analytics data...</div>;

  const chartData = analytics?.subjectPerformance?.map((sub: any) => ({
    subject: sub.subject,
    score: sub.score,
    fullMark: 100,
  })) || [];

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display text-[var(--color-text-primary)]">Performance Analytics</h1>
        <p className="text-[var(--color-text-secondary)] mt-1">Track your progress and identify areas for improvement.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/50">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-[var(--color-primary-base)]/10 rounded-lg">
                <Target className="w-5 h-5 text-[var(--color-primary-light)]" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-[var(--color-text-secondary)]">Average Score</h3>
            <p className="text-3xl font-bold text-[var(--color-text-primary)] mt-1">{analytics?.averageScore || 0}%</p>
          </CardContent>
        </Card>
        
        <Card className="border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/50">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <BookOpen className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-[var(--color-text-secondary)]">Quizzes Taken</h3>
            <p className="text-3xl font-bold text-[var(--color-text-primary)] mt-1">{analytics?.quizzesTaken || 0}</p>
          </CardContent>
        </Card>

        <Card className="border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/50">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-[var(--color-text-secondary)]">Strongest Subject</h3>
            <p className="text-xl font-bold text-[var(--color-text-primary)] mt-1">{analytics?.strongestSubject?.name || 'N/A'}</p>
            <p className="text-xs text-emerald-400 mt-2">{analytics?.strongestSubject?.score || 0}% Average</p>
          </CardContent>
        </Card>

        <Card className="border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/50">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <AlertCircle className="w-5 h-5 text-orange-400" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-[var(--color-text-secondary)]">Needs Focus</h3>
            <p className="text-xl font-bold text-[var(--color-text-primary)] mt-1">{analytics?.weakestSubject?.name || 'N/A'}</p>
            <p className="text-xs text-orange-400 mt-2">{analytics?.weakestSubject?.score || 0}% Average</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/50">
          <CardHeader>
            <CardTitle>Subject Performance</CardTitle>
          </CardHeader>
          <CardContent className="h-72 border-t border-[var(--color-border-subtle)]/50 pt-4">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                  <PolarGrid stroke="var(--color-border-subtle)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'var(--color-text-tertiary)' }} />
                  <Radar name="Score" dataKey="score" stroke="var(--color-primary-base)" fill="var(--color-primary-base)" fillOpacity={0.5} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--color-bg-secondary)', borderColor: 'var(--color-border-subtle)' }} />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-[var(--color-text-tertiary)]">No data yet</div>
            )}
          </CardContent>
        </Card>

        <Card className="border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/50">
          <CardHeader>
            <CardTitle>Scores Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-72 border-t border-[var(--color-border-subtle)]/50 pt-4">
             {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" vertical={false} />
                  <XAxis dataKey="subject" stroke="var(--color-text-tertiary)" tick={{ fill: 'var(--color-text-secondary)' }} />
                  <YAxis domain={[0, 100]} stroke="var(--color-text-tertiary)" tick={{ fill: 'var(--color-text-secondary)' }} />
                  <Tooltip cursor={{ fill: 'var(--color-bg-tertiary)' }} contentStyle={{ backgroundColor: 'var(--color-bg-secondary)', borderColor: 'var(--color-border-subtle)', color: 'var(--color-text-primary)' }} />
                  <Bar dataKey="score" fill="var(--color-primary-light)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
             ) : (
               <div className="h-full flex items-center justify-center text-[var(--color-text-tertiary)]">No data yet</div>
             )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/50">
        <CardHeader>
          <CardTitle>Topic Mastery Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {analytics?.subjectPerformance?.map((sub: any) => (
              <TopicProgress key={sub.subject} topic={sub.subject} value={sub.score} isWeak={sub.score < 65} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TopicProgress({ topic, value, isWeak = false }: { topic: string, value: number, isWeak?: boolean }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-[var(--color-text-primary)]">{topic}</span>
        <span className={`text-sm font-bold ${isWeak ? 'text-orange-400' : 'text-emerald-400'}`}>{value}%</span>
      </div>
      <div className="w-full bg-[var(--color-bg-tertiary)] h-2 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${isWeak ? 'bg-orange-400' : 'bg-emerald-400'}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
