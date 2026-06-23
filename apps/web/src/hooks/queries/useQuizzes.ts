import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export const quizKeys = {
  all: ['quizzes'] as const,
  lists: () => [...quizKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...quizKeys.lists(), { filters }] as const,
  details: () => [...quizKeys.all, 'detail'] as const,
  detail: (id: string) => [...quizKeys.details(), id] as const,
  myAttempts: () => [...quizKeys.all, 'attempts'] as const,
};

export const useQuizzes = (filters?: { subject?: string; difficulty?: string; search?: string }) => {
  return useQuery({
    queryKey: quizKeys.list(filters),
    queryFn: async () => {
      const { data } = await apiClient.get('/quizzes', { params: filters });
      return data.data;
    },
  });
};

export const useMyAttempts = () => {
  return useQuery({
    queryKey: quizKeys.myAttempts(),
    queryFn: async () => {
      const { data } = await apiClient.get('/quizzes/my-attempts');
      return data.data;
    },
  });
};

export const useQuiz = (id: string) => {
  return useQuery({
    queryKey: quizKeys.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get(`/quizzes/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
};

export const useSubmitQuiz = (id: string) => {
  return useMutation({
    mutationFn: async (payload: { answers: Record<string, unknown>[]; timeTaken: number }) => {
      const { data } = await apiClient.post(`/quizzes/${id}/submit`, payload);
      return data.data;
    },
  });
};
