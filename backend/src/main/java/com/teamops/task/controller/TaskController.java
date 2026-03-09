package com.teamops.task.controller;

import com.teamops.common.enums.TaskStatus;
import com.teamops.task.dto.request.AssignTaskRequest;
import com.teamops.task.dto.request.CreateCommentRequest;
import com.teamops.task.dto.request.CreateTaskRequest;
import com.teamops.task.dto.request.UpdateTaskRequest;
import com.teamops.task.dto.request.UpdateTaskStatusRequest;
import com.teamops.task.dto.response.CommentResponse;
import com.teamops.task.dto.response.TaskResponse;
import com.teamops.task.entity.Task;
import com.teamops.task.service.TaskCommentService;
import com.teamops.task.service.TaskService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/tasks")
public class TaskController {

  private final TaskService taskService;
  private final TaskCommentService taskCommentService;

  public TaskController(TaskService taskService, TaskCommentService taskCommentService) {
    this.taskService = taskService;
    this.taskCommentService = taskCommentService;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public TaskResponse create(
      @RequestHeader("X-Org-Id") UUID orgId,
      @RequestHeader("X-User-Id") UUID userId,
      @Valid @RequestBody CreateTaskRequest body) {

    Task task =
        taskService.createTask(
            orgId,
            body.projectId(),
            userId,
            body.title(),
            body.description(),
            TaskStatus.TODO,
            body.priority(),
            body.dueDate());

    if (body.assigneeId() != null) {
      task = taskService.assignTask(task.getId(), orgId, body.assigneeId());
    }

    return TaskResponse.from(task);
  }

  @GetMapping
  public List<TaskResponse> list(
      @RequestHeader("X-Org-Id") UUID orgId, @RequestParam(required = false) UUID projectId) {

    List<Task> tasks =
        (projectId != null)
            ? taskService.getTasksByProject(orgId, projectId)
            : taskService.getTasksByOrg(orgId);

    return tasks.stream().map(TaskResponse::from).toList();
  }

  @PatchMapping("/{taskId}")
  public TaskResponse updateTask(
      @RequestHeader("X-Org-Id") UUID orgId,
      @PathVariable UUID taskId,
      @Valid @RequestBody UpdateTaskRequest body) {

    Task task =
        taskService.updateTask(
            taskId, orgId, body.title(), body.description(), body.priority(), body.dueDate());

    return TaskResponse.from(task);
  }

  @DeleteMapping("/{taskId}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteTask(@RequestHeader("X-Org-Id") UUID orgId, @PathVariable UUID taskId) {

    taskService.deleteTask(taskId, orgId);
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

  @GetMapping("/{taskId}/comments")
  public List<CommentResponse> listComments(
      @RequestHeader("X-Org-Id") UUID orgId, @PathVariable UUID taskId) {

    return taskCommentService.getComments(taskId, orgId);
  }

  @PostMapping("/{taskId}/comments")
  @ResponseStatus(HttpStatus.CREATED)
  public CommentResponse createComment(
      @RequestHeader("X-Org-Id") UUID orgId,
      @RequestHeader("X-User-Id") UUID userId,
      @PathVariable UUID taskId,
      @Valid @RequestBody CreateCommentRequest body) {

    return taskCommentService.createComment(taskId, orgId, userId, body.body());
  }
}
