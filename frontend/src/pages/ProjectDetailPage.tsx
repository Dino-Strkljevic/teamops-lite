import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Snackbar,
  Tooltip,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import { useTasks } from '../features/tasks/hooks/useTasks';
import type { TaskPriority, TaskStatus } from '../features/tasks/types';
import { projectKeys } from '../features/projects/hooks/useProjects';
import type { Project } from '../features/projects/types';
import CreateTaskDialog from '../features/tasks/components/CreateTaskDialog';

type SnackbarState = { open: boolean; severity: 'success' | 'error'; message: string };

const CLOSED_SNACKBAR: SnackbarState = { open: false, severity: 'success', message: '' };

const STATUS_COLOR: Record<TaskStatus, 'default' | 'info' | 'success' | 'error'> = {
  TODO:        'default',
  IN_PROGRESS: 'info',
  DONE:        'success',
  CANCELLED:   'error',
};

const STATUS_LABEL: Record<TaskStatus, string> = {
  TODO:        'To Do',
  IN_PROGRESS: 'In Progress',
  DONE:        'Done',
  CANCELLED:   'Cancelled',
};

const PRIORITY_COLOR: Record<TaskPriority, 'default' | 'warning' | 'error' | 'success'> = {
  LOW:      'success',
  MEDIUM:   'default',
  HIGH:     'warning',
  CRITICAL: 'error',
};

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>(CLOSED_SNACKBAR);

  const projectName = queryClient
    .getQueryData<Project[]>(projectKeys.list())
    ?.find((p) => p.id === projectId)
    ?.name ?? 'Project';

  const { data: tasks, isLoading, isError } = useTasks(projectId!);

  function handleSuccess() {
    setDialogOpen(false);
    setSnackbar({ open: true, severity: 'success', message: 'Task created.' });
  }

  function handleError() {
    setSnackbar({ open: true, severity: 'error', message: 'Failed to create task. Please try again.' });
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Back to Projects">
            <IconButton onClick={() => navigate('/projects')} size="small">
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="h5">{projectName}</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
        >
          New Task
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {isError && (
        <Alert severity="error">Failed to load tasks.</Alert>
      )}

      {!isLoading && !isError && tasks?.length === 0 && (
        <Typography color="text.secondary">No tasks yet.</Typography>
      )}

      {tasks && tasks.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {tasks.map((task) => (
            <Card key={task.id} variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {task.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                    <Chip
                      label={STATUS_LABEL[task.status]}
                      color={STATUS_COLOR[task.status]}
                      size="small"
                    />
                    <Chip
                      label={task.priority}
                      color={PRIORITY_COLOR[task.priority]}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </Box>

                {task.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {task.description}
                  </Typography>
                )}

                {task.dueDate && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Due: {task.dueDate}
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
      <CreateTaskDialog
        open={dialogOpen}
        projectId={projectId!}
        onClose={() => setDialogOpen(false)}
        onSuccess={handleSuccess}
        onError={handleError}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(CLOSED_SNACKBAR)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar(CLOSED_SNACKBAR)}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
