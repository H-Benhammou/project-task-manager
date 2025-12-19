package com.example.project_task_manager.service;

import com.example.project_task_manager.dto.TaskRequest;
import com.example.project_task_manager.dto.TaskResponse;
import com.example.project_task_manager.entity.Project;
import com.example.project_task_manager.entity.Task;
import com.example.project_task_manager.entity.TaskStatus;
import com.example.project_task_manager.entity.User;
import com.example.project_task_manager.mapper.TaskMapper;
import com.example.project_task_manager.repository.ProjectRepository;
import com.example.project_task_manager.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private TaskMapper taskMapper;

    @InjectMocks
    private TaskService taskService;

    private User user;
    private Project project;
    private Task task;
    private TaskRequest taskRequest;
    private TaskResponse taskResponse;

    @BeforeEach
    void setUp() {
        user = User.builder()
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

        taskRequest = new TaskRequest();
        taskRequest.setTitle("Test Task");
        taskRequest.setDescription("Task Description");
        taskRequest.setDueDate(LocalDate.now().plusDays(7));

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

        taskResponse = TaskResponse.builder()
                .id(1L)
                .title("Test Task")
                .description("Task Description")
                .dueDate(LocalDate.now().plusDays(7))
                .status(TaskStatus.IN_PROGRESS)
                .projectId(1L)
                .projectTitle("Test Project")
                .build();
    }

    @Test
    void createTask_Success() {
        // Arrange
        when(projectRepository.findByIdAndUserId(1L, user.getId())).thenReturn(Optional.of(project));
        when(taskRepository.save(any(Task.class))).thenReturn(task);
        when(projectRepository.save(any(Project.class))).thenReturn(project);
        when(taskMapper.toResponse(any(Task.class))).thenReturn(taskResponse);

        // Act
        TaskResponse response = taskService.createTask(1L, taskRequest, user.getId());

        // Assert
        assertNotNull(response);
        assertEquals("Test Task", response.getTitle());
        verify(taskRepository, times(1)).save(any(Task.class));
        verify(projectRepository, times(1)).save(any(Project.class));
    }

    @Test
    void createTask_ProjectNotFound() {
        // Arrange
        when(projectRepository.findByIdAndUserId(1L, user.getId())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            taskService.createTask(1L, taskRequest, user.getId());
        });
        verify(taskRepository, never()).save(any(Task.class));
    }

    @Test
    void getAllProjectTasks_Success() {
        // Arrange
        List<Task> tasks = Collections.singletonList(task);
        when(projectRepository.findByIdAndUserId(1L, user.getId())).thenReturn(Optional.of(project));
        when(taskRepository.findByProjectId(1L)).thenReturn(tasks);
        when(taskMapper.toResponse(any(Task.class))).thenReturn(taskResponse);

        // Act
        List<TaskResponse> responses = taskService.getAllProjectTasks(1L, user.getId());

        // Assert
        assertNotNull(responses);
        assertEquals(1, responses.size());
        verify(taskRepository, times(1)).findByProjectId(1L);
    }

    @Test
    void getTaskById_Success() {
        // Arrange
        when(projectRepository.findByIdAndUserId(1L, user.getId())).thenReturn(Optional.of(project));
        when(taskRepository.findByIdAndProjectId(1L, 1L)).thenReturn(Optional.of(task));
        when(taskMapper.toResponse(any(Task.class))).thenReturn(taskResponse);

        // Act
        TaskResponse response = taskService.getTaskById(1L, 1L, user.getId());

        // Assert
        assertNotNull(response);
        assertEquals("Test Task", response.getTitle());
        verify(taskRepository, times(1)).findByIdAndProjectId(1L, 1L);
    }

    @Test
    void updateTask_Success() {
        // Arrange
        when(projectRepository.findByIdAndUserId(1L, user.getId())).thenReturn(Optional.of(project));
        when(taskRepository.findByIdAndProjectId(1L, 1L)).thenReturn(Optional.of(task));
        when(taskRepository.save(any(Task.class))).thenReturn(task);
        when(projectRepository.save(any(Project.class))).thenReturn(project);
        when(taskMapper.toResponse(any(Task.class))).thenReturn(taskResponse);

        // Act
        TaskResponse response = taskService.updateTask(1L, 1L, taskRequest, user.getId());

        // Assert
        assertNotNull(response);
        verify(taskRepository, times(1)).save(any(Task.class));
        verify(projectRepository, times(1)).save(any(Project.class));
    }

    @Test
    void markTaskAsCompleted_Success() {
        // Arrange
        when(projectRepository.findByIdAndUserId(1L, user.getId())).thenReturn(Optional.of(project));
        when(taskRepository.findByIdAndProjectId(1L, 1L)).thenReturn(Optional.of(task));
        when(taskRepository.save(any(Task.class))).thenReturn(task);
        when(projectRepository.save(any(Project.class))).thenReturn(project);
        when(taskMapper.toResponse(any(Task.class))).thenReturn(taskResponse);

        // Act
        TaskResponse response = taskService.markTaskAsCompleted(1L, 1L, user.getId());

        // Assert
        assertNotNull(response);
        verify(taskRepository, times(1)).save(any(Task.class));
        assertEquals(TaskStatus.COMPLETED, task.getStatus());
    }

    @Test
    void deleteTask_Success() {
        // Arrange
        when(projectRepository.findByIdAndUserId(1L, user.getId())).thenReturn(Optional.of(project));
        when(taskRepository.findByIdAndProjectId(1L, 1L)).thenReturn(Optional.of(task));
        doNothing().when(taskRepository).delete(any(Task.class));
        when(projectRepository.save(any(Project.class))).thenReturn(project);

        // Act
        taskService.deleteTask(1L, 1L, user.getId());

        // Assert
        verify(taskRepository, times(1)).delete(task);
        verify(projectRepository, times(1)).save(any(Project.class));
    }
}