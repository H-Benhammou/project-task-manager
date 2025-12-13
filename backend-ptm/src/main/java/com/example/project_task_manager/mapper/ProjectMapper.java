package com.example.project_task_manager.mapper;

import com.example.project_task_manager.dto.ProjectResponse;
import com.example.project_task_manager.dto.ProjectSummaryResponse;
import com.example.project_task_manager.entity.Project;
import org.springframework.stereotype.Component;

@Component
public class ProjectMapper {

    public ProjectResponse toResponse(Project project) {
        return ProjectResponse.builder()
                .id(project.getId())
                .title(project.getTitle())
                .description(project.getDescription())
                .ownerName(project.getUser().getName())
                .ownerEmail(project.getUser().getEmail())
                .totalTasks(project.getTotalTasks())
                .completedTasks(project.getCompletedTasks())
                .progressPercentage(project.getProgressPercentage())
                .build();
    }

    public ProjectSummaryResponse toSummaryResponse(Project project) {
        return ProjectSummaryResponse.builder()
                .id(project.getId())
                .title(project.getTitle())
                .description(project.getDescription())
                .totalTasks(project.getTotalTasks())
                .completedTasks(project.getCompletedTasks())
                .progressPercentage(project.getProgressPercentage())
                .build();
    }
}