package com.example.project_task_manager.service;

import com.example.project_task_manager.dto.ProjectRequest;
import com.example.project_task_manager.dto.ProjectResponse;
import com.example.project_task_manager.dto.ProjectSummaryResponse;
import com.example.project_task_manager.entity.Project;
import com.example.project_task_manager.entity.User;
import com.example.project_task_manager.mapper.ProjectMapper;
import com.example.project_task_manager.repository.ProjectRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private ProjectMapper projectMapper;

    @InjectMocks
    private ProjectService projectService;

    private User user;
    private Project project;
    private ProjectRequest projectRequest;
    private ProjectResponse projectResponse;
    private ProjectSummaryResponse projectSummaryResponse;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id(1L)
                .name("Test User")
                .email("test@example.com")
                .build();

        projectRequest = new ProjectRequest();
        projectRequest.setTitle("Test Project");
        projectRequest.setDescription("Test Description");

        project = Project.builder()
                .id(1L)
                .title("Test Project")
                .description("Test Description")
                .user(user)
                .tasks(new ArrayList<>())
                .creationDate(LocalDateTime.now())
                .lastModifiedDate(LocalDateTime.now())
                .build();

        projectResponse = ProjectResponse.builder()
                .id(1L)
                .title("Test Project")
                .description("Test Description")
                .ownerName("Test User")
                .ownerEmail("test@example.com")
                .totalTasks(0)
                .completedTasks(0)
                .progressPercentage(0.0)
                .build();

        projectSummaryResponse = ProjectSummaryResponse.builder()
                .id(1L)
                .title("Test Project")
                .description("Test Description")
                .totalTasks(0)
                .completedTasks(0)
                .progressPercentage(0.0)
                .build();
    }

    @Test
    void createProject_Success() {
        // Arrange
        when(projectRepository.save(any(Project.class))).thenReturn(project);
        when(projectMapper.toResponse(any(Project.class))).thenReturn(projectResponse);

        // Act
        ProjectResponse response = projectService.createProject(projectRequest, user);

        // Assert
        assertNotNull(response);
        assertEquals("Test Project", response.getTitle());
        assertEquals("Test Description", response.getDescription());
        verify(projectRepository, times(1)).save(any(Project.class));
        verify(projectMapper, times(1)).toResponse(any(Project.class));
    }

    @Test
    void getAllUserProjects_Success() {
        // Arrange
        List<Project> projects = Collections.singletonList(project);
        when(projectRepository.findByUserId(user.getId())).thenReturn(projects);
        when(projectMapper.toSummaryResponse(any(Project.class))).thenReturn(projectSummaryResponse);

        // Act
        List<ProjectSummaryResponse> responses = projectService.getAllUserProjects(user.getId());

        // Assert
        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals("Test Project", responses.getFirst().getTitle());
        verify(projectRepository, times(1)).findByUserId(user.getId());
    }

    @Test
    void getUserProjectsPage_Success() {
        // Arrange
        List<Project> projects = Collections.singletonList(project);
        Page<Project> projectPage = new PageImpl<>(projects);
        Pageable pageable = PageRequest.of(0, 6);

        when(projectRepository.findPageByUserId(user.getId(), pageable)).thenReturn(projectPage);
        when(projectMapper.toSummaryResponse(any(Project.class))).thenReturn(projectSummaryResponse);

        // Act
        Page<ProjectSummaryResponse> responses = projectService.getUserProjectsPage(user.getId(), pageable);

        // Assert
        assertNotNull(responses);
        assertEquals(1, responses.getTotalElements());
        verify(projectRepository, times(1)).findPageByUserId(user.getId(), pageable);
    }

    @Test
    void getProjectById_Success() {
        // Arrange
        when(projectRepository.findByIdAndUserId(1L, user.getId())).thenReturn(Optional.of(project));
        when(projectMapper.toResponse(any(Project.class))).thenReturn(projectResponse);

        // Act
        ProjectResponse response = projectService.getProjectById(1L, user.getId());

        // Assert
        assertNotNull(response);
        assertEquals("Test Project", response.getTitle());
        verify(projectRepository, times(1)).findByIdAndUserId(1L, user.getId());
    }

    @Test
    void getProjectById_NotFound() {
        // Arrange
        when(projectRepository.findByIdAndUserId(1L, user.getId())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            projectService.getProjectById(1L, user.getId());
        });
        verify(projectRepository, times(1)).findByIdAndUserId(1L, user.getId());
    }

    @Test
    void updateProject_Success() {
        // Arrange
        when(projectRepository.findByIdAndUserId(1L, user.getId())).thenReturn(Optional.of(project));
        when(projectRepository.save(any(Project.class))).thenReturn(project);
        when(projectMapper.toResponse(any(Project.class))).thenReturn(projectResponse);

        // Act
        ProjectResponse response = projectService.updateProject(1L, projectRequest, user.getId());

        // Assert
        assertNotNull(response);
        verify(projectRepository, times(1)).save(any(Project.class));
    }

    @Test
    void deleteProject_Success() {
        // Arrange
        when(projectRepository.findByIdAndUserId(1L, user.getId())).thenReturn(Optional.of(project));
        doNothing().when(projectRepository).delete(any(Project.class));

        // Act
        projectService.deleteProject(1L, user.getId());

        // Assert
        verify(projectRepository, times(1)).delete(project);
    }

    @Test
    void getRecentlyModifiedProjects_Success() {
        // Arrange
        List<Project> projects = Collections.singletonList(project);
        when(projectRepository.findRecentlyModifiedProjects(eq(user.getId()), any(LocalDateTime.class)))
                .thenReturn(projects);
        when(projectMapper.toSummaryResponse(any(Project.class))).thenReturn(projectSummaryResponse);

        // Act
        List<ProjectSummaryResponse> responses = projectService.getRecentlyModifiedProjects(user.getId());

        // Assert
        assertNotNull(responses);
        assertEquals(1, responses.size());
        verify(projectRepository, times(1)).findRecentlyModifiedProjects(eq(user.getId()), any(LocalDateTime.class));
    }
}