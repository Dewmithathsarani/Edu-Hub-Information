'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Settings, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTasks, useUpdateTask } from '@/hooks/queries/useTasks';
import { useLogSession } from '@/hooks/queries/useAnalytics';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

export default function TimerPage() {
  const { data: tasks } = useTasks();
  const { mutateAsync: updateTask } = useUpdateTask();
  const { mutateAsync: logSession } = useLogSession();
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'pomodoro' | 'shortBreak' | 'longBreak'>('pomodoro');
  const [completedSessions, setCompletedSessions] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('eduHub_timerState');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Only load if it's less than 24 hours old to avoid stale state
        if (parsed.timestamp && Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
          // eslint-disable-next-line
          setTimeLeft(parsed.timeLeft);
          setMode(parsed.mode);
          setCompletedSessions(parsed.completedSessions);
          // Always pause on reload so it doesn't run infinitely in background
          setIsActive(false); 
        }
      } catch (e) {
        console.error('Failed to parse timer state');
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('eduHub_timerState', JSON.stringify({
        timeLeft,
        mode,
        completedSessions,
        timestamp: Date.now()
      }));
    }
  }, [timeLeft, mode, completedSessions, isLoaded]);

  const handleModeSwitch = (newMode: 'pomodoro' | 'shortBreak' | 'longBreak') => {
    setIsActive(false);
    setMode(newMode);
    setTimeLeft(newMode === 'pomodoro' ? 25 * 60 : newMode === 'shortBreak' ? 5 * 60 : 15 * 60);
    setSessionStartTime(null);
  };

  const playAlarm = () => {
    try {
      const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
      audio.volume = 0.5;
      audio.play();
    } catch (e) {
      console.error('Audio playback failed');
    }
  };

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#3b82f6', '#10b981', '#f59e0b']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#3b82f6', '#10b981', '#f59e0b']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setTimeout(() => {
        setIsActive(false);
        playAlarm();
        
        if (mode === 'pomodoro') {
          triggerConfetti();
          setCompletedSessions((s) => s + 1);
          
          if (sessionStartTime) {
            const pendingTasks = tasks?.filter((t: any) => t.status !== 'completed') || [];
            const subject = pendingTasks[0]?.subject || 'General';
            logSession({
              subject,
              duration: 25,
              startedAt: sessionStartTime,
              endedAt: new Date().toISOString()
            }).catch(console.error);
            setSessionStartTime(null);
          }

          handleModeSwitch('shortBreak');
          toast.success('Pomodoro completed! Take a short break.', { icon: '🎉' });
        } else {
          handleModeSwitch('pomodoro');
          toast.success('Break over! Time to focus.', { icon: '🧠' });
        }
      }, 0);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, sessionStartTime, tasks, logSession]);

  const toggleTimer = () => {
    if (!isActive && mode === 'pomodoro' && !sessionStartTime) {
      setSessionStartTime(new Date().toISOString());
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'pomodoro' ? 25 * 60 : mode === 'shortBreak' ? 5 * 60 : 15 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = 100 - (timeLeft / (mode === 'pomodoro' ? 25 * 60 : mode === 'shortBreak' ? 5 * 60 : 15 * 60)) * 100;

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        toast.error(`Error attempting to enable fullscreen mode: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black font-display text-[var(--color-text-primary)] tracking-tight">Study Timer</h1>
          <p className="text-[var(--color-text-secondary)] mt-2 font-medium">Focus deeply and boost your productivity.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={toggleFullscreen} variant="outline" className="h-12 px-4 rounded-xl border-[var(--color-border-medium)] hover:bg-[var(--color-bg-tertiary)] hover:border-[var(--color-primary-base)]/50 transition-all font-bold">
            Focus Mode
          </Button>
          <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-[var(--color-border-medium)] hover:bg-[var(--color-bg-tertiary)] hover:border-[var(--color-primary-base)]/50 transition-all">
            <Settings className="w-5 h-5 text-[var(--color-text-primary)]" />
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <Card className="md:col-span-2 premium-card border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/80 relative overflow-hidden">
          {/* Background Glow */}
          <div className={`absolute inset-0 blur-[120px] opacity-20 transition-colors duration-1000 ${mode === 'pomodoro' ? 'bg-[var(--color-primary-base)]' : mode === 'shortBreak' ? 'bg-[var(--color-accent-base)]' : 'bg-blue-500'}`}></div>
          
          <CardContent className="p-10 flex flex-col items-center justify-center min-h-[500px] relative z-10">
            <div className="flex gap-2 mb-14 bg-[var(--color-bg-tertiary)]/80 backdrop-blur-md p-1.5 rounded-xl border border-[var(--color-border-subtle)]">
              <button 
                onClick={() => handleModeSwitch('pomodoro')}
                className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${mode === 'pomodoro' ? 'bg-gradient-to-r from-[var(--color-primary-base)] to-[var(--color-accent-teal)] text-white shadow-glow-primary' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'}`}
              >
                Pomodoro
              </button>
              <button 
                onClick={() => handleModeSwitch('shortBreak')}
                className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${mode === 'shortBreak' ? 'bg-gradient-to-r from-[var(--color-accent-base)] to-amber-500 text-white shadow-glow-primary' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'}`}
              >
                Short Break
              </button>
              <button 
                onClick={() => handleModeSwitch('longBreak')}
                className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${mode === 'longBreak' ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-glow-primary' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'}`}
              >
                Long Break
              </button>
            </div>

            <div className="relative w-80 h-80 mb-14 flex items-center justify-center group">
              {/* Outer Glow Ring */}
              <div className={`absolute inset-0 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500 ${mode === 'pomodoro' ? 'bg-[var(--color-primary-base)]' : mode === 'shortBreak' ? 'bg-[var(--color-accent-base)]' : 'bg-blue-500'}`}></div>
              
              {/* Circular Progress Ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-2xl">
                <circle 
                  className="text-[var(--color-bg-tertiary)] stroke-current" 
                  strokeWidth="12" 
                  cx="160" 
                  cy="160" 
                  r="140" 
                  fill="transparent" 
                />
                <circle 
                  className={`stroke-current transition-all duration-1000 ease-linear drop-shadow-md ${mode === 'pomodoro' ? 'text-[var(--color-primary-base)]' : mode === 'shortBreak' ? 'text-[var(--color-accent-base)]' : 'text-blue-500'}`}
                  strokeWidth="12" 
                  strokeLinecap="round" 
                  cx="160" 
                  cy="160" 
                  r="140" 
                  fill="transparent" 
                  strokeDasharray={`${2 * Math.PI * 140}`}
                  strokeDashoffset={`${2 * Math.PI * 140 * (1 - progress / 100)}`}
                />
              </svg>
              <div className="text-7xl font-black font-display text-[var(--color-text-primary)] relative z-10 tabular-nums tracking-tighter drop-shadow-lg">
                {formatTime(timeLeft)}
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                onClick={toggleTimer} 
                size="lg" 
                className={`w-40 h-16 text-xl font-bold rounded-2xl shadow-glow-primary hover:scale-[1.02] transition-all ${
                  mode === 'pomodoro' ? 'bg-gradient-to-r from-[var(--color-primary-base)] to-[var(--color-accent-teal)]' : 
                  mode === 'shortBreak' ? 'bg-gradient-to-r from-[var(--color-accent-base)] to-amber-500' : 
                  'bg-gradient-to-r from-blue-500 to-indigo-500'
                }`}
              >
                {isActive ? <Pause className="w-6 h-6 mr-2" /> : <Play className="w-6 h-6 mr-2" />}
                {isActive ? 'Pause' : 'Start'}
              </Button>
              <Button onClick={resetTimer} variant="outline" size="icon" className="w-16 h-16 rounded-2xl border-[var(--color-border-medium)] bg-[var(--color-bg-tertiary)]/50 hover:bg-[var(--color-bg-tertiary)] hover:border-[var(--color-primary-base)]/50 transition-all">
                <RotateCcw className="w-6 h-6 text-[var(--color-text-primary)]" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="premium-card border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold font-display flex items-center">
                <div className="w-2 h-6 bg-[var(--color-primary-base)] rounded-full mr-3"></div>
                Today's Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4 mt-2">
                <span className="text-[var(--color-text-secondary)] font-bold text-sm">Sessions Completed</span>
                <span className="text-2xl font-black font-display text-[var(--color-primary-base)]">{completedSessions}</span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i} 
                    className={`h-3 flex-1 rounded-full transition-colors duration-500 ${i <= completedSessions % 4 || completedSessions >= 4 && completedSessions % 4 === 0 && i === 4 ? 'bg-gradient-to-r from-[var(--color-primary-base)] to-[var(--color-accent-teal)] shadow-glow-primary' : 'bg-[var(--color-bg-tertiary)] border border-[var(--color-border-medium)]'}`} 
                  />
                ))}
              </div>
              <p className="text-sm font-medium text-[var(--color-text-tertiary)] mt-4 text-center">
                4 sessions until a long break
              </p>
            </CardContent>
          </Card>

          <Card className="premium-card border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold font-display flex items-center">
                <div className="w-2 h-6 bg-[var(--color-accent-teal)] rounded-full mr-3"></div>
                Current Task
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const pendingTasks = tasks?.filter((t: any) => t.status !== 'completed') || [];
                const currentTask = pendingTasks[0];

                if (!currentTask) {
                  return (
                    <div className="mt-4 p-8 text-center text-[var(--color-text-tertiary)] font-bold border-2 border-dashed border-[var(--color-border-medium)] rounded-2xl bg-[var(--color-bg-tertiary)]/30">
                      No pending tasks!
                    </div>
                  );
                }

                return (
                  <div className="mt-4 p-4 rounded-xl border border-[var(--color-border-medium)] bg-[var(--color-bg-tertiary)]/80 hover:border-[var(--color-primary-base)]/50 transition-colors group">
                    <div className="flex items-start gap-4">
                      <button 
                        className="mt-1 flex-shrink-0 text-[var(--color-text-tertiary)] group-hover:text-[var(--color-primary-base)] transition-colors bg-[var(--color-bg-primary)] rounded-full"
                        onClick={async () => {
                          await updateTask({ id: currentTask.id || (currentTask as any)._id, status: 'completed' });
                          toast.success('Task marked as completed!');
                        }}
                      >
                        <CheckCircle2 className="w-6 h-6" />
                      </button>
                      <div>
                        <p className="text-base font-bold text-[var(--color-text-primary)] leading-tight">{currentTask.title}</p>
                        <p className="text-sm font-medium text-[var(--color-text-secondary)] mt-2">
                          <span className="bg-[var(--color-bg-primary)] px-2 py-1 rounded-md text-[var(--color-primary-base)]">{currentTask.subject}</span>
                          <span className="ml-2 uppercase tracking-wider text-xs">{currentTask.priority}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
