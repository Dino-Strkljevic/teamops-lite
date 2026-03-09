package com.teamops.org.repository;

import com.teamops.common.enums.OrgRole;
import com.teamops.org.entity.OrgMembership;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrgMembershipRepository extends JpaRepository<OrgMembership, UUID> {

  List<OrgMembership> findByOrgId(UUID orgId);

  List<OrgMembership> findByUserId(UUID userId);

  Optional<OrgMembership> findByOrgIdAndUserId(UUID orgId, UUID userId);

  boolean existsByOrgIdAndUserId(UUID orgId, UUID userId);

  boolean existsByOrgIdAndUserIdAndRole(UUID orgId, UUID userId, OrgRole role);
}
