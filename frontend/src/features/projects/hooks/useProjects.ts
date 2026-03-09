import { useQuery } from "@tanstack/react-query";
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
