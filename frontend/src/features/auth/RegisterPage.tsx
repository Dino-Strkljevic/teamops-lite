import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Link as RouterLink } from "react-router-dom";
import { z } from "zod";
import { useRegister } from "./useRegister";

const schema = z.object({
  displayName: z.string().min(1, "Display name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const { mutate, isPending, error, isSuccess } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = (values: FormValues) => mutate(values);

  const serverError = (() => {
    if (!error) return null;
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 409) {
        return "An account with this email already exists.";
      }
      if (error.response?.status === 400) {
        return "Please check your input and try again.";
      }
    }
    return "Something went wrong. Please try again.";
  })();

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

        <Typography variant="subtitle1" mb={3} textAlign="center" color="text.secondary">
          Create your account
        </Typography>

        {isSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Account created! Redirecting to sign in…
          </Alert>
        )}

        {serverError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {serverError}
          </Alert>
        )}

        <TextField
          label="Display Name"
          type="text"
          autoComplete="name"
          autoFocus
          fullWidth
          margin="normal"
          error={!!errors.displayName}
          helperText={errors.displayName?.message}
          {...register("displayName")}
        />

        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          fullWidth
          margin="normal"
          error={!!errors.email}
          helperText={errors.email?.message}
          {...register("email")}
        />

        <TextField
          label="Password"
          type="password"
          autoComplete="new-password"
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
          {isPending ? <CircularProgress size={22} color="inherit" /> : "Create account"}
        </Button>

        <Typography variant="body2" textAlign="center" mt={3} color="text.secondary">
          Already have an account?{" "}
          <Link component={RouterLink} to="/login" underline="hover">
            Sign in
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
