package com.teamops.attachment.dto;

import com.teamops.attachment.entity.Attachment;
import java.time.Instant;
import java.util.UUID;

public record AttachmentResponse(
    UUID id,
    UUID taskId,
    UUID orgId,
    UUID uploadedBy,
    String fileName,
    String mimeType,
    long sizeBytes,
    String storageKey,
    Instant createdAt) {

  public static AttachmentResponse from(Attachment a) {
    return new AttachmentResponse(
        a.getId(),
        a.getTask().getId(),
        a.getOrg().getId(),
        a.getUploadedBy().getId(),
        a.getFileName(),
        a.getMimeType(),
        a.getSizeBytes(),
        a.getStorageKey(),
        a.getCreatedAt());
  }
}
