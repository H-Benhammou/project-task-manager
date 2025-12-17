package com.example.project_task_manager.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "projects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    @Column(name = "creation_date", updatable = false)
    private LocalDateTime creationDate;

    @Column(name = "last_modified_date")
    private LocalDateTime lastModifiedDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Task> tasks;

    // Method to update last modified date when a task is modified
    public void updateLastModifiedDate() {
        this.lastModifiedDate = LocalDateTime.now();
    }

    // Helper method to calculate progress
    public int getTotalTasks() {
        return tasks != null ? tasks.size() : 0;
    }

    public int getCompletedTasks() {
        return tasks != null ? (int) tasks.stream()
                .filter(task -> task.getStatus() == TaskStatus.COMPLETED)
                .count() : 0;
    }

    public double getProgressPercentage() {
        int total = getTotalTasks();
        if (total == 0) return 0.0;
        double percentage =  (getCompletedTasks() * 100.0) / total;
        return Math.round(percentage * 10.0) / 10.0;
    }

    @PrePersist
    protected void onCreate() {
        this.creationDate = LocalDateTime.now();
        this.lastModifiedDate = LocalDateTime.now();
    }
}
