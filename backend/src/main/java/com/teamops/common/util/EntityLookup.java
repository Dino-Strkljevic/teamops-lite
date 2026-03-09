package com.teamops.common.util;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public final class EntityLookup {

  private EntityLookup() {}

  public static <T> T findById(JpaRepository<T, UUID> repository, UUID id, String entityName) {
    return repository
        .findById(id)
        .orElseThrow(() -> new IllegalArgumentException(entityName + " not found: " + id));
  }
}
