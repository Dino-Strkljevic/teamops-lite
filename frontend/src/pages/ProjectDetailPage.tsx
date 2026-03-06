import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  Alert,
  Box,
  Button,
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
import { projectKeys } from '../features/projects/hooks/useProjects';
import type { Project } from '../features/projects/types';
import CreateTaskDialog from '../features/tasks/components/CreateTaskDialog';
import KanbanBoard from '../features/tasks/components/KanbanBoard';

type SnackbarState = { open: boolean; severity: 'success' | 'error'; message: string };

const CLOSED_SNACKBAR: SnackbarState = { open: false, severity: 'success', message: '' };

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

      {!isLoading && !isError && (
        <KanbanBoard
          tasks={tasks ?? []}
          onSuccess={() => setSnackbar({ open: true, severity: 'success', message: 'Task updated.' })}
          onError={() => setSnackbar({ open: true, severity: 'error', message: 'Failed to update task. Please try again.' })}
          onEditSuccess={() => setSnackbar({ open: true, severity: 'success', message: 'Task saved.' })}
          onEditError={() => setSnackbar({ open: true, severity: 'error', message: 'Failed to save task. Please try again.' })}
          onDeleteSuccess={() => setSnackbar({ open: true, severity: 'success', message: 'Task deleted.' })}
          onDeleteError={() => setSnackbar({ open: true, severity: 'error', message: 'Failed to delete task. Please try again.' })}
        />
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
