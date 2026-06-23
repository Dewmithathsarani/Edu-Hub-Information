'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Calendar, Plus, Trash2, GraduationCap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDeleteTask } from '@/hooks/queries/useTasks';
import toast from 'react-hot-toast';

interface ExamCountdownWidgetProps {
  exams: any[];
}

const CountdownTimer = ({ targetDate }: { targetDate: string }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex items-center gap-4 text-center mt-4">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="flex flex-col items-center">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 flex items-center justify-center shadow-inner">
            <span className="text-2xl md:text-4xl font-black font-display text-white tracking-widest tabular-nums">
              {value.toString().padStart(2, '0')}
            </span>
          </div>
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-white/70 mt-2">
            {unit}
          </span>
        </div>
      ))}
    </div>
  );
};

export function ExamCountdownWidget({ exams }: ExamCountdownWidgetProps) {
  const deleteTask = useDeleteTask();

  const handleDelete = async (id: string) => {
    try {
      await deleteTask.mutateAsync(id);
      toast.success('Exam deadline removed');
    } catch (error) {
      toast.error('Failed to remove exam deadline');
    }
  };

  if (!exams || exams.length === 0) return null;

  return (
    <div className="space-y-6 mb-10">
      <AnimatePresence>
        {exams.map((exam, index) => (
          <motion.div
            key={exam._id || exam.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1A1A2E] via-[#16213E] to-[#0F3460] border border-[#0F3460] shadow-glow-primary p-1">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <GraduationCap className="w-48 h-48" />
              </div>
              <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute top-10 right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative z-10 bg-[#1A1A2E]/60 backdrop-blur-xl rounded-[1.4rem] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8 border border-white/5">
                
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-black uppercase tracking-widest rounded-full flex items-center">
                      <Timer className="w-3.5 h-3.5 mr-1.5" />
                      Upcoming Exam
                    </span>
                    <span className="px-3 py-1 bg-white/5 border border-white/10 text-white/70 text-xs font-bold rounded-full flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1.5" />
                      {new Date(exam.dueDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-black font-display text-white mt-3 leading-tight">
                    {exam.title}
                  </h2>
                  <p className="text-blue-200/60 font-medium mt-1">
                    {exam.subject}
                  </p>
                </div>

                <div className="shrink-0 flex flex-col items-center">
                  <CountdownTimer targetDate={exam.dueDate} />
                </div>

                <div className="absolute top-4 right-4">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(exam._id || exam.id)} 
                    className="text-white/30 hover:text-red-400 hover:bg-red-500/20 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
