package com.teamops.auth.service;

import com.teamops.auth.dto.AuthResponse;
import com.teamops.auth.dto.LoginRequest;
import com.teamops.auth.dto.MeResponse;
import com.teamops.auth.dto.RegisterRequest;
import com.teamops.security.JwtService;
import com.teamops.user.entity.User;
import com.teamops.user.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final AuthenticationManager authenticationManager;

  public AuthService(
      UserRepository userRepository,
      PasswordEncoder passwordEncoder,
      JwtService jwtService,
      AuthenticationManager authenticationManager) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
    this.authenticationManager = authenticationManager;
  }

  @Transactional
  public AuthResponse register(RegisterRequest request) {
    if (userRepository.existsByEmail(request.email())) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use");
    }

    User user = new User();
    user.setEmail(request.email().toLowerCase().strip());
    user.setDisplayName(request.displayName().strip());
    user.setPasswordHash(passwordEncoder.encode(request.password()));

    user = userRepository.save(user);

    String token = jwtService.generateToken(user.getId(), user.getEmail());
    return new AuthResponse(token, user.getId(), user.getEmail(), user.getDisplayName());
  }

  public AuthResponse login(LoginRequest request) {
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.email(), request.password()));

    User user =
        userRepository
            .findByEmail(request.email())
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

    String token = jwtService.generateToken(user.getId(), user.getEmail());
    return new AuthResponse(token, user.getId(), user.getEmail(), user.getDisplayName());
  }

  @Transactional(readOnly = true)
  public MeResponse me(String email) {
    User user =
        userRepository
            .findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    return MeResponse.from(user);
  }
}
