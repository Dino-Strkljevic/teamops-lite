import { Box, Button, Card, CardContent, Chip, Typography } from '@mui/material';
import type { Task, TaskPriority, TaskStatus } from '../types';
import { useUpdateTaskStatus } from '../hooks/useUpdateTaskStatus';

const PRIORITY_COLOR: Record<TaskPriority, 'default' | 'success' | 'warning' | 'error'> = {
  LOW:      'success',
  MEDIUM:   'default',
  HIGH:     'warning',
  CRITICAL: 'error',
};

const PRIORITY_LABEL: Record<TaskPriority, string> = {
  LOW:      'Low',
  MEDIUM:   'Medium',
  HIGH:     'High',
  CRITICAL: 'Critical',
};

const NEXT_STATUS: Partial<Record<TaskStatus, TaskStatus>> = {
  TODO:        'IN_PROGRESS',
  IN_PROGRESS: 'DONE',
};

const ACTION_LABEL: Partial<Record<TaskStatus, string>> = {
  TODO:        'Start Task',
  IN_PROGRESS: 'Mark Done',
};

interface Props {
  task:          Task;
  onSuccess:     () => void;
  onError:       () => void;
  onViewDetails: (task: Task) => void;
}

export default function TaskCard({ task, onSuccess, onError, onViewDetails }: Props) {
  const { mutate, isPending } = useUpdateTaskStatus();

  const nextStatus = NEXT_STATUS[task.status];
  const actionLabel = ACTION_LABEL[task.status];

  function handleAction() {
    if (!nextStatus) return;
    mutate(
      { taskId: task.id, projectId: task.projectId, status: nextStatus },
      { onSuccess, onError },
    );
  }

  return (
    <Card
      variant="outlined"
      onClick={() => onViewDetails(task)}
      sx={{ cursor: 'pointer', '&:hover': { borderColor: 'primary.main', boxShadow: 1 } }}
    >
      <CardContent sx={{ '&:last-child': { pb: 2 } }}>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.5 }}>
          {task.title}
        </Typography>

        {task.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {task.description}
          </Typography>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
          <Chip
            label={PRIORITY_LABEL[task.priority]}
            color={PRIORITY_COLOR[task.priority]}
            size="small"
            variant="outlined"
          />
          {task.dueDate && (
            <Typography variant="caption" color="text.secondary">
              {task.dueDate}
            </Typography>
          )}
        </Box>

        {actionLabel && (
          <Button
            size="small"
            variant="outlined"
            fullWidth
            sx={{ mt: 1.5 }}
            disabled={isPending}
            onClick={(e) => { e.stopPropagation(); handleAction(); }}
          >
            {isPending ? '…' : actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
