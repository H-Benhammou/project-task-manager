package com.example.project_task_manager.dto;

import com.example.project_task_manager.entity.TaskStatus;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class TaskRequest {
    private String title;
    private String description;
    private LocalDate dueDate;
    private TaskStatus status;
}