package com.example.project_task_manager.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProjectResponse {
    private Long id;
    private String title;
    private String description;
    private String ownerName;
    private String ownerEmail;
    private LocalDateTime creationDate;
    private int totalTasks;
    private int completedTasks;
    private double progressPercentage;
}