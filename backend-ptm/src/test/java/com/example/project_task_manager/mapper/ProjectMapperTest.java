package com.example.project_task_manager.mapper;

import com.example.project_task_manager.dto.ProjectResponse;
import com.example.project_task_manager.dto.ProjectSummaryResponse;
import com.example.project_task_manager.entity.Project;
import com.example.project_task_manager.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;

class ProjectMapperTest {

    private ProjectMapper projectMapper;
    private Project project;

    @BeforeEach
    void setUp() {
        projectMapper = new ProjectMapper();

        User user = User.builder()
                .id(1L)
                .name("Test User")
                .email("test@example.com")
                .build();

        project = Project.builder()
                .id(1L)
                .title("Test Project")
                .description("Test Description")
                .user(user)
                .tasks(new ArrayList<>())
                .creationDate(LocalDateTime.now())
                .lastModifiedDate(LocalDateTime.now())
                .build();
    }

    @Test
    void toResponse_Success() {
        // Act
        ProjectResponse response = projectMapper.toResponse(project);

        // Assert
        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Test Project", response.getTitle());
        assertEquals("Test Description", response.getDescription());
        assertEquals("Test User", response.getOwnerName());
        assertEquals("test@example.com", response.getOwnerEmail());
        assertEquals(0, response.getTotalTasks());
        assertEquals(0, response.getCompletedTasks());
        assertEquals(0.0, response.getProgressPercentage());
    }

    @Test
    void toSummaryResponse_Success() {
        // Act
        ProjectSummaryResponse response = projectMapper.toSummaryResponse(project);

        // Assert
        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Test Project", response.getTitle());
        assertEquals("Test Description", response.getDescription());
        assertEquals(0, response.getTotalTasks());
        assertEquals(0, response.getCompletedTasks());
        assertEquals(0.0, response.getProgressPercentage());
    }
}