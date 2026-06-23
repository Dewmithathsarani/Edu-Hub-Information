'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Clock, Target, Star } from 'lucide-react';
import { useActiveChallenges } from '@/hooks/queries/useChallenges';
import Link from 'next/link';

export default function ChallengesPage() {
  const { data: challenges, isLoading } = useActiveChallenges();

  if (isLoading) return <div className="p-8 text-center animate-pulse">Loading challenges...</div>;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-display text-[var(--color-text-primary)]">Challenges</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">Compete with others and earn rewards</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges?.map((challenge: any) => (
          <Card key={challenge._id} className="border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/50 hover:bg-[var(--color-bg-secondary)] transition-colors group">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="p-2 bg-[var(--color-primary-base)]/10 rounded-lg">
                  <Trophy className="w-5 h-5 text-[var(--color-primary-light)]" />
                </div>
                <span className="text-xs font-medium px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-full">
                  {challenge.difficulty || 'Medium'}
                </span>
              </div>
              <CardTitle className="mt-4 text-xl">{challenge.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--color-text-secondary)] mb-6">
                {challenge.description}
              </p>
              
              <div className="flex flex-col space-y-3 mb-6">
                <div className="flex items-center text-sm text-[var(--color-text-tertiary)]">
                  <Target className="w-4 h-4 mr-2" />
                  <span>{challenge.type}</span>
                </div>
                <div className="flex items-center text-sm text-[var(--color-text-tertiary)]">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Ends {new Date(challenge.endDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-sm text-[var(--color-text-tertiary)]">
                  <Star className="w-4 h-4 mr-2 text-yellow-500" />
                  <span>{challenge.rewardPoints} Points</span>
                </div>
              </div>

              <Link 
                href={`/challenges/${challenge._id}`}
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-[var(--color-primary-base)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors text-sm font-medium"
              >
                Join Challenge
              </Link>
            </CardContent>
          </Card>
        ))}

        {(!challenges || challenges.length === 0) && (
          <div className="col-span-full py-12 text-center text-[var(--color-text-tertiary)] bg-[var(--color-bg-secondary)]/30 rounded-xl border border-[var(--color-border-subtle)] border-dashed">
            <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No active challenges at the moment.</p>
            <p className="text-sm mt-1">Check back later for new events!</p>
          </div>
        )}
      </div>
    </div>
  );
}
