package com.teamops.task.service;

import com.teamops.common.util.EntityLookup;
import com.teamops.org.entity.Org;
import com.teamops.org.repository.OrgRepository;
import com.teamops.task.entity.Task;
import com.teamops.task.entity.TaskComment;
import com.teamops.task.dto.response.CommentResponse;
import com.teamops.task.repository.TaskCommentRepository;
import com.teamops.task.repository.TaskRepository;
import com.teamops.user.entity.User;
import com.teamops.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class TaskCommentService {

    private final TaskCommentRepository taskCommentRepository;
    private final TaskRepository taskRepository;
    private final OrgRepository orgRepository;
    private final UserRepository userRepository;

    public TaskCommentService(TaskCommentRepository taskCommentRepository,
                              TaskRepository taskRepository,
                              OrgRepository orgRepository,
                              UserRepository userRepository) {
        this.taskCommentRepository = taskCommentRepository;
        this.taskRepository = taskRepository;
        this.orgRepository = orgRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> getComments(UUID taskId, UUID orgId) {
        taskRepository.findByIdAndOrgId(taskId, orgId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found: " + taskId));

        return taskCommentRepository.findByTaskIdOrderByCreatedAtAsc(taskId)
                .stream()
                .map(CommentResponse::from)
                .toList();
    }

    @Transactional
    public CommentResponse createComment(UUID taskId, UUID orgId, UUID authorId, String body) {
        Task task = taskRepository.findByIdAndOrgId(taskId, orgId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found: " + taskId));

        Org org = EntityLookup.findById(orgRepository, orgId, "Org");
        User author = EntityLookup.findById(userRepository, authorId, "User");

        TaskComment comment = new TaskComment();
        comment.setTask(task);
        comment.setOrg(org);
        comment.setAuthor(author);
        comment.setBody(body);

        return CommentResponse.from(taskCommentRepository.save(comment));
    }
}
