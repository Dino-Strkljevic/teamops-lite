import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../lib/api";
import { queryKeys } from "../../../lib/queryKeys";
import type { Attachment } from "../../../types/task";

async function uploadAttachment(
  taskId: string,
  file: File,
): Promise<Attachment> {
  const form = new FormData();
  form.append("file", file);

  const { data } = await apiClient.post<Attachment>(
    `/tasks/${taskId}/attachments`,
    form,
    // Let the browser set the multipart boundary; axios handles this
    // automatically when the body is FormData — just omit Content-Type.
    { headers: { "Content-Type": undefined } },
  );
  return data;
}

export function useUploadAttachment(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadAttachment(taskId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.attachments.byTask(taskId),
      });
    },
  });
}
