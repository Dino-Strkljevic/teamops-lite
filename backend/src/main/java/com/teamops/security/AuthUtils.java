package com.teamops.security;

import com.teamops.user.repository.UserRepository;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class AuthUtils {

  private final UserRepository userRepository;

  public AuthUtils(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public UUID currentUserId() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null || !auth.isAuthenticated()) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
    }
    String email = auth.getName();
    return userRepository
        .findByEmail(email)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"))
        .getId();
  }
}
