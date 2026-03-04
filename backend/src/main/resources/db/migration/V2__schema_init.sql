-- ============================================================
-- V2: Full schema init for TeamOps Lite
-- ============================================================

-- -------------------------
-- USERS
-- -------------------------
CREATE TABLE users (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    email         TEXT        NOT NULL UNIQUE,
    display_name  TEXT        NOT NULL,
    password_hash TEXT        NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -------------------------
-- ORGS
-- -------------------------
CREATE TABLE orgs (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name       TEXT        NOT NULL,
    slug       TEXT        NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -------------------------
-- ORG MEMBERSHIPS
-- -------------------------
CREATE TABLE org_memberships (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id     UUID        NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role       TEXT        NOT NULL CHECK (role IN ('OWNER', 'ADMIN', 'MEMBER')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (org_id, user_id)
);

CREATE INDEX idx_org_memberships_user_id ON org_memberships(user_id);

-- -------------------------
-- PROJECTS
-- -------------------------
CREATE TABLE projects (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id      UUID        NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    name        TEXT        NOT NULL,
    description TEXT,
    created_by  UUID        REFERENCES users(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_projects_org_id ON projects(org_id);

-- -------------------------
-- TASKS
-- -------------------------
CREATE TABLE tasks (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id      UUID        NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    project_id  UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title       TEXT        NOT NULL,
    description TEXT,
    status      TEXT        NOT NULL CHECK (status IN ('TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED')),
    priority    TEXT        NOT NULL CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    due_date    DATE,
    assignee_id UUID        REFERENCES users(id) ON DELETE SET NULL,
    created_by  UUID        NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_tasks_org_project     ON tasks(org_id, project_id);
CREATE INDEX idx_tasks_org_assignee    ON tasks(org_id, assignee_id);
CREATE INDEX idx_tasks_org_status_due  ON tasks(org_id, status, due_date);

-- -------------------------
-- TASK COMMENTS
-- -------------------------
CREATE TABLE task_comments (
    id        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id   UUID        NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    org_id    UUID        NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    author_id UUID        NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    body      TEXT        NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_task_comments_task_id ON task_comments(task_id);

-- -------------------------
-- ATTACHMENTS
-- -------------------------
CREATE TABLE attachments (
    id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id       UUID        NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    task_id      UUID        NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    uploaded_by  UUID        NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    file_name    TEXT        NOT NULL,
    mime_type    TEXT        NOT NULL,
    size_bytes   BIGINT      NOT NULL,
    storage_key  TEXT        NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_attachments_task_id ON attachments(task_id);

-- -------------------------
-- NOTIFICATIONS
-- -------------------------
CREATE TABLE notifications (
    id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id       UUID        NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    recipient_id UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    entity_type  TEXT        NOT NULL,
    entity_id    UUID        NOT NULL,
    message      TEXT        NOT NULL,
    is_read      BOOLEAN     NOT NULL DEFAULT false,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_recipient ON notifications(recipient_id, is_read, created_at DESC);
