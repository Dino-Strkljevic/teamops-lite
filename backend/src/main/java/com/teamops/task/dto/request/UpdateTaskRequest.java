package com.teamops.task.dto.request;

import com.teamops.common.enums.TaskPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record UpdateTaskRequest(
        @NotBlank @Size(max = 255) String title,
        String description,
        @NotNull TaskPriority priority,
        LocalDate dueDate
) {}
