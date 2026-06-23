import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export const analyticsKeys = {
  all: ['analytics'] as const,
  dashboard: () => [...analyticsKeys.all, 'dashboard'] as const,
};

export interface DashboardStats {
  averageScore: number;
  quizzesTaken: number;
  strongestSubject: { name: string; score: number };
  weakestSubject: { name: string; score: number };
  subjectPerformance: { subject: string; score: number }[];
}

export const useDashboardStats = () => {
  return useQuery({
    queryKey: analyticsKeys.dashboard(),
    queryFn: async (): Promise<DashboardStats> => {
      const { data } = await apiClient.get('/analytics/dashboard');
      return data.data;
    },
  });
};

export const useLogSession = () => {
  return useMutation({
    mutationFn: async (payload: { subject: string; duration: number; startedAt: string; endedAt: string }) => {
      const { data } = await apiClient.post('/analytics/sessions', payload);
      return data.data;
    },
  });
};
