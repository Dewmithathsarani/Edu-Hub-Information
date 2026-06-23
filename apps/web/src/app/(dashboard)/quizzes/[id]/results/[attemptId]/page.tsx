'use client';

import { useMyAttempts, useQuiz } from '@/hooks/queries/useQuizzes';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ChevronLeft, Clock, Target, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function QuizResultsPage({ params }: { params: { id: string, attemptId: string } }) {
  const { data: quiz, isLoading: isQuizLoading } = useQuiz(params.id);
  const { data: attempts, isLoading: isAttemptsLoading } = useMyAttempts();

  if (isQuizLoading || isAttemptsLoading) {
    return <div className="text-center py-20 text-[var(--color-text-tertiary)]">Loading results...</div>;
  }

  const attempt = attempts?.find((a: any) => a._id === params.attemptId);

  if (!attempt) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <AlertCircle className="w-16 h-16 text-[var(--color-status-error)] mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Attempt Not Found</h2>
        <p className="text-[var(--color-text-secondary)] mb-6">We couldn't find the results for this attempt.</p>
        <Link href="/quizzes">
          <Button variant="outline">Back to Quizzes</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <Link href="/quizzes" className="inline-flex items-center text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-primary-base)] transition-colors mb-4">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Quizzes
        </Link>
        <h1 className="text-3xl font-bold font-display text-[var(--color-text-primary)]">Results: {quiz?.title}</h1>
        <p className="text-[var(--color-text-secondary)] mt-2">Completed on {new Date(attempt.completedAt).toLocaleDateString()}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/50">
          <CardContent className="p-6 text-center">
            <Target className="w-8 h-8 text-[var(--color-primary-light)] mx-auto mb-2" />
            <p className="text-sm text-[var(--color-text-secondary)] mb-1">Score</p>
            <p className="text-3xl font-bold text-[var(--color-text-primary)]">{Math.round(attempt.score)}%</p>
          </CardContent>
        </Card>
        
        <Card className="border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/50">
          <CardContent className="p-6 text-center">
            <CheckCircle2 className="w-8 h-8 text-[var(--color-status-success)] mx-auto mb-2" />
            <p className="text-sm text-[var(--color-text-secondary)] mb-1">Correct Answers</p>
            <p className="text-3xl font-bold text-[var(--color-text-primary)]">{attempt.totalCorrect} / {attempt.totalQuestions}</p>
          </CardContent>
        </Card>

        <Card className="border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/50">
          <CardContent className="p-6 text-center">
            <Clock className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <p className="text-sm text-[var(--color-text-secondary)] mb-1">Time Taken</p>
            <p className="text-3xl font-bold text-[var(--color-text-primary)]">
              {Math.floor(attempt.timeTaken / 60)}m {attempt.timeTaken % 60}s
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-6">Attempt Details</h3>
          <div className="space-y-4">
            <div className="flex justify-between py-2 border-b border-[var(--color-border-subtle)]">
              <span className="text-[var(--color-text-secondary)]">Total Wrong</span>
              <span className="font-bold text-[var(--color-text-primary)]">{attempt.totalWrong}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[var(--color-border-subtle)]">
              <span className="text-[var(--color-text-secondary)]">Total Skipped</span>
              <span className="font-bold text-[var(--color-text-primary)]">{attempt.totalSkipped}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
