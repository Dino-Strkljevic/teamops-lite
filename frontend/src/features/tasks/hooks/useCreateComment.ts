import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../lib/api';
import { queryKeys } from '../../../lib/queryKeys';
import type { Comment } from '../../../types/task';

interface CreateCommentBody {
  body: string;
}

async function createComment(taskId: string, body: CreateCommentBody): Promise<Comment> {
  const { data } = await apiClient.post<Comment>(`/tasks/${taskId}/comments`, body);
  return data;
}

export function useCreateComment(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateCommentBody) => createComment(taskId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.comments(taskId) });
    },
  });
}
