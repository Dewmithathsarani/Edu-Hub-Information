import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export const useActiveChallenges = () => {
  return useQuery({
    queryKey: ['challenges', 'active'],
    queryFn: async () => {
      const { data } = await apiClient.get('/challenges/active');
      return data.data;
    }
  });
};
