package com.teamops.project.controller;

import com.teamops.project.controller.dto.CreateProjectRequest;
import com.teamops.project.controller.dto.ProjectResponse;
import com.teamops.project.entity.Project;
import com.teamops.project.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectResponse create(
            @RequestHeader("X-Org-Id")  UUID orgId,
            @RequestHeader("X-User-Id") UUID userId,
            @Valid @RequestBody CreateProjectRequest body) {

        Project project = projectService.createProject(
                orgId,
                userId,
                body.name(),
                body.description()
        );
        return ProjectResponse.from(project);
    }

    @GetMapping
    public List<ProjectResponse> list(
            @RequestHeader("X-Org-Id") UUID orgId) {

        return projectService.getProjectsByOrg(orgId)
                .stream()
                .map(ProjectResponse::from)
                .toList();
    }

    @GetMapping("/{projectId}")
    public ProjectResponse getById(
            @RequestHeader("X-Org-Id") UUID orgId,
            @PathVariable UUID projectId) {

        Project project = projectService.getProjectById(projectId);

        // Tenant guard — reject if project belongs to a different org
        if (!project.getOrg().getId().equals(orgId)) {
            throw new IllegalArgumentException("Project not found: " + projectId);
        }
        return ProjectResponse.from(project);
    }
}
