package com.teamops.project.controller;

import com.teamops.project.dto.request.CreateProjectRequest;
import com.teamops.project.dto.response.ProjectResponse;
import com.teamops.project.entity.Project;
import com.teamops.project.service.ProjectService;
import com.teamops.security.AuthUtils;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/projects")
public class ProjectController {

  private final ProjectService projectService;
  private final AuthUtils authUtils;

  public ProjectController(ProjectService projectService, AuthUtils authUtils) {
    this.projectService = projectService;
    this.authUtils = authUtils;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public ProjectResponse create(
      @RequestHeader("X-Org-Id") UUID orgId, @Valid @RequestBody CreateProjectRequest body) {

    UUID userId = authUtils.currentUserId();
    Project project = projectService.createProject(orgId, userId, body.name(), body.description());
    return ProjectResponse.from(project);
  }

  @GetMapping
  public List<ProjectResponse> list(@RequestHeader("X-Org-Id") UUID orgId) {

    return projectService.getProjectsByOrg(orgId).stream().map(ProjectResponse::from).toList();
  }

  @GetMapping("/{projectId}")
  public ProjectResponse getById(
      @RequestHeader("X-Org-Id") UUID orgId, @PathVariable UUID projectId) {

    Project project = projectService.getProjectById(projectId);

    if (!project.getOrg().getId().equals(orgId)) {
      throw new IllegalArgumentException("Project not found: " + projectId);
    }
    return ProjectResponse.from(project);
  }
}
