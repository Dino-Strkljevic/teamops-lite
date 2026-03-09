package com.teamops.common.util;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public final class EntityLookup {

    private EntityLookup() {}

    public static <T> T findById(JpaRepository<T, UUID> repository, UUID id, String entityName) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(entityName + " not found: " + id));
    }
}
