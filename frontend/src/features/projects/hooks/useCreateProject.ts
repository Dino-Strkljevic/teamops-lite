import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../lib/api";
import { queryKeys } from "../../../lib/queryKeys";
import type { Project, CreateProjectBody } from "../../../types/project";

async function createProject(body: CreateProjectBody): Promise<Project> {
  const { data } = await apiClient.post<Project>("/projects", body);
  return data;
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.list() });
    },
  });
}
