package com.teamops.project.service;

import com.teamops.org.entity.Org;
import com.teamops.org.repository.OrgRepository;
import com.teamops.project.entity.Project;
import com.teamops.project.repository.ProjectRepository;
import com.teamops.user.entity.User;
import com.teamops.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final OrgRepository orgRepository;
    private final UserRepository userRepository;

    public ProjectService(ProjectRepository projectRepository,
                          OrgRepository orgRepository,
                          UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.orgRepository = orgRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Project createProject(UUID orgId, UUID createdById, String name, String description) {
        Org org = orgRepository.findById(orgId)
                .orElseThrow(() -> new IllegalArgumentException("Org not found: " + orgId));

        User createdBy = userRepository.findById(createdById)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + createdById));

        Project project = new Project();
        project.setOrg(org);
        project.setName(name);
        project.setDescription(description);
        project.setCreatedBy(createdBy);

        return projectRepository.save(project);
    }

    @Transactional(readOnly = true)
    public List<Project> getProjectsByOrg(UUID orgId) {
        if (!orgRepository.existsById(orgId)) {
            throw new IllegalArgumentException("Org not found: " + orgId);
        }
        return projectRepository.findByOrgId(orgId);
    }

    @Transactional(readOnly = true)
    public Project getProjectById(UUID projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found: " + projectId));
    }
}
