package com.teamops.task.dto.response;

import com.teamops.task.entity.TaskComment;
import java.time.Instant;
import java.util.UUID;

public record CommentResponse(
    UUID id,
    UUID taskId,
    UUID orgId,
    UUID authorId,
    String authorDisplayName,
    String body,
    Instant createdAt) {
  public static CommentResponse from(TaskComment c) {
    return new CommentResponse(
        c.getId(),
        c.getTask().getId(),
        c.getOrg().getId(),
        c.getAuthor().getId(),
        c.getAuthor().getDisplayName(),
        c.getBody(),
        c.getCreatedAt());
  }
}
