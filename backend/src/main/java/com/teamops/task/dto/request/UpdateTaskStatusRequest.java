package com.teamops.task.dto.request;

import com.teamops.common.enums.TaskStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateTaskStatusRequest(
        @NotNull TaskStatus status
) {}
