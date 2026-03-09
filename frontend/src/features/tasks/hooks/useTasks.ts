import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../lib/api';
import { queryKeys } from '../../../lib/queryKeys';
import type { Task } from '../../../types/task';

async function fetchTasksByProject(projectId: string): Promise<Task[]> {
  const { data } = await apiClient.get<Task[]>('/tasks', {
    params: { projectId },
  });
  return data;
}

export function useTasks(projectId: string) {
  return useQuery({
    queryKey: queryKeys.tasks.byProject(projectId),
    queryFn:  () => fetchTasksByProject(projectId),
  });
}
