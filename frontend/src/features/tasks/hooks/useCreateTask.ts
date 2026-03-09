import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../lib/api';
import { queryKeys } from '../../../lib/queryKeys';
import type { Task, CreateTaskBody } from '../../../types/task';

async function createTask(body: CreateTaskBody): Promise<Task> {
  const { data } = await apiClient.post<Task>('/tasks', body);
  return data;
}

export function useCreateTask(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.byProject(projectId) });
    },
  });
}
