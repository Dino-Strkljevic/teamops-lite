package com.teamops.notification.repository;

import com.teamops.notification.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface NotificationRepository extends JpaRepository<Notification, UUID> {

    List<Notification> findByRecipientId(UUID recipientId);

    List<Notification> findByRecipientIdAndOrgId(UUID recipientId, UUID orgId);

    List<Notification> findByRecipientIdAndReadFalse(UUID recipientId);

    long countByRecipientIdAndReadFalse(UUID recipientId);
}
