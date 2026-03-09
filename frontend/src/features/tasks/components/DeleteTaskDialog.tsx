import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useDeleteTask } from "../hooks/useDeleteTask";
import type { Task } from "../types";

interface Props {
  task: Task | null; // null  →  dialog closed
  onClose: () => void;
  onSuccess: () => void;
  onError: () => void;
}

export default function DeleteTaskDialog({
  task,
  onClose,
  onSuccess,
  onError,
}: Props) {
  const { mutate, isPending } = useDeleteTask();

  function handleDelete() {
    if (!task) return;

    mutate(
      { taskId: task.id, projectId: task.projectId },
      {
        onSuccess: () => {
          onClose();
          onSuccess();
        },
        onError: () => {
          onClose();
          onError();
        },
      },
    );
  }

  return (
    <Dialog
      open={task !== null}
      onClose={isPending ? undefined : onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>Delete task?</DialogTitle>

      <DialogContent>
        <DialogContentText>This action cannot be undone.</DialogContentText>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button onClick={onClose} disabled={isPending} sx={{ mr: "auto" }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          disabled={isPending}
          startIcon={
            isPending ? (
              <CircularProgress size={16} color="inherit" />
            ) : undefined
          }
          onClick={handleDelete}
        >
          {isPending ? "Deleting…" : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
