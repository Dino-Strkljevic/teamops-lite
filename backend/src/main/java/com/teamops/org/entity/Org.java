package com.teamops.org.entity;

import com.teamops.common.entity.Auditable;
import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "orgs")
public class Org extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    public Org() {}

    public UUID getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
}
