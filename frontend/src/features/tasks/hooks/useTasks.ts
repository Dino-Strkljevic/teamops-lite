import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../lib/api';
import type { Task } from '../types';

export const taskKeys = {
  all: ['tasks'] as const,
  byProject: (projectId: string) => [...taskKeys.all, 'project', projectId] as const,
};

async function fetchTasksByProject(projectId: string): Promise<Task[]> {
  const { data } = await apiClient.get<Task[]>('/tasks', {
    params: { projectId },
  });
  return data;
}

export function useTasks(projectId: string) {
  return useQuery({
    queryKey: taskKeys.byProject(projectId),
    queryFn: () => fetchTasksByProject(projectId),
  });
}
