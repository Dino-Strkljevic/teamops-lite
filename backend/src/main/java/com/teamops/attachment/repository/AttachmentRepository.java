package com.teamops.attachment.repository;

import com.teamops.attachment.entity.Attachment;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttachmentRepository extends JpaRepository<Attachment, UUID> {

  List<Attachment> findByTaskId(UUID taskId);

  List<Attachment> findByOrgId(UUID orgId);

  List<Attachment> findByUploadedById(UUID uploadedById);
}
