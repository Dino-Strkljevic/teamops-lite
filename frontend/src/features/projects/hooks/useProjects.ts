import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../lib/api';
import type { Project } from '../types';

export const projectKeys = {
  all: ['projects'] as const,
  list: () => [...projectKeys.all, 'list'] as const,
};

async function fetchProjects(): Promise<Project[]> {
  const { data } = await apiClient.get<Project[]>('/projects');
  return data;
}

export function useProjects() {
  return useQuery({
    queryKey: projectKeys.list(),
    queryFn: fetchProjects,
  });
}
