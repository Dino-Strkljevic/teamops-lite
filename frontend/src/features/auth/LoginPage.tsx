import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useLogin } from "./useLogin";
import axios from "axios";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const { mutate, isPending, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = (values: FormValues) => mutate(values);

  const serverError =
    error != null
      ? axios.isAxiosError(error) && error.response?.status === 401
        ? "Invalid email or password."
        : "Something went wrong. Please try again."
      : null;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "grey.100",
      }}
    >
      <Paper
        elevation={3}
        sx={{ p: 4, width: "100%", maxWidth: 400 }}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <Typography variant="h5" fontWeight={600} mb={3} textAlign="center">
          TeamOps Lite
        </Typography>

        {serverError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {serverError}
          </Alert>
        )}

        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          autoFocus
          fullWidth
          margin="normal"
          error={!!errors.email}
          helperText={errors.email?.message}
          {...register("email")}
        />

        <TextField
          label="Password"
          type="password"
          autoComplete="current-password"
          fullWidth
          margin="normal"
          error={!!errors.password}
          helperText={errors.password?.message}
          {...register("password")}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={isPending}
          sx={{ mt: 3 }}
        >
          {isPending ? <CircularProgress size={22} color="inherit" /> : "Sign in"}
        </Button>
      </Paper>
    </Box>
  );
}
