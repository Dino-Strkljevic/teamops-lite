import { Box, Stack, Typography } from '@mui/material';
import type { Task, TaskStatus } from '../types';
import TaskCard from './TaskCard';

interface Column {
  status: TaskStatus;
  label:  string;
  color:  string;
}

const COLUMNS: Column[] = [
  { status: 'TODO',        label: 'To Do',       color: 'text.secondary' },
  { status: 'IN_PROGRESS', label: 'In Progress',  color: 'info.main'      },
  { status: 'DONE',        label: 'Done',         color: 'success.main'   },
];

interface Props {
  tasks: Task[];
}

export default function KanbanBoard({ tasks }: Props) {
  const byStatus = (status: TaskStatus) => tasks.filter((t) => t.status === status);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 2,
        alignItems: 'start',
      }}
    >
      {COLUMNS.map(({ status, label, color }) => {
        const columnTasks = byStatus(status);

        return (
          <Box
            key={status}
            sx={{
              bgcolor: 'grey.50',
              borderRadius: 2,
              p: 1.5,
              minHeight: 200,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <Typography variant="subtitle2" fontWeight={700} color={color}>
                {label}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  bgcolor: 'grey.200',
                  borderRadius: 10,
                  px: 0.75,
                  py: 0.25,
                  fontWeight: 600,
                  lineHeight: 1.6,
                }}
              >
                {columnTasks.length}
              </Typography>
            </Box>

            <Stack spacing={1.5}>
              {columnTasks.length === 0 ? (
                <Typography variant="caption" color="text.disabled" sx={{ px: 0.5 }}>
                  No tasks
                </Typography>
              ) : (
                columnTasks.map((task) => <TaskCard key={task.id} task={task} />)
              )}
            </Stack>
          </Box>
        );
      })}
    </Box>
  );
}
