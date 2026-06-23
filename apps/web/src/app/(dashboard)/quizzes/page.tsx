'use client';

import { useState } from 'react';
import { Search, Filter, Clock, BookOpen, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useQuizzes, useMyAttempts } from '@/hooks/queries/useQuizzes';

export default function QuizzesPage() {
  const [activeTab, setActiveTab] = useState<'explore' | 'my-attempts'>('explore');
  const [search, setSearch] = useState('');
  
  const { data: quizzes, isLoading: quizzesLoading } = useQuizzes({ search });
  const { data: attempts, isLoading: attemptsLoading } = useMyAttempts();

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-[var(--color-text-primary)]">Quizzes</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">Test your knowledge with curated past papers and model questions.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex gap-2 p-1 bg-[var(--color-bg-secondary)] rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('explore')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'explore' 
                ? 'bg-[var(--color-primary-base)] text-white shadow-sm' 
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]'
            }`}
          >
            Explore Quizzes
          </button>
          <button
            onClick={() => setActiveTab('my-attempts')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'my-attempts' 
                ? 'bg-[var(--color-primary-base)] text-white shadow-sm' 
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]'
            }`}
          >
            My Attempts
          </button>
        </div>

        {activeTab === 'explore' && (
          <div className="flex gap-2 w-full md:w-auto">
            <Input 
              placeholder="Search quizzes..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-64 h-10"
            />
            <Button variant="outline" className="h-10" onClick={() => toast.success('Filter options opened!')}>
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        )}
      </div>

      {activeTab === 'explore' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzesLoading ? (
            <div className="col-span-full text-center text-[var(--color-text-tertiary)]">Loading quizzes...</div>
          ) : quizzes?.length === 0 ? (
            <div className="col-span-full text-center text-[var(--color-text-tertiary)]">No quizzes found.</div>
          ) : (
            quizzes?.map((quiz: any) => (
              <QuizCard key={quiz._id} quiz={quiz} />
            ))
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {attemptsLoading ? (
            <div className="col-span-full text-center text-[var(--color-text-tertiary)]">Loading attempts...</div>
          ) : attempts?.length === 0 ? (
            <div className="col-span-full text-center text-[var(--color-text-tertiary)]">No past attempts found.</div>
          ) : (
            attempts?.map((attempt: any) => (
              <AttemptCard key={attempt._id} attempt={attempt} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

function QuizCard({ quiz }: { quiz: any }) {
  const isHard = quiz.difficulty === 'hard';
  const difficultyColors = {
    easy: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    medium: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    hard: 'text-red-500 bg-red-500/10 border-red-500/20',
  };
  const diffClass = difficultyColors[(quiz.difficulty as 'easy'|'medium'|'hard')] || difficultyColors.medium;
  
  return (
    <Card className="premium-card flex flex-col h-full border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/80 hover:-translate-y-2 transition-all duration-300 group overflow-hidden relative">
      <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 transition-opacity group-hover:opacity-40 rounded-full ${isHard ? 'bg-red-500' : 'bg-[var(--color-primary-base)]'}`}></div>
      <CardContent className="p-6 flex flex-col flex-1 relative z-10">
        <div className="flex justify-between items-start mb-4">
          <Badge className={`uppercase font-bold tracking-wider px-3 ${diffClass}`}>
            {quiz.difficulty || 'Medium'}
          </Badge>
          <span className="text-xs font-bold text-[var(--color-text-tertiary)] bg-[var(--color-bg-tertiary)] px-2 py-1 rounded-md">{quiz.subject}</span>
        </div>
        
        <h3 className="text-xl font-black font-display text-[var(--color-text-primary)] mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[var(--color-primary-light)] group-hover:to-[var(--color-accent-teal)] transition-all line-clamp-2 leading-tight">
          {quiz.title}
        </h3>
        
        <p className="text-sm text-[var(--color-text-secondary)] mb-6 flex-1 line-clamp-3 font-medium">
          {quiz.description || 'Comprehensive test paper to evaluate your knowledge and exam readiness.'}
        </p>
        
        <div className="flex items-center gap-4 text-sm font-bold text-[var(--color-text-secondary)] mb-6 pt-4 border-t border-[var(--color-border-subtle)]">
          <div className="flex items-center bg-[var(--color-bg-tertiary)]/50 px-3 py-1.5 rounded-lg">
            <BookOpen className="w-4 h-4 mr-2 text-[var(--color-primary-base)]" />
            {quiz.totalQuestions || 0} Qs
          </div>
          <div className="flex items-center bg-[var(--color-bg-tertiary)]/50 px-3 py-1.5 rounded-lg">
            <Clock className="w-4 h-4 mr-2 text-[var(--color-accent-teal)]" />
            {quiz.timeLimit || 120} m
          </div>
        </div>
        
        <Link href={`/quizzes/${quiz._id}`} className="w-full">
          <Button className="w-full justify-between h-12 text-base font-bold bg-gradient-to-r from-[var(--color-primary-base)] to-[var(--color-accent-teal)] hover:scale-[1.02] shadow-glow-primary transition-all">
            Start Quiz
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

function AttemptCard({ attempt }: { attempt: any }) {
  const score = Math.round(attempt.score);
  const pass = score >= 50;
  const isExcellent = score >= 80;
  
  return (
    <Card className="flex flex-col h-full border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/80 hover:border-[var(--color-primary-base)]/50 transition-all duration-300 group overflow-hidden relative">
      {/* Score Ring Background Effect */}
      <div className={`absolute -bottom-10 -right-10 w-40 h-40 blur-3xl opacity-20 rounded-full ${isExcellent ? 'bg-emerald-500' : pass ? 'bg-blue-500' : 'bg-red-500'}`}></div>
      
      <CardContent className="p-6 flex flex-col flex-1 relative z-10">
        <div className="flex justify-between items-start mb-4">
          <Badge className={`uppercase font-bold px-3 ${isExcellent ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : pass ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
            {isExcellent ? 'Excellent' : pass ? 'Passed' : 'Needs Review'}
          </Badge>
          <span className="text-xs font-bold text-[var(--color-text-tertiary)] bg-[var(--color-bg-tertiary)] px-2 py-1 rounded-md">{new Date(attempt.completedAt).toLocaleDateString()}</span>
        </div>
        
        <h3 className="text-xl font-bold font-display text-[var(--color-text-primary)] mb-2 line-clamp-2 leading-tight">
          {attempt.quizId?.title || 'Unknown Quiz'}
        </h3>
        
        <div className="flex justify-between items-center mb-6 mt-auto pt-6 border-t border-[var(--color-border-subtle)]">
          <div>
            <p className="text-sm font-bold text-[var(--color-text-secondary)] mb-1 uppercase tracking-widest">Final Score</p>
            <div className="flex items-baseline gap-1">
              <span className={`text-5xl font-black font-display tracking-tighter ${isExcellent ? 'text-emerald-500' : pass ? 'text-blue-500' : 'text-red-500'}`}>
                {score}
              </span>
              <span className="text-xl font-bold text-[var(--color-text-tertiary)]">%</span>
            </div>
          </div>
        </div>
        
        <Link href={`/quizzes/${attempt.quizId?._id}/results/${attempt._id}`} className="w-full mt-2">
          <Button variant="outline" className="w-full justify-between h-12 text-base font-bold bg-[var(--color-bg-tertiary)]/50 border-[var(--color-border-medium)] hover:bg-[var(--color-bg-tertiary)] hover:border-[var(--color-primary-base)]/50 transition-all">
            View Analytics
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
