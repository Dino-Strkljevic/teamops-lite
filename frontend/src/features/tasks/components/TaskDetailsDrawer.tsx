import { useEffect, useState } from 'react';
import {
  Alert,
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
import CloseIcon         from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon  from '@mui/icons-material/EditOutlined';
import ArrowBackIcon     from '@mui/icons-material/ArrowBack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver }         from '@hookform/resolvers/zod';
import { z }                   from 'zod';
import type { Task } from '../types';
import { useEditTask }      from '../hooks/useEditTask';
import { useComments }      from '../hooks/useComments';
import { useCreateComment } from '../hooks/useCreateComment';
import DeleteTaskDialog  from './DeleteTaskDialog';
import {
  TASK_PRIORITIES,
  PRIORITY_LABEL,
  PRIORITY_COLOR,
  STATUS_LABEL,
  STATUS_COLOR,
} from '../../../lib/constants';

const DRAWER_WIDTH = 400;

const editSchema = z.object({
  title:       z.string().min(1, 'Title is required').max(255, 'Title must be 255 characters or fewer'),
  description: z.string().optional(),
  priority:    z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  dueDate:     z.string().optional(),
});

type EditFormValues = z.infer<typeof editSchema>;

const commentSchema = z.object({
  body: z.string().min(1, 'Comment cannot be empty').max(10_000, 'Comment is too long'),
});

type CommentFormValues = z.infer<typeof commentSchema>;

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

function toDateInputValue(iso: string | null | undefined): string {
  if (!iso) return '';
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

interface CommentsSectionProps {
  taskId: string;
}

function CommentsSection({ taskId }: CommentsSectionProps) {
  const { data: comments, isLoading, isError } = useComments(taskId);
  const { mutate, isPending } = useCreateComment(taskId);
  const [postError, setPostError] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);

  useEffect(() => {
    if (!postSuccess) return;
    const timer = setTimeout(() => setPostSuccess(false), 3000);
    return () => clearTimeout(timer);
  }, [postSuccess]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: { body: '' },
  });

  function onSubmit(values: CommentFormValues) {
    setPostError(false);
    setPostSuccess(false);
    mutate(
      { body: values.body },
      {
        onSuccess: () => {
          reset();
          setPostSuccess(true);
        },
        onError: () => {
          setPostError(true);
        },
      },
    );
  }

  return (
    <Box>
      <Divider />

      <Box sx={{ px: 3, pt: 2.5, pb: 1 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight={600}
          sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}
        >
          Comments
        </Typography>
      </Box>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <CircularProgress size={20} />
        </Box>
      )}

      {isError && (
        <Box sx={{ px: 3, pb: 1 }}>
          <Alert severity="error" variant="outlined" sx={{ fontSize: '0.8rem' }}>
            Failed to load comments.
          </Alert>
        </Box>
      )}

      {!isLoading && !isError && (
        <Stack spacing={1.5} sx={{ mx: 3, mb: 2 }}>
          {comments?.length === 0 && (
            <Typography variant="body2" color="text.disabled" fontStyle="italic">
              No comments yet.
            </Typography>
          )}
          {comments?.map((comment) => (
            <Box
              key={comment.id}
              sx={{
                px: 1.5,
                py: 1.25,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 0.5 }}>
                <Typography variant="caption" fontWeight={600} color="text.primary" noWrap sx={{ maxWidth: '60%' }}>
                  {comment.authorDisplayName}
                </Typography>
                {comment.createdAt && (
                  <Typography variant="caption" color="text.disabled" sx={{ flexShrink: 0 }}>
                    {formatDateTime(comment.createdAt)}
                  </Typography>
                )}
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {comment.body}
              </Typography>
            </Box>
          ))}
        </Stack>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{ px: 3, pb: 2.5 }}
      >
        <TextField
          label="Add a comment"
          fullWidth
          multiline
          minRows={2}
          maxRows={6}
          {...register('body')}
          error={!!errors.body}
          helperText={errors.body?.message}
          disabled={isPending}
          sx={{ mb: 1 }}
        />

        {postSuccess && (
          <Alert severity="success" variant="outlined" sx={{ mb: 1, fontSize: '0.8rem' }}>
            Comment posted.
          </Alert>
        )}

        {postError && (
          <Alert severity="error" variant="outlined" sx={{ mb: 1, fontSize: '0.8rem' }}>
            Failed to post comment. Please try again.
          </Alert>
        )}

        <Button
          type="submit"
          variant="outlined"
          size="small"
          disabled={isPending}
          startIcon={isPending ? <CircularProgress size={14} color="inherit" /> : undefined}
        >
          {isPending ? 'Posting…' : 'Post'}
        </Button>
      </Box>
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
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <Stack spacing={3} sx={{ px: 3, py: 2.5 }}>

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

          {formattedDue && (
            <DetailRow label="Due Date">
              <Typography variant="body2">{formattedDue}</Typography>
            </DetailRow>
          )}

          <Divider />

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

        <CommentsSection taskId={task.id} />
      </Box>

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
                {TASK_PRIORITIES.map((p) => (
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
  onEditSuccess:   (updated: Task) => void;
  onEditError:     () => void;
  onDeleteSuccess: () => void;
  onDeleteError:   () => void;
}

export default function TaskDetailsDrawer({
  task,
  onClose,
  onEditSuccess,
  onEditError,
  onDeleteSuccess,
  onDeleteError,
}: TaskDetailsDrawerProps) {
  const [isEditing, setIsEditing]       = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

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

  function handleDeleteSuccess() {
    setTaskToDelete(null);
    onClose();
    onDeleteSuccess();
  }

  function handleDeleteError() {
    setTaskToDelete(null);
    onDeleteError();
  }

  const drawerTitle = isEditing ? 'Edit Task' : (task?.title ?? '');

  return (
    <>
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
              onDelete={() => setTaskToDelete(task)}
            />
          )
        )}
      </Drawer>

      <DeleteTaskDialog
        task={taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onSuccess={handleDeleteSuccess}
        onError={handleDeleteError}
      />
    </>
  );
}
