package com.teamops.task.dto.response;

import com.teamops.common.enums.TaskPriority;
import com.teamops.common.enums.TaskStatus;
import com.teamops.task.entity.Task;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record TaskResponse(
        UUID id,
        UUID orgId,
        UUID projectId,
        String title,
        String description,
        TaskStatus status,
        TaskPriority priority,
        LocalDate dueDate,
        UUID assigneeId,
        UUID createdById,
        Instant createdAt,
        Instant updatedAt
) {
    public static TaskResponse from(Task t) {
        return new TaskResponse(
                t.getId(),
                t.getOrg().getId(),
                t.getProject().getId(),
                t.getTitle(),
                t.getDescription(),
                t.getStatus(),
                t.getPriority(),
                t.getDueDate(),
                t.getAssignee()  != null ? t.getAssignee().getId()  : null,
                t.getCreatedBy() != null ? t.getCreatedBy().getId() : null,
                t.getCreatedAt(),
                t.getUpdatedAt()
        );
    }
}
