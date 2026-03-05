import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../lib/api';
import { taskKeys } from './useTasks';
import type { Task, TaskStatus } from '../types';

interface UpdateTaskStatusArgs {
  taskId:    string;
  projectId: string;
  status:    TaskStatus;
}

async function updateTaskStatus({ taskId, status }: UpdateTaskStatusArgs): Promise<Task> {
  const { data } = await apiClient.patch<Task>(`/tasks/${taskId}/status`, { status });
  return data;
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTaskStatus,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.byProject(variables.projectId) });
    },
  });
}
