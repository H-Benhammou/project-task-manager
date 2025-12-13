package com.example.project_task_manager.dto;

import lombok.Data;

@Data
public class AuthRequest {
    private String email;
    private String password;
}
