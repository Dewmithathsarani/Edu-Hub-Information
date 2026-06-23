import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export const leaderboardKeys = {
  all: ['leaderboard'] as const,
};

export interface LeaderboardEntry {
  rank: number;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
  xp: number;
}

export const useLeaderboard = () => {
  return useQuery({
    queryKey: leaderboardKeys.all,
    queryFn: async (): Promise<LeaderboardEntry[]> => {
      const { data } = await apiClient.get('/leaderboard');
      return data.data;
    },
  });
};
