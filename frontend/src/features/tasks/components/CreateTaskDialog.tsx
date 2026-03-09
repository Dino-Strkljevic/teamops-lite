import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateTask } from '../hooks/useCreateTask';
import { TASK_PRIORITIES, PRIORITY_LABEL } from '../../../lib/constants';

const schema = z.object({
  title:       z.string().min(1, 'Title is required').max(255, 'Title must be 255 characters or fewer'),
  description: z.string().optional(),
  priority:    z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  dueDate:     z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open:      boolean;
  projectId: string;
  onClose:   () => void;
  onSuccess: () => void;
  onError:   () => void;
}

export default function CreateTaskDialog({ open, projectId, onClose, onSuccess, onError }: Props) {
  const { mutate, isPending } = useCreateTask(projectId);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title:       '',
      description: '',
      priority:    'MEDIUM',
      dueDate:     '',
    },
  });

  function handleClose() {
    reset();
    onClose();
  }

  function onSubmit(values: FormValues) {
    mutate(
      {
        projectId,
        title:       values.title,
        description: values.description || null,
        priority:    values.priority,
        dueDate:     values.dueDate || null,
      },
      {
        onSuccess: () => {
          reset();
          onSuccess();
        },
        onError: () => {
          onError();
        },
      },
    );
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogTitle>New Task</DialogTitle>

        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 3, overflow: 'visible' }}>
          <TextField
            label="Title"
            required
            autoFocus
            fullWidth
            {...register('title')}
            error={!!errors.title}
            helperText={errors.title?.message}
          />

          <TextField
            label="Description"
            fullWidth
            multiline
            minRows={3}
            {...register('description')}
            error={!!errors.description}
            helperText={errors.description?.message}
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
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isPending}>
            {isPending ? 'Creating…' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
