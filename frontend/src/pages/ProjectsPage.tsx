import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Snackbar,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { useProjects } from "../features/projects/hooks/useProjects";
import CreateProjectDialog from "../features/projects/components/CreateProjectDialog";

type SnackbarState = { open: boolean; severity: "success" | "error"; message: string };

const CLOSED_SNACKBAR: SnackbarState = { open: false, severity: "success", message: "" };

export default function ProjectsPage() {
  const { data: projects, isLoading, isError } = useProjects();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>(CLOSED_SNACKBAR);
  const navigate = useNavigate();

  function handleSuccess() {
    setDialogOpen(false);
    setSnackbar({ open: true, severity: "success", message: "Project created." });
  }

  function handleError() {
    setSnackbar({ open: true, severity: "error", message: "Failed to create project. Please try again." });
  }

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5">Projects</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
        >
          New Project
        </Button>
      </Box>

      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {isError && (
        <Alert severity="error">Failed to load projects.</Alert>
      )}

      {!isLoading && !isError && projects?.length === 0 && (
        <Typography color="text.secondary">No projects yet.</Typography>
      )}

      {projects && projects.length > 0 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {projects.map((project) => (
            <Card key={project.id} variant="outlined">
              <CardActionArea onClick={() => navigate(`/projects/${project.id}`)}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {project.name}
                  </Typography>
                  {project.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {project.description}
                    </Typography>
                  )}
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      )}

      <CreateProjectDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSuccess={handleSuccess}
        onError={handleError}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(CLOSED_SNACKBAR)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
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
