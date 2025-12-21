package com.example.project_task_manager.service;

import com.example.project_task_manager.dto.TaskRequest;
import com.example.project_task_manager.dto.TaskResponse;
import com.example.project_task_manager.entity.Project;
import com.example.project_task_manager.entity.Task;
import com.example.project_task_manager.entity.TaskStatus;
import com.example.project_task_manager.mapper.TaskMapper;
import com.example.project_task_manager.repository.ProjectRepository;
import com.example.project_task_manager.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final TaskMapper taskMapper;

    @Transactional
    public TaskResponse createTask(Long projectId, TaskRequest request, Long userId) {
        Project project = projectRepository.findByIdAndUserId(projectId, userId)
                .orElseThrow(() -> new RuntimeException("Project not found or access denied"));

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .dueDate(request.getDueDate())
                .status(TaskStatus.IN_PROGRESS)
                .project(project)
                .build();

        Task savedTask = taskRepository.save(task);

        // Update project's last modified date
        project.updateLastModifiedDate();
        projectRepository.save(project);

        return taskMapper.toResponse(savedTask);
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> getAllProjectTasks(Long projectId, Long userId) {
        // Verify user owns the project
        projectRepository.findByIdAndUserId(projectId, userId)
                .orElseThrow(() -> new RuntimeException("Project not found or access denied"));

        List<Task> tasks = taskRepository.findByProjectId(projectId);
        return tasks.stream()
                .map(taskMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<TaskResponse> getProjectTasksPage(Long projectId, Long userId, Pageable pageable) {
        // Verify user owns the project
        projectRepository.findByIdAndUserId(projectId, userId)
                .orElseThrow(() -> new RuntimeException("Project not found or access denied"));

        Page<Task> tasks = taskRepository.findByProjectId(projectId, pageable);
        return tasks.map(taskMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public TaskResponse getTaskById(Long projectId, Long taskId, Long userId) {
        // Verify user owns the project
        projectRepository.findByIdAndUserId(projectId, userId)
                .orElseThrow(() -> new RuntimeException("Project not found or access denied"));

        Task task = taskRepository.findByIdAndProjectId(taskId, projectId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        return taskMapper.toResponse(task);
    }

    @Transactional
    public TaskResponse updateTask(Long projectId, Long taskId, TaskRequest request, Long userId) {
        // Verify user owns the project
        Project project = projectRepository.findByIdAndUserId(projectId, userId)
                .orElseThrow(() -> new RuntimeException("Project not found or access denied"));

        Task task = taskRepository.findByIdAndProjectId(taskId, projectId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());

        Task updatedTask = taskRepository.save(task);

        // Update project's last modified date
        project.updateLastModifiedDate();
        projectRepository.save(project);

        return taskMapper.toResponse(updatedTask);
    }

    @Transactional
    public TaskResponse markTaskAsCompleted(Long projectId, Long taskId, Long userId) {
        // Verify user owns the project
        Project project = projectRepository.findByIdAndUserId(projectId, userId)
                .orElseThrow(() -> new RuntimeException("Project not found or access denied"));

        Task task = taskRepository.findByIdAndProjectId(taskId, projectId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setStatus(TaskStatus.COMPLETED);
        Task updatedTask = taskRepository.save(task);

        // Update project's last modified date
        project.updateLastModifiedDate();
        projectRepository.save(project);

        return taskMapper.toResponse(updatedTask);
    }

    @Transactional
    public void deleteTask(Long projectId, Long taskId, Long userId) {
        // Verify user owns the project
        Project project = projectRepository.findByIdAndUserId(projectId, userId)
                .orElseThrow(() -> new RuntimeException("Project not found or access denied"));

        Task task = taskRepository.findByIdAndProjectId(taskId, projectId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        taskRepository.delete(task);

        // Update project's last modified date
        project.updateLastModifiedDate();
        projectRepository.save(project);
    }
}