'use client';

import { useState, useEffect } from 'react';
import { Clock, Flag, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { useSubmitQuiz, useQuiz } from '@/hooks/queries/useQuizzes';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function QuizAttemptPage({ params }: { params: { id: string } }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(120 * 60); // 120 mins
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { data: quiz, isLoading } = useQuiz(params.id);
  const { mutateAsync: submitQuiz } = useSubmitQuiz(params.id);

  useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => {
      setTimeLeft(t => t > 0 ? t - 1 : 0);
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (qId: string, optLabel: string) => {
    if (isSubmitted) return;
    setAnswers(prev => ({ ...prev, [qId]: optLabel }));
  };

  const toggleFlag = (qId: string) => {
    setFlags(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleSubmit = async () => {
    if (confirm('Are you sure you want to submit your attempt?')) {
      try {
        const formattedAnswers = Object.entries(answers).map(([qId, optLabel]) => ({
          questionId: qId,
          selected: optLabel
        }));
        const response = await submitQuiz({ answers: formattedAnswers, timeTaken: 120 * 60 - timeLeft });
        setIsSubmitted(true);
        toast.success('Quiz submitted successfully!');
        if (response?.data?.attemptId) {
          router.push(`/quizzes/${params.id}/results/${response.data.attemptId}`);
        }
      } catch (err: any) {
        toast.error('Failed to submit quiz');
      }
    }
  };

  if (isLoading || !quiz) {
    return <div className="animate-fade-in max-w-3xl mx-auto text-center py-20 text-[var(--color-text-tertiary)]">Loading quiz...</div>;
  }

  const questions = quiz.questions || [];
  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (isSubmitted) {
    return (
      <div className="animate-fade-in max-w-3xl mx-auto text-center space-y-6 py-12">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[var(--color-primary-base)] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[var(--color-text-tertiary)]">Redirecting to results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      {/* Quiz Header */}
      <div className="sticky top-16 md:top-0 z-30 bg-[var(--color-bg-primary)]/80 backdrop-blur-md pb-4 pt-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 border-b border-[var(--color-border-subtle)]">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold font-display text-[var(--color-text-primary)] truncate pr-4">{quiz.title}</h1>
          <div className="flex items-center gap-2 bg-[var(--color-bg-tertiary)] px-4 py-2 rounded-lg font-mono font-medium text-lg min-w-fit shadow-inner">
            <Clock className={`w-5 h-5 ${timeLeft < 300 ? 'text-[var(--color-status-error)] animate-pulse' : 'text-[var(--color-primary-light)]'}`} />
            <span className={timeLeft < 300 ? 'text-[var(--color-status-error)]' : 'text-[var(--color-text-primary)]'}>{formatTime(timeLeft)}</span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-[var(--color-bg-tertiary)] h-2 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[var(--color-primary-base)] transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-[var(--color-text-tertiary)] mt-2">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>{Object.keys(answers).length} Answered</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 mt-8">
        {/* Question Area */}
        <div className="flex-1 space-y-6">
          <Card className="border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/50 min-h-[400px]">
            <CardContent className="p-6 md:p-10">
              <div className="flex justify-between items-start mb-6">
                <span className="text-sm font-bold text-[var(--color-primary-light)] uppercase tracking-wider">
                  Question {currentQuestion + 1}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => toggleFlag(question._id)}
                  className={flags[question._id] ? 'text-orange-500 bg-orange-500/10 hover:text-orange-400' : 'text-[var(--color-text-tertiary)]'}
                >
                  <Flag className="w-4 h-4 mr-2" />
                  {flags[question._id] ? 'Flagged' : 'Flag for review'}
                </Button>
              </div>

              <h2 className="text-xl md:text-2xl font-medium text-[var(--color-text-primary)] leading-relaxed mb-10">
                {question.questionText || question.text}
              </h2>

              <div className="space-y-3">
                {question.options?.map((opt: any) => {
                  const isSelected = answers[question._id] === opt.label;
                  return (
                    <button
                      key={opt.label}
                      onClick={() => handleSelectOption(question._id, opt.label)}
                      className={`w-full flex items-center p-4 rounded-xl border-2 transition-all text-left ${
                        isSelected 
                          ? 'border-[var(--color-primary-base)] bg-[var(--color-primary-base)]/10 text-[var(--color-text-primary)]' 
                          : 'border-[var(--color-border-subtle)] hover:border-[var(--color-border-medium)] hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]'
                      }`}
                    >
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 mr-4 flex-shrink-0 transition-colors ${
                        isSelected ? 'border-[var(--color-primary-base)] bg-[var(--color-primary-base)] text-white' : 'border-[var(--color-border-medium)]'
                      }`}>
                        {opt.label}
                      </div>
                      <span className="text-lg">{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2" /> Previous
            </Button>
            
            {currentQuestion === questions.length - 1 ? (
              <Button onClick={handleSubmit} className="bg-[var(--color-status-success)] hover:bg-[var(--color-status-success)]/90 text-white">
                Submit Quiz <CheckCircle2 className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}>
                Next <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>

        {/* Question Navigator (Sidebar) */}
        <div className="w-full lg:w-72 flex-shrink-0">
          <Card className="border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/50 sticky top-40">
            <CardContent className="p-6">
              <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-4">Question Navigator</h3>
              
              <div className="grid grid-cols-5 gap-2">
                {questions.map((q: any, idx: number) => {
                  const isCurrent = currentQuestion === idx;
                  const isAnswered = answers[q._id] !== undefined;
                  const isFlagged = flags[q._id];

                  let btnClass = 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] border-transparent hover:border-[var(--color-border-medium)]';
                  
                  if (isCurrent) {
                    btnClass = 'bg-[var(--color-primary-base)] text-white border-[var(--color-primary-base)] shadow-glow-primary';
                  } else if (isAnswered) {
                    btnClass = 'bg-[var(--color-primary-base)]/20 text-[var(--color-primary-light)] border-[var(--color-primary-base)]/30';
                  }

                  return (
                    <button
                      key={q._id}
                      onClick={() => setCurrentQuestion(idx)}
                      className={`relative w-full aspect-square flex items-center justify-center rounded-md border-2 font-medium text-sm transition-all ${btnClass}`}
                    >
                      {idx + 1}
                      {isFlagged && (
                        <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-orange-500 rounded-full border-2 border-[var(--color-bg-secondary)]"></span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 pt-6 border-t border-[var(--color-border-subtle)] space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-[var(--color-primary-base)]/20 border-2 border-[var(--color-primary-base)]/30 rounded" />
                  <span className="text-[var(--color-text-secondary)]">Answered</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-[var(--color-bg-tertiary)] rounded" />
                  <span className="text-[var(--color-text-secondary)]">Unanswered</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-orange-500 rounded-full" />
                  <span className="text-[var(--color-text-secondary)]">Flagged</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
