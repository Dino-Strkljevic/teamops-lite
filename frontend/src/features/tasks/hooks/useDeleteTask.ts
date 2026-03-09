import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../lib/api';
import { queryKeys } from '../../../lib/queryKeys';
import type { Task } from '../../../types/task';

export interface DeleteTaskArgs {
  taskId:    string;
  projectId: string;
}

async function deleteTask({ taskId }: DeleteTaskArgs): Promise<void> {
  await apiClient.delete(`/tasks/${taskId}`);
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,

    onSuccess: (_data, { taskId, projectId }) => {
      // Remove the deleted task from the cache immediately, then re-sync
      queryClient.setQueryData<Task[]>(
        queryKeys.tasks.byProject(projectId),
        (old) => old?.filter((t) => t.id !== taskId) ?? [],
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.byProject(projectId) });
    },

    onError: (_err, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.byProject(projectId) });
    },
  });
}
