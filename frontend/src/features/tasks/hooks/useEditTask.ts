import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../lib/api';
import { taskKeys } from './useTasks';
import type { Task, TaskPriority } from '../types';

export interface EditTaskBody {
  title:       string;
  description: string | null;
  priority:    TaskPriority;
  dueDate:     string | null;
}

export interface EditTaskArgs {
  taskId:    string;
  projectId: string;
  body:      EditTaskBody;
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
      const key = taskKeys.byProject(projectId);
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
        taskKeys.byProject(projectId),
        (old) => old?.map((t) => (t.id === updatedTask.id ? updatedTask : t)) ?? [],
      );
      queryClient.invalidateQueries({ queryKey: taskKeys.byProject(projectId) });
    },

    onError: (_err, { projectId }, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(taskKeys.byProject(projectId), context.previous);
      }
      queryClient.invalidateQueries({ queryKey: taskKeys.byProject(projectId) });
    },
  });
}
