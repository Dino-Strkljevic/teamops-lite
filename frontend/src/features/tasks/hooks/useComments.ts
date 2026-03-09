import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../lib/api";
import { queryKeys } from "../../../lib/queryKeys";
import type { Comment } from "../../../types/task";

async function fetchComments(taskId: string): Promise<Comment[]> {
  const { data } = await apiClient.get<Comment[]>(`/tasks/${taskId}/comments`);
  return data;
}

export function useComments(taskId: string) {
  return useQuery({
    queryKey: queryKeys.tasks.comments(taskId),
    queryFn: () => fetchComments(taskId),
  });
}
