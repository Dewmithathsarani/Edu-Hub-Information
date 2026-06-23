import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export const groupKeys = {
  all: ['groups'] as const,
  lists: () => [...groupKeys.all, 'list'] as const,
  myGroups: () => [...groupKeys.all, 'my-groups'] as const,
};

export const useGroups = () => {
  return useQuery({
    queryKey: groupKeys.lists(),
    queryFn: async () => {
      const { data } = await apiClient.get('/groups');
      return data.data;
    },
  });
};

export const useMyGroups = () => {
  return useQuery({
    queryKey: groupKeys.myGroups(),
    queryFn: async () => {
      const { data } = await apiClient.get('/groups/my-groups');
      return data.data;
    },
  });
};

export const useCreateGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { name: string; subject: string; description: string; maxMembers: number; isMainStream?: boolean }) => {
      const { data } = await apiClient.post('/groups', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
      queryClient.invalidateQueries({ queryKey: groupKeys.myGroups() });
    },
  });
};

export const useJoinGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.post(`/groups/${id}/join`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
      queryClient.invalidateQueries({ queryKey: groupKeys.myGroups() });
    },
  });
};
