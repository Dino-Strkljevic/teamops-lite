import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../lib/api';
import { taskKeys } from './useTasks';
import type { Task, TaskPriority } from '../types';

export interface CreateTaskBody {
  projectId: string;
  title: string;
  description: string | null;
  priority: TaskPriority;
  dueDate: string | null;
}

async function createTask(body: CreateTaskBody): Promise<Task> {
  const { data } = await apiClient.post<Task>('/tasks', body);
  return data;
}

export function useCreateTask(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.byProject(projectId) });
    },
  });
}
