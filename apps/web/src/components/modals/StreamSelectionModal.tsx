'use client';

import { useState } from 'react';
import { BookOpen, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/stores/auth-store';

const STREAMS = [
  { id: 'ict', name: 'ICT', icon: '💻' },
  { id: 'bst', name: 'BST', icon: '🔬' },
  { id: 'sft', name: 'SFT', icon: '⚙️' },
  { id: 'et', name: 'ET', icon: '🛠️' },
  { id: 'science', name: 'Science', icon: '🧬' },
  { id: 'maths', name: 'Maths', icon: '📐' },
  { id: 'commerce', name: 'Commerce', icon: '📊' },
  { id: 'arts', name: 'Arts', icon: '🎨' },
];

export function StreamSelectionModal() {
  const [selectedStream, setSelectedStream] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateUser } = useAuthStore();

  const handleSubmit = async () => {
    if (!selectedStream) return;
    setIsSubmitting(true);
    try {
      await apiClient.put('/users/stream', { stream: selectedStream });
      toast.success('Stream selected successfully!');
      updateUser({ stream: selectedStream });
    } catch (error) {
      toast.error('Failed to select stream. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in p-4">
      <Card className="w-full max-w-2xl premium-card border border-[var(--color-border-subtle)] shadow-2xl shadow-black/50 relative animate-scale-up overflow-hidden">
        {/* Modal decorative gradient */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-[var(--color-primary-base)] blur-[100px] opacity-30 rounded-full"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-[var(--color-accent-purple)] blur-[100px] opacity-20 rounded-full"></div>
        
        <CardContent className="p-8 relative z-10">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="p-4 bg-[var(--color-primary-base)]/20 text-[var(--color-primary-base)] rounded-2xl mb-4 border border-[var(--color-primary-base)]/20 shadow-glow-primary">
              <BookOpen className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-black font-display text-[var(--color-text-primary)] mb-2">Select Your Stream</h2>
            <p className="text-[var(--color-text-secondary)] font-medium max-w-md mx-auto">
              Please choose your A/L stream. We'll automatically add you to the main study group for your stream so you can collaborate with peers.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {STREAMS.map((stream) => {
              const isSelected = selectedStream === stream.name;
              return (
                <button
                  key={stream.id}
                  onClick={() => setSelectedStream(stream.name)}
                  className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
                    isSelected 
                      ? 'border-[var(--color-primary-base)] bg-[var(--color-primary-base)]/10 shadow-glow-primary scale-105' 
                      : 'border-[var(--color-border-medium)] bg-[var(--color-bg-tertiary)] hover:border-[var(--color-primary-light)]/50 hover:bg-[var(--color-bg-secondary)]'
                  }`}
                >
                  <span className="text-3xl mb-2">{stream.icon}</span>
                  <span className={`font-bold ${isSelected ? 'text-[var(--color-primary-base)]' : 'text-[var(--color-text-primary)]'}`}>
                    {stream.name}
                  </span>
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 bg-[var(--color-primary-base)] text-white rounded-full p-0.5 shadow-sm">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex justify-center border-t border-[var(--color-border-subtle)] pt-6">
            <Button 
              className="w-full md:w-auto min-w-[200px] h-14 text-lg font-bold rounded-xl shadow-glow-primary bg-gradient-to-r from-[var(--color-primary-base)] to-[var(--color-accent-teal)] disabled:opacity-50 transition-all hover:scale-105"
              onClick={handleSubmit}
              disabled={!selectedStream || isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Continue to Dashboard'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
