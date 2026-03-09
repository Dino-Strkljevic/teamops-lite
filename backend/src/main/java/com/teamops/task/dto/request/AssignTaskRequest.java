package com.teamops.task.dto.request;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record AssignTaskRequest(@NotNull UUID assigneeId) {}
