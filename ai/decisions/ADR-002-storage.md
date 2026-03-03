# ADR-002: File storage approach (S3-compatible)

## Status
Accepted

## Context
We need file uploads for task attachments. Storing files in Postgres is not ideal.

## Decision
Use S3-compatible object storage:
- Local: MinIO via docker-compose
- Production: real S3-compatible provider
Store only metadata in Postgres.

## Alternatives considered
- Store files in Postgres (bloat, backup complexity).
- Store files on app server disk (harder to scale).

## Consequences
- Requires object storage client and configuration
- Clean separation and production realism