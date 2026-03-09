import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateProject } from "../hooks/useCreateProject";

const schema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(150, "Name must be 150 characters or fewer"),
  description: z.string().max(1000).optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onError: () => void;
}

export default function CreateProjectDialog({
  open,
  onClose,
  onSuccess,
  onError,
}: Props) {
  const { mutate, isPending } = useCreateProject();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", description: "" },
  });

  function handleClose() {
    reset();
    onClose();
  }

  function onSubmit(values: FormValues) {
    mutate(
      {
        name: values.name,
        description: values.description ?? null,
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
        <DialogTitle>New Project</DialogTitle>

        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            pt: 3,
            overflow: "visible",
          }}
        >
          <TextField
            label="Name"
            required
            autoFocus
            fullWidth
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            minRows={3}
            {...register("description")}
            error={!!errors.description}
            helperText={errors.description?.message}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isPending}>
            {isPending ? "Creating…" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
