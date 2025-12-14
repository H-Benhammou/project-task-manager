package com.example.project_task_manager.service;

import com.example.project_task_manager.dto.AuthRequest;
import com.example.project_task_manager.dto.AuthResponse;
import com.example.project_task_manager.dto.RegisterRequest;
import com.example.project_task_manager.dto.UserDTO;
import com.example.project_task_manager.entity.User;
import com.example.project_task_manager.repository.UserRepository;
import com.example.project_task_manager.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return AuthResponse.builder()
                    .message("Email already exists")
                    .build();
        }

        var user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        userRepository.save(user);
        var jwtToken = jwtService.generateToken(user);

        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId().toString());
        userDTO.setName(user.getName());
        userDTO.setEmail(user.getEmail());

        return AuthResponse.builder()
                .token(jwtToken)
                .user(userDTO)
                .message("User registered successfully")
                .build();
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();
        var jwtToken = jwtService.generateToken(user);

        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId().toString());
        userDTO.setName(user.getName());
        userDTO.setEmail(user.getEmail());

        return AuthResponse.builder()
                .token(jwtToken)
                .user(userDTO)
                .message("Login successful")
                .build();
    }
}
