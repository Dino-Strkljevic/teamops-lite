import type { TaskPriority, TaskStatus } from '../types/task';

// ── Task status ────────────────────────────────────────────────────────────────

export const TASK_STATUSES: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED'];

export const STATUS_LABEL: Record<TaskStatus, string> = {
  TODO:        'To Do',
  IN_PROGRESS: 'In Progress',
  DONE:        'Done',
  CANCELLED:   'Cancelled',
};

export const STATUS_COLOR: Record<TaskStatus, 'default' | 'info' | 'success' | 'error'> = {
  TODO:        'default',
  IN_PROGRESS: 'info',
  DONE:        'success',
  CANCELLED:   'error',
};

// ── Task priority ──────────────────────────────────────────────────────────────

export const TASK_PRIORITIES: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

export const PRIORITY_LABEL: Record<TaskPriority, string> = {
  LOW:      'Low',
  MEDIUM:   'Medium',
  HIGH:     'High',
  CRITICAL: 'Critical',
};

export const PRIORITY_COLOR: Record<TaskPriority, 'default' | 'success' | 'warning' | 'error'> = {
  LOW:      'success',
  MEDIUM:   'default',
  HIGH:     'warning',
  CRITICAL: 'error',
};
