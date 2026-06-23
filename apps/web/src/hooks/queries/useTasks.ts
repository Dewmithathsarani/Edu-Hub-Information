import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { TaskResponse, CreateTaskDTO, UpdateTaskDTO } from '@edu-hub/types';

export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (filters: string) => [...taskKeys.lists(), { filters }] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
};

export const useTasks = () => {
  return useQuery({
    queryKey: taskKeys.lists(),
    queryFn: async (): Promise<TaskResponse[]> => {
      const { data } = await apiClient.get('/tasks');
      return data.data;
    },
  });
};

export const usePrioritizeTasks = () => {
  return useQuery({
    queryKey: [...taskKeys.lists(), 'ai-priority'],
    queryFn: async (): Promise<(TaskResponse & { priorityScore: number })[]> => {
      const { data } = await apiClient.post('/tasks/ai-prioritize');
      return data.data;
    },
  });
};

export const useTask = (id: string) => {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: async (): Promise<TaskResponse> => {
      const { data } = await apiClient.get(`/tasks/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newTask: CreateTaskDTO) => {
      const { data } = await apiClient.post('/tasks', newTask);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updateData }: { id: string } & UpdateTaskDTO) => {
      const { data } = await apiClient.put(`/tasks/${id}`, updateData);
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(variables.id) });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
};
