package com.example.project_task_manager.service;

import com.example.project_task_manager.mapper.ProjectMapper;
import com.example.project_task_manager.repository.ProjectRepository;

import com.example.project_task_manager.dto.ProjectRequest;
import com.example.project_task_manager.dto.ProjectResponse;
import com.example.project_task_manager.dto.ProjectSummaryResponse;
import com.example.project_task_manager.entity.Project;
import com.example.project_task_manager.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;

    @Transactional
    public ProjectResponse createProject(ProjectRequest request, User user) {
        Project project = Project.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .user(user)
                .tasks(new ArrayList<>())
                .build();

        Project savedProject = projectRepository.save(project);
        return projectMapper.toResponse(savedProject);
    }

    @Transactional(readOnly = true)
    public List<ProjectSummaryResponse> getAllUserProjects(Long userId) {
        List<Project> projects = projectRepository.findByUserId(userId);
        return projects.stream()
                .map(projectMapper::toSummaryResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProjectResponse getProjectById(Long projectId, Long userId) {
        Project project = projectRepository.findByIdAndUserId(projectId, userId)
                .orElseThrow(() -> new RuntimeException("Project not found or access denied"));
        return projectMapper.toResponse(project);
    }

    @Transactional
    public ProjectResponse updateProject(Long projectId, ProjectRequest request, Long userId) {
        Project project = projectRepository.findByIdAndUserId(projectId, userId)
                .orElseThrow(() -> new RuntimeException("Project not found or access denied"));

        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());

        Project updatedProject = projectRepository.save(project);
        return projectMapper.toResponse(updatedProject);
    }

    @Transactional
    public void deleteProject(Long projectId, Long userId) {
        Project project = projectRepository.findByIdAndUserId(projectId, userId)
                .orElseThrow(() -> new RuntimeException("Project not found or access denied"));
        projectRepository.delete(project);
    }
}
