package com.teamops.task.repository;

import com.teamops.task.entity.TaskComment;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskCommentRepository extends JpaRepository<TaskComment, UUID> {

  List<TaskComment> findByTaskIdOrderByCreatedAtAsc(UUID taskId);

  List<TaskComment> findByAuthorId(UUID authorId);
}
