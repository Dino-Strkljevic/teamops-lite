package com.teamops.auth.dto;

import com.teamops.user.entity.User;
import java.time.Instant;
import java.util.UUID;

public record MeResponse(UUID id, String email, String displayName, Instant createdAt) {

  public static MeResponse from(User user) {
    return new MeResponse(
        user.getId(), user.getEmail(), user.getDisplayName(), user.getCreatedAt());
  }
}
