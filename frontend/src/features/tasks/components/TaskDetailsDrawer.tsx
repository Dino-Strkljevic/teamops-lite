import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import CloseIcon          from '@mui/icons-material/Close';
import DeleteOutlineIcon  from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon   from '@mui/icons-material/EditOutlined';
import ArrowBackIcon      from '@mui/icons-material/ArrowBack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver }         from '@hookform/resolvers/zod';
import { z }                   from 'zod';
import type { Task, TaskPriority, TaskStatus } from '../types';
import { useEditTask }   from '../hooks/useEditTask';

// ── Constants ──────────────────────────────────────────────────────────────────

const DRAWER_WIDTH = 400;

const PRIORITIES: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

const PRIORITY_LABEL: Record<TaskPriority, string> = {
  LOW:      'Low',
  MEDIUM:   'Medium',
  HIGH:     'High',
  CRITICAL: 'Critical',
};

const PRIORITY_COLOR: Record<TaskPriority, 'default' | 'success' | 'warning' | 'error'> = {
  LOW:      'success',
  MEDIUM:   'default',
  HIGH:     'warning',
  CRITICAL: 'error',
};

const STATUS_LABEL: Record<TaskStatus, string> = {
  TODO:        'To Do',
  IN_PROGRESS: 'In Progress',
  DONE:        'Done',
  CANCELLED:   'Cancelled',
};

const STATUS_COLOR: Record<TaskStatus, 'default' | 'info' | 'success' | 'error'> = {
  TODO:        'default',
  IN_PROGRESS: 'info',
  DONE:        'success',
  CANCELLED:   'error',
};

const editSchema = z.object({
  title:       z.string().min(1, 'Title is required').max(255, 'Title must be 255 characters or fewer'),
  description: z.string().optional(),
  priority:    z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  dueDate:     z.string().optional(),
});

type EditFormValues = z.infer<typeof editSchema>;

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatDateTime(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

/**
 * Normalise an ISO timestamp or YYYY-MM-DD string to the "YYYY-MM-DD" format
 * that <input type="date"> requires. Returns '' when the value is absent.
 */
function toDateInputValue(iso: string | null | undefined): string {
  if (!iso) return '';
  // Timestamps like "2025-03-06T00:00:00Z" → slice to 10 chars
  return iso.slice(0, 10);
}

interface DetailRowProps {
  label:    string;
  children: React.ReactNode;
}

function DetailRow({ label, children }: DetailRowProps) {
  return (
    <Box>
      <Typography
        variant="caption"
        color="text.secondary"
        fontWeight={600}
        sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}
      >
        {label}
      </Typography>
      <Box sx={{ mt: 0.5 }}>{children}</Box>
    </Box>
  );
}

interface ViewPanelProps {
  task:     Task;
  onEdit:   () => void;
  onDelete: () => void;
}

function ViewPanel({ task, onEdit, onDelete }: ViewPanelProps) {
  const formattedDue       = formatDate(task.dueDate);
  const formattedCreatedAt = formatDateTime(task.createdAt);
  const formattedUpdatedAt = formatDateTime(task.updatedAt);

  return (
    <>
      {/* Scrollable body */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 2.5 }}>
        <Stack spacing={3}>

          {/* Status + Priority */}
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <DetailRow label="Status">
              <Chip
                label={STATUS_LABEL[task.status]}
                color={STATUS_COLOR[task.status]}
                size="small"
              />
            </DetailRow>

            <DetailRow label="Priority">
              <Chip
                label={PRIORITY_LABEL[task.priority]}
                color={PRIORITY_COLOR[task.priority]}
                size="small"
                variant="outlined"
              />
            </DetailRow>
          </Box>

          {/* Description */}
          <DetailRow label="Description">
            {task.description ? (
              <Typography variant="body2" color="text.primary" sx={{ whiteSpace: 'pre-wrap' }}>
                {task.description}
              </Typography>
            ) : (
              <Typography variant="body2" color="text.disabled" fontStyle="italic">
                No description provided.
              </Typography>
            )}
          </DetailRow>

          {/* Due date */}
          {formattedDue && (
            <DetailRow label="Due Date">
              <Typography variant="body2">{formattedDue}</Typography>
            </DetailRow>
          )}

          <Divider />

          {/* Timestamps */}
          <Stack spacing={1.5}>
            {formattedCreatedAt && (
              <DetailRow label="Created">
                <Typography variant="body2" color="text.secondary">
                  {formattedCreatedAt}
                </Typography>
              </DetailRow>
            )}
            {formattedUpdatedAt && (
              <DetailRow label="Last Updated">
                <Typography variant="body2" color="text.secondary">
                  {formattedUpdatedAt}
                </Typography>
              </DetailRow>
            )}
          </Stack>

        </Stack>
      </Box>

      {/* Footer */}
      <Divider />
      <Box sx={{ display: 'flex', gap: 1.5, px: 3, py: 2 }}>
        <Button
          variant="contained"
          startIcon={<EditOutlinedIcon />}
          onClick={onEdit}
          fullWidth
        >
          Edit Task
        </Button>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteOutlineIcon />}
          onClick={onDelete}
          fullWidth
        >
          Delete Task
        </Button>
      </Box>
    </>
  );
}

