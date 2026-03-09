package com.teamops.org.entity;

import com.teamops.common.entity.Auditable;
import com.teamops.common.enums.OrgRole;
import com.teamops.user.entity.User;
import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(
    name = "org_memberships",
    uniqueConstraints = @UniqueConstraint(columnNames = {"org_id", "user_id"}))
public class OrgMembership extends Auditable {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "org_id", nullable = false)
  private Org org;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private OrgRole role;

  public OrgMembership() {}

  public UUID getId() {
    return id;
  }

  public Org getOrg() {
    return org;
  }

  public void setOrg(Org org) {
    this.org = org;
  }

  public User getUser() {
    return user;
  }

  public void setUser(User user) {
    this.user = user;
  }

  public OrgRole getRole() {
    return role;
  }

  public void setRole(OrgRole role) {
    this.role = role;
  }
}
