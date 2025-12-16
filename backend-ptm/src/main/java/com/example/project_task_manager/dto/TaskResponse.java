package com.example.project_task_manager.dto;

import com.example.project_task_manager.entity.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private LocalDate dueDate;
    private LocalDateTime creationDate;
    private LocalDateTime updateDate;
    private TaskStatus status;
    private Long projectId;
    private String projectTitle;
}