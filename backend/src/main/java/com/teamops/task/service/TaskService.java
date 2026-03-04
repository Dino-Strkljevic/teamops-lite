package com.teamops.task.service;

import com.teamops.org.entity.Org;
import com.teamops.org.repository.OrgRepository;
import com.teamops.project.entity.Project;
import com.teamops.project.repository.ProjectRepository;
import com.teamops.task.entity.Task;
import com.teamops.task.entity.TaskPriority;
import com.teamops.task.entity.TaskStatus;
import com.teamops.task.repository.TaskRepository;
import com.teamops.user.entity.User;
import com.teamops.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final OrgRepository orgRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository,
                       ProjectRepository projectRepository,
                       OrgRepository orgRepository,
                       UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.orgRepository = orgRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Task createTask(UUID orgId,
                           UUID projectId,
                           UUID createdById,
                           String title,
                           String description,
                           TaskStatus status,
                           TaskPriority priority,
                           LocalDate dueDate) {
        Org org = orgRepository.findById(orgId)
                .orElseThrow(() -> new IllegalArgumentException("Org not found: " + orgId));

        Project project = projectRepository.findByIdAndOrgId(projectId, orgId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found: " + projectId));

        User createdBy = userRepository.findById(createdById)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + createdById));

        Task task = new Task();
        task.setOrg(org);
        task.setProject(project);
        task.setCreatedBy(createdBy);
        task.setTitle(title);
        task.setDescription(description);
        task.setStatus(status);
        task.setPriority(priority);
        task.setDueDate(dueDate);

        return taskRepository.save(task);
    }

    @Transactional(readOnly = true)
    public List<Task> getTasksByProject(UUID orgId, UUID projectId) {
        if (!projectRepository.findByIdAndOrgId(projectId, orgId).isPresent()) {
            throw new IllegalArgumentException("Project not found: " + projectId);
        }
        return taskRepository.findByOrgIdAndProjectId(orgId, projectId);
    }

    @Transactional(readOnly = true)
    public List<Task> getTasksByOrg(UUID orgId) {
        if (!orgRepository.existsById(orgId)) {
            throw new IllegalArgumentException("Org not found: " + orgId);
        }
        return taskRepository.findByOrgId(orgId);
    }

    @Transactional
    public Task assignTask(UUID taskId, UUID orgId, UUID assigneeId) {
        Task task = taskRepository.findByIdAndOrgId(taskId, orgId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found: " + taskId));

        User assignee = userRepository.findById(assigneeId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + assigneeId));

        task.setAssignee(assignee);

        return taskRepository.save(task);
    }

    @Transactional(readOnly = true)
    public Task getTaskById(UUID taskId, UUID orgId) {
        return taskRepository.findByIdAndOrgId(taskId, orgId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found: " + taskId));
    }
}
