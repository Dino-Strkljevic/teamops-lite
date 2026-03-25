package com.teamops.auth.controller;

import com.teamops.auth.dto.AuthResponse;
import com.teamops.auth.dto.LoginRequest;
import com.teamops.auth.dto.MeResponse;
import com.teamops.auth.dto.RegisterRequest;
import com.teamops.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

  private final AuthService authService;

  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  @PostMapping("/register")
  @ResponseStatus(HttpStatus.CREATED)
  public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
    return authService.register(request);
  }

  @PostMapping("/login")
  public AuthResponse login(@Valid @RequestBody LoginRequest request) {
    return authService.login(request);
  }

  @GetMapping("/me")
  public MeResponse me(@AuthenticationPrincipal UserDetails principal) {
    return authService.me(principal.getUsername());
  }
}
