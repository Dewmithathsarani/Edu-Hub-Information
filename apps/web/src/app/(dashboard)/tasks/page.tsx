'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare, Plus, Trash2, Check, Sparkles, BrainCircuit, Calendar, Flame } from 'lucide-react';
import { useTasks, usePrioritizeTasks, useCreateTask, useUpdateTask, useDeleteTask } from '@/hooks/queries/useTasks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function TasksPage() {
  const [aiMode, setAiMode] = useState(false);
  const { data: standardTasks, isLoading: isStandardLoading, error } = useTasks();
  const { data: aiTasks, isLoading: isAILoading } = usePrioritizeTasks();
  
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');

  const tasks = aiMode ? aiTasks : standardTasks;
  const isLoading = aiMode ? isAILoading : isStandardLoading;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !subject) return toast.error('Title and subject are required');
    
    try {
      await createTask.mutateAsync({
        title,
        subject,
        priority: 'medium',
        dueDate: new Date(Date.now() + 86400000).toISOString() // tomorrow
      });
      setTitle('');
      setSubject('');
      toast.success('Task created successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleToggle = async (id: string, currentStatus: string) => {
    try {
      await updateTask.mutateAsync({
        id,
        status: currentStatus === 'completed' ? 'pending' : 'completed'
      });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTask.mutateAsync(id);
      toast.success('Task deleted');
    } catch (err: any) {
      toast.error('Failed to delete task');
    }
  };

  return (
    <div className="animate-fade-in space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black font-display text-[var(--color-text-primary)] tracking-tight">My Tasks</h1>
          <p className="text-[var(--color-text-secondary)] mt-2 font-medium">Manage your study tasks and get AI-powered prioritization.</p>
        </div>
        
        <div className="p-1 bg-[var(--color-bg-secondary)]/80 backdrop-blur-md rounded-xl border border-[var(--color-border-subtle)] flex">
          <button
            onClick={() => setAiMode(false)}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center ${
              !aiMode 
                ? 'bg-white dark:bg-slate-800 text-[var(--color-text-primary)] shadow-sm' 
                : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Standard
          </button>
          <button
            onClick={() => setAiMode(true)}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center ${
              aiMode 
                ? 'bg-gradient-to-r from-[var(--color-primary-base)] to-[var(--color-accent-teal)] text-white shadow-glow-primary' 
                : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            <BrainCircuit className="w-4 h-4 mr-2" />
            AI Priority
            {aiMode && <Sparkles className="w-3 h-3 ml-1 animate-pulse" />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Create Task */}
        <div className="lg:col-span-1">
          <Card className="premium-card sticky top-6 border-[var(--color-border-subtle)]">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl font-bold font-display text-[var(--color-text-primary)]">
                <div className="p-2 bg-[var(--color-primary-base)]/10 rounded-lg text-[var(--color-primary-light)]">
                  <Plus className="w-5 h-5" />
                </div>
                Quick Add
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[var(--color-text-secondary)]">Task Description</label>
                  <Input 
                    placeholder="E.g., Complete Past Paper 2021" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)}
                    className="h-12 bg-[var(--color-bg-tertiary)]/50 border-transparent focus:border-[var(--color-primary-base)] transition-colors rounded-xl font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[var(--color-text-secondary)]">Subject / Topic</label>
                  <Input 
                    placeholder="E.g., Physics" 
                    value={subject} 
                    onChange={e => setSubject(e.target.value)}
                    className="h-12 bg-[var(--color-bg-tertiary)]/50 border-transparent focus:border-[var(--color-primary-base)] transition-colors rounded-xl font-medium"
                  />
                </div>
                <Button type="submit" disabled={createTask.isPending} className="w-full h-12 font-bold rounded-xl shadow-glow-primary bg-[var(--color-primary-base)] hover:bg-[var(--color-primary-dark)] transition-colors">
                  {createTask.isPending ? 'Adding...' : 'Add Task'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Task List */}
        <div className="lg:col-span-2 space-y-4">
          {aiMode && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[var(--color-primary-base)]/10 to-[var(--color-accent-teal)]/10 border border-[var(--color-primary-base)]/20 flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-[var(--color-primary-base)] to-[var(--color-accent-teal)] rounded-xl shadow-glow-primary text-white">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-[var(--color-text-primary)]">AI Dynamic Prioritization Active</h3>
                <p className="text-sm text-[var(--color-text-secondary)] font-medium">Tasks are intelligently sorted based on your exam dates, difficulty, and past performance.</p>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-20 text-[var(--color-text-tertiary)] font-bold animate-pulse">Analyzing tasks...</div>
          ) : error ? (
            <div className="text-center py-20 text-red-500 font-bold bg-red-500/10 rounded-2xl border border-red-500/20">Failed to load tasks.</div>
          ) : tasks?.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-[var(--color-border-medium)] rounded-3xl text-[var(--color-text-tertiary)] font-bold bg-[var(--color-bg-secondary)]/30">
              No tasks found. Add a new task to get started!
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {tasks?.map((task: any, index: number) => (
                  <motion.div 
                    key={task._id || task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className={`group flex items-center justify-between gap-4 p-5 rounded-2xl transition-all duration-300 border ${
                      task.status === 'completed' 
                        ? 'bg-[var(--color-bg-secondary)]/30 border-[var(--color-border-subtle)] opacity-60' 
                        : 'bg-[var(--color-bg-secondary)] border-[var(--color-border-subtle)] hover:border-[var(--color-primary-base)]/50 hover:shadow-glow-primary'
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1 w-full">
                      <button 
                        onClick={() => handleToggle(task._id || task.id, task.status)}
                        className={`w-8 h-8 shrink-0 rounded-xl flex items-center justify-center border-2 transition-all duration-300 shadow-sm
                          ${task.status === 'completed' 
                            ? 'bg-gradient-to-br from-[var(--color-primary-base)] to-[var(--color-accent-teal)] border-transparent text-white scale-95' 
                            : 'border-[var(--color-border-medium)] bg-[var(--color-bg-primary)] group-hover:border-[var(--color-primary-base)]'
                          }
                        `}
                      >
                        {task.status === 'completed' && <Check className="w-5 h-5" />}
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        <p className={`font-bold text-lg truncate transition-colors ${
                          task.status === 'completed' ? 'line-through text-[var(--color-text-tertiary)]' : 'text-[var(--color-text-primary)]'
                        }`}>
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <Badge variant="outline" className="text-xs py-0.5 px-2 bg-[var(--color-bg-tertiary)] border-transparent text-[var(--color-text-secondary)] font-bold">{task.subject}</Badge>
                          
                          {aiMode && task.priorityScore && (
                            <Badge className="bg-gradient-to-r from-orange-500/20 to-red-500/20 text-red-500 border-red-500/30 text-xs py-0.5 px-2 flex items-center font-bold">
                              <Flame className="w-3 h-3 mr-1" />
                              AI Score: {Math.round(task.priorityScore)}
                            </Badge>
                          )}
                          {!aiMode && (
                            <Badge variant="default" className="text-xs py-0.5 px-2 uppercase font-bold tracking-wider bg-[var(--color-primary-base)]/10 text-[var(--color-primary-base)]">{task.priority}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(task._id || task.id)} 
                      className="text-[var(--color-text-tertiary)] hover:text-red-500 hover:bg-red-500/10 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
