import {
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import type { Task, TaskPriority, TaskStatus } from '../types';

// ── Label / colour maps ────────────────────────────────────────────────────────

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

// ── Helper ─────────────────────────────────────────────────────────────────────

function formatDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso; // fallback: show raw string
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

// ── Sub-component: a labelled detail row ───────────────────────────────────────

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

// ── Main component ─────────────────────────────────────────────────────────────

const DRAWER_WIDTH = 380;

interface Props {
  task:    Task | null;
  onClose: () => void;
  onEdit:  () => void;
  onDelete: () => void;
}

export default function TaskDetailsDrawer({ task, onClose, onEdit, onDelete }: Props) {
  const open = task !== null;

  const formattedDue       = formatDate(task?.dueDate);
  const formattedCreatedAt = formatDateTime(task?.createdAt);
  const formattedUpdatedAt = formatDateTime(task?.updatedAt);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width:   { xs: '100vw', sm: DRAWER_WIDTH },
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* ── Header ── */}
      <Box
        sx={{
          display:        'flex',
          alignItems:     'flex-start',
          justifyContent: 'space-between',
          px: 3,
          pt: 2.5,
          pb: 1.5,
        }}
      >
        <Typography variant="h6" fontWeight={700} sx={{ pr: 1, lineHeight: 1.4 }}>
          {task?.title ?? ''}
        </Typography>

        <Tooltip title="Close">
          <IconButton onClick={onClose} size="small" sx={{ flexShrink: 0, mt: 0.25 }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Divider />

      {/* ── Body (scrollable) ── */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 2.5 }}>
        <Stack spacing={3}>

          {/* Status + Priority side-by-side */}
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {task && (
              <>
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
              </>
            )}
          </Box>

          {/* Description */}
          <DetailRow label="Description">
            {task?.description ? (
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

      {/* ── Footer actions ── */}
      <Divider />
      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          px: 3,
          py: 2,
        }}
      >
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
    </Drawer>
  );
}
