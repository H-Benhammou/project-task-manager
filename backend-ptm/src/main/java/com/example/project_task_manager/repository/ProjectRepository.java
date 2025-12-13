package com.example.project_task_manager.repository;

import com.example.project_task_manager.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project,Long> {

    List<Project> findByUserId(Long userId);
    Optional<Project> findByIdAndUserId(Long id, Long userId);
}
