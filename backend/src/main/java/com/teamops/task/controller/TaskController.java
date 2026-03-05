package com.teamops.task.controller;

import com.teamops.task.controller.dto.AssignTaskRequest;
import com.teamops.task.controller.dto.CreateTaskRequest;
import com.teamops.task.controller.dto.TaskResponse;
import com.teamops.task.controller.dto.UpdateTaskStatusRequest;
import com.teamops.task.entity.Task;
import com.teamops.task.entity.TaskStatus;
import com.teamops.task.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TaskResponse create(
            @RequestHeader("X-Org-Id")  UUID orgId,
            @RequestHeader("X-User-Id") UUID userId,
            @Valid @RequestBody CreateTaskRequest body) {

        Task task = taskService.createTask(
                orgId,
                body.projectId(),
                userId,
                body.title(),
                body.description(),
                TaskStatus.TODO,
                body.priority(),
                body.dueDate()
        );

        if (body.assigneeId() != null) {
            task = taskService.assignTask(task.getId(), orgId, body.assigneeId());
        }

        return TaskResponse.from(task);
    }

    @GetMapping
    public List<TaskResponse> list(
            @RequestHeader("X-Org-Id") UUID orgId,
            @RequestParam(required = false) UUID projectId) {

        List<Task> tasks = (projectId != null)
                ? taskService.getTasksByProject(orgId, projectId)
                : taskService.getTasksByOrg(orgId);

        return tasks.stream().map(TaskResponse::from).toList();
    }

    @PatchMapping("/{taskId}/status")
    public TaskResponse updateStatus(
            @RequestHeader("X-Org-Id") UUID orgId,
            @PathVariable UUID taskId,
            @Valid @RequestBody UpdateTaskStatusRequest body) {

        Task task = taskService.updateStatus(taskId, orgId, body.status());
        return TaskResponse.from(task);
    }

    @PatchMapping("/{taskId}/assignee")
    public TaskResponse assignTask(
            @RequestHeader("X-Org-Id") UUID orgId,
            @PathVariable UUID taskId,
            @Valid @RequestBody AssignTaskRequest body) {

        Task task = taskService.assignTask(taskId, orgId, body.assigneeId());
        return TaskResponse.from(task);
    }
}
