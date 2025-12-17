package com.example.project_task_manager.controller;

import com.example.project_task_manager.dto.ProjectRequest;
import com.example.project_task_manager.dto.ProjectResponse;
import com.example.project_task_manager.dto.ProjectSummaryResponse;
import com.example.project_task_manager.entity.User;
import com.example.project_task_manager.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(
            @RequestBody ProjectRequest request,
            @AuthenticationPrincipal User user) {
        ProjectResponse response = projectService.createProject(request, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/all")
    public ResponseEntity<List<ProjectSummaryResponse>> getAllProjects(
            @AuthenticationPrincipal User user) {
        List<ProjectSummaryResponse> projects = projectService.getAllUserProjects(user.getId());
        return ResponseEntity.ok(projects);
    }

    @GetMapping
    public ResponseEntity<Page<ProjectSummaryResponse>> getProjectsPage(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size
    ) {
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "lastModifiedDate")
        );

        return ResponseEntity.ok(
                projectService.getUserProjectsPage(user.getId(), pageable)
        );
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectResponse> getProject(
            @PathVariable Long projectId,
            @AuthenticationPrincipal User user) {
        ProjectResponse response = projectService.getProjectById(projectId, user.getId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/recent")
    public ResponseEntity<List<ProjectSummaryResponse>> getRecentlyModifiedProjects(
            @AuthenticationPrincipal User user) {
        List<ProjectSummaryResponse> projects = projectService.getRecentlyModifiedProjects(user.getId());
        return ResponseEntity.ok(projects);
    }

    @PutMapping("/{projectId}")
    public ResponseEntity<ProjectResponse> updateProject(
            @PathVariable Long projectId,
            @RequestBody ProjectRequest request,
            @AuthenticationPrincipal User user) {
        ProjectResponse response = projectService.updateProject(projectId, request, user.getId());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<Void> deleteProject(
            @PathVariable Long projectId,
            @AuthenticationPrincipal User user) {
        projectService.deleteProject(projectId, user.getId());
        return ResponseEntity.noContent().build();
    }
}