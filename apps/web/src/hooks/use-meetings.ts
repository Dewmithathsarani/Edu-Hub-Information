import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient as api } from '../lib/api-client';

export const useUpcomingMeetings = () => {
  return useQuery({
    queryKey: ['meetings', 'upcoming'],
    queryFn: async () => {
      const { data } = await api.get('/meetings/upcoming');
      return data.data;
    }
  });
};

export const usePastMeetings = () => {
  return useQuery({
    queryKey: ['meetings', 'past'],
    queryFn: async () => {
      const { data } = await api.get('/meetings/past');
      return data.data;
    }
  });
};

export const useCreateMeeting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (meetingData: any) => {
      const { data } = await api.post('/meetings', meetingData);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
    }
  });
};
