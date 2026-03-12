package com.teamops.attachment.controller;

import com.teamops.attachment.dto.AttachmentResponse;
import com.teamops.attachment.service.AttachmentService;
import java.net.URI;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class AttachmentController {

  private final AttachmentService attachmentService;

  public AttachmentController(AttachmentService attachmentService) {
    this.attachmentService = attachmentService;
  }

  @PostMapping("/api/v1/tasks/{taskId}/attachments")
  @ResponseStatus(HttpStatus.CREATED)
  public AttachmentResponse upload(
      @RequestHeader("X-Org-Id") UUID orgId,
      @RequestHeader("X-User-Id") UUID userId,
      @PathVariable UUID taskId,
      @RequestParam("file") MultipartFile file) {

    if (file.isEmpty()) {
      throw new IllegalArgumentException("Uploaded file must not be empty");
    }

    return attachmentService.upload(taskId, orgId, userId, file);
  }

  @GetMapping("/api/v1/tasks/{taskId}/attachments")
  public List<AttachmentResponse> list(
      @RequestHeader("X-Org-Id") UUID orgId, @PathVariable UUID taskId) {

    return attachmentService.listByTask(taskId, orgId);
  }

  @GetMapping("/api/v1/attachments/{attachmentId}/download")
  public ResponseEntity<Void> download(
      @RequestHeader("X-Org-Id") UUID orgId, @PathVariable UUID attachmentId) {

    String presignedUrl = attachmentService.getPresignedDownloadUrl(attachmentId, orgId);
    return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(presignedUrl)).build();
  }
}
