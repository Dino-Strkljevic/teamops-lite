import { Box, Card, CardContent, Chip, Typography } from '@mui/material';
import type { Task, TaskPriority } from '../types';

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

interface Props {
  task: Task;
}

export default function TaskCard({ task }: Props) {
  return (
    <Card variant="outlined">
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
      </CardContent>
    </Card>
  );
}
