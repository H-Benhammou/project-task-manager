package com.example.project_task_manager.mapper;

import com.example.project_task_manager.dto.TaskResponse;
import com.example.project_task_manager.entity.Task;
import org.springframework.stereotype.Component;

@Component
public class TaskMapper {

    public TaskResponse toResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .dueDate(task.getDueDate())
                .status(task.getStatus())
                .projectId(task.getProject().getId())
                .projectTitle(task.getProject().getTitle())
                .build();
    }
}