import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export const meetingKeys = {
  all: ['meetings'] as const,
  upcoming: () => [...meetingKeys.all, 'upcoming'] as const,
  past: () => [...meetingKeys.all, 'past'] as const,
};

export const useUpcomingMeetings = () => {
  return useQuery({
    queryKey: meetingKeys.upcoming(),
    queryFn: async () => {
      const { data } = await apiClient.get('/meetings/upcoming');
      return data.data;
    },
  });
};

export const usePastMeetings = () => {
  return useQuery({
    queryKey: meetingKeys.past(),
    queryFn: async () => {
      const { data } = await apiClient.get('/meetings/past');
      return data.data;
    },
  });
};

export const useCreateMeeting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { title: string; groupId?: string; scheduledFor: string; duration: number }) => {
      const { data } = await apiClient.post('/meetings', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: meetingKeys.upcoming() });
    },
  });
};
