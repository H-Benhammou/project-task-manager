package com.example.project_task_manager.mapper;

import com.example.project_task_manager.dto.TaskResponse;
import com.example.project_task_manager.entity.Project;
import com.example.project_task_manager.entity.Task;
import com.example.project_task_manager.entity.TaskStatus;
import com.example.project_task_manager.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;

class TaskMapperTest {

    private TaskMapper taskMapper;
    private Task task;

    @BeforeEach
    void setUp() {
        taskMapper = new TaskMapper();

        User user = User.builder()
                .id(1L)
                .name("Test User")
                .email("test@example.com")
                .build();

        Project project = Project.builder()
                .id(1L)
                .title("Test Project")
                .description("Test Description")
                .user(user)
                .tasks(new ArrayList<>())
                .build();

        task = Task.builder()
                .id(1L)
                .title("Test Task")
                .description("Task Description")
                .dueDate(LocalDate.now().plusDays(7))
                .status(TaskStatus.IN_PROGRESS)
                .project(project)
                .creationDate(LocalDateTime.now())
                .updateDate(LocalDateTime.now())
                .build();
    }

    @Test
    void toResponse_Success() {
        // Act
        TaskResponse response = taskMapper.toResponse(task);

        // Assert
        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Test Task", response.getTitle());
        assertEquals("Task Description", response.getDescription());
        assertNotNull(response.getDueDate());
        assertEquals(TaskStatus.IN_PROGRESS, response.getStatus());
        assertEquals(1L, response.getProjectId());
        assertEquals("Test Project", response.getProjectTitle());
    }
}