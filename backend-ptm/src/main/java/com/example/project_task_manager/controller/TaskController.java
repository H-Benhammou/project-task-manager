package com.example.project_task_manager.controller;

import com.example.project_task_manager.dto.TaskRequest;
import com.example.project_task_manager.dto.TaskResponse;
import com.example.project_task_manager.entity.User;
import com.example.project_task_manager.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects/{projectId}/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(
            @PathVariable Long projectId,
            @RequestBody TaskRequest request,
            @AuthenticationPrincipal User user) {
        TaskResponse response = taskService.createTask(projectId, request, user.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getAllTasks(
            @PathVariable Long projectId,
            @AuthenticationPrincipal User user) {
        List<TaskResponse> tasks = taskService.getAllProjectTasks(projectId, user.getId());
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{taskId}")
    public ResponseEntity<TaskResponse> getTask(
            @PathVariable Long projectId,
            @PathVariable Long taskId,
            @AuthenticationPrincipal User user) {
        TaskResponse response = taskService.getTaskById(projectId, taskId, user.getId());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable Long projectId,
            @PathVariable Long taskId,
            @RequestBody TaskRequest request,
            @AuthenticationPrincipal User user) {
        TaskResponse response = taskService.updateTask(projectId, taskId, request, user.getId());
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{taskId}/complete")
    public ResponseEntity<TaskResponse> markTaskAsCompleted(
            @PathVariable Long projectId,
            @PathVariable Long taskId,
            @AuthenticationPrincipal User user) {
        TaskResponse response = taskService.markTaskAsCompleted(projectId, taskId, user.getId());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long projectId,
            @PathVariable Long taskId,
            @AuthenticationPrincipal User user) {
        taskService.deleteTask(projectId, taskId, user.getId());
        return ResponseEntity.noContent().build();
    }
}