interface EditPanelProps {
  task:      Task;
  onCancel:  () => void;
  onSuccess: (updated: Task) => void;
  onError:   () => void;
}

function EditPanel({ task, onCancel, onSuccess, onError }: EditPanelProps) {
  const { mutate, isPending } = useEditTask();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      title:       task.title,
      description: task.description ?? '',
      priority:    task.priority,
      dueDate:     toDateInputValue(task.dueDate),
    },
  });

  function onSubmit(values: EditFormValues) {
    mutate(
      {
        taskId:    task.id,
        projectId: task.projectId,
        body: {
          title:       values.title,
          description: values.description?.trim() || null,
          priority:    values.priority,
          dueDate:     values.dueDate || null,
        },
      },
      {
        onSuccess: (updated) => onSuccess(updated),
        onError:   ()        => onError(),
      },
    );
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}
    >
      {/* Scrollable fields */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 2.5 }}>
        <Stack spacing={2.5}>

          <TextField
            label="Title"
            required
            fullWidth
            autoFocus
            {...register('title')}
            error={!!errors.title}
            helperText={errors.title?.message}
            disabled={isPending}
          />

          <TextField
            label="Description"
            fullWidth
            multiline
            minRows={4}
            {...register('description')}
            error={!!errors.description}
            helperText={errors.description?.message}
            disabled={isPending}
          />

          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Priority"
                fullWidth
                error={!!errors.priority}
                helperText={errors.priority?.message}
                disabled={isPending}
              >
                {PRIORITIES.map((p) => (
                  <MenuItem key={p} value={p}>
                    {PRIORITY_LABEL[p]}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <TextField
            label="Due Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            {...register('dueDate')}
            error={!!errors.dueDate}
            helperText={errors.dueDate?.message}
            disabled={isPending}
          />

        </Stack>
      </Box>

      {/* Footer */}
      <Divider />
      <Box sx={{ display: 'flex', gap: 1.5, px: 3, py: 2 }}>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isPending}
          startIcon={isPending ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          {isPending ? 'Saving…' : 'Save Changes'}
        </Button>
        <Button
          variant="outlined"
          fullWidth
          disabled={isPending}
          onClick={onCancel}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
}


export interface TaskDetailsDrawerProps {
  task:            Task | null;
  onClose:         () => void;
  onDelete:        () => void;
  onEditSuccess:   (updated: Task) => void;
  onEditError:     () => void;
}

export default function TaskDetailsDrawer({
  task,
  onClose,
  onDelete,
  onEditSuccess,
  onEditError,
}: TaskDetailsDrawerProps) {
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setIsEditing(false);
  }, [task]);

  const open = task !== null;

  function handleClose() {
    setIsEditing(false);
    onClose();
  }

  function handleEditSuccess(updated: Task) {
    setIsEditing(false);
    onEditSuccess(updated);
  }

  const drawerTitle = isEditing ? 'Edit Task' : (task?.title ?? '');

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width:         { xs: '100vw', sm: DRAWER_WIDTH },
          display:       'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* ── Header (always visible) ── */}
      <Box
        sx={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          px: 3,
          pt: 2.5,
          pb: 1.5,
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
          {isEditing && (
            <Tooltip title="Back to details">
              <IconButton
                size="small"
                onClick={() => setIsEditing(false)}
                sx={{ mr: 0.5, flexShrink: 0 }}
              >
                <ArrowBackIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              lineHeight:   1.4,
              overflow:     'hidden',
              textOverflow: 'ellipsis',
              whiteSpace:   'nowrap',
            }}
          >
            {drawerTitle}
          </Typography>
        </Box>

        <Tooltip title="Close">
          <IconButton onClick={handleClose} size="small" sx={{ flexShrink: 0, ml: 1 }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Divider sx={{ flexShrink: 0 }} />

      {/* ── Body (swaps between view and edit) ── */}
      {task && (
        isEditing ? (
          <EditPanel
            task={task}
            onCancel={() => setIsEditing(false)}
            onSuccess={handleEditSuccess}
            onError={onEditError}
          />
        ) : (
          <ViewPanel
            task={task}
            onEdit={() => setIsEditing(true)}
            onDelete={onDelete}
          />
        )
      )}
    </Drawer>
  );
}
