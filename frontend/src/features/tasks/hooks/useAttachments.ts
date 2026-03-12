import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../lib/api";
import { queryKeys } from "../../../lib/queryKeys";
import type { Attachment } from "../../../types/task";

async function fetchAttachments(taskId: string): Promise<Attachment[]> {
  const { data } = await apiClient.get<Attachment[]>(
    `/tasks/${taskId}/attachments`,
  );
  return data;
}

export function useAttachments(taskId: string) {
  return useQuery({
    queryKey: queryKeys.attachments.byTask(taskId),
    queryFn: () => fetchAttachments(taskId),
  });
}
