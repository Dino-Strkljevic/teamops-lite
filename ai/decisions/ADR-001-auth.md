# ADR-001: Authentication approach (JWT + refresh)

## Status
Accepted

## Context
We need secure authentication for a web app with a React frontend and Spring Boot backend.

## Decision
Use short-lived JWT access tokens and refresh tokens stored in an httpOnly cookie.
Frontend uses access token for API calls; refresh endpoint issues a new access token when needed.

## Alternatives considered
- Store refresh token in localStorage (simpler, weaker against XSS).
- Session-based auth (more server state, CSRF considerations).

## Consequences
- Slightly more implementation work, but better security posture and more “production-like”.