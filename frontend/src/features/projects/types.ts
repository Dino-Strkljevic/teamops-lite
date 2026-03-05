export interface Project {
  id: string;          // UUID
  orgId: string;       // UUID
  name: string;
  description: string | null;
  createdById: string | null; // UUID — nullable when created without a user
  createdAt: string;   // ISO-8601 instant
  updatedAt: string;   // ISO-8601 instant
}
