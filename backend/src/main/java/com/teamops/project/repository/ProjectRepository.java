package com.teamops.project.repository;

import com.teamops.project.entity.Project;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, UUID> {

  List<Project> findByOrgId(UUID orgId);

  Optional<Project> findByIdAndOrgId(UUID id, UUID orgId);
}
