import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../lib/api';
import { queryKeys } from '../../../lib/queryKeys';
import type { Task, UpdateTaskBody } from '../../../types/task';

export interface EditTaskArgs {
  taskId:    string;
  projectId: string;
  body:      UpdateTaskBody;
}

async function editTask({ taskId, body }: EditTaskArgs): Promise<Task> {
  const { data } = await apiClient.patch<Task>(`/tasks/${taskId}`, body);
  return data;
}

export function useEditTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editTask,

    onMutate: async ({ taskId, projectId, body }) => {
      const key = queryKeys.tasks.byProject(projectId);
      await queryClient.cancelQueries({ queryKey: key });

      const previous = queryClient.getQueryData<Task[]>(key);

      queryClient.setQueryData<Task[]>(key, (old) =>
        old?.map((t) =>
          t.id === taskId ? { ...t, ...body } : t,
        ) ?? [],
      );

      return { previous };
    },

    onSuccess: (updatedTask, { projectId }) => {
      queryClient.setQueryData<Task[]>(
        queryKeys.tasks.byProject(projectId),
        (old) => old?.map((t) => (t.id === updatedTask.id ? updatedTask : t)) ?? [],
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.byProject(projectId) });
    },

    onError: (_err, { projectId }, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(queryKeys.tasks.byProject(projectId), context.previous);
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.byProject(projectId) });
    },
  });
}
