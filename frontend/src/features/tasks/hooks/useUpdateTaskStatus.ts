import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../lib/api';
import { queryKeys } from '../../../lib/queryKeys';
import type { Task, TaskStatus } from '../../../types/task';

export interface UpdateTaskStatusArgs {
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

    onMutate: async (variables) => {
      const key = queryKeys.tasks.byProject(variables.projectId);

      await queryClient.cancelQueries({ queryKey: key });

      const previous = queryClient.getQueryData<Task[]>(key);

      queryClient.setQueryData<Task[]>(key, (old) =>
        old?.map((t) =>
          t.id === variables.taskId ? { ...t, status: variables.status } : t,
        ) ?? [],
      );

      return { previous };
    },

    onSuccess: (updatedTask, variables) => {
      queryClient.setQueryData<Task[]>(
        queryKeys.tasks.byProject(variables.projectId),
        (old) => old?.map((t) => (t.id === updatedTask.id ? updatedTask : t)) ?? [],
      );
    },

    onError: (_error, variables, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(queryKeys.tasks.byProject(variables.projectId), context.previous);
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.byProject(variables.projectId) });
    },
  });
}
