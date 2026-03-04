package com.teamops.task.repository;

import com.teamops.task.entity.Task;
import com.teamops.task.entity.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TaskRepository extends JpaRepository<Task, UUID> {

    List<Task> findByOrgId(UUID orgId);

    List<Task> findByProjectId(UUID projectId);

    List<Task> findByOrgIdAndProjectId(UUID orgId, UUID projectId);

    List<Task> findByOrgIdAndStatus(UUID orgId, TaskStatus status);

    List<Task> findByAssigneeId(UUID assigneeId);

    Optional<Task> findByIdAndOrgId(UUID id, UUID orgId);
}
