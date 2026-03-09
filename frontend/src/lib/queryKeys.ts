/**
 * Centralised React Query key factory.
 *
 * Usage:
 *   queryKeys.projects.all()          // ['projects']
 *   queryKeys.projects.list()         // ['projects', 'list']
 *   queryKeys.projects.detail(id)     // ['projects', 'detail', id]
 *
 *   queryKeys.tasks.all()             // ['tasks']
 *   queryKeys.tasks.byProject(pid)    // ['tasks', 'project', pid]
 *   queryKeys.tasks.detail(tid)       // ['tasks', 'detail', tid]
 */
export const queryKeys = {
  projects: {
    all:    ()         => ['projects']                      as const,
    list:   ()         => ['projects', 'list']              as const,
    detail: (id: string) => ['projects', 'detail', id]     as const,
  },

  tasks: {
    all:       ()              => ['tasks']                         as const,
    byProject: (projectId: string) => ['tasks', 'project', projectId] as const,
    detail:    (taskId: string)    => ['tasks', 'detail', taskId]      as const,
  },
} as const;
