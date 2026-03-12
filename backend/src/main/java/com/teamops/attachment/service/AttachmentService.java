package com.teamops.attachment.service;

import com.teamops.attachment.dto.AttachmentResponse;
import com.teamops.attachment.entity.Attachment;
import com.teamops.attachment.repository.AttachmentRepository;
import com.teamops.common.util.EntityLookup;
import com.teamops.org.entity.Org;
import com.teamops.org.repository.OrgRepository;
import com.teamops.storage.MinioStorageService;
import com.teamops.task.entity.Task;
import com.teamops.task.repository.TaskRepository;
import com.teamops.user.entity.User;
import com.teamops.user.repository.UserRepository;
import java.io.IOException;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class AttachmentService {

  private final AttachmentRepository attachmentRepository;
  private final TaskRepository taskRepository;
  private final OrgRepository orgRepository;
  private final UserRepository userRepository;
  private final MinioStorageService storageService;

  public AttachmentService(
      AttachmentRepository attachmentRepository,
      TaskRepository taskRepository,
      OrgRepository orgRepository,
      UserRepository userRepository,
      MinioStorageService storageService) {
    this.attachmentRepository = attachmentRepository;
    this.taskRepository = taskRepository;
    this.orgRepository = orgRepository;
    this.userRepository = userRepository;
    this.storageService = storageService;
  }

  @Transactional
  public AttachmentResponse upload(UUID taskId, UUID orgId, UUID uploadedById, MultipartFile file) {
    Task task =
        taskRepository
            .findByIdAndOrgId(taskId, orgId)
            .orElseThrow(() -> new IllegalArgumentException("Task not found: " + taskId));

    Org org = EntityLookup.findById(orgRepository, orgId, "Org");
    User uploader = EntityLookup.findById(userRepository, uploadedById, "User");

    String objectKey = buildObjectKey(orgId, taskId, file.getOriginalFilename());
    String contentType =
        file.getContentType() != null ? file.getContentType() : "application/octet-stream";

    try {
      storageService.upload(objectKey, file.getInputStream(), contentType, file.getSize());
    } catch (IOException e) {
      throw new IllegalStateException("Failed to read uploaded file", e);
    }

    Attachment attachment = new Attachment();
    attachment.setTask(task);
    attachment.setOrg(org);
    attachment.setUploadedBy(uploader);
    attachment.setFileName(file.getOriginalFilename());
    attachment.setMimeType(contentType);
    attachment.setSizeBytes(file.getSize());
    attachment.setStorageKey(objectKey);

    return AttachmentResponse.from(attachmentRepository.save(attachment));
  }

  @Transactional(readOnly = true)
  public List<AttachmentResponse> listByTask(UUID taskId, UUID orgId) {
    taskRepository
        .findByIdAndOrgId(taskId, orgId)
        .orElseThrow(() -> new IllegalArgumentException("Task not found: " + taskId));

    return attachmentRepository.findByTaskIdAndOrgId(taskId, orgId).stream()
        .map(AttachmentResponse::from)
        .toList();
  }

  @Transactional(readOnly = true)
  public String getPresignedDownloadUrl(UUID attachmentId, UUID orgId) {
    Attachment attachment =
        attachmentRepository
            .findByIdAndOrgId(attachmentId, orgId)
            .orElseThrow(
                () -> new IllegalArgumentException("Attachment not found: " + attachmentId));

    return storageService.generatePresignedDownloadUrl(attachment.getStorageKey());
  }

  // -------------------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------------------

  /**
   * Builds a deterministic, collision-resistant object key:
   * attachments/{orgId}/{taskId}/{uuid}-{filename}
   */
  private String buildObjectKey(UUID orgId, UUID taskId, String originalFilename) {
    String safeName =
        originalFilename != null ? originalFilename.replaceAll("[^a-zA-Z0-9._\\-]", "_") : "file";
    return String.format("attachments/%s/%s/%s-%s", orgId, taskId, UUID.randomUUID(), safeName);
  }
}
