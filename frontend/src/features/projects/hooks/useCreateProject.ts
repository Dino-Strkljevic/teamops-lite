import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../lib/api';
import { projectKeys } from './useProjects';
import type { Project } from '../types';

export interface CreateProjectBody {
  name: string;
  description: string | null;
}

async function createProject(body: CreateProjectBody): Promise<Project> {
  const { data } = await apiClient.post<Project>('/projects', body);
  return data;
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.list() });
    },
  });
}
