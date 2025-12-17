package com.example.project_task_manager.repository;

import com.example.project_task_manager.entity.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project,Long> {

    List<Project> findByUserId(Long userId);

    Page<Project> findPageByUserId(Long userId, Pageable pageable);

    Optional<Project> findByIdAndUserId(Long id, Long userId);

    @Query("SELECT p FROM Project p WHERE p.user.id = :userId " +
            "AND p.lastModifiedDate >= :since " +
            "ORDER BY p.lastModifiedDate DESC")
    List<Project> findRecentlyModifiedProjects(
            @Param("userId") Long userId,
            @Param("since") LocalDateTime since
    );
}
