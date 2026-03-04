package com.teamops.task.controller.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record AssignTaskRequest(
        @NotNull UUID assigneeId
) {}
