package com.teamops.project.controller.dto;

import com.teamops.project.entity.Project;

import java.time.Instant;
import java.util.UUID;

public record ProjectResponse(
        UUID id,
        UUID orgId,
        String name,
        String description,
        UUID createdById,
        Instant createdAt,
        Instant updatedAt
) {
    public static ProjectResponse from(Project p) {
        return new ProjectResponse(
                p.getId(),
                p.getOrg().getId(),
                p.getName(),
                p.getDescription(),
                p.getCreatedBy() != null ? p.getCreatedBy().getId() : null,
                p.getCreatedAt(),
                p.getUpdatedAt()
        );
    }
}
