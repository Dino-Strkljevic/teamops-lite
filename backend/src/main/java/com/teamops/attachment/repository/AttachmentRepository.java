package com.teamops.attachment.repository;

import com.teamops.attachment.entity.Attachment;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttachmentRepository extends JpaRepository<Attachment, UUID> {

  List<Attachment> findByTaskIdAndOrgId(UUID taskId, UUID orgId);

  Optional<Attachment> findByIdAndOrgId(UUID id, UUID orgId);

  List<Attachment> findByOrgId(UUID orgId);

  List<Attachment> findByUploadedById(UUID uploadedById);
}
