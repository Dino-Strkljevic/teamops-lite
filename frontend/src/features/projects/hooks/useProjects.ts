import { useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../lib/api";
import { queryKeys } from "../../../lib/queryKeys";
import type { Project } from "../../../types/project";

async function fetchProjects(): Promise<Project[]> {
  const { data } = await apiClient.get<Project[]>("/projects");
  return data;
}

export function useProjects() {
  return useQuery({
    queryKey: queryKeys.projects.list(),
    queryFn: fetchProjects,
  });
}

export function useProject(projectId: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: queryKeys.projects.detail(projectId),
    queryFn: async () => {
      const projects = await fetchProjects();
      const found = projects.find((p) => p.id === projectId);
      if (!found) throw new Error(`Project ${projectId} not found`);
      return found;
    },
    initialData: () =>
      queryClient
        .getQueryData<Project[]>(queryKeys.projects.list())
        ?.find((
          p) => p.id === projectId),
    initialDataUpdatedAt: () =>
      queryClient.getQueryState(queryKeys.projects.list())?.dataUpdatedAt,
  });
}
