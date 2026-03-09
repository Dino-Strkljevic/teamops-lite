export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE" | "CANCELLED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface Task {
  id: string;
  orgId: string;
  projectId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  assigneeId: string | null;
  createdById: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskBody {
  projectId: string;
  title: string;
  description: string | null;
  priority: TaskPriority;
  dueDate: string | null;
}

export interface UpdateTaskBody {
  title: string;
  description: string | null;
  priority: TaskPriority;
  dueDate: string | null;
}

export interface Comment {
  id: string;
  taskId: string;
  orgId: string;
  authorId: string;
  authorDisplayName: string;
  body: string;
  createdAt: string;
}
