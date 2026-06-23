import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export const resourceKeys = {
  all: ['resources'] as const,
  lists: () => [...resourceKeys.all, 'list'] as const,
  list: (filters: any) => [...resourceKeys.lists(), { filters }] as const,
  myUploads: () => [...resourceKeys.all, 'my-uploads'] as const,
};

export const useResources = (filters?: { subject?: string; type?: string; search?: string }) => {
  return useQuery({
    queryKey: resourceKeys.list(filters),
    queryFn: async () => {
      const { data } = await apiClient.get('/resources', { params: filters });
      return data.data;
    },
  });
};

export const useMyUploads = () => {
  return useQuery({
    queryKey: resourceKeys.myUploads(),
    queryFn: async () => {
      const { data } = await apiClient.get('/resources/my-uploads');
      return data.data;
    },
  });
};

export const useUploadResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await apiClient.post('/resources', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resourceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: resourceKeys.myUploads() });
    },
  });
};
